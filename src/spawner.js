 // var ChanceState = {
 // 	monsterName: "",
 // 	minFloor: 0,
 // 	maxFloor: 0,
 // 	chance: 0,
 // 	currentChance: 0,

 // 	updateChance: function(floor) {
 // 		var mid = Math.ceil((this.minFloor + this.maxFloor) / 2);

 // 		if (floor < this.minFloor || floor > this.maxFloor)
 // 			this.currentChance = 0;

 // 		else if (floor === this.minFloor)
 // 			this.currentChance = this.chance;

 // 		else if (floor <= mid)
 // 			this.currentChance += 5;

 // 		else
 // 			this.currentChance -= 3;
 // 	}
 // };
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
	maxMonsters: 15,
	monsters: 0,
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


		if (this.monsters < this.maxMonsters) {

		    var sum = 0;
		    for (i=0; i < this.monsterList.length; i++)
		    	sum += this.monsterList[i].currentChance;

			var n = Aux.newRandom(1,sum);
			var monster = undefined;


			if (n <= this.monsterList[1].currentChance) {
					monster = new Q.Snake();
			}
			else if (n <= this.monsterList[1].currentChance + this.monsterList[0].currentChance) {
					monster = new Q.Bat();
			}
			else if (n <= this.monsterList[1].currentChance + this.monsterList[0].currentChance + this.monsterList[2].currentChance) {
					monster = new Q.Spider();
			}
			else {
					monster = new Q.Slime();
			}
			if (monster!==undefined) {
				this.monsters++;
				stage.insert(Dungeon.insertAwayFromPlayer(monster));
			}
		}
	},

	initialSpawn: function(stage, min, max) {
		var n = Aux.newRandom(min,max);

		if (CharSheet.floor === 1)
			Spawner.initState();
		
		for(i=0; i < this.monsterList.length; i++)
			this.monsterList[i].updateChance(CharSheet.floor);

	    console.log("Enemies to spawn:",n);
	    for (i = 0; i < n; i++)
	      Spawner.spawn(stage);
	}

 };