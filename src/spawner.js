var Spawner = {
	bats: 0,
	maxBats: 4,
	slimes: 0,
	maxSlimes: 3,
	snakes: 0,
	maxSnakes: 4,
	spiders: 0,
	maxSpiders: 2,

	spawn: function(stage) {

		var hp, atk, def, exp;
	    var floor = CharSheet.floor-1;

	    //Make enemies randomly up to 1.5 times stronger
	    var mod = Aux.newRandom(100,150) / 100;

		var n = Aux.newRandom(0,3);
		var monster;
		if (n == 0) {
			if (this.snakes < this.maxSnakes) {
				monster = new Q.Monster({sheet: "snake", sprite: "snakeAnim"});
				hp =  Math.floor(mod * (80 + 10 * floor));
			    atk = Math.floor(mod * (6 + 2 * floor));
			    def = Math.floor(mod * (1 + 1 * floor));
			    exp = Math.floor(mod * (20 + 5 * floor));
				monster.character.live(hp, atk, def, exp);
				stage.insert(Dungeon.insertAwayFromPlayer(monster));
				this.snakes++;
			}
		}
		else if (n == 1) {
			if (this.bats < this.maxBats) {
				monster = new Q.Monster({sheet: "bat", sprite: "batAnim"});
				hp =  Math.floor(mod * (90 + 10 * floor));
			    atk = Math.floor(mod * (4 + 2 * floor));
			    def = Math.floor(mod * (1 + 1 * floor));
			    exp = Math.floor(mod * (20 + 5 * floor));
				monster.character.live(hp, atk, def, exp);
				stage.insert(Dungeon.insertAwayFromPlayer(monster));
				this.bats++;
			}
		}
		else if (n == 2) {
			if (this.spiders < this.maxSpiders) {
				monster = new Q.Monster({sheet: "spider", sprite: "spiderAnim"});
				hp =  Math.floor(mod * (110 + 10 * floor));
			    atk = Math.floor(mod * (3 + 2 * floor));
			    def = Math.floor(mod * (2 + 1 * floor));
			    exp = Math.floor(mod * (20 + 5 * floor));
				monster.character.live(hp, atk, def, exp);
				stage.insert(Dungeon.insertAwayFromPlayer(monster));
				this.spiders++;
			}
		}
		else {
			if (this.slimes < this.maxSlimes) {
				monster = new Q.Monster({sheet: "slime", sprite: "slimeAnim"});
				hp =  Math.floor(mod * (100 + 10 * floor));
			    atk = Math.floor(mod * (5 + 2 * floor));
			    def = Math.floor(mod * (1 + 1 * floor));
			    exp = Math.floor(mod * (20 + 5 * floor));
				monster.character.live(hp, atk, def, exp);
				stage.insert(Dungeon.insertAwayFromPlayer(monster));
				this.slimes++;
			}
		}
	},

	initialSpawn: function(stage, min, max) {
		var n = Aux.newRandom(min,max);

	    console.log("Enemies to spawn:",n);
	    for (i = 0; i < n; i++)
	      Spawner.spawn(stage);
		}
 };