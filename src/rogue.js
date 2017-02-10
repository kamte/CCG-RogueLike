var Q = Quintus();

Q = Quintus({development: true, audioSupported: ['mp3', 'ogg'] })
.include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX, Audio")
.setup("canvas")
.touch()
.enableSound();

Q.input.keyboardControls();
Q.input.touchControls();
Q.input.joypadControls();

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
      Deck.fetchCards();
      Q.stageScene("CardsView", 0);
  });

  var instructionButton = box.insert(new Q.UI.Button({
    x: 0, y: 90, asset: "instructions.png"
  }));

  instructionButton.on("click",function() {
      Q.clearStages();
      Q.stageScene("Instructions", 0);
  });

  var creditsButton = box.insert(new Q.UI.Button({
    x: 0, y: 170, asset: "credits.png", shadow: true
  }));

  creditsButton.on("click",function() {
      Q.clearStages();
      Q.stageScene("Credits", 0);
  });
});

Q.UI.Text.extend("DescGliph",{
  init: function(p) {
    this._super({
      label: " WARNING, gliphs \n  are powerful, \n but unpredictable. \n Their effect could \n  be negative if \n the gods are not \n on your side.",
      x: 103,
      y: -170,
      color: "black",
      size: 12
    });
  },
  set: function(des) {
    this.p.label = des;
  }
});

Q.scene('CardsView',function(stage) {
  stage.insert(new Q.Sprite({asset: "cardsView.png", x: Q.width/2, y: Q.height/2}));

  var box = stage.insert(new Q.UI.Container({
    x: Q.width/2, y: Q.height/2
  }));

  var descG = box.insert(new Q.DescGliph());

  var gliphs = new Array(10);
  var fila=0;
  var columna=0;
  for(var i = 1; i<11;i++){
    if (Deck.isUnlocked[i-1]) {
      // console.log("Glifo", i-1, "desbloqueado");
      gliphs[i] = box.insert(new Q.UI.Button({
          x: -90+columna*96, y: -175+fila*119, asset: "gliph"+i+".png", num: i, des: Deck.description[i-1]
      }));
    }
    else {
      gliphs[i] = box.insert(new Q.UI.Button({
          x: -90+columna*96, y: -175+fila*119, asset: "gliph"+0+".png", num: i, des: " You have not found \n this gliph yet"
      }));
    }
    if(columna==1 && fila == 0){
      columna++;
    }
    columna++;
    if(columna==3){
      columna=0;
      fila++;
    }

    gliphs[i].on("click",function() {
      console.log(this.p.des);
      Deck.selected = this.p.num - 1;
      console.log(Deck.selected);
      descG.set("Selected: \n" + this.p.des + "\n Level: " + Deck.level[this.p.num - 1]);
    });
  }

  var playButton = box.insert(new Q.UI.Button({
    x: 102, y: 179, asset: "play2.png", keyActionName: "confirm"
  }));

  playButton.on("click",function() {
      CharSheet.restart();
      Buff.restart();
      Q.clearStages();
      Q.stageScene("level1", 0);
      Q.stageScene("HUD-background",3);
      Q.stageScene("HUD-stats",4);
  });
});


Q.scene('Credits',function(stage) {

  var box = stage.insert(new Q.UI.Container({
    x: Q.width/2, y: Q.height/2
  }));

  var playButton = box.insert(new Q.UI.Button({
    x: 0, y: 0, asset: "creditsView.png", keyActionName: "confirm"
  }));

  playButton.on("click",function() {
      Q.clearStages();
      Q.stageScene("Title", 0);
  });

});

Q.scene('Instructions',function(stage) {

  var box = stage.insert(new Q.UI.Container({
    x: Q.width/2, y: Q.height/2
  }));

  var playButton = box.insert(new Q.UI.Button({
    x: 0, y: 0, asset: "instructionsView.png", keyActionName: "confirm"
  }));

  playButton.on("click",function() {
      Q.clearStages();
      Q.stageScene("Title", 0);
  });

});

