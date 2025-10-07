// Sistema GLUOS - GerÃªncia de Licenciamento de Uso e OcupaÃ§Ã£o do Solo
// IntegraÃ§Ã£o completa com Firebase - VersÃ£o com Firebase Authentication
// ImportaÃ§Ãµes do Firebase v9+
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
import { getDatabase, ref, push, set, get, update, remove, onValue } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js';
import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';

// ConfiguraÃ§Ã£o do Firebase principal
const firebaseConfig = {
  apiKey: "AIzaSyDUUXFPi2qbowPjx63YBYQWyZNXKfxz7u0",
  authDomain: "gluos-apoio.firebaseapp.com",
  databaseURL: "https://gluos-apoio-default-rtdb.firebaseio.com",
  projectId: "gluos-apoio",
  storageBucket: "gluos-apoio.firebasestorage.app",
  messagingSenderId: "200346424322",
  appId: "1:200346424322:web:d359faf0c8582c58c0031b"
};

// ConfiguraÃ§Ã£o da base de processos (NOVA)
const firebaseConfigProcessos = {
  apiKey: "AIzaSyAWbo9MCRjE4776A_DpjJCWHPZap-goJDg",
  authDomain: "processos-gluos.firebaseapp.com",
  databaseURL: "https://processos-gluos-default-rtdb.firebaseio.com",
  projectId: "processos-gluos",
  storageBucket: "processos-gluos.firebasestorage.app",
  messagingSenderId: "189917349181",
  appId: "1:189917349181:web:efac81f4ed118cb48af154"
};

// Inicializar Firebase principal
let app, database, auth;
try {
  app = initializeApp(firebaseConfig);
  database = getDatabase(app);
  auth = getAuth(app);
} catch (error) {
  console.error('Erro ao inicializar Firebase:', error);
}

// Inicializar Firebase de processos (NOVO)
let processosApp, processosDatabase;
try {
  processosApp = initializeApp(firebaseConfigProcessos, 'processosApp');
  processosDatabase = getDatabase(processosApp);
} catch (error) {
  console.error('Erro ao inicializar Firebase de processos:', error);
}

// Mapeamento de usuÃ¡rios para emails
const USER_EMAIL_MAPPING = {
  "Wendel": "wendel_hai@hotmail.com",
  "Eduardo": "edu_rich@hotmail.com",
  "SÃ´nia": "sonia@hotmail.com",
  "JÃºlia": "julia@hotmail.com",
  "Rita": "rita@hotmail.com",
  "Mara": "mara@hotmail.com",
  "Tati": "tati@hotmail.com",
  "Admin": "seplan.gluos@valadares.mg.gov.br"
};

// FunÃ§Ã£o para converter email para nome de usuÃ¡rio
function emailToUsername(email) {
  for (const [username, userEmail] of Object.entries(USER_EMAIL_MAPPING)) {
    if (userEmail === email) {
      return username;
    }
  }
  return email; // Retorna o email se nÃ£o encontrar o mapeamento
}

// Dados da aplicaÃ§Ã£o
const GLUOS_DATA = {
  usuarios: ["Eduardo", "Wendel", "JÃºlia", "Tati", "SÃ´nia", "Rita", "Mara", "Admin"],
  assuntos: [
    {id: 1, texto: "Separar e Preparar os Processos Agendados no Dia"},
    {id: 2, texto: "InserÃ§Ã£o de Avisos de Vistoria na E&L"},
    {id: 3, texto: "Arquivamento de Processos"},
    {id: 4, texto: "SolicitaÃ§Ã£o de Desarquivamento"},
    {id: 5, texto: "Atendimento ao Contribuinte"},
    {id: 6, texto: "PÃ³s Atendimento BalcÃ£o"},
    {id: 7, texto: "Atendimento ao Telefone"},
    {id: 8, texto: "Apoio aos Arquitetos/Engenheiros"},
    {id: 9, texto: "Envio de E-mail para o Arquitetos/Enginheiros"},
    {id: 10, texto: "SolicitaÃ§Ã£o de Desarquivamento de Processo"},
    {id: 11, texto: "LanÃ§amento Habite-se no E&L e na Receita Federal"},
    {id: 12, texto: "LanÃ§amento de AlvarÃ¡ no E&L e na Receita Federal"},
    {id: 13, texto: "LanÃ§amento de SanÃ§Ã£o"},
    {id: 14, texto: "Preenchimento da Planilha de Controle Interno GLUOS"},
    {id: 15, texto: "Controle de Ponto GLUOS"},
    {id: 16, texto: "ConfecÃ§Ã£o de OfÃ­cios"},
    {id: 17, texto: "SolicitaÃ§Ã£o de Materiais de EscritÃ³rio"},
    {id: 18, texto: "Atendimento/NotificaÃ§Ã£o de AlvarÃ¡ de Funcionamento"},
    {id: 19, texto: "ProrrogaÃ§Ã£o de Processo AlvarÃ¡ de Funcionamento"},
    {id: 20, texto: "Indeferimento de Processo AlvarÃ¡ de Funcionamento"},
    {id: 21, texto: "LanÃ§amento do NÃºmero dos Processos Finalizados"},
    {id: 22, texto: "NotificaÃ§Ã£o de AlvarÃ¡ de Funcionamento"},
    {id: 23, texto: "LanÃ§amento de Processos Novos"},
    {id: 24, texto: "Recebimento de Processo"},
    {id: 25, texto: "Rastreamento de Processo"},
    {id: 26, texto: "DistribuiÃ§Ã£o de Processo"},
    {id: 27, texto: "MudanÃ§a de Passo no Sistema"},
    {id: 28, texto: "NotificaÃ§Ã£o Atendidas por E-mail"},
    {id: 29, texto: "SeparaÃ§Ã£o de Processo e DistribuiÃ§Ã£o para Eng/Arq"},
    {id: 30, texto: "LanÃ§amento no Sistema de PendÃªncias pÃ³s Atendimento"},
    {id: 31, texto: "Envio de Processo ao Arquivo Geral/GFO"},
    {id: 32, texto: "Resposta as Mensagens Via WhatsApp Conforme as NotificaÃ§Ãµes no Processo"},
    {id: 33, texto: "Arquivamento de Processos Deferidos Semanal"},
    {id: 34, texto: "DigitaÃ§Ã£o de NotificaÃ§Ãµes"},
    {id: 35, texto: "ConfecÃ§Ã£o de Planilha de Vistoria Semanal"},
    {id: 36, texto: "LocalizaÃ§Ã£o de Processo FÃ­sico e no Sistema"},
    {id: 37, texto: "Encaminhamento de Processo para AnÃ¡lise"},
    {id: 38, texto: "Estudo de Viabilidade UrbanÃ­stica"},
    {id: 39, texto: "Envio de e-mail para Contadores"},
    {id: 40, texto: "AnÃ¡lise de MatrÃ­cula para Sala Mineira"},
    {id: 41, texto: "Indeferimento de Processo"},
    {id: 42, texto: "RequisiÃ§Ã£o de VeÃ­culo"},
    {id: 43, texto: "Encaminhamento de Processo a Outros Setores"},
    {id: 44, texto: "Montagem de Processo Novo"},
    {id: 45, texto: "Encaminhamento para indeferimento"},
    {id: 46, texto: "Protocolo de informaÃ§Ã£o BÃ¡sica"},
    {id: 47, texto: "Agendamento para contribuinte"}
  ]
};

