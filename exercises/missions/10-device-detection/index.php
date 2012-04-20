<?php require_once('zombie-detect.php'); ?>
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <script src="Modernizr-touch.js"></script>
  <link rel="stylesheet" type="text/stylesheet" href="../../field-notes/fieldnotes.css" />
  <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
  
  <script>
    $(document).ready(function() {
      if (window.devicePixelRatio) {
        var $li = $('<li></li>').html('Device Pixel Ratio: ' + window.devicePixelRatio);
        $("#javascript").next('ul').append($li);
      }
    });
  </script>
  
  <style type="text/css">
    .touchdetails { display: none; }
    .touch #details-touch { display: list-item; }
    .no-touch #details-notouch { display: list-item; }
  </style>
  
  <title>Device Detection!</title>
</head>
<body>
<h1><strike>Device</strike> Zombie Detection</h1>

<h2 id="wurfl">Current User Agent/Device/Browser: WURFL</h2>

<ul>
<li><?php print $is_phone_like; ?></li>
<li><?php print $is_touch; ?></li>
</ul>

<h2 id="modernizr">Current Browser: Modernizr</h2>

<ul>
  <li class="touchdetails" id="details-notouch">Does <em>not</em> support touch events</li>
  <li class="touchdetails" id="details-touch"><em>Does</em> support touch events</li>
</ul>

<h2 id="javascript">Current Browser: Other JavaScript Info</h2>

<ul>

</ul>


</body>
</html>