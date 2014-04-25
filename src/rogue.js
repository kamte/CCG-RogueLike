var Q = Quintus();

Q = Quintus({development: true, audioSupported: ['mp3', 'ogg'] })
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX, Audio")
        .setup("canvas")
        .controls()
        .touch()
        .enableSound();
        
Q.gravityX = 0;
Q.gravityY = 0;

Q.Sprite.extend("Player", {
	init: function(p) {
  	this._super(p, { 	
  		sheet: "bolaDown", 
      sprite: "bolaAnim", 
      x: 60, 
      y: 70,
      dead: false, 
      type: Q.SPRITE_ACTIVE
  	});
  	this.add('2d, stepControls, animation, tween');

    this.on("hit", function(collision) {
        console.log("collision: "+collision.obj)
    });

   },

  step: function(dt){
    
    //Animación de movimiento
    /*
    if(!this.p.dead)
      if(this.p.vx > 0) {
        this.play("bolaRight");
        console.log(">0 "+ this.p.x)
      } else if(this.p.vx < 0) {
        this.play("bolaLeft");
        console.log("<0 "+ this.p.x)
      } else if(this.p.vy > 0) {
        this.play("rogueDown");
      } else if(this.p.vy < 0) {
        this.play("rogueUp");
      } 
    */
	}
});


//Nivel1
Q.scene("level1", function(stage) {

	Q.stageTMX("level1OK.tmx", stage);

	var player = stage.insert(new Q.Player());
  
	stage.add("viewport").centerOn(150, 368); 
	stage.follow(player, { x: true, y: true });
});

//Carga de recursos
Q.loadTMX("level1OK.tmx, rogue.png, rogue.json, bola.png, bola.json", function() {
  
  Q.compileSheets("rogue.png","rogue.json");
   Q.compileSheets("bola.png","bola.json");

  Q.animations("bolaAnim", {
    bolaUp: {frames: [0], rate: 1/7, loop: false},
    bolaDown: {frames: [2], rate: 1/7, loop: false},
    bolaRight: {frames: [1], rate: 1/7, loop: false},
    bolaLeft: {frames: [3], rate: 1/7, loop: false},
  });
  
  Q.stageScene("level1", 0);
});
