function openStoryEventDialog(quest) {
  const popup = document.getElementById("item-popup");
  const content = document.getElementById("popup-content");
  const opt = gameState.world.exploreOptions[gameState.world.selectedSlotIndex];

  setPopupBackground(content, `legendary`);
  
  let isTyping = false;
  
  const typeText = async (element, text, speed = 50) => {
    element.innerHTML = "";
    isTyping = true;
    let skip = false;

    // 📍 Jeśli gracz kliknie w trakcie pisania – pokaż od razu cały tekst
    const skipHandler = () => { skip = true; };
    element.addEventListener("click", skipHandler);

    const parts = text.split(/(<br>)/g);

    for (let part of parts) {
      if (skip) break; // jeśli kliknięto — przerwij natychmiast
      if (part === "<br>") {
        element.innerHTML += "<br>";
        element.scrollTop = element.scrollHeight;
        
        continue;
      }

      for (let i = 0; i < part.length; i++) {
        if (skip) break;
        element.innerHTML += part[i];
        element.scrollTop = element.scrollHeight;
 
        const ch = part[i];
        // ✨ naturalne tempo pisania
        await new Promise(resolve =>
          setTimeout(
            resolve,
            ".!?".includes(ch) ? speed * 10 :
            ",;:".includes(ch) ? speed * 3 :
            speed
          )
        );
      }
    }   // jeśli kliknięto — pokaż cały tekst od razu
    if (skip) {
      element.innerHTML = text;
      element.scrollTop = element.scrollHeight;
    }
    
    element.removeEventListener("click", skipHandler);
    isTyping = false;
  }; 
  
  //console.log(`opt.storyEvent.sprite story event`, opt.storyEvent.sprite);
  
  const storyEventSrc = assetManager.getResolvedAsset(`img/exploring-slots/${opt.storyEvent.sprite}`);
  
  const headerHtml = `
      <div class="npc-header">
        <div class="quest-avatar" id="quest-avatar">
          <img src="${storyEventSrc}" alt="${quest.id}">
        </div>
        <div class="npc-info">
          <div class="npc-name">${t(quest.title)}</div>
          <div class="quest-type">${t(quest.type)}</div>
          <div class="npc-name">${quest.npc}</div>
        </div>
      </div>
    `;
  
  //const dialogueText = quest.storyEvent.join("<br>");
  
  const questState = gameState.world.battleState.quests?.[quest.id];
  
  const dialogueText = 
  questState?.firstEventPassed === true
    ? quest.storyEvent.map(id => t(id)).join("<br>") //? quest.storyEvent.join("<br>")
      : (quest.firstEventPassed !== undefined 
        ? quest.firstStoryEvent.map(id => t(id)).join("<br>") 
        : quest.storyEvent.map(id => t(id)).join("<br>"));  //: quest.storyEvent.join("<br>"));
  
  
  const closeBtnSrc = assetManager.getResolvedAsset(`img/buttons/close-btn.png`);
  
  content.innerHTML = `
    <div class="npc-dialog">
      ${headerHtml}
      <div class="dialog-box">${dialogueText}</div>
      <div style="text-align:center;">
        <button id="confirm-btn" class="item-button" onClick="onStoryEventFinished('${quest.id}')">${t("confirm_btn")}</button>
      </div>
      <div class="close-btn-wrapper" id="item-close-wrapper-item">
         <button class="close-button" id="item-close-btn" onclick="closeQuestPopup()"></button>
         <img src="${closeBtnSrc}" alt="Zamknij" class="close-btn-frame" />
      </div>
    </div>
    `;
  
  const questAvatar = document.getElementById(`quest-avatar`);
  if(opt.storyEvent.miniboss) {
    questAvatar.classList.add(`miniboss`);
  }
  
  const dialogBox = content.querySelector(".dialog-box");
  typeText(dialogBox, dialogueText);
    
  const confirmBtn = document.getElementById("confirm-btn");
  setGlobalButtonTexture(confirmBtn);
  
  //playSound("open-slot", 0.4);

  popup.classList.remove("hidden");

}

function closePopup() {
    popup.classList.add("hidden");
}


function openQuestDescription(quest) {
  const popup = document.getElementById("item-popup");
  const content = document.getElementById("popup-content");

  setPopupBackground(content, `legendary`);

  content.innerHTML = `
    <div class="npc-dialog">
      <div class="dialog-box">${quest?.dialogue.map(id => t(id))}</div>
      <div style="text-align:center;">
        <button id="dialog-btn" onclick="closeQuestPopup()" class="item-button">${t("close_btn")}</button>
      </div>
    </div>
  `;

   const dialogBtn = document.getElementById("dialog-btn");
   setGlobalButtonTexture(dialogBtn);
  
   popup.classList.remove("hidden");

}

