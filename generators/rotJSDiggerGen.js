//REQUIRES ROT.MIN.JS - http://ondras.github.io/rot.js/hp/

var RotJsdiggerGen = pc.createScript('rotJsdiggerGen');
RotJsdiggerGen.attributes.add('width', {
    type: 'number',
    default: 50
});
RotJsdiggerGen.attributes.add('height', {
    type: 'number',
    default: 50
});

// initialize code called once per entity
RotJsdiggerGen.prototype.initialize = function() {
    this.readyForNew = true;
    this.models = [];
    
    this.getTemplates();
};

// update code called every frame
RotJsdiggerGen.prototype.update = function(dt) {
    
};

RotJsdiggerGen.prototype.deleteOldMap = function(){
    for(var i = 0; i < this.models.length; i++){
        this.models[i].destroy();
    }
    this.models = [];
};

RotJsdiggerGen.prototype.createNew = function(){
    if(!this.readyForNew) return;
    
    this.readyForNew = false;
    
    this.map = {};
    this.freeCells = [];
    
    this.generateMap();
};

RotJsdiggerGen.prototype.getTemplates = function() {
    var folder = this.app.root.findByName('RotJS_Digger_Gen');
    this.floorTemplate = folder.findByName('Template_Floor');
};

RotJsdiggerGen.prototype.generateMap = function(){
    var digger = new ROT.Map.Digger(this.width,this.height);
    this.freeCells = [];

    var digCallback = function(x, y, value) {
        if (value) { return; }

        var key = x+","+y;
        this.map[key] = ".";
        this.freeCells.push(key);
    };
    digger.create(digCallback.bind(this));

    this.drawMap();
};

RotJsdiggerGen.prototype.drawMap = function(){
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