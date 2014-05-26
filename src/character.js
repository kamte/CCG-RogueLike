var CharSheet = {
	hitPoints: 100,
	maxHp: 100,
	attack: 20,
	defense: 1,
	experience: 0,
	nextLevel: 50,
	cards: [],
	items: [],
	hpBar: new Q.Health(),
	expBar: new Q.Experience(),

	updateHp: function(hp) {
		this.hpBar.hurt();
		if (hp > this.maxHp)
			this.hitPoints = maxHp;
		else
			this.hitPoints = hp;
	},

	updateExp : function(exp) {
		if (this.experience + exp > this.nextLevel) {
			this.experience = this.experience + exp - this.nextLevel;
			Q.state.set("experience",this.experience);
			this.nextLevel = this.nextLevel * 2;
			this.expBar.train();
			//LEVELUP
			
		}
		else {
			this.experience += exp;	
			this.expBar.train();
		}
	}

};