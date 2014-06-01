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
          Q.stageScene("HUD-background",2);
          Q.stageScene("HUD-stats",3);
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
        var c = this;
        CharSheet.cards.push(c);
      }
      else {
        //add to item array
        var e = this;
        CharSheet.addObject(e);
        console.log("Objeto recogido!");
        // Q.stageScene("inventory", 1);
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
  },

  use: function(){
    console.log("use")
    CharSheet.equipObject(this);
  }
});

Q.Equipment.extend("Weapon", {
  init: function(p) {
    this._super(p, {
      sheet: "arma20",
      name: "weapon"
    });
  }
});

Q.Equipment.extend("Helmet", {
  init: function(p) {
    this._super(p, {
      sheet: "casco3",
      name: "helmet"
    });
  }
});

Q.Equipment.extend("Armor", {
  init: function(p) {
    this._super(p, {
      sheet: "armadura4",
      name: "armor"
    });
  }
});

Q.Equipment.extend("Shield", {
  init: function(p) {
    this._super(p, {
      sheet: "escudo2",
      name: "shield"
    });
  }
});