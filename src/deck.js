var Deck = {

	cards: [],
	total: 2;
	
	fetch: function() {
		if (localStorage.getItem("saved") === "yes") {
			for (var i=0; i<cards.length; ++i)
				cards[i].unlocked = (localStorage.getItem(i)==="true") ? true : false;
		}
		else
			console.log("Local Storage not supported. The game will not be saved.");
	},

	save: function() {
		if (typeof window.localStorage != "undefined") {
			localStorage.setItem("saved", "yes");
			for (var i=0; i < cards.length; ++i) {
				localStorage.setItem("", cards[i].unlocked);
			}
		}
		else
			console.log("Local Storage not supported. The game will not be saved.");
	}

	clear: function() {
		if (typeof window.localStorage != "undefined") 
			localStorage.clear();
	},

	getSkill: function(cardNumber) {
		var lvl = CharSheet.level;
		var n, v;
		switch (cardNumber) {
			case 0:
				n = Math.round(Math.random());
				v = (n == 0) ? 5*lvl : -5*lvl;
				CharSheet.applyBuff("atk", CharSheet.attack+n, 10);
				break;
			case 1:
				n = Aux.newRandom(0,10);
				if (n >= 7) {
					for (var j=0; j<4; ++j)
						Q.stage(0).insert(Dungeon.insertNextToPlayer(new Q.Spider()));
				}
				else
					for (var j=0; j<4; ++j)
						Q.stage(0).insert(Dungeon.insertNextToPlayer(objectGenerator.spawn()));
				break;

		}
	}
};