// Estado global
let currentUser = null;
let allEntries = [];
let processCounter = 1;
let selectedSubjectForMultiple = null;
let currentReportType = null;
let firebaseConnected = false;

// InicializaÃ§Ã£o
document.addEventListener('DOMContentLoaded', function() {
  console.log('Sistema GLUOS iniciando...');
  
  // ForÃ§ar recriaÃ§Ã£o do select com JavaScript para garantir funcionalidade
  fixUserSelect();
  initializeFirebase();
  setupEventListeners();
  populateSelectOptions();
  showScreen('login');
  updateDateTime();
  setInterval(updateDateTime, 1000);
  
  console.log('Sistema inicializado com sucesso!');
});

// Corrigir o select de usuÃ¡rio
function fixUserSelect() {
  const userSelect = document.getElementById('user-select');
  if (userSelect) {
    // ForÃ§ar z-index e pointer events
    userSelect.style.zIndex = '1000';
    userSelect.style.pointerEvents = 'auto';
    userSelect.style.position = 'relative';
    
    // Adicionar event listeners diretos
    userSelect.addEventListener('change', function() {
      console.log('UsuÃ¡rio selecionado:', this.value);
    });
    
    userSelect.addEventListener('click', function() {
      console.log('Select clicado');
      this.focus();
    });
    
    // Garantir que estÃ¡ funcional
    userSelect.removeAttribute('disabled');
    userSelect.setAttribute('tabindex', '0');
    
    console.log('Select de usuÃ¡rio corrigido');
  }
}

// InicializaÃ§Ã£o do Firebase
async function initializeFirebase() {
  try {
    updateFirebaseStatus('warning', 'Conectando ao Firebase...');
    
    if (!database || !auth) {
      updateFirebaseStatus('error', 'Firebase nÃ£o inicializado');
      console.error('Database ou Auth nÃ£o inicializado');
      return;
    }
    
    // Verificar conexÃ£o com Firebase
    const testRef = ref(database, '.info/connected');
    onValue(testRef, (snapshot) => {
      firebaseConnected = snapshot.val() === true;
      if (firebaseConnected) {
        updateFirebaseStatus('success', 'Conectado ao Firebase');
        console.log('Firebase conectado com sucesso');
        loadAllEntries();
      } else {
        updateFirebaseStatus('error', 'Desconectado do Firebase');
        console.log('Firebase desconectado');
      }
    });
    
  } catch (error) {
    console.error('Erro ao conectar Firebase:', error);
    updateFirebaseStatus('error', 'Erro de conexÃ£o');
    firebaseConnected = false;
  }
}

// Carregar todas as entradas
async function loadAllEntries() {
  if (!firebaseConnected) return;
  
  try {
    const entriesRef = ref(database, 'gluos_entries');
    onValue(entriesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        allEntries = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        
        // Ordenar por timestamp (mais recente primeiro)
        allEntries.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        console.log(`Carregadas ${allEntries.length} entradas`);
      } else {
        allEntries = [];
        console.log('Nenhuma entrada encontrada');
      }
      updateRecordCount();
    });
  } catch (error) {
    console.error('Erro ao carregar entradas:', error);
    allEntries = [];
  }
}

// Configurar event listeners
function setupEventListeners() {
  // Login - mÃºltiplas abordagens para garantir funcionamento
  const loginForm = document.getElementById('login-form');
  const loginBtn = document.getElementById('login-btn');
  const userSelect = document.getElementById('user-select');
  const passwordInput = document.getElementById('password');
  
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
    console.log('Event listener do form de login adicionado');
  }
  
  if (loginBtn) {
    loginBtn.addEventListener('click', function(e) {
      e.preventDefault();
      handleLogin(e);
    });
    console.log('Event listener do botÃ£o de login adicionado');
  }
  
  // Enter nos campos
  if (passwordInput) {
    passwordInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleLogin(e);
      }
    });
  }
  
  if (userSelect) {
    userSelect.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' && this.value) {
        passwordInput?.focus();
      }
    });
  }
  
  // NavegaÃ§Ã£o principal
  setupMainNavigation();
  
  // Nova entrada
  setupNewEntry();
  
  // MÃºltiplas entradas
  setupMultipleEntries();
  
  // Pesquisa
  setupSearch();
  
  // Base de dados
  setupDatabase();
  
  // RelatÃ³rios
  setupReports();
  
  // Perfil
  setupProfile();
  
  // Modais
  setupModals();
  
  console.log('Todos os event listeners configurados');
}

// Configurar navegaÃ§Ã£o principal
function setupMainNavigation() {
  // Logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
  
  // BotÃµes do dashboard
  const navButtons = [
    { id: 'new-entry-btn', screen: 'new-entry' },
    { id: 'multiple-entries-btn', screen: 'multiple-entries' },
    { id: 'search-btn', screen: 'search' },
    { id: 'database-btn', screen: 'database', callback: loadDatabaseTable },
    { id: 'profile-btn', callback: showProfileModal },
    { id: 'report-btn', screen: 'report' }
  ];
  
  navButtons.forEach(btn => {
    const element = document.getElementById(btn.id);
    if (element) {
      element.addEventListener('click', function() {
        console.log(`BotÃ£o ${btn.id} clicado`);
        if (btn.screen) {
          showScreen(btn.screen);
        }
        if (btn.callback) {
          btn.callback();
        }
      });
    }
  });
  
  // BotÃµes de voltar
  const backButtons = [
    'back-to-dashboard-1', 'back-to-dashboard-2', 'back-to-dashboard-3', 
    'back-to-dashboard-4', 'back-to-dashboard-5'
  ];
  
  backButtons.forEach(btnId => {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.addEventListener('click', () => showScreen('dashboard'));
    }
  });
}

