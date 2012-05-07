#!/usr/bin/perl
use FindBin qw($Bin);
use lib "$Bin/../lib";
use Path::Class qw(dir);
use File::Path qw(make_path remove_tree);
use File::Copy;
use File::Find;
use File::stat;
use File::Basename;
use Getopt::Std;

getopts("hfvr:", \%opts);
if ($opts{h}) {
  usage();
}

## Settings for this project
my $pandoc = '/usr/local/bin/pandoc';

# Get absolute path to directory with this script in it
my $dir = dir($Bin);
# Our 'base path' is one level higher... use Path::Class for this
my $basepath = $dir->parent;

$content_path       = $basepath . "/content";
$slide_path         = $basepath . "/presentation";
$src_path           = $basepath . "/assets";
$student_path       = $basepath . "/examples";
$flags              = '--from=markdown --to=slidy --standalone --slide-level=2';
$fieldnotes_flags   = '--from=markdown --to=html5 --standalone --section-divs --toc --css=styles/fieldnotes.css';

## When was the last time a shared/common resource was updated?
my $common_mtime = 0;
my @common_dirs = (
  "$basepath/assets",
  "$content_path/images"
);
# What's the newest mtime on the source HTML?
my $now = time();
find( sub {
  my $mtime = stat($_)->mtime;
  if ($mtime > $common_mtime) {
    $common_mtime = $mtime;
  }
}, @common_dirs);

## Generate outline in slidy and html form
## more later...

sub build_presentation {
  if ($_ =~ /\.content/ && $_ !~ /fieldnotes/) {
    ($base, $dir, $ext) = fileparse($File::Find::name, '\..*'); # Split path into dir, file basename, extension
    my $pageid      = $base; # The page ID
    my $output = $slide_path . '/' . $base . '.html';
    my $test_update = needs_update($_, $output);
    if ($test_update) {
      system("$pandoc $flags --section-divs --css=../assets/styles/workshop.css $_ > $output");
      if ($opts{v}) {
        print "Updated $_ --> $output \n";
      }
    }
    elsif ($opts{v}) {
      print "$_ not updated \n";
    }
  }
}

sub build_fieldnotes {
  my $output = $student_path . "/fieldnotes.html";
  my $content = $content_path . "/fieldnotes.content";
  my $test_update = needs_update($content, $output);
  if ($test_update) {
    system("$pandoc $fieldnotes_flags $content > $output");
    if ($opts{v}) {
      print "Updated Fieldnotes --> $output \n";
    }
  }
  elsif ($opts{v}) {
    print "Fieldnotes not updated \n";
  }
}

sub needs_update {
  my $needs_update    = 0;
  my $content         = $_[0];
  my $output          = $_[1];
  if ($opts{f} || ! -e $output) { # if force-build or output doesn't exist
    $needs_update     = 1;
  }
  else {
    my $content_mtime = stat($content)->mtime;
    my $output_mtime  = stat($output)->mtime;
    # Is output older than the content?
    if ($output_mtime < $content_mtime) {
      if ($opts{v}) {
        print "$output needs update because content is changed \n";
      }
      $needs_update = 1;
    }
    elsif ($output_mtime < $common_mtime) { # Is output older than a change to a common source file?
      if ($opts{v}) {
        print "$output needs update because common file has changed \n";
      }
      $needs_update = 1;
    }
  }
  return ($needs_update);
}


sub usage {
  print  << "EOF";
  
  Usage: $0 [-vf]
  
  -f        : force full site rebuild, even if no recent changes detected
  -v        : verbose output
EOF

    exit;
}

my @dirlist = $content_path;

find(\&build_presentation, @dirlist);

&build_fieldnotes();