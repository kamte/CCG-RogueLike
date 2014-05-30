var CharSheet = {
	hitPoints: 100,
	maxHp: 100,
	attack: 20,
	defense: 1,
	experience: 0,
	nextLevel: 50,
	cards: [],
	items: [],
	hpBar: new Q.Health(),
	expBar: new Q.Experience(),

	updateHp: function(hp) {
		this.hpBar.hurt();
		if (hp > this.maxHp)
			this.hitPoints = maxHp;
		else
			this.hitPoints = hp;
	},

	updateExp : function(exp) {
		if (this.experience + exp > this.nextLevel) {
			this.experience = this.experience + exp - this.nextLevel;
			Q.state.set("experience",this.experience);
			this.nextLevel = this.nextLevel * 2;
			this.expBar.train();
			//LEVELUP
		}
		else {
			this.experience += exp;	
			this.expBar.train();
		}
	}

};

Q.scene('inventory',function(stage) {
	//To test 
	// for(var i = 0; i<4; i++)
	//  CharSheet.items.push(new Q.Equipment({name: "sword", sheet: "sword", sprite: "swordAnim", attack:5}));

  var width = Q.width - 50;
  var height = Q.height - 85;
  var container = stage.insert(new Q.UI.Container({
    x: Q.width/2, y: 210, w:width, h:height, fill: "gray"
  }));

  var row = 0;
  var col = 0;
  for(var i = 0; i<CharSheet.items.length; i++){
  	container.insert(new Q.UI.Button({
    x: -width/2 + 32*(col+1)+13*col, y: -height/2 + 32*(row+6)+13*row, sheet: CharSheet.items[i].p.sheet, fill: "white", pos:i
  	},function() {
      console.log("soy", CharSheet.items[this.p.pos].p.name, this.p.pos, CharSheet.items[this.p.pos].p.attack)
  	} ));  
  	col = col+1
  	if(col==6){
  		col=0;
  		row++;
  	}
  }
});