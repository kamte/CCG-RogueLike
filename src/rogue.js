var Q = Quintus();

Q = Quintus({development: true, audioSupported: ['mp3', 'ogg'] })
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX, Audio")
        .setup("canvas")
        .controls()
        .touch()
        .enableSound();

Q.gravityX = 0;
Q.gravityY = 0;

//Custom controls
Q.component("customControls", {

  added: function() {
    var p = this.entity.p;

    if(!p.stepDistance) { p.stepDistance = 32; }
    if(!p.stepDelay) { p.stepDelay = 0.2; }

    p.stepWait = 0;
    this.entity.on("step",this,"step");
    this.entity.on("hit", this,"collision");
  },

  collision: function(col) {
    var p = this.entity.p;

    if(p.stepping) {
      p.stepping = false;
      p.x = p.origX;
      p.y = p.origY;
    }

  },

  step: function(dt) {
    var p = this.entity.p,
    moved = false;
    p.stepWait -= dt;

    if(p.stepping) {
      p.x += p.diffX * dt / p.stepDelay;
      p.y += p.diffY * dt / p.stepDelay;
    }

    if(p.stepWait > 0) { return; }
    if(p.stepping) {
      p.x = p.destX;
      p.y = p.destY;
    }
    p.stepping = false;

    p.diffX = 0;
    p.diffY = 0;

    if(Q.inputs['left']) {
      p.pressed='left';
      p.diffX = -p.stepDistance;
    } else if(Q.inputs['right']) {
      p.pressed='right';
      p.diffX = p.stepDistance;
    }

    if(Q.inputs['up']) {
      p.pressed='up';
      p.diffY = -p.stepDistance;
    } else if(Q.inputs['down']) {
      p.pressed='down';
      p.diffY = p.stepDistance;
    }
    if(p.diffY || p.diffX ) { 
      p.stepping = true;
      p.origX = p.x;
      p.origY = p.y;
      p.destX = p.x + p.diffX;
      p.destY = p.y + p.diffY;
      p.stepWait = p.stepDelay; 
    }
  }
});

Q.component("character", {
    
    live: function(HP, ATK, DEF) {
      this.entity.p.hitPoints = HP;
      this.entity.p.attack = ATK;
      this.entity.p.defense = DEF
    },

    extend: {
      dead: function(){
        if (this.p.hitPoints <= 0){
          return true;
        } else {
          return false;
        }
      },

      hit: function(aggressor) {
          this.p.hitPoints -= aggressor.p.attack-this.p.defense;
          console.log("vida "+this.p.hitPoints);
      }
    } 
});
        
Q.Sprite.extend("Player", {
  init: function(p) {
    this._super(p, {  
      sheet: "bolaDown", 
      sprite: "bolaAnim", 
      x: 60, 
      y: 70
    });
    this.add('2d, customControls, animation, character');

    this.character.live(100, 20, 1);

    this.on("hit", function(collision) {
        if(collision.obj.p.type === Q.SPRITE_ENEMY){
          console.log("ataque");
          collision.obj.hit(this);
        } else {
          console.log("no enemigo");
        }
    });

  },

  step: function(dt){
    //Animación de movimiento
    if(!this.dead()){
      if(this.p.pressed==='right') {
        this.play("bolaR");
      } else if(this.p.pressed==='left') {
        this.play("bolaL");
      } else if(this.p.pressed==='down') {
        this.play("bolaD");
      } else if(this.p.pressed==='up') {
        this.play("bolaU");
      } 
    } else {
      console.log("dead "+this.p.hitPoints+" "+this.dead());
      this.destroy();
    }
  },

});

Q.Sprite.extend("BadBall", {
  init: function(p) {
    this._super(p, {  
      sheet: "bolaMDown", 
      sprite: "bolaMalaAnim", 
      x: 200, 
      y: 60,  
      type: Q.SPRITE_ENEMY  
    });
    this.add('2d, animation, character');

    this.character.live(100, 20, 1);

    this.on("hit", function(collision) {
        console.log("collision bola mala: "+collision.obj)
    });

  },

  step: function(dt){
    if(this.dead()){
      console.log("dead "+this.p.hitPoints+" "+this.dead());
      this.destroy();
    }
  },

});


//Nivel1
Q.scene("level1", function(stage) {

  Q.stageTMX("level1OK.tmx", stage);

  var player = stage.insert(new Q.Player());
  stage.insert(new Q.BadBall())

  stage.add("viewport").centerOn(150, 368); 
  stage.follow(player, { x: true, y: true });
});


//Carga de recursos
Q.loadTMX("level1OK.tmx, bola.png, bola.json, bolaMala.png, bolaMala.json, bombi.png, bombi.json", function() {

  Q.compileSheets("bola.png", "bola.json");
  Q.compileSheets("bolaMala.png", "bolaMala.json");
  Q.compileSheets("bombi.png", "bombi.json");
  
  Q.animations("bolaAnim", {
    bolaD: {frames: [0]},
    bolaL: {frames: [1]},
    bolaR: {frames: [2]},
    bolaU: {frames: [3]}
  });

  Q.animations("bolaMalaAnim", {
    bolaMD: {frames: [0]},
    bolaML: {frames: [1]},
    bolaMR: {frames: [2]},
    bolaMU: {frames: [3]}
  });

  Q.animations("bombiAnim", {
    bolaD: {frames: [0, 1], rate: 1/12, loop: true}
  });
  
  Q.stageScene("level1", 0);
});
