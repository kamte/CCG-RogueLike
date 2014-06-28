//Versión LightWeight del pathfinder
var findNextLW = function(x,y, boss) {
  var next = new Array(2);
  next[0]=x; next[1]=y;

  var posibles = findPosibles(x, y, boss);

  var num = Math.floor(Math.random()*(posibles.length));
  var dir = posibles[num];
  //console.log(num, posibles);
  if(dir == 'derecha'){
    next[0] = x+32;
    next[1] = y;
    //console.log("yendo a la derecha");
  } else if(dir == 'izquierda') {
    next[0] = x-32;
    next[1] = y;
    //console.log("yendo a la izquierda");
  } else if(dir == 'abajo') {
    next[0] = x;
    next[1] = y+32;
    //console.log("yendo hacia abajo");
  } else if(dir == 'arriba'){
    next[0] = x;
    next[1] = y-32;
    //console.log("yendo hacia arriba");
  }
  //console.log("Proxima casilla:", Dungeon.map[toMatrix(next[1])][toMatrix(next[0])]);
  return next;
};

var findPosibles = function(x, y, boss){
  var posibles = [];

  var player = findPlayer();
  var fila=toMatrix(y);
  var columna=toMatrix(x);

  //console.log("bicho", x, y, "/player", player.p.x, player.p.y)

  if(boss == undefined){
    if(Dungeon.map[fila][columna+1] !== 666 && Dungeon.map[fila][columna+1]%2===0 && x < player.p.x){
      posibles.push('derecha');
    }
    if(Dungeon.map[fila][columna-1] !== 666 && Dungeon.map[fila][columna-1]%2===0 && x > player.p.x){
      posibles.push('izquierda');
    }
    if(Dungeon.map[fila+1][columna] !== 666 && Dungeon.map[fila+1][columna]%2===0 && y < player.p.y){
      posibles.push('abajo');
    }
    if(Dungeon.map[fila-1][columna] !== 666 && Dungeon.map[fila-1][columna]%2===0 && y > player.p.y){
      posibles.push('arriba');
    } else;
  }else {
    if(Dungeon.map[fila][columna+1] !== 666 && Dungeon.map[fila][columna+1]%2===0 && x < player.p.x){
      if(Dungeon.map[fila-1][columna+1] !== 666 && Dungeon.map[fila-1][columna+1]%2===0)
        posibles.push('derecha');
    }
    if(Dungeon.map[fila][columna-2] !== 666 && Dungeon.map[fila][columna-2]%2===0 && x > player.p.x){
      if(Dungeon.map[fila-1][columna-2] !== 666 && Dungeon.map[fila-1][columna-2]%2===0)
        posibles.push('izquierda');
    }
    if(Dungeon.map[fila+1][columna] !== 666 && Dungeon.map[fila+1][columna]%2===0 && y < player.p.y){
      if(Dungeon.map[fila+1][columna-1] !== 666 && Dungeon.map[fila+1][columna-1]%2===0)
        posibles.push('abajo');
    }
    if(Dungeon.map[fila-2][columna] !== 666 && Dungeon.map[fila-2][columna]%2===0 && y > player.p.y){
      if(Dungeon.map[fila-2][columna-1] !== 666 && Dungeon.map[fila-2][columna-1]%2===0)
        posibles.push('arriba');
    }
  }
  return posibles;
};

