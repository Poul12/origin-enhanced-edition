//const combat = gameState.combat;

/*function restoreSkillCooldowns() {
  const now = Date.now();
  for (const skillId in combat.skills.skillCooldowns) {
    console.error(`enter for in restore skills cooldown`);
    const remaining = (combat.skills.skillCooldowns[skillId] - now) / 1000;
    console.error(`remaining in restore skills cooldown`, remaining);
    if (remaining > 0) {
      startSkillCooldown(skillId, remaining, true);
    }
  }
}*/


function restoreSkillCooldowns() {
  const now = getGameTime(); // używaj tego samego czasu co przy zapisie!
  const skillCooldowns = gameState.combat.skills.skillCooldowns;

  if (!skillCooldowns) return;
 // console.error(`enter for in restore skills cooldown`);
   
  for (const skillId in skillCooldowns) {
    const endTime = skillCooldowns[skillId];
    const remainingMs = endTime - now;
    //console.error(`remainingMs in restore skills cooldown`, remainingMs);

    if (remainingMs > 0) {
      startSkillCooldown(skillId, remainingMs / 1000);
    } else {
      // cooldown minął — czyścimy
      delete skillCooldowns[skillId];
    }
  }
}

function loadSkillCooldowns() {
  const skillCooldowns = gameState.combat.skills.skillCooldowns;
  
  if(!skillCooldowns) return {};
  
  // Usuwanie przestarzałych cooldownów
  const now = getGameTime();
  Object.keys(skillCooldowns).forEach(key => {
    if (skillCooldowns[key] <= now) delete skillCooldowns[key];
  });

  return skillCooldowns;
}

function updateSkillButtonsFatigueState() {
  const fatigueUntil = getPlayerFlag("fleeFatigueUntil") || 0;
  const now = nowDateMs();
  const isFatigued = now < fatigueUntil;
    
  document.querySelectorAll("button.skill-button").forEach(btn => {
    const skillId = btn.dataset.skill;
    const skill = SKILLS_DATABASE[skillId];

    if (isFatigued) {
      btn.classList.add("disabled-skill");
    } else {
      btn.classList.remove("disabled-skill");
    }
  });
  
  //setSkillDisabled(`precision`, true);

  //skillsOn();
  //renderCombat();
}

/*function canUseSkill(skill) {
    if (skill.requirements?.blocking && !player.blocking) return false;
    if (skill.requirements?.guardStacks &&
        player.guardStacks < skill.requirements.guardStacks) return false;

    return true;
}*/

/*function skillsOff() {
    document.querySelectorAll("button.skill-button").forEach(btn => {
        const skillId = btn.dataset.skill;
        const skill = SKILLS_DATABASE[skillId];
        //console.log(`skillId, usableWhileBlocking`, skillId, skill?.usableWhileBlocking);
        if (skill?.usableWhileBlocking) {
            btn.classList.remove("disabled-skill");
        } else {
            btn.classList.add("disabled-skill");
        }
    });
}*/

const CONDITIONALLY_DISABLED_SKILLS = new Set([
  "riposte",
  "precision",
  "perfect-execution",
  "piercing-thrust",
  "sweep",
  "impale",
  "control-shatter",
  "absolute-control",
  "blood-frenzy",
  "blood-pact",
  "blood-reaver",
  "executioner",
]);

function isSkillDisabled(skillId) {
  return CONDITIONALLY_DISABLED_SKILLS.has(skillId);
}

function skillsOff() {
    document.querySelectorAll(".skill-button").forEach(btn => {
        const skillId = btn.dataset.skill;
        const skill = SKILLS_DATABASE[skillId];

        const mode = skill?.usableWhileBlocking ?? "normal";

        if (mode === "blocking" || mode === "both") {
            btn.classList.remove("disabled-skill");
        } else {
            btn.classList.add("disabled-skill");
        }
    });
}

function skillsOn() {
    document.querySelectorAll(".skill-button").forEach(btn => {
        const skillId = btn.dataset.skill;
        const skill = SKILLS_DATABASE[skillId];

        const mode = skill?.usableWhileBlocking ?? "normal";
      
        if (mode === "normal" || mode === "both") {
            btn.classList.remove("disabled-skill");
        } else {
            btn.classList.add("disabled-skill");
        }
      
        /*if(skillId === `riposte` || skillId === `perfect-execution` || skillId === `piercing-thrust` || skillId === `sweep` || skillId === `impale` || skillId === `control-shatter` || skillId === `absolute-control` || skillId === `blood-frenzy`) {
            btn.classList.add("disabled-skill");
        }*/
      
        if (isSkillDisabled(skillId)) {
          btn.classList.add("disabled-skill");
        }
      
    });
}

/*function skillsOff() {
  document.querySelectorAll("button.skill-button").forEach(btn => {
      btn.classList.add("disabled-skill");
  });
}*/

/*function skillsOn() {
  document.querySelectorAll("button.skill-button").forEach(btn => {
        const skillId = btn.dataset.skill;
        const skill = SKILLS_DATABASE[skillId];
        //console.log(`skillId, usableWhileBlocking`, skillId, skill?.usableWhileBlocking);
        if (skill?.usableWhileBlocking) {
            btn.classList.add("disabled-skill");
        } else {
            btn.classList.remove("disabled-skill");
        }
    });

}*/

function handleSkillClick(button) {
 // console.error(`handleSkillClick enter`);
  const world = gameState.world;

  if(!world.inCombat) return;
  
  if (!canPerformAction(`skill`)) return;
  //console.error(`handleSkillClick enter`);
  
  const skillCooldowns = gameState.combat.skills.skillCooldowns;

  // na samym wejściu do handleSkillClick:
  const fatigueUntil = getPlayerFlag("fleeFatigueUntil") || 0;
  if (nowDateMs() < fatigueUntil) {
    updateSkillButtonsFatigueState();
    const secs = Math.ceil((fatigueUntil - nowDateMs())/1000);
    //showInfoAlert(`Jesteś zmęczony po ucieczce. Skille dostępne za ${secs}s.`);
    return;
  }
  
  //const button = e.target.closest("button.skill-button");
  if (!button) return;
  
  const skillId = button.dataset.skill;
  if (!skillId || !SKILLS_DATABASE[skillId]) return;

  const skill = SKILLS_DATABASE[skillId];
  
  if(skill?.staminaCost) {
    const effectiveCost = skill.staminaCost + Math.max(0, gameState.resources.staminaState.max - 100)  * COST_SCALE;
  
    //console.error(`skill effectiveCost`, effectiveCost);
    if(!spendStamina(effectiveCost)) return;
    //console.log("Skill after spend stamina.");
  }
  
  if(skill?.guardCost) {
    
    if(guardStacks >= skill.guardCost) {
      guardStacks -= skill.guardCost;
      consumeGuardStacks(guardStacks);
      decreaseGuardStack();
      //addWeaponMasteryExp(`bulwark`, 5);
    } else {
      showReward(`${t("low_guard_reward")}`);
      playSound(`error`);
      return;
    }
  }
  
  
  const now = getGameTime();
  const cooldown = (SKILLS_DATABASE[skillId].baseCooldown || 5) * 1000; // ms

  if (skillCooldowns[skillId] && now < skillCooldowns[skillId]) {
    //console.log("Skill jeszcze na cooldownie.");
    return;
  }

  skillCooldowns[skillId] = now + cooldown;
  //saveSkillCooldowns(skillCooldowns); // zapisz cooldowny
  startSkillCooldown(skillId, cooldown / 1000);
  saveGame();
  
  if (world.selectedSlotIndex !== null && world.inCombat) {
    // tryb walki – mamy cel
   // console.log("using skill on enemy");
    const enemy = world.exploreOptions[world.selectedSlotIndex].enemyData;
    const player = getPlayerStats();
    
    useSkill(skillId, player, enemy);
  } /*else {
    // poza walką – ale jeśli skill może działać samodzielnie, odpal go
   // console.log("using skill outside combat");
    const player = getPlayerStats();
    useSkill(skillId, player, null);
  } */
  
 // console.log("start skill cooldown");
}

function setSkillDisabled(skillId, disabled = true) {
    const btn = document.querySelector(
        `.skill-button[data-skill="${skillId}"]`
    );

    if (!btn) return;

    btn.classList.toggle("disabled-skill", disabled);
}

