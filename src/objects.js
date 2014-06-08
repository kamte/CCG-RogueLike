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
  init: function(props, defaultProps) {
    this._super(Q._extend({
      gravity: 0,
      sensor: true
    },props), defaultProps);
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
  init: function(props,defaultProps) {
    this._super(Q._extend({
    },props), defaultProps);

  }
});

Q.Collectable.extend("Equipment", {
  init: function(props,defaultProps) {
    this._super(Q._extend({
      hitPoints: 0,
      maxHp: 0,
      attack: 0,
      defense: 0
    },props), defaultProps);
  },

  use: function(){
    var statsHUD =  Q("StatsContainer",3).first();

    var lostAttack = 0;
    var lostDefense = 0;

    //Equipar objeto. Si ya hay uno equipado (!= undefined) se intercambia posicion con el nuevo a equipar
    if(this.isA("Helmet")){
      if(CharSheet.helmet==undefined){
        CharSheet.helmet = this;
        CharSheet.items[CharSheet.selectItem] = undefined;
        CharSheet.currentButton.p.fill = "rgba(0,0,0,0.5)";
      } else {
        var aux = CharSheet.items[CharSheet.selectItem];
        CharSheet.items[CharSheet.selectItem] = CharSheet.helmet;
        CharSheet.helmet = aux;
        CharSheet.currentButton.p.fill = "rgba(0,0,0,0.5)";
      }
    } else if(this.isA("Weapon")){
      if(CharSheet.weapon==undefined){
        CharSheet.weapon = this;
        CharSheet.items[CharSheet.selectItem] = undefined;
      } else {
        var aux = CharSheet.items[CharSheet.selectItem];
        CharSheet.items[CharSheet.selectItem] = CharSheet.weapon;
        CharSheet.weapon = aux;
        CharSheet.currentButton.p.fill = "rgba(0,0,0,0.5)";
      }
    } else if(this.isA("Shield")){
      if(CharSheet.shield==undefined){
        CharSheet.shield = this;
        CharSheet.items[CharSheet.selectItem] = undefined;
      } else {
        var aux = CharSheet.items[CharSheet.selectItem];
        CharSheet.items[CharSheet.selectItem] = CharSheet.shield;
        CharSheet.shield = aux;
        CharSheet.currentButton.p.fill = "rgba(0,0,0,0.5)";
      }
    } else if(this.isA("Armor")){
      if(CharSheet.armor==undefined){
        CharSheet.armor = this;
        CharSheet.items[CharSheet.selectItem] = undefined;
      } else {
        var aux = CharSheet.items[CharSheet.selectItem];
        CharSheet.items[CharSheet.selectItem] = CharSheet.armor;
        CharSheet.armor = aux;
        CharSheet.currentButton.p.fill = "rgba(0,0,0,0.5)";
      }
    }

    //Actualizar estadísticas
    if(CharSheet.items[CharSheet.selectItem]!=undefined){
      lostAttack = CharSheet.items[CharSheet.selectItem].p.attack;
      lostDefense = CharSheet.items[CharSheet.selectItem].p.defense;
    }
    CharSheet.attack += this.p.attack - lostAttack;
    CharSheet.defense += this.p.defense - lostDefense;
    statsHUD.updateCombatStats(CharSheet.attack, CharSheet.defense);

    //Deseleccionar objeto del inventario
    CharSheet.selectItem = -1;
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

Q.Collectable.extend("Potion", {
  init: function(props,defaultProps) {
    this._super(Q._extend({
      sheet: "pocion1",
      name: "pocion",
      hitPoints: 0,
      maxHp: 0,
      attack: 0,
      defense: 0, 
      heal: 0,
      maxHeal: 0
    },props), defaultProps);
  },

  use: function(){
    CharSheet.upStats(this.p.attack, this.p.defense, this.p.hitPoints, this.p.heal, this.p.maxHp, this.p.maxHeal);
    CharSheet.removeSelectedObject();
  }
});

Q.Collectable.extend("Food", {
  init: function(props,defaultProps) {
    this._super(Q._extend({
      sheet: "comida1",
      name: "comida",
      hitPoints: 0,
    },props), defaultProps);
  },

  use: function(){
    CharSheet.upStats(0, 0, this.p.hitPoints, 0, 0, 0);
    CharSheet.removeSelectedObject();
  }
});