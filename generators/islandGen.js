var IslandGen = pc.createScript('islandGen');
IslandGen.attributes.add('width', {
    type: 'number',
    default: 80,
    min: 40
});
IslandGen.attributes.add('height', {
    type: 'number',
    default: 75,
    min: 40
});
IslandGen.attributes.add('randomFillPercent', {
    type: 'number',
    default: 45,
    min: 30,
    max: 75
});

// initialize code called once per entity
IslandGen.prototype.initialize = function() {
    this.getTemplates();
    
    this.readyForNew = true;
    this.models = [];
};

IslandGen.prototype.getTemplates = function() {
    var folder = this.app.root.findByName('Island_Gen');
    this.templates = {
        land: folder.findByName("Template_Land")
    };
};

IslandGen.prototype.deleteOldMap = function(){
    for(var i = 0; i < this.models.length; i++){
        this.models[i].destroy();
    }
    this.models = [];
};

// update code called every frame
IslandGen.prototype.update = function(dt) {
    
};

IslandGen.prototype.createNew = function(){
    if(!this.readyForNew) return;
    
    this.readyForNew = false;
    
    this.generateMap();
    this.drawMap();
};

IslandGen.prototype.generateMap = function(){
    this.map = [];
    for(var i = 0; i < this.width; i++){
        this.map[i] = [];
    }

    this.randomFillMap();

    for (i = 0; i < 5; i ++) {
        this.smoothMap();
    }
};

IslandGen.prototype.randomFillMap = function() {
    for(var x = 0; x < this.width; x++){
        for(var y = 0; y < this.height; y++){
            if (x === 0 || x === this.width-1 || y === 0 || y === this.height -1) {
                this.map[x][y] = 1;
            }    
            else {
                if((Math.random()*100) < this.randomFillPercent){
                    this.map[x][y] = 1;
                }
                else {
                    this.map[x][y] = 0;
                }
            }
        }
    }
};

IslandGen.prototype.smoothMap = function() {
    for(var x = 0; x < this.width; x++){
        for(var y = 0; y < this.height; y++){
            var neighbourWallTiles = this.getSurroundingWallCount(x,y);

            if (neighbourWallTiles > 4){
                this.map[x][y] = 1;
            }
            else if (neighbourWallTiles < 4){
                this.map[x][y] = 0;
            }
        }
    }
};

IslandGen.prototype.getSurroundingWallCount = function(gridX,gridY){
    var wallCount = 0;
    for (var neighbourX = gridX - 1; neighbourX <= gridX + 1; neighbourX ++) {
        for (var neighbourY = gridY - 1; neighbourY <= gridY + 1; neighbourY ++) {
            if (neighbourX >= 0 && neighbourX < this.width && neighbourY >= 0 && neighbourY < this.height) {
                if (neighbourX != gridX || neighbourY != gridY) {
                    wallCount += this.map[neighbourX][neighbourY];
                }
            }
            else {
                wallCount ++;
            }
        }
    }

    return wallCount;
};

IslandGen.prototype.drawMap = function() {
    this.deleteOldMap();
    
    for(var x = 0; x < this.width; x++){
        for(var y = 0; y < this.height; y++){
            if(this.map[x][y] === 0){
                var newEntity = this.templates.land.clone();
                newEntity.setPosition(-this.width/2 + x + 0.5, 0, -this.height/2 + y + 0.5);
                this.models.push(newEntity);
                this.app.root.addChild(newEntity);
            }
        }
    }
    
    this.readyForNew = true;
};