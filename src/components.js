//Custom controls
Q.component("customControls", {

  added: function() {
    var p = this.entity.p;

    if(!p.stepDistance) { p.stepDistance = 32; }
    if(!p.stepDelay) { p.stepDelay = 0.2; }
    if(!p.inTurn) {p.inTurn = true; }
    if(!p.timer) {p.timer=0; }

    p.stepWait = 0;
    this.entity.on("step",this,"step");
    this.entity.on("hit", this,"collision");
  },

  collision: function(col) {
    if (!col.obj.p.sensor) {
      var p = this.entity.p;
      if(p.stepping) { 
        p.stepping = false;
        p.x = p.origX;
        p.y = p.origY;
      }
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

    var fila=toMatrix(p.y);
    var columna=toMatrix(p.x);


    if(p.inTurn) { //Move only when in turn
      p.timer +=1;
      // console.log(cont);
      p.pressed='none';
      if(Q.inputs['left'] && Dungeon.map[fila][columna-1]%2==0) {
        p.facing = 'left';
        p.pressed='left';
        p.diffX = -p.stepDistance;
        p.moving = true;
      } else if(Q.inputs['right'] && Dungeon.map[fila][columna+1]%2==0) {
        p.facing = 'right';
        p.pressed='right';
        p.diffX = p.stepDistance;
        p.moving = true;
      } else if(Q.inputs['up'] && Dungeon.map[fila-1][columna]%2==0) {
        p.pressed='up';
        p.diffY = -p.stepDistance;
        p.moving = true;
      } else if(Q.inputs['down'] && Dungeon.map[fila+1][columna]%2==0) {
        p.pressed='down';
        p.diffY = p.stepDistance;
        p.moving = true;
      } else if(Q.inputs['fire'] && p.timer > 10) {
        p.timer = 0;
        if (Q.stage(1) != undefined) {
          Q.clearStage(1);
        }
        else {
          Q.stageScene("inventory", 1);
        }
      } else if (Q.inputs['action'] && p.timer > 10) {
        p.timer = 0;
        if (!Deck.cardUsed && Deck.selected !== null) {
          //usar carta
          Deck.getSkill(Deck.selected);
          gState.used();
          //ya no se pueden usar mas cartas en la partida
          Deck.cardUsed = true;
        }
      }

      if(p.diffY || p.diffX ) { 
        p.stepping = true;
        p.origX = p.x;
        p.origY = p.y;
        p.destX = p.x + p.diffX;
        p.destY = p.y + p.diffY;
        p.stepWait = p.stepDelay; 
        this.entity.trigger("end_move");
      }
    }
  }
});

Q.component("character", {

  live: function(HP, ATK, DEF, EXP) {
    //Make enemies randomly up to 1.5 times stronger
    var mod = Aux.newRandom(100,150) / 100;
    HP=Math.floor(mod*HP);
    ATK=Math.floor(mod*ATK);
    DEF=Math.floor(mod*DEF);
    EXP=Math.floor(mod*EXP);
    
    // console.log(HP, ATK, DEF, EXP);
    this.entity.p.maxHitPoints = HP;
    this.entity.p.hitPoints = HP;
    this.entity.p.attack = ATK;
    this.entity.p.defense = DEF;
    this.entity.p.experience = EXP;
  },

  extend: {
    dead: function(){
      if (this.p.hitPoints <= 0){
        Q.state.inc("experience",this.p.experience);
        CharSheet.updateExp(this.p.experience);
        return true;
      } else {
        return false;
      }
    },

    hit: function(aggressor) {
      var variation = Aux.newRandom(80, 100);
      var reduction = this.p.defense > 0 ? this.p.defense : 1;
      var damage = Math.ceil(variation * 0.01 * (3 * CharSheet.attack-(2*reduction)));
      if (Buff.buffCounter < 0) {
        if (Buff.type == "invencible") {
          console.log("reduciendo daño hecho a 1");
          Buff.buffCounter++;
          damage = 0;
        }
      }
      this.p.hitPoints -= (damage>0 ? damage : 1);
      if(this.p.w==32){
        enemyHP.hit(this);
      }
      else{
        bossHP.hit(this);
      }
      console.log("player pega", damage)
      //console.log("COORDENADAS: ",aggressor.p.x, aggressor.p.y);
      // console.log(this.p.x, this.p.y, "vida defensor "+this.p.hitPoints);
    }
  } 
});

Q.component("turn_component", {

  init_turn: function(pos) {
    enemiesArray[pos]=this.entity;
    if(pos==null || pos==undefined)
      this.entity.p.position = Q.state.get("enemies");
    else
      this.entity.p.position = pos;
  },

  extend: {
    pass_turn: function(){
      Q.state.inc("nextMove",1);
    }
  }
});
