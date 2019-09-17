var tileHolderArray;
var borderMarkersArray;
var descriptionText;
var coOrdText;
var resourcesText;
var ownedText;
var energyText;
var researchText;
var waterText;
var metalText;
var claimButton;
var claimButtonText;
var upgradeButton;
var upgradeButtonText;
var selected = null;
var energy = 100;
var research = 0;
var water = 0;
var metal = 0;
var population = 10;
var energyPerTurn = 0;
var researchPerTurn = 0;
var waterPerTurn = 0;
var metalPerTurn = 0;
var claimCost = 25;
var popGrowthCost = 100;
var turns = 0;
var turnsText;
var endTurnButton;

var mainScene = new Phaser.Scene('main');

mainScene.create = function() {
    tileHolderArray = [];
    borderMarkersArray = [];
    var tileTypesArray = this.generateTileTypes();
    //creates tiles
    for (var i=0; i<11; i++) {
        for (var j=0; j<11; j++) {
            var type = tileTypesArray[(i*11)+j];
            this.createTiles(60+(j*48), 60+(i*48), j, i, type);
        }
    }
    
    console.log(tileHolderArray);
    
    this.createBorderMarkers();
    //creates UI
	turnsText = this.add.text(845, 5, 'Turn '+turns, { fontSize: '20px', fill: '#000' }).setFontFamily('Verdana').setOrigin(1, 0);
    this.add.text(590, 30, 'Tile Info:', { fontSize: '24px', fill: '#000' }).setFontFamily('Verdana');
	this.add.text(590, 70, 'Type:', { fontSize: '20px', fill: '#000' }).setFontFamily('Verdana');
    descriptionText = this.add.text(650, 70, '', { fontSize: '20px', fill: '#000' }).setFontFamily('Verdana');
    this.add.text(590, 110, 'Co-Ordinates:', { fontSize: '20px', fill: '#000' }).setFontFamily('Verdana');
    coOrdText = this.add.text(750, 110, '', { fontSize: '20px', fill: '#000' }).setFontFamily('Verdana');
	this.add.text(590, 150, 'Resources:', { fontSize: '20px', fill: '#000' }).setFontFamily('Verdana');
    resourcesText = this.add.text(590, 180, '', { fontSize: '18px', fill: '#000' }).setFontFamily('Verdana');
    this.add.text(590, 230, 'Owner:', { fontSize: '20px', fill: '#000' }).setFontFamily('Verdana');
    ownedText = this.add.text(680, 230, '', { fontSize: '20px', fill: '#000' }).setFontFamily('Verdana');
	this.add.text(590, 275, 'Player Info:', { fontSize: '24px', fill: '#000' }).setFontFamily('Verdana');
	popText = this.add.text(590, 320, "Population: "+population+" billion", { fontSize: '20px', fill: '#000' }).setFontFamily('Verdana');
	energyText = this.add.text(590, 345, "Energy: "+energy, { fontSize: '20px', fill: '#000' }).setFontFamily('Verdana');
	researchText = this.add.text(590, 370, "Research: "+research, { fontSize: '20px', fill: '#000' }).setFontFamily('Verdana');
	waterText = this.add.text(590, 395, "Water: "+water, { fontSize: '20px', fill: '#000' }).setFontFamily('Verdana');
	metalText = this.add.text(590, 420, "Metal: "+metal, { fontSize: '20px', fill: '#000' }).setFontFamily('Verdana');
    claimButton = this.add.sprite(715, 500, 'button').setInteractive( { useHandCursor: true  } );
    claimButton.on('pointerdown', this.claimTile); 
    claimButtonText = this.add.text(715, 500, "Claim", { fontSize: '38px', fill: '#fff' }).setFontStyle('bold italic').setFontFamily('Arial').setOrigin(0.5);
    claimButton.visible = false;
    claimButtonText.visible = false;
	
	upgradeButton = this.add.sprite(715, 500, 'button').setInteractive( { useHandCursor: true  } );
    upgradeButton.on('pointerdown', mainScene.showTileUpgrades); 
   	upgradeButtonText = this.add.text(715, 500, "Upgrade", { fontSize: '38px', fill: '#fff' }).setFontStyle('bold italic').setFontFamily('Arial').setOrigin(0.5);
    upgradeButton.visible = false;
    upgradeButtonText.visible = false;
	
	endTurnButton = this.add.sprite(715, 565, 'button').setInteractive( { useHandCursor: true  } );
    endTurnButton.on('pointerdown', this.updateTurn); 
    this.add.text(715, 565, "End Turn", { fontSize: '38px', fill: '#fff' }).setFontStyle('bold italic').setFontFamily('Arial').setOrigin(0.5);
};

