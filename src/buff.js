var Buff = {
	type: "none",
	buffCounter: 0,
	buffedStat: "none",

	reset: function() {
		if (this.type == "statPos") {
			if (this.buffedStat == "atk")
				Charsheet.attack-= 5 * Charsheet.floor;
			else if (this.buffedStat == "def")
				Charsheet.defense-= 4 * Charsheet.floor;
			else
				Charsheet.maxH-=15 * Charsheet.floor;
		}
		else if (this.type == "statNeg") {
			if (this.buffedStat == "atk")
				Charsheet.attack+= 5 * Charsheet.floor;
			else if (this.buffedStat == "def")
				Charsheet.defense+= 4 * Charsheet.floor;
			else
				Charsheet.maxH+=15 * Charsheet.floor;
		}

		this.type = "none";
		this.buffCounter = 0;
		this.buffedStat = "none";
	}
};