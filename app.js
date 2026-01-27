/**
 * =====================================================
 * NIHONGOAPP - Aplicación Principal
 * Aprende Japonés Completo
 * =====================================================
 * 
 * Esta aplicación permite aprender japonés con:
 * - Silabarios completos (Hiragana/Katakana)
 * - Vocabulario (Español-Japonés)
 * - Fechas y números
 * - Gramática JLPT N5-N1
 * - Tarjetas interactivas con efecto flip
 * - Diseño inspirado en templos japoneses
 */

'use strict';

// =====================================================
// CLASE PRINCIPAL DE LA APLICACIÓN
// =====================================================
class NihongoApp {
    constructor() {
        // Estado de la aplicación
        this.state = {
            currentCategory: 'silabario',
            currentScreen: 'main-menu',
            currentIndex: 0,
            isFlipped: false,
            score: 0,
            attempts: 0,
            currentData: [],
            gameMode: null,
            gameTrack: null
        };

        // Referencias al DOM
        this.elements = {
            contentArea: document.getElementById('content-area'),
            toast: document.getElementById('toast'),
            progressText: document.getElementById('progress-text'),
            progressContainer: document.getElementById('progress-container'),
            wordContext: document.getElementById('word-context'),
            cardsContainer: document.getElementById('cards-container'),
            btnPrev: document.getElementById('btn-prev'),
            btnNext: document.getElementById('btn-next'),
            btnFlip: document.getElementById('btn-flip'),
            btnResetHeader: document.getElementById('btn-reset-header')
        };

        // Inicializar
        this.init();
    }

    /**
     * Inicializa la aplicación
     */
    init() {
        this.setupEventListeners();
        this.showScreen('main-menu');
        this.showToast('🎌 ¡Bienvenido a NihongoApp! 🎌', 3000);
    }

    /**
     * Configura los event listeners
     */
    setupEventListeners() {
        // Event listeners para botones y controles
        if (this.elements.btnPrev) {
            this.elements.btnPrev.addEventListener('click', () => this.previousCard());
        }
        if (this.elements.btnNext) {
            this.elements.btnNext.addEventListener('click', () => this.nextCard());
        }
        if (this.elements.btnFlip) {
            this.elements.btnFlip.addEventListener('click', () => this.flipCard());
        }
        if (this.elements.btnResetHeader) {
            this.elements.btnResetHeader.addEventListener('click', () => this.resetToMainMenu());
        }
    }