mainScene.updateTurn = function() {
	//on easy mode will update via button click, on normal and hard will use timer
	turns++;
	mainScene.updateGainsPerTurn();
	energy+=Math.round(energyPerTurn*(population/10));
	research+=Math.round(researchPerTurn*(population/10));
	water+=Math.round(waterPerTurn*(population/10));
	metal+=Math.round(metalPerTurn*(population/10));
	if (water>=popGrowthCost) {
		population++;
		water-=popGrowthCost;
		popGrowthCost++;
	}
	turnsText.text = 'Turn '+turns;
	popText.text = "Population: "+population+" billion";
	energyText.text = "Energy: "+energy;
	researchText.text = "Research: "+research;
	waterText.text = "Water: "+water;
	metalText.text = "Metal: "+metal;
};

mainScene.updateGainsPerTurn = function() {
	energyPerTurn = 0;
	researchPerTurn = 0;
	waterPerTurn = 0;
	metalPerTurn = 0;
	for (var i = 0; i<tileHolderArray.length; i++) {
		if (tileHolderArray[i].ownedBy=='Player') {
			energyPerTurn+=tileHolderArray[i].energy;
			researchPerTurn+=tileHolderArray[i].research;
			waterPerTurn+=tileHolderArray[i].water;
			metalPerTurn+=tileHolderArray[i].metal;
		}	
	}
};

