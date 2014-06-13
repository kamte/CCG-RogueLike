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
      sensor: true,
      tier: 0,     
      sheet: "",
      name: "",
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
      maxHp: 0,
      attack: 0,
      defense: 0
    },props), defaultProps);
  },

  use: function(){
    var statsHUD =  Q("StatsContainer",3).first();

    var lostAttack = 0;
    var lostDefense = 0;
    var lostHP = 0;

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
      lostHP = CharSheet.items[CharSheet.selectItem].p.maxHp;
    }
    CharSheet.attack += this.p.attack - lostAttack;
    CharSheet.defense += this.p.defense - lostDefense;
    CharSheet.maxHp += this.p.maxHp - lostHP;

    statsHUD.updateCombatStats(CharSheet.attack, CharSheet.defense, CharSheet.maxHp);

    //Deseleccionar objeto del inventario
    CharSheet.selectItem = -1;
  } 

});

Q.Equipment.extend("Weapon", {
  init: function(p) {
    this._super(p, {
    });
  },

  statear: function(atk, def, hp){
      this.p.attack = Math.abs(atk*this.p.tier);
      this.p.maxHp = Math.floor(hp*this.p.tier/3);

      if(def <= 0)
        this.p.defense=def*this.p.tier;       
  }
});

Q.Equipment.extend("Helmet", {
  init: function(p) {
    this._super(p, {
    });
  },

  statear: function(atk, def, hp){
      this.p.maxHp = Math.abs(hp*this.p.tier);
      this.p.defense = Math.floor(def*this.p.tier/3);

      if(atk <= 0)
          this.p.attack=def*this.p.tier;
  }
});

Q.Equipment.extend("Armor", {
  init: function(p) {
    this._super(p, {
    });
  },

  statear: function(atk, def, hp){
    this.p.defense = Math.abs(def*this.p.tier);
    this.p.maxHp = Math.floor(hp*this.p.tier/3);

    if(atk<=0)
        this.p.attack=atk*this.p.tier;
  }
});

Q.Equipment.extend("Shield", {
  init: function(p) {
    this._super(p, {
    });
  },

  statear: function(atk, def, hp){
    this.p.defense = Math.abs(def*this.p.tier);
    this.p.attack = Math.floor(atk*this.p.tier/3);

    if(hp<=0)
        this.p.maxHp=hp*this.p.tier;
  }
});

Q.Collectable.extend("Potion", {
  init: function(props,defaultProps) {
    this._super(Q._extend({
      maxHp: 0,
      attack: 0,
      defense: 0, 
      heal: 0,
      maxHeal: 0,
      tier: 0
    },props), defaultProps);
  },

  statear: function(atk, def, hp, heal, maxHeal){
      this.p.attack= atk*this.p.tier;
      this.p.defense= def*this.p.tier;
      this.p.maxHp= hp*this.p.tier;
      this.p.heal= heal*this.p.tier;
      this.p.maxHeal= maxHeal*this.p.tier;
  },

  use: function(){
    CharSheet.upStats(this.p.attack, this.p.defense, 0, this.p.heal, this.p.maxHp, this.p.maxHeal);
    CharSheet.removeSelectedObject();
  }
});

Q.Collectable.extend("Food", {
  init: function(props,defaultProps) {
    this._super(Q._extend({
      hitPoints: 0,
    },props), defaultProps);
  },

  statear: function(hp){
     this.p.hitPoints= hp*this.p.tier;
  },

  use: function(){
    CharSheet.upStats(0, 0, this.p.hitPoints, 0, 0, 0);
    CharSheet.removeSelectedObject();
  }
});