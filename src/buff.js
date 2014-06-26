var Buff = {
	type: "none",
	buffCounter: 0,
	buffedStat: "none",

	reset: function() {
		if (this.type == "statPos") {
			Charsheet.attack-= 5 * Charsheet.floor;
		}
		else if (this.type == "statNeg") {
			Charsheet.attack+= 5 * Charsheet.floor;
		}

		this.type = "none";
		this.buffCounter = 0;
		this.buffedStat = "none";
	}
};