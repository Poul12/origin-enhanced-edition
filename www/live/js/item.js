let itemTypeKey = ``;


   function getRandomArmorSubtype() {
     const roll = Math.random();
     if (roll < 0.4) return 'leather_armor';
     if (roll < 0.7) return 'chestplate';
     if (roll < 0.9) return 'chainmail';
     return 'plate_armor';
   }


function getRandomWeaponSubtype() {
  const roll = Math.random();
  if (roll < 0.3) return 'short_sword';
  if (roll < 0.4) return 'mace';
  if (roll < 0.5) return 'axe';
  if (roll < 0.6) return 'long_sword';
  //if (roll < 0.75) return 'great_sword';
  if (roll < 0.85) return 'double_axe';
  if (roll < 0.95) return 'spear';
  //return 'hammer';
}

   function getRandomShieldSubtype() {
     const roll = Math.random();
     if (roll < 0.4) return 'round_shield';
     if (roll < 0.7) return 'buckler';
     if (roll < 0.9) return 'kalkan';
     return 'triangle_shield';
   }

   function getRandomHelmetSubtype() {
     const roll = Math.random();
     if (roll < 0.4) return 'hood';
     if (roll < 0.7) return 'cask';
     if (roll < 0.9) return 'steel_cask';
     return 'helmet';
   }

   function getRandomBracerSubtype() {
     const roll = Math.random();
     if (roll < 0.6) return 'leather_bracer';
     return 'bracers';
   }

  function getRandomPantsSubtype() {
     const roll = Math.random();
     if (roll < 0.6) return 'pants';
     return 'combat_pants';
   }

  function getRandomBootsSubtype() {
     const roll = Math.random();
     if (roll < 0.6) return 'boots';
     return 'combat_boots';
   }

  function getRandomGlovesSubtype() {
     const roll = Math.random();
     if (roll < 0.6) return 'leather_gloves';
     return 'gloves';
   }


   function getRandomItemLevel(characterLevel) {
     const roll = Math.random() * 100;
     if (roll < 60) return characterLevel;        
     if (roll < 85) return characterLevel + 1;    
     return characterLevel + 2;                   
   }


function normalizeName(name) {
  return name
    .toLowerCase()
    .normalize("NFD") // usuwa znaki diakrytyczne
    .replace(/[\u0300-\u036f]/g, "") // kasuje ogonki
    .replace(/\s+/g, "-") // spacje → myślniki
    .replace(/[^a-z0-9\-]/g, ""); // tylko litery, cyfry i myślniki
}


function randomBetweenInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max, precision = 1) {
  const value = Math.random() * (max - min) + min;
  return Number(value.toFixed(precision));
}

function weightedBonusRandom(list) {
  if (!list.length) return null;
   
  const total = list.reduce((s, b) => s + (b.weight || 0), 0);
  if (total <= 0) return null;

  let roll = Math.random() * total;

  for (const item of list) {
    roll -= item.weight || 0;
    if (roll <= 0) return item;
  }

  // fallback (bezpieczny)
  return list[list.length - 1] || null;
}

function maybeAddLegendaryExclusive(rarity, typ) {
  if (rarity !== "legendary") return; 
  
  // 70% szans że legenda ma ekskluzywny affix
  if (Math.random() > 0.7) return;

  const pool = legendaryExclusiveAffixes.filter(a =>
    a.allowedSlots.includes(typ)
  );

  if (!pool.length) return;

  const affix = weightedBonusRandom(pool);
  
  return {
    exclusive: {
      name: affix.name,
      desc: affix.description,
      legendaryExclusive: true
    }
  };
  
}

function getImplicitBonus({ itemTypeKey, itemLevel, rarityMultiplier = 1 }) {
  const implicitDefs = implicitBySlot[itemTypeKey];
  if (!implicitDefs) return { implicit: null };

  const pool = Array.isArray(implicitDefs)
    ? implicitDefs
    : [implicitDefs];

  //console.error(`itemTypeKey, itemLevel, rarityMultiplier`, itemTypeKey, itemLevel, rarityMultiplier);
  
  const chosen = weightedBonusRandom(pool);
  const base = getRandomFloat(chosen.min, chosen.max, 1);
  const softScale = 1 + 0.015 * Math.sqrt(itemLevel);

  const value = Number((base * rarityMultiplier * softScale).toFixed(1));

  //console.error(`chosen implicit name, value`, chosen.nazwa, value);

  return {
    implicit: {
      id: chosen.id,
      value,
      tags: chosen.tags || []
    }
  };
}

function canApplyBonus(bonus, used, usedTags, limits, slot) {
  //if (bonus?.category === "combat") return true;
  
  if (used.has(bonus.id)) return false;

  const tags = bonus.tags || [];
  for (const tag of tags) {
    const limit = limits?.[slot]?.[tag];
    if (limit !== undefined && (usedTags[tag] || 0) >= limit) {
      return false;
    }
  }
  return true;
}


function getAllowedBonuses(list, used, usedTags, limits, slot) {
  return list.filter(bonus => {
    if (used.has(bonus.id)) return false;

    const tags = bonus.tags || [];
    for (const tag of tags) {
      const limit = limits?.[slot]?.[tag];
      if (limit !== undefined && (usedTags[tag] || 0) >= limit) {
        return false;
      }
    }
    return true;
  });
}

function generateBonusValue(bonus, itemTypeKey, rarityMultiplier, bonusMultiplier, combatScale, softScale) {
  const min = bonus.min ?? 0;
  const max = bonus.max ?? 0;

  const meta = bonus.meta || getAffixMeta(bonus);
  const isLowPercent = meta.type === "percent_low";
  const isCombatScale = meta.type === "combat_scale";

  const base = isLowPercent || isCombatScale
    ? getRandomFloat(min, max, 1)
    : getRandomInt(min, max);

  let value = base * (rarityMultiplier || 1);

  if (isLowPercent) value *= softScale;
  else if (isCombatScale) value *= combatScale; 
  else value *= bonusMultiplier; 
  
  //value *= isLowPercent ? softScale : bonusMultiplier;

  const slotMult = slotBonusMultiplier[itemTypeKey] || 1;

  const id = bonus.id || LEGACY_AFFIX_MAP[bonus.nazwa];

  value *= slotScaledBonuses.includes(id) ? slotMult : 1;

  value = isLowPercent || isCombatScale
    ? Number(value.toFixed(1))
    : Math.floor(value);

  //console.log(`bonus value`, id, value);
  return value;
}