//Jugador
Q.Sprite.extend("Player", {
  init: function(p) {
    this._super(p, {  
      sheet: "standR", 
      sprite: "playerAnim", 
      facing: 'right',
      x: 16+32*2, 
      y: 16+32*2,
      moved:false,
      attacked:false,
    });
    this.add('2d, customControls, animation, turn_component');

    //this.character.live(CharSheet.hitPoints, CharSheet.attack, CharSheet.defense, CharSheet.nextLevel);
    this.turn_component.init_turn(0);

    this.on("end_move", this, function(){
      max = CharSheet.healCap;
      if (!this.p.attacked && Q.state.get("healed") < max && CharSheet.hitPoints < CharSheet.maxHp) {
        toHeal = Math.floor(CharSheet.heal);
        Q.state.inc("healed",toHeal);
        if (Q.state.get("health") + toHeal > CharSheet.maxHp)
          Q.state.set("health",CharSheet.maxHp);
        else
          Q.state.inc("health",toHeal);
        CharSheet.updateHp(CharSheet.hitPoints+toHeal);
      }
      this.p.inTurn=false;
      this.p.moving=false;
      this.p.moved=false;
      this.p.attacked = false;

      setTimeout(function() {
        Q.state.inc("nextMove",1);
      }, 200);
      
    });

    this.on("hit", function(collision) {
      if(collision.obj.p.type === Q.SPRITE_ENEMY && !collision.obj.isA("Thunder")){
        // console.log("ataque");
        collision.obj.hit(this);
      } else {
        // console.log("no enemigo");
      }
    });
  },

  step: function(dt) {

    //Animación de movimiento
    if(!this.dead() && !this.p.moved &&(Q.state.get("nextMove")==this.p.position || Q.state.get("enemies")==0)){
      this.p.inTurn=true;

      if(this.p.facing === 'right'){
        this.gif = "walkR";
      } else {
        this.gif = "walkL";
      } 

      if(this.p.pressed==='left' || this.p.pressed==='right' || this.p.pressed==='down' || this.p.pressed==='up') {
        this.p.moved=true;
        this.play(this.gif);
        //If the player walked around and didnt fight, roll for a possible new spawn:
        if (!this.p.attacked) {
          var n = Aux.newRandom(0,100);
          if (n > 98) {
            console.log("Spawning a new enemy!")
            Q.stage(0).insert(Dungeon.insertAwayFromPlayer(monsterGenerator.spawn()));
          }
        }
      } 

    } else if(this.dead()){
      // console.log("dead "+this.p.hitPoints+" "+this.dead());
      this.destroy();
    } else if(Q.state.get("nextMove")>Q.state.get("enemies")) {
      Q.state.set("nextMove", 0);
    }
  },

  dead: function(){
    if (CharSheet.hitPoints <= 0){
      return true;
    } else {
      return false;
    }
  },

  hit: function(aggressor) {
      var variation = Aux.newRandom(80, 100);
      var reduction = CharSheet.defense > 0 ? CharSheet.defense : 1;
      var damage = Math.ceil(variation * 0.01 * (3 * aggressor.p.attack-(2*reduction)));
      var hitPoints = CharSheet.hitPoints - (damage>0 ? damage : 1);
      console.log("damage",damage);
      CharSheet.updateHp(hitPoints);
      //console.log("COORDENADAS: ",aggressor.p.x, aggressor.p.y);
      // console.log(this.p.x, this.p.y, "vida defensor "+this.p.hitPoints);
    }
});


Q.Sprite.extend("Monster", {
  init: function(props, defaultProps) {
    this._super(Q._extend({  
      x: 16+32*7, 
      y: 16+32*5,  
      moved: false,
      type: Q.SPRITE_ENEMY,
      // sensor: true,
      experience: 10  
    },props), defaultProps);

    this.add('2d, animation, character, turn_component');

    Q.state.inc("enemies", 1);

    this.turn_component.init_turn(Q.state.get("enemies"));
    this.play(this.p.sheet);  
    
    this.on("hit", function(collision) {
      // console.log("collision bola mala: "+collision.obj);
    });
  },

  step: function(dt) {
    if(this.dead()){
      // console.log("dead "+this.p.hitPoints+" "+this.dead());
      Dungeon.map[toMatrix(this.p.y)][toMatrix(this.p.x)] = 2;
      act_turnEnemies(this.p.position);

      this.destroy();

    } else if (Q.state.get("nextMove") == this.p.position && !this.p.moved) {
      this.p.moved = true;
      // console.log("turno bicho!");
      
      Dungeon.map[toMatrix(this.p.y)][toMatrix(this.p.x)] = 2;

      if((this.p.x-16)%32 != 0 || (this.p.y-16)%32 != 0 ){
          this.p.x = fromMatrix(Math.round(toMatrix(this.p.x)));
          this.p.y = fromMatrix(Math.round(toMatrix(this.p.y)));
          // console.log(this.p.x, this.p.y);
        }
      if(nextToPlayer(this.p.x,this.p.y)){
        this.attack();
      } else {
        // console.log(this.p.x, this.p.y);

        if(this.distanceToPlayer() < 15) {
          var nextMove = findNextLW(this.p.x,this.p.y);
          this.p.x = nextMove[0];
          this.p.y = nextMove[1];
        }
        // else console.log("muy lejos, no me muevo");
      }
      
      Dungeon.map[toMatrix(this.p.y)][toMatrix(this.p.x)] = 666;

      this.pass_turn();
      this.p.moved=false;
    }
  },

  attack: function(){
    player = findPlayer();
    player.hit(this);
    player.p.attacked = true;

    Q.state.set("health",CharSheet.hitPoints);
  },

  distanceToPlayer: function(){
    var p = findPlayer();

    var xs = p.p.x - this.p.x;
    xs = xs * xs;
    var ys = p.p.y - this.p.y;
    ys = ys * ys;
    return toMatrix(Math.sqrt(xs + ys));
  }
});