function openQuestsPopup() {
  const popup = document.getElementById("quest-popup");
  //const content = document.querySelector("#quest-popup #quests-popup-content");

  setPopupBackground3(`#quest-popup .popup-content`, `legendary`);
    
  renderQuestList(1); // domyślnie Akt I
    
    // obsługa zakładek
 /* document.querySelectorAll(".quest-tab").forEach(tab => {
    tab.addEventListener("click", e => {
      document.querySelectorAll(".quest-tab").forEach(t => t.classList.remove("active"));
      e.target.classList.add("active");
      const act = parseInt(e.target.getAttribute("data-act"));
      renderQuestList(act);
    });
  });*/

  playSound("open", 0.4);

  popup.classList.remove("hidden");
}

function renderQuestList(actNumber) {
     const contentBg = document.getElementById("popup-content");
     const content = document.getElementById("quests-popup-content");
  
     if(actNumber !== 1) return;
     // console.error("enter render quest list");  
     const quests = Object.values(gameState.world.battleState.quests || {})
      .filter(q => q.act === actNumber)
      .sort((a, b) => {
         
      // 1. Najpierw aktywne — one muszą być na górze
      const isAActive = a.state === "active";
      const isBActive = b.state === "active";

      if (isAActive && !isBActive) return -1;
      if (isBActive && !isAActive) return 1;

      // 2. Potem "failed" i "completed" na sam dół — ale w kolejności failed → completed
      const endOrder = { 
        "failed": 1,
        "completed": 2
      };

      const aEnd = endOrder[a.state] ?? 0;
      const bEnd = endOrder[b.state] ?? 0;

      if (aEnd !== bEnd) return aEnd - bEnd;

      // 3. W obrębie aktywnych sortujemy typem
      const typeOrder = { 
        "main_quest": 0, 
        "side_quest": 1, 
        "special_quest": 2 
      };

      return (typeOrder[a.type] ?? 99) - (typeOrder[b.type] ?? 99);
    });
  
    //console.error("quests.length list", quests.length);  
 
    if (quests.length === 0) {
      content.innerHTML = `<p style="color:#bbb;text-align:center;">${t("no_quests_in_act")}</p>`;
      return;
    }

    content.innerHTML = quests
      .map(q => {
        const hasNotification = gameState.world.battleState.quests?.[q.id].questNotifications;
        //console.log(`hasNotification id`, hasNotification, q.id);
        const quest = getQuestFromId(q.id);
        const reward = quest?.reward || {};
        const rewardIcons = [];
        const rewardExpSrc = assetManager.getResolvedAsset(`img/icons/exp-icon.png`);

        if (reward.exp) {
          rewardIcons.push(`
            <span class="reward-exp">
              <img src="${rewardExpSrc}" alt="EXP" class="quest-reward-icon">
               +${reward.exp} EXP
            </span>
          `);
        }
        if (reward.gold) {
          const rewardGoldSrc = assetManager.getResolvedAsset(`img/icons/expedition-gold-icon.png`);

          rewardIcons.push(`
            <span class="reward-gold">
              <img src="${rewardGoldSrc}" alt="Złoto" class="quest-reward-icon">
              +${reward.gold} ${t("flee_cost2")}
            </span>
         `);
        }  
        if (reward.itemName) {
          const itemText = reward.itemName;
          let rarityClass = "item-name-common"; // domyślnie

          //const itemTextClean = itemText.replace(/\s*\(.*?\)\s*/g, ""); // usuwa tekst w nawiasach
            
          // 🔹 Sprawdzenie klasy przedmiotu po nazwie
          if (itemText.includes("rare")) rarityClass = "item-name-rare";
          else if (itemText.includes("unique")) rarityClass = "item-name-unique";
          else if (itemText.includes("epic")) rarityClass = "item-name-epic";
          else if (itemText.includes("legendary")) rarityClass = "item-name-legendary";
          else if (itemText.includes("set")) rarityClass = "item-name-set";
          else if (itemText.includes("special")) rarityClass = "item-name-special";

          const rewardItemSrc = assetManager.getResolvedAsset(`img/icons/inventory-icon.png`);
          
          rewardIcons.push(`
            <span class="reward-item">
              <img src="${rewardItemSrc}" alt="ITEM" class="quest-reward-icon">
              <span class="${rarityClass}">${t(reward.itemName)}</span>
            </span>
         `);
           
        }
          
        const stateClass = q.state || "active";
        const stateLabel = {
          active: `${t("quest_state_active")}`,
          completed: `${t("quest_state_completed")}`,
          failed: `${t("quest_state_failed")}`
        }[stateClass];
         // console.error(`quests list before return hmtl`);
       
                     
        return `
          <div class="quest-entry collapsed ${(q.state === "completed" || q.state === "failed") ? "completed-quest" : ""} 
            ${hasNotification ? "has-notification" : ""}" 
            data-id="${q.id}">
            <div class="quest-header">
              <span class="quest-dot"></span>
              <span class="quest-title">${t(q.title)}</span>
              <span class="quest-state ${stateClass}">${stateLabel}</span>
            </div>
            <div class="quest-body">
              <div class="quest-npc">${t(q.npc)}</div>
              <div class="quest-type">${t(quest?.type) || "Nieznany typ"}</div>
              <div class="quest-objective">${t(q.objective)}</div>
              <button class="quest-desc-toggle">📜 ${t("show_quest_desc")}</button>
              <div class="quest-desc">${quest?.dialogue.map(id => t(id))}</div>
              ${rewardIcons.length ? `
              <div class="quest-rewards">
                 <!-- <img src="${ASSET_BASE}img/icons/reward-separator-icon.png" alt="separator" class="quest-separator"> -->
                 <img src="${getRewardSeparatorIcon()}" alt="separator" class="quest-separator">
                 <div class="reward-items">
                   ${rewardIcons.join("<br>")}
                 </div>
              </div>` : ""}
            </div>
          </div>
        `;
      })
      .join("");
      
    //console.error(`quests list after join`);
       
         
      //attachQuestExpandEvents();
  }


