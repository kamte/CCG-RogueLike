var Buff = {
	type: "none",
	buffCounter: 0,
	buffedStat: "none",

	restart: function(){
		this.type = "none"; this.buffCounter = 0; this.buffedStat = "none";
	},
	reset: function() {
		// console.log("Tipo de buff quitado:", this.type);
		if (this.type == "statPos") {
			if (this.buffedStat == "atk")
				CharSheet.attack-= 5 * CharSheet.floor;
			else if (this.buffedStat == "def")
				CharSheet.defense-= 4 * CharSheet.floor;
			else
				CharSheet.maxHp-=15 * CharSheet.floor;
		}
		else if (this.type == "statNeg") {
			if (this.buffedStat == "atk")
				CharSheet.attack+= 5 * CharSheet.floor;
			else if (this.buffedStat == "def")
				CharSheet.defense+= 4 * CharSheet.floor;
			else
				CharSheet.maxHp+=15 * CharSheet.floor;
		}

		this.type = "none";
		this.buffCounter = 0;
		this.buffedStat = "none";

		var statsHUD =  Q("StatsContainer",4).first();
     	statsHUD.updateCombatStats(CharSheet.attack, CharSheet.defense, CharSheet.maxHp);
	}
};