//Jugador
Q.Sprite.extend("Player", {
  init: function(p) {
    this._super(p, {  
      sheet: "standR", 
      sprite: "playerAnim", 
      x: 16+32*2, 
      y: 16+32*2,
      moved:false
    });
    this.add('2d, customControls, animation, character, turn_component');

    this.character.live(100, 20, 1);
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
        console.log("ataque");
        collision.obj.hit(this);
      } else {
        console.log("no enemigo");
      }
    });
  },

  step: function(dt) {

    //Animación de movimiento
    if(!this.dead() && !this.p.moved &&(Q.state.get("nextMove")==this.p.position || Q.state.get("enemies")==0)){
      this.p.inTurn=true;

      if(Q.inputs['right'])
        this.play("walkR");
      if(Q.inputs['left'])
        this.play("walkL");
      if(Q.inputs['up'] || Q.inputs['down']) {
        if (this.p.facing === 'right')
          this.play("walkR");
        else
          this.play("walkL");
      }

      if(this.p.facing==='right') {
        this.play("standR");
        this.p.moved=true;
      } else if(this.p.facing==='left') {
        this.play("standL");
        this.p.moved=true;
      } else if(this.p.pressed==='down' || this.p.pressed === 'up') {
        this.p.moved=true;
      } else if(this.p.pressed==='left' || this.p.pressed === 'right') {
        this.p.moved=true;
      } else {};

    } else if(this.dead()){
      console.log("dead "+this.p.hitPoints+" "+this.dead());
      this.destroy();
    } else if(Q.state.get("nextMove")>Q.state.get("enemies")) {
      Q.state.set("nextMove", 0);
    }

  }
});


Q.Sprite.extend("BadBall", {
  init: function(p) {
    this._super(p, {  
      sheet: "bola", 
      sprite: "bolaMalaAnim", 
      x: 16+32*7, 
      y: 16+32*5,  
      moved: false,
      type: Q.SPRITE_ENEMY,
      sensor: true  
    });
    this.add('2d, animation, character, turn_component');

    Q.state.inc("enemies", 1);

    this.character.live(100, 4, 1);
    this.turn_component.init_turn(Q.state.get("enemies"));
    
    this.on("hit", function(collision) {
      console.log("collision bola mala: "+collision.obj);
    });
  },

  step: function(dt) {
    this.play("bola");
    if(this.dead()){

      console.log("dead "+this.p.hitPoints+" "+this.dead());

      act_turnEnemies(this.p.position);

      this.destroy();

    } else if (Q.state.get("nextMove") == this.p.position && !this.p.moved) {
      this.p.moved = true;
      console.log("turno bicho!");
      
      Dungeon.map[toMatrix(this.p.x)][toMatrix(this.p.y)] = 2;

      if((this.p.x-16)%32 != 0 || (this.p.y-16)%32 != 0 ){
          this.p.x = fromMatrix(Math.round(toMatrix(this.p.x)));
          this.p.y = fromMatrix(Math.round(toMatrix(this.p.y)));
          console.log(this.p.x, this.p.y);
        }
      if(nextToPlayer(this.p.x,this.p.y)){
        this.attack();
      } else {
        console.log(this.p.x, this.p.y);

        if(this.distanceToPlayer() < 15) {
          var nextMove = findNextLW(this.p.x,this.p.y);
          this.p.x = nextMove[0];
          this.p.y = nextMove[1];
        }
        else console.log("muy lejos, no me muevo");
      }

      Dungeon.map[toMatrix(this.p.x)][toMatrix(this.p.y)] = 666;

      this.pass_turn();
      this.p.moved=false;
    }
  },

  attack: function(){
    player = findPlayer();
    player.hit(this);
    Q.state.set("health",player.p.hitPoints);
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