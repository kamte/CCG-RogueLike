var Q = Quintus();

Q = Quintus({development: true, audioSupported: ['mp3', 'ogg'] })
.include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX, Audio")
.setup("canvas")
.controls()
.touch()
.enableSound();

Q.gravityX = 0;
Q.gravityY = 0;

var matrix =[
[1,1,1,1,1,1,1,1,1,1],
[1,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,1],
[1,0,1,0,0,0,0,1,0,1],
[1,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,1],
[1,0,0,0,1,1,0,0,0,1],
[1,0,0,0,1,1,0,0,0,1],
[1,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,1],
[1,0,1,0,0,0,0,1,0,1],
[1,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,1],
[1,1,1,1,1,1,1,1,1,1],
];

var enemiesArray = new Array();

var gridPrimigenio = new PF.Grid(10, 14, matrix);
var finder = new PF.AStarFinder({
  allowDiagonal: false
});

var enemiesMoved = 0;

var findPlayer = function() {
  return Q("Player").first();
}

var toMatrix = function(x) {
  return (x-16)/32-1;
};

var fromMatrix = function(x) {
  return (x+1)*32+16;
};

var muestraCoordenadas = function(x,y) {
  console.log("canvas: ",x,y)
  console.log("tablero: ",toMatrix(x),toMatrix(y));
};

var nextToPlayer = function(x,y) {
  xB = player.p.x;
  yB = player.p.y;

  var distX = Math.abs(x-xB);
  var distY = Math.abs(y-yB);

  if((distX <= 32) && (distY <= 32)) {
    return true;
  } else {
    return false;
  }
};

var findNext = function(x,y) {
  var grid= gridPrimigenio.clone();
  //console.log("toMatrix ",x," ",y," ",toMatrix(x), toMatrix(y));
  xB = player.p.x;
  yB = player.p.y;
  var path = finder.findPath(toMatrix(x), toMatrix(y), toMatrix(xB), toMatrix(yB), grid);
  //console.log("path "+path);
  return path[1];
};

//Versión LightWeight del pathfinder
var findNextLW = function(x,y) {
  var next = new Array(2);
  var player = findPlayer();

  if (x < player.p.x && matrix[toMatrix(x+32)][toMatrix(y)]==0) {
    next[0] = x+32;
    next[1] = y;
    console.log(">>muevo DRCH<<");
  } else if (x > player.p.x && matrix[toMatrix(x-32)][toMatrix(y)]==0) {
    next[0] = x-32;
    next[1] = y;
    console.log(">>muevo IZQ<<");
  } else if (y < player.p.y && matrix[toMatrix(x)][toMatrix(y+32)]==0) {
    next[0] = x;
    next[1] = y+32;
    console.log(">>muevo ABAJO<<");
  } else if (y > player.p.y && matrix[toMatrix(x)][toMatrix(y-32)]===0) {
    next[0] = x;
    next[1] = y-32;
    console.log(">>muevo ARRIBA<<")
  } else {
    next[0] = x;
    next[1] = y;
    console.log(">>no muevo<<");
  }
  //console.log("nextx ", next[0], " nexty ", next[1])
  return next;
}