function buildResistBonus(result, bonus, rarity, rarityMultiplier, bonusMultiplier, options = {}) {
  if(bonus?.category === `combat`) return;
  
  const base = getRandomInt(bonus.min, bonus.max);
  const value = Math.floor(base * (rarityMultiplier || 1) * bonusMultiplier);

  const shuffledElements = [...bonus?.elements].sort(() => 0.5 - Math.random());
  const limit = maxResistByRarity[rarity] || 2;

  let howMany = Math.floor(Math.random() * (limit + 1));

  if (options.forceAtLeastOne && howMany === 0) {
    howMany = 1;
  }

  //console.log(`resist build howMany`, howMany);
  
  if (howMany === 0) return;

  //console.log(`resist build after howMany return`);
  
  const selected = shuffledElements.slice(0, howMany);

  if (selected.length === 4) {
       result.push({
         id: "all_resist",
         value
       });
      //console.log(`all resist dodany w build resist`, value);
     } else {
       selected.forEach(el => {
         result.push({
           id: "elemental_resist",
           element: el,
           value
         });
       });
     }

  //console.log(`resist dodany w build resist`);

  
 /* if (selected.length === 4) {
    result.push({
      id: "all_resist",
      value
    });
  } else {
    selected.forEach(el => {
      result.push({
        id: `res_${el.toLowerCase()}`, // 🔥 np. res_fire
        value
      });
    });
  }*/


}

function getBaseLifeRegen(level) {
  const minRegen = 1;
  const maxRegen = 9; // środek 8–10
  const t = Math.min(level / 100, 1);

  return minRegen + Math.pow(t, 1.4) * (maxRegen - minRegen);
}

let hardDefensiveUsed = false;

function rollAffixes(pool, count, used, usedTags, itemTypeKey, rarityMultiplier, bonusMultiplier, rarity) {
  const result = [];

  let resistAdded = false;
  let attempts = 0;
  const MAX_ATTEMPTS = 100;

  while (result.length < count && attempts < MAX_ATTEMPTS) {

    attempts++;

    const allowed = pool.filter(b =>
      canApplyBonus(
        b,
        used,
        usedTags,
        synergyLimits,
        itemTypeKey
      )
    );

    if (!allowed.length) break;

    const affix = weightedBonusRandom(allowed);

    if (!affix) break;

    if (HARD_DEFENSIVE_AFFIXES.includes(affix.id) && hardDefensiveUsed) {
       continue;
    }
    
    if (used.has(affix.id)) continue;

    const tags = affix.tags || [];

    let blocked = false;

    for (const tag of tags) {

      const limit =
        synergyLimits[itemTypeKey]?.[tag];

      if (
        limit !== undefined &&
        (usedTags[tag] || 0) >= limit
      ) {
        blocked = true;
        break;
      }
    }

    if (blocked) continue;

 /*   // ✅ Obsługa odporności na żywioł
    if (affix.id === "elemental_resist" && !resistAdded) {
     resistAdded = true;
     used.add(affix.id);

     const base = getRandomInt(affix.min, affix.max);
     const value = Math.floor(base * (rarityMultiplier || 1) * bonusMultiplier);
      
     const shuffledElements = [...affix.elements].sort(() => 0.5 - Math.random());
     const limit = maxResistByRarity[rarity] || 2;
     const howMany = Math.floor(Math.random() * (limit + 1));
     if (howMany === 0) continue;
     const selected = shuffledElements.slice(0, howMany);

     if (selected.length === 4) {
       result.push({
         id: "all_resist",
         value
       });
       console.log(`all resist dodany w roll`, value);
     } else {
       selected.forEach(el => {
         result.push({
           id: "elemental_resist",
           element: el,
           value
         });
       });
     }
      
     console.log(`resist dodany w roll`);
     continue;
    }*/
    
    used.add(affix.id);

    tags.forEach(tag => {
      usedTags[tag] =
        (usedTags[tag] || 0) + 1;
    });

    result.push(affix);
  }

  return result;
}