Q.Monster.extend("Bat", {
  init: function(p) {
    this._super(p, {
      sheet: "bat",
      sprite: "batAnim"
    });
    var hp, atk, def, exp;
    var floor = CharSheet.floor-1;

    hp =  60 + 10 * floor;
    atk = 4 + 3 * floor;
    def = 2 + 1 * floor;
    exp = 15 + 5 * floor;

    this.character.live(hp,atk,def,exp);
  }
});

Q.Monster.extend("Snake", {
  init: function(p) {
    this._super(p, {
      sheet: "snake",
      sprite: "snakeAnim"
    });
    var hp, atk, def, exp;
    var floor = CharSheet.floor-1;

    hp =  70 + 8 * floor;
    atk = 10 + 5 * floor;
    def = 5 + 1 * floor;
    exp = 20 + 5 * floor;

    this.character.live(hp,atk,def,exp);
  }
});

Q.Monster.extend("Spider", {
  init: function(p) {
    this._super(p, {
      sheet: "spider",
      sprite: "spiderAnim"
    });
    var hp, atk, def, exp;
    var floor = CharSheet.floor-1;

    hp =  110 + 22 * floor;
    atk = 7 + 4 * floor;
    def = 10 + 3 * floor;
    exp = 15 + 5 * floor;

    this.character.live(hp,atk,def,exp);
  }
});

Q.Monster.extend("Slime", {
  init: function(p) {
    this._super(p, {
      sheet: "slime",
      sprite: "slimeAnim"
    });
    var hp, atk, def, exp;
    var floor = CharSheet.floor-1;

    hp =  120 + 30 * floor;
    atk = 20 + 4 * floor;
    def = 7 + 2 * floor;
    exp = 25 + 8 * floor;

    this.character.live(hp,atk,def,exp);
  }
});

