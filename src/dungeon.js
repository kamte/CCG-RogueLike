var Dungeon = {
    map: null, //mapa para los tiles: 0=nada, impares=paredes, pares=suelos
    pathMap: null, //mapa para colisiones y pathFinder, 0=no obstaculo, 1=obstaculo
    map_size: 52,
    rooms: [],
    generate: function () {
        this.map = [];
        this.pathMap = [];
        for (var x = 0; x < this.map_size; x++) {
            this.map[x] = [];
            this.pathMap[x] = []
            for (var y = 0; y < this.map_size; y++) {
                this.map[x][y] = 0;
                this.pathMap[x][y] = 1;
            }
        }

        var room_count = Aux.newRandom(7, 9);
        var min_size = 6;
        var max_size = 10;

        //Genera las habitaciones
        for (var i = 0; i < room_count; i++) {
            var room = {};

            room.x = Aux.newRandom(1, this.map_size - max_size - 1);
            room.y = Aux.newRandom(1, this.map_size - max_size - 1);
            room.w = Aux.newRandom(min_size, max_size);
            room.h = Aux.newRandom(min_size, max_size);

            if (this.collides(room)) {
                i--;
                continue;
            }
            room.w--;
            room.h--;

            this.rooms.push(room);
        }

        this.joinRooms();

        //Crea los pasillos

        for (i = 0; i < room_count-1; i++) {
            var roomA = this.rooms[i];
            var roomB = this.rooms[i+1];
            pointA = {
                x: Aux.newRandom(roomA.x, roomA.x + roomA.w),
                y: Aux.newRandom(roomA.y, roomA.y + roomA.h)
            };
            pointB = {
                x: Aux.newRandom(roomB.x, roomB.x + roomB.w),
                y: Aux.newRandom(roomB.y, roomB.y + roomB.h)
            };

            while ((pointB.x != pointA.x) || (pointB.y != pointA.y)) {
                if (pointB.x != pointA.x) {
                    if (pointB.x > pointA.x) pointB.x--;
                    else pointB.x++;
                } else if (pointB.y != pointA.y) {
                    if (pointB.y > pointA.y) pointB.y--;
                    else pointB.y++;
                }

                this.map[pointB.x][pointB.y] = 2;
                this.pathMap[pointB.x][pointB.y]=0;
            }
        }
           
        //Pone los tiles de suelo a un número par (2 en este caso)
        for (i = 0; i < room_count; i++) {
            var room = this.rooms[i];
            for (var x = room.x; x < room.x + room.w; x++) {
                for (var y = room.y; y < room.y + room.h; y++) {
                    this.map[x][y] = 2;
                    this.pathMap[x][y] = 0;
                }
            }
        }
        //Pone los tiles de pared a un número par (2 en este caso)
        for (var x = 0; x < this.map_size; x++) {
            for (var y = 0; y < this.map_size; y++) {
                if (this.map[x][y] == 2) {
                    for (var xx = x - 1; xx <= x + 1; xx++) {
                        for (var yy = y - 1; yy <= y + 1; yy++) {
                            if (this.map[xx][yy] == 0) this.map[xx][yy] = 1;
                        }
                    }
                }
            }
        }

        Q.assets['level_dungeon'] = this.map;
    },

    //Encuentra la habitación más cercana a la dada
    closestRoom: function (room) {
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
    },

    //Mueve las habitaciones mas cerca unas de otras
    joinRooms: function () {
        for (var i = 0; i < 2; i++) {
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
                    if (this.collides(room, j)) {
                        room.x = old_position.x;
                        room.y = old_position.y;
                        break;
                    }
                }
            }
        }
    },

    //Comprueba si dos habitaciones colisionan
    collides: function (room, ignore) {
        for (var i = 0; i < this.rooms.length; i++) {
            if (i == ignore) continue;
            var check = this.rooms[i];
            if (!((room.x + room.w < check.x) || (room.x > check.x + check.w) || (room.y + room.h < check.y) || (room.y > check.y + check.h))) return true;
        }

        return false;
    },

    insertEntity: function (entity) {
        var i = Aux.newRandom(0, this.rooms.length-1);
        var r = this.rooms[i];

        var columna = Aux.newRandom(r.x+1, r.x+r.w-1);
        var fila = Aux.newRandom(r.y+1, r.y+r.h-1);

        while (Dungeon.map[columna][fila] != 2) {
            i = Aux.newRandom(0, this.rooms.length-1);
            r = this.rooms[i];

            columna = Aux.newRandom(r.x+1, r.x+r.w-1);
            fila = Aux.newRandom(r.y+1, r.y+r.h-1);
        }
        entity.p.x=fromMatrix(fila);
        entity.p.y=fromMatrix(columna);  
        console.log(Dungeon.map[columna][fila]);
        return entity;
    }
}

var Aux = {
    newRandom: function (low, high) {
        return Math.floor(Math.random()*(high-low+1)+low);
    }
};

Q.Sprite.extend("DungeonTracker",{
    init: function(p) {
      this._super(p, {
        x: 0,
        y: 0
      });

      this.on("inserted",this,"setupBlocks");
    },

    setupBlocks: function() {

      Q._each(this.p.data,function(row,y) {
        Q._each(row,function(block,x) {
          if(block) { 
            this.stage.insert(new Q.DungeonBlock({
              num: block,
              x: 32 * x + 16,
              y: 32 * y + 16
            }), this);
          }

        },this);
      },this);
    },

    step: function(dt) {
      if(this.children.length == 0) {
        this.stage.trigger("complete");
      }
    }
  });

  Q.Sprite.extend("DungeonBlock", {
    init: function(p) {
      this._super({
        sheet: "floor" + p.num,
        sprite: "floor",
      },p);

      if(this.p.num==2){
        this.p.type = Q.SPRITE_NONE;
      } else {
        this.p.type = Q.SPRITE_DEFAULT;
      }
    }
  });
