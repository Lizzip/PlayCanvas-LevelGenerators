//REQUIRES ROT.MIN.JS - http://ondras.github.io/rot.js/hp/

var RotJscellularGen = pc.createScript('rotJscellularGen');
RotJscellularGen.attributes.add('width', {
    type: 'number',
    default: 100
});
RotJscellularGen.attributes.add('height', {
    type: 'number',
    default: 60
});

// initialize code called once per entity
RotJscellularGen.prototype.initialize = function() {
    this.readyForNew = true;
    this.models = [];
    
    this.getTemplates();
};

// update code called every frame
RotJscellularGen.prototype.update = function(dt) {
    
};

RotJscellularGen.prototype.deleteOldMap = function(){
    for(var i = 0; i < this.models.length; i++){
        this.models[i].destroy();
    }
    this.models = [];
};

RotJscellularGen.prototype.createNew = function(){
    if(!this.readyForNew) return;
    
    this.readyForNew = false;
    
    this.map = {};
    this.freeCells = [];
    
    this.generateMap();
};

RotJscellularGen.prototype.getTemplates = function() {
    var folder = this.app.root.findByName('RotJS_Cellular_Gen');
    this.floorTemplate = folder.findByName('Template_Floor');
};

RotJscellularGen.prototype.drawMap = function(){
    this.deleteOldMap();
    
    for(var key in this.map){
        var floor = this.floorTemplate.clone();
        var parts = key.split(",");
        var x = parseInt(parts[0], 10);
        var y = parseInt(parts[1], 10);

        floor.setPosition(x, 0, y);
        this.app.root.addChild(floor);
        this.models.push(floor);
    }
    this.readyForNew = true;
};

RotJscellularGen.prototype.generateMap = function(){
    this.map = {};
    this.visible = {};
    this.freeCells = [];

    //Cellular automata map
    var mapGen =  new ROT.Map.Cellular(this.width, this.height, {
        born: [4, 5, 6, 7, 8],
        survive: [2, 3, 4, 5]
    });
    mapGen.randomize(0.9);

    var mapCallback = function(x, y, value) {
        if (value) { return; }

        var key = x+","+y;
        this.map[key] = ",";
        this.freeCells.push(key);
    };

    for (var i=49; i>=0; i--) {
        if(i === 0){
            mapGen.create(mapCallback.bind(this));
        }
        else {
            mapGen.create();
        }
    }

    this.drawMap();
};