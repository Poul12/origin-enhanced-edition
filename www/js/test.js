const slotTypes = [
  'helmet', 'shoulder', 'armor', 'bracers', 'gloves',
  'belt', 'pants', 'boots', 'weapon', 'shield'
];

function generateAndEquipSet(klasa) {
  gameState.char.equipment = {};

  slotTypes.forEach(type => {
    // Wymuszenie konkretnego typu przedmiotu
    window.forceItemType = type;
   
    let item = null;
    item = generateItem({ forceRarity: klasa});
    
    if (item) {
     gameState.char.equipment[type] = item;
     if(gameState.world.mode !== `sandbox`) {
       clearAllDiffs();
       discoverItem(item);
     }
    } 
  });

  window.forceItemType = null;
 
  refreshCharacterStats();
  renderStats?.();
  renderEquipment?.();
  saveGame();
}

function generateAndEquipRandomSet(klasa) {
  gameState.char.equipment = {};

  slotTypes.forEach(type => {
    window.forceItemClass = klasa;

    // Wymuszenie konkretnego typu przedmiotu
   window.forceItemType = type;
    
   let item = generateItem();
   if (item) {
     clearAllDiffs();
     gameState.char.equipment[type] = item;
     discoverItem(item);
   }
  });
 
  window.forceItemClass = null;
  window.forceItemType = null;
 
  refreshCharacterStats();
  renderStats?.();
  renderEquipment?.();
  saveGame();
}



function generateItemOfType(type) {
  const originalForce = window.forceItemType;
  window.forceItemType = type;
  generateItem({ forcedRarity: type}); // zakłada, że generateItem() szanuje window.forceItemType
  items[idx] = generateItem({ forceRarity: "epic", isChest: true, chestType: "silver" });
    
  const item = JSON.parse(localStorage.getItem("generatedItem"));
  window.forceItemType = originalForce;
  return item;
}