
function executeEnemySkill(enemy, skillId) {
  const skill = ENEMY_SKILLS[skillId];

  if (!skill) {
    console.error("Unknown enemy skill:", skillId);
    return false;
  }

  const runtimeSkill =
    enemy.skillState?.find(
      s => s.id === skillId
    );

  if (!runtimeSkill) {
    return false;
  }

  // bezpieczeństwo
  if (runtimeSkill.expiresAt > performance.now()) {
    return false;
  }

  if (skill.effects) {
      const player = getPlayerStats();
      applyEnemySkillEffect(skillId, player, enemy, gameState.world.selectedSlotIndex);
  }

  // cooldown
  runtimeSkill.expiresAt =
    performance.now() + skill.cooldown * 1000;

  return true;
}

function getEnemySkillEffectsAtLevel(enemy, skillId) {
  const skill = ENEMY_SKILLS[skillId];
  const runtimeSkill =
    enemy.skillState?.find(
      s => s.id === skillId
    );
     
  return skill.effects.map(effect => {
    //console.error("effect value + scaling level", effect.baseValue + (effect.scalingPerLevel || 0) * (state.level - 1));
    //console.error("effect baseValue, effect.scalingPerLevel, level", effect.baseValue, effect.scalingPerLevel, state.level);

    return {
      ...effect,
      value: effect.baseValue + (effect.scalingPerLevel || 0) * (runtimeSkill.level - 1)
    };
  });
}


function applyEnemySkillEffect(skillId, player, enemy, slotIndex) {
  const effects = getEnemySkillEffectsAtLevel(enemy, skillId);
 // console.log("Skill effects: ", effects, skillId);
  
  const getEffectByType = (effects, type) => effects.find(e => e.type === type);
  
  effects.forEach(effect => {
    let actualValue = calculateEffectValue(effect, player, enemy);
    let durationEffect = null;
    let buffDuration = 5;
    let durationMs = 0;
       
    switch(effect.type) {

        case "damage":
            
            performEnemyAttack(enemy, slotIndex, {
              multiplier: actualValue
            });
      
      
            break;

        case "bleed":
            durationEffect = getEffectByType(effects, "bleed-duration");
            buffDuration = durationEffect
              ? calculateEffectValue(durationEffect, player, enemy)
              : 5;
      
            durationMs = buffDuration * 1000;
      
            //applyPlayerBleed(enemy, actualValue, durationMs); 
            applyPlayerDot("bleed", enemy, actualValue, durationMs);
            break;

      case "burn":
            durationEffect = getEffectByType(effects, "burn-duration");
            buffDuration = durationEffect
              ? calculateEffectValue(durationEffect, player, enemy)
              : 5;
      
            durationMs = buffDuration * 1000;
      
            applyPlayerDot("burn", enemy, actualValue, durationMs);
            break;
      
        case "poison":
           /* durationEffect = getEffectByType(effects, "burn-duration");
            buffDuration = durationEffect
              ? calculateEffectValue(durationEffect, player, enemy)
              : 5;
      
            durationMs = buffDuration * 1000;*/
      
            //console.log(`poison actualValue`, actualValue);
           
            applyPlayerDot("poison", enemy, actualValue, 5000);
            break;

        case "mark":
            gameState.combat.playerMark.isActive = true;
            gameState.combat.playerMark.dmgTaken = actualValue;
            gameState.combat.playerMark.atkspd = actualValue;
          
            //console.log(`actualValue`, actualValue);
             
            updateStatusPlayerUI(enemy);
      
            setTimeout(() => {
              gameState.combat.playerMark.isActive = false;
              gameState.combat.playerMark.dmgTaken = 0;
              gameState.combat.playerMark.atkspd = 0;
              updateStatusPlayerUI(enemy);
            }, 6000);
            break;

      case "damage-reduction-buff":
      
            gameState.combat.enemyDmgReduction.isActive = true;
            gameState.combat.enemyDmgReduction.value = actualValue;
            updateStatusEnemyUI(enemy);
            
            setTimeout(() => {
              gameState.combat.enemyDmgReduction.isActive = false;
              gameState.combat.enemyDmgReduction.value = 0;
              updateStatusEnemyUI(enemy);
            }, 6000);
     
            break;
      
      case "life-steal":
      
            break;
      
        case "stun":
            actualValue *= 1000;
            stunPlayer(enemy, actualValue);
            playStunVFX(player.dom.slot, actualValue);
            break;

        case "pushback":
            pushbackPlayer(500); 
            break;

        case "slow":
            durationEffect = getEffectByType(effects, "slow-duration");
            buffDuration = durationEffect
              ? calculateEffectValue(durationEffect, player, enemy)
              : 5;
      
            durationMs = buffDuration * 1000;
      
            slowPlayer(enemy, actualValue, durationMs);
            playSlowVFX(player.dom.slot, durationMs);
            break;
      
        case "attack-speed":
            
            gameState.combat.enemyAtkspdBuff.isActive = true;
            gameState.combat.enemyAtkspdBuff.value = actualValue;
            //console.log(`actualValue`, actualValue);
             
            updateStatusEnemyUI(enemy);
      
            setTimeout(() => {
              gameState.combat.enemyAtkspdBuff.isActive = false;
              gameState.combat.enemyAtkspdBuff.value = 0;
              updateStatusEnemyUI(enemy);
            }, 5000);
      
            break;
      
        case "damage-buff":
      
            gameState.combat.enemyDmgBuff.isActive = true;
            gameState.combat.enemyDmgBuff.value = actualValue;
      
            updateStatusEnemyUI(enemy);
      
            setTimeout(() => {
              gameState.combat.enemyDmgBuff.isActive = false;
              gameState.combat.enemyDmgBuff.value = 0;
              updateStatusEnemyUI(enemy);
            }, 5000);
      
            break;

    }
     
  });
}


