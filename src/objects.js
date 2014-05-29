Q.Sprite.extend("Escalera", {
	init: function(p) {
   		this._super(p,{
   			sheet: "escalera",
        sprite: "escAnim",
   			gravity: 0, 
        sensor: true
   		});

   		this.on("sensor",this,function(collision){
   			if(collision.isA("Player")) {
   				Q.clearStages();
          Q.stageScene("level1", 0);
          Q.stageScene("HUD-background",1);
          Q.stageScene("HUD-stats",2);
   			}
   		});
   	}
});

Q.Sprite.extend("Collectable", {
  init: function(p) {
    this._super(p, {
      gravity: 0,
      sensor: true
    });
    this.on("sensor",this,"recoge");
  },
  recoge: function(collision) {
    if(collision.isA("Player")) {
      if(this.isA("Card")) {
        //add to card array, TODO
        var c = new Q.Card();
        c.p.sprite = this.p.sprite;
        c.p.sheet = this.p.sheet;
        CharSheet.cards.push(c);
      }
      else {
        //add to item array
        var e = new Q.Equipment();
        e.p.hitPoints = this.p.hitPoints;
        e.p.maxHp = this.p.maxHp;
        e.p.attack = this.p.attack;
        e.p.defense = this.p.defense;
        e.p.sprite = this.p.sprite;
        e.p.sheet = this.p.sheet;

        CharSheet.items.push(e);
        console.log("Objeto recogido!");
      }
      this.destroy();
    }
  }
});

Q.Collectable.extend("Card", {
  init: function(p) {
    this._super(p, {
    });

  }
});

Q.Collectable.extend("Equipment", {
  init: function(p) {
    this._super(p, {
        hitPoints: 0,
        maxHp: 0,
        attack: 0,
        defense: 0
    });
  }
});