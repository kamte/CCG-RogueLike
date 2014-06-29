var NamesGenerator = {

	DBtier4: ["Kukulkán", "Huracán", "Tepeu", "Alom", "Bitol", "Qaholom", "Tzacol", "Xlitan", "Ajtzak", "Akaime", "Bitol", "Chirakata-Ixminasune", "Hunahpu-Gutch", "Ixmucane", "Ixpiyacoc", "Mulzencab", "Tepeu", "Tzacol", "Patán", "Quicxic", "Quicré", "Quicrixcac", "Itzamná"],
	DBtier3: ["Mountain-moving", "Wall-breaker", "Dragon-killer", "Colossal", "Heart-piercing", "Unbreakable", "Flawless", "Spectacular"],
	DBtier2: ["Thorned", "Tenacious", "Spiked", "Shadow", "Foreign", "Unreal", "Elemental", "Sharp", "Swift"],
	DBtier1: ["Iron", "Wooden", "Useless", "Tin", "Copper", "Corroded", "Toy", "Old", "Fake", "Sticky"],
	DBpotions: ["Misterious", "Frog surprise", "Disgusting", "Peculiar", "Tasty", "Mayan", "Rat tail", "Hairy"],
	DBfood: ["Bread", "Cake", "Cooked meat", "Raw meat", "Cheese"],

	randomName: function(tier, item){
		var name = "";
		if(item=='equip'){
			if(tier == 4){
				var r = Aux.newRandom(0, this.DBtier4.length-1);
				name += (this.DBtier4[r] + "'s");
			} else if(tier == 3) {
				var r = Aux.newRandom(0, this.DBtier3.length-1); 
				name += this.DBtier3[r];
			} else if(tier == 2) {
				var r = Aux.newRandom(0, this.DBtier2.length-1); 
				name += this.DBtier2[r];
			} else {
				var r = Aux.newRandom(0, this.DBtier1.length-1); 
				name += this.DBtier1[r];
			}
		} else if (item=='potion'){
			var r = Aux.newRandom(0, this.DBpotions.length-1);
			name = this.DBpotions[r] + " potion" + '\n' + "you don't know what" + '\n' + "it will do";
		} else if (item=='food') {
			var r = Aux.newRandom(0, this.DBfood.length-1);
			name = this.DBfood[r];
		}
		return name;
	} 
};

var objectGenerator = {

	spawner : function(stage, min, max, room){
		var max = Aux.newRandom(min, max);
		var item = null;
		var index;
		for(var i=0; i<max; i++){
			index = (room==undefined ? i : room);
			item = this.spawn();
			if(item!=null){
				stage.insert(Dungeon.insertEntityInRoom(item, index));
			}
		}
	},

	spawn : function(){
		var r = Math.random();
		var tier = 0;

		if(r<0.1){
			tier = 4;
		} else if(r<0.2){
			tier = 3;
		} else if(r<0.5){
			tier = 2;
		} else {
			tier = 1;
		}

		r = Math.random();
		var item = null;

		//EQUIPO 35%
		if(r<0.35){
			r = Math.random();

			//TODO tener en cuenta el piso
			var atk = Math.ceil(Math.random()*5*CharSheet.floor+CharSheet.floor);
			if(Math.random()<0.3)
				atk=-atk;
			var def = Math.ceil(Math.random()*1*CharSheet.floor+CharSheet.floor);
			if(Math.random()<0.3)
				def=-def;
			var hp = Math.ceil(Math.random()*20*CharSheet.floor+CharSheet.floor*2);
			if(Math.random()<0.3)
				hp=-hp;
			var sprite;

			if(r<0.25){
				item = new Q.Weapon({tier: tier, sheet: ("weapon"+(((tier-1)*10)+Aux.newRandom(1,10))), name:(NamesGenerator.randomName(tier, 'equip')+ " weapon")});
			} else if(r<0.50){
				item = new Q.Shield({tier: tier, sheet: ("shield"+(((tier-1)*6)+Aux.newRandom(1,6))), name:(NamesGenerator.randomName(tier, 'equip') + " shield")});
			} else if(r<0.75){
				item = new Q.Armor({tier: tier, sheet: ("armor"+(((tier-1)*3)+Aux.newRandom(1,3))), name:(NamesGenerator.randomName(tier, 'equip') + " armor")});
			} else {
				item = new Q.Helmet({tier: tier, sheet: ("helmet"+(((tier-1)*3)+Aux.newRandom(1,3))), name:(NamesGenerator.randomName(tier, 'equip') + " helmet")});
			}
			item.statear(atk,def,hp);

		//COMIDA 30%
		} else if(r<0.65){
			var hp = Math.ceil(Math.random()*CharSheet.maxHp/2+CharSheet.floor*2);
			var name = NamesGenerator.randomName(tier, 'food');

			item = new Q.Food({tier: tier, sheet: name, name: (name + '\n' + "Eating it will" + '\n' + "heal a portion" + '\n' + "of your life")});

			item.statear(hp);

		//POCIONES 15%
		} else if(r<0.80){
			var atk = 0;
			var def = 0;
			var hp = 0;
			var heal = 0;
			var maxHeal = 0;

			var giveStat = Math.random();
			var loops = Aux.newRandom(1,2);

			for(var i=0; i<loops; i++){
				if(giveStat<0.2){
					atk += 1;
				} else if (giveStat<0.4) {
					def += 1;
				} else if (giveStat<0.6) {
					hp += 1 ;
				} else if (giveStat<0.8) {
					heal += 0.1;
				} else {
					maxHeal += 5;
				}
			}
			item = new Q.Potion({tier: tier, sheet: ("potion"+(Aux.newRandom(1,7))), name: NamesGenerator.randomName(tier, 'potion')});

			item.statear(atk, def, hp, heal, maxHeal);
		}
		//NO SPAWNEAR "20%"
		return item;
	}
}