Q.Monster.extend("Skeleton", {
  init: function(p) {
    this._super(p, {
      sheet: "slime",
      sprite: "slimeAnim"
    });
    var hp, atk, def, exp;
    var floor = CharSheet.floor-1;

    hp =  70 + 10 * floor;
    atk = 10 + 2 * floor;
    def = 5 + 2 * floor;
    exp = 1 + 8 * floor;

    this.character.live(hp,atk,def,exp);
  }
});    

  Q.Sprite.extend("EkChuah", {
    init: function(props, defaultProps) {
    this._super(Q._extend({  
      x: 48+64*7, 
      y: 48+64*5,  
      moved: false,
      type: Q.SPRITE_ENEMY,
      sheet: "boss1Stand",
      sprite: "boss1Anim",
      frenzy: false,
      frenzyTurn: 0,
    },props), defaultProps);

    this.add('2d, animation, character, turn_component');

    Q.state.inc("enemies", 1);

    this.character.live(1000, 35, 40, 500);

    this.turn_component.init_turn(Q.state.get("enemies"));
    this.play("boss1Stand");  
    
    this.on("hit", function(collision) {
      // console.log("collision bola mala: "+collision.obj);
    });
  },

  step: function(dt) {
    if(this.dead()){
      //Dungeon.map[toMatrix(this.p.y)][toMatrix(this.p.x)] = 2;
      act_turnEnemies(this.p.position);

      this.destroy();

    } else if (Q.state.get("nextMove") == this.p.position && !this.p.moved) {
      this.p.moved = true;
      
      //Dungeon.map[toMatrix(this.p.y)][toMatrix(this.p.x)] = 2;

      if((this.p.x-32)%64 != 0 || (this.p.y-32)%64 != 0 ){
          this.p.x = fromMatrix(Math.round(toMatrix(this.p.x, "boss")), "boss");
          this.p.y = fromMatrix(Math.round(toMatrix(this.p.y, "boss")), "boss");
          // console.log(this.p.x, this.p.y);
      }

      r = Math.random();
      if(r<0.2 && this.p.hitPoints<this.p.maxHitPoints/1.8 && !this.p.frenzy){
          this.special();
      } else if(nextToPlayer(this.p.x,this.p.y, "boss")){
          this.attack();
      } else {
        if(this.distanceToPlayer() < 10) {
          var nextMove = findNextLW(this.p.x,this.p.y, "boss");
          this.p.x = nextMove[0];
          this.p.y = nextMove[1];
        }
      }
      if(this.p.frenzy){
        this.healMe();
        this.p.frenzyTurn--;
        if(this.p.frenzyTurn==0){
          this.play("boss1Stand"); 
          this.p.defense+=10;
          this.p.frenzy=false;
        }
      }
      
      //Dungeon.map[toMatrix(this.p.y)][toMatrix(this.p.x)] = 666;

      this.pass_turn();
      this.p.moved=false;
    }
  },

  attack: function(){
    player = findPlayer();
    if(this.p.frenzy){
      this.play("boss1FrenzyAttack")
      player.hit(this);
    } else {
      this.play("boss1Attack")
    }
    player.hit(this);
    player.p.attacked = true;

    Q.state.set("health",CharSheet.hitPoints);
  },

  special: function(){
    this.play("boss1Frenzy"); 
    this.p.frenzy = true;
    this.p.frenzyTurn = 4;
    this.p.defense-=10;
  },

  healMe: function(){
    if(this.p.hitPoints<this.p.maxHitPoints/4){
      this.p.hitPoints+=0.1*this.p.maxHitPoints;
      bossHP.hit(this);
    }
  },

  distanceToPlayer: function(){
    var p = findPlayer();

    var xs = p.p.x - this.p.x;
    xs = xs * xs;
    var ys = p.p.y - this.p.y;
    ys = ys * ys;
    return toMatrix(Math.sqrt(xs + ys));
  }
  });

Q.Sprite.extend("AhPuch", {
    init: function(props, defaultProps) {
    this._super(Q._extend({  
      x: 48+64*7, 
      y: 48+64*5,  
      moved: false,
      type: Q.SPRITE_ENEMY,
      sheet: "boss2Stand",
      sprite: "boss2Anim",
      hearts: 1,
    },props), defaultProps);

    this.add('2d, animation, character, turn_component');

    Q.state.inc("enemies", 1);

    this.character.live(2000, 30, 20, 1500);

    this.turn_component.init_turn(Q.state.get("enemies"));
    this.play("boss2Stand");  
    
    this.on("hit", function(collision) {
      // console.log("collision bola mala: "+collision.obj);
    });
  },

  step: function(dt) {
    if(this.dead()){
      this.play('boss2Dead')
      if(this.p.hearts == 0){
      //Dungeon.map[toMatrix(this.p.y)][toMatrix(this.p.x)] = 2;
        act_turnEnemies(this.p.position);
        this.destroy();
      } else {
        this.p.hearts--;
        this.p.hitPoints = this.p.maxHitPoints;
        this.p.defense += 40;
        this.p.attack += 50;
      }
    } else if (Q.state.get("nextMove") == this.p.position && !this.p.moved) {
      this.p.moved = true;
      
      //Dungeon.map[toMatrix(this.p.y)][toMatrix(this.p.x)] = 2;

      if((this.p.x-32)%64 != 0 || (this.p.y-32)%64 != 0 ){
          this.p.x = fromMatrix(Math.round(toMatrix(this.p.x, "boss")), "boss");
          this.p.y = fromMatrix(Math.round(toMatrix(this.p.y, "boss")), "boss");
          // console.log(this.p.x, this.p.y);
      }

      r = Math.random();
      if(r<0.3 && this.p.hearts == 0){
          this.special();
      } else if(nextToPlayer(this.p.x,this.p.y, "boss")){
          this.attack();
      } else {
        if(this.distanceToPlayer() < 10) {
          var nextMove = findNextLW(this.p.x,this.p.y, "boss");
          this.p.x = nextMove[0];
          this.p.y = nextMove[1];
        }
      }      
      //Dungeon.map[toMatrix(this.p.y)][toMatrix(this.p.x)] = 666;

      this.pass_turn();
      this.p.moved=false;
    }
  },

  attack: function(){
    this.play('boss2Attack')
    player = findPlayer();
    player.hit(this);
    player.p.attacked = true;

    Q.state.set("health",CharSheet.hitPoints);
  },

  special: function(){
    this.play('boss2Summon')
    for(var i = 0; i<5; i++)
      Q.stage(0).insert(Dungeon.insertEntity(new Q.Skeleton()));
  },

  healMe: function(){
  },

  distanceToPlayer: function(){
    var p = findPlayer();

    var xs = p.p.x - this.p.x;
    xs = xs * xs;
    var ys = p.p.y - this.p.y;
    ys = ys * ys;
    return toMatrix(Math.sqrt(xs + ys));
  }
  });

