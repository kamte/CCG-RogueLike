var Deck = {

	isUnlocked: [],
	total: 5,
	unlocked: 0,
	
	fetchCards: function() {
		if (typeof window.localStorage != "undefined") {
			if (localStorage.getItem("saved") === "yes") {
				for (var i=0; i<this.total; ++i)
					this.isUnlocked[i] = (localStorage.getItem(i)==="true") ? true : false;
				for (var i=0; i<this.total; i++) {
					if (this.isUnlocked[i])
						this.unlocked++;
				}
			}
			else {
				console.log("No card save found");
				for (var i=0; i<this.total; ++i)
					this.isUnlocked[i] = false;
			}
		}
		else
			console.log("Local Storage not supported. The game will not be saved.");
	},

	saveCards: function() {
		if (typeof window.localStorage != "undefined") {
			localStorage.setItem("saved", "yes");
			for (var i=0; i < this.total; ++i) {
				localStorage.setItem(""+i, this.isUnlocked[i]);
			}
		}
		else
			console.log("Local Storage not supported. The game will not be saved.");
	},

	clearCards: function() {
		if (typeof window.localStorage != "undefined") 
			localStorage.clear();
	},

	rollCard: function() {
		var chance = Aux.newRandom(1,100);
		if (chance > 0) {
			console.log("spawning card!");
			var c = Deck.newCard();
			return Dungeon.insertNextToPlayer(c);
		}
		return null;
	},

	newCard: function() {
		if (this.unlocked == this.total)
			return null;
		var locked = [];
		for (var i=0; i< this.total; i++) {
			if (!this.isUnlocked[i]) {
				locked.push(i);
			}
		}
		var index = locked[Aux.newRandom(0,locked.length-1)];
		console.log("carta tipo", index);
		return new Q.Card({ident: index});
	},

	getSkill: function(cardNumber) {
		var lvl = CharSheet.level;
		var n, v;
		switch (cardNumber) {
			case 0: //Aumenta o disminuye el ataque del jugador en un valor de 5 veces el piso actual durante un piso.
				n = Math.round(Math.random());
				v = (n == 0) ? 5*lvl : -5*lvl;
				CharSheet.buffStat("atk", CharSheet.attack+v, 10, (v > 0));
				break;
			case 1: //Aumenta o disminuye la defensa del jugador en un valor de 4 veces el piso actual durante un piso.
				n = Math.round(Math.random());
				v = (n == 0) ? 4*lvl : -4*lvl;
				CharSheet.buffStat("def", CharSheet.attack+v, 10, v > 0);
				break;
			case 2: //Spawnea 4 objetos en torno al personaje o 4 arañas con un 30% de probabilidad.
				n = Aux.newRandom(0,10);
				if (n >= 7) {
					for (var j=0; j<4; ++j)
						Q.stage(0).insert(Dungeon.insertNextToPlayer(new Q.Spider()));
				}
				else
					for (var j=0; j<4; ++j)
						Q.stage(0).insert(Dungeon.insertNextToPlayer(objectGenerator.spawn()));
				break;
			case 3: //Reduce a la mitad el daño recibido, o lo duplica con un 30% de probabilidad durante 5 ataques.
				n = Aux.newRandom(0,10);
				Buff.type = "dmgMultiplier";
				if (n >= 7)
					Buff.buffCounter = -5;
				else 
					Buff.buffCounter = 5;
				break;
			case 4: //Cura completamente al jugador o le quita la mitad de su vida actual:
				n = Aux.newRandom(0,10);
				if (n >=7)
					CharSheet.updateHp(Math.floor(CharSheet.hitPoints / 2));
				else
					CharSheet.updateHp(Math.floor(CharSheet.maxHp));
				break;
		}
	}
};