(function() {
  var zombies       = new Array(),
  geoSupported,
  zombieChair       = Lawnchair({name: 'zombies'}, function() {}),
  zombie_icons      = {   // Each killing method has a corresponding icon
    'nukes'         : 'z2.png',
    'conflagration' : 'z5.png',
    'tank'          : 'z7.png',
    'trickery'      : 'z11.png',
    'poison'        : 'z13.png',
    'corrosive'     : 'z8.png',
    'dismemberment' : 'z14.png'
  },
  
  init = function() {
    geoSupported = geo_position_js.init();  // Is Geolocation supported?
    $("#got-one").click(bakeZombie);
    zombieChair.get('zombies', function(zombiesOnIce) {
      if (zombiesOnIce) {
        zombies = zombiesOnIce.value;
      }
    });
    showZombies(); 
  },
  
  bakeZombie = function() {
    var now = new Date(),
        how = $('#how-zombie').val();
        
    if (geoSupported) {
      geo_position_js.getCurrentPosition(function(position) {
        addZombie(now, position, how);
      }, function(error) {
        console.log("Geolocation error: " + error.message)
        addZombie(now, null, how);
      });
    } else { // It's also OK to add a zombie w/o location data
      addZombie(now, null, how);
    }
  },
  
  addZombie = function(zombieWhen, zombieWhere, zombieHow) {
      zombies[zombies.length] = {
        when      : zombieWhen.valueOf(),
        where     : zombieWhere,
        how       : zombieHow
      };
      zombieChair.save({key: 'zombies', value : zombies });
      showZombies();  
  },
  showZombies = function() {  // Refresh/show <ul> of zombies nabbed
    var $zombielist = $('ul#zombielist');
    for(var i = 0; i < zombies.length; i++) { // Iterate over known, dead zombies
      var zombieWhen = new Date(zombies[i].when),
          zombieID   = 'zombie-' + zombieWhen.format('mdyhis'); // Using date.format.js
          
      if (!$("#" + zombieID).length) { // If no <li> with this id exists, create
        $zombielist.prepend(displayZombie(zombies[i], zombieID));
      }
      
    }
    if (zombies.length && !$('#zombie-reset').length) { addResetButton(); }

    $('#zombielist').listview('refresh');
  },
  
  displayZombie = function(zombie, zombieID) { // Create an <li> for the Zombie at hand
    var $zombieImg, coords,
      $zombieRow = $('<li></li>').addClass('zombie').attr('id', zombieID),
      zombieWhen   = new Date(zombie.when);
    if (zombie.how && zombie_icons[zombie.how]) { // Add an icon for how it was done in
      $zombieImg = $("<img>").attr(
        { src :  'icons/' + zombie_icons[zombie.how],
          alt :  'How it died: ' + zombie.how });
      $zombieRow.append($zombieImg);
    }
    $zombieRow.append( 
      '<h3>Zombie Nabbed!</h3><p><strong>' 
      + zombieWhen.format('m/d/y H:i') 
      + '</strong></p>'
    );    
    if (zombie.where) { // If there is location information, add it.
      coords = zombie.where.coords;
      $zombieRow.append('<p>Coordinates: ' 
      + coords.latitude + ', ' 
      + coords.longitude + '</p>');
    }
    return $zombieRow;
  },

  addResetButton = function() {
    var button = '<button>Reset my Zombies</button>';
    var $startOver = $(button).attr('id', 'zombie-reset');
    $('#zombielist').after($startOver); // Add button to page
    // Assign click handler to reset the zombie list
    $('#zombie-reset').button().click(function() { resetZombies(); });  
  },
  
  resetZombies = function() {
    zombies = [];
    zombieChair.nuke();
    $('li.zombie').remove();
    $('#zombielist').listview('refresh');
  };
  
  $('#nab-zombie').live('pageinit', function() {
    init();   // Spin this sucker up
  });
}());