function isEnemySkillReady(enemy, skillId) {
  const runtimeSkill = enemy.skills?.find(
    skill => skill.id === skillId
  );

  return runtimeSkill &&
         runtimeSkill.expiresAt <= Date.now();
}


/*function applyPlayerBleed(enemy, damage, durationMs) {

  const bleed = gameState.combat.playerBleed;

  const now = getGameTime();

  bleed.stacks.push({
    damage: damage,
    expiresAt: now + durationMs
  });

  // uruchom tick systemu, jeśli jeszcze nie działa
  if (!bleed.interval) {
    startPlayerBleed(enemy);
  }

  updateStatusPlayerUI(enemy);
}

function startPlayerBleed(enemy) {

  const bleed = gameState.combat.playerBleed;

  if (bleed.interval) return;

  bleed.interval = setInterval(() => {

    const now = getGameTime();

    // usuń wygasłe stacki
    bleed.stacks =
      bleed.stacks.filter(stack =>
        stack.expiresAt > now
      );

    // nic już nie krwawi
    if (bleed.stacks.length === 0) {
      clearPlayerBleed(enemy);
      return;
    }

    // suma obrażeń
    const totalDamage =
      bleed.stacks.reduce(
        (sum, stack) => sum + stack.damage,
        0
      );

    dealPlayerBleedDamage(enemy, totalDamage);

  }, 1000);
}

function dealPlayerBleedDamage(enemy, damage) {

  const char = gameState.char;

  if (!char || char.hp <= 0) return;

  const finalDamage = Math.ceil(damage);

  char.hp = Math.max(
    0,
    char.hp - finalDamage
  );

  updatePlayerHp(char.hp);

  showPlayerDamage({
    damage: finalDamage,
    isBleed: true
  });

  updateStatusPlayerUI(enemy);

  if (char.hp <= 0 && !gameState.combat.flags.isCritical) {
    clearPlayerBleed(enemy);

    // tutaj Twoja obecna obsługa śmierci gracza
    enterCriticalState();
  }
}

function clearPlayerBleed(enemy) {
  //console.log(`clearPlayerBleed enter`);  
  
  const bleed = gameState.combat.playerBleed;

  if (bleed.interval) {
    clearInterval(bleed.interval);
    bleed.interval = null;
  }

  bleed.stacks = [];
  bleed.nextTickAt = 0;
  //console.log(`clearPlayerBleed enter2`);  

  updateStatusPlayerUI(enemy);
}*/