// Login com Firebase Authentication
async function handleLogin(e) {
  e.preventDefault();
  console.log('=== PROCESSANDO LOGIN ===');

  const userSelect = document.getElementById('user-select');
  const passwordInput = document.getElementById('password');
  const loginError = document.getElementById('login-error');
  const loginBtn = document.getElementById('login-btn');

  if (!userSelect || !passwordInput) {
    console.error('Elementos de login nÃ£o encontrados');
    alert('Erro interno: elementos de login nÃ£o encontrados');
    return;
  }

  const user = userSelect.value?.trim();
  const password = passwordInput.value?.trim();

  console.log('Dados do login:', { 
    user, 
    password, 
    userLength: user?.length, 
    passwordLength: password?.length 
  });

  // Limpar erro anterior
  if (loginError) {
    loginError.classList.add('hidden');
    loginError.textContent = '';
  }

  // ValidaÃ§Ã£o
  if (!user) {
    showLoginError('Por favor, selecione um usuÃ¡rio.');
    return;
  }

  if (!password) {
    showLoginError('Por favor, digite sua senha.');
    return;
  }

  // Obter email do usuÃ¡rio
  const userEmail = USER_EMAIL_MAPPING[user];
  if (!userEmail) {
    showLoginError('UsuÃ¡rio nÃ£o encontrado.');
    return;
  }

  // Loading state
  setButtonLoading(loginBtn, true);

  try {
    // AutenticaÃ§Ã£o usando Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, userEmail, password);
    const firebaseUser = userCredential.user;

    // Login bem-sucedido!
    console.log('=== LOGIN BEM-SUCEDIDO ===', { 
      usuario: user, 
      email: firebaseUser.email,
      uid: firebaseUser.uid 
    });
    
    currentUser = user; // Manter o nome do usuÃ¡rio, nÃ£o o email
    updateUserInfo();

    // Limpar formulÃ¡rio
    userSelect.value = '';
    passwordInput.value = '';

    // Ir para dashboard
    showScreen('dashboard');

  } catch (error) {
    // Em caso de erro de autenticaÃ§Ã£o
    console.error('Erro no login:', error);
    
    // Mensagens de erro mais especÃ­ficas
    if (error.code === 'auth/user-not-found') {
      showLoginError('UsuÃ¡rio nÃ£o encontrado no sistema.');
    } else if (error.code === 'auth/wrong-password') {
      showLoginError('Senha incorreta.');
    } else if (error.code === 'auth/invalid-email') {
      showLoginError('Email invÃ¡lido.');
    } else if (error.code === 'auth/too-many-requests') {
      showLoginError('Muitas tentativas. Tente novamente mais tarde.');
    } else {
      showLoginError('UsuÃ¡rio ou senha invÃ¡lidos.');
    }
  } finally {
    setButtonLoading(loginBtn, false);
  }
}

function showLoginError(message) {
  console.log('Erro de login:', message);
  const loginError = document.getElementById('login-error');
  if (loginError) {
    loginError.textContent = message;
    loginError.classList.remove('hidden');
  } else {
    alert(message);
  }
}

function handleLogout() {
  currentUser = null;
  updateUserInfo();
  showScreen('login');
  console.log('Logout realizado');
}