function renderSkillButtons(playerLevel, start = 1, end = 6) {
  let output = "";
  const weaponStyle = getCurrentWeaponStyle();
 // console.log(`style at render: `, weaponStyle);

  for (let i = start; i <= end; i++) {
    //const skillId = gameState.combat.skills.assignedSkills[weaponStyle][i];
    const skillId = gameState.combat.skills.assignedSkills?.[weaponStyle]?.[i] ?? null;
    //const skills = gameState.combat.skills.playerSkills;
    const skills = gameState.combat.skills?.playerSkills?.active[weaponStyle];
    const skill = SKILLS_DATABASE[skillId];

    if (!skill) {
      output += `
        <div class="skill-wrapper">
          <button class="skill-button empty" disabled title="Nie przypisano skilla">
            <div class="skill-icon base">⛔</div>
          </button>
        </div>
      `;
      continue;
    }

    const mastery = gameState.char.weaponMastery[weaponStyle];
    const hasRequiredLevel = mastery.level >= skill.requiredLevel;
    const parentUnlocked = !skill.parent || (skills[skill.parent] && skills[skill.parent].unlocked);
    const isUnlocked = hasRequiredLevel && parentUnlocked;
    const usableMode = skill.usableWhileBlocking ?? "normal";   
    //console.error(`parentUnlocked, isUnlocked, skill.parent, skills[skill.parent]`, parentUnlocked, isUnlocked, skill.parent, skills[skill.parent]);
    const titleText = `${skill.name} (poziom ${skill.level})`;

    /*const cooldownOverlayHTML = `
     <div class="icon-wrapper" style="--icon: url('${ASSET_BASE}${skill.icon}')">
       <img src="${ASSET_BASE}${skill.icon}" alt="${skill.name}" class="skill-icon-img" />
       <div class="layer top" id="top-${skillId}"></div>
       <div class="layer fill" id="cd-fill-${skillId}"></div>
     </div>
    `;*/
    
    const skillIconUrl = assetManager.getResolvedAsset(skill.icon);
    
    const cooldownOverlayHTML = `
      <div class="icon-wrapper">
        <div class="skill-icon top" id="top-${skillId}">
           <img src="${skillIconUrl}" alt="${skill.name}" class="skill-icon-img" />
        </div>
        <div class="skill-icon base">
           <img src="${skillIconUrl}" alt="${skill.name}" class="skill-icon-img" />
        </div>
        <div class="skill-icon fill" id="cd-fill-${skillId}">
          <div class="fill-mask">
            <img src="${skillIconUrl}" alt="${skill.name}" class="skill-icon-img" />
          </div>
        </div>
      </div>
    `;

   /* output += `
      <div class="skill-wrapper">
        <button 
          id="skill-${skillId}" data-action="skill"
          class="skill-button ${isUnlocked ? "" : "locked"}
          ${(usableMode === "blocking") ? "disabled-skill" : ""}
          ${(skillId === "riposte") ? "disabled-skill" : ""}
          ${(skillId === "precision") ? "disabled-skill" : ""}
          ${(skillId === "perfect-execution") ? "disabled-skill" : ""}
          ${(skillId === "piercing-thrust") ? "disabled-skill" : ""}
          ${(skillId === "sweep") ? "disabled-skill" : ""}
          ${(skillId === "impale") ? "disabled-skill" : ""}
          ${(skillId === "control-shatter") ? "disabled-skill" : ""}
          ${(skillId === "blood-frenzy") ? "disabled-skill" : ""}
          ${(skillId === "absolute-control") ? "disabled-skill" : ""}"
          ${isUnlocked ? `data-skill="${skillId}"` : "disabled"}
          title="${titleText}"
        >
          ${isUnlocked ? cooldownOverlayHTML : "🔒"}
        </button>
      </div>
    `;*/
    
    output += `
      <div class="skill-wrapper">
        <button 
          id="skill-${skillId}" 
          data-action="skill"
          class="skill-button ${isUnlocked ? "" : "locked"}
          ${(usableMode === "blocking") ? "disabled-skill" : ""}
          ${isSkillDisabled(skillId) ? "disabled-skill" : ""}"
          ${isUnlocked ? `data-skill="${skillId}"` : "disabled"}
          title="${titleText}"
        >
          ${isUnlocked ? cooldownOverlayHTML : "🔒"}
        </button>
      </div>
    `;
    
  }
  
  /*const stackChain = gameState.combat.playerBlock.stackChain;
  
  if(!stackChain) {
    setSkillDisabled(`precision`, true);
  }*/
  
  return output;
}


function renderFocusSkillButton(playerLevel) {
  //const skills = gameState.combat.skills.playerSkills;
  const skillId = "focus";
  const skill = SKILLS_DATABASE[skillId];

  if (!skill) return "";

  //const playerSkill = skills[skillId];
  const playerSkill = getPlayerSkillData(skillId);

  const skillLevel = playerSkill?.level || 0;
  const unlocked = playerSkill?.unlocked || false;

  const hasRequiredLevel = playerLevel >= skill.requiredLevel;
  const isUnlocked = hasRequiredLevel && unlocked;

  const titleText = `${skill.name} (poziom ${skillLevel})`;

  const skillIconUrl = assetManager.getResolvedAsset(skill.icon);
  
  const cooldownOverlayHTML = `
    <div class="icon-wrapper">
      <div class="skill-icon top" id="top-${skillId}">
        <img src="${skillIconUrl}" alt="${skill.name}" class="skill-icon-img" />
      </div>

      <div class="skill-icon base">
        <img src="${skillIconUrl}" alt="${skill.name}" class="skill-icon-img" />
      </div>

      <div class="skill-icon fill" id="cd-fill-${skillId}">
        <div class="fill-mask">
          <img src="${skillIconUrl}" alt="${skill.name}" class="skill-icon-img" />
        </div>
      </div>
    </div>
  `;

  return `
    <div class="skill-wrapper focus-wrapper">
      <button
        id="skill-${skillId}"
        data-action="skill"
        class="skill-button focus-btn ${isUnlocked ? "" : "locked"}"
        ${isUnlocked ? `data-skill="${skillId}"` : "disabled"}
        title="${titleText}"
      >
        ${isUnlocked ? cooldownOverlayHTML : "🔒"}
      </button>
    </div>
  `;
}

// Globalny obiekt stanu cooldownów
const skillCooldownState = {};

function startSkillCooldown(skillId, durationInSeconds) {
 // console.error(`Start cooldown for ${skillId} (${durationInSeconds}s)`);

  const fill = document.getElementById(`cd-fill-${skillId}`);
  const top = document.getElementById(`top-${skillId}`);
  const button = document.getElementById(`skill-${skillId}`);
 // console.error(`Start cooldown after elements: fill, top, button`,fill, top, button);

  if (!fill || !top || !button) return;
  
  //console.error(fill.innerHTML);
    
  // Jeśli istnieje stary cooldown — zatrzymaj go
  if (skillCooldownState[skillId]?.rafId) {
    cancelAnimationFrame(skillCooldownState[skillId].rafId);
  }
 // console.error(`Start cooldown after old cooldown`);


  button.disabled = true;
  top.style.display = 'none';
  //fill.style.clipPath = `inset(0 100% 0 0)`;
  //fill.style.transform = `scaleX(1)`;
  
  const mask = fill.querySelector(".fill-mask");
  if (!mask) {
    //console.error("BRAK fill-mask!", fill);
    return;
  }

  //mask.style.transform = "scaleX(1)";
  mask.style.width = `100%`;
    
  let cooldownCounter = button.querySelector(".cooldown-counter");
  if (!cooldownCounter) {
    cooldownCounter = document.createElement("span");
    cooldownCounter.className = "cooldown-counter";
    Object.assign(cooldownCounter.style, {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      fontSize: "16px",
      fontWeight: "bold",
      color: "#fff",
      textShadow: "1px 1px 3px rgba(0,0,0,0.7)",
      pointerEvents: "none",
      zIndex: "10"
    });
    button.appendChild(cooldownCounter);
  }

  const durationMs = durationInSeconds * 1000;

  skillCooldownState[skillId] = {
    durationMs,
    remainingMs: durationMs,
    lastFrameTime: getGameTime(),
    isPaused: false,
    rafId: null
  };

 // console.error(`Start cooldown animation`);

  animateSkillCooldown(skillId, fill, top, button, cooldownCounter);
}

function animateSkillCooldown(skillId, fill, top, button, counter) {
  
  const state = skillCooldownState[skillId];
  if (!state) return;

  function step() {
    if (state.isPaused) return;
    
    const now = getGameTime();
    const delta = now - state.lastFrameTime; // czas od ostatniej klatki
    state.lastFrameTime = now; // aktualizujemy punkt odniesienia

    state.remainingMs = Math.max(state.remainingMs - delta, 0);
    
    updateSkillCooldownVisual(skillId);
    
    if (state.remainingMs > 0) {
      state.rafId = requestAnimationFrame(step);
    } else {
      finishSkillCooldown(skillId, fill, top, button, counter);
    }
  }

  state.rafId = requestAnimationFrame(step);
}

function finishSkillCooldown(skillId, fill, top, button, counter) {
  //fill.style.clipPath = `inset(0 0% 0 0)`;
  //fill.style.transform = `scaleX(0)`;
  const mask = fill.querySelector(".fill-mask");
  if (!mask) {
   // console.error("BRAK fill-mask!", fill);
    return;
  }
  //mask.style.transform = "scaleX(0)";
  mask.style.width = `0%`;
  
  top.style.display = 'flex';
  button.disabled = false;
  if (counter) counter.remove();
  cancelAnimationFrame(skillCooldownState[skillId]?.rafId);
  delete skillCooldownState[skillId];
}

function pauseAllSkillsCooldown() {
 // console.log("⏸️ Pauzuję wszystkie cooldowny");
  for (const id in skillCooldownState) {
    const state = skillCooldownState[id];
    if (!state || state.isPaused) continue;
    cancelAnimationFrame(state.rafId);
    state.isPaused = true;
  }
}

function resumeAllSkillsCooldown() {
 // console.log("▶️ Wznawiam wszystkie cooldowny");
  for (const id in skillCooldownState) {
    const state = skillCooldownState[id];
    if (!state || !state.isPaused) continue;

    const fill = document.getElementById(`cd-fill-${id}`);
    const top = document.getElementById(`top-${id}`);
    const button = document.getElementById(`skill-${id}`);
    const counter = button?.querySelector(".cooldown-counter");
    if (!fill || !top || !button || !counter) continue;

    state.isPaused = false;
    state.lastFrameTime = getGameTime(); // ważne! reset punktu odniesienia
    animateSkillCooldown(id, fill, top, button, counter);
  }
}

function updateSkillCooldownVisual(skillId) {
  const state = skillCooldownState[skillId];
  if (!state) return;

  const fill = document.getElementById(`cd-fill-${skillId}`);
  const button = document.getElementById(`skill-${skillId}`);

  if (!fill || !button) return;

  const mask = fill.querySelector(".fill-mask");
  const counter = button.querySelector(".cooldown-counter");

  if (!mask) return;

  const progress = 1 - state.remainingMs / state.durationMs;

  mask.style.width = `${Math.max(0, progress * 100)}%`;

  if (counter) {
    const value = Math.ceil(state.remainingMs / 1000);

    counter.innerText = value;
    counter.style.color =
      value <= 2 ? "#ff5555" : "#fff";
  }
}

function reduceSkillCooldown(skillId, reductionPercent) {
  const state = skillCooldownState[skillId];

  if (!state) return;

  const reduction = Math.max(0, Math.min(reductionPercent, 100)) / 100;

  state.remainingMs *= (1 - reduction);

  //console.log(`state.remainingMs`, state.remainingMs);
        
  // natychmiastowa aktualizacja UI
  updateSkillCooldownVisual(skillId);

  // jeśli cooldown właśnie się skończył
  if (state.remainingMs <= 0) {
    const fill = document.getElementById(`cd-fill-${skillId}`);
    const top = document.getElementById(`top-${skillId}`);
    const button = document.getElementById(`skill-${skillId}`);
    const counter = button?.querySelector(".cooldown-counter");

    if (fill && top && button) {
      finishSkillCooldown(
        skillId,
        fill,
        top,
        button,
        counter
      );
    }
  }
}

let parryMasterRafId = null;

