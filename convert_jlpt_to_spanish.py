#!/usr/bin/env python3
"""
Script to convert JLPT vocabulary data to Spanish format for NihongoApp
Downloads JLPT vocabulary, translates to Spanish, and creates 4000-word dataset
"""

import json
import requests
import time
import sys
from typing import List, Dict, Any
import re

# Configuration
API_BASE_URL = "https://jlpt-vocab-api.vercel.app/api/words/all"
OUTPUT_FILE = "vocabulario-jlpt-4000.json"
TARGET_WORDS = 4000

# Level distribution for balanced learning
LEVEL_DISTRIBUTION = {
    "N5": 800,   # Beginner
    "N4": 800,   # Elementary  
    "N3": 1000,  # Intermediate
    "N2": 800,   # Upper intermediate
    "N1": 600    # Advanced
}

# Word type mapping based on patterns
WORD_TYPE_PATTERNS = {
    "verbo": [r"る$", r"う$", r"く$", r"ぐ$", r"す$", r"つ$", r"ぬ$", r"ぶ$", r"む$"],
    "adjetivo": [r"い$", r"な$"],
    "sustantivo": [r".*"]  # Default
}

def download_jlpt_data() -> List[Dict[str, Any]]:
    """Download JLPT vocabulary data from API"""
    print("Downloading JLPT vocabulary data...")
    try:
        response = requests.get(API_BASE_URL, timeout=30)
        response.raise_for_status()
        data = response.json()
        print(f"Downloaded {len(data)} words")
        return data
    except Exception as e:
        print(f"Error downloading data: {e}")
        return []