// Nova entrada
function setupNewEntry() {
  const form = document.getElementById('new-entry-form');
  const subjectNumber = document.getElementById('subject-number');
  const subjectSelect = document.getElementById('subject-select');
  const processNumberInput = document.getElementById('process-number');
  const contributorInput = document.getElementById('contributor');
  const ctmInput = document.getElementById('ctm');

  if (form) {
    form.addEventListener('submit', handleNewEntry);
  }

  // Auto-preencher assunto pelo nÃºmero
  if (subjectNumber && subjectSelect) {
    subjectNumber.addEventListener('input', function() {
      const num = parseInt(this.value);
      if (num >= 1 && num <= 47) {
        const assunto = GLUOS_DATA.assuntos.find(a => a.id === num);
        if (assunto) {
          subjectSelect.value = assunto.id;
        }
      }
    });

    // Sincronizar select com nÃºmero
    subjectSelect.addEventListener('change', function() {
      if (this.value) {
        subjectNumber.value = this.value;
      }
    });
  }

  // NOVA FUNCIONALIDADE: Autopreenchimento baseado no nÃºmero do processo
  if(processNumberInput && contributorInput && ctmInput) {
	processNumberInput.addEventListener('input', async function () {
   	let numeroProcesso = this.value.trim();
   	numeroProcesso = numeroProcesso.replace(/\//g, "-"); // <-- sÃ³ aqui!
   	if (!numeroProcesso) {
     		contributorInput.value = '';
      		ctmInput.value = '';
      return;
   }

      try {
        if (processosDatabase) {
          const refProc = ref(processosDatabase, 'processos/' + numeroProcesso);
          const snapshot = await get(refProc);
          if (snapshot.exists()) {
            const dados = snapshot.val();
            contributorInput.value = dados.Requerente || '';
            ctmInput.value = dados.CTM || '';
          } else {
            contributorInput.value = '';
            ctmInput.value = '';
          }
        }
      } catch (err) {
        console.error('Erro ao buscar processo:', err);
        contributorInput.value = '';
        ctmInput.value = '';
      }
    });
  }
}

async function handleNewEntry(e) {
  e.preventDefault();
  console.log('Processando nova entrada...');

  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');

  // Coletar dados do formulÃ¡rio
  const subjectId = parseInt(document.getElementById('subject-select').value);
  const processNumber = document.getElementById('process-number').value.trim();

  if (!subjectId) {
    alert('Por favor, selecione um assunto.');
    return;
  }

  if (!processNumber) {
    alert('Por favor, informe o nÃºmero do processo.');
    return;
  }

  const assunto = GLUOS_DATA.assuntos.find(a => a.id === subjectId);
  const now = new Date();

  const entry = {
    subjectId: subjectId,
    subjectText: assunto ? assunto.texto : '',
    processNumber: processNumber,
    contributor: document.getElementById('contributor').value.trim(),
    ctm: document.getElementById('ctm').value.trim(),
    observation: document.getElementById('observation').value.trim(),
    habiteNumber: document.getElementById('habite-number').value.trim(),
    alvaraSituation: document.getElementById('alvara-situation').value.trim(),
    server: currentUser,
    date: now.toLocaleDateString('pt-BR'),
    time: now.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'}),
    timestamp: now.getTime()
  };

  setButtonLoading(submitBtn, true);

  try {
    // Salvar no Firebase se conectado
    if (firebaseConnected && database) {
      const entriesRef = ref(database, 'gluos_entries');
      await push(entriesRef, entry);
      console.log('Entrada salva no Firebase:', entry);
    } else {
      // Salvar localmente se Firebase nÃ£o estiver disponÃ­vel
      entry.id = 'local_' + Date.now();
      allEntries.unshift(entry);
      console.log('Entrada salva localmente:', entry);
    }

    // Limpar formulÃ¡rio
    form.reset();
    document.getElementById('subject-number').value = '';

    // Mostrar sucesso
    showSuccessModal('Entrada salva com sucesso!');

  } catch (error) {
    console.error('Erro ao salvar entrada:', error);
    alert('Erro ao salvar entrada. Tente novamente.');
  } finally {
    setButtonLoading(submitBtn, false);
  }
}

// MÃºltiplas entradas
function setupMultipleEntries() {
  const setSubjectBtn = document.getElementById('set-subject-btn');
  const addProcessBtn = document.getElementById('add-process-btn');
  const saveAllBtn = document.getElementById('save-all-btn');
  const multiSubjectNumber = document.getElementById('multi-subject-number');
  const multiSubjectSelect = document.getElementById('multi-subject-select');

  if (setSubjectBtn) {
    setSubjectBtn.addEventListener('click', handleSetSubject);
  }

  if (addProcessBtn) {
    addProcessBtn.addEventListener('click', addProcessForm);
  }

  if (saveAllBtn) {
    saveAllBtn.addEventListener('click', handleSaveAllEntries);
  }

  // Auto-preencher assunto pelo nÃºmero
  if (multiSubjectNumber && multiSubjectSelect) {
    multiSubjectNumber.addEventListener('input', function() {
      const num = parseInt(this.value);
      if (num >= 1 && num <= 47) {
        const assunto = GLUOS_DATA.assuntos.find(a => a.id === num);
        if (assunto) {
          multiSubjectSelect.value = assunto.id;
        }
      }
    });

    // Sincronizar select com nÃºmero
    multiSubjectSelect.addEventListener('change', function() {
      if (this.value) {
        multiSubjectNumber.value = this.value;
      }
    });
  }
}

function handleSetSubject() {
  const subjectId = parseInt(document.getElementById('multi-subject-select').value);
  if (!subjectId) {
    alert('Por favor, selecione um assunto.');
    return;
  }

  const assunto = GLUOS_DATA.assuntos.find(a => a.id === subjectId);
  selectedSubjectForMultiple = assunto;

  // Mostrar seÃ§Ã£o de formulÃ¡rios
  const container = document.getElementById('multiple-forms-container');
  const subjectText = document.getElementById('selected-subject-text');

  if (container && subjectText && assunto) {
    subjectText.textContent = assunto.texto;
    container.classList.remove('hidden');

    // Limpar formulÃ¡rios anteriores e adicionar o primeiro
    document.getElementById('processes-container').innerHTML = '';
    processCounter = 1;
    addProcessForm();
  }
}

function addProcessForm() {
    if (!selectedSubjectForMultiple) return;
    
    const container = document.getElementById('processes-container');
    if (!container) return;
    
    const formHtml = `
        <div class="process-form card" data-process="${processCounter}">
            <div class="card__body">
                <div class="process-form-header">
                    <h4>Processo ${processCounter}</h4>
                    <button type="button" class="remove-process-btn" onclick="removeProcessForm(${processCounter})">Remover</button>
                </div>
                
                <div class="form-group">
                    <label class="form-label">NÂº Processo/Protocolo: *</label>
                    <input type="text" class="form-control process-number" placeholder="informe nÃºmero do processo ou protocolo, ou digite 0" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Contribuinte:</label>
                    <input type="text" class="form-control process-contributor" placeholder="Nome do contribuinte">
                </div>
                
                <div class="form-group">
                    <label class="form-label">CTM:</label>
                    <input type="text" class="form-control process-ctm" placeholder="CTM">
                </div>
                
                <div class="form-group">
                    <label class="form-label">ObservaÃ§Ã£o:</label>
                    <textarea class="form-control process-observation" rows="3" placeholder="ObservaÃ§Ãµes"></textarea>
                </div>
                
                <div class="form-group">
                    <label class="form-label">NÃºmero do Habite-se/AlvarÃ¡:</label>
                    <input type="text" class="form-control process-habite" placeholder="NÃºmero do Habite-se/AlvarÃ¡">
                </div>
                
                <div class="form-group">
                    <label class="form-label">SituaÃ§Ã£o do AlvarÃ¡ de Funcionamento:</label>
                    <select class="form-control process-alvara">
                        <option value="">-- Selecione --</option>
                        <option value="Deferido">Deferido</option>
                        <option value="Indeferido">Indeferido</option>
                        <option value="Em AnÃ¡lise">Em AnÃ¡lise</option>
                        <option value="Pendente">Pendente</option>
                    </select>
                </div>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', formHtml);
    processCounter++;
}

window.removeProcessForm = function(processId) {
    const form = document.querySelector(`[data-process="${processId}"]`);
    if (form) {
        form.remove();
    }
};

async function handleSaveAllEntries() {
    if (!selectedSubjectForMultiple) {
        alert('Nenhum assunto selecionado.');
        return;
    }
    
    const processForms = document.querySelectorAll('.process-form');
    if (processForms.length === 0) {
        alert('Nenhum processo adicionado.');
        return;
    }
    
    const saveAllBtn = document.getElementById('save-all-btn');
    setButtonLoading(saveAllBtn, true);
    
    const entries = [];
    const now = new Date();
    const date = now.toLocaleDateString('pt-BR');
    const time = now.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'});
    const timestamp = now.getTime();
    
    // Coletar dados de todos os formulÃ¡rios
    processForms.forEach(form => {
        const processNumber = form.querySelector('.process-number').value.trim();
        
        if (processNumber) { // SÃ³ salvar se tiver nÃºmero do processo
            const entry = {
                subjectId: selectedSubjectForMultiple.id,
                subjectText: selectedSubjectForMultiple.texto,
                processNumber: processNumber,
                contributor: form.querySelector('.process-contributor').value.trim(),
                ctm: form.querySelector('.process-ctm').value.trim(),
                observation: form.querySelector('.process-observation').value.trim(),
                habiteNumber: form.querySelector('.process-habite').value.trim(),
                alvaraSituation: form.querySelector('.process-alvara').value.trim(),
                server: currentUser,
                date: date,
                time: time,
                timestamp: timestamp
            };
            entries.push(entry);
        }
    });
    
    if (entries.length === 0) {
        alert('Por favor, preencha pelo menos um nÃºmero de processo.');
        setButtonLoading(saveAllBtn, false);
        return;
    }
    
    try {
        // Salvar entradas
        if (firebaseConnected && database) {
            const entriesRef = ref(database, 'gluos_entries');
            const promises = entries.map(entry => push(entriesRef, entry));
            await Promise.all(promises);
            console.log(`${entries.length} entradas salvas no Firebase`);
        } else {
            // Salvar localmente
            entries.forEach((entry, index) => {
                entry.id = 'local_' + (Date.now() + index);
                allEntries.unshift(entry);
            });
            console.log(`${entries.length} entradas salvas localmente`);
        }
        
        // Limpar tudo
        selectedSubjectForMultiple = null;
        document.getElementById('multiple-forms-container').classList.add('hidden');
        document.getElementById('multi-subject-number').value = '';
        document.getElementById('multi-subject-select').value = '';
        document.getElementById('processes-container').innerHTML = '';
        processCounter = 1;
        
        showSuccessModal(`${entries.length} entrada(s) salva(s) com sucesso!`);
        
    } catch (error) {
        console.error('Erro ao salvar entradas:', error);
        alert('Erro ao salvar entradas. Tente novamente.');
    } finally {
        setButtonLoading(saveAllBtn, false);
    }
}

// Pesquisa
function setupSearch() {
    // Abas de pesquisa
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            switchSearchTab(tabName);
        });
    });
    
    // BotÃ£o de pesquisar
    const searchBtn = document.getElementById('search-submit');
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }
}

function switchSearchTab(tabName) {
    // Atualizar botÃµes
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');
    
    // Atualizar abas
    document.querySelectorAll('.search-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(tabName + '-search')?.classList.add('active');
}

async function handleSearch() {
    const activeTab = document.querySelector('.search-tab.active');
    if (!activeTab) return;
    
    const searchBtn = document.getElementById('search-submit');
    setButtonLoading(searchBtn, true);
    
    let filteredEntries = [];
    
    try {
        if (activeTab.id === 'process-search') {
            const processNumber = document.getElementById('search-process').value.trim();
            if (!processNumber) {
                alert('Digite o nÃºmero do processo.');
                return;
            }
            filteredEntries = allEntries.filter(entry => 
                entry.processNumber && entry.processNumber.toLowerCase().includes(processNumber.toLowerCase())
            );
        } else if (activeTab.id === 'date-search') {
            const searchDate = document.getElementById('search-date').value;
            if (!searchDate) {
                alert('Selecione uma data.');
                return;
            }
            const targetDate = new Date(searchDate + 'T00:00:00').toLocaleDateString('pt-BR');
            filteredEntries = allEntries.filter(entry => entry.date === targetDate);
        } else if (activeTab.id === 'server-search') {
            const serverName = document.getElementById('search-server').value;
            if (!serverName) {
                alert('Selecione um servidor.');
                return;
            }
            filteredEntries = allEntries.filter(entry => entry.server === serverName);
        }
        
        displaySearchResults(filteredEntries);
        
    } catch (error) {
        console.error('Erro na pesquisa:', error);
        alert('Erro ao pesquisar. Tente novamente.');
    } finally {
        setButtonLoading(searchBtn, false);
    }
}

function displaySearchResults(entries) {
    const resultsContainer = document.getElementById('search-results');
    const tableBody = document.querySelector('#search-table tbody');
    
    if (!resultsContainer || !tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (entries.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center">Nenhum resultado encontrado.</td>
            </tr>
        `;
    } else {
        entries.forEach(entry => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.date || '-'}</td>
                <td>${entry.time || '-'}</td>
                <td>${entry.server || '-'}</td>
                <td>${entry.processNumber || '-'}</td>
                <td title="${entry.subjectText || '-'}">${truncateText(entry.subjectText || '-', 30)}</td>
                <td>${entry.contributor || '-'}</td>
                <td>${entry.ctm || '-'}</td>
                <td title="${entry.observation || '-'}">${truncateText(entry.observation || '-', 40)}</td>
            `;
            tableBody.appendChild(row);
        });
    }
    
    resultsContainer.classList.remove('hidden');
}

// Base de dados
function setupDatabase() {
    const applyBtn = document.getElementById('apply-filters');
    const clearBtn = document.getElementById('clear-filters');
    
    if (applyBtn) {
        applyBtn.addEventListener('click', applyDatabaseFilters);
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', clearDatabaseFilters);
    }
}

function loadDatabaseTable(entries = null) {
    const tableBody = document.querySelector('#database-table tbody');
    const totalRecords = document.getElementById('total-records');
    
    if (!tableBody) return;
    
    const entriesToShow = entries || allEntries;
    
    tableBody.innerHTML = '';
    
    if (totalRecords) {
        totalRecords.textContent = `${entriesToShow.length} registro(s)`;
    }
    
    if (entriesToShow.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center">Nenhum registro encontrado.</td>
            </tr>
        `;
        return;
    }
    
    entriesToShow.forEach(entry => {
        const row = document.createElement('tr');
        
        const canEdit = entry.server === currentUser;
        const actionsHtml = canEdit ? `
            <div class="action-buttons">
                <button class="btn--edit" onclick="editEntry('${entry.id}')">Editar</button>
                <button class="btn--delete" onclick="deleteEntry('${entry.id}')">Excluir</button>
            </div>
        ` : '-';
        
        row.innerHTML = `
            <td>${entry.date || '-'}</td>
            <td>${entry.time || '-'}</td>
            <td>${entry.server || '-'}</td>
            <td>${entry.processNumber || '-'}</td>
            <td title="${entry.subjectText || '-'}">${truncateText(entry.subjectText || '-', 30)}</td>
            <td>${entry.contributor || '-'}</td>
            <td>${entry.ctm || '-'}</td>
            <td title="${entry.observation || '-'}">${truncateText(entry.observation || '-', 40)}</td>
            <td>${actionsHtml}</td>
        `;
        tableBody.appendChild(row);
    });
}