function startParryMasterTimer(enemy) {

    if (parryMasterRafId) {
        cancelAnimationFrame(parryMasterRafId);
    }

    let lastTime = getGameTime();

    function step() {

        const pm = gameState.combat.parryMaster;

        if (!pm.isActive) {
            parryMasterRafId = null;
            return;
        }

        const now = getGameTime();
        const delta = now - lastTime;
        lastTime = now;

        pm.remainingMs -= delta;

        //console.log(`parry master pm.remainingMs, delta`, pm.remainingMs, delta);
       
        if (pm.remainingMs <= 0) {

            pm.remainingMs = 0;
            pm.isActive = false;

            //console.log(`parry master end`);
          
            updateStatusPlayerUI(enemy);
          
            parryMasterRafId = null;

            //onParryMasterEnd();

            return;
        }

        parryMasterRafId =
            requestAnimationFrame(step);
    }

    parryMasterRafId =
        requestAnimationFrame(step);
}


// globalny obiekt stanu cooldownów
/*const skillCooldownState = {}; // klucze: skillId (string/number)

// ------------------------
// START / RESTORE COOLDOWN
// ------------------------
function startSkillCooldown(skillId, durationInSeconds, isRestore = false) {
  console.log(`Start cooldown for ${skillId} (${durationInSeconds}s)${isRestore ? ' [restore]' : ''}`);

  const fill = document.getElementById(`cd-fill-${skillId}`);
  const top = document.getElementById(`top-${skillId}`);
  const button = document.getElementById(`skill-${skillId}`);
  if (!fill || !top || !button) return;

  // zatrzymaj poprzedni cooldown jeśli był
  if (skillCooldownState[skillId]?.rafId) {
    cancelAnimationFrame(skillCooldownState[skillId].rafId);
  }

  button.disabled = true;
  top.style.display = 'none';
  fill.style.clipPath = `inset(0 100% 0 0)`;

  let cooldownCounter = button.querySelector(".cooldown-counter");
  if (!cooldownCounter) {
    cooldownCounter = document.createElement("span");
    cooldownCounter.className = "cooldown-counter";
    Object.assign(cooldownCounter.style, {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      fontSize: "16px",
      fontWeight: "bold",
      color: "#fff",
      textShadow: "1px 1px 3px rgba(0,0,0,0.7)",
      pointerEvents: "none",
      zIndex: "10"
    });
    button.appendChild(cooldownCounter);
  }

  const durationMs = durationInSeconds * 1000;
  const now = Date.now();

  // jeżeli przywracamy cooldown, zachowaj zapisany koniec
  const targetEnd = isRestore && skillCooldowns[skillId]
    ? skillCooldowns[skillId]
    : now + durationMs;

  // zapisz stan
  skillCooldowns[skillId] = targetEnd;
  saveSkillCooldowns(skillCooldowns);

  const state = {
    durationMs,
    startTime: performance.now(),
    targetEnd,
    remainingMs: targetEnd - now,
    isPaused: false,
    wasPaused: false,
    rafId: null
  };
  skillCooldownState[skillId] = state;

  function animate(time) {
    if (!skillCooldownState[skillId] || skillCooldownState[skillId].isPaused) return;

    const currentTime = Date.now();
    const remaining = Math.max(state.targetEnd - currentTime, 0);
    state.remainingMs = remaining;

    const progress = 1 - remaining / state.durationMs;
    fill.style.clipPath = `inset(0 ${100 - progress * 100}% 0 0)`;

    const value = Math.ceil(remaining / 1000);
    cooldownCounter.innerText = value;
    cooldownCounter.style.color = value <= 2 ? "#ff5555" : "#fff";

    if (remaining > 0) {
      state.rafId = requestAnimationFrame(animate);
    } else {
      fill.style.clipPath = `inset(0 0% 0 0)`;
      top.style.display = 'flex';
      button.disabled = false;
      cooldownCounter.remove();
      delete skillCooldownState[skillId];
      delete skillCooldowns[skillId];
      saveSkillCooldowns(skillCooldowns);
    }
  }

  state.rafId = requestAnimationFrame(animate);
}*/

/*function pauseAllSkillsCooldown() {
  console.log("⏸️ Pauzuję wszystkie cooldowny");
  for (const id in skillCooldownState) {
    const state = skillCooldownState[id];
    if (!state || state.isPaused) continue;

    const elapsed = performance.now() - state.startTime;
    state.remainingMs = Math.max(state.durationMs - elapsed, 0);
    state.isPaused = true;
    state.wasPaused = true; // ⬅️ nowa flaga, tylko jeśli faktycznie zatrzymano
    if (state.rafId) cancelAnimationFrame(state.rafId);
    state.rafId = null;
  }
}

function resumeAllSkillsCooldown() {
  console.log("▶️ Wznawiam wszystkie cooldowny");
  for (const id in skillCooldownState) {
    const state = skillCooldownState[id];
    if (!state || !state.isPaused || !state.wasPaused) continue; // ⬅️ tylko faktycznie zatrzymane

    const fill = document.getElementById(`cd-fill-${id}`);
    const top = document.getElementById(`top-${id}`);
    const button = document.getElementById(`skill-${id}`);
    if (!fill || !button) continue;

    const startTime = performance.now();
    const remaining = state.remainingMs;
    const total = state.durationMs;

    state.isPaused = false;
    state.wasPaused = false; // reset flagi

    function animate(time) {
      if (!skillCooldownState[id] || skillCooldownState[id].isPaused) return;
      const elapsed = time - startTime;
      const newRemaining = Math.max(remaining - elapsed, 0);
      state.remainingMs = newRemaining;

      const progress = 1 - newRemaining / total;
      fill.style.clipPath = `inset(0 ${100 - progress * 100}% 0 0)`;

      const counter = button.querySelector(".cooldown-counter");
      if (counter) counter.innerText = Math.ceil(newRemaining / 1000);

      if (newRemaining > 0) {
        state.rafId = requestAnimationFrame(animate);
      } else {
        if (top) top.style.display = 'flex';
        if (counter) counter.remove();
        button.disabled = false;
        delete skillCooldownState[id];
        delete skillCooldowns[id];
        saveSkillCooldowns(skillCooldowns);
      }
    }

    state.rafId = requestAnimationFrame(animate);
  }
}*/

//BASE VERSION WORKING
/*function startSkillCooldown(skillId, durationInSeconds) {
  console.log("start skill cooldown begining");
   
  const fill = document.getElementById(`cd-fill-${skillId}`);
  const top = document.getElementById(`top-${skillId}`);
  const button = document.getElementById(`skill-${skillId}`);
  if (!fill || !top || !button) return;

  button.disabled = true;
  top.style.display = 'none';
  fill.style.clipPath = `inset(0 100% 0 0)`;

  // === 🔥 DODAJ LICZNIK NA ŚRODKU ===
  let cooldownCounter = button.querySelector(".cooldown-counter");
  if (!cooldownCounter) {
    cooldownCounter = document.createElement("span");
    cooldownCounter.className = "cooldown-counter";
    cooldownCounter.style.position = "absolute";
    cooldownCounter.style.top = "50%";
    cooldownCounter.style.left = "50%";
    cooldownCounter.style.transform = "translate(-50%, -50%)";
    cooldownCounter.style.fontSize = "14px";
    cooldownCounter.style.fontWeight = "bold";
    cooldownCounter.style.color = "#fff";
    cooldownCounter.style.textShadow = "1px 1px 3px rgba(0,0,0,0.7)";
    button.appendChild(cooldownCounter);
  }

  const start = performance.now();

  function animate(time) {
    const elapsed = (time - start) / 1000;
    const remaining = Math.max(durationInSeconds - elapsed, 0);
    const progress = Math.min(elapsed / durationInSeconds, 1);
    const percent = progress * 100;

    fill.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
    cooldownCounter.innerText = Math.ceil(remaining); // ⏱ aktualizuj licznik

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      // Cooldown zakończony
      fill.style.clipPath = `inset(0 0% 0 0)`;
      top.style.display = 'flex';
      button.disabled = false;
      cooldownCounter.remove(); // usuń licznik
    }
  }

  requestAnimationFrame(animate);
}*/

function calculateEffectValue(effect, player, enemy) {
  switch (effect.type) {
    case "damage":
      // np. 150% obrażeń = 1.5 * atak gracza
      //console.error("calculate effect damage", effect.value);
      return effect.value / 100;// * player.dmg);
    case "whirlwind":
      return effect.value / 100;// * player.dmg);
    case "bleed":
      // np. 150% obrażeń = 1.5 * atak gracza
      return effect.value / 100;// * player.dmg);
    case "burn":
      return effect.value / 100;// * player.dmg);
    case "poison":
      return effect.value / 100;// * player.dmg);
    case "armor-break":
      // np. 150% obrażeń = 1.5 * atak gracza
      return effect.value / 100;// * player.dmg);
    case "counter-strike":
      return effect.value / 100;// * player.dmg);
    case "open-windup":
      return 1 + (effect.value / 100);// * player.dmg);
    case "buff-next-attack":
      return 1 + (effect.value / 100);// * player.dmg);
    case "precision-buff":
      return effect.value / 100;// * player.dmg);
    case "reduce-cooldown":
      return effect.value;// * player.dmg);
    case "reduce-shield-cooldown":
      return effect.value;// * player.dmg);
    case "damage-reduction-buff":
      return effect.value;// * player.dmg);
    case "crit-buff":
      return effect.value;// * player.dmg);
    case "crit-buff-pact":
      return effect.value;// * player.dmg);
    case "crit-dmg-buff":
      return 1 + (effect.value / 100);// * player.dmg);
    case "hp-cost":
      return effect.value / 100;// * player.dmg);
    case "heal-convert":
      return effect.value / 100;
    case "stun":
      // Stun w sekundach — bez przeliczeń
      return effect.value;
    case "slow":
      // Slow w procentach — bez przeliczeń
      return effect.value;
    case "spear-control":
      return effect.value;
    case "def-buff":
      // def buff w procentach — bez przeliczeń
      return 1 + (effect.value / 100);
    case "slowmo":
      // Slow w procentach — bez przeliczeń
      return effect.value / 100;
    case "pushback":
      return effect.value / 100;
    case "windup":
      return effect.value / 100;
    case "mark":
      return effect.value / 100;
    case "blocking-cost":
      return 1 - (effect.value / 100);
    case "attack-speed":
      return effect.value / 100;
    case "life-steal":
      return effect.value / 100;
    case "damage-buff":
     // console.log("damage-buff: %", effect.value);
      //console.log("player dmg ", player.dmg);
      return 1 + (effect.value / 100);
    case "stamina-recover":
      return effect.value;
    case "armor-duration":
      return effect.value;
    case "slow-duration":
      return effect.value;
    case "slowmo-duration":
      return effect.value;
    case "shout-duration":
      return effect.value;
    case "bleed-duration":
      return effect.value;
    case "burn-duration":
      return effect.value;
    case "def-buff-duration":
      return effect.value;
    case "precision-duration":
      return effect.value;
    case "vulnerable-duration":
      return effect.value;
    case "sweep-duration":
      return effect.value;
    case "discipline-duration":
      return effect.value;
    case "absolute-duration":
      return effect.value;
    case "frenzy-duration":
      return effect.value;
    case "reaver-duration":
      return effect.value;
    case "counter-duration":
      return effect.value;

    default:
      return 0;
  }
}

