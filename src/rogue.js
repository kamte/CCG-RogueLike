var Q = Quintus();

Q = Quintus({development: true, audioSupported: ['mp3', 'ogg'] })
.include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX, Audio")
.setup("canvas")
.touch()
.enableSound();

Q.input.keyboardControls();

Q.gravityX = 0;
Q.gravityY = 0;

var enemiesArray = new Array();
var firstLevel = true;

var act_turnEnemies = function(pos) {
  for(var i=pos; i<Q.state.get("enemies"); i++){
    enemiesArray[i]=enemiesArray[i+1]; 
    enemiesArray[i+1]=undefined;
    enemiesArray[i].p.position=i;
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
  var player = findPlayer();
  xB = player.p.x;
  yB = player.p.y;

  var distX = Math.abs(x-xB);
  var distY = Math.abs(y-yB);

  if((distX == 32) && (distY == 32)) {
    // console.log(distX, distY, "DISTANCIA");
    return false;
  } else if((distX <= 32) && (distY <= 32)) {
    return true;
  } else {
    return false;
  }
};

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

Q.scene('Title',function(stage) {
  var box = stage.insert(new Q.UI.Container({
    x: Q.width/2, y: Q.height/2
  }));

  var button = box.insert(new Q.UI.Button({
    x: 0, y: 0, asset: "temploMaya.png", keyActionName: "confirm"
  }));

  box.insert(new Q.UI.Button({
    x: 0, y: -170, asset: "qucumatz.png"
  }));

  button.on("click",function() {
      Q.clearStages();
      Q.stageScene("level1", 0);
      Q.stageScene("HUD-background",2);
      Q.stageScene("HUD-stats",3);
  });
});

function setupLevel(stage) {
    Dungeon.generate();

    stage.insert(new Q.Repeater({ asset: "black.png", speedX: 0.5, speedY: 0.5 }));
    stage.insert(new Q.DungeonTracker({ data: Q.asset('level_dungeon') }));
    var p = stage.insert(Dungeon.insertEntity(new Q.Player()));

    Q.state.reset({ enemies: 0, health: CharSheet.hitPoints, experience: CharSheet.experience, enemies_dead: 0, nextMove: 0});
    
    sword1 = new Q.Equipment({name: "arma1", sheet: "arma1", sprite: "arma1", attack:5});
    sword2 = new Q.Equipment({name: "arma2", sheet: "arma2", sprite: "arma2", attack:15});
    sword3 = new Q.Equipment({name: "arma3", sheet: "arma3", sprite: "arma3", attack:10});
    sword4 = new Q.Equipment({name: "arma4", sheet: "arma4", sprite: "arma4", attack:-6});
    sword5 = new Q.Equipment({name: "arma5", sheet: "arma5", sprite: "arma5", attack:100});
    sword6 = new Q.Equipment({name: "arma6", sheet: "arma6", sprite: "arma6", attack:45});
    stage.insert(Dungeon.insertEntity(sword1));
    stage.insert(Dungeon.insertEntity(sword2));
    stage.insert(Dungeon.insertEntity(sword3));
    stage.insert(Dungeon.insertEntity(sword4));
    stage.insert(Dungeon.insertEntity(sword5));
    stage.insert(Dungeon.insertEntity(sword6));
    
    stage.insert(Dungeon.insertEntity(new Q.Slime({sheet: "snake", sprite: "snakeAnim"})));
    stage.insert(Dungeon.insertEntity(new Q.Slime({sheet: "bat", sprite: "batAnim"})));
    stage.insert(Dungeon.insertEntity(new Q.Slime({sheet: "spider", sprite: "spiderAnim"})));
    stage.insert(Dungeon.insertEntity(new Q.Slime()));

    stage.insert(Dungeon.insertEntity(new Q.Escalera()));

    stage.add("viewport").centerOn(150, 368); 
    stage.follow(p, { x: true, y: true });
  }

  Q.scene("level1",function(stage) {
    setupLevel(stage);
  });


//Carga de recursos
Q.load("armaduras.png, armaduras.json, armas.png, armas.json, cascos.png, cascos.json, comida.png, comida.json, escudos.png, escudos.json, pociones.png, pociones.json, qucumatz.png, temploMaya.png, black.png, sword.png, sword.json, bat.png, bat.json, snake.png, snake.json, spider.png, spider.json, player.png, player.json, HUD-maya.png, escalera.png, escalera.json, texturas.png, texturas.json, slime.png, slime.json, azteca.png", function() {

  Q.compileSheets("player.png", "player.json");
  Q.compileSheets("slime.png", "slime.json");
  Q.compileSheets("bat.png", "bat.json");
  Q.compileSheets("snake.png", "snake.json");
  Q.compileSheets("spider.png", "spider.json");
  Q.compileSheets("texturas.png","texturas.json");
  Q.compileSheets("escalera.png","escalera.json");
  Q.compileSheets("armaduras.png","armaduras.json");
  Q.compileSheets("armas.png","armas.json");
  Q.compileSheets("cascos.png","cascos.json");
  Q.compileSheets("comida.png","comida.json");
  Q.compileSheets("escudos.png","escudos.json");
  Q.compileSheets("pociones.png","pociones.json");


  Q.animations("escAnim", {
    base: {frames: [0]}
  });

  Q.animations("batAnim", {
    bat: {frames: [0,1,2,3], rate: 1/4, loop: true},
    //idleR: {frames: [0,1,2,3], rate: 1/4, loop: true},
    //idleL: {frames: [0,1,2,3], rate: 1/4, loop: true, flip: "x"}
  });

  Q.animations("snakeAnim", {
    snake: {frames: [0,1], rate: 1/4, loop: true},
    //idleR: {frames: [0,1], rate: 1/4, loop: true},
    //idleL: {frames: [0,1], rate: 1/4, loop: true, flip: "x"}
  });

  Q.animations("spiderAnim", {
    spider: {frames: [0]},
    //idleR: {frames: [0]},
    //idleL: {frames: [0], flip: "x"},
    //walkR: {frames: [0,1,2,3], rate: 1/4, loop: true},
    //walkL: {frames: [0,1,2,3], rate: 1/4, loop: true, flip: "x"}
  });
  
  Q.animations("playerAnim", {
    standR: {frames: [0], flip: false},
    standL: {frames: [0], flip: "x"},
    walkR: {frames: [1,0,2,0], rate: 1/8, loop: false, flip: false, next: 'standR'},
    walkL: {frames: [1,0,2,0], rate: 1/8, loop: false, flip: "x", next: 'standL'},
    hurtR: {frames: [0,3], rate: 1/2, loop: false, flip: false},
    hurtL: {frames: [0,3], rate: 1/2, loop: false, flip: "x"}
  });

  Q.animations("slimeAnim", {
    slime: {frames: [0,1,2,3,4,3,2,1], rate: 1/4, loop: true}
  });

  Q.stageScene("Title", 0);
});
