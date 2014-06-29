Q.UI.ButtonOff = Q.UI.Button.extend("UI.ButtonOff", {
    init: function(p, callback, defaultProps) {
      this._super(Q._defaults(p||{},defaultProps),{
        type: Q.SPRITE_UI | Q.SPRITE_DEFAULT,
        keyActionName: null
      });
      if(this.p.label && (!this.p.w || !this.p.h)) {
        Q.ctx.save();
        this.setFont(Q.ctx);
        var metrics = Q.ctx.measureText(this.p.label);
        Q.ctx.restore();
        if(!this.p.h) {  this.p.h = 24 + 20; }
        if(!this.p.w) { this.p.w = metrics.width + 20; }
      }

      if(isNaN(this.p.cx)) { this.p.cx = this.p.w / 2; }
      if(isNaN(this.p.cy)) { this.p.cy = this.p.h / 2; }
      this.callback = callback;
      //this.on('touch',this,"highlight");
      //this.on('touchEnd',this,"push");
      if(this.p.keyActionName) {
        Q.input.on(this.p.keyActionName,this,"push");
      }
    },

    highlight: function() {
    }
  });

Q.UI.Text.extend("FloorLabel",{
  init: function(p) {
    this._super({
      label: "Floor: " + CharSheet.floor,
      x: 185,
      y: 44,
      color: "white",
      size: 12
    });
  },
  act: function() {
    this.p.label = "Floor: " + CharSheet.floor;
  }
});

Q.UI.Text.extend("StatsHP",{
  init: function(p) {
    this._super({
      label: "Health: " + Q.state.get("health") + "/" + CharSheet.maxHp,
      x: 10,
      y: 20,
      color: "white",
      size: 10
    });
    Q.state.on("change.health",this,"hp");
  },
  hp: function(hitP) {
    if (hitP < 0)
      hitP = 0;
    this.p.label = "Health: " + hitP + "/" + CharSheet.maxHp;
    CharSheet.hpBar.hurt();
  }, 
  set: function(maxHp) {
    if(maxHp<CharSheet.hitPoints){
      CharSheet.updateHp(maxHp);
    }
    this.p.label = "Health: " + CharSheet.hitPoints + "/" + maxHp;
    CharSheet.hpBar.hurt();
  }
});

Q.UI.Text.extend("StatsExp",{
  init: function(p) {
    this._super({
      label: "Exp: " + Q.state.get("experience"),
      x: -10,
      y: 8,
      color: "white",
      size: 10
    });
    Q.state.on("change.experience",this,"train");
  },
  train: function(exp) {
    this.p.label = "Exp: " + exp;
  }
});

Q.UI.Text.extend("StatsAtk",{
  init: function(p) {
    this._super({
      label: "Attack: " + CharSheet.attack,
      x: -2,
      y: 32,
      color: "white",
      size: 10
    });
  },
  set: function(atk) {
    this.p.label = "Attack: " + atk;
  }
});

Q.UI.Text.extend("StatsDef",{
  init: function(p) {
    this._super({
      label: "Defense: " + CharSheet.defense,
      x: 0,
      y: 44,
      color: "white",
      size: 10
    });
  },
  set: function(def) {
    this.p.label = "Defense: " + def;
  }
});

Q.UI.Text.extend("StatsLvl",{
  init: function(p) {
    this._super({
      label: "Level: " + CharSheet.level,
      x: 60,
      y: 32,
      color: "white",
      size: 10
    });
  },
  set: function(lvl) {
    this.p.label = "Level: " + lvl;
  }
});

Q.Sprite.extend("MaxHealth",{
  init: function(p) {
    this._super(p,{
      color: "black",
      w: 102,
      h: 9,
      x: 115,
      y: 21
    });
  },

  draw: function(ctx) {
    ctx.fillStyle = this.p.color;
    ctx.fillRect(-this.p.cx, -this.p.cy, this.p.w, this.p.h);
  }
});

Q.Sprite.extend("Health",{
  init: function(p) {
    this._super(p,{
      color: "red",
      w: 100,
      h: 7,
      x: 115,
      y: 21
    });
  },

  hurt: function(){
    if (this.p.w < 0)
      this.p.w = 0;
    else
      this.p.w = (CharSheet.hitPoints/CharSheet.maxHp)*100;
  },

  draw: function(ctx) {
    ctx.fillStyle = this.p.color;
    ctx.fillRect(-this.p.cx, -this.p.cy, this.p.w, this.p.h);
  }
});

Q.Sprite.extend("MaxExperience",{
  init: function(p) {
    this._super(p,{
      color: "black",
      w: 171,
      h: 5,
      x: 109,
      y: 8
    });
  },

  draw: function(ctx) {
    ctx.fillStyle = this.p.color;
    ctx.fillRect(-this.p.cx, -this.p.cy, this.p.w, this.p.h);
  }
});

Q.Sprite.extend("Experience",{
  init: function(p) {
    this._super(p,{
      color: "yellow",
      w: 0,
      h: 3,
      x: 25,
      y: 8
    });
  },

  train: function(){
    this.p.w = (CharSheet.experience/CharSheet.nextLevel) * 170;
  },

  draw: function(ctx) {
    ctx.fillStyle = this.p.color;
    ctx.fillRect(-this.p.cx, -this.p.cy, this.p.w, this.p.h);
  }
});

Q.Sprite.extend("HUDbg", {
    init: function(p) {
        this._super(p, {   
            asset: "HUD-maya.png", x: 0, y: 0
        });
        this.add('2d');
    },
});

