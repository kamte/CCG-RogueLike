var Buff = {
	type: "none",
	buffCounter: 0,
	buffedStat: "none",

	reset: function() {
		if (this.type == "statPos") {
			if (this.buffedStat == "attack")
				Charsheet.attack-= 5 * Charsheet.floor;
			else if (this.buffedStat "defense")
				Charsheet.defense-= 4 * Charsheet.floor;
		}
		else if (this.type == "statNeg") {
			if (this.buffedStat == "attack")
				Charsheet.attack+= 5 * Charsheet.floor;
			else if (this.buffedStat == "defense")
				Charsheet.defense+= 4 * Charsheet.floor;
		}

		this.type = "none";
		this.buffCounter = 0;
		this.buffedStat = "none";
	}
};