function getSkillEffectsAtLevel(skillId) {
  const skill = SKILLS_DATABASE[skillId];
  //const state = gameState.combat.skills.playerSkills[skillId];
  const state = getPlayerSkillData(skillId);

  const { effects, level } = skill;
     
  return effects.map(effect => {
    //console.error("effect value + scaling level", effect.baseValue + (effect.scalingPerLevel || 0) * (state.level - 1));
    //console.error("effect baseValue, effect.scalingPerLevel, level", effect.baseValue, effect.scalingPerLevel, state.level);

    return {
      ...effect,
      value: effect.baseValue + (effect.scalingPerLevel || 0) * (state.level - 1)
    };
  });
}

function groupEffectsByType(effects) {
  const grouped = {};
  effects.forEach(effect => {
    if (!grouped[effect.type]) grouped[effect.type] = [];
    grouped[effect.type].push(effect);
  });
  return grouped;
}

function getEffectValue(effects, type, player, enemy) {
  const found = effects.find(e => e.type === type);
  return found ? calculateEffectValue(found, player, enemy) : null;
}

/*function restoreBuffsAfterReload() {
  const expiresAt = parseInt(localStorage.getItem("dmgBuffExpiresAt"), 10);
  const buffValue = parseFloat(localStorage.getItem("dmgBuffValue"));

  if (expiresAt && expiresAt > Date.now() && buffValue) {
    const remaining = expiresAt - Date.now();

    isDmgBuffed = true;
    currentBuff.dmg = buffValue;
    updatePlayerDmg(buffValue, true);

    setTimeout(() => {
      removeDmgBuff();
    }, remaining);
  } else {
    // jeśli buff już minął – wyczyść dane, żeby nie było śmieci
    localStorage.removeItem("dmgBuffExpiresAt");
    localStorage.removeItem("dmgBuffValue");
  }
}

function removeDmgBuff() {
  isDmgBuffed = false;
  currentBuff.dmg = 0;
  localStorage.removeItem("dmgBuffExpiresAt");
  localStorage.removeItem("dmgBuffValue");
  renderStats();
}*/

//let isDmgBuffed = false;

function addTemporaryBuff({ stat, value, durationSec, source = "unknown" }) {
  const durationMs = durationSec * 1000;
  const expiresAt = getGameTime() + durationMs;

  // jeśli buff na ten stat już istnieje – nadpisz
  removeBuff(stat);

  gameState.combat.activeBuffs[stat] = {
    value,
    expiresAt,
    source,
    timeoutId: setTimeout(() => removeBuff(stat), durationMs)
  };

  applyBuff(stat, value);

  saveBuffsToStorage();
}

function applyBuff(stat, value) {
  switch (stat) {
    case "dmg":
      //currentBuff.dmg = value;
     // console.error(`buff value dmg`, value);
      updatePlayerDmg(value, true);
      break;

    case "def":
      //currentBuff.def = value;
     // console.error(`buff value def`, value);
      updatePlayerDef(value, true);
      break;

    // 🔮 przyszłość
    // case "atkSpeed":
    // case "critChance":
  }

  renderStats();
}

function removeBuff(stat) {
  const buff = gameState.combat.activeBuffs[stat];
  if (!buff) return;

  clearTimeout(buff.timeoutId);
  
  // cofnięcie efektu
  switch (stat) {
    case "dmg":
      currentBuff.dmg = 0;
      break;
    case "def":
      currentBuff.def = 0;
      break;
  }

  delete gameState.combat.activeBuffs[stat];
  saveBuffsToStorage();
  renderStats();
}

function saveBuffsToStorage() {
  const serialized = {};
  const combat = gameState.combat;

  for (const stat in combat.activeBuffs) {
    serialized[stat] = {
      value: combat.activeBuffs[stat].value,
      expiresAt: combat.activeBuffs[stat].expiresAt,
      source: combat.activeBuffs[stat].source
    };
  }

  saveGame();
}

function restoreBuffsAfterReload() {
  const buffs = gameState.combat.activeBuffs;
  if (!buffs) return;

  const now = Date.now();

  for (const stat in buffs) {
    const { value, expiresAt, source } = buffs[stat];

    if (expiresAt <= now) continue;

    const remainingMs = expiresAt - now;

    gameState.combat.activeBuffs[stat] = {
      value,
      expiresAt,
      source,
      timeoutId: setTimeout(() => removeBuff(stat), remainingMs)
    };

    applyBuff(stat, value);
  }
}

const whirlwindState = {
  isActive: false,
  attackInterval: null,
  bleedInterval: null,
  timeout: null
};

function startWhirlwind(player, enemy, bleedDamage, bleedDuration, actualValue) {

  stopWhirlwind();

  whirlwindState.isActive = true;

  const duration = 3000;
  const interval = 600;
  
  whirlwindState.attackInterval = setInterval(() => {

    if (!whirlwindState.isActive || !gameState.world.inCombat) {
      stopWhirlwind();
      return;
    }

    playEnemyHitAnimation(enemy, gameState.world.selectedSlotIndex);
    
    performAttack(
      player,
      enemy,
      {
        isSkillAttack: true,
        baseMultiplier: actualValue
      }
    );

    spawnEffect("whirlwind_hit", enemy.dom.slot);
    
  }, interval);
  
  playWhirlwindPlayerAnimation(duration);
  playWhirlwindVFX(player.dom.slot, duration);
  
  whirlwindState.bleedInterval = setInterval(() => {

    if (!whirlwindState.isActive || !gameState.world.inCombat) {
      stopWhirlwind();
      return;
    }

    applyBleed(enemy, bleedDamage, bleedDuration);

  }, interval);
  
  whirlwindState.timeout = setTimeout(() => {
    stopWhirlwind();
  }, duration);
}

function stopWhirlwind() {
  whirlwindState.isActive = false;

  if (whirlwindState.attackInterval !== null) {
    clearInterval(whirlwindState.attackInterval);
    whirlwindState.attackInterval = null;
  }

  if (whirlwindState.bleedInterval !== null) {
    clearInterval(whirlwindState.bleedInterval);
    whirlwindState.bleedInterval = null;
  }

  if (whirlwindState.timeout !== null) {
    clearTimeout(whirlwindState.timeout);
    whirlwindState.timeout = null;
  }
}