function applyDatabaseFilters() {
    const serverFilter = document.getElementById('filter-server').value;
    const subjectFilter = document.getElementById('filter-subject').value;
    const dateFilter = document.getElementById('filter-date').value;
    
    let filteredEntries = [...allEntries];
    
    if (serverFilter) {
        filteredEntries = filteredEntries.filter(entry => entry.server === serverFilter);
    }
    
    if (subjectFilter) {
        filteredEntries = filteredEntries.filter(entry => entry.subjectId === parseInt(subjectFilter));
    }
    
    if (dateFilter) {
        const targetDate = new Date(dateFilter + 'T00:00:00').toLocaleDateString('pt-BR');
        filteredEntries = filteredEntries.filter(entry => entry.date === targetDate);
    }
    
    loadDatabaseTable(filteredEntries);
}

function clearDatabaseFilters() {
    document.getElementById('filter-server').value = '';
    document.getElementById('filter-subject').value = '';
    document.getElementById('filter-date').value = '';
    loadDatabaseTable();
}

// FunÃ§Ãµes globais para editar/excluir
window.editEntry = function(entryId) {
    const entry = allEntries.find(e => e.id === entryId);
    if (!entry) {
        alert('Entrada nÃ£o encontrada.');
        return;
    }
    
    if (entry.server !== currentUser) {
        alert('VocÃª sÃ³ pode editar suas prÃ³prias entradas.');
        return;
    }
    
    showEditModal(entry);
};

window.deleteEntry = async function(entryId) {
    const entry = allEntries.find(e => e.id === entryId);
    if (!entry) {
        alert('Entrada nÃ£o encontrada.');
        return;
    }
    
    if (entry.server !== currentUser) {
        alert('VocÃª sÃ³ pode excluir suas prÃ³prias entradas.');
        return;
    }
    
    if (!confirm('Tem certeza que deseja excluir esta entrada?')) {
        return;
    }
    
    try {
        if (firebaseConnected && database && !entryId.startsWith('local_')) {
            const entryRef = ref(database, `gluos_entries/${entryId}`);
            await remove(entryRef);
            console.log('Entrada excluÃ­da do Firebase:', entryId);
        } else {
            // Remover localmente
            allEntries = allEntries.filter(e => e.id !== entryId);
            updateRecordCount();
            console.log('Entrada excluÃ­da localmente:', entryId);
        }
        
        showSuccessModal('Entrada excluÃ­da com sucesso!');
        
    } catch (error) {
        console.error('Erro ao excluir entrada:', error);
        alert('Erro ao excluir entrada. Tente novamente.');
    }
};

// RelatÃ³rios
function setupReports() {
    const personalBtn = document.getElementById('personal-report-btn');
    const completeBtn = document.getElementById('complete-report-btn');
    const generateBtn = document.getElementById('generate-report-btn');
    
    if (personalBtn) {
        personalBtn.addEventListener('click', () => {
            currentReportType = 'personal';
            showReportForm('RelatÃ³rio Pessoal');
        });
    }
    
    if (completeBtn) {
        completeBtn.addEventListener('click', () => {
            currentReportType = 'complete';
            showReportForm('RelatÃ³rio Completo');
        });
    }
    
    if (generateBtn) {
        generateBtn.addEventListener('click', handleGenerateReport);
    }
}