function closeQuestsPopup() {
  const popup = document.getElementById("quest-popup");
  popup.classList.add("hidden");
  updateQuestNotification();
}

function getRewardSeparatorIcon() {
  const rewardEnSrc = assetManager.getResolvedAsset(`img/icons/reward-separator-icon-en.png`);
  
  switch (currentLang) {
    case "pl":
      const rewardPlSrc = assetManager.getResolvedAsset(`img/icons/reward-separator-icon.png`);
      return `${rewardPlSrc}`;

    case "en":
      return `${rewardEnSrc}`;

    default:
      return `${rewardEnSrc}`;
  }
}

function findNpcByQuestId(questId) {
  for(const regionKey in NPC_DATA) {
    const regionNpcs = NPC_DATA[regionKey];
    const npc = regionNpcs.find(n => n.questId === questId);
    if (npc) return npc;
  }
  return null;
}

function getQuestFromId(questId) {
  return QUEST_DATA[questId] || null;
}

function openNpcDialog(npc, quest) {
  const popup = document.getElementById("item-popup");
  const content = document.getElementById("popup-content");

  setPopupBackground(content, `legendary`);
  
  let showingQuest = false; // stan czy pokazujemy misję
  let isTyping = false; // blokada podczas pisania
   
  const typeText = async (element, text, speed = 50) => {
    const dialogBtn = document.getElementById("dialog-btn");

    element.innerHTML = "";
    isTyping = true;
    let skip = false;

    // 📍 Jeśli gracz kliknie w trakcie pisania – pokaż od razu cały tekst
    const skipHandler = () => { skip = true; };
    element.addEventListener("click", skipHandler);

    const parts = text.split(/(<br>)/g);

    for (let part of parts) {
      if (skip) break; // jeśli kliknięto — przerwij natychmiast
      if (part === "<br>") {
        element.innerHTML += "<br>";
        element.scrollTop = element.scrollHeight;
  
        continue;
      }

      for (let i = 0; i < part.length; i++) {
        if (skip) break;
        element.innerHTML += part[i];
        element.scrollTop = element.scrollHeight;
  
        const ch = part[i];
        // ✨ naturalne tempo pisania
        await new Promise(resolve =>
          setTimeout(
            resolve,
            ".!?".includes(ch) ? speed * 10 :
            ",;:".includes(ch) ? speed * 3 :
            speed
          )
        );
      }
    }

    // jeśli kliknięto — pokaż cały tekst od razu
    if (skip) {
      element.innerHTML = text;
      element.scrollTop = element.scrollHeight;
    }
      
    element.removeEventListener("click", skipHandler);
    isTyping = false;
    dialogBtn.classList.remove(`disabled`);
  }; 
  
  //console.log("quest wejsciowe", quest.id);

  const quests = Object.values(gameState.world.battleState.quests || {});
  const isOriginQuestActive = quests.some(q => q.id === quest?.originQuestId && q.state === `active`);
  const questData = (isOriginQuestActive && quest?.originQuestId) ? QUEST_DATA[quest?.originQuestId] : QUEST_DATA[quest.id];
  
  const renderDialog = (animate = false) => {
    
    const reward = questData.reward;
    const rewardParts = [];
    
    // 🧩 dynamiczne tworzenie nagrody
    if (reward.exp) {
       const rewardExpSrc = assetManager.getResolvedAsset(`img/icons/exp-icon.png`);

       rewardParts.push(`
         <span class="reward-exp">
          <img src="${rewardExpSrc}" alt="EXP" class="reward-icon">
          +${formatNumber(reward.exp)} EXP
         </span>
      `);
    } 
    if (reward.gold) {
       const rewardGoldSrc = assetManager.getResolvedAsset(`img/icons/expedition-gold-icon.png`);

       rewardParts.push(`
         <span class="reward-gold">
           <img src="${rewardGoldSrc}" alt="Złoto" class="reward-icon">
           +${formatNumber(reward.gold)} ${t("gold_reward")}
         </span>
      `);
    }  
    if (reward.itemName) {
      const itemText = reward.itemName;
      let rarityClass = "item-name-common"; // domyślnie

      //const itemTextClean = itemText.replace(/\s*\(.*?\)\s*/g, ""); // usuwa tekst w nawiasach  // 🔹 Sprawdzenie klasy przedmiotu po nazwie
      
      if (itemText.includes("rare")) rarityClass = "item-name-rare";
      else if (itemText.includes("unique")) rarityClass = "item-name-unique";
      else if (itemText.includes("epic")) rarityClass = "item-name-epic";
      else if (itemText.includes("legendary")) rarityClass = "item-name-legendary";
      else if (itemText.includes("set")) rarityClass = "item-name-set";
      else if (itemText.includes("special")) rarityClass = "item-name-special";
      
      const rewardItemSrc = assetManager.getResolvedAsset(`img/icons/inventory-icon.png`);

      rewardParts.push(`
         <span class="reward-item">
           <img src="${rewardItemSrc}" alt="Przedmiot" class="reward-icon">
           <span class="${rarityClass}">${t(reward.itemName)}</span>
         </span>
      `);
    }
    
    const rewardHtml = rewardParts.length
      ? `<div class="reward-label"><b>${t("quest_reward")}:</b><br>
           <div class="reward-values">
             ${rewardParts.join('')}
           </div>
         </div>`
      : "";

    const npcSrc = assetManager.getResolvedAsset(`img/exploring-slots/${npc.sprite}`);
    
    const headerHtml = `
      <div class="npc-header">
        <div class="npc-avatar">
          <img src="${npcSrc}" alt="${npc.name}">
        </div>
        <div class="npc-info">
          ${
            showingQuest
              ? `<div class="npc-name">${t(questData.title)}</div>
                 <div class="quest-type">${t(questData.type)}</div>`
              : `<div class="npc-name">${t(npc.name)}</div>
                 <div class="npc-role">${t(npc.role)}</div>`
          }
          ${showingQuest ? rewardHtml : ""}
        </div>
      </div>
    `;
    
    // 🟦 SPRAWDŹ, CZY TO QUEST Z TYPEM "PRZYNIEŚ PRZEDMIOT"
    const hasRequiredItem =
      showingQuest &&
      quest.requiredItem &&
      playerHasRequiredQuestItem(quest.requiredItem);
    
    //console.log("playerHasRequiredQuestItem", playerHasRequiredQuestItem(quest.requiredItem));
    
    const questState = gameState.world.battleState.quests?.[quest.id];
    const qs = questState || {};
    //quest = quest?.originQuestId ? QUEST_DATA[quest?.originQuestId] : QUEST_DATA[quest.id];
    //const questData = QUEST_DATA[quest.id];
  
    const isTargetCountPassed = quest?.targetCount && (qs.targetCount >= quest.targetCount);
   
    const isQuestReadyToTurnIn =
       ((qs.storyEventPassed && qs.enemyPassed) || hasRequiredItem || isTargetCountPassed || quest?.originQuestId);
    
    // Jeśli gracz MA wymagany przedmiot → zmieniamy dialog i działanie przycisku
    let isTurnIn = false;

    let dialogueLines;
    let buttonText;
    let buttonAction;
    
    // 🔵 Jeśli quest jest gotowy DO ODDANIA, ale gracz jeszcze NIE kliknął „Misja”,
    // to najpierw pokazujemy standardowy dialog NPC.
    if (isQuestReadyToTurnIn && !showingQuest) {
       
      //dialogueLines = npc.dialogue;
      dialogueLines = npc.dialogue.map(id => t(id));
      buttonText = `${t("mission_btn")}`;
      buttonAction = () => {
        playSound("open-slot", 0.4);
        showingQuest = true;
        renderDialog(true);
      };
  
    } else if (quest?.originQuestId && isOriginQuestActive) {
      
      isTurnIn = true;
      const originQuest = QUEST_DATA[quest?.originQuestId];
      //const originQuest = Object.values(battleState.quests || {}).filter(q => q.state === "active" && q.id === questData.originQuestId);
      dialogueLines = originQuest.turnInDialogue.map(id => t(id)) || ["Dziękuję za przyniesienie przedmiotu."];
      buttonText = `${t("end_mission_btn")}`;
      buttonAction = () => {
        completeQuest(quest.originQuestId);
      };
      
    } else if (hasRequiredItem) {
      //console.log("hasRequiredItem in if", hasRequiredItem);
      isTurnIn = true;
      dialogueLines = quest.turnInDialogue.map(id => t(id)) || ["Dziękuję za przyniesienie przedmiotu."];
      buttonText = `${t("end_mission_btn")}`;
      buttonAction = () => {
        removeItemByBaseName(quest);
        completeQuest(quest.id);
      };

    } else if (qs.storyEventPassed && qs.enemyPassed) {

     // console.log("story event passed2", questState.storyEventPassed);
      
      isTurnIn = true;
      dialogueLines = quest.turnInDialogue.map(id => t(id)) || ["Dziękuję za pomoc!"];
      buttonText = `${t("end_mission_btn")}`;
      buttonAction = () => {
        if(quest.id === `disturbed_in_forest`) {
          removeItemByBaseName(quest, `north_map`);
        }    
        completeQuest(quest.id);
      };

    } else if (isTargetCountPassed) {
        
      isTurnIn = true;
      dialogueLines = quest.turnInDialogue.map(id => t(id)) || ["Dziękuję za pomoc!"];
      buttonText = `${t("end_mission_btn")}`;
      buttonAction = () => {
        completeQuest(quest.id);
      };
      
    } else {

      // STANDARDOWY SYSTEM
      dialogueLines = showingQuest ? quest.dialogue.map(id => t(id)) : npc.dialogue.map(id => t(id));
      buttonText = showingQuest ? `${t("accept_btn")}` : `${t("mission_btn")}`;
      
      buttonAction = () => {
             
        if (showingQuest) {
          acceptNpcQuest(npc.questId, quest.title, quest.type, npc.name, quest.storyEvent, quest.objective);
        } else {
          playSound("open-slot", 0.4);
          showingQuest = true;
          renderDialog(true);
        }
      };
    }    
    
    //const dialogueLines = showingQuest ? quest.dialogue : npc.dialogue;
    const dialogueText = dialogueLines.join("<br>");
        
    //const buttonText = showingQuest ? "AKCEPTUJ" : "MISJA";

    const closeBtnSrc = assetManager.getResolvedAsset(`img/buttons/close-btn.png`);

    //content.innerHTML = `
    const newContent = `
    <div class="npc-dialog">
      ${headerHtml}
      <div class="dialog-box">${dialogueText}</div>
      <div style="text-align:center;">
        <button id="dialog-btn" class="item-button">${buttonText}</button>
        <button id="store-btn" class="item-button hidden" onclick="openStore()">${t("trade_btn")}</button>
      </div>
      <div class="close-btn-wrapper" id="item-close-wrapper-item">
         <button class="close-button" id="item-close-btn" onclick="closeQuestPopup()"></button>
         <img src="${closeBtnSrc}" alt="Zamknij" class="close-btn-frame" />
      </div>
    </div>
    `;
    
    if (animate) {
      content.classList.remove("fade-out", "fade-in");
      
      content.classList.add("fade-out");
      setTimeout(() => {
        content.innerHTML = newContent;
        content.classList.remove("fade-out");
        content.classList.add("fade-in");
        attachEvents();
      }, 350);
    } else {
      content.innerHTML = newContent;
      attachEvents();
    }
    
    function attachEvents() {
      const dialogBox = content.querySelector(".dialog-box");
      const dialogBtn = document.getElementById("dialog-btn");
      const storeBtn = document.getElementById("store-btn");
      setGlobalButtonTexture(dialogBtn);
      setGlobalButtonTexture(storeBtn);
      
      dialogBtn.classList.add(`disabled`);
      
      if(qs.state === `completed`) {
        dialogBtn.classList.add(`hidden`);
      }
      
      if(npc?.merchant) {
        storeBtn.classList.remove(`hidden`);
      }
      
       // ✨ Efekt pisania tekstu
      typeText(dialogBox, dialogueText);
      
      function buttonActionHandler() {  
        if (isTyping) return; // nie klikaj w trakcie pisania
        dialogBtn.classList.remove(`disabled`);
        buttonAction();
      }
      
      dialogBtn.addEventListener("click", buttonActionHandler);
    }
  };
  
  function closePopup() {
    dialogBtn.removeEventListener("click", buttonActionHandler);
    popup.classList.add("hidden");
  }
  
  renderDialog();
  renderStats();
  
  playSound("open", 0.4);

  popup.classList.remove("hidden");
}