function useSkill(skillId, player, enemy) {
  const effects = getSkillEffectsAtLevel(skillId);
  //console.log("Skill effects: ", effects, skillId);
  const isSkillAttack = true;
  
  const getEffectByType = (effects, type) => effects.find(e => e.type === type);
  
  effects.forEach(effect => {
    let actualValue = calculateEffectValue(effect, player, enemy);
    let durationEffect = null;
    let buffDuration = 5;
    let durationMs = 0;
    const stackChain = gameState.combat.playerBlock.stackChain;
    
    switch (effect.type) {
      case "damage":
        if (!gameState.world.inCombat) return;
       // console.error("use skill damage", actualValue);
      
        let dmgVsStatus = 0;
      
        switch(skillId) {
          case `slash`:
            playSkill(`heavyAttack`); 
            if(enemy.status.slow || enemy.status.stun) {
              dmgVsStatus = gameState.char.bonus.dmgVsStatus / 100;
              //console.error(`dmgVsStatus, stun`, dmgVsStatus, enemy.status.stun);
            }  
            //console.error(`playSkill(heavyAttack)`, skillId);
            break;
          
          case `twin-slash`:
            playSkill(`doubleStrike`); 
            //console.error(`playSkill(doubleStrike)`, skillId);
            break;
          
          case `jump`:
            playSkill(`jumpAttack`); 
            //console.error(`playSkill(jump)`, skillId);
            break;
       
          case `charge`:
            playSkill(`charge`);
            //console.error(`playSkill(charge)`, skillId);
            break;
        }
 
        if(skillId !== "slash" && skillId !== "jump") {
          //playEnemyHitAnimation(enemy, gameState.world.selectedSlotIndex);
          playEnemyAnimation("hit", gameState.world.selectedSlotIndex);
        }
      
        if (skillId === "slash" || skillId === "jump") {
          
          setTimeout(() => {
           // console.error(`enter timeout double attack`); 
            if (enemy.currentHp > 0 && gameState.world.inCombat) {
              performAttack(
                player,
                enemy,
                {
                  isSkillAttack,
                  baseMultiplier: actualValue + dmgVsStatus
                }
              );
              //console.error(`slash dmg`, actualValue); 
       
              playEnemyHitAnimation(enemy, gameState.world.selectedSlotIndex);
    
              if(skillId === "slash") {
                spawnEffect("slash", enemy.dom.slot);
              }
              
              if(skillId === "jump") {
                //spawnEffect("jump", enemy.dom.slot);
                spawnEffect("jump_impact", enemy.dom.slot);
                spawnEffect("jump_shockwave", enemy.dom.slot);
              }
              
              //console.error(`timeout in if double attack`, enemy.currentHp);
            }
          }, 450);
          
          break;
        }
      
        if(skillId === "riposte") {
          gameState.combat.playerBlock.nextAttackGuaranteedCrit = true;   
          gameState.combat.playerBlock.lastResult = null;
          setSkillDisabled("riposte", true);
          addWeaponMasteryExp(`duelist`, 6, `riposte`);
          
          spawnEffect("riposte", enemy.dom.slot);
      
          if(gameState.combat.precision.buffMultiplier > 1) {
            //console.log(`precion riposte before`, actualValue);
            actualValue *= gameState.combat.precision.buffMultiplier;
            //console.log(`precion riposte after`, actualValue, gameState.combat.precision.buffMultiplier, stackChain);
          } 
        }
      
        if(skillId === "perfect-execution") {
          gameState.combat.playerBlock.nextAttackGuaranteedCrit = true;
          setSkillDisabled("perfect-execution", true);
          
          //console.log(`perfect execution actualValue`, actualValue);
     
          if(gameState.combat.precision.buffMultiplier > 1) {
            actualValue *= gameState.combat.precision.buffMultiplier;
          
            addWeaponMasteryExp(`duelist`, 4, `perfect-execution-buff`);
          } 
  
          addWeaponMasteryExp(`duelist`, 20, `perfect-execution`);
   
          gameState.combat.playerBlock.stackChain = 0;
          
          spawnEffect("perfect_execution", enemy.dom.slot);
     
          if(enemy.vulnerable) {
            //console.log(`perfect execution actualValue before vulnerable`, actualValue);
            actualValue *= 1.25;
            //console.log(`perfect execution actualValue after vulnerable`, actualValue);
            addWeaponMasteryExp(`duelist`, 8, `perfect-execution-vulnerable`);
          } 
          
        }
 
       if(skillId === "impale") {
         gameState.combat.playerBlock.nextAttackGuaranteedCrit = true;
         applyVulnerable(enemy, 2500);
         
         addWeaponMasteryExp(`warden`, 6, `impale`);
         
         spawnEffect("impale", enemy.dom.slot);
   
         resetSpear(enemy, false);
         //stopSpearControlUI();
       }
      
      
      if(skillId === "executioner") {
        gameState.combat.playerBlock.nextAttackGuaranteedCrit = true;
       // console.log(`executioner step1`);
        if(enemy?.bleed?.stacks.length) {
          actualValue += 0.2 * enemy.bleed.stacks.length;
          //console.log(`executioner step2`);
        }
        
        let remainingBleedDmg = 0;
        if(enemy?.bleed?.stacks) {
          for (const stack of enemy.bleed.stacks) {
            remainingBleedDmg += stack.damage * stack.duration;
            //console.log(`executioner step3`);
          }
        }
        dealBleedDamage(enemy, remainingBleedDmg, gameState.world.selectedSlotIndex);
        //console.log(`executioner step4`);
     
        spawnEffect("executioner", enemy.dom.slot);
      //  console.log(`executioner step5`);
     
        clearBleed(enemy);
        resetBleed(enemy, true);
      }
      
        performAttack(
          player,
          enemy,
          {
            isSkillAttack,
            baseMultiplier: actualValue
          }
        );
      
             
         
        if(skillId === "shield-bash") {
          addWeaponMasteryExp(`bulwark`, 2, `shield bash`);
          spawnEffect("shield_bash", enemy.dom.slot);
          //playEnemyAnimation("hit", gameState.world.selectedSlotIndex);
        }
      
        if(skillId === "twin-slash") {
          spawnEffect("double", enemy.dom.slot);
        }
      
        if(skillId === "charge") {
          spawnEffect("charge", enemy.dom.slot);
          enemy.status.stunned = true;
          enemy.status.multiplier = 0.25;
        }
      
        if (skillId === "twin-slash") {
          
          // drugi cios po 250ms
          setTimeout(() => {
           // console.error(`enter timeout double attack`); 
            if (enemy.currentHp > 0 && gameState.world.inCombat) {
              performAttack(
                player,
                enemy,
                {
                  isSkillAttack,
                  baseMultiplier: actualValue
                }
              );
      
              
              //spawnHitEffect("double-attack-right", enemy.dom.slot);

              //dealDamageToEnemy(enemy, actualValue);
              //console.error(`timeout in if double attack`, enemy.currentHp);
            }
          }, 250);
          
        }
      
             
        //dealDamageToEnemy(enemy, actualValue);
        //enemy.currentHp -= actualValue;
        //console.error(`timeout after timeout double attack`, enemy.currentHp);
      
        break;
      
      case "counter-strike":
        durationEffect = getEffectByType(effects, "counter-duration");
        buffDuration = durationEffect
          ? calculateEffectValue(durationEffect, player, enemy)
          : 5;
      
        durationMs = buffDuration * 1000;
  
        const staminaEffect = getEffectByType(effects, "stamina-recover");
        const staminaRecovered = calculateEffectValue(staminaEffect, player, enemy);
       // console.error(`staminaRecovered in useSkill`, staminaRecovered);
        gameState.combat.counterStrike.isActive = true;
        gameState.combat.counterStrike.staminaRecover = staminaRecovered;
        gameState.combat.counterStrike.attackValue = actualValue;
        //gainStamina(staminaRecovered);
      
        setTimeout(() => {
          gameState.combat.counterStrike.isActive = false;
          //updateStatusPlayerUI(enemy);
        }, durationMs);
      
         
        break;
      
      case "bleed":
        const durationTime = getEffectByType(effects, "bleed-duration");
        let bleedDuration = durationTime
          ? calculateEffectValue(durationTime, player, enemy)
          : 5;
   
        const whirlwind = getEffectByType(effects, "whirlwind");
        let whirlwindDmg = whirlwind
          ? calculateEffectValue(whirlwind, player, enemy)
          : 50;
      
        let bleedDamage = actualValue * (1 + player.str * 0.003);
      
        if (skillId === "whirlwind") {
          addWeaponMasteryExp(`berserker`, 3, `whirlwind`);

          bleedDuration = 4;
          //console.log(`start whirlwind`);
          startWhirlwind(
            player,
            enemy,
            bleedDamage,
            bleedDuration,
            whirlwindDmg
          );

          lockActions({ duration: 3000, reason: "skill", allow: ["flee"] });
          
        }
      
        if (skillId !== "whirlwind") {
          applyBleed(enemy, bleedDamage, bleedDuration);
        }
      
        break;
 
      case "attack-speed":
        durationEffect = getEffectByType(effects, "frenzy-duration");
        buffDuration = durationEffect
          ? calculateEffectValue(durationEffect, player, enemy)
          : 5;
      
        durationMs = buffDuration * 1000;
  
        gameState.combat.bloodFrenzy.isActive = true;
        gameState.combat.bloodFrenzy.atkSpdBase = actualValue;
      
        updateStatusPlayerUI(enemy); 
       
        addWeaponMasteryExp(`berserker`, 3, `blood-frenzy`);
      
        spawnEffect("blood_frenzy", player.dom.slot);
      
        setTimeout(() => {
          gameState.combat.bloodFrenzy.isActive = false;
          gameState.combat.bloodFrenzy.atkSpd = 0;
          updateStatusPlayerUI(enemy);
        }, durationMs);
     
        break;
      
      case "hp-cost":
      
        if (player.hp / player.maxHp < 0.35) {
          return;
        }
      
        const hpCost = Math.floor(player.maxHp * actualValue);
        let newHp = Math.max(1, player.hp - hpCost);
      
        updatePlayerHp(newHp);
      
        gameState.combat.bloodPact.isActive = true;
      
        addWeaponMasteryExp(`berserker`, 5, `blood-pact`);
      
        spawnEffect("blood_pact", player.dom.slot);
      
        const bleed = enemy?.bleed;

        if(bleed) {
          for (let i = bleed.stacks.length - 1; i >= 0; i--) {
            bleed.stacks[i].duration += 5;
          }
        }
      
        setTimeout(() => {
          gameState.combat.bloodPact.isActive = false;
           
        }, 5500);
      
        break;
      
      case "armor-break":
        const durationArmorTime = getEffectByType(effects, "slow-duration");
        const armorDuration = durationArmorTime
          ? calculateEffectValue(durationArmorTime, player, enemy)
          : 5;
   
        setTimeout(() => {
          
          let armorBreakPenetration = actualValue * (1 + player.str * 0.002);
           
          let powerBonus = 1;
          if(gameState.char.combatAffixes[`armor_break_effect`]) {
            powerBonus = 1 + (gameState.char.combatAffixes[`armor_break_effect`].value / 100);
          }
          
          applyArmorBreak(enemy, armorBreakPenetration, armorDuration)
          //showReward(`${t("break_defense_reward")} -${((armorBreakPenetration * powerBonus) * 100).toFixed(0)}%`);
  
          }, 450);
      
        break;
      
      case "crit-buff-pact":
      
        gameState.combat.bloodPact.crit = actualValue;
      
        break;
      
      case "crit-buff":
        durationEffect = getEffectByType(effects, "vulnerable-duration");
        buffDuration = durationEffect
          ? calculateEffectValue(durationEffect, player, enemy)
          : 5;
      
        const critDmgBuffEffect = getEffectByType(effects, "crit-dmg-buff");
        const critDmgValue = critDmgBuffEffect
          ? calculateEffectValue(critDmgBuffEffect, player, enemy)
          : 5;
     
        durationMs = buffDuration * 1000;
      
        if(gameState.combat.precision.buffMultiplier > 1) {
          actualValue *= gameState.combat.precision.buffMultiplier;
          critDmgValue *= gameState.combat.precision.buffMultiplier;
      
          addWeaponMasteryExp(`duelist`, 2, `weak-point-buff`);
        } 
  
      
        gameState.combat.weakPoint.isActive = true;
        gameState.combat.weakPoint.crit = actualValue;
        gameState.combat.weakPoint.critDmg = critDmgValue;
      
        updateStatusPlayerUI(enemy);
      
        spawnEffect("weak_point_apply", enemy.dom.slot);
      
        setTimeout(() => {
          gameState.combat.weakPoint.isActive = false;
          updateStatusPlayerUI(enemy);
        }, durationMs);
      
        break;
     
      
      case "heal-convert":
        durationEffect = getEffectByType(effects, "reaver-duration");
        buffDuration = durationEffect
          ? calculateEffectValue(durationEffect, player, enemy)
          : 5;
      
        durationMs = buffDuration * 1000;
  
        gameState.combat.bloodReaver.isActive = true;
        gameState.combat.bloodReaver.heal = actualValue;
      
        updateStatusPlayerUI(enemy);
      
        addWeaponMasteryExp(`berserker`, 3, `blood-reaver`);
      
        spawnEffect("blood_reaver", player.dom.slot);
      
        setTimeout(() => {
          gameState.combat.bloodReaver.isActive = false;
          updateStatusPlayerUI(enemy);
        }, durationMs);
  
      
        break;
      
      case "provocation-trigger":
        const vulnerableBuffEffect = getEffectByType(effects, "vulnerable-duration");
        const vulnerableDuration = vulnerableBuffEffect
          ? calculateEffectValue(vulnerableBuffEffect, player, enemy)
          : 5;
     
        durationMs = vulnerableDuration * 1000;
      
        gameState.combat.provocation.isActive = true;
      
        enemy.isGuarding = false;
        enemy.guardCounter = false;
        enemy.isCharged = false;
        enemy.isCharging = false;
      
        spawnEffect("provocation", player.dom.slot);
      
        performEnemyAttack(enemy, gameState.world.selectedSlotIndex, { multiplier: 1 });
             
        const state = enemy.attackState;
      
        const windupBar = document.getElementById(`enemy-windup-bar-${state.slotIndex}`);
        
        if(windupBar) windupBar.classList.remove(`show`);
      
        state.phase = "cooldown";
        state.remaining = state.baseCooldown;
        updateCooldownBar(enemy, 0, state.slotIndex);

        applyVulnerable(enemy, durationMs);
      
        enemy.intent = null;
      
        updateStatusEnemyUI(enemy);
      
        addWeaponMasteryExp(`bulwark`, 3, `provocation`);
      
        break;
      
      case "control-break":
      
        const interruptPower = 0.9 * enemy.attackState.baseCooldown;
      
        triggerInterrupt(enemy, interruptPower); 
      
        enemy.isCharging = false;
        enemy.isCharged = false;
        enemy.isGuarding = false;
        enemy.guardCounter = false;
        enemy.intent = null;
      
        gameState.combat.flags.windupEnd = true;
        updateStatusEnemyUI(enemy);
   
        addWeaponMasteryExp(`warden`, 6, `control-break`);
      
        spawnEffect("control_break", enemy.dom.slot);
      
        resetSpear(enemy, false);
        //stopSpearControlUI();
       
        break;
      
      case "spear-discipline":
        durationEffect = getEffectByType(effects, "discipline-duration");
        buffDuration = durationEffect
          ? calculateEffectValue(durationEffect, player, enemy)
          : 5;
     
        durationMs = buffDuration * 1000;
  
        gameState.combat.spearDiscipline.isActive = true;
        updateStatusPlayerUI(enemy);
      
        addWeaponMasteryExp(`warden`, 2, `discipline`);

        spawnEffect("spear_discipline_activate", player.dom.slot);
   
        setTimeout(() => {
          gameState.combat.spearDiscipline.isActive = false;
          updateStatusPlayerUI(enemy);
        }, durationMs);
     
      
        break;
      
      case "absolute-control":
        durationEffect = getEffectByType(effects, "absolute-duration");
        buffDuration = durationEffect
          ? calculateEffectValue(durationEffect, player, enemy)
          : 5;
     
        durationMs = buffDuration * 1000;
        const now = getGameTime();

        enemy.spear.expiresAt += durationMs;
        gameState.combat.absoluteControl.isActive = true;
        gameState.combat.absoluteControl.expiresAt = now + durationMs;
      
        addWeaponMasteryExp(`warden`, 5, `absolute-control`);

        spawnEffect("absolute_control_activate", player.dom.slot);
      
        updateStatusPlayerUI(enemy);
      
        break;
      
      case "reduce-cooldown":
        const reduceEffect = getEffectByType(effects, "reduce-shield-cooldown");
        let reduceValue = reduceEffect
          ? calculateEffectValue(reduceEffect, player, enemy)
          : 50;
     
        if(gameState.combat.precision.buffMultiplier > 1) {
          reduceValue *= gameState.combat.precision.buffMultiplier;
          addWeaponMasteryExp(`duelist`, 2, `reduce-shield-cooldown-buff`);
        }
      
        gameState.combat.parryMaster.isActive = true;
        gameState.combat.parryMaster.reduce = actualValue;
        gameState.combat.parryMaster.remainingMs = 4000;
        gameState.combat.parryMaster.shieldReduce = reduceValue;
       // console.log(`parry master start`, gameState.combat.parryMaster.remainingMs);
        
        updateStatusPlayerUI(enemy);
      
        startParryMasterTimer(enemy);
        reduceShieldCooldown(reduceValue);
        addWeaponMasteryExp(`duelist`, 2, `reduce-shield-cooldown`);

        spawnEffect("parry_master_activate", player.dom.slot);
      
        break;
      
      case "precision-buff":
        durationEffect = getEffectByType(effects, "precision-duration");
        buffDuration = durationEffect
          ? calculateEffectValue(durationEffect, player, enemy)
          : 5;
     
        durationMs = buffDuration * 1000;
      
        gameState.combat.precision.buffMultiplier = 1 + (actualValue * stackChain);
      
        //console.log(`precion durationMs, buffMultiplier`, durationMs, gameState.combat.precision.buffMultiplier);
      
        spawnEffect("precision_activate", player.dom.slot);
      
        setTimeout(() => {
          gameState.combat.precision.buffMultiplier = 1;
        }, durationMs);
      
        break;

      case "open-windup":
        if(gameState.combat.precision.buffMultiplier > 1) {
          actualValue *= gameState.combat.precision.buffMultiplier;
          addWeaponMasteryExp(`duelist`, 2, `open-windup`);
        } 
  
        gameState.combat.openingStrike.windUpMultiplier = actualValue;
    
        applyVulnerable(enemy, 2000);
        
        spawnEffect("opening_strike", enemy.dom.slot);
      
        break;
      
      case "spear-control":
   
        extendSpearControl(enemy, 2000, true, actualValue);
      
        addWeaponMasteryExp(`warden`, 2, `piercing-thrust`);
  
      
        if (enemy.attackState?.phase === "cooldown" && skillId === "piercing-thrust") {
          const pushbackEffect = getEffectByType(effects, "pushback");
          let pushback = pushbackEffect
            ? calculateEffectValue(pushbackEffect, player, enemy)
            : 5;
     
          pushback *= enemy.attackState.baseCooldown;
          enemy.attackState.remaining += pushback;
          
          spawnEffect("piercing_thrust", enemy.dom.slot);
        }
  
        if (skillId === "sweep") {
          const windupEffect = getEffectByType(effects, "windup");
          let windup = windupEffect
            ? calculateEffectValue(windupEffect, player, enemy)
            : 5;
          
          durationEffect = getEffectByType(effects, "sweep-duration");
          buffDuration = durationEffect
            ? calculateEffectValue(durationEffect, player, enemy)
            : 5;
     
          durationMs = buffDuration * 1000;

          gameState.combat.sweep.isActive = true;
          //updateStatusPlayerUI(enemy);
          
          windup *= enemy.attackState.windupDuration;
          gameState.combat.sweep.windup = windup;
          
          if (enemy.attackState?.phase === "windup") {
            enemy.attackState.remaining += windup;
          }
          
          applyEnemySlow(enemy, 0.7, durationMs, gameState.world.selectedSlotIndex);
     
          addWeaponMasteryExp(`warden`, 3, `sweep`);
          
          spawnEffect("sweep", enemy.dom.slot);
        }
 
        setTimeout(() => {
          gameState.combat.sweep.isActive = false;
          gameState.combat.sweep.windup = 0;
          //updateStatusPlayerUI(enemy);
        }, durationMs);
      
        break;
      
      case "remove-debuff":
      
        const costEffect = getEffectByType(effects, "blocking-cost");
        let costValue = costEffect
            ? calculateEffectValue(costEffect, player, enemy)
            : 5;
      
        gameState.combat.ironWill.isActive = true;
        gameState.combat.ironWill.cost = costValue;
      
        //updateStatusPlayerUI(enemy);
        showPercentDebuff(`dmg`, 0); 
        setTimeout(() => {
          gameState.combat.ironWill.isActive = false;
          gameState.combat.ironWill.cost = 1;
          //updateStatusPlayerUI(enemy);
          const { attackPenalty: penaltyDmg } = computeShieldPenalties(player.blockPower);
          const minusValue = (0 - 1) + (1 - penaltyDmg);
          showPercentDebuff(`dmg`, minusValue * 100);
        }, 5000);
      
        addWeaponMasteryExp(`bulwark`, 3, `iron-will`);
        
        spawnEffect("iron_will_activate", player.dom.slot);
      
        break;
      
      case "damage-buff": 
        durationEffect = getEffectByType(effects, "shout-duration");
        buffDuration = durationEffect
          ? calculateEffectValue(durationEffect, player, enemy)
          : 5;
      
        if(skillId === `warrior-shout`) {
          playSkill(`warCry`); 
        }
      
        if(skillId === `blood-pact`) {
          buffDuration = 6;
        }
      
        addTemporaryBuff({
          stat: "dmg",
          value: actualValue,
          durationSec: buffDuration,
          source: "skill"
        });
      
        /*const durationMs = buffDuration * 1000;
        isDmgBuffed = true;

        // Zapisz wartość buffa (np. +20% dmg)
        currentBuff.dmg = actualValue;
        updatePlayerDmg(actualValue, true);

        // Zapisz dane w localStorage, aby przetrwały reload strony
        const expiresAt = Date.now() + durationMs;
        localStorage.setItem("dmgBuffExpiresAt", expiresAt);
        localStorage.setItem("dmgBuffValue", actualValue);

        setTimeout(() => {
          removeDmgBuff();
        }, durationMs);*/

        break;
      
      case "buff-next-attack":
        const durationBuffEffect = getEffectByType(effects, "def-buff-duration");
        const lastBastionDuration = durationBuffEffect
          ? calculateEffectValue(durationBuffEffect, player, enemy)
          : 5;
     
        gameState.combat.lastBastion.attackValue = actualValue;
        gameState.combat.lastBastion.isActive = true;
      
        gameState.resources.staminaState.disabled = true;
      
        updateStatusPlayerUI(enemy); 
      
        addWeaponMasteryExp(`bulwark`, 4, `last-bastion`);
      
        spawnEffect("last_bastion_activate", player.dom.slot);
      
        setTimeout(() => {
          gameState.combat.lastBastion.isActive = false;
          gameState.combat.lastBastion.attackValue = 0;
          
          updateStatusPlayerUI(enemy); 
          
          gameState.resources.staminaState.disabled = false;
          //console.log(`end of last bastion`, lastBastionDuration);
        }, lastBastionDuration * 1000);
      
      break;
      
      case "def-buff": 
        durationEffect = getEffectByType(effects, "def-buff-duration");
        buffDuration = durationEffect
          ? calculateEffectValue(durationEffect, player, enemy)
          : 5;
      
        if(skillId === "shield-wall") {
          addWeaponMasteryExp(`bulwark`, 3, `shield wall`);
          const staminaGained = gameState.resources.staminaState.max * 0.2;
          gainStamina(staminaGained);
          
          spawnEffect("shield_wall_activate", player.dom.slot);
        }
      
            
        addTemporaryBuff({
          stat: "def",
          value: actualValue,
          durationSec: buffDuration,
          source: "skill"
        });

        break;
      
      case "slowmo":
        const slowmoDurationEffect = getEffectByType(effects, "slowmo-duration");
        const slowmoDuration = slowmoDurationEffect
          ? calculateEffectValue(slowmoDurationEffect, player, enemy)
          : 5;
       
        const finalSlowmoDuration = slowmoDuration * actualValue * 1000;
      
       // console.error(`finalSlowmoDuration`, finalSlowmoDuration);
        playSkill(`focus`);
        slowMoSkill(actualValue, finalSlowmoDuration);
        break;
      
      case "stun":
        // STUN działa jak pauza wideo:
         //applyEnemyStun(enemy, actualValue, selectedSlotIndex);
        const duration = actualValue * 1000;
            
        applyEnemyStun(enemy, 0.001, duration, gameState.world.selectedSlotIndex);
        break;
      
      case "slow":
        if (!enemy?.status.slow || enemy?.status.slow < actualValue) {
          const durationEffect = getEffectByType(effects, "slow-duration");
          const slowDuration = durationEffect
            ? calculateEffectValue(durationEffect, player, enemy)
            : 5;
          
          setTimeout(() => {
            //console.log("slow duration", slowDuration);
            enemy.status.slow = actualValue;
            enemy.status.slowDuration = slowDuration;

            const multiplier = enemy.status.slow / 100;
            durationMs = slowDuration * 1000;
            
            applyEnemySlow(enemy, multiplier, durationMs, gameState.world.selectedSlotIndex);
          }, 450);
          
          //console.log("slow multiplier", multiplier);
          //applyEnemySlow(enemy, multiplier, durationMs, gameState.world.selectedSlotIndex);
          //applyEnemySkillEffect(enemy, 0.001, durationMs, selectedSlotIndex);
        }
        break;

      /*case "lifeSteal":
        const stolen = Math.floor(player.lastDamageDealt * (actualValue / 100));
        player.hp += stolen;
        break;*/
      
      /*case "haste":
        enemy.status.haste = actualValue; // np. 30%
        const hasteMultiplier = 1 - (actualValue / 100);
        setEnemyAttackSpeed(1 / hasteMultiplier);
        setTimeout(() => setEnemyAttackSpeed(1), (effect.duration || 5) * 1000);
        break;*/
    }

    //console.log(effect.type, "zadano:", actualValue);
  });
    
  if (gameState.world.inCombat) {
    if (!fleeIsSet) setupFleeButton();
    showFleeButton();
  
    /*if (enemy.currentHp <= 0) {
      console.error(`enemy.currentHp <= 0 in useSkill`);
      enemy.currentHp = 0;
      exitCombat();
      hideFleeButton();
      winCombat();
      stopEnemyAttack(selectedSlotIndex); // linia czasu wroga – STOP
    } else {
      //updateEnemyHealthBar(enemy.currentHp, enemy.maxHp, selectedSlotIndex);
    }*/

    updateEnemyHealthBar(enemy, gameState.world.selectedSlotIndex);
  }
  
  if(skillId !== `whirlwind`) {
    lockActions({ duration: 450, reason: "skill", allow: [] });
  }
  
  //saveGame();
  //console.log("skill used");
}

