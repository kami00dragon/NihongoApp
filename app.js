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
            currentIndex: 0,
            isFlipped: false,
            score: 0,
            attempts: 0,
            currentData: []
        };

        // Referencias al DOM
        this.elements = {
            contentArea: document.getElementById('content-area'),
            books: document.querySelectorAll('.book'),
            toast: document.getElementById('toast')
        };

        // Inicializar
        this.init();
    }

    /**
     * Inicializa la aplicación
     */
    init() {
        this.setupEventListeners();
        this.loadCategory('silabario');
        this.showToast('🎌 ¡Bienvenido a NihongoApp! 🎌', 3000);
    }

    /**
     * Configura los event listeners
     */
    setupEventListeners() {
        // Event listeners para los libros
        this.elements.books.forEach(book => {
            book.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                this.switchCategory(category);
            });
        });
    }

    /**
     * Cambia entre categorías
     */
    switchCategory(category) {
        if (this.state.currentCategory === category) return;

        // Actualizar estado
        this.state.currentCategory = category;
        this.state.currentIndex = 0;
        this.state.isFlipped = false;

        // Actualizar UI
        this.updateActiveBook(category);
        this.loadCategory(category);
    }

    /**
     * Actualiza el libro activo
     */
    updateActiveBook(activeCategory) {
        this.elements.books.forEach(book => {
            const category = book.dataset.category;
            if (category === activeCategory) {
                book.classList.add('active');
            } else {
                book.classList.remove('active');
            }
        });
    }

    /**
     * Carga el contenido de una categoría
     */
    loadCategory(category) {
        let content = '';
        this.state.currentData = [];

        switch (category) {
            case 'silabario':
                content = this.renderSilabarioSelector();
                break;
            case 'vocabulario-esp':
                content = this.renderVocabularioEsp();
                break;
            case 'vocabulario-jap':
                content = this.renderVocabularioJap();
                break;
            case 'fechas':
                content = this.renderFechasSelector();
                break;
            case 'numeros':
                content = this.renderNumeros();
                break;
            case 'gramatica':
                content = this.renderGramatica();
                break;
            default:
                content = '<div class="loading"><div class="spinner"></div></div>';
        }

        this.elements.contentArea.innerHTML = content;
        this.elements.contentArea.classList.add('content-animate');
        
        setTimeout(() => {
            this.elements.contentArea.classList.remove('content-animate');
        }, 600);
    }

    /**
     * Renderiza selector de silabarios
     */
    renderSilabarioSelector() {
        return `
            <div class="progress-container">
                <div class="progress-bar">Elige un silabario para practicar</div>
            </div>
            <div class="learning-cards">
                <div class="card-container">
                    <div class="learning-card" onclick="nihongoApp.startSilabario('hiragana')">
                        <div class="card-face card-front">
                            <div class="card-japanese">ひらがな</div>
                            <div class="card-romaji">Hiragana</div>
                            <div class="card-meaning">46 caracteres básicos</div>
                        </div>
                        <div class="card-face card-back">
                            <div class="card-meaning">Sílabas fundamentales del japonés</div>
                        </div>
                    </div>
                </div>
                <div class="card-container">
                    <div class="learning-card" onclick="nihongoApp.startSilabario('katakana')">
                        <div class="card-face card-front">
                            <div class="card-japanese">カタカナ</div>
                            <div class="card-romaji">Katakana</div>
                            <div class="card-meaning">46 caracteres</div>
                        </div>
                        <div class="card-face card-back">
                            <div class="card-meaning">Usado para palabras extranjeras</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Renderiza vocabulario español
     */
    renderVocabularioEsp() {
        this.state.currentData = NihongoData.vocabularioEsp;
        return `
            <div class="progress-container">
                <div class="progress-bar">Vocabulario: ${this.state.currentData.length} palabras</div>
                <div class="progress-text">Haga clic en las tarjetas para ver las traducciones</div>
            </div>
            ${this.renderVocabularyCards(NihongoData.vocabularioEsp)}
        `;
    }

    /**
     * Renderiza vocabulario japonés
     */
    renderVocabularioJap() {
        this.state.currentData = NihongoData.vocabularioJap;
        return `
            <div class="progress-container">
                <div class="progress-bar">Kanji: ${this.state.currentData.length} caracteres</div>
                <div class="progress-text">Niveles JLPT: N5-N3</div>
            </div>
            ${this.renderKanjiCards(NihongoData.vocabularioJap)}
        `;
    }

    /**
     * Renderiza selector de fechas
     */
    renderFechasSelector() {
        return `
            <div class="progress-container">
                <div class="progress-bar">Elige una categoría de fecha</div>
            </div>
            <div class="learning-cards">
                <div class="card-container">
                    <div class="learning-card" onclick="nihongoApp.startFechas('dias')">
                        <div class="card-face card-front">
                            <div class="card-japanese">日曜日</div>
                            <div class="card-romaji">Días de la semana</div>
                            <div class="card-meaning">7 días</div>
                        </div>
                        <div class="card-face card-back">
                            <div class="card-meaning"> lunes, martes, miércoles...</div>
                        </div>
                    </div>
                </div>
                <div class="card-container">
                    <div class="learning-card" onclick="nihongoApp.startFechas('meses')">
                        <div class="card-face card-front">
                            <div class="card-japanese">一月</div>
                            <div class="card-romaji">Meses del año</div>
                            <div class="card-meaning">12 meses</div>
                        </div>
                        <div class="card-face card-back">
                            <div class="card-meaning"> enero, febrero, marzo...</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Renderiza números
     */
    renderNumeros() {
        this.state.currentData = NihongoData.numeros;
        return `
            <div class="progress-container">
                <div class="progress-bar">Números: 0-${this.state.currentData.length - 1}</div>
                <div class="progress-text">Incluye cero y grandes cantidades</div>
            </div>
            ${this.renderNumberCards(NihongoData.numeros)}
        `;
    }

    /**
     * Renderiza gramática
     */
    renderGramatica() {
        this.state.currentData = NihongoData.gramatica;
        return `
            <div class="progress-container">
                <div class="progress-bar">Partículas JLPT N5-N4</div>
                <div class="progress-text">Fundamentos de gramática japonesa</div>
            </div>
            ${this.renderGrammarCards(NihongoData.gramatica)}
        `;
    }

    /**
     * Renderiza tarjetas de vocabulario
     */
    renderVocabularyCards(data) {
        const shuffled = NihongoData.utils.shuffle(data);
        return `
            <div class="learning-cards">
                ${shipped.slice(0, 12).map((item, index) => `
                    <div class="card-container">
                        <div class="learning-card" onclick="nihongoApp.flipCard(${index})" data-index="${index}">
                            <div class="card-face card-front">
                                <div class="card-japanese">${item.japanese}</div>
                                <div class="card-romaji">${item.romaji}</div>
                                <div class="card-meaning">Haga clic para traducción</div>
                            </div>
                            <div class="card-face card-back">
                                <div class="card-meaning">${item.spanish}</div>
                                <div class="card-meaning">Tipo: ${item.type}</div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Renderiza tarjetas de kanji
     */
    renderKanjiCards(data) {
        const shuffled = NihongoData.utils.shuffle(data);
        return `
            <div class="learning-cards">
                ${shuffled.slice(0, 12).map((item, index) => `
                    <div class="card-container">
                        <div class="learning-card" onclick="nihongoApp.flipKanji(${index})" data-index="${index}">
                            <div class="card-face card-front">
                                <div class="card-japanese">${item.kanji}</div>
                                <div class="card-romaji">${item.romaji}</div>
                                <div class="card-meaning">${item.jlpt}</div>
                            </div>
                            <div class="card-face card-back">
                                <div class="card-meaning">${item.hiragana}</div>
                                <div class="card-meaning">${item.spanish}</div>
                                <div class="card-meaning">JLPT: ${item.jlpt}</div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Renderiza tarjetas de números
     */
    renderNumberCards(data) {
        const shuffled = NihongoData.utils.shuffle(data);
        return `
            <div class="learning-cards">
                ${shuffled.slice(0, 12).map((item, index) => `
                    <div class="card-container">
                        <div class="learning-card" onclick="nihongoApp.flipNumber(${index})" data-index="${index}">
                            <div class="card-face card-front">
                                <div class="card-japanese">${item.japanese}</div>
                                <div class="card-romaji">${item.hiragana}</div>
                                <div class="card-meaning">Haga clic para traducción</div>
                            </div>
                            <div class="card-face card-back">
                                <div class="card-meaning">${item.spanish}</div>
                                <div class="card-meaning">${item.romaji}</div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Renderiza tarjetas de gramática
     */
    renderGrammarCards(data) {
        const shuffled = NihongoData.utils.shuffle(data);
        return `
            <div class="learning-cards">
                ${shuffled.slice(0, 12).map((item, index) => `
                    <div class="card-container">
                        <div class="learning-card" onclick="nihongoApp.flipGrammar(${index})" data-index="${index}">
                            <div class="card-face card-front">
                                <div class="card-japanese">${item.pattern}</div>
                                <div class="card-romaji">${item.usage}</div>
                                <div class="card-meaning">${item.jlpt}</div>
                            </div>
                            <div class="card-face card-back">
                                <div class="card-meaning">${item.example}</div>
                                <div class="card-meaning">${item.translation}</div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Inicia práctica de silabario
     */
    startSilabario(type) {
        const silabario = type === 'hiragana' ? NihongoData.silabarios.hiragana : NihongoData.silabarios.katakana;
        this.state.currentData = silabario;
        this.state.currentIndex = 0;

        const content = `
            <div class="progress-container">
                <div class="progress-bar">${silabario[0].character} / ${silabario.length}</div>
                <div class="progress-text">${type === 'hiragana' ? 'Hiragana' : 'Katakana'}</div>
            </div>
            ${this.renderSilabarioCard(silabario[0], 0)}
            <div class="nav-controls">
                <button class="btn btn-secondary" onclick="nihongoApp.previousSilabario()">← Anterior</button>
                <button class="btn" onclick="nihongoApp.flipCurrentCard()">Voltear</button>
                <button class="btn btn-secondary" onclick="nihongoApp.nextSilabario()">Siguiente →</button>
            </div>
        `;

        this.elements.contentArea.innerHTML = content;
        this.showToast(`🎌 Practicando ${type === 'hiragana' ? 'Hiragana' : 'Katakana'}`, 2000);
    }

    /**
     * Renderiza tarjeta individual de silabario
     */
    renderSilabarioCard(syllable, index) {
        return `
            <div class="learning-cards">
                <div class="card-container">
                    <div class="learning-card" id="silabario-card" onclick="nihongoApp.flipCurrentCard()">
                        <div class="card-face card-front">
                            <div class="card-japanese">${syllable.character}</div>
                            <div class="card-romaji">${syllable.romaji}</div>
                            <div class="card-meaning">Haga clic para audio</div>
                        </div>
                        <div class="card-face card-back">
                            <div class="card-meaning">Sonido: ${syllable.reading}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Voltea la tarjeta actual
     */
    flipCurrentCard() {
        const card = document.getElementById('silabario-card');
        if (card) {
            card.classList.toggle('flipped');
            this.state.isFlipped = !this.state.isFlipped;
        }
    }

    /**
     * Siguiente silabario
     */
    nextSilabario() {
        this.state.currentIndex++;
        if (this.state.currentIndex >= this.state.currentData.length) {
            this.state.currentIndex = 0;
            this.showToast('🎉 ¡Completado! Volviendo al inicio...', 2000);
        }
        this.startSilabario(this.state.currentData === NihongoData.silabarios.hiragana ? 'hiragana' : 'katakana');
    }

    /**
     * Anterior silabario
     */
    previousSilabario() {
        this.state.currentIndex--;
        if (this.state.currentIndex < 0) {
            this.state.currentIndex = this.state.currentData.length - 1;
        }
        this.startSilabario(this.state.currentData === NihongoData.silabarios.hiragana ? 'hiragana' : 'katakana');
    }

    /**
     * Voltea tarjeta de vocabulario
     */
    flipCard(index) {
        const card = document.querySelector(`[data-index="${index}"]`);
        if (card) {
            card.classList.toggle('flipped');
            this.updateScore(true);
        }
    }

    /**
     * Voltea tarjeta de kanji
     */
    flipKanji(index) {
        const card = document.querySelector(`[data-index="${index}"]`);
        if (card) {
            card.classList.toggle('flipped');
            this.updateScore(true);
        }
    }

    /**
     * Voltea tarjeta de números
     */
    flipNumber(index) {
        const card = document.querySelector(`[data-index="${index}"]`);
        if (card) {
            card.classList.toggle('flipped');
            this.updateScore(true);
        }
    }

    /**
     * Voltea tarjeta de gramática
     */
    flipGrammar(index) {
        const card = document.querySelector(`[data-index="${index}"]`);
        if (card) {
            card.classList.toggle('flipped');
            this.updateScore(true);
        }
    }

    /**
     * Actualiza el puntaje
     */
    updateScore(correct) {
        this.state.attempts++;
        if (correct) {
            this.state.score++;
        }
    }

    /**
     * Inicia práctica de fechas
     */
    startFechas(type) {
        const data = type === 'dias' ? NihongoData.fechas.dias : NihongoData.fechas.meses;
        this.state.currentData = data;
        this.state.currentIndex = 0;

        const current = data[0];
        const content = `
            <div class="progress-container">
                <div class="progress-bar">${current.japanese} / ${data.length}</div>
                <div class="progress-text">${current.spanish}</div>
            </div>
            ${this.renderDateCard(current, 0)}
            <div class="nav-controls">
                <button class="btn btn-secondary" onclick="nihongoApp.previousDate()">← Anterior</button>
                <button class="btn btn-secondary" onclick="nihongoApp.nextDate()">Siguiente →</button>
            </div>
        `;

        this.elements.contentArea.innerHTML = content;
        this.showToast(`📅 Practicando ${type === 'dias' ? 'días de la semana' : 'meses del año'}`, 2000);
    }

    /**
     * Renderiza tarjeta de fecha
     */
    renderDateCard(date, index) {
        return `
            <div class="learning-cards">
                <div class="card-container">
                    <div class="learning-card">
                        <div class="card-face card-front">
                            <div class="card-japanese">${date.japanese}</div>
                            <div class="card-romaji">${date.hiragana}</div>
                            <div class="card-meaning">${date.romaji}</div>
                        </div>
                        <div class="card-face card-back">
                            <div class="card-meaning">${date.spanish}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Siguiente fecha
     */
    nextDate() {
        this.state.currentIndex++;
        if (this.state.currentIndex >= this.state.currentData.length) {
            this.state.currentIndex = 0;
            this.showToast('🎉 ¡Completado! Volviendo al inicio...', 2000);
        }
        const current = this.state.currentData[this.state.currentIndex];
        this.elements.contentArea.innerHTML = `
            <div class="progress-container">
                <div class="progress-bar">${current.japanese} / ${this.state.currentData.length}</div>
                <div class="progress-text">${current.spanish}</div>
            </div>
            ${this.renderDateCard(current, this.state.currentIndex)}
            <div class="nav-controls">
                <button class="btn btn-secondary" onclick="nihongoApp.previousDate()">← Anterior</button>
                <button class="btn btn-secondary" onclick="nihongoApp.nextDate()">Siguiente →</button>
            </div>
        `;
    }

    /**
     * Anterior fecha
     */
    previousDate() {
        this.state.currentIndex--;
        if (this.state.currentIndex < 0) {
            this.state.currentIndex = this.state.currentData.length - 1;
        }
        const current = this.state.currentData[this.state.currentIndex];
        this.elements.contentArea.innerHTML = `
            <div class="progress-container">
                <div class="progress-bar">${current.japanese} / ${this.state.currentData.length}</div>
                <div class="progress-text">${current.spanish}</div>
            </div>
            ${this.renderDateCard(current, this.state.currentIndex)}
            <div class="nav-controls">
                <button class="btn btn-secondary" onclick="nihongoApp.previousDate()">← Anterior</button>
                <button class="btn btn-secondary" onclick="nihongoApp.nextDate()">Siguiente →</button>
            </div>
        `;
    }

    /**
     * Muestra notificación toast
     */
    showToast(message, duration = 3000) {
        this.elements.toast.textContent = message;
        this.elements.toast.classList.add('show');
        
        setTimeout(() => {
            this.elements.toast.classList.remove('show');
        }, duration);
    }
}

// =====================================================
// INICIALIZACIÓN GLOBAL
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
    window.nihongoApp = new NihongoApp();
    console.log('🎌 NihongoApp inicializado correctamente');
    console.log('📚 Modos disponibles: silabario, vocabulario-esp, vocabulario-jap, fechas, numeros, gramatica');
});