function playerHasRequiredQuestItem(required) {
  const inv = gameState.inventory;
  return inv.find(item =>
     item.baseName === required
  );
}

/*function removeItemByBaseName(quest) {
  let inv = JSON.parse(localStorage.getItem("inventory") || "[]");

  // znajdź pierwszy item o podanym baseName
  const index = inv.findIndex(item => item.baseName === quest.requiredItem);

  if (index === -1) return false; // nie znaleziono

  inv.splice(index, 1); // usuń
  localStorage.setItem("inventory", JSON.stringify(inv));

  return true;
}*/

function removeItemByBaseName(quest, specificItem = null) {
  let inv = gameState.inventory;

  // Ile sztuk trzeba usunąć
  const amountToRemove = quest.targetCount ?? 1;

  // znajdź wszystkie pasujące przedmioty
  const matchingIndexes = [];
  for (let i = 0; i < inv.length; i++) {
    if (inv[i].baseName === quest.requiredItem || inv[i].baseName === specificItem) {
      matchingIndexes.push(i);
      if (matchingIndexes.length === amountToRemove) break;
    }
  }

  // jeśli nie ma wymaganej ilości — nie usuwaj nic
  if (matchingIndexes.length < amountToRemove) {
    return false;
  }

  // usuwamy od końca, żeby indeksy się nie przesuwały
  for (let i = matchingIndexes.length - 1; i >= 0; i--) {
    inv.splice(matchingIndexes[i], 1);
  }
  
  saveGame();
  return true;
}