function applyBleed(enemy, damage, duration) {

  if (!enemy.bleed) {
    enemy.bleed = {
      stacks: [],
      tickRate: 1,
      timer: 0
    };
  }

  //addWeaponMasteryExp(`berserker`, 1, `bleed`);
  
  if(gameState.char.combatAffixes[`bleed_damage`]) {
    const value = gameState.char.combatAffixes[`bleed_damage`].value;
    damage *= 1 + (value / 100);
    //console.log(`bleed damage increased`, damage);
  }
  
  const bleedDamage = gameState.combat.finalDamage * damage;

  if(gameState.char.combatAffixes[`bleed_duration`]) {
     duration += gameState.char.combatAffixes[`bleed_duration`].value || 0;
  }
  
  if(gameState.combat.blockingBonus.bleedBonus.isActive && gameState.char.combatAffixes[`bleed_duration_while_blocking`]) {
     duration += gameState.char.combatAffixes[`bleed_duration_while_blocking`].value || 0;
  }
  
  if(gameState.combat.bloodPact.isActive) {
     duration += 5;
  }
  
  
  const newStack = {
    damage: bleedDamage,
    duration: duration
  };

  // Jeśli jest miejsce
  addBleedStack(enemy, { damage: bleedDamage, duration });
  //addBleedStack(enemy, newStack);

  
  if(gameState.char.combatAffixes[`bleed_slow`]) {
    const value = gameState.char.combatAffixes[`bleed_slow`].value;
    const slow = 1 - (value / 100);
    
    const maxDuration = Math.max(
      ...enemy.bleed.stacks.map(stack => stack.duration)
    );
    
    applyEnemySlow(enemy, slow, maxDuration * 1000, gameState.world.selectedSlotIndex);

   // console.log(`enemy slow while bleed, durationMs`, slow, enemy.bleed.duration * 1000);
  }
  
  if(gameState.char.combatAffixes[`crit_while_bleed`]) {
    const critBonus = gameState.char.combatAffixes[`crit_while_bleed`].value;
    gameState.combat.activeBonus.critSources.bleed = critBonus;
    recalculateCritBonus();
  }
  
  
  if(gameState.char.combatAffixes[`bleed_stack_faster`]) {
      const value = gameState.char.combatAffixes[`bleed_stack_faster`].value;
      const bleedStackRoll = Math.random() * 100;

      if(bleedStackRoll < value) {
        //addBleedStack(enemy, newStack, bleedDamage);
        addBleedStack(enemy, { damage: bleedDamage, duration });
        //console.log(`extra bleed stack`, enemy.bleed.stacks);
        //console.log(`bleedStackRoll < value`, bleedStackRoll, value);
      }  
  }
}

