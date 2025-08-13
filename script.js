// ===== Helper =====
const $ = (s) => document.querySelector(s);

// ===== Elements =====
const todayEl     = $("#today");
const quoteEl     = $("#quote");
const getQuoteBtn = $("#getQuoteBtn");
const entryEl     = $("#entry");
const saveBtn     = $("#saveBtn");
const clearBtn    = $("#clearBtn");
const xpTotalEl   = $("#xpTotal");
const levelEl     = $("#level");
const xpBarEl     = $("#xpBar");
const historyList = $("#historyList");
const viewAllBtn  = $("#viewAllBtn");

// ===== Constants =====
const STORAGE_KEYS = {
  ENTRIES: "hero_journal_entries",
  XP: "hero_journal_xp"
};
const QUOTES = [
  "One quest at a time. That's how legends rise.",
  "You're not behind. You're loading.",
  "Tiny progress daily > massive progress someday.",
  "Focus beats motivation. Do the rep.",
  "Write code. Write history.",
  "The obstacle is the training."
];

// ===== Date header =====
const today = new Date();
todayEl.textContent = today.toLocaleDateString(undefined, {
  weekday: "long", year: "numeric", month: "long", day: "numeric"
});

// ===== Storage Helpers =====
function loadEntries(){
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.ENTRIES)) || []; }
  catch { return []; }
}
function saveEntries(arr){
  localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(arr));
}
function loadXP(){
  return Number(localStorage.getItem(STORAGE_KEYS.XP) || 0);
}
function saveXP(xp){
  localStorage.setItem(STORAGE_KEYS.XP, String(xp));
}

// ===== XP & Level =====
function levelFromXP(xp){ return Math.floor(xp / 100) + 1; }
function updateXPUI(){
  const xp = loadXP();
  const level = levelFromXP(xp);
  xpTotalEl.textContent = xp;
  levelEl.textContent = level;
  xpBarEl.style.width = `${(xp % 100)}%`;
}

// ===== History UI =====
function renderHistory(){
  const entries = loadEntries().sort((a,b)=> b.createdAt - a.createdAt);
  historyList.innerHTML = "";
  entries.slice(0,3).forEach(e=>{
    const li = document.createElement("li");
    const d = new Date(e.createdAt).toLocaleString();
    const preview = e.text.length > 120 ? e.text.slice(0,120) + "…" : e.text;
    li.innerHTML = `<time>${d}</time><div>${preview.replace(/\n/g,"<br>")}</div><small>XP gained: +${e.xpGained || 0}</small>`;
    historyList.appendChild(li);
  });
}

// ===== Events =====
getQuoteBtn.addEventListener("click", ()=>{
  const i = Math.floor(Math.random() * QUOTES.length);
  quoteEl.textContent = QUOTES[i];
});

clearBtn.addEventListener("click", ()=>{
  entryEl.value = "";
  entryEl.focus();
});

saveBtn.addEventListener("click", ()=>{
  const text = entryEl.value.trim();
  if(!text){
    alert("Write something first!");
    entryEl.focus();
    return;
  }
  // Save entry
  const entries = loadEntries();
  const payload = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    createdAt: Date.now(),
    text,
    quote: quoteEl.textContent,
    xpGained: 10
  };
  entries.push(payload);
  saveEntries(entries);

  // Add XP
  const newXP = loadXP() + payload.xpGained;
  saveXP(newXP);

  // Update UI
  entryEl.value = "";
  updateXPUI();
  renderHistory();
  alert("Entry saved! +10 XP");
});

viewAllBtn.addEventListener("click", ()=>{
  const entries = loadEntries().sort((a,b)=> b.createdAt - a.createdAt);
  console.table(entries.map(e => ({
    date: new Date(e.createdAt).toLocaleString(),
    text: e.text,
    quote: e.quote,
    xp: e.xpGained
  })));
  alert("Opened all entries in Console (press F12 → Console).");
});

// ===== Init =====
updateXPUI();
renderHistory();