function getRandomBonus(rarity, rarityMultiplier, itemLevel, typ, dmg, armor, speed, block, diagnostic, weaponStyle) {
  
  const rarityIndex = rarityOrder.indexOf(rarity);
  const bonusMultiplier = 1 + 0.08 * (itemLevel - 1);
  const combatScale = 1 + 0.004 * (itemLevel - 1);
  const softScale = 1 + 0.015 * Math.sqrt(itemLevel);
  const critMultiplier = 1 + 0.04 * (itemLevel - 1);

  const isWeapon = typ === "weapon";
  const isArmor = !isWeapon;
  const isShield = typ === "shield";
  const isGloves = typ === `gloves`;
  const isHelmet = typ === `helmet`;
  const isShoulder = typ === `shoulder`;
  const isBracers = typ === `bracers`;
  const isBelt = typ === `belt`;
  const isPants = typ === `pants`;
  const isBoots = typ === `boots`;
  
  const itemTypeKey = isWeapon
    ? "weapon"
    : isShield
    ? "shield"
    : isGloves
    ? "gloves"
    : isHelmet
    ? `helmet`
    : isShoulder
    ? `shoulder`
    : isBracers
    ? `bracers`
    : isBelt
    ? "belt"
    : isPants
    ? `pants`
    : isBoots
    ? `boots`
    : "armor";
  
  available = baseBonuses.filter(b =>
    rarityOrder.indexOf(b.minRarity) <= rarityIndex &&
    (!b.types || b.types.includes(itemTypeKey))
  );
  
  available = available.filter(b => {
    if (b.chance == null) return true;
    return Math.random() < b.chance;
  });
  
/*  available = available.filter(b => {
    if (!b.types?.includes("weapon")) return true;

    if (!b.combatStyle) return true;
    return b.combatStyle.includes(weaponStyle);
  });*/
  
  if (itemTypeKey === "weapon") {
    available = available.filter(b => {
      if (!b.combatStyle) return true;
      return b.combatStyle.includes(weaponStyle);
    });
  }
  
  const implicitName = implicitBySlot[itemTypeKey]?.nazwa;
  if (implicitName) {
      available = available.filter(b => 
      b.id !== implicitName || b.canStackWithImplicit
    );
  }
  
  const cfg = affixConfig[rarity];
  //console.log(`rarity`, rarity, cfg.normal[0]);
  const normalCount = getRandomInt(cfg.normal[0], cfg.normal[1]);
  const combatCount = getRandomInt(cfg.combat[0], cfg.combat[1]);

  /*const [minCount, maxCount] = countByRarity[rarity] || [0, 0];
  const bonusCount = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
  */
  
  const normalPool = available.filter(
    b => b.category !== "combat"
  );

  const combatPool = available.filter(
    b => b.category === "combat"
  );
  
  let updatedDmg = dmg;
  let updatedArmor = armor;
  let updatedSpeed = speed;
  let updatedBlock = block;

  //let resistAdded = false;

  const resistChance = Math.random();
  const allowResistance = resistChance < 0.5;
  
  const usedTags = {};
  let result = [];
  const used = new Set();
  
  const normalAffixes = rollAffixes(
    normalPool,
    normalCount,
    used,
    usedTags,
    itemTypeKey,
    rarityMultiplier,
    bonusMultiplier,
    rarity
  );

  const combatAffixes = rollAffixes(
    combatPool,
    combatCount,
    used,
    usedTags,
    itemTypeKey,
    rarityMultiplier,
    bonusMultiplier,
    rarity
  );

  const selectedAffixes = [
    ...normalAffixes,
    ...combatAffixes
  ];
  
  //console.log(`normalCount, normalAffixes.lenght`, normalCount, normalAffixes.length, rarity, typ);
  //console.log(`combatCount, combatAffixes.lenght`, combatCount, combatAffixes.length, rarity, typ);

  selectedAffixes.forEach(bonus => {

    const base = getRandomInt(bonus.min, bonus.max);
    let value = generateBonusValue(bonus, itemTypeKey, rarityMultiplier, bonusMultiplier, combatScale ,softScale);
    const roll = getRandomFloat(0.75, 1.25);  
      
    if (HARD_DEFENSIVE_AFFIXES.includes(bonus.id)) {
   //   console.log(`bonus.nazwa in hard defensive affixes = true`, bonus.nazwa);
      hardDefensiveUsed = true;
    }
    
    switch (bonus.id) {

      case "elemental_resist": {
       // console.log(`added build resist`);
        buildResistBonus(result, bonus, rarity, rarityMultiplier, bonusMultiplier,  { forceAtLeastOne: true });
        // { forceAtLeastOne: true }
        break;
      }
      
      case "crit_chance": {
        value = Math.floor(base * critMultiplier);
        result.push({ id: "crit_chance", value });
        break;
      }
       
      case "life_regen_flat": {
        value = Math.round(getBaseLifeRegen(itemLevel));
        result.push({ id: "life_regen_flat", value });
        break;
      }

      case "strength":
      case "dexterity":
      case "vitality": {
        value = Math.floor(value * (Math.random() * 0.15 + 0.85));
        result.push({ id: bonus.id, value });
        break;
      }

      case "elemental_damage": {
        const element = getRandomFrom(["fire", "cold", "arcane", "poison"]);
        result.push({
          id: "elemental_damage",
          element,
          value
        });
        break;
      }

      case "damage_percent": {
        if (isWeapon) {
         updatedDmg = Math.floor(updatedDmg * (1 + value / 100));
        } 
        result.push({ id: "damage_percent", value });
        break;
      }
      
      case "armor_percent": {
        if (isArmor) {
          updatedArmor = Math.floor(updatedArmor * (1 + value / 100));
        }
        result.push({ id: "armor_percent", value });
        break;
      }

      case "attack_speed_percent": {
        if (isWeapon) {
          updatedSpeed = (updatedSpeed * (1 + value / 100)).toFixed(2);
        }
        result.push({ id: "attack_speed_percent", value });
        break;
      }

      case "block_chance": {
        if (isShield) {
          updatedBlock = Math.floor(updatedBlock * (1 + value / 100));
        }
        result.push({ id: "block_chance", value });
        break;
      }

      default: {
        //console.log(`generate bonus category`, bonus.id, bonus?.category, typ, value);
        if(bonus.category === `combat`) {
          result.push({ id: bonus.id, value, category: bonus.category, archetype: bonus.archetype });
        } else {
          result.push({ id: bonus.id, value });
        }
     }
    }
    
     //let minCount = bonus?.category === `combat` ? combatCount : normalCount;
     //console.log(`result.length, minCount`, result.length, normalCount, rarity, typ, bonus.id);
     let minCount = normalCount;

    if (result.length < minCount) {
      
      let safety = 0;
           
       while (result.length < minCount && safety-- > 0) {
         
        const fallbackPool = available.filter(b =>
          canApplyBonus(b, used, usedTags, synergyLimits, itemTypeKey)
        );

        if (!fallbackPool.length) break;
         
        const bonus = weightedBonusRandom(fallbackPool);
        if (!bonus) break;
         
        if(bonus?.category === "combat") break;
         
        const base = getRandomInt(bonus.min, bonus.max);

        let value = generateBonusValue(bonus, itemTypeKey, rarityMultiplier, bonusMultiplier, softScale);
        
        used.add(bonus.id);
        
        switch (bonus.id) {

          case "elemental_resist": {
            //console.log(`added build resist dogrywka`);
            buildResistBonus(result, bonus, rarity, rarityMultiplier, bonusMultiplier);
            break;
          }

          case "armor_percent": {
            if (isArmor) {
              updatedArmor = Math.floor(updatedArmor * (1 + value / 100));
            }
            result.push({ id: "armor_percent", value });
            break;
          }

          case "damage_percent": {
            if (isWeapon) {
              updatedDmg = Math.floor(updatedDmg * (1 + value / 100));
            }
            result.push({ id: "damage_percent", value });
            break;
          }

          case "elemental_damage": {
            const element = getRandomFrom(["fire", "cold", "arcane", "poison"]);
            
            result.push({
              id: "elemental_damage",
              element,
              value
            });
            break;
          }

          case "crit_chance": {
            value = Math.floor(base * critMultiplier);
            result.push({ id: "crit_chance", value });
            break;
          }

          case "life_regen_flat": {
            value = Math.round(getBaseLifeRegen(itemLevel));
            result.push({ id: "life_regen_flat", value });
            break;
          }

          default: {
            //console.log(`generate bonus category dogrywka`, bonus.id, bonus?.category, typ);
            if(bonus.category === `combat`) {
             // result.push({ id: bonus.id, value, category: bonus.category });
            } else {
              result.push({ id: bonus.id, value });
            }
          }
        }
         
        // === AKTUALIZACJA TAGÓW (KLUCZ) ===
        for (const tag of bonus.tags || []) {
          usedTags[tag] = (usedTags[tag] || 0) + 1;
        }
                
        //fallbackPool.splice(fallbackPool.indexOf(bonus), 1);
      }
    }
    
   /* const hasResist = result.some(b => b.id.includes("resist"));

    const hasDefTag =
     (usedTags["def"] || 0) > 0;// ||
     //(usedTags["resist"] || 0) > 0;

    const hasOffenseTag = (usedTags["offense"] || 0) > 0;
    
   // console.warn(`!hasResist, !hasDefTag, !hasOffenseTag`, !hasResist, !hasDefTag, !hasOffenseTag);
    
    if (!hasResist && !hasOffenseTag && rarity === "legendary") {
      const resistBonus = baseBonuses.find(
        b => b.id === "elemental_resist"
      );
      if (!resistBonus) return;
      
      console.warn(`dodaje ostatecznie resist`);
    
      buildResistBonus(
        result,
        resistBonus,
        rarity,
        rarityMultiplier,
        bonusMultiplier,
        { forceAtLeastOne: true }
      );

      console.warn(`resist ostatecznie dodany`);
    
      usedTags["resist"] = (usedTags["resist"] || 0) + 1;
    }*/
    
  });
  
  /*const result = [];
  
  let attempts = 0;
  const MAX_ATTEMPTS = 100;
  
  let bonus = null;
  
  while (result.length < bonusCount && attempts < MAX_ATTEMPTS) {
    if (!available.length) break; // albo return

    attempts++;
    
    const allowed = available.filter(b =>
      canApplyBonus(b, used, usedTags, synergyLimits, itemTypeKey)
    );
    
    if (!allowed.length) break;

    bonus = weightedBonusRandom(allowed);
    
    if (!bonus) break;
    
   //  console.log(`bonus.nazwa before hard defensive affixes`, bonus.nazwa);
     // ❌ BLOKADA twardych defensywnych
    if (HARD_DEFENSIVE_AFFIXES.includes(bonus.id) && hardDefensiveUsed) {
       continue;
    }
    
  //  console.log(`bonus.nazwa after hard defensive affixes`, bonus.nazwa);
    
    if (used.has(bonus?.id)) continue;
    
    const tags = bonus.tags || [];

    let blocked = false;
    for (const tag of tags) {
      const limit = synergyLimits[itemTypeKey]?.[tag];
    //  console.log(`itemTypeKey tag limit`, itemTypeKey, tag, limit);
      if (limit !== undefined && (usedTags[tag] || 0) >= limit) {
    //    console.log(`usedTags[tag], tag, limit`, usedTags[tag], tag, limit);
        blocked = true;
        break;
      }
    }
    
    if (blocked) continue;
    
    // ✅ Obsługa odporności na żywioł
    if (bonus.id === "elemental_resist" && !resistAdded) {
     resistAdded = true;
     used.add(bonus.id);

     const base = getRandomInt(bonus.min, bonus.max);
     const value = Math.floor(base * (rarityMultiplier || 1) * bonusMultiplier);
      
     const shuffledElements = [...bonus.elements].sort(() => 0.5 - Math.random());
     const limit = maxResistByRarity[rarity] || 2;
     const howMany = Math.floor(Math.random() * (limit + 1));
     if (howMany === 0) continue;
     const selected = shuffledElements.slice(0, howMany);

     if (selected.length === 4) {
       result.push({
         id: "all_resist",
         value
       });
     } else {
       selected.forEach(el => {
         result.push({
           id: "elemental_resist",
           element: el,
           value
         });
       });
     }
      
     continue;
    }
    
    // 👇 Przetwarzanie zwykłych bonusów
    used.add(bonus.id);
    
    tags.forEach(tag => {
      usedTags[tag] = (usedTags[tag] || 0) + 1;
    });
    
    const base = getRandomInt(bonus.min, bonus.max);
    let value = generateBonusValue(bonus, itemTypeKey, rarityMultiplier, bonusMultiplier, softScale);
    const roll = getRandomFloat(0.75, 1.25);  
      
    if (HARD_DEFENSIVE_AFFIXES.includes(bonus.id)) {
   //   console.log(`bonus.nazwa in hard defensive affixes = true`, bonus.nazwa);
      hardDefensiveUsed = true;
    }
    
    switch (bonus.id) {

      case "crit_chance": {
        value = Math.floor(base * critMultiplier);
        result.push({ id: "crit_chance", value });
        break;
      }
       
      case "life_regen_flat": {
        value = Math.round(getBaseLifeRegen(itemLevel));
        result.push({ id: "life_regen_flat", value });
        break;
      }

      case "strength":
      case "dexterity":
      case "vitality": {
        value = Math.floor(value * (Math.random() * 0.15 + 0.85));
        result.push({ id: bonus.id, value });
        break;
      }

      case "elemental_damage": {
        const element = getRandomFrom(["fire", "cold", "arcane", "poison"]);
        result.push({
          id: "elemental_damage",
          element,
          value
        });
        break;
      }

      case "damage_percent": {
        if (isWeapon) {
         updatedDmg = Math.floor(updatedDmg * (1 + value / 100));
        } 
        result.push({ id: "damage_percent", value });
        break;
      }
      
      case "armor_percent": {
        if (isArmor) {
          updatedArmor = Math.floor(updatedArmor * (1 + value / 100));
        }
        result.push({ id: "armor_percent", value });
        break;
      }

      case "attack_speed_percent": {
        if (isWeapon) {
          updatedSpeed = (updatedSpeed * (1 + value / 100)).toFixed(2);
        }
        result.push({ id: "attack_speed_percent", value });
        break;
      }

      case "block_chance": {
        if (isShield) {
          updatedBlock = Math.floor(updatedBlock * (1 + value / 100));
        }
        result.push({ id: "block_chance", value });
        break;
      }

      default: {
        console.log(`generate bonus category`, bonus.id, bonus?.category);
        if(bonus.category === `combat`) {
          result.push({ id: bonus.id, value, category: bonus.category });
        } else {
          result.push({ id: bonus.id, value });
        }
     }
    }
    
     if (result.length < minCount) {
      
       let safety = 50;
           
       while (result.length < minCount && safety-- > 0) {
      
        const fallbackPool = available.filter(b =>
          canApplyBonus(b, used, usedTags, synergyLimits, itemTypeKey)
        );

        if (!fallbackPool.length) break;
         
        const bonus = weightedBonusRandom(fallbackPool);
        if (!bonus) break;

        const base = getRandomInt(bonus.min, bonus.max);

        let value = generateBonusValue(bonus, itemTypeKey, rarityMultiplier, bonusMultiplier, softScale);
        
        used.add(bonus.id);
        
        switch (bonus.id) {

          case "elemental_resist": {
            buildResistBonus(result, bonus, rarity, rarityMultiplier, bonusMultiplier);
            break;
          }

          case "armor_percent": {
            if (isArmor) {
              updatedArmor = Math.floor(updatedArmor * (1 + value / 100));
            }
            result.push({ id: "armor_percent", value });
            break;
          }

          case "damage_percent": {
            if (isWeapon) {
              updatedDmg = Math.floor(updatedDmg * (1 + value / 100));
            }
            result.push({ id: "damage_percent", value });
            break;
          }

          case "elemental_damage": {
            const element = getRandomFrom(["fire", "cold", "arcane", "poison"]);
            
            result.push({
              id: "elemental_damage",
              element,
              value
            });
            break;
          }

          case "crit_chance": {
            value = Math.floor(base * critMultiplier);
            result.push({ id: "crit_chance", value });
            break;
          }

          case "life_regen_flat": {
            value = Math.round(getBaseLifeRegen(itemLevel));
            result.push({ id: "life_regen_flat", value });
            break;
          }

          default: {
            console.log(`generate bonus category`, bonus.id, bonus?.category);
            if(bonus.category === `combat`) {
              result.push({ id: bonus.id, value, category: bonus.category });
            } else {
              result.push({ id: bonus.id, value });
            }
          }
        }
         
        // === AKTUALIZACJA TAGÓW (KLUCZ) ===
        for (const tag of bonus.tags || []) {
          usedTags[tag] = (usedTags[tag] || 0) + 1;
        }
                
        //fallbackPool.splice(fallbackPool.indexOf(bonus), 1);
      }
    }
    
    const hasResist = result.some(b => b.id.includes("resist"));

    const hasDefTag =
     (usedTags["def"] || 0) > 0;// ||
     //(usedTags["resist"] || 0) > 0;

    const hasOffenseTag = (usedTags["offense"] || 0) > 0;
    
   // console.warn(`!hasResist, !hasDefTag, !hasOffenseTag`, !hasResist, !hasDefTag, !hasOffenseTag);
    
    if (!hasResist && !hasOffenseTag && rarity === "legendary") {
      const resistBonus = baseBonuses.find(
        b => b.id === "elemental_resist"
      );
      if (!resistBonus) return;
      
     // console.warn(`dodaje ostatecznie resist`);
    
      buildResistBonus(
        result,
        resistBonus,
        rarity,
        rarityMultiplier,
        bonusMultiplier,
        { forceAtLeastOne: true }
      );

     // console.warn(`resist ostatecznie dodany`);
    
      usedTags["resist"] = (usedTags["resist"] || 0) + 1;
    }
    
  }*/
  
 /* const hasEconomyTag = (usedTags["economy"] || 0) > 0;
    
  if (result.length <= 3 && !hasEconomyTag && (typ === `Hełm` || typ === `Pas`) && (rarity === `epic` || rarity === `legendary`)) {
       const base = getRandomInt(1.5, 2);
       let bonus = null;
       bonus.min = 1.5;
       bonus.max = 2;
       bonus.id = "magic_find";
       
       let value = generateBonusValue(bonus, itemTypeKey, rarityMultiplier, bonusMultiplier, softScale);
      
       result.push({ id: bonus.id, value: value });
      
       usedTags["economy"] = (usedTags["economy"] || 0) + 1;
  }

  if (result.length <= 3 && !hasEconomyTag && (typ === `Rękawice`) && (rarity === `epic` || rarity === `legendary`)) {
       const base = getRandomInt(1.5, 2);
       let bonus = null;
       bonus.min = 1.5;
       bonus.max = 1.5;
       bonus.id = "gold_bonus";
       
       let value = generateBonusValue(bonus, itemTypeKey, rarityMultiplier, bonusMultiplier, softScale);
      
       result.push({ id: bonus.id, value: value });
      
       usedTags["economy"] = (usedTags["economy"] || 0) + 1;
    //  console.error(`dodaje gf na koncu`, result.length);
  }*/

  
  
  return { bonusy: result, updatedDmg, updatedArmor, updatedSpeed, updatedBlock };
}


