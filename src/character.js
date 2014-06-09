var CharSheet = {
  //STATS
	level: 1,
	hitPoints: 100,
	maxHp: 100,
	attack: 20,
	defense: 1,
	experience: 0,
	nextLevel: 50,
	heal: 1,
	healCap: 30,

  //INVENTARIO
	cards: [],
	items: new Array(36),
  helmet: undefined,
  armor: undefined,
  shield: undefined,
  weapon: undefined,

  //AUXILIARES
  selectItem: -1,
  currentButton: undefined,
	hpBar: new Q.Health(),
	expBar: new Q.Experience(),
  deleteOn: false,





	updateHp: function(hp) {
		this.hpBar.hurt();
		if (hp > this.maxHp)
			this.hitPoints = this.maxHp;
		else
			this.hitPoints = hp;
	},

	updateExp : function(exp) {
    //Si sube de nivel se actualizan las estadísticas
		if (this.experience + exp > this.nextLevel) {
			this.experience = this.experience + exp - this.nextLevel;
			this.level += 1;
      
      this.upStats(2, 1, 'all', 0.2, 10, 2);
      console.log(this.maxHp);
			Q.state.set("experience",this.experience);
			this.nextLevel = this.nextLevel * 2;
			this.expBar.train();
		}
		else {
			this.experience += exp;	
			this.expBar.train();
		}
	},

  upStats : function(atk, def, hp, heal, mHP, mHeal){
      this.attack += atk;
      this.defense += def;
      this.maxHp += mHP;

      if(hp == 'all' || this.hitPoints+hp>this.maxHp){
        this.hitPoints = this.maxHp;
      } else {
        this.hitPoints += hp;
      }
      this.heal += heal;
      this.healCap += mHeal;

      var statsHUD =  Q("StatsContainer",3).first();

      statsHUD.updateCombatStats(this.attack, this.defense);
      statsHUD.updateLevel(this.level);
      
      Q.state.set("health",this.hitPoints);
      this.hpBar.hurt();
  },

  addObject : function (collectable){
    for(var i = 0; i<this.items.length; i++){
      if(this.items[i]==undefined){
        this.items[i]=collectable;
        break;
      }
    } 
  },

  removeObjectInIndex : function(pos){
    this.items[i].destroy();
    this.items[i] = undefined;
  },

  removeSelectedObject : function(){
    this.items[this.selectItem].destroy;
    this.items[this.selectItem] = undefined;
  },

  removeObject : function(collectable){
    for(var i = 0; i<this.items.length; i++){
      if(this.items[i]==collectable){
        this.removeObjectInIndex(i);
      }
      break;
    } 
  }
};

Q.scene('inventory',function(stage) {
	//To test 
	//for(var i = 0; i<4; i++)
	// CharSheet.addObject(new Q.Weapon({name: "sword", sheet: "arma2", attack:5}));
  CharSheet.selectItem = -1;

  var equip = "yellow";
  var remove = "red";
  var notSelected = "black";

  var width = Q.width - 30;
  var height = Q.height - 65;
  var inventoryBox = stage.insert(new Q.UI.Container({
    x: Q.width/2, 
    y: 210, w:width, 
    h:height, 
    fill: "brown",
    border: true,
    shadow: true,
    shadowColor: "black", 
    outlineWidth: 2, 
  }));

  var equipmentBox = inventoryBox.insert(new Q.UI.Container({
    x: -70, 
    y: -155, 
    w:120, 
    h:80, 
    fill: "white", 
    border: true,
    shadowColor: "black", 
    outlineWidth: 2, 
  }));

  //To test
  //CharSheet.helmet = new Q.Helmet({name: "arma1", sheet: "casco1", attack:5});
  //CharSheet.shield = new Q.Shield({name: "arma1", sheet: "escudo1", attack:5});
  //CharSheet.armor = new Q.Armor({name: "arma1", sheet: "armadura1", attack:5});

  equipmentBox.insert(new Q.UI.ButtonOff({
    x: -40, 
    y: 0, 
    sheet: (CharSheet.weapon==undefined) ? undefined : CharSheet.weapon.p.sheet, 
    fill: notSelected, 
  },function() {
      console.log("soy weapon");
  } ));

  equipmentBox.insert(new Q.UI.ButtonOff({
    x: 0, 
    y: -20, 
    sheet: (CharSheet.helmet==undefined) ? undefined : CharSheet.helmet.p.sheet, 
    fill: notSelected, 
    pos:i
  },function() {
    console.log("soy helmet");
  } ));

  equipmentBox.insert(new Q.UI.ButtonOff({
    x: 0, 
    y: 20, 
    sheet: (CharSheet.armor==undefined) ? undefined : CharSheet.armor.p.sheet, 
    fill: notSelected, 
    pos:i
  },function() {
    console.log("soy armor");
  } ));

  equipmentBox.insert(new Q.UI.ButtonOff({
    x: 40, 
    y: 0, 
    sheet: (CharSheet.shield==undefined) ? undefined : CharSheet.shield.p.sheet, 
    fill: notSelected, 
    pos:i
  },function() {
    console.log("soy shield");
  } ));  

  var row = 0;
  var col = 0;
  for(var i = 0; i<CharSheet.items.length; i++){

    inventoryBox.insert(new Q.UI.ButtonOff({
      x: -width/2 + 32*(col+1) + 13*col, 
      y: -height/2 + 32*(row+4) + 13*row, 
      sheet: (CharSheet.items[i]==undefined) ? undefined : CharSheet.items[i].p.sheet, 
      fill: notSelected, 
      pos:i
  	},function() {
      if(CharSheet.selectItem==this.p.pos){
        if(!CharSheet.deleteOn){
          CharSheet.items[this.p.pos].use();
        } else {
          CharSheet.removeSelectedObject();
        }
        Q.clearStage(1);
        Q.stageScene("inventory", 1);
      } else {
        if(CharSheet.currentButton!=undefined)
        {
          CharSheet.currentButton.p.fill = notSelected;
        }
        CharSheet.selectItem=this.p.pos;
        CharSheet.currentButton = this;
        if(!CharSheet.deleteOn) {
          this.p.fill = equip;
        } else {
          this.p.fill = remove;
        }
      }
  	} ));  

  	col = col+1
  	if(col==6){
  		col=0;
  		row++;
  	}
  }

  inventoryBox.insert(new Q.UI.ButtonOff({
      x: 0, 
      y: 185, 
      w: 100, 
      h: 25,
      fill: (CharSheet.deleteOn) ? remove : "gray",
      asset: "basura.png"
    },function() {
        CharSheet.deleteOn = !CharSheet.deleteOn;
        if(CharSheet.deleteOn) {
          this.p.fill = remove;
          CharSheet.currentButton.p.fill = remove;
        } else {
          this.p.fill = "gray";
          CharSheet.currentButton.p.fill = equip;
        }
    } )); 
});