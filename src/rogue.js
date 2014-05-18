var Q = Quintus();

Q = Quintus({development: true, audioSupported: ['mp3', 'ogg'] })
.include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX, Audio")
.setup("canvas")
.controls()
.touch()
.enableSound();

Q.gravityX = 0;
Q.gravityY = 0;

var matrix;
var enemiesArray = new Array();

var act_turnEnemies = function(pos) {
  var aux = new Array();
  for(var i=pos; i<Q.state.get("enemies")-1; i++){
    enemiesArray[i]=enemiesArray[i+1]; 
  }

  Q.state.dec("enemies", 1);
}

var findPlayer = function() {
  return Q("Player").first();
}

var toMatrix = function(x) {
  return Math.round((x-16)/32);
};

var fromMatrix = function(x) {
  return ((x*32)+16);
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

  if((distX == 32) && (distY == 32)) {
    console.log(distX, distY, "DISTANCIA");
    return false;
  } else if((distX <= 32) && (distY <= 32)) {
    return true;
  } else {
    return false;
  }
};

//Versión LightWeight del pathfinder
var findNextLW = function(x,y) {
  console.log(x,y);
  var next = new Array(2);
  next[0]=x; next[1]=y;
  var player = findPlayer();

  this.matrixX = toMatrix(x);
  this.matrixY = toMatrix(y);

  var arriba = new Array();
  var centro = new Array();
  var abajo = new Array();

  var i=0;
  for(j=this.matrixX-1; j<=this.matrixX+1; j++){
    if(i>=0 && j>=0){
      arriba[i]=matrix[this.matrixY-1][j];
      centro[i]=matrix[this.matrixY][j];
      abajo[i]=matrix[this.matrixY+1][j];
    }
    i++;
  }

  if(centro[2]==0 && x < player.p.x){
    next[0] = x+32;
    next[1] = y;
  }

  if(centro[0]==0 && x > player.p.x){
    next[0] = x-32;
    next[1] = y;
  }

  if(abajo[1]==0 && y < player.p.y){
    next[0] = x;
    next[1] = y+32;
  }

  if(arriba[1]==0 && y > player.p.y){
    next[0] = x;
    next[1] = y-32;
  }

  return next;
}

function setupLevel(stage) {
   
    Dungeon.generate();
    matrix = Dungeon.pathMap;

    stage.insert(new Q.Repeater({ asset: "azteca.png", speedX: 0.5, speedY: 0.5 }));
    stage.insert(new Q.DungeonTracker({ data: Q.asset('level_dungeon') }));
  
    var p = stage.insert(new Q.Player());

    player = findPlayer();

    Q.state.reset({ enemies: 0, health: p.p.hitPoints, enemies_dead: 0, nextMove: 0});
   
    stage.insert(new Q.BadBall());
    //Q.state.inc("enemies",1);

    stage.add("viewport").centerOn(150, 368); 
    stage.follow(p, { x: true, y: true });
  }

  Q.scene("level1",function(stage) {
    // Call the helper methods to get the 
    // level all set up with blocks, a ball and a paddle
    setupLevel(stage);
  });


//Carga de recursos
Q.load("texturas.png, texturas.json, bola.png, bola.json, bolaMala.png, bolaMala.json, bombi.png, bombi.json, azteca.png", function() {

  Q.compileSheets("bola.png", "bola.json");
  Q.compileSheets("bolaMala.png", "bolaMala.json");
  Q.compileSheets("bombi.png", "bombi.json");
  Q.compileSheets("texturas.png","texturas.json");
  
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