function addBleedStack(enemy, newStack) {

  if (enemy.bleed.stacks.length < 5) {
    enemy.bleed.stacks.push(newStack);
    return;
  }

  let weakestIndex = 0;

  for (let i = 1; i < enemy.bleed.stacks.length; i++) {
    if (enemy.bleed.stacks[i].damage < enemy.bleed.stacks[weakestIndex].damage) {
      weakestIndex = i;
    }
  }
  
  if (newStack.damage > enemy.bleed.stacks[weakestIndex].damage) {
    enemy.bleed.stacks[weakestIndex] = newStack;
  }
}

/*function applyBleed(enemy, damage, duration) {
  if (!enemy.bleed) {
    enemy.bleed = {
      stacks: 0,
      damage: 0,
      tickRate: 1,
      timer: 0,
      duration: 0
    };
  }

  const eq = gameState.char?.equipment || {};
  const weapon = eq[`weapon`];
  
 // if (weapon?.baseName !== `axe`){
    // zwiększamy stacki
    enemy.bleed.stacks += 1;
  
    //console.log(`enemy.bleed.stacks adding`, enemy.bleed.stacks);
     
    if(gameState.char.combatAffixes[`bleed_stack_faster`]) {
      const value = gameState.char.combatAffixes[`bleed_stack_faster`].value;
      const bleedStackRoll = Math.random() * 100;

      if(bleedStackRoll < value) {
        enemy.bleed.stacks += 1;
        //console.log(`extra bleed stack`, enemy.bleed.stacks);
        //console.log(`bleedStackRoll < value`, bleedStackRoll, value);
      }  
    }
  
    // opcjonalny cap (ważne dla balansu!)
    enemy.bleed.stacks = Math.min(enemy.bleed.stacks, 3);
 // }
 // console.log(`enemy.bleed.stacks added`, enemy.bleed.stacks);

  if(gameState.char.combatAffixes[`bleed_duration`]) {
     duration += gameState.char.combatAffixes[`bleed_duration`].value || 0;
  }
  
  if(gameState.combat.blockingBonus.bleedBonus.isActive && gameState.char.combatAffixes[`bleed_duration_while_blocking`]) {
     duration += gameState.char.combatAffixes[`bleed_duration_while_blocking`].value || 0;
  }
  
  // odświeżamy duration
  enemy.bleed.duration = Math.max(enemy.bleed.duration, duration);
  
  //console.log(`bleed damage`, damage);

  if(gameState.char.combatAffixes[`bleed_damage`]) {
    const value = gameState.char.combatAffixes[`bleed_damage`].value;
    damage *= 1 + (value / 100);
    //console.log(`bleed damage increased`, damage);
  }
  
  if(gameState.char.combatAffixes[`bleed_slow`]) {
    const value = gameState.char.combatAffixes[`bleed_slow`].value;
    const slow = 1 - (value / 100);
    
    applyEnemySlow(enemy, slow, enemy.bleed.duration * 1000, gameState.world.selectedSlotIndex);

   // console.log(`enemy slow while bleed, durationMs`, slow, enemy.bleed.duration * 1000);
  }

   
  
  //const bleedDamage = gameState.char.baseDamage.weapon * damage;
  const bleedDamage = gameState.combat.finalDamage * damage;
  enemy.bleed.damage = bleedDamage * enemy.bleed.stacks;

  //console.log(`applyBleed bleedDamage, finalDamage`, bleedDamage, gameState.combat.finalDamage);

 // console.log(`BLEED → stacks: ${enemy.bleed.stacks}`);
}*/