def translate_english_to_spanish(english_text: str) -> str:
    """
    Simple translation using common patterns and dictionary
    For production, use a proper translation API
    """
    # Basic translation dictionary for common words
    translations = {
        # Nouns
        "student": "estudiante",
        "teacher": "profesor", 
        "school": "escuela",
        "language": "idioma",
        "time": "tiempo",
        "day": "día",
        "year": "año",
        "person": "persona",
        "place": "lugar",
        "thing": "cosa",
        "water": "agua",
        "food": "comida",
        "house": "casa",
        "car": "coche",
        "book": "libro",
        "friend": "amigo",
        "family": "familia",
        "work": "trabajo",
        "money": "dinero",
        "problem": "problema",
        "answer": "respuesta",
        "question": "pregunta",
        "idea": "idea",
        "word": "palabra",
        "name": "nombre",
        "number": "número",
        "color": "color",
        "size": "tamaño",
        "shape": "forma",
        "material": "material",
        "quality": "calidad",
        "price": "precio",
        "value": "valor",
        "result": "resultado",
        "reason": "razón",
        "purpose": "propósito",
        "method": "método",
        "way": "camino",
        "direction": "dirección",
        "position": "posición",
        "condition": "condición",
        "situation": "situación",
        "moment": "momento",
        "period": "período",
        "season": "estación",
        "weather": "clima",
        "nature": "naturaleza",
        "environment": "ambiente",
        "society": "sociedad",
        "culture": "cultura",
        "history": "historia",
        "future": "futuro",
        "past": "pasado",
        "present": "presente",
        
        # Verbs
        "eat": "comer",
        "drink": "beber", 
        "sleep": "dormir",
        "wake up": "despertarse",
        "work": "trabajar",
        "study": "estudiar",
        "learn": "aprender",
        "teach": "enseñar",
        "speak": "hablar",
        "listen": "escuchar",
        "read": "leer",
        "write": "escribir",
        "see": "ver",
        "watch": "mirar",
        "look": "mirar",
        "think": "pensar",
        "know": "saber",
        "understand": "entender",
        "remember": "recordar",
        "forget": "olvidar",
        "love": "amar",
        "like": "gustar",
        "hate": "odiar",
        "want": "querer",
        "need": "necesitar",
        "have": "tener",
        "do": "hacer",
        "make": "hacer",
        "give": "dar",
        "take": "tomar",
        "come": "venir",
        "go": "ir",
        "return": "volver",
        "stop": "parar",
        "start": "empezar",
        "continue": "continuar",
        "finish": "terminar",
        "help": "ayudar",
        "try": "intentar",
        "buy": "comprar",
        "sell": "vender",
        "open": "abrir",
        "close": "cerrar",
        "turn on": "encender",
        "turn off": "apagar",
        "move": "mover",
        "change": "cambiar",
        "play": "jugar",
        "sing": "cantar",
        "dance": "bailar",
        "run": "correr",
        "walk": "caminar",
        "sit": "sentarse",
        "stand": "levantarse",
        
        # Adjectives
        "good": "bueno",
        "bad": "malo",
        "big": "grande",
        "small": "pequeño",
        "long": "largo",
        "short": "corto",
        "high": "alto",
        "low": "bajo",
        "hot": "caliente",
        "cold": "frío",
        "warm": "tibio",
        "cool": "fresco",
        "new": "nuevo",
        "old": "viejo",
        "young": "joven",
        "easy": "fácil",
        "difficult": "difícil",
        "hard": "duro",
        "soft": "suave",
        "heavy": "pesado",
        "light": "ligero",
        "fast": "rápido",
        "slow": "lento",
        "clean": "limpio",
        "dirty": "sucio",
        "beautiful": "hermoso",
        "ugly": "feo",
        "expensive": "caro",
        "cheap": "barato",
        "important": "importante",
        "interesting": "interesante",
        "boring": "aburrido",
        "happy": "feliz",
        "sad": "triste",
        "angry": "enojado",
        "surprised": "sorprendido",
        "excited": "emocionado",
        "tired": "cansado",
        "sick": "enfermo",
        "healthy": "saludable",
        "strong": "fuerte",
        "weak": "débil",
        "right": "correcto",
        "wrong": "incorrecto",
        "true": "verdadero",
        "false": "falso",
        "possible": "posible",
        "impossible": "imposible",
        "necessary": "necesario",
        "available": "disponible",
        "busy": "ocupado",
        "free": "libre",
        "full": "lleno",
        "empty": "vacío",
        "red": "rojo",
        "blue": "azul",
        "green": "verde",
        "yellow": "amarillo",
        "black": "negro",
        "white": "blanco",
        "gray": "gris",
        "brown": "marrón",
        "pink": "rosa",
        "purple": "púrpura",
        "orange": "naranja",
        
        # Adverbs
        "very": "muy",
        "quite": "bastante",
        "too": "demasiado",
        "enough": "suficiente",
        "always": "siempre",
        "never": "nunca",
        "sometimes": "a veces",
        "often": "a menudo",
        "rarely": "raramente",
        "usually": "generalmente",
        "here": "aquí",
        "there": "allí",
        "everywhere": "en todas partes",
        "now": "ahora",
        "then": "entonces",
        "today": "hoy",
        "tomorrow": "mañana",
        "yesterday": "ayer",
        "soon": "pronto",
        "later": "después",
        "early": "temprano",
        "late": "tarde",
        "well": "bien",
        "badly": "mal",
        "quickly": "rápidamente",
        "slowly": "lentamente",
        "carefully": "cuidadosamente",
        "easily": "fácilmente",
        "hard": "difícilmente",
        
        # Prepositions/Conjunctions
        "and": "y",
        "or": "o",
        "but": "pero",
        "because": "porque",
        "so": "así que",
        "if": "si",
        "when": "cuando",
        "where": "donde",
        "how": "cómo",
        "what": "qué",
        "who": "quién",
        "which": "cuál",
        "why": "por qué",
        "with": "con",
        "without": "sin",
        "for": "para",
        "from": "de",
        "to": "a",
        "at": "en",
        "on": "en",
        "in": "en",
        "by": "por",
        "about": "acerca de",
        "over": "sobre",
        "under": "debajo",
        "between": "entre",
        "among": "entre",
        "through": "a través de",
        "during": "durante",
        "before": "antes",
        "after": "después",
        
        # Common phrases
        "hello": "hola",
        "goodbye": "adiós",
        "thank you": "gracias",
        "please": "por favor",
        "sorry": "lo siento",
        "excuse me": "disculpe",
        "yes": "sí",
        "no": "no",
        "maybe": "quizás",
        "of course": "por supuesto",
        "I don't know": "no sé",
        "I understand": "entiendo",
        "I don't understand": "no entiendo"
    }
    
    # Clean the input text
    if not english_text:
        return ""
    
    text = english_text.lower().strip()
    
    # Handle common patterns
    if text in translations:
        return translations[text]
    
    # Handle multi-word phrases
    words = text.split()
    translated_words = []
    for word in words:
        if word in translations:
            translated_words.append(translations[word])
        else:
            # For unknown words, return as-is (could be improved with proper API)
            translated_words.append(word)
    
    result = " ".join(translated_words)
    
    # Common patterns cleanup
    result = result.replace("every morning", "cada mañana")
    result = result.replace("good morning", "buenos días") 
    result = result.replace("good afternoon", "buenas tardes")
    result = result.replace("good evening", "buenas noches")
    result = result.replace("good night", "buenas noches")
    result = result.replace("thank you", "gracias")
    result = result.replace("excuse me", "disculpe")
    result = result.replace("i see", "entiendo")
    result = result.replace("of course", "por supuesto")
    result = result.replace("for example", "por ejemplo")
    result = result.replace("in general", "en general")
    result = result.replace("at first", "al principio")
    result = result.replace("at last", "finalmente")
    result = result.replace("at least", "al menos")
    result = result.replace("at most", "como máximo")
    result = result.replace("as soon as", "tan pronto como")
    result = result.replace("as long as", "siempre que")
    result = result.replace("as far as", "en cuanto a")
    result = result.replace("as well as", "así como")
    result = result.replace("even if", "incluso si")
    result = result.replace("even though", "aunque")
    result = result.replace("in order to", "para")
    result = result.replace("so that", "para que")
    result = result.replace("such as", "como")
    result = result.replace("instead of", "en lugar de")
    result = result.replace("because of", "debido a")
    result = result.replace("in spite of", "a pesar de")
    result = result.replace("according to", "según")
    result = result.replace("in front of", "delante de")
    result = result.replace("in back of", "detrás de")
    result = result.replace("next to", "al lado de")
    result = result.replace("far from", "lejos de")
    result = result.replace("near to", "cerca de")
    result = result.replace("out of", "fuera de")
    result = result.replace("inside of", "dentro de")
    result = result.replace("on top of", "encima de")
    result = result.replace("underneath of", "debajo de")
    result = result.replace("all right", "bien")
    result = result.replace("no problem", "no hay problema")
    result = result.replace("no way", "de ninguna manera")
    result = result.replace("let's see", "veamos")
    result = result.replace("that's right", "correcto")
    
    return result

