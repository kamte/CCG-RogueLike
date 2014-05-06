Q.Sprite.extend("BadBall", {
  init: function(p) {
    this._super(p, {  
      sheet: "bolaMDown", 
      sprite: "bolaMalaAnim", 
      x: 16+32*7, 
      y: 16+32*5,  
      moved: false,
      type: Q.SPRITE_ENEMY  
    });
    this.add('2d, animation, character');

    this.character.live(100, 20, 1);
    
    this.on("hit", function(collision) {
      console.log("collision bola mala: "+collision.obj);
    });
    this.on("monsterTurn", this, "action");
    this.on("finalMonsterTurn", this, function() { 
      this.p.moved=false; 
    });

  },

  action: function() {
    if (Q.state.get("turn") > 0 && !this.p.moved) {
      console.log("turno bicho!");
      matrix[toMatrix(this.p.x)][toMatrix(this.p.y)] = 0;

      this.p.moved = true;
      if(nextToPlayer(this.p.x,this.p.y))
        this.attack();
      else {
        if((this.p.x-16)%32 != 0 || (this.p.y-16)%32 != 0 ){
          this.p.x = fromMatrix(Math.round(toMatrix(this.p.x)));
          this.p.y = fromMatrix(Math.round(toMatrix(this.p.y)));
        }
        /*
        var nextMove = findNextLW(this.p.x,this.p.y);
        this.p.x = nextMove[0];
        this.p.y = nextMove[1];
        */
        var nextMove = findNext(this.p.x,this.p.y);
        if(matrix[nextMove[0]][nextMove[1]]==0) {
          this.p.x = fromMatrix(nextMove[0]);
          this.p.y = fromMatrix(nextMove[1]);
        } 
        
      }

      matrix[toMatrix(this.p.x)][toMatrix(this.p.y)] = 1;

      Q.state.dec("turn",1);
      //Q("BadBall").trigger("monsterTurn",turn-1);
    }
    if(Q.state.get("turn")==0)
      setTimeout(function() {

        Q.state.set("turn", Q.state.get("enemies"));
        Q.state.inc("playerTurn",1);
        Q("BadBall").trigger("finalMonsterTurn");
        console.log("turno jugador")
      }, 100);
  },

  step: function(dt){

    if(this.dead()){
      console.log("dead "+this.p.hitPoints+" "+this.dead());
      this.destroy();
      Q.state.dec("enemies", 1);
    } 
  },

  attack: function(){
    this.p.moved=true;
    enemiesMoved++;
    player = findPlayer();
    player.hit(this);
    Q.state.set("health",player.p.hitPoints);
  },

});