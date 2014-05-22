Q.Sprite.extend("Escalera", {
	init: function(p) {
   		this._super(p,{
   			sheet: "escalera",
        sprite: "escAnim",
   			gravity: 0, 
        sensor: true
   		});

   		this.on("sensor",this,function(collision){
   			if(collision.isA("Player") && !this.p.taken) {
   				Q.clearStages();
          Q.stageScene("level1", 0);
          Q.stageScene("HUD-background",1);
          Q.stageScene("HUD-stats",2);
   			}
   		});
   	}
});