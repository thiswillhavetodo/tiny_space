var tileHolderArray;
var borderMarkersArray;
var descriptionText;
var coOrdText;
var ownedText;
var claimButton;
var claimButtonText;
var selected = null;

var mainScene = new Phaser.Scene('main');

mainScene.create = function() {
    tileHolderArray = [];
    borderMarkersArray = [];
    var tileTypesArray = this.generateTileTypes();
    
    for (var i=0; i<11; i++) {
        for (var j=0; j<11; j++) {
            var type = tileTypesArray[(i*11)+j];
            this.createTiles(60+(j*48), 60+(i*48), j, i, type);
        }
    }
    
    console.log(tileHolderArray);
    
    this.createBorderMarkers();
    
    this.add.text(600, 50, 'Description', { fontSize: '28px', fill: '#000' }).setFontFamily('Verdana');
    descriptionText = this.add.text(600, 100, '', { fontSize: '24px', fill: '#000' }).setFontFamily('Verdana');
    this.add.text(600, 150, 'Co-Ordinates', { fontSize: '28px', fill: '#000' }).setFontFamily('Verdana');
    coOrdText = this.add.text(600, 200, '', { fontSize: '24px', fill: '#000' }).setFontFamily('Verdana');
    this.add.text(600, 250, 'Owned By', { fontSize: '28px', fill: '#000' }).setFontFamily('Verdana');
    ownedText = this.add.text(600, 300, '', { fontSize: '24px', fill: '#000' }).setFontFamily('Verdana');
    claimButton = this.add.sprite(690, 375, 'buttonLong').setInteractive( { useHandCursor: true  } );
    claimButton.on('pointerdown', this.claimTile); 
    claimButtonText = this.add.text(695, 370, "Claim", { fontSize: '38px', fill: '#fff' }).setFontStyle('bold italic').setFontFamily('Arial').setPadding({ right: 16 }).setOrigin(0.5);
    claimButton.visible = false;
    claimButtonText.visible = false;
};

mainScene.generateTileTypes = function() {
    var tileTypes1 = ['Empty Space', 'Empty Space', 'Metal Asteroid', 'Ice Asteroid'];
    var tileTypes2 = [ 'Terrestrial Planet', 'Gas Planet', 'Barren Planet']; 
    var tileTypes3 = [ 'Pirate Base', 'Ancient Alien Tech', 'Derelict Ship', 'Abandoned Research Lab']; 
    var tileTypesArray = [];
    for (var i=0; i<80; i++) {
        var choice = tileTypes1[Math.floor(Math.random()*tileTypes1.length)];
        tileTypesArray.push(choice);
    }
    for (var i=0; i<30; i++) {
        choice = tileTypes2[Math.floor(Math.random()*tileTypes2.length)];
        tileTypesArray.push(choice);
    }
    for (var i=0; i<15; i++) {
        choice = tileTypes3[Math.floor(Math.random()*tileTypes3.length)];
        tileTypesArray.push(choice);
    }
    this.shuffle(tileTypesArray);
    console.log(tileTypesArray);
    return tileTypesArray;
};

mainScene.createTiles = function(x, y, xCord, yCord, type) {
    var frame = Math.floor(Math.random()*4);
    var tile = this.add.image(x, y, 'starBackground').setInteractive({ useHandCursor: true });
    tile.setFrame(frame);
    tile.on('pointerover', function(){ tile.setScale(1.05) });
	tile.on('pointerout', function(){ tile.setScale(1) });
	var that = this;
	tile.on('pointerdown', function(){ that.tileInfo(tile); });
	tile.xCord = xCord;
	tile.yCord = yCord;
	tile.ownedBy = 'none';
	tile.type = type;
	tile.number = (yCord*11)+xCord;
	if (tile.number==0||tile.number==10||tile.number==60||tile.number==110||tile.number==120) {
	    tile.type = 'Terrestrial Planet';
	}
	if (tile.number==60) {
	    tile.ownedBy = 'Player';
	}
    tileHolderArray.push(tile);
};

mainScene.createBorderMarkers = function() {
    for (var i=0; i<11; i++) {
        for (var j=0; j<11; j++) {
            var border = this.add.image(60+(j*48), 60+(i*48), 'colouredTiledBorders');
            border.visible = false;
            borderMarkersArray.push(border);
        }
    }
    this.updateBorderMarkers();
};

mainScene.tileInfo = function(tile) {
    descriptionText.text = (tile.type).toString();
    coOrdText.text = tile.xCord + ', ' + tile.yCord;
    ownedText.text = tile.ownedBy;
    selected = tile.number;
    var claimable = this.checkClaimable(tile);
    if (claimable) {
        claimButton.visible = true;
        claimButtonText.visible = true;
    }
    else {
        claimButton.visible = false;
        claimButtonText.visible = false;
    }
};

mainScene.checkClaimable = function(tile) {
    var claimableArray = [tile.number-1, tile.number+1, tile.number-11, tile.number+11];
    for (var i=0; i<claimableArray.length; i++) {
        if (tile.ownedBy!='Player'&&tileHolderArray[claimableArray[i]]!=undefined&&tileHolderArray[claimableArray[i]].ownedBy=='Player') {
            return true;
        }
    }
    return false;
};

mainScene.claimTile = function() {
    var tile = tileHolderArray[selected];
    tile.ownedBy = 'Player';
    mainScene.tileInfo(tile);
    mainScene.updateBorderMarkers();
};

mainScene.updateBorderMarkers = function() {
    for (var i=0; i<borderMarkersArray.length; i++) {
        if (tileHolderArray[i].ownedBy!='none') {
            borderMarkersArray[i].visible = true;
            switch (tileHolderArray[i].ownedBy) {
                case 'Player':
                    borderMarkersArray[i].setFrame(1);
                    break;
            }
        }
    }
};

mainScene.shuffle = function(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
};