Q.Sprite.extend("Kukulkan", {
    init: function(props, defaultProps) {
    this._super(Q._extend({  
      x: 48+64*7, 
      y: 48+64*5,  
      moved: false,
      type: Q.SPRITE_ENEMY,
      sheet: "boss3Stand",
      sprite: "boss3Anim",
      frenzyTurn: 0,
    },props), defaultProps);

    this.add('2d, animation, character, turn_component');

    Q.state.inc("enemies", 1);

    this.character.live(5000, 10, 60, 0);

    this.turn_component.init_turn(Q.state.get("enemies"));
    this.play("bossStand");  
    
    this.on("hit", function(collision) {
      // console.log("collision bola mala: "+collision.obj);
    });
  },

  step: function(dt) {
    if(this.dead()){
      //Dungeon.map[toMatrix(this.p.y)][toMatrix(this.p.x)] = 2;
      act_turnEnemies(this.p.position);

      this.destroy();

    } else if (Q.state.get("nextMove") == this.p.position && !this.p.moved) {
      this.p.moved = true;
      
      //Dungeon.map[toMatrix(this.p.y)][toMatrix(this.p.x)] = 2;

      if((this.p.x-32)%64 != 0 || (this.p.y-32)%64 != 0 ){
          this.p.x = fromMatrix(Math.round(toMatrix(this.p.x, "boss")), "boss");
          this.p.y = fromMatrix(Math.round(toMatrix(this.p.y, "boss")), "boss");
          // console.log(this.p.x, this.p.y);
      }

      r = Math.random();
      d = this.distanceToPlayer()
      if(r<0.4 && d < 7){
          this.special();
      } else if(nextToPlayer(this.p.x,this.p.y, "boss")){
          this.attack();
      } else {
        if(d < 10) {
          var nextMove = findNextLW(this.p.x,this.p.y, "boss");
          this.p.x = nextMove[0];
          this.p.y = nextMove[1];
        }
      }
      
      //Dungeon.map[toMatrix(this.p.y)][toMatrix(this.p.x)] = 666;

      this.pass_turn();
      this.p.moved=false;
    }
  },

  attack: function(){
    player = findPlayer();
    player.hit(this);
    player.p.attacked = true;

    Q.state.set("health",CharSheet.hitPoints);
  },

  special: function(){
    player = findPlayer();
    var thunder = new Q.Thunder({x:player.p.x, y:player.p.y});
    
    Q.stage(0).insert(thunder);
    player.hit(this);
    player.p.attacked = true;
  },

  distanceToPlayer: function(){
    var p = findPlayer();

    var xs = p.p.x - this.p.x;
    xs = xs * xs;
    var ys = p.p.y - this.p.y;
    ys = ys * ys;
    return toMatrix(Math.sqrt(xs + ys));
  }
  });

Q.Sprite.extend("Thunder", {
  init: function(p) {
    this._super(p, {
      sheet: "thunder",
      sprite: "thunderAnim",
      attack: 0,
      off: false,
      collisionMask: Q.SPRITE_NONE,
      type: Q.SPRITE_NONE,
      timeOut: 0.5 //segundos
    });

    this.add('2d, animation');
    this.on("sensor", this, "collision");
    this.play(this.p.sheet); 
  },

  step: function(dt){
      this.p.timeOut-=dt;
      if(this.p.timeOut <= 0){
        this.destroy();
      }
  }
});