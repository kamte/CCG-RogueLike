var CharSheet = {
	level: 1,
	hitPoints: 100,
	maxHp: 100,
	attack: 20,
	defense: 1,
	experience: 0,
	nextLevel: 50,
	heal: 2,
	healCap: 25,
	cards: [],
	items: new Array(36),
  helmet: undefined,
  armor: undefined,
  shield: undefined,
  weapon: undefined,
  selectItem: -1,
  currentButton: undefined,
	hpBar: new Q.Health(),
	expBar: new Q.Experience(),

	updateHp: function(hp) {
		this.hpBar.hurt();
		if (hp > this.maxHp)
			this.hitPoints = this.maxHp;
		else
			this.hitPoints = hp;
	},

	updateExp : function(exp) {
		if (this.experience + exp > this.nextLevel) {
			this.experience = this.experience + exp - this.nextLevel;
			this.level +=1;
			
			this.maxHp += 10;
			this.heal  = Math.round(this.maxHp / 50);
			this.healCap = Math.round(this.maxHp / 4);
			this.hitPoints = this.maxHp;
			Q.state.set("health",this.maxHp);
			this.hpBar.hurt();
			Q.state.set("experience",this.experience);
			this.nextLevel = this.nextLevel * 2;
			this.expBar.train();
			//LEVELUP
		}
		else {
			this.experience += exp;	
			this.expBar.train();
		}
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

  removeObject : function(collectable){
    for(var i = 0; i<this.items.length; i++){
      if(this.items[i]==collectable){
        this.removeObjectInIndex(i);
        break;
      }
    } 
  },

  equipObject : function (equipment){
    if(equipment.isA("Helmet")){
      if(this.helmet==undefined){
        this.helmet = equipment;
        this.items[this.selectItem] = undefined;
        this.currentButton.p.fill = "rgba(0,0,0,0.5)";
      } else {
        var aux = this.items[this.selectItem];
        this.items[this.selectItem] = this.helmet;
        this.helmet = aux;
        this.currentButton.p.fill = "rgba(0,0,0,0.5)";
      }
    } else if(equipment.isA("Weapon")){
      if(this.weapon==undefined){
        this.weapon = equipment;
        this.items[this.selectItem] = undefined;
      } else {
        var aux = this.items[this.selectItem];
        this.items[this.selectItem] = this.weapon;
        this.weapon = aux;
        this.currentButton.p.fill = "rgba(0,0,0,0.5)";
      }
    } else if(equipment.isA("Shield")){
      if(this.shield==undefined){
        this.shield = equipment;
        this.items[this.selectItem] = undefined;
      } else {
        var aux = this.items[this.selectItem];
        this.items[this.selectItem] = this.shield;
        this.shield = aux;
        this.currentButton.p.fill = "rgba(0,0,0,0.5)";
      }
    } else if(equipment.isA("Armor")){
      if(this.armor==undefined){
        this.armor = equipment;
        this.items[this.selectItem] = undefined;
      } else {
        var aux = this.items[this.selectItem];
        this.items[this.selectItem] = this.armor;
        this.armor = aux;
        this.currentButton.p.fill = "rgba(0,0,0,0.5)";
      }
    }
    this.selectItem = -1;
  } 

};

Q.scene('inventory',function(stage) {
	//To test 
	//for(var i = 0; i<4; i++)
	// CharSheet.addObject(new Q.Weapon({name: "sword", sheet: "arma2", attack:5}));
  CharSheet.selectItem = -1;

  var width = Q.width - 30;
  var height = Q.height - 85;
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
    y: -140, 
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
    fill: "black", 
  },function() {
      console.log("soy weapon");
  } ));

  equipmentBox.insert(new Q.UI.ButtonOff({
    x: 0, 
    y: -20, 
    sheet: (CharSheet.helmet==undefined) ? undefined : CharSheet.helmet.p.sheet, 
    fill: "black", 
    pos:i
  },function() {
    console.log("soy helmet");
  } ));

  equipmentBox.insert(new Q.UI.ButtonOff({
    x: 0, 
    y: 20, 
    sheet: (CharSheet.armor==undefined) ? undefined : CharSheet.armor.p.sheet, 
    fill: "black", 
    pos:i
  },function() {
    console.log("soy armor");
  } ));

  equipmentBox.insert(new Q.UI.ButtonOff({
    x: 40, 
    y: 0, 
    sheet: (CharSheet.shield==undefined) ? undefined : CharSheet.shield.p.sheet, 
    fill: "black", 
    pos:i
  },function() {
    console.log("soy shield");
  } ));  

  var row = 0;
  var col = 0;
  for(var i = 0; i<CharSheet.items.length; i++){

    inventoryBox.insert(new Q.UI.ButtonOff({
      x: -width/2 + 32*(col+1)+13*col, 
      y: -height/2+16 + 32*(row+4)+13*row, 
      sheet: (CharSheet.items[i]==undefined) ? undefined : CharSheet.items[i].p.sheet, 
      fill: "black", 
      pos:i
  	},function() {
      console.log("soy", CharSheet.items[this.p.pos].p.name, this.p.pos, CharSheet.items[this.p.pos].p.attack);

      if(CharSheet.selectItem==this.p.pos){
        CharSheet.items[this.p.pos].use();
        Q.clearStage(1);
        Q.stageScene("inventory", 1);
      } else {
        if(CharSheet.currentButton!=undefined)
        {
          CharSheet.currentButton.p.fill = "black";
        }
        CharSheet.selectItem=this.p.pos;
        CharSheet.currentButton = this;
        this.p.fill = "yellow";
      }
  	} ));  

  	col = col+1
  	if(col==6){
  		col=0;
  		row++;
  	}
  }
});