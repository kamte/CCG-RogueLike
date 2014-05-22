var CharSheet = {
	hitPoints: 100,
	maxHp: 100,
	attack: 20,
	defense: 1,
	cards: [],
	items: [],

	updateHp: function(hp) {

		if (hp > this.maxHp)
			this.hitPoints = maxHp;
		else
			this.hitPoints = hp;
	}

};