mainScene.generateTileTypes = function() {
    var tileTypes1 = ['Empty Space', 'Empty Space', 'Metal Asteroid', 'Ice Asteroid'];
    var tileTypes2 = [ 'Terrestrial World', 'Gas Giant', 'Barren World']; 
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
    tile.on('pointerover', function(){ tile.setScale(1.05); });
	tile.on('pointerout', function(){ tile.setScale(1); });
	var that = this;
	tile.on('pointerdown', function(){ that.tileInfo(tile); });
	tile.xCord = xCord;
	tile.yCord = yCord;
	tile.ownedBy = 'none';
	tile.type = type;
	tile.number = (yCord*11)+xCord;
	if (tile.number==0||tile.number==10||tile.number==60||tile.number==110||tile.number==120) {
	    tile.type = 'Terrestrial World';
		if (tile.number==60) {
			tile.ownedBy = 'Player';
		}
		if (tile.number==0) {
			tile.ownedBy = 'aiTopLeft';
		}
		if (tile.number==10) {
			tile.ownedBy = 'aiTopRight';
		}
		if (tile.number==110) {
			tile.ownedBy = 'aiBottomLeft';
		}
		if (tile.number==120) {
			tile.ownedBy = 'aiBottomRight';
		}
	}
	tile.upgradeLevel = 0;
	tile.upgradeCost = 10;
	
	switch (tile.type) {
		case 'Empty Space' :
			tile.energy = 1;
			tile.research = 1;
			tile.water = 0;
			tile.metal = 0;
			break;
		case 'Metal Asteroid':
			tile.energy = 0;
			tile.research = 1;
			tile.water = 0;
			tile.metal = 3;
			break;
		case 'Ice Asteroid':
			tile.energy = 0;
			tile.research = 1;
			tile.water = 3;
			tile.metal = 0;
			break;
		case 'Terrestrial World':
			tile.energy = 2;
			tile.research = 3;
			tile.water = 2;
			tile.metal = 2;
			break;
		case 'Gas Giant':
			tile.energy = 2;
			tile.research = 2;
			tile.water = 1;
			tile.metal = 0;
			break;
		case 'Barren World':
			tile.energy = 1;
			tile.research = 1;
			tile.water = 1;
			tile.metal = 2;
			break;
		case 'Pirate Base':
			tile.energy = 2;
			tile.research = 2;
			tile.water = 2;
			tile.metal = 2;
			break;
		case 'Ancient Alien Tech':
			tile.energy = 2;
			tile.research = 5;
			tile.water = 1;
			tile.metal = 2;
			break;
		case 'Derelict Ship':
			tile.energy = 1;
			tile.research = 2;
			tile.water = 0;
			tile.metal = 2;
			break;
		case 'Abandoned Research Lab':
			tile.energy = 1;
			tile.research = 4;
			tile.water = 1;
			tile.metal = 0;
			break;
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
	console.log(tile);
    descriptionText.text = (tile.type).toString();
    coOrdText.text = tile.xCord + ', ' + tile.yCord;
	resourcesText.text = 'Energy: '+tile.energy+'	Research: '+tile.research+'\nWater: '+tile.water+'	Metal: '+tile.metal;
    ownedText.text = tile.ownedBy;
    selected = tile.number;
	console.log(selected);
    var claimable = this.checkClaimable(tile);
    if (claimable) {
        claimButton.visible = true;
        claimButtonText.visible = true;
		upgradeButton.visible = false;
        upgradeButtonText.visible = false;
    }
	else if (tile.ownedBy=='Player') {
        upgradeButton.visible = true;
        upgradeButtonText.visible = true;
    }
    else {
        claimButton.visible = false;
        claimButtonText.visible = false;
		upgradeButton.visible = false;
        upgradeButtonText.visible = false;
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
	if (energy>=claimCost) {
		energy-=claimCost;
		energyText.text = "Energy: "+energy;
		claimCost++;
		tile.ownedBy = 'Player';
		mainScene.tileInfo(tile);
		mainScene.updateBorderMarkers();
	}
};

mainScene.showTileUpgrades = function() {
	var tile = tileHolderArray[selected];
	var option1, option2, bonus1, bonus2;
	upgradeButton.visible = false;
    upgradeButtonText.visible = false;	
	if (metal<tile.upgradeCost) {
		
	}
	else if (tile.upgradeLevel>0) {

	}
	else {
		switch (tile.type) {
			case 'Empty Space' :
				//options solar array: +2e or space telescope: +2r
				option1 = 'Solar Array';
				bonus1 = '+2e';
				option2 = 'Space Telescope';
				bonus2 = '+2r';
				break;
			case 'Metal Asteroid':
				//options factory: +2m or asteroid hab: +1e +1r
				option1 = 'Factory';
				bonus1 = '+2m';
				option2 = 'Asteroid Hab';
				bonus2 = '+1e +1r';
				break;
			case 'Ice Asteroid':
				//options purifier: +2w or rare metal processor: +1m +1r
				option1 = 'Purifier';
				bonus1 = '+2w';
				option2 = 'Rare Metal Extractor';
				bonus2 = '+1m +1r';
				break;
			case 'Terrestrial World':
				//options arcology: +2e +1r or industrial zone: +1m +1e +1w
				option1 = 'Arcology';
				bonus1 = '+2e +1r';
				option2 = 'Industrial Zone';
				bonus2 = '+1m +1e +1w';
				break;
			case 'Gas Giant':
				//options orbital hab: +2e +1w or research station: +3r
				option1 = 'Orbital Hab';
				bonus1 = '+2e +1w';
				option2 = 'Research Station';
				bonus2 = '+3r';
				break;
			case 'Barren World':
				//options strip mine: +2m +1e or terraform project: +1r +1w +1e
				option1 = 'Strip Mine';
				bonus1 = '+2m +1e';
				option2 = 'Terraform Project';
				bonus2 = '+1r +1w +1e';
				break;
			case 'Pirate Base':
				//options star fortress: +2e +2m or trade hub: +1r +1w +1e +1m
				option1 = 'Star Fortress';
				bonus1 = '+2e +2m';
				option2 = 'Trade Hub';
				bonus2 = '+1r +1w +1e +1m';
				break;
			case 'Ancient Alien Tech':
				//options alien research hub: +2e +3r or alien engineering hub: +1r +1w +1e +2m
				option1 = 'Alien Research Hub';
				bonus1 = '+2e +3r';
				option2 = 'Alien Engineering Hub';
				bonus2 = '+1r +1w +1e +2m';
				break;
			case 'Derelict Ship':
				//options free hab: +1e +1w or trade station: +2m
				option1 = 'Free Hab';
				bonus1 = '+1e +1w';
				option2 = 'Trade Station';
				bonus2 = '+2m';
				break;
			case 'Abandoned Research Lab':
				//options research lab: +2r or local hub: +1e +1w
				option1 = 'Research Lab';
				bonus1 = '+2r';
				option2 = 'Local Hub';
				bonus2 = '+1e +1w';
				break;	
		}
		var upgradeButton1 = mainScene.add.sprite(425, 400, 'button').setInteractive( { useHandCursor: true  } );
		var upgradeButton1Text = mainScene.add.text(425, 390, option1, { fontSize: '30px', fill: '#fff' }).setFontStyle('bold italic').setFontFamily('Arial').setOrigin(0.5);
		var upgradeButton1Text2 = mainScene.add.text(425, 410, bonus1, { fontSize: '20px', fill: '#fff' }).setFontStyle('bold italic').setFontFamily('Arial').setOrigin(0.5);   

		var upgradeButton2 = mainScene.add.sprite(425, 500, 'button').setInteractive( { useHandCursor: true  } );
		var upgradeButton2Text = mainScene.add.text(425, 490, option2, { fontSize: '30px', fill: '#fff' }).setFontStyle('bold italic').setFontFamily('Arial').setOrigin(0.5);
		var upgradeButton2Text2 = mainScene.add.text(425, 510, bonus2, { fontSize: '20px', fill: '#fff' }).setFontStyle('bold italic').setFontFamily('Arial').setOrigin(0.5);

		upgradeButton1.on('pointerdown', function() { 
			upgradeButton1.destroy(); upgradeButton1Text.destroy(); upgradeButton1Text2.destroy(); upgradeButton2.destroy(); upgradeButton2Text.destroy(); upgradeButton2Text2.destroy(); mainScene.upgradeTile(1);
		}); 
		upgradeButton2.on('pointerdown', function() { 
			upgradeButton1.destroy(); upgradeButton1Text.destroy(); upgradeButton1Text2.destroy(); upgradeButton2.destroy(); upgradeButton2Text.destroy(); upgradeButton2Text2.destroy(); mainScene.upgradeTile(2);
		}); 		
   	
	}
};

mainScene.upgradeTile = function(option) {
	var tile = tileHolderArray[selected];
	metal-=tile.upgradeCost;
	metalText.text = "Metal: "+metal;
	tile.upgradeLevel++;
	tile.upgradeCost = 25;
	switch (tile.type) {
		case 'Empty Space' :
			//options solar array: +2e or space telescope: +2r
			if (option==1) {
				tile.type = 'Solar Array';
				tile.energy+=2;
			}
			else if (option==2) {
				tile.type = 'Space Telescope';
				tile.research+=2;
			}
			break;
		case 'Metal Asteroid':
			//options factory: +2m or asteroid hab: +1e +1r
			if (option==1) {
				tile.type = 'Factory';
				tile.metal+=2;
			}
			else if (option==2) {
				tile.type = 'Asteroid Hab';
				tile.energy+=1;
				tile.research+=1;
			}
			break;
		case 'Ice Asteroid':
			//options factory: +2w or rare metal processor: +1m +1r
			if (option==1) {
				tile.type = 'Purifier';
				tile.water+=2;
			}
			else if (option==2) {
				tile.type = 'Rare Metal Extractor';
				tile.metal+=1;
				tile.research+=1;
			}
			break;
		case 'Terrestrial World':
			//options arcology: +2e +1r or industrial zone: +1m +1e +1w
			if (option==1) {
				tile.type = 'Arcology';
				tile.energy+=2;
				tile.research+=1;
			}
			else if (option==2) {
				tile.type = 'Industrial Zone';
				tile.metal+=1;
				tile.energy+=1;
				tile.water+=1;
			}
			break;
		case 'Gas Giant':
			//options orbital hab: +2e +1w or research station: +3r
			if (option==1) {
				tile.type = 'Orbital Hab';
				tile.energy+=2;
				tile.water+=1;
			}
			else if (option==2) {
				tile.type = 'Research Station';
				tile.research+=3;
			}
			break;
		case 'Barren World':
			//options strip mine: +2m +1e or terraform project: +1r +1w +1e
			if (option==1) {
				tile.type = 'Strip Mine';
				tile.metal+=2;
				tile.energy+=1;
			}
			else if (option==2) {
				tile.type = 'Terraform Project';
				tile.research+=1;
				tile.water+=1;
				tile.energy+=1;
			}
			break;
		case 'Pirate Base':
			//options star fortress: +2e +2m or trade hub: +1r +1w +1e +1m
			if (option==1) {
				tile.type = 'Star Fortress';
				tile.energy+=2;
				tile.metal+=2;
			}
			else if (option==2) {
				tile.type = 'Trade Hub';
				tile.research+=1;				
				tile.water+=1;
				tile.energy+=1;
				tile.metal+=1;
			}
			break;
		case 'Ancient Alien Tech':
			//options alien research hub: +2e +3r or alien engineering hub: +1r +1w +1e +2m
			if (option==1) {
				tile.type = 'Alien Research Hub';
				tile.energy+=2;
				tile.research+=3;
			}
			else if (option==2) {
				tile.type = 'Alien Engineering Hub';
				tile.research+=1;				
				tile.water+=1;
				tile.energy+=1;
				tile.metal+=2;
			}
			break;
		case 'Derelict Ship':
			//options free hab: +1e +1w or trade station: +2m
			if (option==1) {
				tile.type = 'Free Hab';
				tile.water+=1;
				tile.energy+=1;
			}
			else if (option==2) {
				tile.type = 'Trade Station';
				tile.metal+=2;
			}
			break;
		case 'Abandoned Research Lab':
			//options research lab: +2r or local hub: +1e +1w
			if (option==1) {
				tile.type = 'Research Lab';
				tile.research+=2;
			}
			else if (option==2) {
				tile.type = 'Local Hub';
				tile.water+=1;
				tile.energy+=1;
			}
			break;	
	}
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