function acceptNpcQuest(questId, questTitle, type, npcName, storyEvent, objective) {
  const world = gameState.world;

  if (!world.battleState.quests) world.battleState.quests = {};

//  console.log(`acceptNpcQuest questId`, questId);
  
  if (!world.battleState.quests[questId]) {
    world.battleState.quests[questId] = {
      id: questId,
      title: questTitle,
      npc: npcName,
      type: type,
      objective: objective,
      storyEvent: storyEvent,
      storyEventPassed: false,
      firstEventPassed: false,
      enemyPassed: false,
      targetCount: 0,
      questNotifications: true,
      act: 1,
      location: world.currentLocation,
      state: "active",   // aktywny
      progress: 0,
      acceptedAt: Date.now()
    };
    
    notifyQuestUpdate(questId);
    playSound("accept", 0.4);
    showInfoAlert(`${t("quest_accepted1")} "${t(questTitle)}" ${t("quest_accepted2")}`, 2000, true);
  } else {
    showInfoAlert(`${t("quest_already_active")}`, 2000, false);
  }
  
  saveGame();
  //saveStatePartial({ quests: battleState.quests });

  const popup = document.getElementById("item-popup");
  popup.classList.add("hidden");
}

function showCompletedQuestDialog(quest) {
  const popup = document.getElementById("item-popup");
  const content = document.getElementById("popup-content");

  //console.log(`enter show quest completed`);
  
  setPopupBackground(content, `legendary`);
  
  const questSrc = assetManager.getResolvedAsset(`img/exploring-slots/${quest.sprite}`);
  
  const headerHtml = `
    <div class="npc-header">
      <div class="quest-avatar" id="quest-avatar">
        <img src="${questSrc}" alt="${quest.id}">
      </div>
      <div class="npc-info">
        <div class="npc-name">${t(quest.title)}</div>
        <div class="quest-type">${t(quest.type)}</div>
        <div class="npc-name">${quest.npc}</div>
      </div>
    </div>
  `;
  
  const reward = quest?.reward || {};
        const rewardIcons = [];
        const rewardExpSrc = assetManager.getResolvedAsset(`img/icons/exp-icon.png`);
  
        if (reward.exp) {
           rewardIcons.push(`
            <span class="reward-exp">
              <img src="${rewardExpSrc}" alt="EXP" class="reward-icon">
               +${formatNumber(reward.exp)} EXP
            </span>
          `);
        }
        if (reward.gold) {
           const rewardGoldSrc = assetManager.getResolvedAsset(`img/icons/expedition-gold-icon.png`);
  
           rewardIcons.push(`
            <span class="reward-gold">
              <img src="${rewardGoldSrc}" alt="Złoto" class="reward-icon">
              +${formatNumber(reward.gold)} ${t("flee_cost2")}
            </span>
         `);
        }  
        if (reward.itemName) {
          const itemText = reward.itemName;
          let rarityClass = "item-name-common"; // domyślnie

          //const itemTextClean = itemText.replace(/\s*\(.*?\)\s*/g, ""); // usuwa tekst w nawiasach
            
          // 🔹 Sprawdzenie klasy przedmiotu po nazwie
          if (itemText.includes("rare")) rarityClass = "item-name-rare";
          else if (itemText.includes("unique")) rarityClass = "item-name-unique";
          else if (itemText.includes("epic")) rarityClass = "item-name-epic";
          else if (itemText.includes("legendary")) rarityClass = "item-name-legendary";
          else if (itemText.includes("set")) rarityClass = "item-name-set";
          else if (itemText.includes("special")) rarityClass = "item-name-special";

          const rewardItemSrc = assetManager.getResolvedAsset(`img/icons/inventory-icon.png`);
          const rewardItemAxeSrc = assetManager.getResolvedAsset(`img/items/axe.png`);
       
          rewardIcons.push(`
            <span class="reward-item">
              <!--<img src="${rewardItemSrc}" alt="ITEM" class="reward-icon">-->
              <img src="${rewardItemAxeSrc}" alt="ITEM" class="reward-icon">
              <span class="${rarityClass}">${t(reward.itemName)}</span>
            </span>
         `);
        }
  
   // 🔥 dynamiczny tekst na podstawie nagród
  let dialogueText = `
    <div class="quest-completed-title">${t("quest_completed")}</div>
    <div class="reward-section">
      ${rewardIcons.length ? `
              <div class="quest-rewards">
                 <!-- <img src="${ASSET_BASE}img/icons/reward-separator-icon.png" alt="separator" class="quest-separator"> -->
                 <img src="${getRewardSeparatorIcon()}" alt="separator" class="quest-separator">
                 <div class="reward-items">
                   ${rewardIcons.join("<br>")}
                 </div>
              </div>` : ""}
  
    </div>
  `;
  
  const closeBtnSrc = assetManager.getResolvedAsset(`img/buttons/close-btn.png`);
  
  content.innerHTML = `
    <div class="npc-dialog">
      ${headerHtml}
      <div class="dialog-box">${dialogueText}</div>
      <div style="text-align:center;">
        <button id="confirm-btn" class="item-button" onClick="closeQuestPopup()">${t("confirm_btn")}</button>
      </div>
      <div class="close-btn-wrapper" id="item-close-wrapper-item">
        <button class="close-button" id="item-close-btn" onclick="closeQuestPopup()"></button>
        <img src="${closeBtnSrc}" alt="Zamknij" class="close-btn-frame" />
      </div>
    </div>
  `;

  const confirmBtn = document.getElementById("confirm-btn");
  setGlobalButtonTexture(confirmBtn);

  const questAvatar = document.getElementById(`quest-avatar`);
  const minibossQuest = QUEST_DATA[quest.id];
  if(minibossQuest?.isMiniboss) {
    questAvatar.classList.add(`miniboss`);
  } else if(minibossQuest?.isNpcSpriteAvatar) {
    questAvatar.className = `npc-avatar`;
  }

  
  popup.classList.remove("hidden");
}