// funkcja zwracająca string nazwy pliku
function assignSprite(baseName) {
  const translated = spriteMap[baseName] || spriteMap['default'];
  return `${translated}.png`;
}

function getRandomRarity({ 
    enemyType = 'normal', 
    magicBoost = 0, 
    maxRarity = null,
    minRarity = null,  
    charLevel = 1, // <--- DODANE
    ignoreLevelRequirement = false
  } = {}) {
  const cfg = enemyLootConfig[enemyType] || { multiplier: 1 };
  const mult = Math.max(1, cfg.multiplier || 1);

  const n = rarityOrder.length;
  const lowFactor  = 1 / mult;
  const highFactor = mult;

  const adjusted = {};
  let total = 0;

  // limit najwyższej klasy, jeśli podano maxRarity
  const maxIdx = maxRarity ? rarityOrder.indexOf(maxRarity) : n - 1;
  const minIdx = minRarity ? rarityOrder.indexOf(minRarity) : 0;
    
  for (let i = 0; i < n; i++) {
    const r = rarityOrder[i];

    // blokada minimalnej klasy
    if (i < minIdx) {
      adjusted[r] = 0;
      continue;
    }
    
    // 1) Hard limit po maxRarity
    if (i > maxIdx) {
      adjusted[r] = 0;
      continue;
    }

    // 2) LIMITY POZIOMOWE – BLOKUJ EPIC/LEGEND DO OKREŚLONYCH LVL
    if (!ignoreLevelRequirement) {
      if ((r === 'epic' && charLevel < 999999) || //10
          (r === 'legendary' && charLevel < 999999)) { //20
        adjusted[r] = 0;
        continue;
      }
    }
    
    const base = rarityWeights[r];
    const t = i / (n - 1); 
    const biasBoost = lowFactor + (highFactor - lowFactor) * t;
    const magicFactor = 1 + magicBoost * t;

    const w = base * biasBoost * magicFactor;
    adjusted[r] = w;
    total += w;
  }

  // DEBUG
  if (typeof console !== 'undefined') {
    const probs = {};
    for (const r of rarityOrder) {
      probs[r] = total > 0 ? +(adjusted[r] / total).toFixed(4) : 0;
    }
   /* console.log(
      `[RARITY] type=${enemyType} mult=${mult} lvl=${charLevel} magicBoost=${magicBoost.toFixed(3)} max=${maxRarity || '-'}\n` +
      `        adjW=${JSON.stringify(adjusted)}\n` +
      `        probs=${JSON.stringify(probs)}`
    );*/
  }

  let roll = Math.random() * total;
  for (const r of rarityOrder) {
    const w = adjusted[r];
    if (w <= 0) continue;
    if (roll < w) return r;
    roll -= w;
  }

  //return rarityOrder[Math.min(maxIdx, 0)];
  return rarityOrder[minIdx];
}

