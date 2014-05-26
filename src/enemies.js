//Jugador
Q.Sprite.extend("Player", {
  init: function(p) {
    this._super(p, {  
      sheet: "standR", 
      sprite: "playerAnim", 
      facing: 'right',
      x: 16+32*2, 
      y: 16+32*2,
      moved:false
    });
    this.add('2d, customControls, animation, turn_component');

    //this.character.live(CharSheet.hitPoints, CharSheet.attack, CharSheet.defense, CharSheet.nextLevel);
    this.turn_component.init_turn(0);

    this.on("end_move", this, function(){
      this.p.inTurn=false;
      this.p.moving=false;
      this.p.moved=false;

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
      sensor: true,
      experience: 10  
    });
    this.add('2d, animation, character, turn_component');

    Q.state.inc("enemies", 1);

    this.character.live(100, 4, 1, 20);
    this.turn_component.init_turn(Q.state.get("enemies"));
    this.play("slime");
    
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