    /**
     * Muestra un submenú específico
     */
    showSubmenu(submenu) {
        this.hideAllScreens();
        const screenId = `submenu-${submenu}`;
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.classList.add('active');
            this.state.currentScreen = screenId;
        }
    }

    /**
     * Reinicia al menú principal
     */
    resetToMainMenu() {
        this.hideAllScreens();
        document.getElementById('main-menu').classList.add('active');
        this.state.currentScreen = 'main-menu';
        this.state.currentIndex = 0;
        this.state.isFlipped = false;
        this.state.currentData = [];
        
        // Ocultar controles de juego
        if (this.elements.progressContainer) {
            this.elements.progressContainer.style.display = 'none';
        }
        if (this.elements.btnResetHeader) {
            this.elements.btnResetHeader.style.display = 'none';
        }
    }
            }
        });
    }

    /**
     * Oculta todas las pantallas
     */
    hideAllScreens() {
        document.querySelectorAll('.content-screen, .selection-screen, .game-screen').forEach(screen => {
            screen.classList.remove('active');
        });
    }

    /**
     * Muestra una pantalla específica
     */
    showScreen(screenId) {
        this.hideAllScreens();

        // Mostrar la pantalla solicitada
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.state.currentScreen = screenId;
        }
    }

    /**
     * Inicia el juego
     */
    startGame(mode, track) {
        this.state.gameMode = mode;
        this.state.gameTrack = track;
        this.state.currentIndex = 0;
        this.state.isFlipped = false;

        // Cargar datos según el track
        this.loadGameData(track);
        
        // Cambiar a pantalla de juego
        this.showScreen('game-screen');
        this.loadCurrentCard();
    }

    /**
     * Carga los datos del juego
     */
    loadGameData(track) {
        switch(track) {
            case 'basic':
                this.state.currentData = this.generateSilabarioData();
                break;
            case 'vocab-es':
                this.state.currentData = this.generateVocabularyData();
                break;
            case 'nums-normal':
                this.state.currentData = this.generateNumbersData();
                break;
            case 'dates-days':
                this.state.currentData = this.generateDatesData();
                break;
            default:
                this.state.currentData = [];
        }
    }

    /**
     * Genera datos de silabario
     */
    generateSilabarioData() {
        const basicSyllables = [
            { romaji: 'a', hira: 'あ', kata: 'ア' },
            { romaji: 'i', hira: 'い', kata: 'イ' },
            { romaji: 'u', hira: 'う', kata: 'ウ' },
            { romaji: 'e', hira: 'え', kata: 'エ' },
            { romaji: 'o', hira: 'お', kata: 'オ' },
            { romaji: 'ka', hira: 'か', kata: 'カ' },
            { romaji: 'ki', hira: 'き', kata: 'キ' },
            { romaji: 'ku', hira: 'く', kata: 'ク' },
            { romaji: 'ke', hira: 'け', kata: 'ケ' },
            { romaji: 'ko', hira: 'こ', kata: 'コ' },
            { romaji: 'sa', hira: 'さ', kata: 'サ' },
            { romaji: 'shi', hira: 'し', kata: 'シ' },
            { romaji: 'su', hira: 'す', kata: 'ス' },
            { romaji: 'se', hira: 'せ', kata: 'セ' },
            { romaji: 'so', hira: 'そ', kata: 'ソ' },
            { romaji: 'ta', hira: 'た', kata: 'タ' },
            { romaji: 'chi', hira: 'ち', kata: 'チ' },
            { romaji: 'tsu', hira: 'つ', kata: 'ツ' },
            { romaji: 'te', hira: 'て', kata: 'テ' },
            { romaji: 'to', hira: 'と', kata: 'ト' },
            { romaji: 'na', hira: 'な', kata: 'ナ' },
            { romaji: 'ni', hira: 'に', kata: 'ニ' },
            { romaji: 'nu', hira: 'ぬ', kata: 'ヌ' },
            { romaji: 'ne', hira: 'ね', kata: 'ネ' },
            { romaji: 'no', hira: 'の', kata: 'ノ' },
            { romaji: 'ha', hira: 'は', kata: 'ハ' },
            { romaji: 'hi', hira: 'ひ', kata: 'ヒ' },
            { romaji: 'fu', hira: 'ふ', kata: 'フ' },
            { romaji: 'he', hira: 'へ', kata: 'ヘ' },
            { romaji: 'ho', hira: 'ほ', kata: 'ホ' },
            { romaji: 'ma', hira: 'ま', kata: 'マ' },
            { romaji: 'mi', hira: 'み', kata: 'ミ' },
            { romaji: 'mu', hira: 'む', kata: 'ム' },
            { romaji: 'me', hira: 'め', kata: 'メ' },
            { romaji: 'mo', hira: 'も', kata: 'モ' },
            { romaji: 'ya', hira: 'や', kata: 'ヤ' },
            { romaji: 'yu', hira: 'ゆ', kata: 'ユ' },
            { romaji: 'yo', hira: 'よ', kata: 'ヨ' },
            { romaji: 'ra', hira: 'ら', kata: 'ラ' },
            { romaji: 'ri', hira: 'り', kata: 'リ' },
            { romaji: 'ru', hira: 'る', kata: 'ル' },
            { romaji: 're', hira: 'れ', kata: 'レ' },
            { romaji: 'ro', hira: 'ろ', kata: 'ロ' },
            { romaji: 'wa', hira: 'わ', kata: 'ワ' },
            { romaji: 'wo', hira: 'を', kata: 'ヲ' },
            { romaji: 'n', hira: 'ん', kata: 'ン' }
        ];

        return basicSyllables.map(syllable => ({
            ...syllable,
            displayMode: 'single'
        }));
    }

    /**
     * Genera datos de vocabulario básico
     */
    generateVocabularyData() {
        const vocabulary = [
            { word: 'hola', hira: 'こんにちは', kata: 'コンニチハ', romaji: 'konnichiwa' },
            { word: 'adiós', hira: 'さようなら', kata: 'サヨウナラ', romaji: 'sayounara' },
            { word: 'gracias', hira: 'ありがとう', kata: 'アリガトウ', romaji: 'arigatou' },
            { word: 'por favor', hira: 'お願いします', kata: 'オネガイシマス', romaji: 'onegaishimasu' },
            { word: 'disculpa', hira: 'すみません', kata: 'スミマセン', romaji: 'sumimasen' },
            { word: 'sí', hira: 'はい', kata: 'ハイ', romaji: 'hai' },
            { word: 'no', hira: 'いいえ', kata: 'イイエ', romaji: 'iie' },
            { word: 'agua', hira: '水', kata: 'ミズ', romaji: 'mizu' },
            { word: 'comida', hira: '食べ物', kata: 'タベモノ', romaji: 'tabemono' },
            { word: 'casa', hira: '家', kata: 'イエ', romaji: 'ie' },
            { word: 'escuela', hira: '学校', kata: 'ガッコウ', romaji: 'gakkou' },
            { word: 'amigo', hira: '友達', kata: 'トモダチ', romaji: 'tomodachi' },
            { word: 'familia', hira: '家族', kata: 'カゾク', romaji: 'kazoku' },
            { word: 'trabajo', hira: '仕事', kata: 'シゴト', romaji: 'shigoto' },
            { word: 'dinero', hira: 'お金', kata: 'オカネ', romaji: 'okane' },
            { word: 'tiempo', hira: '時間', kata: 'ジカン', romaji: 'jikan' },
            { word: 'día', hira: '日', kata: 'ヒ', romaji: 'hi' },
            { word: 'noche', hira: '夜', kata: 'ヨル', romaji: 'yoru' },
            { word: 'mañana', hira: '朝', kata: 'アサ', romaji: 'asa' },
            { word: 'tarde', hira: '午後', kata: 'ゴゴ', romaji: 'gogo' }
        ];

        return vocabulary.map(item => ({
            ...item,
            displayMode: 'whole'
        }));
    }

    /**
     * Genera datos de números
     */
    generateNumbersData() {
        const numbers = [
            { number: 0, kanji: '零', hira: 'れい', kata: 'レイ', romaji: 'rei' },
            { number: 1, kanji: '一', hira: 'いち', kata: 'イチ', romaji: 'ichi' },
            { number: 2, kanji: '二', hira: 'に', kata: 'ニ', romaji: 'ni' },
            { number: 3, kanji: '三', hira: 'さん', kata: 'サン', romaji: 'san' },
            { number: 4, kanji: '四', hira: 'よん', kata: 'ヨン', romaji: 'yon' },
            { number: 5, kanji: '五', hira: 'ご', kata: 'ゴ', romaji: 'go' },
            { number: 6, kanji: '六', hira: 'ろく', kata: 'ロク', romaji: 'roku' },
            { number: 7, kanji: '七', hira: 'なな', kata: 'ナナ', romaji: 'nana' },
            { number: 8, kanji: '八', hira: 'はち', kata: 'ハチ', romaji: 'hachi' },
            { number: 9, kanji: '九', hira: 'きゅう', kata: 'キュウ', romaji: 'kyuu' },
            { number: 10, kanji: '十', hira: 'じゅう', kata: 'ジュウ', romaji: 'juu' },
            { number: 100, kanji: '百', hira: 'ひゃく', kata: 'ヒャク', romaji: 'hyaku' },
            { number: 1000, kanji: '千', hira: 'せん', kata: 'セン', romaji: 'sen' },
            { number: 10000, kanji: '万', hira: 'まん', kata: 'マン', romaji: 'man' }
        ];

        return numbers.map(item => ({
            ...item,
            displayMode: 'number'
        }));
    }

    /**
     * Genera datos de fechas
     */
    generateDatesData() {
        const dates = [
            { type: 'día', spanish: 'lunes', kanji: '月曜日', hira: 'げつようび', romaji: 'getsuyoubi' },
            { type: 'día', spanish: 'martes', kanji: '火曜日', hira: 'かようび', romaji: 'kayoubi' },
            { type: 'día', spanish: 'miércoles', kanji: '水曜日', hira: 'すいようび', romaji: 'suiyoubi' },
            { type: 'día', spanish: 'jueves', kanji: '木曜日', hira: 'もくようび', romaji: 'mokuyoubi' },
            { type: 'día', spanish: 'viernes', kanji: '金曜日', hira: 'きんようび', romaji: 'kinyoubi' },
            { type: 'día', spanish: 'sábado', kanji: '土曜日', hira: 'どようび', romaji: 'doyoubi' },
            { type: 'día', spanish: 'domingo', kanji: '日曜日', hira: 'にちようび', romaji: 'nichiyoubi' },
            { type: 'mes', spanish: 'enero', kanji: '一月', hira: 'いちがつ', romaji: 'ichigatsu' },
            { type: 'mes', spanish: 'febrero', kanji: '二月', hira: 'にがつ', romaji: 'nigatsu' },
            { type: 'mes', spanish: 'marzo', kanji: '三月', hira: 'さんがつ', romaji: 'sangatsu' },
            { type: 'mes', spanish: 'abril', kanji: '四月', hira: 'しがつ', romaji: 'shigatsu' },
            { type: 'mes', spanish: 'mayo', kanji: '五月', hira: 'ごがつ', romaji: 'gogatsu' }
        ];

        return dates.map(item => ({
            ...item,
            displayMode: 'date'
        }));
    }

    /**
     * Carga la tarjeta actual
     */
    loadCurrentCard() {
        if (this.state.currentData.length === 0) return;

        const currentData = this.state.currentData[this.state.currentIndex];
        
        // Actualizar barra de progreso
        this.updateProgressBar();
        
        // Actualizar contexto
        this.updateWordContext(currentData);
        
        // Generar tarjetas
        this.generateCards(currentData);
        
        // Actualizar botones
        this.updateControlButtons();
    }

    /**
     * Actualiza la barra de progreso
     */
    updateProgressBar() {
        const current = this.state.currentIndex + 1;
        const total = this.state.currentData.length;
        if (this.elements.progressText) {
            this.elements.progressText.textContent = `${current} / ${total}`;
        }
    }

    /**
     * Actualiza el contexto de la palabra
     */
    updateWordContext(data) {
        if (!this.elements.wordContext) return;

        let contextText = '';
        switch(data.displayMode) {
            case 'single':
                contextText = `Silabario: ${data.romaji}`;
                break;
            case 'whole':
                contextText = `"${data.word}"`;
                break;
            case 'number':
                contextText = `Número: ${data.number}`;
                break;
            case 'date':
                contextText = `${data.type === 'día' ? 'Día' : 'Mes'}: ${data.spanish}`;
                break;
        }
        
        this.elements.wordContext.textContent = contextText;
    }

    /**
     * Genera las tarjetas para el dato actual
     */
    generateCards(data) {
        if (!this.elements.cardsContainer) return;

        this.elements.cardsContainer.innerHTML = '';

        switch(data.displayMode) {
            case 'single':
                this.createSingleCard(data);
                break;
            case 'whole':
                this.createWholeCard(data);
                break;
            case 'number':
                this.createNumberCard(data);
                break;
            case 'date':
                this.createDateCard(data);
                break;
        }
    }

    /**
     * Crea una tarjeta simple (silabario)
     */
    createSingleCard(data) {
        const card = document.createElement('div');
        card.className = 'flashcard';
        
        const frontText = this.state.gameMode === 'hira' ? data.hira : data.kata;
        const backText = data.romaji;
        
        card.innerHTML = `
            <div class="card-face card-front">
                <div class="card-content">${frontText}</div>
            </div>
            <div class="card-face card-back">
                <div class="card-content">${backText}</div>
            </div>
        `;
        
        card.addEventListener('click', () => this.flipCard(card));
        this.elements.cardsContainer.appendChild(card);
    }

    /**
     * Crea una tarjeta completa (vocabulario)
     */
    createWholeCard(data) {
        const card = document.createElement('div');
        card.className = 'flashcard large';
        
        card.innerHTML = `
            <div class="card-face card-front">
                <div class="card-content">
                    <div class="japanese-text">
                        <div class="kanji">${data.word}</div>
                        <div class="kana">${this.state.gameMode === 'hira' ? data.hira : data.kata}</div>
                    </div>
                </div>
            </div>
            <div class="card-face card-back">
                <div class="card-content">
                    <div class="spanish-text">${data.word}</div>
                    <div class="romaji-text">${data.romaji}</div>
                </div>
            </div>
        `;
        
        card.addEventListener('click', () => this.flipCard(card));
        this.elements.cardsContainer.appendChild(card);
    }

    /**
     * Crea una tarjeta de número
     */
    createNumberCard(data) {
        const card = document.createElement('div');
        card.className = 'flashcard large';
        
        card.innerHTML = `
            <div class="card-face card-front">
                <div class="card-content">
                    <div class="number-display">${data.number}</div>
                    <div class="number-label">Español</div>
                </div>
            </div>
            <div class="card-face card-back">
                <div class="card-content">
                    <div class="kanji-large">${data.kanji}</div>
                    <div class="kana-text">${this.state.gameMode === 'hira' ? data.hira : data.kata}</div>
                    <div class="romaji-text">${data.romaji}</div>
                </div>
            </div>
        `;
        
        card.addEventListener('click', () => this.flipCard(card));
        this.elements.cardsContainer.appendChild(card);
    }

    /**
     * Crea una tarjeta de fecha
     */
    createDateCard(data) {
        const card = document.createElement('div');
        card.className = 'flashcard large';
        
        card.innerHTML = `
            <div class="card-face card-front">
                <div class="card-content">
                    <div class="date-display">${data.spanish}</div>
                    <div class="date-type">${data.type}</div>
                </div>
            </div>
            <div class="card-face card-back">
                <div class="card-content">
                    <div class="kanji-large">${data.kanji}</div>
                    <div class="kana-text">${data.hira}</div>
                    <div class="romaji-text">${data.romaji}</div>
                </div>
            </div>
        `;
        
        card.addEventListener('click', () => this.flipCard(card));
        this.elements.cardsContainer.appendChild(card);
    }

    /**
     * Voltea la tarjeta
     */
    flipCard(card) {
        card.classList.toggle('flipped');
        this.state.isFlipped = !this.state.isFlipped;
    }

    /**
     * Actualiza los botones de control
     */
    updateControlButtons() {
        if (this.elements.btnPrev) {
            this.elements.btnPrev.disabled = this.state.currentIndex === 0;
        }
        if (this.elements.btnNext) {
            this.elements.btnNext.disabled = this.state.currentIndex === this.state.currentData.length - 1;
        }
    }

    /**
     * Navegación - Siguiente tarjeta
     */
    nextCard() {
        if (this.state.currentIndex < this.state.currentData.length - 1) {
            this.state.currentIndex++;
            this.state.isFlipped = false;
            this.loadCurrentCard();
        }
    }

    /**
     * Navegación - Tarjeta anterior
     */
    previousCard() {
        if (this.state.currentIndex > 0) {
            this.state.currentIndex--;
            this.state.isFlipped = false;
            this.loadCurrentCard();
        }
    }

    /**
     * Volver atrás
     */
    goBack() {
        // Determinar a qué pantalla volver
        if (this.state.currentScreen === 'game-screen') {
            this.showScreen(`submenu-${this.state.currentCategory}`);
        } else if (this.state.currentScreen.startsWith('submenu-')) {
            this.showScreen('main-menu');
        } else {
            this.showScreen('main-menu');
        }
    }

    /**
     * Muestra sección de gramática
     */
    showGrammarSection(section) {
        const contentDisplay = document.getElementById('content-display');
        if (!contentDisplay) return;

        let content = '';
        switch(section) {
            case 'particles':
                content = this.getParticlesContent();
                break;
            case 'verbs':
                content = this.getVerbsContent();
                break;
            case 'sentence':
                content = this.getSentenceContent();
                break;
        }

        contentDisplay.innerHTML = content;
        this.showScreen('content-screen');
    }

    /**
     * Muestra sección de frases
     */
    showPhrasesSection(section) {
        const contentDisplay = document.getElementById('content-display');
        if (!contentDisplay) return;

        let content = '';
        switch(section) {
            case 'greetings':
                content = this.getGreetingsContent();
                break;
            case 'travel':
                content = this.getTravelContent();
                break;
            case 'restaurant':
                content = this.getRestaurantContent();
                break;
        }

        contentDisplay.innerHTML = content;
        this.showScreen('content-screen');
    }

    /**
     * Contenido de partículas
     */
    getParticlesContent() {
        return `
            <div class="grammar-section">
                <h2>Partículas Fundamentales</h2>
                <div class="particle-grid">
                    <div class="particle-card">
                        <h3>は (wa)</h3>
                        <p>Indica el tema de la oración. "En cuanto a..."</p>
                        <div class="example">私は学生です - Watashi wa gakusei desu</div>
                    </div>
                    <div class="particle-card">
                        <h3>が (ga)</h3>
                        <p>Indica el sujeto gramatical. Enfatiza quién realiza la acción.</p>
                        <div class="example">猫が好き - Neko ga suki</div>
                    </div>
                    <div class="particle-card">
                        <h3>を (o)</h3>
                        <p>Indica el objeto directo. "A qué/quién se afecta con la acción."</p>
                        <div class="example">ご飯を食べる - Gohan o taberu</div>
                    </div>
                    <div class="particle-card">
                        <h3>に (ni)</h3>
                        <p>Indica lugar de existencia, tiempo, o destinatario.</p>
                        <div class="example">学校に行く - Gakkou ni iku</div>
                    </div>
                    <div class="particle-card">
                        <h3>で (de)</h3>
                        <p>Indica lugar de acción, medio, o causa.</p>
                        <div class="example">電車で行く - Densha de iku</div>
                    </div>
                    <div class="particle-card">
                        <h3>へ (e)</h3>
                        <p>Indica dirección. "Hacia..."</p>
                        <div class="example">東京へ行く - Tokyo e iku</div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Contenido de verbos
     */
    getVerbsContent() {
        return `
            <div class="grammar-section">
                <h2>Conjugación Básica de Verbos</h2>
                <div class="verb-conjugation">
                    <h3>食べる (taberu - comer)</h3>
                    <div class="conjugation-table">
                        <div class="conj-row">
                            <span>Forma cortés (masu-form)</span>
                            <span>食べます (tabemasu)</span>
                        </div>
                        <div class="conj-row">
                            <span>Forma diccionario</span>
                            <span>食べる (taberu)</span>
                        </div>
                        <div class="conj-row">
                            <span>Forma pasada (masu-form)</span>
                            <span>食べました (tabemashita)</span>
                        </div>
                        <div class="conj-row">
                            <span>Forma negativa (masu-form)</span>
                            <span>食べません (tabemasen)</span>
                        </div>
                        <div class="conj-row">
                            <span>Forma te</span>
                            <span>食べて (tabete)</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Contenido de estructuras
     */
    getSentenceContent() {
        return `
            <div class="grammar-section">
                <h2>Estructuras Oracionales Básicas</h2>
                <div class="sentence-patterns">
                    <div class="pattern-card">
                        <h3>Sujeto + は + Complemento + です</h3>
                        <p>Estructura básica de identificación</p>
                        <div class="example">私は学生です - Watashi wa gakusei desu</div>
                    </div>
                    <div class="pattern-card">
                        <h3>Sujeto + が + Verbo</h3>
                        <p>Estructura de acción</p>
                        <div class="example">猫が寝る - Neko ga neru</div>
                    </div>
                    <div class="pattern-card">
                        <h3>Lugar + に + Sujeto + が + あります</h3>
                        <p>Estructura de existencia (objetos)</p>
                        <div class="example">机の上に本があります - Tsukue no ue ni hon ga arimasu</div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Contenido de saludos
     */
    getGreetingsContent() {
        return `
            <div class="phrases-section">
                <h2>Saludos y Expresiones Básicas</h2>
                <div class="phrases-grid">
                    <div class="phrase-card">
                        <div class="japanese">おはようございます</div>
                        <div class="romaji">Ohayou gozaimasu</div>
                        <div class="spanish">Buenos días</div>
                    </div>
                    <div class="phrase-card">
                        <div class="japanese">こんにちは</div>
                        <div class="romaji">Konnichiwa</div>
                        <div class="spanish">Buenas tardes / Hola</div>
                    </div>
                    <div class="phrase-card">
                        <div class="japanese">こんばんは</div>
                        <div class="romaji">Konbanwa</div>
                        <div class="spanish">Buenas noches</div>
                    </div>
                    <div class="phrase-card">
                        <div class="japanese">ありがとうございます</div>
                        <div class="romaji">Arigatou gozaimasu</div>
                        <div class="spanish">Gracias (formal)</div>
                    </div>
                    <div class="phrase-card">
                        <div class="japanese">すみません</div>
                        <div class="romaji">Sumimasen</div>
                        <div class="spanish">Disculpa / Perdón</div>
                    </div>
                    <div class="phrase-card">
                        <div class="japanese">はじめまして</div>
                        <div class="romaji">Hajimemashite</div>
                        <div class="spanish">Encantado de conocerte</div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Contenido de viajes
     */
    getTravelContent() {
        return `
            <div class="phrases-section">
                <h2>Frases de Viaje</h2>
                <div class="phrases-grid">
                    <div class="phrase-card">
                        <div class="japanese">駅はどこですか</div>
                        <div class="romaji">Eki wa doko desu ka</div>
                        <div class="spanish">¿Dónde está la estación?</div>
                    </div>
                    <div class="phrase-card">
                        <div class="japanese">切符を一枚ください</div>
                        <div class="romaji">Kippu o ichi-mai kudasai</div>
                        <div class="spanish">Un billete, por favor</div>
                    </div>
                    <div class="phrase-card">
                        <div class="japanese">トイレはどこですか</div>
                        <div class="romaji">Toire wa doko desu ka</div>
                        <div class="spanish">¿Dónde está el baño?</div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Contenido de restaurante
     */
    getRestaurantContent() {
        return `
            <div class="phrases-section">
                <h2>Frases de Restaurante</h2>
                <div class="phrases-grid">
                    <div class="phrase-card">
                        <div class="japanese">メニューをください</div>
                        <div class="romaji">Menyuu o kudasai</div>
                        <div class="spanish">El menú, por favor</div>
                    </div>
                    <div class="phrase-card">
                        <div class="japanese">これをください</div>
                        <div class="romaji">Kore o kudasai</div>
                        <div class="spanish">Esto, por favor</div>
                    </div>
                    <div class="phrase-card">
                        <div class="japanese">おいしいです</div>
                        <div class="romaji">Oishii desu</div>
                        <div class="spanish">Está delicioso</div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Muestra una notificación toast
     */
    showToast(message, duration = 3000) {
        if (!this.elements.toast) return;

        this.elements.toast.textContent = message;
        this.elements.toast.classList.add('show');

        setTimeout(() => {
            this.elements.toast.classList.remove('show');
        }, duration);
    }
}

// =====================================================
// FUNCIONES GLOBALES PARA EVENTOS HTML
// =====================================================
// INICIALIZACIÓN Y FUNCIONES GLOBALES
// =====================================================

let app;

// Funciones globales llamadas desde HTML
function showSubmenu(submenu) {
    if (window.app) {
        window.app.showSubmenu(submenu);
    }
}

function startGame(script, mode) {
    if (window.app) {
        window.app.startGame(script, mode);
    }
}

function resetToMainMenu() {
    if (window.app) {
        window.app.resetToMainMenu();
    }
}

function previousCard() {
    if (window.app) {
        window.app.previousCard();
    }
}

function nextCard() {
    if (window.app) {
        window.app.nextCard();
    }
}

function flipCard() {
    if (window.app) {
        window.app.flipCard();
    }
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    app = new NihongoApp();
    window.app = app;
});

// Exportar para uso global
window.NihongoApp = NihongoApp;
window.showSubmenu = showSubmenu;
window.startGame = startGame;
window.resetToMainMenu = resetToMainMenu;
window.previousCard = previousCard;
window.nextCard = nextCard;
window.flipCard = flipCard;