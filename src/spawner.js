var Spawner = {
	bats: 0,
	maxBats: 7,
	batChance: 50,
	slimes: 0,
	maxSlimes: 3,
	slimeChance: 10,
	snakes: 0,
	maxSnakes: 4,
	snakeChance: 20,
	spiders: 0,
	maxSpiders: 4,
	spiderChance: 20,

	spawn: function(stage) {

		var hp, atk, def, exp;
	    var floor = CharSheet.floor-1;
		var n = Aux.newRandom(1,100);
		var monster = undefined;

		if (n <= this.snakeChance) {
			if (this.snakes < this.maxSnakes) {
				monster = new Q.Monster({sheet: "snake", sprite: "snakeAnim"});
				hp =  80 + 10 * floor;
			    atk = 6 + 2 * floor;
			    def = 1 + 1 * floor;
			    exp = 20 + 5 * floor;
				this.snakes++;
			}
		}
		else if (n <= this.snakeChance + this.batChance) {
			if (this.bats < this.maxBats) {
				monster = new Q.Monster({sheet: "bat", sprite: "batAnim"});
				hp =  90 + 10 * floor;
			    atk = 4 + 2 * floor;
			    def = 1 + 1 * floor;
			    exp = 15 + 5 * floor;
				this.bats++;
			}
		}
		else if (n <= this.snakeChance + this.batChance + this.spiderChance) {
			if (this.spiders < this.maxSpiders) {
				monster = new Q.Monster({sheet: "spider", sprite: "spiderAnim"});
				hp =  110 + 10 * floor;
			    atk = 3 + 2 * floor;
			    def = 2 + 1 * floor;
			    exp = 20 + 5 * floor;
				this.spiders++;
			}
		}
		else {
			if (this.slimes < this.maxSlimes) {
				monster = new Q.Monster({sheet: "slime", sprite: "slimeAnim"});
				hp =  100 + 10 * floor;
			    atk = 5 + 2 * floor;
			    def = 1 + 1 * floor;
			    exp = 25 + 6 * floor;
				this.slimes++;
			}
		}
		if (monster!==undefined) {
			monster.character.live(hp, atk, def, exp);
			stage.insert(Dungeon.insertAwayFromPlayer(monster));
		}
	},

	initialSpawn: function(stage, min, max) {
		var n = Aux.newRandom(min,max);

	    console.log("Enemies to spawn:",n);
	    for (i = 0; i < n; i++)
	      Spawner.spawn(stage);
	},

	update: function() {
		if (this.batChance > 5) {
		    this.batChance -= 5;
		    var roll = Aux.newRandom(0,2);

		    if (this.spiderChance < 30 && roll ===0)
		    	this.spiderChance+=5;
		    else if (this.snakeChance < 30 && (roll === 1 || this.spiderChance>=30))
		    	this.snakeChance+=5;
		    else 
		    	this.slimeChance += 5;

		    this.maxBats = Math.floor(this.batChance/10)+2;
		    this.maxSlimes = Math.floor(this.slimeChance/10)+2;
		    this.maxSpiders = Math.floor(this.spiderChance/10)+2;
		    this.maxSnakes = Math.floor(this.snakeChance/10)+2;
		    console.log(this.batChance, this.slimeChance, this.spiderChance, this.snakeChance);
		}
	}
 };