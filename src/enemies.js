//Jugador
Q.Sprite.extend("Player", {
  init: function(p) {
    this._super(p, {  
      sheet: "bolaDown", 
      sprite: "bolaAnim", 
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

      if(this.p.pressed==='right') {
        this.play("bolaR");
        this.p.moved=true;
      } else if(this.p.pressed==='left') {
        this.play("bolaL");
        this.p.moved=true;
      } else if(this.p.pressed==='down') {
        this.play("bolaD");
        this.p.moved=true;
      } else if(this.p.pressed==='up') {
        this.play("bolaU");
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
      sheet: "bolaMDown", 
      sprite: "bolaMalaAnim", 
      x: 16+32*7, 
      y: 16+32*5,  
      moved: false,
      type: Q.SPRITE_ENEMY,
      sensor: true  
    });
    this.add('2d, animation, character, turn_component');

    Q.state.inc("enemies", 1);

    this.character.live(100, 20, 1);
    this.turn_component.init_turn(Q.state.get("enemies"));
    
    this.on("hit", function(collision) {
      console.log("collision bola mala: "+collision.obj);
    });
  },

  step: function(dt) {
    if(this.dead()){

      console.log("dead "+this.p.hitPoints+" "+this.dead());

      act_turnEnemies(this.p.position);

      this.destroy();

    } else if (Q.state.get("nextMove") == this.p.position && !this.p.moved) {
      this.p.moved = true;
      console.log("turno bicho!");
      
      Dungeon.map[toMatrix(this.p.x)][toMatrix(this.p.y)] = 666;

      if((this.p.x-16)%32 != 0 || (this.p.y-16)%32 != 0 ){
          this.p.x = fromMatrix(Math.round(toMatrix(this.p.x)));
          this.p.y = fromMatrix(Math.round(toMatrix(this.p.y)));
          console.log(this.p.x, this.p.y);
        }
      if(nextToPlayer(this.p.x,this.p.y)){
        this.attack();
      } else {
        console.log(this.p.x, this.p.y);
        
        var nextMove = findNextLW(this.p.x,this.p.y);
        this.p.x = nextMove[0];
        this.p.y = nextMove[1];
      }

      Dungeon.map[toMatrix(this.p.x)][toMatrix(this.p.y)] = 2;

      this.pass_turn();
      this.p.moved=false;
    }
  },

  attack: function(){
    player = findPlayer();
    player.hit(this);
    Q.state.set("health",player.p.hitPoints);
  },

});