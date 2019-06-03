
var bootScene = new Phaser.Scene('boot');

bootScene.preload = function() {
	this.load.image('rubbleLogoLarge', 'gameassets/images/rubbleLogoLargeBorder.png');
};

bootScene.create = function() {
	//this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	
	this.scene.start("preload");
};