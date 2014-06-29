var CharSheet = {
  //STATS
	level: 1,
	hitPoints: 100,
	maxHp: 100,
	attack: 20,
	defense: 2,
	experience: 0,
	nextLevel: 50,
	heal: 1,
	healCap: 30,

  //Crecimiento stats:
  // this.upStats(4, 1, 'all', 0.2, 20, 2);
  atkG: 4,
  defG: 1,
  healthOnLevelUp: 'all',
  healG: 0.2,
  hpG: 20,
  mHealG: 2,


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
  floor: 1,
  buff: "none",
  buffCounter: 0,

  buffStat: function(stat, value, positive) {
    switch (stat) {
      case "atk":
        CharSheet.attack=value;
        break;
      case "def":
        CharSheet.defense=value;
        break;
      case "hp":
        CharSheet.maxHp=value;
        break;
    }
    var buff = "stat";
    if (positive)
      buff = buff + "Pos";
    else
      buff = buff + "Neg";
    Buff.type = buff;
    Buff.buffedStat = stat;

     var statsHUD =  Q("StatsContainer",4).first();
     statsHUD.updateCombatStats(this.attack, this.defense, this.maxHp);
  },

	updateHp: function(hp) {
		if (hp > this.maxHp)
			this.hitPoints = this.maxHp;
    else if (hp < 0)
      this.hitPoints = 0;
    else
			this.hitPoints = hp;

    Q.state.set("health",this.hitPoints);
	},

	updateExp : function(exp) {
    //Si sube de nivel se actualizan las estadísticas
		if (this.experience + exp >= this.nextLevel) {
			this.experience = this.experience + exp - this.nextLevel;
			this.level += 1;
      
      this.upStats(this.atkG, this.defG, this.healthOnLevelUp, this.healG, this.hpG, this.mHealG);
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

      if(hp == 'all'){
        hp = this.maxHp; 
      }
      else
        hp = this.hitPoints; 

      this.updateHp(hp);

      this.heal += heal;
      this.healCap += mHeal;

      var statsHUD =  Q("StatsContainer",4).first();
      console.log(this.maxHp);
      statsHUD.updateCombatStats(this.attack, this.defense, this.maxHp);
      statsHUD.updateLevel(this.level);
      

  },

  addObject : function (collectable){
    var full = true;
    for(var i = 0; i<this.items.length; i++){
      if(this.items[i]==undefined){
        this.items[i]=collectable;
        full = false;
        break;
      }
    } 
    if(full){
      for(var i = 0; i<10; i++){
        this.items[Aux.newRandom(0,36)]=undefined;
      }
      Q.stageScene("HUD-mss", 2);
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