//Custom controls
Q.component("customControls", {

  added: function() {
    var p = this.entity.p;

    if(!p.stepDistance) { p.stepDistance = 32; }
    if(!p.stepDelay) { p.stepDelay = 0.2; }
    if(!p.inTurn) {p.inTurn = true; }

    p.stepWait = 0;
    this.entity.on("step",this,"step");
    this.entity.on("hit", this,"collision");
  },

  collision: function(col) {
    var p = this.entity.p;

    if(p.stepping) {
      if(col.obj.p.type == Q.SPRITE_DEFAULT){
        p.moving=false;
      } 
      p.stepping = false;
      p.x = p.origX;
      p.y = p.origY;
    }
  },

  step: function(dt) {
    var p = this.entity.p;
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

    if(p.inTurn) { //Move only when in turn

      if(Q.inputs['left']) {
        p.pressed='left';
        p.diffX = -p.stepDistance;
        p.moving = true;
      } else if(Q.inputs['right']) {
        p.pressed='right';
        p.diffX = p.stepDistance;
        p.moving = true;
      }

      if(Q.inputs['up']) {
        p.pressed='up';
        p.diffY = -p.stepDistance;
        p.moving = true;
      } else if(Q.inputs['down']) {
        p.pressed='down';
        p.diffY = p.stepDistance;
        p.moving = true;
      }

      if(!Q.inputs['up'] && !Q.inputs['down'] && !Q.inputs['left'] && !Q.inputs['right']) {
        p.pressed='none';
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
      //console.log("COORDENADAS: ",aggressor.p.x, aggressor.p.y);
      console.log("vida defensor "+this.p.hitPoints);
    }
  } 
});

Q.Sprite.extend("Player", {
  init: function(p) {
    this._super(p, {  
      sheet: "bolaDown", 
      sprite: "bolaAnim", 
      x: 16+32*2, 
      y: 16+32*2
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

  step: function(dt) {

    if(this.p.moving && this.p.moved && ((this.p.x-16)%32) == 0 && ((this.p.y-16)%32)==0){
      this.p.moving=false;
      this.p.inTurn=false;
      Q.state.dec("pTurn",1);
      Q("BadBall").trigger("mTurn",Q.state.get("enemies"));
    } 
    //Animación de movimiento
    if(!this.dead() && (Q.state.get("pTurn")==1 || Q.state.get("enemies")==0)){
      this.p.moved=false;
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
      type: Q.SPRITE_ENEMY  
    });
    this.add('2d, animation, character');

    this.character.live(100, 20, 1);
    
    this.on("hit", function(collision) {
      console.log("collision bola mala: "+collision.obj);
    });
    this.on("mTurn", this, "action");
    this.on("fmTurn", this, function() { 
      this.p.moved=false; 
    });

  },

  action: function() {
    if (Q.state.get("turn") > 0 && !this.p.moved) {
      console.log("turno bicho!");
      this.p.moved = true;
      if(nextToPlayer(this.p.x,this.p.y))
        this.attack();
      else {
        if((this.p.x-16)%32 != 0 || (this.p.y-16)%32 != 0 ){
          this.p.x = fromMatrix(Math.round(toMatrix(this.p.x)));
          this.p.y = fromMatrix(Math.round(toMatrix(this.p.y)));
        }
        var nextMove = findNextLW(this.p.x,this.p.y);
        this.p.x = nextMove[0];
        this.p.y = nextMove[1];
        /*
        var nextMove = findNext(this.p.x,this.p.y);
        this.p.x = fromMatrix(nextMove[0]);
        this.p.y = fromMatrix(nextMove[1]);
        */
      }
      Q.state.dec("turn",1);
      //Q("BadBall").trigger("mTurn",turn-1);
    }
    if(Q.state.get("turn")==0)
      setTimeout(function() {

        Q.state.set("turn", Q.state.get("enemies"));
        Q.state.inc("pTurn",1);
        Q("BadBall").trigger("fmTurn");
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


//Nivel1
Q.scene("level1", function(stage) {

  Q.stageTMX("level1OK.tmx", stage);

  var p = stage.insert(new Q.Player());
  player = findPlayer();

  Q.state.reset({ enemies: 0, health: p.p.hitPoints, pTurn: 1, mTurn: 1, turn: 0});

  stage.insert(new Q.BadBall());
  Q.state.inc("enemies",1);
  stage.insert(new Q.BadBall({x: 16+32*5, y: 16+32*2}));
  Q.state.inc("enemies",1);
 
  Q.state.set("turn", Q.state.get("enemies"));

  stage.add("viewport").centerOn(150, 368); 
  stage.follow(p, { x: true, y: true });
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
  Q.stageScene("hud",1);
});

Q.UI.Text.extend("Stats",{
  init: function(p) {
    this._super({
      label: "Health: 100",
      x: 0,
      y: 10,
      color: "white"
    });
    Q.state.on("change.health",this,"hp");
  },
  hp: function(hitP) {
    this.p.label = "Health: " + hitP;
  }
});

Q.scene('hud',function(stage) {
  var container = stage.insert(new Q.UI.Container({
    x: 60, y: 0
  }));
  var label = container.insert(new Q.Stats());
  container.fit(20);
});