function completeQuest(questId) {
  //console.log(`quest completed`, questId);

  const quest = gameState.world.battleState.quests?.[questId];
  if (!quest) return;

  playSound("complete-quest", 0.4);
  
  quest.state = "completed";
  quest.objective = t("done_quest");
  quest.completedAt = Date.now();

  const questData = QUEST_DATA[questId];
  const questReward = questData.reward;
  
  // NAGRODA: item
  if (questReward.item) {
    const added = addItemToInventory(questReward.item);
  }

  // NAGRODA: exp
  if (questReward.exp) {
    const prefix = addExp(questReward.exp);
  }

  // NAGRODA: gold
  if (questReward.gold) {
    const gold = parseInt(gameState.resources.gold);
    gameState.resources.gold = gold + questReward.gold;
    renderStats();
  }
  
  showCompletedQuestDialog(questData);
  
  document.querySelector("#quest-short-info").textContent = ``;
  
  saveGame();
 }

function areAllLocationQuestsCompleted(location) {
  const quests = Object.values(gameState.world.battleState.quests || {});

  return quests
    .filter(q => q.location === location)                 // tylko ta lokacja
    .filter(q => {
      const data = QUEST_DATA[q.id];
      return !data?.toBeContinued;                         // pomijamy kontynuowane
    })
    .every(q => q.state === "completed");                  // reszta MUSI być ukończona
}

