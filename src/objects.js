Q.Sprite.extend("Escalera", {
	init: function(p) {
   		this._super(p,{
   			asset: "Escalera.png",
   			gravity: 0, 
            sensor: true
   		});

   		this.on("sensor",this,function(collision){
   			if(collision.isA("Player") && !this.p.taken) {
   				Q.clearStages();
                Q.stageScene("level1", 0);
                Q.stageScene("hud",1);
   			}
   		});
   	}
});