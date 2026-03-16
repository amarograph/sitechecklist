// ============================================
// STORE - Gestion des données (localStorage)
// ============================================

const STORE_KEY = 'sitechecklist_data';

// Codes d'accès par défaut (modifiables dans l'admin)
const DEFAULT_DATA = {
  settings: {
    adminCode: 'admin2024',
    familleCode: 'famille',
    devCode: 'dev123'
  },
  checklists: [
    {
      id: '1',
      title: 'Exemple - Courses',
      category: 'famille',
      items: [
        { text: 'Pain', checked: false },
        { text: 'Lait', checked: false },
        { text: 'Oeufs', checked: true }
      ],
      createdAt: Date.now()
    },
    {
      id: '2',
      title: 'Exemple - Sprint Dev',
      category: 'dev',
      items: [
        { text: 'Fix bug login', checked: false },
        { text: 'Ajouter tests unitaires', checked: false },
        { text: 'Deployer v2', checked: false }
      ],
      createdAt: Date.now()
    }
  ]
};

// Charger les données
function loadData() {
  const raw = localStorage.getItem(STORE_KEY);
  if (!raw) {
    saveData(DEFAULT_DATA);
    return DEFAULT_DATA;
  }
  return JSON.parse(raw);
}

// Sauvegarder les données
function saveData(data) {
  localStorage.setItem(STORE_KEY, JSON.stringify(data));
}

// Générer un ID unique
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// ============================================
// CHECKLISTS
// ============================================

function getChecklists(category = null) {
  const data = loadData();
  if (!category) return data.checklists;
  return data.checklists.filter(c => c.category === category || c.category === 'both');
}

function getChecklist(id) {
  const data = loadData();
  return data.checklists.find(c => c.id === id);
}

function addChecklist(title, category, itemsText) {
  const data = loadData();
  const items = itemsText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(text => ({ text, checked: false }));

  data.checklists.push({
    id: generateId(),
    title,
    category,
    items,
    createdAt: Date.now()
  });

  saveData(data);
}

function updateChecklist(id, title, category, itemsText) {
  const data = loadData();
  const index = data.checklists.findIndex(c => c.id === id);
  if (index === -1) return;

  const oldItems = data.checklists[index].items;
  const newItems = itemsText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(text => {
      const existing = oldItems.find(old => old.text === text);
      return { text, checked: existing ? existing.checked : false };
    });

  data.checklists[index].title = title;
  data.checklists[index].category = category;
  data.checklists[index].items = newItems;

  saveData(data);
}

function deleteChecklist(id) {
  const data = loadData();
  data.checklists = data.checklists.filter(c => c.id !== id);
  saveData(data);
}

function toggleItem(checklistId, itemIndex) {
  const data = loadData();
  const checklist = data.checklists.find(c => c.id === checklistId);
  if (!checklist || !checklist.items[itemIndex]) return;

  checklist.items[itemIndex].checked = !checklist.items[itemIndex].checked;
  saveData(data);
  return checklist;
}

// ============================================
// SETTINGS
// ============================================

function getSettings() {
  const data = loadData();
  return data.settings;
}

function updateSettings(settings) {
  const data = loadData();
  data.settings = { ...data.settings, ...settings };
  saveData(data);
}

function verifyCode(code) {
  const settings = getSettings();
  if (code === settings.adminCode) return 'admin';
  if (code === settings.familleCode) return 'famille';
  if (code === settings.devCode) return 'dev';
  return null;
}

// Session
function setSession(role) {
  sessionStorage.setItem('sitechecklist_role', role);
}

function getSession() {
  return sessionStorage.getItem('sitechecklist_role');
}

function clearSession() {
  sessionStorage.removeItem('sitechecklist_role');
}