function onStoryEventFinished(questId) {
  const char = gameState.char;
  const world = gameState.world;
  const opt = world.exploreOptions[world.selectedSlotIndex];
  const questData = QUEST_DATA[questId];
  const questState = world.battleState.quests?.[questId];
  const story = getStoryConfig(world.currentLocation);
  
  if (!questData) return;

 // console.error(`opt type on quest`, opt.type);
  spendEnergy(opt.type);
  
  if(!questData.storyEventPassed) {
    // console.log(`storyEventPassed on finish`, questData.id);
     const quest = world.battleState.quests?.[questId];
     quest.storyEventPassed = true;
    
     if(questData.storyEvent && !questData.secretEnemy) {
       opt.used = true;
     }
    
     saveGame();
     //saveStatePartial({ quests: battleState.quests });
  }
  
  if(questData.secretEnemy) {
    const enemy = generateStoryEnemy(questId, gameState.char.level);
      
   // console.log(`firstEventPassed`, questState.firstEventPassed);
    if (questState.firstEventPassed === true) {
      
      const step = world.locationSteps[world.currentStepIndex];
      
      if (step && step.contents.includes("story_event") && story.finalStep === "mini_boss") {
        const minibossId = story.storyInjections[world.currentStepIndex].inject.minibossId;
      //  console.log("minibossId:", minibossId);
        const miniboss = generateMiniboss(gameState.char.level, minibossId);
 
        opt.type = "mini_boss";
        opt.used = false;
        opt.enemyData = miniboss;
      
       // console.log("✅ Podmieniono story_event na bossa:", miniboss.name);
         //renderOptions();
        questState.objective = t(questData.objectiveAfterEvent);
        questState.questNotifications = true;
        notifyQuestUpdate(questData.id);
        saveGame();
        //saveStatePartial({ quests: battleState.quests });
      }
      
    } else if (questData.firstEventPassed === undefined) {
      // ustaw enemy
    //  console.log(`is secretEnemy`, enemy.name);
      opt.type = "story_enemy"; //JAKBY COŚ NIE DZIAŁAŁO TO DAJ enemy
      opt.used = false;
      opt.enemyData = enemy;
      opt.enemyData.__stepIndex = world.currentStepIndex;
      opt.enemyData.__slotIndex = world.selectedSlotIndex;
    }
    // jeśli jest false → nic nie rób
    
    // wyczyść info o aktywnym dialogu
    //activeStorySlot = null;
    
    if(questData.firstEventPassed !== undefined && questState.firstEventPassed === false) {
      questState.firstEventPassed = true;
      
      questState.objective = t(questData.objectiveAfterFirstEvent);
      questState.questNotifications = true;
      notifyQuestUpdate(questData.id);
      
      opt.used = true;
     // console.log(`kolejny objective`);
 
      saveGame();
      //saveStatePartial({ quests: battleState.quests });
    }
    
    // odśwież UI, aby natychmiast pokazać przeciwnika
    renderOptions();
  } else {
    const questItem = story.storyInjections[world.currentStepIndex]?.inject.reward;
      
    if(questItem) {
      addItemToInventory(questItem);
    } else {
      questState.objective = t(questData.objectiveAfterEvent);
      questState.questNotifications = true;
      notifyQuestUpdate(questData.id);
      saveGame();
      //saveStatePartial({ quests: battleState.quests });
    } 
  }
  
  saveGame();
  //saveState();
  closeQuestPopup();
}