Q.scene('HUD-background', function(stage){
    var box = stage.insert(new Q.UI.Container({
    x:Q.width/2, y: Q.height/2
  }));
    box.insert(new Q.HUDbg());
});

Q.Sprite.extend("Gstate", {
    init: function(p) {
        this._super(p, {   
            asset: "GnotUsed.png", x: 120, y: 40
        });
        this.add('2d');
    },

    used: function(){
      this.p.asset = "GUsed.png";
    }
});

Q.UI.Container.extend("StatsContainer",{
  init: function(p) {
    this._super({
      x: 110, 
      y: Q.height-55,
      HPlabel: new Q.StatsHP(),
      EXPlabel: new Q.StatsExp(),
      ATKlabel: new Q.StatsAtk(),
      DEFlabel: new Q.StatsDef(),
      LVLlabel: new Q.StatsLvl(),
      FloorLabel: new Q.FloorLabel()
    });
  },

  updateCombatStats: function(atk, def, hp) {
    this.p.ATKlabel.set(atk);
    this.p.DEFlabel.set(def);
    this.p.HPlabel.set(hp);
  },

  updateLevel: function(lvl) {
    this.p.LVLlabel.set(lvl);
  }, 

  initLabels: function(){
    this.insert(this.p.HPlabel);
    this.insert(this.p.EXPlabel);
    this.insert(this.p.ATKlabel);
    this.insert(this.p.DEFlabel);
    this.insert(this.p.LVLlabel);
    this.insert(this.p.FloorLabel);
  }
});

var gState;

Q.scene('HUD-stats',function(stage) {
  var container = stage.insert(new Q.StatsContainer());

  container.initLabels();
  container.insert(new Q.MaxExperience());
  container.insert(new Q.MaxHealth());
  container.insert(CharSheet.hpBar);
  container.insert(CharSheet.expBar);
  container.fit(20);
  gState = new Q.Gstate();
  container.insert(gState);
  if (Deck.cardUsed)
    gState.used();
});

Q.Sprite.extend("EnemyHealth",{
  init: function(p) {
    this._super(p,{
      color: "red",
      w: 32,
      h: 4,
      x: 50,
      y: 50,
      enemy: undefined,
      opacity: 0,
      type: Q.SPRITE_UI
    });
  },

  draw: function(ctx) {
    if(this.p.enemy!=undefined){
      this.p.x=this.p.enemy.p.x;
      this.p.y=this.p.enemy.p.y+16;
    }
    ctx.fillStyle = this.p.color;
    ctx.fillRect(-this.p.cx, -this.p.cy, this.p.w, this.p.h);
  },

  hit: function(enemy){
    this.p.enemy = enemy;
    if(enemy.p.hitPoints>=0){
      this.p.x=enemy.p.x;
      this.p.y=enemy.p.y+16;
      this.p.opacity=1;
      this.p.w=(enemy.p.hitPoints/enemy.p.maxHitPoints)*32;
    } else {
      this.p.enemy=undefined;
      this.p.opacity=0;
      this.p.w=0;
    }
  }
});

Q.Sprite.extend("BossHealth",{
  init: function(p) {
    this._super(p,{
      color: "red",
      w: 64,
      h: 4,
      x: 50,
      y: 100,
      opacity: 0,
      boss: undefined,
      type: Q.SPRITE_UI
    });
  },

  draw: function(ctx) {
    if(this.p.boss!=undefined){
      this.p.x=this.p.boss.p.x;
      this.p.y=this.p.boss.p.y+32;
    }
    ctx.fillStyle = this.p.color;
    ctx.fillRect(-this.p.cx, -this.p.cy, this.p.w, this.p.h);
  },

  hit: function(boss){
    this.p.boss=boss;
    if(boss.p.hitPoints>=0){
      this.p.x=boss.p.x;
      this.p.y=boss.p.y+32;
      this.p.opacity=1;
      this.p.w=(boss.p.hitPoints/boss.p.maxHitPoints)*64;
    } else {
      this.p.boss==undefined;
      this.p.opacity=0;
      this.p.w=0;
    }
  }
});

var enemyHP = new Q.EnemyHealth();
var bossHP = new Q.BossHealth();

Q.UI.Button.extend("InventoryTroll",{
  init: function(p) {
    this._super({
      x:0,
      y:0,
      asset: "fullInventory.png",
      keyActionName: "confirm, fire",
      opacity: 1
    });
  }
});

var textFullInventory = undefined;
 
Q.scene('HUD-mss',function(stage) {
  //var container = stage.insert(new Q.UI.Container());
  var box = stage.insert(new Q.UI.Container({
    x:Q.width/2, y: Q.height/2
  }));
  textFullInventory = new Q.InventoryTroll();

  textFullInventory.on("click",function() {
    Q.clearStage(2);
  });
  box.insert(textFullInventory);
});

Q.UI.Button.extend("Troll",{
  init: function(p) {
    this._super({
      x:0,
      y:0,
      asset: "Chicken.png",
      keyActionName: "confirm, fire",
      opacity: 1
    });
  }
});

Q.scene('HUD-chicken',function(stage) {
  //var container = stage.insert(new Q.UI.Container());
  var box = stage.insert(new Q.UI.Container({
    x:Q.width/2, y: Q.height/2
  }));
  textFullInventory = new Q.Troll();

  textFullInventory.on("click",function() {
    Q.clearStage(2);
  });
  box.insert(textFullInventory);
});