function getRandomRarityFromChest(weights) {
  let totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  let roll = Math.random() * totalWeight;

  for (const [rarity, weight] of Object.entries(weights)) {
    if (roll < weight) return rarity;
    roll -= weight;
  }
  return "common";
}

//Wykładniczo - bardzo złe
/*function scalePriceByLevel(basePrice, itemLevel) {
  // Każdy poziom mnoży cenę ×1.07 (7% drożej niż poprzedni poziom)
  const multiplier = Math.pow(1.07, itemLevel - 1);
  return Math.round(basePrice * multiplier);
}*/

//Potęgowanie - w miarę dobre
function scalePriceByLevel(basePrice, level) {
  const multiplier = Math.pow(level, 0.85);
  return Math.round(basePrice * multiplier);
}

//Hybrydowe - najlepsze
/*function scalePriceByLevel(basePrice, level) {
  const early = Math.pow(1.1, Math.min(level, 20));
  const late = Math.pow(level, 0.8);
  return Math.round(basePrice * early * late / 10);
}*/

function pickSlotProfile(slotProfile) {
  const list = Object.entries(slotProfile);
  const total = list.reduce((s, [,p]) => s + p.weight, 0);

  let roll = Math.random() * total;
  for (const [key, profile] of list) {
   // console.warn(`profile.name`, profile.name);
    roll -= profile.weight;
    if (roll <= 0) return { key, profile };
  }
}



