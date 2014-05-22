
Q.UI.Text.extend("StatsHP",{
  init: function(p) {
    this._super({
      label: "Health: " + Q.state.get("health"),
      x: 0,
      y: 20,
      color: "white",
      size: 10
    });
    Q.state.on("change.health",this,"hp");
  },
  hp: function(hitP) {
    this.p.label = "Health: " + hitP;
  }
});

Q.UI.Text.extend("StatsExp",{
  init: function(p) {
    this._super({
      label: "Exp: " + 120,
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

Q.Sprite.extend("Health",{
  init: function(p) {
    this._super(p,{
      color: "red",
      w: 100,
      h: 5,
      x: 85,
      y: 21
    });
  },

  hurt: function(){
    this.p.w = CharSheet.hitPoints;
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
      w: 170,
      h: 3,
      x: 120,
      y: 8
    });
  },

  train: function(){
    this.p.w = Q.state.get("health");
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

Q.scene('HUD-stats',function(stage) {
  var container = stage.insert(new Q.UI.Container({
    x: 110, y: Q.height-55
  }));
  container.insert(new Q.StatsHP());
  container.insert(new Q.StatsExp());
  container.insert(CharSheet.hpBar);
  container.insert(CharSheet.expBar);
  container.fit(20);
});
