var CharSheet = {
	hitPoints: 100,
	maxHp: 100,
	attack: 20,
	defense: 1,
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
	}

};