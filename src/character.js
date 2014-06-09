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

