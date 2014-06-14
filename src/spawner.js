 function updateChance(floor) {
 	var mid = Math.ceil((this.minFloor + this.maxFloor) / 2);

 	if (floor < this.minFloor || floor > this.maxFloor)
 		this.currentChance = 0;

 	else if (floor === this.minFloor)
 		this.currentChance = this.chance;

 	else if (floor <= mid)
 		this.currentChance += 5;

 	else
 		this.currentChance -= 3;
 };

  function ChanceState(name, min, max, chance) {
 	this.monsterName = name;
 	this.minFloor = min;
 	this.maxFloor = max;
 	this.chance = chance;
 	this.currentChance = 0;
 	this.updateChance = updateChance;
 };



var Spawner = {
	monsterList: undefined,

	initState: function() {
		if (this.monsterList === undefined) {
			this.monsterList = [];
			var bat = new ChanceState("Bat",1,5,10);
			this.monsterList.push(bat);

			var snake = new ChanceState("Snake",3,7,5);
			this.monsterList.push(snake);

			var spider = new ChanceState("Spider",6,10,5);
			this.monsterList.push(spider);

			var slime = new ChanceState("Slime",10,15,2);
			this.monsterList.push(slime);
		}
	},

	spawn: function(stage) {
	    var sum = 0;
	    for (var i=0; i < this.monsterList.length; i++)
	    	sum += this.monsterList[i].currentChance;

		var n = Aux.newRandom(1,sum);
		var monster = undefined;
		// console.log("rolled:", n);

		if (n <= this.monsterList[1].currentChance) {
			console.log("Snake");
			monster = new Q.Snake();
		}
		else if (n <= this.monsterList[1].currentChance + this.monsterList[0].currentChance) {
			console.log("Bat");
			monster = new Q.Bat();
		}
		else if (n <= this.monsterList[1].currentChance + this.monsterList[0].currentChance + this.monsterList[2].currentChance) {
			console.log("Spider");
			monster = new Q.Spider();
		}
		else {
			console.log("Slime");
			monster = new Q.Slime();
		}
		console.log(monster.p.attack);
		stage.insert(Dungeon.insertAwayFromPlayer(monster));
		this.monsters++;
		
	},

	initialSpawn: function(stage, min, max) {
		var n = Aux.newRandom(min,max);

		if (CharSheet.floor === 1)
			Spawner.initState();

		for(var i=0; i < this.monsterList.length; i++)
			this.monsterList[i].updateChance(CharSheet.floor);

		console.log("Enemies to spawn:",n);
	    for (var i = 0; i < n; ++i){
	    	console.log("llamada", i);
	    	Spawner.spawn(stage);
	  	}
	}

 };