/*function applyPlayerDot(type, enemy, damage, durationMs) {
  const dot = gameState.combat.playerDots[type];

  if (!dot) return;

  const now = getGameTime();

  if (type === `burn` && dot.stacks.length >= 1) {
    clearPlayerDot(type, enemy);
    dot.stacks.push({
      damage: damage,
      expiresAt: now + durationMs
    });
  } else {
    dot.stacks.push({
      damage: damage,
      expiresAt: now + durationMs
    });
  }
  
  if (!dot.interval) {
    startPlayerDot(type, enemy);
  }

  updateStatusPlayerUI(enemy, type);
}*/

function applyPlayerDot(type, enemy, damage, durationMs) {
  const dot = gameState.combat.playerDots[type];

  if (!dot) return;

  const now = getGameTime();

  damage *= enemy.dmg;
  
  if (type === "burn") {
    dot.stacks = [{
      damage: damage,
      expiresAt: now + durationMs
    }];
  } else {
    dot.stacks.push({
      damage: damage,
      expiresAt: now + durationMs
    });
  }

  if (!dot.interval) {
    startPlayerDot(type, enemy);
  }

  updateStatusPlayerUI(enemy, type);
}

let dotIsPaused = false;
function startPlayerDot(type, enemy) {
  const dot = gameState.combat.playerDots[type];

  if (!dot || dot.interval) return;

  dot.interval = setInterval(() => {

    if(dotIsPaused) return;
    
    const now = getGameTime();

    // usuń wygasłe stacki
    dot.stacks = dot.stacks.filter(
      stack => stack.expiresAt > now
    );

    // nic już nie działa
    if (dot.stacks.length === 0) {
      clearPlayerDot(type, enemy);
      return;
    }

    //console.log(`poison startPlayerDot`, type);
           
    const totalDamage =
      dot.stacks.reduce(
        (sum, stack) => sum + stack.damage,
        0
      );

    //console.log(`poison totalDamage`, totalDamage);
   
    dealPlayerDotDamage(
      type,
      enemy,
      totalDamage
    );

    // POISON — zwiększenie obrażeń po ticku
    if (type === "poison") {
      dot.stacks.forEach(stack => {
        stack.damage *= 1.35;
      });
    }

  }, 1000);
}

function dealPlayerDotDamage(type, enemy, damage) {
  const char = gameState.char;

  if (!char || char.hp <= 0) return;

  const finalDamage = Math.ceil(damage);

  char.hp = Math.max(0, char.hp - finalDamage);

  updatePlayerHp(char.hp);

  showPlayerDamage({
    damage: finalDamage,
    isBleed: type === "bleed",
    isBurn: type === "burn",
    isPoison: type === "poison",
  });

  updateStatusPlayerUI(enemy, type);

  //console.log(`poison dealPlayerDotDamage`, damage);
  
  if (char.hp <= 0 && !gameState.combat.flags.isCritical) {
    clearAllPlayerDots(enemy);
    enterCriticalState();
  }
}

function clearPlayerDot(type, enemy) {
  const dot = gameState.combat.playerDots[type];

  if (!dot) return;

  if (dot.interval) {
    clearInterval(dot.interval);
    dot.interval = null;
  }

  dot.stacks = [];
  dot.nextTickAt = 0;

  updateStatusPlayerUI(enemy, type);
}

function clearAllPlayerDots(enemy) {
  Object.keys(gameState.combat.playerDots).forEach(type => {
    clearPlayerDot(type, enemy);
  });

}