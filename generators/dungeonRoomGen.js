var DungeonRoomGen = pc.createScript('dungeonRoomGen');
DungeonRoomGen.attributes.add('map_size', {
    type: 'number',
    default: 64,
    min: 64
});

// initialize code called once per entity
DungeonRoomGen.prototype.initialize = function() {
    this.readyForNew = true;
    this.map = null;
    this.rooms = [];
    this.playerSet = false;
    this.models = [];  
    
    this.getTemplates();   
};

DungeonRoomGen.prototype.createNew = function(){
    if(!this.readyForNew) return;
    
    this.readyForNew = false;
    this.rooms = [];
    this.playerSet = false;
    
    var wallCount = 0;

    while(wallCount < 200){
        wallCount = 0;
        this.generate();
        for (var y = 0; y < this.map_size; y++) {
            for (var x = 0; x < this.map_size; x++) {
                var tile = this.map[x][y];
                if(tile.type == 2){
                    wallCount++;
                }
            }
        }
    }

    this.draw();
};

DungeonRoomGen.prototype.update = function(dt) {
};

DungeonRoomGen.prototype.getTemplates = function() {
    var folder = this.app.root.findByName('Dungeon_Room_Gen');
    this.wallTemplate = folder.findByName('Template_Wall');
    this.floorTemplate = folder.findByName('Template_Floor');
};

DungeonRoomGen.prototype.deleteOldMap = function(){
    for(var i = 0; i < this.models.length; i++){
        this.models[i].destroy();
    }
    this.models = [];
};

DungeonRoomGen.prototype.draw = function() {
    this.deleteOldMap();
    
    for (var y = 0; y < this.map_size; y++) {
        for (var x = 0; x < this.map_size; x++) {
            var tile = this.map[x][y];
            var e = null;

            if(tile.type == 1){
                e = this.floorTemplate.clone(); //Floor
            }

            if(tile.type == 2){
                e = this.wallTemplate.clone(); //Wall
            }

            if(e){
                e.setPosition(x,0,y);
                tile.model = e;
                this.models.push(e);
                this.app.root.addChild(e);
            }
        }
    } 
    
    this.readyForNew = true;
};

DungeonRoomGen.prototype.getRandom = function(low, high){
    return~~ (Math.random() * (high - low)) + low;
};

DungeonRoomGen.prototype.generate = function() {
    this.map = [];
    for (var x = 0; x < this.map_size; x++) {
        this.map[x] = [];
        for (var y = 0; y < this.map_size; y++) {
            this.map[x][y] = {
                type: 0
            };
        }
    }

    var room_count = this.getRandom(10, 20);
    var min_size = 5;
    var max_size = 15;

    for (var i = 0; i < room_count; i++) {
        var room = {};

        room.x = this.getRandom(1, this.map_size - max_size - 1);
        room.y = this.getRandom(1, this.map_size - max_size - 1);
        room.w = this.getRandom(min_size, max_size);
        room.h = this.getRandom(min_size, max_size);

        if (this.doesCollide(room)) {
            i--;
            continue;
        }
        room.w--;
        room.h--;

        this.rooms.push(room);
    }

    this.squashRooms();

    for (i = 0; i < room_count; i++) {
        var roomA = this.rooms[i];
        var roomB = this.findClosestRoom(roomA);

        pointA = {
            x: this.getRandom(roomA.x, roomA.x + roomA.w),
            y: this.getRandom(roomA.y, roomA.y + roomA.h)
        };
        pointB = {
            x: this.getRandom(roomB.x, roomB.x + roomB.w),
            y: this.getRandom(roomB.y, roomB.y + roomB.h)
        };

        while ((pointB.x != pointA.x) || (pointB.y != pointA.y)) {
            if (pointB.x != pointA.x) {
                if (pointB.x > pointA.x) pointB.x--;
                else pointB.x++;
            } else if (pointB.y != pointA.y) {
                if (pointB.y > pointA.y) pointB.y--;
                else pointB.y++;
            }

            this.map[pointB.x][pointB.y].type = 1;
        }
    }

    for (i = 0; i < room_count; i++) {
        var room = this.rooms[i];
        for (var x = room.x; x < room.x + room.w; x++) {
            for (var y = room.y; y < room.y + room.h; y++) {
                this.map[x][y].type = 1;
            }
        }
    }

    for (var x = 0; x < this.map_size; x++) {
        for (var y = 0; y < this.map_size; y++) {
            if (this.map[x][y].type == 1) {
                for (var xx = x - 1; xx <= x + 1; xx++) {
                    for (var yy = y - 1; yy <= y + 1; yy++) {
                        if (this.map[xx][yy].type == 0) this.map[xx][yy].type = 2;
                    }
                }
            }
        }
    }
};

DungeonRoomGen.prototype.findClosestRoom = function(room) {
    var mid = {
        x: room.x + (room.w / 2),
        y: room.y + (room.h / 2)
    };
    var closest = null;
    var closest_distance = 1000;
    for (var i = 0; i < this.rooms.length; i++) {
        var check = this.rooms[i];
        if (check == room) continue;
        var check_mid = {
            x: check.x + (check.w / 2),
            y: check.y + (check.h / 2)
        };
        var distance = Math.min(Math.abs(mid.x - check_mid.x) - (room.w / 2) - (check.w / 2), Math.abs(mid.y - check_mid.y) - (room.h / 2) - (check.h / 2));
        if (distance < closest_distance) {
            closest_distance = distance;
            closest = check;
        }
    }
    return closest;
};

DungeonRoomGen.prototype.squashRooms = function() {
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < this.rooms.length; j++) {
            var room = this.rooms[j];
            while (true) {
                var old_position = {
                    x: room.x,
                    y: room.y
                };
                if (room.x > 1) room.x--;
                if (room.y > 1) room.y--;
                if ((room.x == 1) && (room.y == 1)) break;
                if (this.doesCollide(room, j)) {
                    room.x = old_position.x;
                    room.y = old_position.y;
                    break;
                }
            }
        }
    }
};

DungeonRoomGen.prototype.doesCollide = function(room, ignore) {
    for (var i = 0; i < this.rooms.length; i++) {
        if (i == ignore) continue;
        var check = this.rooms[i];
        if (!((room.x + room.w < check.x) || (room.x > check.x + check.w) || (room.y + room.h < check.y) || (room.y > check.y + check.h))) return true;
    }

    return false;
};