function showReportForm(title) {
    const form = document.getElementById('report-form');
    const formTitle = document.getElementById('report-form-title');
    
    if (form && formTitle) {
        formTitle.textContent = title;
        form.classList.remove('hidden');
        
        // Definir datas padrÃ£o (mÃªs atual)
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        
        const startInput = document.getElementById('report-start-date');
        const endInput = document.getElementById('report-end-date');
        
        if (startInput) startInput.value = firstDay.toISOString().split('T')[0];
        if (endInput) endInput.value = today.toISOString().split('T')[0];
    }
}

async function handleGenerateReport() {
    const startDate = document.getElementById('report-start-date').value;
    const endDate = document.getElementById('report-end-date').value;
    
    if (!startDate || !endDate) {
        alert('Selecione as datas inicial e final.');
        return;
    }
    
    if (new Date(startDate) > new Date(endDate)) {
        alert('A data inicial nÃ£o pode ser maior que a data final.');
        return;
    }
    
    const generateBtn = document.getElementById('generate-report-btn');
    setButtonLoading(generateBtn, true);
    
    try {
        if (currentReportType === 'personal') {
            generatePersonalReport(startDate, endDate);
        } else if (currentReportType === 'complete') {
            generateCompleteReport(startDate, endDate);
        }
    } catch (error) {
        console.error('Erro ao gerar relatÃ³rio:', error);
        alert('Erro ao gerar relatÃ³rio. Tente novamente.');
    } finally {
        setButtonLoading(generateBtn, false);
    }
}

function generatePersonalReport(startDate, endDate) {
    // Filtrar entradas do usuÃ¡rio atual no perÃ­odo
    const startTimestamp = new Date(startDate + 'T00:00:00').getTime();
    const endTimestamp = new Date(endDate + 'T23:59:59').getTime();
    
    const userEntries = allEntries.filter(entry => {
        return entry.server === currentUser &&
               entry.timestamp >= startTimestamp &&
               entry.timestamp <= endTimestamp;
    });
    
    // Contar por assunto
    const subjectCount = {};
    userEntries.forEach(entry => {
        if (!subjectCount[entry.subjectId]) {
            subjectCount[entry.subjectId] = {
                id: entry.subjectId,
                text: entry.subjectText,
                count: 0
            };
        }
        subjectCount[entry.subjectId].count++;
    });
    
    const totalEntries = userEntries.length;
    const reportData = Object.values(subjectCount).map(subject => ({
        ...subject,
        percentage: totalEntries > 0 ? ((subject.count / totalEntries) * 100).toFixed(1) : '0.0'
    }));
    
    reportData.sort((a, b) => b.count - a.count);
    
    displayPersonalReport(reportData, totalEntries, startDate, endDate);
}

function displayPersonalReport(reportData, totalEntries, startDate, endDate) {
    // Atualizar cabeÃ§alho
    const reportTitle = document.getElementById('report-title');
    const reportMeta = document.getElementById('report-meta');
    
    if (reportTitle) {
        reportTitle.textContent = 'RelatÃ³rio Pessoal de Produtividade';
    }
    
    if (reportMeta) {
        reportMeta.innerHTML = `
            <p><strong>UsuÃ¡rio:</strong> ${currentUser}</p>
            <p><strong>PerÃ­odo:</strong> ${formatDateBR(startDate)} a ${formatDateBR(endDate)}</p>
            <p><strong>Total de Entradas:</strong> ${totalEntries}</p>
        `;
    }
    
    // Criar tabela
    const tableHead = document.getElementById('report-table-head');
    const tableBody = document.getElementById('report-table-body');
    const tableFoot = document.getElementById('report-table-foot');
    
    if (tableHead) {
        tableHead.innerHTML = `
            <tr>
                <th>Assunto</th>
                <th>Total</th>
                <th>%</th>
            </tr>
        `;
    }
    
    if (tableBody) {
        tableBody.innerHTML = '';
        
        if (reportData.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="3" class="text-center">Nenhum registro encontrado no perÃ­odo.</td>
                </tr>
            `;
        } else {
            reportData.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.text}</td>
                    <td>${item.count}</td>
                    <td>${item.percentage}%</td>
                `;
                tableBody.appendChild(row);
            });
        }
    }
    
    if (tableFoot) {
        tableFoot.innerHTML = `
            <tr>
                <th><strong>TOTAL GERAL</strong></th>
                <th><strong>${totalEntries}</strong></th>
                <th><strong>100%</strong></th>
            </tr>
        `;
    }
    
    // Calcular estatÃ­sticas adicionais
    const summary = document.getElementById('summary-content');
    if (summary && totalEntries > 0) {
        const startTimestamp = new Date(startDate + 'T00:00:00').getTime();
        const endTimestamp = new Date(endDate + 'T23:59:59').getTime();
        
        // Calcular dias com atividade
        const dates = [...new Set(allEntries
            .filter(entry => entry.server === currentUser &&
                           entry.timestamp >= startTimestamp &&
                           entry.timestamp <= endTimestamp)
            .map(entry => entry.date))];
        
        const activeDays = dates.length;
        const avgPerDay = activeDays > 0 ? (totalEntries / activeDays).toFixed(1) : '0.0';
        
        summary.innerHTML = `
            <p><strong>Dias com atividade:</strong> ${activeDays}</p>
            <p><strong>MÃ©dia diÃ¡ria:</strong> ${avgPerDay} entradas/dia</p>
        `;
        
        document.getElementById('report-summary').classList.remove('hidden');
    } else {
        document.getElementById('report-summary').classList.add('hidden');
    }
    
    // Mostrar resultados
    document.getElementById('report-results').classList.remove('hidden');
}

function generateCompleteReport(startDate, endDate) {
    // Filtrar entradas no perÃ­odo
    const startTimestamp = new Date(startDate + 'T00:00:00').getTime();
    const endTimestamp = new Date(endDate + 'T23:59:59').getTime();
    
    const periodEntries = allEntries.filter(entry => {
        return entry.timestamp >= startTimestamp && entry.timestamp <= endTimestamp;
    });
    
    // Criar matriz: [assunto][usuÃ¡rio] = quantidade
    const reportMatrix = {};
    const userTotals = {};
    const subjectTotals = {};
    let grandTotal = 0;
    
    // Inicializar totais
    GLUOS_DATA.usuarios.forEach(user => {
        userTotals[user] = 0;
    });
    
    // Inicializar matriz com todos os assuntos
    GLUOS_DATA.assuntos.forEach(subject => {
        reportMatrix[subject.id] = {
            id: subject.id,
            text: subject.texto,
            users: {}
        };
        subjectTotals[subject.id] = 0;
        
        GLUOS_DATA.usuarios.forEach(user => {
            reportMatrix[subject.id].users[user] = 0;
        });
    });
    
    // Processar entradas
    periodEntries.forEach(entry => {
        const subjectId = entry.subjectId;
        const user = entry.server;
        
        if (reportMatrix[subjectId] && GLUOS_DATA.usuarios.includes(user)) {
            reportMatrix[subjectId].users[user]++;
            subjectTotals[subjectId]++;
            userTotals[user]++;
            grandTotal++;
        }
    });
    
    // Filtrar apenas assuntos com atividade
    const reportData = Object.values(reportMatrix)
        .filter(subject => subjectTotals[subject.id] > 0)
        .map(subject => ({
            ...subject,
            total: subjectTotals[subject.id],
            percentage: grandTotal > 0 ? ((subjectTotals[subject.id] / grandTotal) * 100).toFixed(1) : '0.0'
        }));
    
    reportData.sort((a, b) => b.total - a.total);
    
    displayCompleteReport(reportData, userTotals, grandTotal, startDate, endDate);
}