function applyArmorBreak(enemy, value, duration) {
  
  //console.log(`armor break duration`, duration);
  
  if(gameState.char.combatAffixes[`armor_break_duration`]) {
    duration += gameState.char.combatAffixes[`armor_break_duration`].value || 0;
    //console.log(`armor break duration bonus`, duration);
  }
 
  //console.log(`armor break power`, value);
  
  if(gameState.char.combatAffixes[`armor_break_effect`]) {
    const powerBonus = gameState.char.combatAffixes[`armor_break_effect`].value || 0;
    
    value *= 1 + (powerBonus / 100);
    //console.log(`armor break power bonus`, value, powerBonus);
  }
 
  if(gameState.char.combatAffixes[`energy_on_armor_break`]) {
    const energyGain = gameState.char.combatAffixes[`energy_on_armor_break`].value;
    
    gainEnergy(energyGain);
    //showReward(`+${(energyGain).toFixed(1)} ${t("to_energy_reward")}`, 2300);
    showEnergyGain(energyGain);
  }

  if(gameState.char.combatAffixes[`def_after_armor_break`]) {
      const gainedDef = gameState.char.combatAffixes[`def_after_armor_break`].value;

      gameState.combat.activeBonus.defSources.armorBreak = gainedDef;
      recalculateDefenseBonus();
  }

  if(gameState.char.combatAffixes[`crit_vs_armor_break`]) {
    const critBonus = gameState.char.combatAffixes[`crit_vs_armor_break`].value;
    
    gameState.combat.activeBonus.critSources.armorBreak = critBonus;
    recalculateCritBonus();
  }

  
  enemy.armorBreak = {
    value,
    duration,
    maxDuration: duration,
  };
  
  //enemy.dom.healthBar.classList.add("armor-break");
  updateStatusEnemyUI(enemy); 
}

function applyEnemyStun(enemy, multiplier, durationMs, slotIndex) {
  //const now = Date.now();
  const now = performance.now();

  const enemySlot = document.getElementById(`enemy-slot-${slotIndex}`);
  //console.log("durationMs STUN", durationMs);
  let isAnotherStun = false;
  
  if (enemy?.status.stunEnd && enemy?.status.stunEnd > now) {
    enemy.status.stunEnd += durationMs;
    isAnotherStun = true;
  } else {
    enemy.status.stunEnd = now + durationMs;
  }
  
  updateStatusEnemyUI(enemy);
  
  if(!enemy.poiseBroken) {
    tryInterruptEnemy(enemy, `stun`);
  }
  
  //enemy.status.stunRemaining = durationMs;
  enemy.status.stunRemaining = enemy.status.stunEnd - now;
  //enemy.status.stunEnd = Date.now() + durationMs;

  if(!isAnotherStun) {
    // 🔑 Zapamiętaj prędkość przed stunem (np. 0.5 jeśli był slow)
    enemy.status.speedBeforeStun = enemy.status.currentSpeedMultiplier ?? 1;
    enemy.status.stun = multiplier * 100;

    // 🔑 Symulacja pauzy – ustaw prędkość praktycznie na 0
    setEnemyAttackSpeed(enemy, multiplier, slotIndex);
  } 
  //stunAnimation(enemySlot, enemy, durationMs);
  playStunVFX(enemy.dom.slot, durationMs);
}

function stunAnimation(enemySlot, enemy, stunMs) {
  if (enemy.animations?.stun && typeof enemy.animations.stun.cancel === "function") {
    enemy.animations.stun.cancel();
  }

  const stunAnim = enemySlot?.animate(
    [
      { filter: "brightness(1)", transform: "scaleX(-1)", offset: 0 },
      { filter: "brightness(1.5) hue-rotate(240deg)", transform: "scaleX(-1)", offset: 0.5 },
      { filter: "brightness(1)", transform: "scaleX(-1)", offset: 1 }
    ],
    { duration: stunMs, iterations: 1, easing: "ease-in-out" }
  );

  enemy.animations = enemy.animations || {};
  enemy.animations.stun = stunAnim;
}

function playStunVFX(enemySlot, duration) {
  const vfx = document.createElement("img");

  const vfxUrl = assetManager.getResolvedAsset(`img/vfx/stun.png`);
  
  vfx.src = vfxUrl;
  vfx.className = "combat-vfx stun-vfx";
  vfx.style.animationDuration = `${duration}ms`;
  
  enemySlot.appendChild(vfx);

  requestAnimationFrame(() => {
    if(playerAttackCooldown.isStunActive) {
      vfx.classList.add("player");
    } else {
      vfx.classList.add("active");
    } 
  });
  
  
  //console.log(`stun animation`);
  
  setTimeout(() => {
    vfx.classList.remove("active");
    vfx.classList.remove("player");
    
    vfx.addEventListener("transitionend", () => {
      vfx.remove();
    }, { once: true });

  }, duration);
}

/*function clearEnemyStun(enemy, slotIndex) {
  enemy.status.stun = 0;
  enemy.status.stunRemaining = 0;
  enemy.status.stunEnd = null;

  resumeEnemyAttack(enemy, slotIndex);

  if (enemy.animations?.stun?.cancel) {
    enemy.animations.stun.cancel();
    enemy.animations.stun = null;
  }

  updateCooldownBar(
    (enemyAttackTimeline.elapsed / enemyAttackTimeline.duration) * 100,
    0,
    slotIndex
  );
}*/

/*function clearEnemyStun(enemy, slotIndex) {
  enemy.status.stun = 0;
  enemy.status.stunRemaining = 0;
  enemy.status.stunEnd = null;

  // 🔑 Przywróć prędkość sprzed stun (np. slow)
  const restoredSpeed = enemy.status.speedBeforeStun ?? 1;
  enemy.status.speedBeforeStun = null;

  setEnemyAttackSpeed(enemy, restoredSpeed, slotIndex);

  if (enemy.animations?.stun?.cancel) {
    enemy.animations.stun.cancel();
    enemy.animations.stun = null;
  }

  const enemySlot = document.getElementById(`enemy-slot-${slotIndex}`);
  if (enemySlot) {
    enemySlot.style.filter = "";
    enemySlot.style.transform = "";
  }
}*/

function clearEnemyStun(enemy, slotIndex) {
  enemy.status.stun = 0;
  enemy.status.stunRemaining = 0;
  enemy.status.stunEnd = null;
  
  enemy.status.stunned = false;
  enemy.status.multiplier = 0;
  
  const restoredSpeed = enemy.status.speedBeforeStun ?? 1;
  enemy.status.speedBeforeStun = null;

  if (enemy.attackState?.phase !== "windup") {
    setEnemyAttackSpeed(enemy, restoredSpeed, slotIndex);
  } else {
    enemy.status.currentSpeedMultiplier = restoredSpeed;
    changeSpeedAnimation(enemy, restoredSpeed);
  }

  updateStatusEnemyUI(enemy);
  
  if (enemy.animations?.stun?.cancel) {
    enemy.animations.stun.cancel();
    enemy.animations.stun = null;
  }

  const enemySlot = document.getElementById(`enemy-slot-${slotIndex}`);
  if (enemySlot) {
    enemySlot.style.filter = "";
    enemySlot.style.transform = "";
  }
}


function applyEnemySlow(enemy, multiplier, durationMs, slotIndex) {
  const enemySlot = document.getElementById(`enemy-slot-${slotIndex}`);

  enemy.status.slow = multiplier * 100;
  enemy.status.slowRemaining = durationMs;
  //enemy.status.slowEnd = Date.now() + durationMs;
  enemy.status.slowEnd = performance.now() + durationMs;
  
  if (enemy.status.stun) {
    enemy.status.speedBeforeStun = multiplier;
  } else {
    setEnemyAttackSpeed(enemy, multiplier, slotIndex);
  }

  updateStatusEnemyUI(enemy);
  
  //slowAnimation(enemySlot, enemy, durationMs);
  playSlowVFX(enemy.dom.slot, durationMs);
}

function slowAnimation(enemySlot, enemy, slowMs) {
  //if (enemy.animations?.slow) enemy.animations.slow.cancel();

  const slowAnim = enemySlot?.animate([
    { filter: "hue-rotate(0deg)", transform: "translateX(0px) scaleX(-1)", offset: 0 },
    { filter: "hue-rotate(200deg)", transform: "translateX(-2px) scaleX(-1)", offset: 0.3 },
    { filter: "hue-rotate(200deg)", transform: "translateX(2px) scaleX(-1)", offset: 0.6 },
    { filter: "hue-rotate(0deg)", transform: "translateX(0px) scaleX(-1)", offset: 1 }
  ], {
    duration: slowMs,
    iterations: Infinity,
    easing: "ease-in-out"
  });

  enemy.animations = enemy.animations || {};
  enemy.animations.slow = slowAnim;
}

function playSlowVFX(enemySlot, duration) {
  const vfx = document.createElement("img");

  const vfxUrl = assetManager.getResolvedAsset(`img/vfx/slow.png`);
  
  vfx.src = vfxUrl;
  vfx.className = "combat-vfx slow-vfx";
  vfx.style.animationDuration = `${duration}ms`;
  
  enemySlot.appendChild(vfx);

  requestAnimationFrame(() => {
    if(playerAttackCooldown.slow.active) {
      vfx.classList.add("player");
    } else {
      vfx.classList.add("active");
    }
  });
  
  //console.log(`stun animation`);
  
  setTimeout(() => {
    vfx.classList.remove("active");
    vfx.classList.remove("player");
    
    vfx.addEventListener("transitionend", () => {
      vfx.remove();
    }, { once: true });

  }, duration);
}


/*function clearEnemySlow(enemy, slotIndex) {
  enemy.status.slow = 0;
  enemy.status.slowRemaining = 0;
  enemy.status.slowEnd = null;

  // Przywróć normalną prędkość TYLKO jeśli nie ma stun
  if (!enemy.status.stun) {
    setEnemyAttackSpeed(enemy, 1, slotIndex);
  }

  if (enemy.animations?.slow?.cancel) {
    enemy.animations.slow.cancel();
    enemy.animations.slow = null;
  }

  const enemySlot = document.getElementById(`enemy-slot-${slotIndex}`);
  if (enemySlot) {
    enemySlot.style.filter = "";
    enemySlot.style.transform = "";
  }
}*/

function clearEnemySlow(enemy, slotIndex) {
  enemy.status.slow = 0;
  enemy.status.slowRemaining = 0;
  enemy.status.slowEnd = null;
  
  if (!enemy.status.stun) {
    if (enemy.attackState?.phase !== "windup") {
      setEnemyAttackSpeed(enemy, 1, slotIndex);
    } else {
      enemy.status.currentSpeedMultiplier = 1;
      changeSpeedAnimation(enemy, 1);
    }
  }

  updateStatusEnemyUI(enemy);
  
  if (enemy.animations?.slow?.cancel) {
    enemy.animations.slow.cancel();
    enemy.animations.slow = null;
  }

  const enemySlot = document.getElementById(`enemy-slot-${slotIndex}`);
  if (enemySlot) {
    enemySlot.style.filter = "";
    enemySlot.style.transform = "";
  }
}