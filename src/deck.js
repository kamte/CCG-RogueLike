var Deck = {

	isUnlocked: [],
	total: 10,
	unlocked: 0,
	description: ["Attack gliph", "Defense Gliph", "Life Gliph", "Gliph of Greed", "Gliph of Protection", "Gliph of Healing", "Gliph of Growth", "Gliph of Learning", "Gliph of \n Invulnerability", "Gliph of Travel"],
	level: [],
	selected: null,
	cardUsed: false,

	fetchCards: function() {
		if (typeof window.localStorage != "undefined") {
			if (localStorage.getItem("saved") === "yes") {
				for (var i=0; i<this.total; ++i) {
					this.isUnlocked[i] = (localStorage.getItem(i)==="true") ? true : false;
					this.level[i] = localStorage.getItem("level"+i);
				}
				for (var i=0; i<this.total; i++) {
					if (this.isUnlocked[i])
						this.unlocked++;
				}
			}
			else {
				console.log("No card save found");
				for (var i=0; i<this.total; ++i) {
					this.isUnlocked[i] = false;
					this.level[i] = 1;
				}
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
				localStorage.setItem("level"+i, this.level[i]);
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
		if (chance > 90 && Deck.unlocked < Deck.total) {
			console.log("spawning card!");
			var c = Deck.newCard();
			return Dungeon.insertEntity(c);
		}
		return null;
	},

	newCard: function() {
		if (this.unlocked == this.total)
			return null;
		var locked = [];
		for (var i=0; i< this.total; i++) {
			if (this.level[i] < 3) {
				locked.push(i);
			}
		}
		var index = locked[Aux.newRandom(0,locked.length-1)];
		console.log("carta tipo", index);
		return new Q.Card({ident: index});
	},

	//niveles de cartas (hasta 3)
	//mejorar vida
	getSkill: function(cardNumber) {
		var floor = CharSheet.floor;
		var n, v, p, item;
		switch (cardNumber) {
			case 0: //Aumenta o disminuye el ataque del jugador en un valor de 5 veces el piso actual durante un piso.
				n = Aux.newRandom(0,10);
				v = (n >= 4) ? (5+this.level[cardNumber])*floor : -5*floor;
				CharSheet.buffStat("atk", CharSheet.attack+v, (v > 0));
				break;
			case 1: //Aumenta o disminuye la defensa del jugador en un valor de 4 veces el piso actual durante un piso.
				n = Aux.newRandom(0,10);
				v = (n >= 4) ? (4+this.level[cardNumber])*floor : -4*floor;
				CharSheet.buffStat("def", CharSheet.defense+v, (v > 0));
				break;
			case 2: //Aumenta o disminuye la vida del jugador en un valor de 15 veces el piso actual durante un piso.
				n = Aux.newRandom(0,10);
				v = (n >= 4) ? (15+ 2*this.level[cardNumber])*floor : -15*floor;
				console.log("Valor de v:", v > 0);
				CharSheet.buffStat("hp", CharSheet.maxHp+v, (v > 0));
				break;
			case 3: //Spawnea 4 objetos en torno al personaje o 4 arañas con un 30% de probabilidad.
				n = Aux.newRandom(0,10);
				if (n >= (7 + this.level[cardNumber] -1)) {
					for (var j=0; j<4; ++j)
						Q.stage(0).insert(Dungeon.insertNextToPlayer(new Q.Spider()));
				}
				else {
					console.log("Spawneando 4 objetos");
					for (var j=0; j<this.level[cardNumber]+1; ++j) {
						item = itemGenerator.spawn();
						while (item == null)
							item = itemGenerator.spawn();
						console.log(item);
						Dungeon.insertNextToPlayer(item);
						Q.stage(0).insert(item);
					}
				}
				break;
			case 4: //Reduce a la mitad el daño recibido, o lo duplica con un 30% de probabilidad durante 5 ataques.
				n = Aux.newRandom(0,10);
				Buff.type = "dmgMultiplier";
				var t = this.level[cardNumber] > 2 ? 1 : 0;
				if (n >= 7+t)
					Buff.buffCounter = -5;
				else 
					Buff.buffCounter = 5;
				break;
			case 5: //Cura completamente al jugador o le quita la mitad de su vida actual:
				n = Aux.newRandom(0,10);
				var t = this.level[cardNumber] > 2 ? 1 : 0;
				if (n >= 7+t)
					CharSheet.updateHp(Math.floor(CharSheet.hitPoints / 2));
				else
					CharSheet.updateHp(Math.floor(CharSheet.maxHp));
				break;
			case 6: //Mejora el porcentaje de crecimiento de stats
				n = Aux.newRandom(0,10);
				var t = this.level[cardNumber] > 2 ? 1 : 0;
				if (n >=4-t) {
					CharSheet.atkG+=3;
					CharSheet.defG+=2;
					CharSheet.healG+=0.1;
					CharSheet.hpG+=20;
					CharSheet.mHealG+=2;
				}
				else
					CharSheet.healthOnLevelUp = 'same';
				break;
			case 7: //Incrementa o decrementa el nivel del jugador
				n = Aux.newRandom(0,10);
				var t = this.level[cardNumber] > 2 ? 1 : 0;
				if (n >=4-t) {
					console.log("leveling up");
					CharSheet.updateExp(CharSheet.nextLevel - CharSheet.experience);
				}
				else {
					console.log("leveling down");
					if (CharSheet.level > 1)
						CharSheet.level--;
					CharSheet.experience = 0;
					CharSheet.expBar.train();
					Q("StatsContainer",4).first().updateLevel(CharSheet.level);
					Q("StatsContainer",4).first().p.EXPlabel.train(0);
				}
				break;
			case 8: //Reduce el daño recibido o hecho a 1
				n = Aux.newRandom(0,10);
				Buff.type = "invencible";
				var t = this.level[cardNumber] > 2 ? 1 : 0;
				if (n >= 7+t) {
					console.log("pifia");
					Buff.buffCounter = -5;
				}
				else 
					Buff.buffCounter = 5;
				break;
			case 9: //Transporta al jugador al piso siguiente o un piso atrás
				n = Aux.newRandom(0,10);
				var t = this.level[cardNumber] > 2 ? 1 : 0;
				if (n >=4-t) {
					Buff.reset();
   					Q.clearStages();
			        ++CharSheet.floor;
			        CharSheet.buffApplied = false;
			        Q.stageScene("level1", 0);
			        Q.stageScene("HUD-background",3);
			        Q.stageScene("HUD-stats",4);
				}
				else{
					Buff.reset();
   					Q.clearStages();
   					if (CharSheet.floor > 1)
			        	--CharSheet.floor;
			        CharSheet.buffApplied = false;
			        Q.stageScene("level1", 0);
			        Q.stageScene("HUD-background",3);
			        Q.stageScene("HUD-stats",4);
				}
				break;
		}
	}
};