function displayCompleteReport(reportData, userTotals, grandTotal, startDate, endDate) {
    // Atualizar cabeÃ§alho
    const reportTitle = document.getElementById('report-title');
    const reportMeta = document.getElementById('report-meta');
    
    if (reportTitle) {
        reportTitle.textContent = 'RelatÃ³rio Completo de Produtividade';
    }
    
    if (reportMeta) {
        reportMeta.innerHTML = `
            <p><strong>PerÃ­odo:</strong> ${formatDateBR(startDate)} a ${formatDateBR(endDate)}</p>
            <p><strong>Total de Entradas:</strong> ${grandTotal}</p>
            <p><strong>RelatÃ³rio gerado por:</strong> ${currentUser}</p>
        `;
    }
    
    // Criar cabeÃ§alho da tabela
    const tableHead = document.getElementById('report-table-head');
    if (tableHead) {
        let headerHtml = '<tr><th style="text-align: left; min-width: 300px;">Assunto</th>';
        
        GLUOS_DATA.usuarios.forEach(user => {
            headerHtml += `<th style="text-align: center; min-width: 80px;">${user}</th>`;
        });
        
        headerHtml += '<th style="text-align: center; min-width: 80px;">TOTAL</th><th style="text-align: center; min-width: 60px;">%</th></tr>';
        
        tableHead.innerHTML = headerHtml;
    }
    
    // Preencher corpo da tabela
    const tableBody = document.getElementById('report-table-body');
    if (tableBody) {
        tableBody.innerHTML = '';
        
        if (reportData.length === 0) {
            const colspan = GLUOS_DATA.usuarios.length + 3;
            tableBody.innerHTML = `
                <tr>
                    <td colspan="${colspan}" class="text-center">Nenhum registro encontrado no perÃ­odo.</td>
                </tr>
            `;
        } else {
            reportData.forEach(subject => {
                const row = document.createElement('tr');
                
                let rowHtml = `<td style="text-align: left; max-width: 300px; word-wrap: break-word;">${subject.text}</td>`;
                
                GLUOS_DATA.usuarios.forEach(user => {
                    const count = subject.users[user] || 0;
                    rowHtml += `<td style="text-align: center; ${count > 0 ? 'font-weight: bold;' : ''}">${count}</td>`;
                });
                
                rowHtml += `<td style="text-align: center; font-weight: bold;">${subject.total}</td>`;
                rowHtml += `<td style="text-align: center;">${subject.percentage}%</td>`;
                
                row.innerHTML = rowHtml;
                tableBody.appendChild(row);
            });
        }
    }
    
    // RodapÃ© da tabela (totais)
    const tableFoot = document.getElementById('report-table-foot');
    if (tableFoot) {
        let footerHtml = '<tr style="background: var(--color-bg-6); font-weight: bold;"><th style="text-align: left;">TOTAL GERAL</th>';
        
        GLUOS_DATA.usuarios.forEach(user => {
            footerHtml += `<th style="text-align: center;">${userTotals[user]}</th>`;
        });
        
        footerHtml += `<th style="text-align: center;">${grandTotal}</th>`;
        footerHtml += '<th style="text-align: center;">100%</th></tr>';
        
        tableFoot.innerHTML = footerHtml;
    }
    
    // Aplicar classe especÃ­fica para relatÃ³rio administrativo
    const reportTable = document.getElementById('report-table');
    if (reportTable) {
        reportTable.classList.add('admin-report-table');
    }
    
    // Mostrar resultados
    document.getElementById('report-results').classList.remove('hidden');
    document.getElementById('report-summary').classList.add('hidden');
}

// Perfil
function setupProfile() {
    const passwordForm = document.getElementById('password-change-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', handlePasswordChange);
    }
}

function showProfileModal() {
    const modal = document.getElementById('profile-modal');
    const username = document.getElementById('profile-username');
    
    if (username) username.textContent = currentUser || 'UsuÃ¡rio';
    if (modal) modal.classList.remove('hidden');
}

import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

async function handlePasswordChange(e) {
    e.preventDefault();

    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const errorDiv = document.getElementById('password-error');
    const submitBtn = e.target.querySelector('button[type=\"submit\"]');

    if (errorDiv) errorDiv.classList.add('hidden');

    if (newPassword !== confirmPassword) {
        showPasswordError('As senhas nÃ£o coincidem.');
        return;
    }

    if (newPassword.length < 6) {
        showPasswordError('A nova senha deve ter pelo menos 6 caracteres.');
        return;
    }

    setButtonLoading(submitBtn, true);

    try {
        const user = auth.currentUser;
        if (!user || !user.email) {
            showPasswordError('UsuÃ¡rio nÃ£o autenticado.');
            return;
        }

        // Reautenticar usuÃ¡rio
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);

        await updatePassword(user, newPassword);

        e.target.reset();
        hideProfileModal();
        showSuccessModal('Senha alterada com sucesso!');

        console.log('Senha alterada para:', user.email);

    } catch (error) {
        console.error('Erro ao alterar senha:', error);
        if (error.code === 'auth/wrong-password') {
            showPasswordError('Senha atual incorreta.');
        } else if (error.code === 'auth/weak-password') {
            showPasswordError('A nova senha Ã© muito fraca.');
        } else {
            showPasswordError('Erro ao alterar senha. Tente novamente.');
        }
    } finally {
        setButtonLoading(submitBtn, false);
    }
}


function hideProfileModal() {
    const modal = document.getElementById('profile-modal');
    if (modal) modal.classList.add('hidden');
    
    // Limpar formulÃ¡rio
    const form = document.getElementById('password-change-form');
    if (form) form.reset();
    
    const errorDiv = document.getElementById('password-error');
    if (errorDiv) errorDiv.classList.add('hidden');
}

// Modais
function setupModals() {
    // Fechar modais
    const closeModalBtn = document.getElementById('close-modal');
    const cancelProfileBtn = document.getElementById('cancel-profile');
    const cancelEditBtn = document.getElementById('cancel-edit');
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', hideSuccessModal);
    }
    
    if (cancelProfileBtn) {
        cancelProfileBtn.addEventListener('click', hideProfileModal);
    }
    
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', hideEditModal);
    }
    
    // Fechar ao clicar fora
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.add('hidden');
            }
        });
    });
    
    // Form de ediÃ§Ã£o
    const editForm = document.getElementById('edit-entry-form');
    if (editForm) {
        editForm.addEventListener('submit', handleEditEntry);
    }
}