function failQuest(questId) {
  const quest = gameState.world.battleState.quests?.[questId];
  if (!quest) return;

  quest.state = "failed";
  quest.objective = `${t("quest_failed")}`;
  quest.questNotifications = true;
  notifyQuestUpdate(quest.id);
 
  showInfoAlert(`${t("quest_failed")}: ${t(quest.title)}.`, 2000, false);
  saveGame();
  //saveStatePartial({ quests: battleState.quests });
}

function getActiveQuests() {
  return Object.values(gameState.world.battleState.quests || {}).filter(q => q.state === "active");
}

function closeQuestPopup() {
   const popup = document.getElementById("item-popup");
   popup.classList.add("hidden");
   playSound("open-slot", 0.4);
}

function notifyQuestUpdate(questId) {
  // 🔴 Włącz czerwoną kropkę
    //document.querySelector("#quest-button").classList.add("notification");
  
    const questBookSrc = assetManager.getResolvedAsset("img/icons/quest-book-icon-update.png");
  
    const icon = document.getElementById("quest-book");
    icon.src = questBookSrc;
    icon.classList.add("notify");
  
    //const questBtn = document.getElementById("quest-button");

  
    // Jeśli chcesz później to wyłączyć po wejściu do dziennika:
    // removeQuestNotification();
}

function removeQuestNotification() {
  // ⬇️ Pobieramy WSZYSTKIE questy z battleState
  const quests = Object.values(gameState.world.battleState.quests || {});

  // ⬇️ Sprawdzamy, czy którykolwiek ma aktywną notyfikację
  const anyNotificationActive = quests.some(q => q.questNotifications);

  // ⬇️ Jeżeli NIE ma ani jednej — usuwamy czerwoną kropkę z przycisku
  if (!anyNotificationActive) {
    //document.querySelector("#quest-button").classList.remove("notification");
    const questBookSrc = assetManager.getResolvedAsset("img/icons/quest-book-icon.png");
    const icon = document.getElementById("quest-book");
    icon.src = questBookSrc;
    icon.classList.remove("notify");
  }
}

function updateQuestNotification() {
  const quests = Object.values(gameState.world.battleState.quests || {});
  const anyNotificationActive = quests.some(q => q.questNotifications);
  const icon = document.getElementById("quest-book");

//  console.log(`anyNotificationActive`, anyNotificationActive);
  
  if (!anyNotificationActive) {
    //document.querySelector("#quest-button").classList.remove("notification");
    const questBookSrc = assetManager.getResolvedAsset("img/icons/quest-book-icon.png");

    icon.src = questBookSrc;
    icon.classList.remove("notify");
  } else {
    //document.querySelector("#quest-button").classList.add("notification");
    const questBookUpSrc = assetManager.getResolvedAsset("img/icons/quest-book-icon-update.png");

    icon.src = questBookUpSrc;
    icon.classList.add("notify");
  }
}

function updateQuestShortInfo() {
  const infoBox = document.querySelector("#quest-short-info");
  if (!infoBox) return;

  // Znajdź aktywny quest z liczeniem celu
  const activeQuest = Object.values(gameState.world.battleState.quests || {})
    .find(q => q.targetCount !== 0 && q.state === "active");

  if (!activeQuest || activeQuest.state === `completed`) {
    infoBox.textContent = "";
    return;
  }

  // Pobierz definicję questa z QUEST_DATA
  const questData = QUEST_DATA[activeQuest.id];
  if (!questData) {
    infoBox.textContent = "";
    return;
  }

  // Jeśli quest jest typu "zabij X"
  if (questData.objectiveTarget) {
    infoBox.textContent = `${t(questData.objectiveTarget)}: ${activeQuest.targetCount}/${questData.targetCount}`;
    return;
  }

  // Inne questy — nie pokazujemy tu nic
  infoBox.textContent = "";
}
