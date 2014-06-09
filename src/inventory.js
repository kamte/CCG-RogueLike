Q.UI.Text.extend("EquipDesc",{
  init: function(p) {
    this._super({
      label: "",
      x: 0,
      y: -40,
      color: "black",
      size: 10
    });
  },
  set: function(desc) {
    if(desc == null || desc==undefined){
      this.p.label = "";
    } else {
      this.p.label = desc;
      this.p.color = "blue";
    }
  }
});

Q.UI.Text.extend("HpDesc",{
  init: function(p) {
    this._super({
      label: "",
      x: -45,
      y: 10,
      color: "black",
      size: 10
    });
  },
  set: function(hp) {
    if(hp == null || hp==undefined){
      this.p.label = "";
    } else if(hp==0) {
      this.p.label = "HP : +0";
      this.p.color = "black";
    } else if(hp>0) {
      this.p.label = "HP : +" + hp;
      this.p.color = "green";
    } else {
      this.p.label = "HP : " + hp;
      this.p.color = "red";
    }
  }
});

Q.UI.Text.extend("AtkDesc",{
  init: function(p) {
    this._super({
      label: "",
      x: -45,
      y: 22,
      color: "black",
      size: 10
    });
  },
  set: function(atk) {
    if(atk == null || atk==undefined){
      this.p.label = "";
    } else if(atk==0) {
      this.p.label = "ATK: +0";
      this.p.color = "black";
    } else if(atk>0) {
      this.p.label = "ATK: +" + atk;
      this.p.color = "green";
    } else {
      this.p.label = "ATK: " + atk;
      this.p.color = "red";
    }
  }
});

Q.UI.Text.extend("DefDesc",{
  init: function(p) {
    this._super({
      label: "",
      x: -45,
      y: 34,
      color: "black",
      size: 10
    });
  },
  set: function(def) {
    if(def == null || def==undefined){
      this.p.label = "";
    } else if(def==0) {
      this.p.label = "DEF: +0";
      this.p.color = "black";
    } else if(def>0) {
      this.p.label = "DEF: +" + def;
      this.p.color = "green";
    } else {
      this.p.label = "DEF: " + def;
      this.p.color = "red";
    }
  }
});

var hpDesc = new Q.HpDesc();
var atkDesc = new Q.AtkDesc();
var defDesc = new Q.DefDesc();
var equipDesc = new Q.EquipDesc();

var updateDesc = function (item, equip){
  var maxHp = null;
  var attack = null;
  var defense = null;

  if(item != undefined) {
    maxHp = item.p.maxHp;
    attack = item.p.attack;
    defense = item.p.defense;
  }

  equipDesc.set(equip);
  hpDesc.set(maxHp);
  atkDesc.set(attack);
  defDesc.set(defense);
}

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
    y: 210, 
    w:width, 
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

  var descriptionBox = inventoryBox.insert(new Q.UI.Container({
    x: 65, 
    y: -155, 
    w: 135, 
    h: 90, 
    fill: "white",
    border: true,
    outlineWidth: 2, 
  }));

  descriptionBox.insert(equipDesc);
  descriptionBox.insert(hpDesc);
  descriptionBox.insert(atkDesc);
  descriptionBox.insert(defDesc);
  updateDesc();

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
      updateDesc(CharSheet.weapon, "Arma equipada");
      CharSheet.currentButton.p.fill = notSelected;
      CharSheet.selectItem = -1;
  } ));

  equipmentBox.insert(new Q.UI.ButtonOff({
    x: 0, 
    y: -20, 
    sheet: (CharSheet.helmet==undefined) ? undefined : CharSheet.helmet.p.sheet, 
    fill: notSelected, 
    pos:i
  },function() {
    updateDesc(CharSheet.helmet, "Casco equipado");
    CharSheet.currentButton.p.fill = notSelected;
    CharSheet.selectItem = -1;
  } ));

  equipmentBox.insert(new Q.UI.ButtonOff({
    x: 0, 
    y: 20, 
    sheet: (CharSheet.armor==undefined) ? undefined : CharSheet.armor.p.sheet, 
    fill: notSelected, 
    pos:i
  },function() {
    updateDesc(CharSheet.armor, "Armadura equipada");
    CharSheet.currentButton.p.fill = notSelected;
    CharSheet.selectItem = -1;
  } ));

  equipmentBox.insert(new Q.UI.ButtonOff({
    x: 40, 
    y: 0, 
    sheet: (CharSheet.shield==undefined) ? undefined : CharSheet.shield.p.sheet, 
    fill: notSelected, 
    pos:i
  },function() {
    updateDesc(CharSheet.shield, "Escudo equipado");
    CharSheet.currentButton.p.fill = notSelected;
    CharSheet.selectItem = -1;
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
        updateDesc(CharSheet.items[this.p.pos]);
        CharSheet.selectItem=this.p.pos;
        CharSheet.currentButton = this;
        //Color que indica la selección
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