function showSuccessModal(message) {
    const modal = document.getElementById('success-modal');
    const messageEl = document.getElementById('success-message');
    
    if (messageEl) messageEl.textContent = message;
    if (modal) modal.classList.remove('hidden');
}

function hideSuccessModal() {
    const modal = document.getElementById('success-modal');
    if (modal) modal.classList.add('hidden');
}

function showEditModal(entry) {
    const modal = document.getElementById('edit-modal');
    
    // Preencher campos
    document.getElementById('edit-entry-id').value = entry.id;
    document.getElementById('edit-subject-select').value = entry.subjectId;
    document.getElementById('edit-process-number').value = entry.processNumber || '';
    document.getElementById('edit-contributor').value = entry.contributor || '';
    document.getElementById('edit-ctm').value = entry.ctm || '';
    document.getElementById('edit-observation').value = entry.observation || '';
    document.getElementById('edit-habite-number').value = entry.habiteNumber || '';
    document.getElementById('edit-alvara-situation').value = entry.alvaraSituation || '';
    
    if (modal) modal.classList.remove('hidden');
}

function hideEditModal() {
    const modal = document.getElementById('edit-modal');
    if (modal) modal.classList.add('hidden');
}

async function handleEditEntry(e) {
    e.preventDefault();
    
    const entryId = document.getElementById('edit-entry-id').value;
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    const subjectId = parseInt(document.getElementById('edit-subject-select').value);
    const updatedEntry = {
        subjectId: subjectId,
        subjectText: GLUOS_DATA.assuntos.find(a => a.id === subjectId)?.texto || '',
        processNumber: document.getElementById('edit-process-number').value.trim(),
        contributor: document.getElementById('edit-contributor').value.trim(),
        ctm: document.getElementById('edit-ctm').value.trim(),
        observation: document.getElementById('edit-observation').value.trim(),
        habiteNumber: document.getElementById('edit-habite-number').value.trim(),
        alvaraSituation: document.getElementById('edit-alvara-situation').value.trim()
    };
    
    // ValidaÃ§Ã£o
    if (!updatedEntry.subjectId || !updatedEntry.processNumber) {
        alert('Por favor, preencha o assunto e o nÃºmero do processo.');
        return;
    }
    
    setButtonLoading(submitBtn, true);
    
    try {
        if (firebaseConnected && database && !entryId.startsWith('local_')) {
            const entryRef = ref(database, `gluos_entries/${entryId}`);
            await update(entryRef, updatedEntry);
            console.log('Entrada atualizada no Firebase:', entryId);
        } else {
            // Atualizar localmente
            const entryIndex = allEntries.findIndex(e => e.id === entryId);
            if (entryIndex !== -1) {
                allEntries[entryIndex] = { ...allEntries[entryIndex], ...updatedEntry };
                console.log('Entrada atualizada localmente:', entryId);
            }
        }
        
        hideEditModal();
        showSuccessModal('Entrada atualizada com sucesso!');
        
    } catch (error) {
        console.error('Erro ao atualizar entrada:', error);
        alert('Erro ao atualizar entrada. Tente novamente.');
    } finally {
        setButtonLoading(submitBtn, false);
    }
}

// UtilitÃ¡rios
function populateSelectOptions() {
    // Assuntos
    const subjectSelects = [
        'subject-select',
        'multi-subject-select',
        'edit-subject-select',
        'filter-subject'
    ];
    
    subjectSelects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            // Limpar opÃ§Ãµes existentes (exceto a primeira)
            while (select.children.length > 1) {
                select.removeChild(select.lastChild);
            }
            
            // Adicionar assuntos
            GLUOS_DATA.assuntos.forEach(assunto => {
                const option = document.createElement('option');
                option.value = assunto.id;
                option.textContent = `${assunto.id} - ${assunto.texto}`;
                select.appendChild(option);
            });
        }
    });
    
    // Servidores
    const serverSelects = [
        'search-server',
        'filter-server'
    ];
    
    serverSelects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            // Limpar opÃ§Ãµes existentes (exceto a primeira)
            while (select.children.length > 1) {
                select.removeChild(select.lastChild);
            }
            
            // Adicionar usuÃ¡rios
            GLUOS_DATA.usuarios.forEach(user => {
                const option = document.createElement('option');
                option.value = user;
                option.textContent = user;
                select.appendChild(option);
            });
        }
    });
}

function showScreen(screenName) {
    console.log(`Mudando para tela: ${screenName}`);
    
    // Ocultar todas as telas
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Mostrar tela alvo
    const targetScreen = document.getElementById(screenName + '-screen');
    if (targetScreen) {
        targetScreen.classList.add('active');
        
        // Esconder formulÃ¡rio de relatÃ³rio ao voltar para tela de relatÃ³rios
        if (screenName === 'report') {
            const reportForm = document.getElementById('report-form');
            const reportResults = document.getElementById('report-results');
            
            if (reportForm) reportForm.classList.add('hidden');
            if (reportResults) reportResults.classList.add('hidden');
            
            currentReportType = null;
        }
    } else {
        console.error('Tela nÃ£o encontrada:', screenName + '-screen');
    }
}

function updateUserInfo() {
    const userInfo = document.getElementById('user-info');
    if (userInfo) {
        userInfo.textContent = currentUser ? `UsuÃ¡rio: ${currentUser}` : 'Bem-vindo!';
    }
}

function updateDateTime() {
    const now = new Date();
    const dateTimeString = now.toLocaleString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const datetimeInfo = document.getElementById('datetime-info');
    if (datetimeInfo) {
        datetimeInfo.textContent = dateTimeString;
    }
}

function updateFirebaseStatus(status, message) {
    const indicator = document.getElementById('firebase-indicator');
    const statusText = document.getElementById('firebase-status-text');
    
    if (indicator && statusText) {
        indicator.className = `status-indicator status-indicator--${status}`;
        statusText.textContent = message;
    }
    
    const syncIndicator = document.getElementById('sync-indicator');
    const syncText = document.getElementById('sync-status-text');
    
    if (syncIndicator && syncText) {
        syncIndicator.className = `status-indicator status-indicator--${status}`;
        syncText.textContent = status === 'success' ? 'Sincronizado' : 'Offline';
    }
}

function updateRecordCount() {
    const totalRecords = document.getElementById('total-records');
    if (totalRecords) {
        totalRecords.textContent = `${allEntries.length} registro(s)`;
    }
}

function formatDateBR(dateString) {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR');
}

function truncateText(text, maxLength) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function setButtonLoading(button, loading) {
    if (!button) return;
    
    if (loading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

// NOTA: Este arquivo contÃ©m apenas as principais modificaÃ§Ãµes.
// Para o arquivo completo, vocÃª deve copiar todo o conteÃºdo do arquivo original
// e substituir apenas as funÃ§Ãµes modificadas acima.