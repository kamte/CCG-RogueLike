//Custom controls
Q.component("customControls", {

  added: function() {
    var p = this.entity.p;

    if(!p.stepDistance) { p.stepDistance = 32; }
    if(!p.stepDelay) { p.stepDelay = 0.2; }
    if(!p.inTurn) {p.inTurn = true; }

    p.stepWait = 0;
    this.entity.on("step",this,"step");
    this.entity.on("hit", this,"collision");
  },

  collision: function(col) {
    var p = this.entity.p;

    if(p.stepping) {
      if(col.obj.p.type == Q.SPRITE_DEFAULT){
        p.moving=false;
      } 
      p.stepping = false;
      p.x = p.origX;
      p.y = p.origY;
    }
  },

  step: function(dt) {
    var p = this.entity.p;
    p.stepWait -= dt;

    if(p.stepping) {
      p.x += p.diffX * dt / p.stepDelay;
      p.y += p.diffY * dt / p.stepDelay;
    }

    if(p.stepWait > 0) { return; }
    if(p.stepping) {
      p.x = p.destX;
      p.y = p.destY;
    }
    p.stepping = false;

    p.diffX = 0;
    p.diffY = 0;

    if(p.inTurn) { //Move only when in turn

      if(Q.inputs['left']) {
        p.pressed='left';
        p.diffX = -p.stepDistance;
        p.moving = true;
      } else if(Q.inputs['right']) {
        p.pressed='right';
        p.diffX = p.stepDistance;
        p.moving = true;
      }

      if(Q.inputs['up']) {
        p.pressed='up';
        p.diffY = -p.stepDistance;
        p.moving = true;
      } else if(Q.inputs['down']) {
        p.pressed='down';
        p.diffY = p.stepDistance;
        p.moving = true;
      }

      if(!Q.inputs['up'] && !Q.inputs['down'] && !Q.inputs['left'] && !Q.inputs['right']) {
        p.pressed='none';
      }

      if(p.diffY || p.diffX ) { 
        p.stepping = true;
        p.origX = p.x;
        p.origY = p.y;
        p.destX = p.x + p.diffX;
        p.destY = p.y + p.diffY;
        p.stepWait = p.stepDelay; 
      }
    }
  }
});

Q.component("character", {

  live: function(HP, ATK, DEF) {
    this.entity.p.hitPoints = HP;
    this.entity.p.attack = ATK;
    this.entity.p.defense = DEF
  },

  extend: {
    dead: function(){
      if (this.p.hitPoints <= 0){
        return true;
      } else {
        return false;
      }
    },

    hit: function(aggressor) {
      this.p.hitPoints -= aggressor.p.attack-this.p.defense;
      //console.log("COORDENADAS: ",aggressor.p.x, aggressor.p.y);
      console.log("vida defensor "+this.p.hitPoints);
    }
  } 
});
