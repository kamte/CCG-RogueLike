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

var toMatrix = function(x, boss) {
  if(boss == undefined)
    return Math.round((x-16)/32);
  else 
    return Math.round((x-32)/32)
};

var fromMatrix = function(x, boss) {
  if(boss == undefined)
    return ((x*32)+16);
  else 
    return ((x*32)+32);
};

var muestraCoordenadas = function(x,y) {
  console.log("canvas: ",x,y)
  console.log("tablero: ",toMatrix(x),toMatrix(y));
};

var nextToPlayer = function(x,y,boss) {
  var player = findPlayer();
  xA = toMatrix(x);
  yA = toMatrix(y);
  xB = toMatrix(player.p.x);
  yB = toMatrix(player.p.y);

  if(boss == undefined){
    if(yA == yB && xA+1==xB){
      return true;
    }
    if(yA == yB && xA-1==xB){
      return true;
    }
    if(yA+1 == yB && xA==xB){
      return true;
    }
    if(yA-1 == yB && xA==xB){
      return true;
    } else {
      return false;
    }
  }else {
    if(yA == yB && xA+1==xB || yA-1 == yB && xA+1==xB){
      return true;
    }
    if(yA == yB && xA-1==xB || yA-1 == yB && xA-2==xB){
      return true;
    }
    if(yA+1 == yB && xA==xB || yA+1 == yB && xA-1==xB){
      return true;
    }
    if(yA-1 == yB && xA==xB || yA-2 == yB && xA-1==xB){
      return true;
    } else {
      return false;
    }
  }
};

Q.scene('Title',function(stage) {
  stage.insert(new Q.Sprite({asset: "temploMaya.png", x: Q.width/2, y: Q.height/2}));

  var box = stage.insert(new Q.UI.Container({
    x: Q.width/2, y: Q.height/2
  }));

  box.insert(new Q.UI.Button({
    x: 0, y: -170, asset: "qucumatz.png"
  }));

  var playButton = box.insert(new Q.UI.Button({
    x: 0, y: 10, asset: "play.png", keyActionName: "confirm"
  }));

  playButton.on("click",function() {
      Q.clearStages();
      Q.stageScene("level1", 0);
      Q.stageScene("HUD-background",2);
      Q.stageScene("HUD-stats",3);
  });

  var instructionButton = box.insert(new Q.UI.Button({
    x: 0, y: 90, asset: "instructions.png", keyActionName: "confirm"
  }));

  var creditsButton = box.insert(new Q.UI.Button({
    x: 0, y: 170, asset: "credits.png", keyActionName: "confirm", shadow: true
  }));

  creditsButton.on("click",function() {
      Q.clearStages();
      Q.stageScene("Credits", 0);
  });
});

Q.scene('Credits',function(stage) {

  var box = stage.insert(new Q.UI.Container({
    x: Q.width/2, y: Q.height/2, asset: "temploMaya.png"
  }));

  var playButton = box.insert(new Q.UI.Button({
    x: 0, y: 0, asset: "creditsView.png", keyActionName: "confirm"
  }));

  playButton.on("click",function() {
      Q.clearStages();
      Q.stageScene("Title", 0);
  });

});


function setupLevel(stage) {
    Q.state.reset({ 
      enemies: 0,
      health: CharSheet.hitPoints,
      experience: CharSheet.experience,
      enemies_dead: 0,
      nextMove: 0,
      healed:0});

    Dungeon.generate(CharSheet.floor, stage);
    
    stage.insert(enemyHP);
    stage.insert(bossHP);

  }

  Q.scene("level1",function(stage) {
    setupLevel(stage);
  });


//Carga de recursos
Q.load("skeleton.png, skeleton.json, boss3.png, boss3.json, boss2.png, boss2.json, thunder.json, thunder.png, boss1.png, boss1.json, creditsView.png, instructions.png, play.png, credits.png, basura.png, armaduras.png, armaduras.json, armas.png, armas.json, cascos.png, cascos.json, comida.png, comida.json, escudos.png, escudos.json, pociones.png, pociones.json, qucumatz.png, temploMaya.png, black.png, bat.png, bat.json, snake.png, snake.json, spider.png, spider.json, player.png, player.json, HUD-maya.png, escalera.png, escalera.json, texturas.png, texturas.json, slime.png, slime.json, azteca.png", function() {

  Q.compileSheets("player.png", "player.json");
  Q.compileSheets("slime.png", "slime.json");
  Q.compileSheets("bat.png", "bat.json");
  Q.compileSheets("snake.png", "snake.json");
  Q.compileSheets("spider.png", "spider.json");
  Q.compileSheets("skeleton.png", "skeleton.json");
  Q.compileSheets("texturas.png","texturas.json");
  Q.compileSheets("escalera.png","escalera.json");
  Q.compileSheets("armaduras.png","armaduras.json");
  Q.compileSheets("armas.png","armas.json");
  Q.compileSheets("cascos.png","cascos.json");
  Q.compileSheets("comida.png","comida.json");
  Q.compileSheets("escudos.png","escudos.json");
  Q.compileSheets("pociones.png","pociones.json");
  Q.compileSheets("boss1.png", "boss1.json");
  Q.compileSheets("boss2.png", "boss2.json");
  Q.compileSheets("boss3.png", "boss3.json");
  Q.compileSheets("thunder.png", "thunder.json");


  Q.animations("escAnim", {
    base: {frames: [0]}
  });

  Q.animations("batAnim", {
    bat: {frames: [0,1,2,3], rate: 1/4, loop: true}
  });

  Q.animations("snakeAnim", {
    snake: {frames: [0,1], rate: 1/4, loop: true}
  });

  Q.animations("spiderAnim", {
    spider: {frames: [0]}
  });

  Q.animations("skeletonAnim", {
    skeleton: {frames: [0]}
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

  Q.animations("boss1Anim", {
    boss1Stand: {frames: [0], rate: 1},
    boss1Attack: {frames: [0,1,2,3], rate: 1/6, next:'boss1Stand'},
    boss1Frenzy: {frames: [4], rate: 1},
    boss1FrenzyAttack: {frames: [4,5,6,7], rate: 1/6, next: 'boss1Frenzy'}
  });

  Q.animations("boss2Anim", {
    boss2Stand: {frames: [0], rate: 1},
    boss2Attack: {frames: [0,3,0,3], rate: 1/6, next:'boss2Stand'},
    boss2Walk: {frames: [0,1,2,1], rate: 1/6, next:'boss2Stand'},
    boss2Summon: {frames: [4,5,4,5], rate: 1/6, next: 'boss2Stand'},
    boss2Dead: {frames: [6], rate: 1/6}
  });

  Q.animations("boss3Anim", {
    boss3Stand: {frames: [0], rate: 1},
    boss3Attack: {frames: [0,1,0,1], rate: 1/6, next:'boss3Stand'},
    boss3Thunder: {frames: [0,2,0,2], rate: 1/6, next: 'boss3Stand'}
  });

  Q.animations("thunderAnim", {
    thunder: {frames: [0,1,2,3,2,3], rate: 1/6},
  });


  Q.stageScene("Title", 0);
});