Q.scene('WinView',function(stage) {

  back = stage.insert(new Q.UI.Button({
    x: Q.width/2, y: Q.height/2, asset: "final.png", keyActionName: "confirm"
  }));
  
  stage.insert(new Q.Peach());

  back.on("click",function() {
      Q.clearStages();
      Q.stageScene("Title",0);
  });

});

Q.scene('GameOver',function(stage) {

  //stage.insert(new Q.Sprite({asset: "gameOver.png", x: Q.width/2, y: Q.height/2}));

  back = stage.insert(new Q.UI.Button({
    x: Q.width/2, y: Q.height/2, asset: "gameOver.png", keyActionName: "confirm"
  }));

  back.on("click",function() {
      Q.clearStages();
      Q.stageScene("Title",0);
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
    
    enemyHP.p.opacity=0;
    bossHP.p.opacity=0;
    Dungeon.generate(CharSheet.floor, stage);
    
    stage.insert(enemyHP);
    stage.insert(bossHP);


    //roll a chance to spawn a card
    var c = Deck.rollCard();
    if(c != null)
      stage.insert(c);
  }

  Q.scene("level1",function(stage) {
    setupLevel(stage);
  });


//Carga de recursos
Q.load("instructionsView.png, gameOver.png, goHome.png, final.png, Chicken.png, gliph0.png, gliph1.png, gliph2.png, gliph3.png, gliph4.png, gliph5.png, gliph6.png, gliph7.png, gliph8.png, gliph9.png, gliph10.png, GUsed.png, GnotUsed.png, cardsView.png, play2.png, card.png, card.json, fullInventory.png, skeleton.png, skeleton.json, boss3.png, boss3.json, boss2.png, boss2.json, thunder.json, thunder.png, boss1.png, boss1.json, creditsView.png, instructions.png, play.png, credits.png, basura.png, armaduras.png, armaduras.json, armas.png, armas.json, cascos.png, cascos.json, comida.png, comida.json, escudos.png, escudos.json, pociones.png, pociones.json, qucumatz.png, temploMaya.png, black.png, bat.png, bat.json, snake.png, snake.json, spider.png, spider.json, player.png, player.json, HUD-maya.png, escalera.png, escalera.json, peach.png, peach.json, texturas.png, texturas.json, slime.png, slime.json, azteca.png", function() {
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
  Q.compileSheets("peach.png", "peach.json");
  Q.compileSheets("card.png", "card.json");


  Q.animations("escAnim", {
    base: {frames: [0]}
  });

  Q.animations("cardAnim", {
    base: {frames: [0]}
  });

  Q.animations("batAnim", {
    bat: {frames: [0,1,2,3], rate: 1/4, loop: true, flip: false},
    batD: {frames: [0,1,2,3], rate: 1/4, loop: true, flip: "x"},
    batAtk: {frames: [3,4,3,4], rate: 1/6, loop: true, flip: false, next: "bat"},
    batDAtk: {frames: [3,4,3,4], rate: 1/6, loop: true, flip: "x", next: "batD"}
  });

  Q.animations("snakeAnim", {
    snake: {frames: [0,1], rate: 1/4, loop: true, flip: false},
    snakeD: {frames: [0,1], rate: 1/4, loop: true, flip: "x"},
    snakeAtk: {frames: [2,3,2,3], rate: 1/4, loop: true, flip: false, next: "snake"},
    snakeDAtk: {frames: [2,3,2,3], rate: 1/4, loop: true, flip: "x", next: "snakeD"}
  });

  Q.animations("spiderAnim", {
    spider: {frames: [0], flip: false},
    spiderD: {frames: [0], flip: "x"},
    spiderAtk: {frames: [4,5,6,7], rate: 1/4, flip: false, next: "spider"},
    spiderDAtk: {frames: [4,5,6,7], rate: 1/4, flip: "x", next: "spiderD"}
  });

  Q.animations("slimeAnim", {
    slime: {frames: [0,1,2,3,4,3,2,1], rate: 1/4, loop: true, flip: false},
    slimeD: {frames: [0,1,2,3,4,3,2,1], rate: 1/4, loop: true, flip: "x"},
    slimeAtk: {frames: [2,5,2,5], rate: 1/4, loop: true, flip: false, next: "slime"},
    slimeDAtk: {frames: [2,5,2,5], rate: 1/4, loop: true, flip: "x", next: "slimeD"}
  });

  Q.animations("skeletonAnim", {
    skeleton: {frames: [0], flip: false},
    skeletonD: {frames: [0], flip: "x"},
    skeletonAtk: {frames: [1,2], flip: false, next: "skeleton"},
    skeletonDAtk: {frames: [1,2], flip: false, next: "skeletonD"}
  });
  
  Q.animations("playerAnim", {
    standR: {frames: [0], flip: false},
    standL: {frames: [0], flip: "x"},
    walkR: {frames: [1,0,2,0], rate: 1/8, loop: false, flip: false, next: 'standR'},
    walkL: {frames: [1,0,2,0], rate: 1/8, loop: false, flip: "x", next: 'standL'},
    hurtR: {frames: [0,3], rate: 1/2, loop: false, flip: false},
    hurtL: {frames: [0,3], rate: 1/2, loop: false, flip: "x"}
  });

  Q.animations("boss1Anim", {
    boss1Stand: {frames: [0], rate: 1, flip: false},
    boss1StandD: {frames: [0], rate: 1, flip: "x"},
    boss1Attack: {frames: [0,1,2,3], rate: 1/6, next:'boss1Stand', flip: false},
    boss1AttackD: {frames: [0,1,2,3], rate: 1/6, next:'boss1StandD', flip: "x"},
    boss1Frenzy: {frames: [4], rate: 1, flip: false},
    boss1FrenzyD: {frames: [4], rate: 1, flip: "x"},
    boss1FrenzyAttack: {frames: [4,5,6,7], rate: 1/6, next: 'boss1Frenzy', flip: false},
    boss1FrenzyAttackD: {frames: [4,5,6,7], rate: 1/6, next: 'boss1FrenzyD', flip: "x"}
  });

  Q.animations("boss2Anim", {
    boss2Stand: {frames: [0], rate: 1, flip: false},
    boss2StandD: {frames: [0], rate: 1, flip: "x"},
    boss2Attack: {frames: [0,3,0,3], rate: 1/6, flip: false, next:'boss2Stand'},
    boss2AttackD: {frames: [0,3,0,3], rate: 1/6, flip: "x", next:'boss2StandD'},
    boss2Walk: {frames: [0,1,2,1], rate: 1/6, flip: false, next:'boss2Stand'},
    boss2WalkD: {frames: [0,1,2,1], rate: 1/6, flip: "x", next:'boss2StandD'},
    boss2Summon: {frames: [4,5,4,5], rate: 1/6, next: 'boss2Stand'},
    boss2SummonD: {frames: [4,5,4,5], rate: 1/6, next: 'boss2StandD'},
    boss2Dead: {frames: [6], rate: 1/6, flip: false},
    boss2Dead: {frames: [6], rate: 1/6, flip: "x"},
  });

  Q.animations("boss3Anim", {
    boss3Stand: {frames: [0], rate: 1, flip: false},
    boss3StandD: {frames: [0], rate: 1, flip: "x"},
    boss3Attack: {frames: [0,1,0,1], rate: 1/6, next:'boss3Stand', flip: false},
    boss3AttackD: {frames: [0,1,0,1], rate: 1/6, next:'boss3StandD', flip: "x"},
    boss3Thunder: {frames: [0,2,0,2], rate: 1/6, next: 'boss3Stand', flip: false},
    boss3ThunderD: {frames: [0,2,0,2], rate: 1/6, next: 'boss3StandD', flip: "x"}
  });

  Q.animations("peachAnim", {
    peach: {frames: [0,1,2,3,4,5,6,7,8], rate: 1/6, loop: true}
  });

  Q.animations("thunderAnim", {
    thunder: {frames: [0,1,2,3,2,3], rate: 1/6},
  });


  Q.stageScene("Title", 0);
});
