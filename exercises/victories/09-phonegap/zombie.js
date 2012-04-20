window.zombieManager = (function() {
  var zombies       = new Array(),
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
    // Is Geolocation supported?
    var geoHappy = geo_position_js.init();
    $("#got-one").click(function() {
      var now = new Date(),
          how = $("#how-zombie").val();
      
      if (geoHappy) {
        geo_position_js.getCurrentPosition(function(position) {
          zombieManager.addZombie(now, position, how);
        }, function(error) {
          console.log("Geolocation error: " + error.message)
          zombieManager.addZombie(now, null, how);
        });
      } else { // It's also OK to add a zombie w/o location data
        zombieManager.addZombie(now, null, how);
      }
    });
    zombieChair.get('zombies', function(zombiesOnIce) {
      if (zombiesOnIce) {
        zombies = zombiesOnIce.value;
      }
    });
    showZombies(); 
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
  // Refresh/show <ul> of zombies nabbed
  showZombies = function() {
    var $zombielist = $('#zombielist');
    for(var i = 0; i < zombies.length; i++) { // Iterate over known, dead zombies
      var zombieWhen = new Date(zombies[i].when),
          zombieID   = 'zombie-' + zombieWhen.format('mdyhis'); // Using date.format.js
      if (!$("#" + zombieID).length) { // If there isn't already a row for this Zombie ID, create one
        // Prepend the new <li> to the beginning of #zombielist
        $zombielist.prepend(displayZombie(zombies[i], zombieID));
      }
    }
    if (zombies.length && !$('#zombie-reset').length) {
      addResetButton();
    }
    // Refresh the listview for #zombielist because we've (likely)
    // altered the list.
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
    if (zombie.where && zombie.where.coords) { // If there is location information, add it.
      coords = zombie.where.coords;
      $zombieRow.append('<p>Coordinates: ' 
      + coords.latitude + ', ' 
      + coords.longitude + '</p>');
    }
    return $zombieRow;
  },

  addResetButton = function() {
    var $startOver = $('<button>Reset my Zombies</button>').attr('id', 'zombie-reset');
    $('#zombielist').after($startOver);
    // Assign click handler to reset the zombie list
    $('#zombie-reset').button().click(function() {
      resetZombies();
    });  
  },
  
  resetZombies = function() {
    zombies = [];
    zombieChair.nuke();
    $('li.zombie').remove();
    $('#zombielist').listview('refresh');
  };
  
  // Return object literal with two available methods (init and addZombie)
  return {
    init          : init,
    addZombie     : addZombie
  }
}());

$("#nab-zombie").live('pageinit', function() {
  // Initialize our list of zombies
  zombieManager.init();
});