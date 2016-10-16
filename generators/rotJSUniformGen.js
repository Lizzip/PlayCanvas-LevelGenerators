//REQUIRES ROT.MIN.JS - http://ondras.github.io/rot.js/hp/

var RotJsuniformGen = pc.createScript('rotJsuniformGen');
RotJsuniformGen.attributes.add('width', {
    type: 'number',
    default: 70
});
RotJsuniformGen.attributes.add('height', {
    type: 'number',
    default: 60
});

// initialize code called once per entity
RotJsuniformGen.prototype.initialize = function() {
    this.readyForNew = true;
    this.models = [];
    
    this.getTemplates();
};

// update code called every frame
RotJsuniformGen.prototype.update = function(dt) {
    
};

RotJsuniformGen.prototype.deleteOldMap = function(){
    for(var i = 0; i < this.models.length; i++){
        this.models[i].destroy();
    }
    this.models = [];
};

RotJsuniformGen.prototype.createNew = function(){
    if(!this.readyForNew) return;
    
    this.readyForNew = false;
    
    this.map = {};
    this.freeCells = [];
    
    this.generateMap();
};

RotJsuniformGen.prototype.getTemplates = function() {
    var folder = this.app.root.findByName('RotJS_Uniform_Gen');
    this.floorTemplate = folder.findByName('Template_Floor');
};

RotJsuniformGen.prototype.drawMap = function(){
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

RotJsuniformGen.prototype.generateMap = function(){
    this.map = {};
    this.visible = {};
    this.freeCells = [];

    //Uniform map
    var mapGen = new ROT.Map.Uniform(this.width, this.height,{
        roomWidth: [8,16], 
        roomHeight: [8,16],
        roomDugPercentage: 0.5
    });

    var mapCallback = function(x, y, value) {
        if (value) { return; }

        var key = x+","+y;
        this.map[key] = ",";
        this.freeCells.push(key);
    };

    mapGen.create(mapCallback.bind(this));

    this.drawMap();
};