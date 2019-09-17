

// create a new scene named "Game"
var gameScene = new Phaser.Scene('Game');
 
// our game's configuration
var config = {
  type: Phaser.AUTO,  //Phaser will decide how to render our game (WebGL or Canvas)
  width: 850, // game width
  height: 600, // game height
  parent: 'phaser-app',
  pixelArt: true,
  scene: [bootScene, preloadScene, mainScene, gameScene], // our newly created scene
  backgroundColor: '#ccc'
};
 
// create the game, and pass it the configuration
var game = new Phaser.Game(config);

//this.scene.launch("boot");

//Kongregate

var kongregate;
var username;
var isGuest;
try {
  kongregateAPI.loadAPI(function(){
    kongregate = kongregateAPI.getAPI();
    // You can now access the Kongregate API with:
    isGuest = kongregate.services.isGuest();
    if (isGuest) {
        username = 'guest';
    }
    else {
      username = kongregate.services.getUsername();
    }
    // Proceed with loading your game...
    console.log("Username: " + username);
  });
}
catch(err) {
  console.log('kongregate api not found!');
}
//place code below in appropriate place to pass score to kongregate
/*
if (kongregate!=null) {
    kongregate.stats.submit('Score_Table_Name', score_variable); 
}*/