def determine_word_type(japanese_word: str, meaning: str) -> str:
    """Determine word type based on patterns"""
    japanese_lower = japanese_word.lower()
    
    # Check verb patterns
    for pattern in WORD_TYPE_PATTERNS["verbo"]:
        if re.search(pattern, japanese_lower):
            return "verbo"
    
    # Check adjective patterns  
    for pattern in WORD_TYPE_PATTERNS["adjetivo"]:
        if re.search(pattern, japanese_lower):
            return "adjetivo"
    
    # Default to noun
    return "sustantivo"

def convert_jlpt_level(level: int) -> str:
    """Convert numeric level to JLPT format"""
    level_mapping = {
        1: "N1",
        2: "N2", 
        3: "N3",
        4: "N4",
        5: "N5"
    }
    return level_mapping.get(level, "N5")

def select_words_by_level(words: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Select words according to level distribution"""
    selected_words = []
    words_by_level = {}
    
    # Group words by level
    for word in words:
        level = convert_jlpt_level(word.get('level', 5))
        if level not in words_by_level:
            words_by_level[level] = []
        words_by_level[level].append(word)
    
    # Select words according to distribution
    for level, target_count in LEVEL_DISTRIBUTION.items():
        level_words = words_by_level.get(level, [])
        available = min(len(level_words), target_count)
        
        # Take first N words from each level
        selected_words.extend(level_words[:available])
        print(f"Selected {available} words for level {level}")
    
    # If we have fewer than TARGET_WORDS, add more from available levels
    if len(selected_words) < TARGET_WORDS:
        remaining_needed = TARGET_WORDS - len(selected_words)
        print(f"Need {remaining_needed} more words to reach target...")
        
        # Add more words from levels that have availability
        for level in ["N5", "N4", "N3", "N2", "N1"]:
            level_words = words_by_level.get(level, [])
            already_selected = len([w for w in selected_words if convert_jlpt_level(w.get('level', 5)) == level])
            available_more = min(len(level_words) - already_selected, remaining_needed)
            
            if available_more > 0:
                start_index = already_selected
                end_index = start_index + available_more
                selected_words.extend(level_words[start_index:end_index])
                remaining_needed -= available_more
                print(f"Added {available_more} more words for level {level}")
                
                if remaining_needed <= 0:
                    break
    
    return selected_words

def process_word_data(word: Dict[str, Any]) -> Dict[str, Any]:
    """Process individual word data to target format"""
    # Get basic information
    kanji = word.get('word', '')
    kana = word.get('furigana', '') or word.get('romaji', '')
    romaji = word.get('romaji', '')
    english_meaning = word.get('meaning', '')
    level = convert_jlpt_level(word.get('level', 5))
    
    # Translate to Spanish
    spanish_meaning = translate_english_to_spanish(english_meaning)
    
    # Create Spanish translations array (add synonyms if possible)
    spanish_translations = [spanish_meaning]
    
    # Add some common synonyms for basic words
    synonym_map = {
        "estudiante": ["alumno"],
        "profesor": ["maestro"], 
        "escuela": ["colegio"],
        "casa": ["hogar"],
        "coche": ["carro", "automóvil"],
        "libro": ["tomo"],
        "trabajo": ["empleo"],
        "dinero": ["capital"],
        "problema": ["dificultad"],
        "respuesta": ["solución"],
        "pregunta": ["consulta"],
        "camino": ["ruta", "sendero"],
        "dirección": ["orientación"],
        "método": ["técnica"],
        "razón": ["motivo"],
        "propósito": ["objetivo"],
        "momento": ["instante"],
        "período": ["época"],
        "estación": ["temporada"],
        "clima": ["tiempo"],
        "ambiente": ["entorno"],
        "sociedad": ["comunidad"],
        "cultura": ["civilización"],
        "historia": ["pasado"],
        "futuro": ["porvenir"],
        "presente": ["actualidad"],
        "comer": ["alimentarse"],
        "beber": ["tomar"],
        "dormir": ["descansar"],
        "trabajar": ["laborar"],
        "estudiar": ["aprender"],
        "enseñar": ["instruir"],
        "hablar": ["conversar"],
        "escuchar": ["oír"],
        "ver": ["mirar", "observar"],
        "pensar": ["reflexionar"],
        "saber": ["conocer"],
        "entender": ["comprender"],
        "recordar": ["acordarse"],
        "querer": ["desear"],
        "necesitar": ["requerir"],
        "hacer": ["realizar", "efectuar"],
        "dar": ["entregar"],
        "tomar": ["coger"],
        "venir": ["llegar"],
        "ir": ["marchar"],
        "volver": ["regresar"],
        "parar": ["detener"],
        "empezar": ["comenzar"],
        "terminar": ["acabar", "finalizar"],
        "ayudar": ["asistir"],
        "intentar": ["tratar"],
        "comprar": ["adquirir"],
        "vender": ["comerciar"],
        "abrir": ["abrirse"],
        "cerrar": ["cerrarse"],
        "mover": ["desplazar"],
        "cambiar": ["modificar"],
        "jugar": ["jugarse"],
        "correr": ["correrse"],
        "caminar": ["andar"],
        "sentarse": ["sentar"],
        "levantarse": ["levantar"],
        "bueno": ["excelente"],
        "malo": ["pésimo"],
        "grande": ["enorme"],
        "pequeño": ["diminuto"],
        "largo": ["extenso"],
        "corto": ["breve"],
        "alto": ["elevado"],
        "bajo": ["inferior"],
        "nuevo": ["novedoso"],
        "viejo": ["anciano"],
        "fácil": ["sencillo"],
        "difícil": ["complicado"],
        "duro": ["rígido"],
        "suave": ["blando"],
        "pesado": ["ponderado"],
        "ligero": ["liviano"],
        "rápido": ["veloz"],
        "lento": ["perezoso"],
        "limpio": ["puro"],
        "sucio": ["inmundo"],
        "hermoso": ["bello"],
        "feo": ["horrible"],
        "caro": ["costoso"],
        "barato": ["económico"],
        "importante": ["relevante"],
        "interesante": ["fascinante"],
        "aburrido": ["tedioso"],
        "feliz": ["contento"],
        "triste": ["afligido"],
        "enojado": ["furioso"],
        "cansado": ["fatigado"],
        "enfermo": ["enfermo"],
        "saludable": ["sano"],
        "fuerte": ["robusto"],
        "débil": ["frágil"],
        "correcto": ["adecuado"],
        "incorrecto": ["equivocado"],
        "verdadero": ["real"],
        "falso": ["irreal"],
        "posible": ["factible"],
        "imposible": ["inviable"],
        "necesario": ["esencial"],
        "disponible": ["accesible"],
        "ocupado": ["atareado"],
        "libre": ["gratuito"],
        "lleno": ["completo"],
        "vacío": ["hueco"]
    }
    
    if spanish_meaning in synonym_map:
        spanish_translations.extend(synonym_map[spanish_meaning])
    
    # Determine word type
    word_type = determine_word_type(kanji, english_meaning)
    
    return {
        "kanji": kanji,
        "kana": kana,
        "romaji": romaji,
        "español": spanish_translations,
        "level": level,
        "type": word_type
    }

def main():
    """Main processing function"""
    print("Starting JLPT vocabulary conversion to Spanish...")
    
    # Download data
    raw_data = download_jlpt_data()
    if not raw_data:
        print("Failed to download data. Exiting.")
        return
    
    # Select words according to level distribution
    selected_words = select_words_by_level(raw_data)
    print(f"Selected {len(selected_words)} total words")
    
    # Process words to target format
    processed_words = []
    for i, word in enumerate(selected_words):
        try:
            processed_word = process_word_data(word)
            processed_words.append(processed_word)
            
            # Progress indicator
            if (i + 1) % 100 == 0:
                print(f"Processed {i + 1}/{len(selected_words)} words...")
                
        except Exception as e:
            print(f"Error processing word {i}: {e}")
            continue
    
    # Create final JSON structure
    final_data = {
        "metadata": {
            "total_words": len(processed_words),
            "description": f"{len(processed_words)} palabras JLPT N5-N1 organizadas por nivel con traducciones al español",
            "levels": ["N5", "N4", "N3", "N2", "N1"],
            "last_updated": "2026-01-27",
            "source": "JLPT Vocabulary API with Spanish translations"
        },
        "words": processed_words
    }
    
    # Save to file
    try:
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            json.dump(final_data, f, ensure_ascii=False, indent=2)
        print(f"Successfully created {OUTPUT_FILE} with {len(processed_words)} words")
        
        # Print statistics
        level_counts = {}
        type_counts = {}
        for word in processed_words:
            level = word['level']
            word_type = word['type']
            level_counts[level] = level_counts.get(level, 0) + 1
            type_counts[word_type] = type_counts.get(word_type, 0) + 1
        
        print("\n=== STATISTICS ===")
        print("Words by level:")
        for level in sorted(level_counts.keys()):
            print(f"  {level}: {level_counts[level]} words")
        
        print("\nWords by type:")
        for word_type in sorted(type_counts.keys()):
            print(f"  {word_type}: {type_counts[word_type]} words")
            
    except Exception as e:
        print(f"Error saving file: {e}")

if __name__ == "__main__":
    main()