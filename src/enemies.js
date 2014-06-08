//Versión LightWeight del pathfinder
var findNextLW = function(x,y) {
  var next = new Array(2);
  next[0]=x; next[1]=y;
  var player = findPlayer();

  var fila=toMatrix(y);
  var columna=toMatrix(x);

  var posibles = [];

  if(Dungeon.map[fila][columna+1]%2==0 && x < player.p.x){
    posibles.push('derecha');
  }
  if(Dungeon.map[fila][columna-1]%2==0 && x > player.p.x){
    posibles.push('izquierda');
  }
  if(Dungeon.map[fila+1][columna]%2==0 && y < player.p.y){
    posibles.push('abajo');
  }
  if(Dungeon.map[fila-1][columna]%2==0 && y > player.p.y){
    posibles.push('arriba');
  }

  var num = Math.floor(Math.random()*(posibles.length));
  var dir = posibles[num];
  // console.log(num, dir);
  if(dir == 'derecha'){
    next[0] = x+32;
    next[1] = y;
  } else if(dir == 'izquierda') {
    next[0] = x-32;
    next[1] = y;
  } else if(dir == 'abajo') {
    next[0] = x;
    next[1] = y+32;
  } else if(dir == 'arriba'){
    next[0] = x;
    next[1] = y-32;
  }

  return next;
};

var spawn = function(stage) {
  var n = Aux.newRandom(0,3);
  if (n == 0) 
    stage.insert(Dungeon.insertEntity(new Q.Slime({sheet: "snake", sprite: "snakeAnim"})));
  else if (n == 1)
    stage.insert(Dungeon.insertEntity(new Q.Slime({sheet: "bat", sprite: "batAnim"})));
  else if (n == 2)
    stage.insert(Dungeon.insertEntity(new Q.Slime({sheet: "spider", sprite: "spiderAnim"})));
  else
    stage.insert(Dungeon.insertEntity(new Q.Slime()));
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
      if(collision.obj.p.type === Q.SPRITE_ENEMY){
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
          if (n > 90) {
            console.log("Spawning a new enemy!")
            spawn(Q.stage(0));
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
      var hitPoints = CharSheet.hitPoints - (aggressor.p.attack-CharSheet.defense);
      CharSheet.updateHp(hitPoints);
      //console.log("COORDENADAS: ",aggressor.p.x, aggressor.p.y);
      // console.log(this.p.x, this.p.y, "vida defensor "+this.p.hitPoints);
    }
});


Q.Sprite.extend("Slime", {
  init: function(p) {
    this._super(p, {  
      sheet: "slime", 
      sprite: "slimeAnim", 
      x: 16+32*7, 
      y: 16+32*5,  
      moved: false,
      type: Q.SPRITE_ENEMY,
      // sensor: true,
      experience: 10  
    });
    this.add('2d, animation, character, turn_component');

    Q.state.inc("enemies", 1);
    var hp, atk, def, exp;
    var floor = CharSheet.floor-1;

    //Make enemies randomly up to 2 times stronger
    var mod = Aux.newRandom(100,200) / 100;

    hp =  Math.floor(mod * (100 + 10 * floor));
    atk = Math.floor(mod * (4 + 2 * floor));
    def = Math.floor(mod * (1 + 1 * floor));
    exp = Math.floor(mod * (20 + 5 * floor));
    
    this.character.live(hp, atk, def, exp);
    this.turn_component.init_turn(Q.state.get("enemies"));
    this.play(this.p.sheet);
    //this.play("slime");
    
    
    this.on("hit", function(collision) {
      // console.log("collision bola mala: "+collision.obj);
    });
  },

  step: function(dt) {
    if(this.dead()){

      // console.log("dead "+this.p.hitPoints+" "+this.dead());

      act_turnEnemies(this.p.position);

      this.destroy();

    } else if (Q.state.get("nextMove") == this.p.position && !this.p.moved) {
      this.p.moved = true;
      // console.log("turno bicho!");
      
      Dungeon.map[toMatrix(this.p.x)][toMatrix(this.p.y)] = 2;

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

      Dungeon.map[toMatrix(this.p.x)][toMatrix(this.p.y)] = 666;

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