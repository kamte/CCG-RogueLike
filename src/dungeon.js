var notPass = false;

var Dungeon = {
    map: null, //mapa para los tiles: 0=nada, impares=paredes, pares=suelos
    map_size: 150,
    rooms: [],
    generate: function (level_floor, stage) {
        this.rooms = [];  
        this.map = [];

        var floorFirstBoss = 5;
        var floorSecondBoss = 10;
        var floorThirdBoss = 15;

        var floor = Aux.newRandom(1, 14)*2;
        var wall = (Aux.newRandom(0, 9)*2)+1;

        for (var x = 0; x < this.map_size; x++) {
            this.map[x] = [];
            for (var y = 0; y < this.map_size; y++) {
                this.map[x][y] = 0;
            }
        }

        var room_count = Aux.newRandom(8, 11);

        if(level_floor===floorFirstBoss){
            room_count = 4;
            this.createBoss1Room();
        } else  if(level_floor===floorSecondBoss){
            room_count = 5;
            this.createBoss2Room();
        } else if(level_floor===floorThirdBoss){
            room_count = 5;
            this.createBoss3Room();
        } else {
            this.createRandomRooms(room_count);
        }

        //Crea los pasillos
        for (var i = 0; i < room_count-1; i++) {
            var roomA = this.rooms[i];
            var roomB = this.rooms[i+1];
            pointA = {
                x: Aux.newRandom(roomA.x+1, roomA.x + roomA.w-1),
                y: Aux.newRandom(roomA.y+1, roomA.y + roomA.h-1)
            };
            pointB = {
                x: Aux.newRandom(roomB.x+1, roomB.x + roomB.w-1),
                y: Aux.newRandom(roomB.y+1, roomB.y + roomB.h-1)
            };

            while ((pointB.x != pointA.x) || (pointB.y != pointA.y)) {
                if (pointB.x != pointA.x) {
                    if (pointB.x > pointA.x) pointB.x--;
                    else pointB.x++;
                } else if (pointB.y != pointA.y) {
                    if (pointB.y > pointA.y) pointB.y--;
                    else pointB.y++;
                }

                this.map[pointB.x][pointB.y] = floor;
            }
        }
           
        //Pone los tiles de suelo a un número par
        for (var i = 0; i < room_count; i++) {
            var room = this.rooms[i];
            for (var x = room.x; x < room.x + room.w; x++) {
                for (var y = room.y; y < room.y + room.h; y++) {
                    this.map[x][y] = floor;
                }
            }
        }
        //Pone los tiles de pared a un número impar
        for (var x = 0; x < this.map_size; x++) {
            for (var y = 0; y < this.map_size; y++) {
                if (this.map[x][y] == floor) {
                    for (var xx = x - 1; xx <= x + 1; xx++) {
                        for (var yy = y - 1; yy <= y + 1; yy++) {
                            if (this.map[xx][yy] == 0) this.map[xx][yy] = wall;
                        }
                    }
                }
            }
        }

        Q.assets['level_dungeon'] = this.map;

        if(level_floor===floorFirstBoss){
            this.generateBoss1Entities(stage);
            notPass = true;
        } else if(level_floor===floorSecondBoss){
            this.generateBoss2Entities(stage);
            notPass = true;
        } else if(level_floor===floorThirdBoss){
            this.generateBoss3Entities(stage);
            notPass = true;
        } else {
            this.generateRandomEntities(stage);
        }
    },

    createRandomRooms: function(room_count){
        var min_size = 6;
        var max_size = 11;

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
    },

    generateRandomEntities: function(stage){
        stage.insert(new Q.Repeater({ asset: "black.png", speedX: 0.5, speedY: 0.5 }));
        stage.insert(new Q.DungeonTracker({ data: Q.asset('level_dungeon') }));

        stage.insert(this.insertEntity(new Q.Escalera()));
        
        var p = stage.insert(this.insertEntity(new Q.Player()));
    
        //Generar entre x e y objetos
        itemGenerator.spawner(stage, 5, 14);
    
        //Spawn 4 to 6 enemies when a floor is entered
        monsterGenerator.spawner(stage, 8, 16);

        stage.add("viewport").centerOn(150, 368); 
        stage.follow(p, { x: true, y: true });
    },

    generateBoss1Entities: function(stage){
        stage.insert(new Q.Repeater({ asset: "black.png", speedX: 0.5, speedY: 0.5 }));
        stage.insert(new Q.DungeonTracker({ data: Q.asset('level_dungeon') }));
    
        stage.insert(this.insertEntityInRoom(new Q.Escalera(), 3));

        var p = stage.insert(this.insertEntityInRoom(new Q.Player(), 0));
    
        //Generar entre x e y objetos
        itemGenerator.spawner(stage, 2, 4, 1);
    
        //Spawn 4 to 6 enemies when a floor is entered
        monsterGenerator.spawner(stage, 3, 6, 1);

        stage.insert(this.insertEntityInRoom(new Q.EkChuah(), 2));

        stage.add("viewport").centerOn(150, 368); 
        stage.follow(p, { x: true, y: true });
    },

    generateBoss2Entities: function(stage){
        stage.insert(new Q.Repeater({ asset: "black.png", speedX: 0.5, speedY: 0.5 }));
        stage.insert(new Q.DungeonTracker({ data: Q.asset('level_dungeon') }));

        stage.insert(this.insertEntityInRoom(new Q.Escalera(), 4));

        var p = stage.insert(this.insertEntityInRoom(new Q.Player(), 0));
    
        itemGenerator.spawner(stage, 3, 6, 3);

        monsterGenerator.spawner(stage, 2, 4, 2);
        monsterGenerator.spawner(stage, 3, 6, 1);

        stage.insert(this.insertEntityInRoom(new Q.AhPuch(), 3));

        stage.add("viewport").centerOn(150, 368); 
        stage.follow(p, { x: true, y: true });
    },

    generateBoss3Entities: function(stage){
        stage.insert(new Q.Repeater({ asset: "black.png", speedX: 0.5, speedY: 0.5 }));
        stage.insert(new Q.DungeonTracker({ data: Q.asset('level_dungeon') }));
    
        stage.insert(this.insertEntityInRoom(new Q.Escalera(), 4));

        var p = stage.insert(this.insertEntityInRoom(new Q.Player(), 0));
    
        //Generar entre x e y objetos
        itemGenerator.spawner(stage, 2, 4, 2);
    
        //Spawn 4 to 6 enemies when a floor is entered
        monsterGenerator.spawner(stage, 5, 8, 1);

        stage.insert(this.insertEntityInRoom(new Q.Kukulkan(), 3));

        stage.add("viewport").centerOn(150, 368); 
        stage.follow(p, { x: true, y: true });
    },

    createBoss1Room: function(){

        var roomInit = {};
        roomInit.x = 10;
        roomInit.y = 1;
        roomInit.w = 5;
        roomInit.h = 5;

        var roomBats = {};
        roomBats.x = 8;
        roomBats.y = 14;
        roomBats.w = 8;
        roomBats.h = 8;

        var roomBoss = {};
        roomBoss.x = 1;
        roomBoss.y = 25;
        roomBoss.w = 20;
        roomBoss.h = 20;

        var roomStairs = {};
        roomStairs.x = 18;
        roomStairs.y = 52;
        roomStairs.w = 6;
        roomStairs.h = 6;

        this.rooms.push(roomInit);
        this.rooms.push(roomBats);
        this.rooms.push(roomBoss);
        this.rooms.push(roomStairs);
    },

     createBoss2Room: function(){

        var roomInit = {};
        roomInit.x = 5;
        roomInit.y = 5;
        roomInit.w = 6;
        roomInit.h = 4;

        var roomMobs1 = {};
        roomMobs1.x = 33;
        roomMobs1.y = 13;
        roomMobs1.w = 10;
        roomMobs1.h = 7;

        var roomMobs2 = {};
        roomMobs2.x = 20;
        roomMobs2.y = 14;
        roomMobs2.w = 8;
        roomMobs2.h = 8;

        var roomBoss = {};
        roomBoss.x = 25;
        roomBoss.y = 10;
        roomBoss.w = 14;
        roomBoss.h = 14;

        var roomStairs = {};
        roomStairs.x = 20;
        roomStairs.y = 30;
        roomStairs.w = 6;
        roomStairs.h = 6;

        this.rooms.push(roomInit);
        this.rooms.push(roomMobs1);
        this.rooms.push(roomMobs2);
        this.rooms.push(roomBoss);
        this.rooms.push(roomStairs);
    },

    createBoss3Room: function(){

        var roomInit = {};
        roomInit.x = 70;
        roomInit.y = 20;
        roomInit.w = 6;
        roomInit.h = 3;

        var roomMobs = {};
        roomMobs.x = 50;
        roomMobs.y = 19;
        roomMobs.w = 8;
        roomMobs.h = 6;

        var roomItems = {};
        roomItems.x = 30;
        roomItems.y = 20;
        roomItems.w = 6;
        roomItems.h = 8;

        var roomBoss = {};
        roomBoss.x = 1;
        roomBoss.y = 15;
        roomBoss.w = 24;
        roomBoss.h = 10;

        var roomStairs = {};
        roomStairs.x = 1;
        roomStairs.y = 35;
        roomStairs.w = 6;
        roomStairs.h = 6;

        this.rooms.push(roomInit);
        this.rooms.push(roomMobs);
        this.rooms.push(roomItems);
        this.rooms.push(roomBoss);
        this.rooms.push(roomStairs);
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
        for (var i = 0; i < 3; i++) {
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

        var stairs = Q("Escalera").first();

        var columna = Aux.newRandom(r.x+1, r.x+r.w-1);
        var fila = Aux.newRandom(r.y+1, r.y+r.h-1);

        while (Dungeon.map[columna][fila] % 2 !== 0 || Dungeon.map[columna][fila] == 0 || Dungeon.map[columna][fila] == 666) {
            columna = Aux.newRandom(r.x+1, r.x+r.w-1);
            fila = Aux.newRandom(r.y+1, r.y+r.h-1);
            if (fila === toMatrix(stairs.p.x) || columna === toMatrix(stairs.p.y))
                continue;
            console.log("insert");
        }

        entity.p.x=fromMatrix(fila);
        entity.p.y=fromMatrix(columna);  
        return entity;
    },

    insertAwayFromPlayer: function (entity) {
        var distX, distY;
        var px = toMatrix(findPlayer().p.x);
        var py = toMatrix(findPlayer().p.y);
        var minX = 6;
        var minY = 7;
        var i = Aux.newRandom(0, this.rooms.length-1);
        var r = this.rooms[i];

        var columna = Aux.newRandom(r.x+1, r.x+r.w-1);
        var fila = Aux.newRandom(r.y+1, r.y+r.h-1);

        distX = Math.abs(px - fila);
        distY = Math.abs(py - columna);

        while (Dungeon.map[columna][fila] % 2 !== 0 || Dungeon.map[columna][fila] == 0 || distX < minX || distY < minY) {
            i = Aux.newRandom(0, this.rooms.length-1);
            r = this.rooms[i];
            columna = Aux.newRandom(r.x+1, r.x+r.w-1);
            fila = Aux.newRandom(r.y+1, r.y+r.h-1);
            distX = Math.abs(px - fila);
            distY = Math.abs(py - columna);
            console.log("insertAwayPlayer");
        }

        entity.p.x=fromMatrix(fila);
        entity.p.y=fromMatrix(columna);  
        //console.log(Dungeon.map[columna][fila]);
        return entity;
    },

    insertNextToPlayer: function(entity) {
        var p = findPlayer();
        var posibles = [];
        var x = p.p.x; var y = p.p.y;
        var fila=toMatrix(y);
        var columna=toMatrix(x);
        var pos = [];
        var num, dir;

        if(Dungeon.map[fila][columna+1]%2==0 && Dungeon.map[fila][columna+1] !== 666){
            posibles.push('derecha');
        }
        if(Dungeon.map[fila][columna-1]%2==0 && Dungeon.map[fila][columna-1] !== 666){
            posibles.push('izquierda');
        }
        if(Dungeon.map[fila+1][columna]%2==0 && Dungeon.map[fila+1][columna] !== 666){
            posibles.push('abajo');
        }
        if(Dungeon.map[fila-1][columna]%2==0 && Dungeon.map[fila-1][columna] !== 666){
            posibles.push('arriba');
        }
        if (posibles.length > 0) {
            num = Math.floor(Math.random()*(posibles.length));
            dir = posibles[num];

              if(dir == 'derecha'){
                pos[0] = x+32;
                pos[1] = y;
              } else if(dir == 'izquierda') {
                pos[0] = x-32;
                pos[1] = y;
              } else if(dir == 'abajo') {
                pos[0] = x;
                pos[1] = y+32;
              } else if(dir == 'arriba'){
                pos[0] = x;
                pos[1] = y-32;
              }
            entity.p.x = pos[0];
            entity.p.y = pos[1];
            Dungeon.map[toMatrix(pos[1])][toMatrix(pos[0])] = 666;
            return entity;
        }
        else Dungeon.insertEntity(entity);
    },

    insertEntityInRoom: function (entity, room) {
        var i = room%this.rooms.length;
        var r = this.rooms[i];

        var stairs = Q("Escalera").first();


        var columna = Aux.newRandom(r.x+1, r.x+r.w-1);
        var fila = Aux.newRandom(r.y+1, r.y+r.h-1);

        while (Dungeon.map[columna][fila] % 2 !== 0 || Dungeon.map[columna][fila] == 0) {
            columna = Aux.newRandom(r.x+1, r.x+r.w-1);
            fila = Aux.newRandom(r.y+1, r.y+r.h-1);
            if (fila === toMatrix(stairs.p.x) || columna === toMatrix(stairs.p.y))
                continue;
            console.log("insertInRoom");
        }

        entity.p.x=fromMatrix(fila);
        entity.p.y=fromMatrix(columna);  
        // console.log(Dungeon.map[columna][fila]);
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

      if(this.p.num != 0 && this.p.num%2==0){
        this.p.type = Q.SPRITE_NONE;
      } else {
        this.p.type = Q.SPRITE_DEFAULT;
      }
    }
  });