function generateItem(opts = {}) {
  const {
    minRarity = "common",
    maxRarity = "legendary",
    isChest = false,
    chestType = null,
    enemyType = null,
    forceRarity = null,
    forceLevel = null,
    forceType = null,
    forceSubtype = null,
    diagnostic = false,
    isShopItems = false
  } = opts;

  //const typ = diagnostic ? forceType : window.forceItemType || getRandomFrom(allTypes);
  const typ = forceType || window.forceItemType || getRandomFrom(allTypes);
  
  // 🧠 Poziom postaci
  const char = gameState.char;
  const charLevel = char.level || 1;
  //let itemLevel = diagnostic ? forceLevel : getRandomItemLevel(char.level);
  let itemLevel = forceLevel || getRandomItemLevel(char.level);

  if(isShopItems) {
    itemLevel = forceLevel;
  }
  const levelMultiplier = 1 + 0.5 * (itemLevel - 1);   // +20% za każdy poziom wyżej
  const weaponExponent = 1.05;
  const armorExponent = 1.20;
  const baseWeaponCurve = Math.pow(itemLevel, weaponExponent);
  const baseArmorCurve = Math.pow(itemLevel, armorExponent);
  
  const magicFind = char?.equipment
  ? Object.values(char.equipment)
      .flatMap(item => item?.statystyki || [])
      .filter(stat => stat.id === "magic_find")
      .reduce((sum, stat) => sum + parseFloat(stat.value || 0), 0)
  : 0;
//  console.log("magicFind", magicFind);
  
  const magicBoost = Math.min(magicFind / 100, 1.0); // 0–100% maks 
 // console.log("magicBoost", magicBoost);
  
  let klasa;
  /*if (window.forceItemClass) {
    klasa = window.forceItemClass;
  }*/
  
  let ignoreLevelRequirement = false;
  if(gameState.mode === `expedition` || gameState.mode === `sandbox`) {
    ignoreLevelRequirement = true;
  }
  
  if (forceRarity) {
    klasa = forceRarity; // twarde wymuszenie
 //   console.log("[generateItem] forceRarity =", klasa);
  } else if (isChest && chestType && chestWeights[chestType]) {
    klasa = getRandomRarityFromChest(chestWeights[chestType]);
  } else {
    klasa = getRandomRarity({ enemyType, magicBoost, charLevel, maxRarity, minRarity, ignoreLevelRequirement });
  }
   
  let baseName =
    forceSubtype ||
    (typ === 'weapon' ? getRandomWeaponSubtype() :
     typ === 'armor' ? getRandomArmorSubtype() :
     typ === 'shield' ? getRandomShieldSubtype() :
     typ === 'helmet' ? getRandomHelmetSubtype() :
     typ === 'bracers' ? getRandomBracerSubtype() :
     typ === 'gloves' ? getRandomGlovesSubtype() :
     typ);
  
 // console.log(`baseName, forceSubtype, typ`, baseName, forceSubtype, typ);
  
  let name;

  const rarityMultiplier = {
    common: 1,
    rare: 1.2,
    unique: 1.35,
    epic: 1.6,
    legendary: 2
  }[klasa];
  
  let blockMultiplier =  { common: 1, rare: 1, unique: 1.1, epic: 1.3, legendary: 1.5 }[klasa];
  
  let statystyki = [];
  let baseValue = 0;
   
  let bonusPercent = 0;
     
  let dmg = 0;
  let speed = 1.0;
  let base = 1;
  let armor = 1;
  let block = 0;
     
  let isTwoHanded = false;
  let poiseDamage = 0;
  
  let isVaryArmor = false;
  
  let style = ``;
  
  // ⚔️ Broń
  if (typ === 'weapon') {
    
    itemTypeKey = `weapon`;
    let baseFlat = 0;
    
     switch (baseName) {
      case 'short_sword':
        dmgMultiplier = 1;
        speed = 0.8;
        style = `sword`;
        baseFlat = 1;
        break;
      case 'mace':
        dmgMultiplier = 1.2;
        speed = 0.75;
        style = `mace`;
        baseFlat = 2;
        break;
      case 'axe':
        dmgMultiplier = 1.4;
        speed = 0.7;
        style = `axe`;
        baseFlat = 3;
        break;
      case 'long_sword':
        dmgMultiplier = 1.6;
        speed = 0.65;
        style = `longsword`;
        baseFlat = 4;
        break;
      case 'great_sword':
        dmgMultiplier = 2.1;
        speed = 0.48;
        isTwoHanded = true;
        style = `greatsword`;
        baseFlat = 6;
        break;
      case 'double_axe':
        dmgMultiplier = 2.2;
        speed = 0.46;
        isTwoHanded = true;
        style = `doubleAxe`;
        baseFlat = 7;
        break;
      case 'spear':
        dmgMultiplier = 2.0;
        speed = 0.5;
        isTwoHanded = true;
        style = `spear`;
        baseFlat = 5;
        break;
      case 'hammer':
        dmgMultiplier = 2.4;
        speed = 0.42;
        isTwoHanded = true;
        poiseDamage = 35;
        style = `hammer`;
        baseFlat = 9;
        break;
      default:
        dmgMultiplier = 1.2;
        speed = 1.0;
    }
    
      const roll = getRandomFloat(0.95, 1.05); // max ±10%
      dmg = Math.floor(WEAPON_BASE_MIN + baseFlat + baseWeaponCurve * dmgMultiplier * rarityMultiplier * roll);
      statystyki.push({ id: 'damage', value: dmg });
      statystyki.push({ id: 'attack_speed', value: parseFloat(speed.toFixed(2)) });
      baseValue = dmg; 
  } else {
    // 🛡️ Pancerz
    
     switch (typ) {
      case 'helmet':
        itemTypeKey = `helmet`;
        isVaryArmor = true;
  
        const { profile: helmetProfile } = pickSlotProfile(helmetProfiles);
        //console.warn(`profile.name`, helmetProfile.name);
 
        baseName = helmetProfile.name;

        base = helmetProfile.baseArmor;

        break;
      case 'shoulder':
        itemTypeKey = `shoulder`;
        break;
      case 'bracers':
        itemTypeKey = `bracers`;
        isVaryArmor = true;
  
        const { profile: bracerProfile } = pickSlotProfile(bracerProfiles);
        //console.warn(`profile.name`, bracerProfile.name);
 
        baseName = bracerProfile.name;

        base = bracerProfile.baseArmor;
       
        break;
      case 'gloves':
        itemTypeKey = `gloves`;
        isVaryArmor = true;
  
        const { profile: glovesProfile } = pickSlotProfile(glovesProfiles);
        //console.warn(`profile.name`, glovesProfile.name);
 
        baseName = glovesProfile.name;

        base = glovesProfile.baseArmor;

        break;
      case 'belt':
        itemTypeKey = `belt`;
        break;
      case 'pants':
        itemTypeKey = `pants`;
        isVaryArmor = true;
  
        const { profile: pantsProfile } = pickSlotProfile(pantsProfiles);
        //console.warn(`profile.name`, pantsProfile.name);
 
        baseName = pantsProfile.name;

        base = pantsProfile.baseArmor;
       
        break;
      case 'shield':
        itemTypeKey = `shield`;
        isVaryArmor = true;
       
        const { key: shieldKey, profile: shieldProfile } = pickSlotProfile(shieldProfiles);
       
      //  console.error(`shieldProfile.name, shieldKey`, shieldProfile.name, shieldKey);
      //  console.error(`shieldProfile.baseArmor, shieldKey`, shieldProfile.baseArmor, shieldKey);
       // console.error(`shieldProfile.block, shieldKey`, shieldProfile.block, shieldKey);
       
        baseName = shieldProfile.name;

        base = shieldProfile.baseArmor;
  
        block = shieldProfile.block;
       
        break;
      case 'boots':
        itemTypeKey = `boots`;
        isVaryArmor = true;
  
        const { profile: bootsProfile } = pickSlotProfile(bootsProfiles);
        //console.warn(`profile.name`, bootsProfile.name);
 
        baseName = bootsProfile.name;

        base = bootsProfile.baseArmor;
       
        break;
      case 'armor':
        itemTypeKey = `armor`;
        isVaryArmor = true;
  
        const { profile: armorProfile } = pickSlotProfile(armorProfiles);
      //  console.warn(`profile.name`, armorProfile.name);
 
        baseName = armorProfile.name;

        base = armorProfile.baseArmor;
       
        break;
      default:
        armor = getRandomInt(3, 5); // fallback
      }
    
        const roll = getRandomFloat(0.9, 1.1); // max ±10% 
        if(isVaryArmor) {
          armor = Math.floor(ARMOR_BASE_MIN + baseArmorCurve * base * rarityMultiplier * roll);
     //     console.warn(`armor after isVaryArmor`, armor);
      
        } else {
          armor = Math.floor(ARMOR_BASE_MIN + baseArmorCurve * slotMultiplier[itemTypeKey] * rarityMultiplier * roll);
        }
    //    console.warn(`specific armor baseMultiplier`, base);
    //    console.warn(`baseArmorCurve`, baseArmorCurve);
   //     console.warn(`slotMultiplier[itemTypeKey] `, slotMultiplier[itemTypeKey] );
   //     console.warn(`rarityMultiplier`, rarityMultiplier);
    
    //  console.warn(`armor after scaling`, armor);
      
        statystyki.push({ id: 'armor', value: armor });
        block = Math.floor(block * blockMultiplier);
        if(typ === 'shield') {
          statystyki.push({ id: 'block', value: block });
        }
        baseValue = armor;
  } 
  
   let magicPrefix;
   let prefixId;
   let suffixId;
   let legendId;
  
   if (klasa === 'common') {
        //name = baseName.charAt(0).toUpperCase() + baseName.slice(1);
        name = t(baseName);
        //console.log(`common name`, name, baseName);
   } else if (klasa === 'rare') {
        magicPrefix = getMagicPrefix(baseName);
        //name = `${magicPrefix} ${baseName.charAt(0).toUpperCase() + baseName.slice(1)}`;
        name = `${magicPrefix} ${t(baseName)}`;
    } else if (klasa === 'unique') {
        prefixId = getRandomFrom(PREFIXES);
        name = `${prefixId} ${t(baseName)}`;
    } else if(klasa === 'epic'){
        prefixId = getRandomFrom(PREFIXES);
        suffixId = getRandomFrom(SUFFIXES);
        name = `${prefixId} ${t(baseName)} ${suffixId}`;
    } else if (klasa === 'legendary') {
        legendId = getLegendaryId(baseName);
        //console.log(`legendId`, legendId, baseName);
        name = getLegendaryLabel(legendId); 
        //console.log(`legendary name`, name);
    }
  
   // console.log(`itemTypeKey`, itemTypeKey);
  
    const implicitResult = getImplicitBonus({itemTypeKey, itemLevel, rarityMultiplier});
  
    const implicit = implicitResult.implicit;
    
   //console.log(`armor before update`, armor);
  
  const { bonusy, updatedDmg, updatedArmor, updatedSpeed, updatedBlock} = getRandomBonus(klasa, rarityMultiplier, itemLevel, typ, dmg, armor, speed, block, diagnostic, style);
  
  //console.log(`armor after update`, updatedArmor);

  if (typ === 'weapon') {
    statystyki = statystyki.map(stat => stat.id === "damage" ? { ...stat, value: updatedDmg } : stat);
    statystyki = statystyki.map(stat => stat.id === "attack_speed" ? { ...stat, value: updatedSpeed } : stat);       
  } else if(typ === 'shield'){
    statystyki = statystyki.map(stat => stat.id === "block" ? { ...stat, value: updatedBlock } : stat);
  } else {
    statystyki = statystyki.map(stat => stat.id === "armor" ? { ...stat, value: updatedArmor } : stat);
  }

  statystyki.push(...bonusy);
  
  const exclusiveAffixes = maybeAddLegendaryExclusive(klasa, itemTypeKey);
  const exclusive = exclusiveAffixes?.exclusive;
  
    const range = priceRanges[klasa] ?? priceRanges.legendary;
    let basePrice = range.min + Math.floor(Math.random() * (range.max - range.min + 1));
   
   // 🔑 unikalny identyfikator
  const uniqueID = "itm_" + Math.random().toString(36).slice(2, 10) + "_" + Date.now();
  
  
  const item = {
    _id: uniqueID,
    rarity: klasa,
    nazwa: name,
    nameData: {
      base: baseName,       
      magic: magicPrefix,
      prefix: prefixId,      
      suffix: suffixId,     
      legend: legendId || null
    },
    baseName: baseName,
    typ: typ,
    klasa: klasa,
    twoHanded: isTwoHanded,
    poiseDamage: poiseDamage,
    style: WEAPON_STYLES[style],
    baseBonus: implicit,
    statystyki: statystyki,
    exclusive: exclusive,
    wartosc: scalePriceByLevel(basePrice, itemLevel), 
    level: itemLevel,
    requiredLevel: itemLevel,
    discovered: false,
    sprite: klasa !== "legendary" ? assignSprite(baseName) : `${legendId}.png`
  };
  
  
  // console.warn("item sprite", item.sprite);
  //console.warn("item priceBase", basePrice);
//  console.warn("item price", item.wartosc);

    //WAZNE   
  localStorage.setItem("generatedItem", JSON.stringify(item));
   
  return item; 
 }

 function renderItem(item, classLabel, index) {
  const character = gameState.char;
  const charLevel = character.level || 1;

  const statsHTML = renderItemStats(item, charLevel);

  const typTekst = `${item.typ} (Poz. ${item.level})`;
   
  const itemHtml = 
   `<div class="item-popup-image">
      <img src="${ASSET_BASE}img/items/${item.sprite || 'img/default.png'}" alt="${item.nazwa}" class="item-image ${item.klasa}-img" style="width:130px; height:170px; margin-top:8px"/>
    </div>
    
   <div>
     <strong class="item-name item-name-${item.klasa}">${item.nazwa}</strong><br>
     <span class="item-class">(${getGenderedClassLabel(item.klasa, item.baseName || item.typ)})</span><br><br>
     <div class="item-stats">
       ${statsHTML}
     </div>
     <div class="item-footer">
       <span>${item.typ} (Poz. ${item.level})</span>
       <span class="item-value">💰 ${item.wartosc || 0}</span>
     </div>
     <div class="center-buttons">
       <button class="item-button" onclick='addItemToInventory(${JSON.stringify(item)})'>Weź</button>
       <button class="item-button" onclick='closeItemPopup()'>Zostaw</button>
     </div>
   </div>
  `;
     
   return itemHtml;
  
}

function getFirstFreeInventoryIndex() {
  const inventory = gameState.inventory;

  for (let i = 0; i < 20; i++) {
    if (!inventory[i]) return i; // wolny slot
  }
  return -1; // brak miejsca
}

function addPotionToBar(potion) {
  const potions = gameState.resources.potions;
 // console.log(`enter add potion to bar`, potions);
  for (let i = 0; i < 7; i++) {
   // console.log(`in for add potion to bar`);
    if (potions[i] === null) {
  //    console.log(`in if add potion to bar`);
      potions[i] = potion;
      return false; // ✔ dodano
    }
  }

  // ❌ pełny pasek
  return true;
}

function addItemToInventory(item) {
    if (!item) return false;
   
    const expeditionLevelStats = gameState.expedition.modes[gameState.world.expeditionMode].level;

    let inventory = gameState.inventory;
  
    // ---------------------------
    // 1. JEŚLI TO MIKSTURA, NAJPIERW SPRAWDŹ STACK
    // ---------------------------
    if (item.typ === "heal_potion") {
       
        const isMax = addPotionToBar(item);
        const potions = gameState.resources.potions;
        if(!isMax) {
          return true;
        } else {
          // znajdź stack mikstur
          const potionStacks = inventory
            .map((item, index) => ({ item, index }))
            .filter(e => e.item.typ === "heal_potion");

          // spróbuj dołożyć do stacka
          for (const stack of potionStacks) {
            if (stack.item.quantity < stack.item.maxStack) {
                stack.item.quantity++;
                inventory[stack.index] = stack.item;
                saveGame();
                return true; // ← SUKCES
            }
          }
       }
      
        // jeśli tu doszliśmy → wszystkie stacki pełne (lub brak stacków)

        // sprawdź czy jest wolne miejsce
        if (inventory.length >= 20) {
          if(!potions) {
            showInfoAlert(`${t("no_space_for_potion_info")}`);
            return false;
          }
          if(item.typ === `heal_potion` && potions.length < 7){
            potions.push(item);
            saveGame();
            return true;
          } else {
            showInfoAlert(`${t("no_space_for_potion_info")}`);
            return false;
          }
        }

        // dodaj nowy stack
        const newPotion = makeSmallHealPotion();
        newPotion.quantity = 1;
        newPotion.maxStack = 3;
       // console.log("newPotion.quantity: ", newPotion.maxStack);

        inventory.push(newPotion);
        saveGame();
        return true; // ← SUKCES
    }

    // ---------------------------
    // 2. NORMALNE ITEMY
    // ---------------------------
    if (inventory.length >= 20) {
        showInfoAlert(`${t("full_inventory_info")}`);
        return false;
    }

    const freeIndex = getFirstFreeInventoryIndex();
    if (freeIndex === -1) {
        showInfoAlert(`${t("no_inventory_space_info")}`);
        return false;
    }

    inventory[freeIndex] = item;
  
    expeditionLevelStats.loot++;
    
    saveGame();
  
    if(item.questId) {
      const quest = QUEST_DATA[item.questId];
      
      if(quest?.targetCount) {
        itemCounter(item) ;
      } else {
        const questData = QUEST_DATA[item.questId];
        const quest = gameState.world.battleState.quests?.[item.questId];
        //console.log(`quest, quest id`,quest, item.questId);
        quest.objective = questData.objectiveAfterEvent;
        quest.questNotifications = true;
        saveGame();
        notifyQuestUpdate(item.questId);
      }
      
    }
  
    return true;
}

function itemCounter(item) {
  const quests = Object.values(QUEST_DATA);
  
  const matchingQuest = quests.find(quest => 
      quest?.objectiveTarget === item.baseName
    );
      
  if(matchingQuest) {
    const quest = battleState.quests?.[matchingQuest.id];
      
    if (quest.targetCount >= matchingQuest.targetCount) {
      //return; 
      //console.log(`nothing is counting`);
    }else {
      quest.targetCount++;
      quest.objective = `${matchingQuest.objective} (${quest.targetCount}/${matchingQuest.targetCount})`;
     // console.log(`targetCount`, quest.targetCount);
      quest.questNotifications = true;
      notifyQuestUpdate(matchingQuest.id);
      updateQuestShortInfo();
    }   
      
    if(quest.targetCount == matchingQuest.targetCount)
    {
    //  console.log(`objective after event in target counter`);
      quest.objective = matchingQuest.objectiveAfterEvent;
      quest.questNotifications = true;
      
      notifyQuestUpdate(matchingQuest.id);
    }
    
    saveGame();
  }
  
}


