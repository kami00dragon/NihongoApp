'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ChevronLeft, Home, Loader2 } from 'lucide-react'
import { ToriiGate } from '@/components/torii-gate'

type Screen = 'main' | 'sub-basic' | 'sub-vocab-es' | 'sub-vocab-jp' | 'sub-dates' | 'sub-numbers' | 'sub-syntax' | 'game'
type Script = 'hira' | 'kata'
type Mode = 'basic' | 'vocab-es' | 'vocab-jp' | 'dates-days' | 'dates-months' | 'dates-ordinal' | 'nums-normal' | 'nums-ordinal'

interface KanaData {
  romaji: string
  hira: string
  kata: string
  word: string
  breakdown: Array<{ es: string, romaji: string }>
  kanji?: string
  meaning?: string
  onyomi?: string[]
  kunyomi?: string[]
}

interface KanjiData {
  kanji: string
  onyomi: string[]
  kunyomi: string[]
  meaning: string
}

interface SyntaxTopic {
  topic: string
  explanation: string
  examples: Array<{
    japanese: string
    romaji: string
    translation: string
    explanation?: string
  }>
}

interface SyntaxData {
  particles: Record<string, ParticleData>
  grammar_levels: Record<string, {
    title: string
    topics: SyntaxTopic[]
  }>
}

import syntaxData from '@/data/syntax-data.json'

const kanaDictionary: Record<string, { hira: string, kata: string }> = {
  'a': { hira: 'あ', kata: 'ア' }, 'i': { hira: 'い', kata: 'イ' }, 'u': { hira: 'う', kata: 'ウ' },
  'e': { hira: 'え', kata: 'エ' }, 'o': { hira: 'お', kata: 'オ' },
  'ka': { hira: 'か', kata: 'カ' }, 'ki': { hira: 'き', kata: 'キ' }, 'ku': { hira: 'く', kata: 'ク' },
  'ke': { hira: 'け', kata: 'ケ' }, 'ko': { hira: 'こ', kata: 'コ' },
  'sa': { hira: 'さ', kata: 'サ' }, 'shi': { hira: 'し', kata: 'シ' }, 'su': { hira: 'す', kata: 'ス' },
  'se': { hira: 'せ', kata: 'セ' }, 'so': { hira: 'そ', kata: 'ソ' },
  'ta': { hira: 'た', kata: 'タ' }, 'chi': { hira: 'ち', kata: 'チ' }, 'tsu': { hira: 'つ', kata: 'ツ' },
  'te': { hira: 'て', kata: 'テ' }, 'to': { hira: 'と', kata: 'ト' },
  'na': { hira: 'な', kata: 'ナ' }, 'ni': { hira: 'に', kata: 'ニ' }, 'nu': { hira: 'ぬ', kata: 'ヌ' },
  'ne': { hira: 'ね', kata: 'ネ' }, 'no': { hira: 'の', kata: 'ノ' },
  'ha': { hira: 'は', kata: 'ハ' }, 'hi': { hira: 'ひ', kata: 'ヒ' }, 'fu': { hira: 'ふ', kata: 'フ' },
  'he': { hira: 'へ', kata: 'ヘ' }, 'ho': { hira: 'ほ', kata: 'ホ' },
  'ma': { hira: 'ま', kata: 'マ' }, 'mi': { hira: 'み', kata: 'ミ' }, 'mu': { hira: 'む', kata: 'ム' },
  'me': { hira: 'め', kata: 'メ' }, 'mo': { hira: 'も', kata: 'モ' },
  'ya': { hira: 'や', kata: 'ヤ' }, 'yu': { hira: 'ゆ', kata: 'ユ' }, 'yo': { hira: 'よ', kata: 'ヨ' },
  'ra': { hira: 'ら', kata: 'ラ' }, 'ri': { hira: 'り', kata: 'リ' }, 'ru': { hira: 'る', kata: 'ル' },
  're': { hira: 'れ', kata: 'レ' }, 'ro': { hira: 'ろ', kata: 'ロ' },
  'wa': { hira: 'わ', kata: 'ワ' }, 'wo': { hira: 'を', kata: 'ヲ' }, 'n': { hira: 'ん', kata: 'ン' },
  'ga': { hira: 'が', kata: 'ガ' }, 'gi': { hira: 'ぎ', kata: 'ギ' }, 'gu': { hira: 'ぐ', kata: 'グ' },
  'ge': { hira: 'げ', kata: 'ゲ' }, 'go': { hira: 'ご', kata: 'ゴ' },
  'za': { hira: 'ざ', kata: 'ザ' }, 'ji': { hira: 'じ', kata: 'ジ' }, 'zu': { hira: 'ず', kata: 'ズ' },
  'ze': { hira: 'ぜ', kata: 'ゼ' }, 'zo': { hira: 'ぞ', kata: 'ゾ' },
  'da': { hira: 'だ', kata: 'ダ' }, 'de': { hira: 'で', kata: 'デ' }, 'do': { hira: 'ど', kata: 'ド' },
  'ba': { hira: 'ば', kata: 'バ' }, 'bi': { hira: 'び', kata: 'ビ' }, 'bu': { hira: 'ぶ', kata: 'ブ' },
  'be': { hira: 'べ', kata: 'ベ' }, 'bo': { hira: 'ぼ', kata: 'ボ' },
  'pa': { hira: 'ぱ', kata: 'パ' }, 'pi': { hira: 'ぴ', kata: 'ピ' }, 'pu': { hira: 'ぷ', kata: 'プ' },
  'pe': { hira: 'ぺ', kata: 'ペ' }, 'po': { hira: 'ぽ', kata: 'ポ' },
}

const basicKana: KanaData[] = Object.keys(kanaDictionary).map(key => ({
  romaji: key,
  hira: kanaDictionary[key].hira,
  kata: kanaDictionary[key].kata,
  word: key,
  breakdown: [{ es: key, romaji: key }]
}))

const vocabES: KanaData[] = [
  { romaji: 'hola', hira: 'おはよう', kata: 'オハヨウ', word: 'hola', breakdown: [{ es: 'ho', romaji: 'o' }, { es: 'la', romaji: 'ra' }] },
  { romaji: 'adios', hira: 'さようなら', kata: 'サヨウナラ', word: 'adiós', breakdown: [{ es: 'a', romaji: 'sa' }, { es: 'dios', romaji: 'you' }] },
  { romaji: 'gracias', hira: 'ありがとう', kata: 'アリガトウ', word: 'gracias', breakdown: [{ es: 'gra', romaji: 'a' }, { es: 'cias', romaji: 'ri' }] },
  { romaji: 'agua', hira: 'みず', kata: 'ミズ', word: 'agua', breakdown: [{ es: 'a', romaji: 'mi' }, { es: 'gua', romaji: 'zu' }] },
  { romaji: 'arbol', hira: 'き', kata: 'キ', word: 'árbol', breakdown: [{ es: 'ar', romaji: 'ki' }, { es: 'bol', romaji: '' }] },
  { romaji: 'sol', hira: 'たいよう', kata: 'タイヨウ', word: 'sol', breakdown: [{ es: 'sol', romaji: 'tai' }] },
  { romaji: 'luna', hira: 'つき', kata: 'ツキ', word: 'luna', breakdown: [{ es: 'lu', romaji: 'tsu' }, { es: 'na', romaji: 'ki' }] },
  { romaji: 'estrella', hira: 'ほし', kata: 'ホシ', word: 'estrella', breakdown: [{ es: 'es', romaji: 'ho' }, { es: 'trella', romaji: 'shi' }] },
  { romaji: 'gato', hira: 'ねこ', kata: 'ネコ', word: 'gato', breakdown: [{ es: 'ga', romaji: 'ne' }, { es: 'to', romaji: 'ko' }] },
  { romaji: 'perro', hira: 'いぬ', kata: 'イヌ', word: 'perro', breakdown: [{ es: 'per', romaji: 'i' }, { es: 'ro', romaji: 'nu' }] },
]

const days: KanaData[] = [
  { romaji: 'lunes', hira: 'げつようび', kata: 'ゲツヨウビ', word: 'lunes', breakdown: [{ es: 'lu', romaji: 'getsu' }, { es: 'nes', romaji: 'you' }] },
  { romaji: 'martes', hira: 'かようび', kata: 'カヨウビ', word: 'martes', breakdown: [{ es: 'mar', romaji: 'ka' }, { es: 'tes', romaji: 'you' }] },
  { romaji: 'miercoles', hira: 'すいようび', kata: 'スイヨウビ', word: 'miércoles', breakdown: [{ es: 'mie', romaji: 'sui' }, { es: 'rcoles', romaji: 'you' }] },
  { romaji: 'jueves', hira: 'もくようび', kata: 'モクヨウビ', word: 'jueves', breakdown: [{ es: 'jue', romaji: 'moku' }, { es: 'ves', romaji: 'you' }] },
  { romaji: 'viernes', hira: 'きんようび', kata: 'キンヨウビ', word: 'viernes', breakdown: [{ es: 'vier', romaji: 'kin' }, { es: 'nes', romaji: 'you' }] },
  { romaji: 'sabado', hira: 'どようび', kata: 'ドヨウビ', word: 'sábado', breakdown: [{ es: 'sa', romaji: 'do' }, { es: 'bado', romaji: 'you' }] },
  { romaji: 'domingo', hira: 'にちようび', kata: 'ニチヨウビ', word: 'domingo', breakdown: [{ es: 'do', romaji: 'nichi' }, { es: 'mingo', romaji: 'you' }] },
]

const months: KanaData[] = [
  { romaji: 'enero', hira: 'いちがつ', kata: 'イチガツ', word: 'enero', breakdown: [{ es: 'en', romaji: 'ichi' }, { es: 'ero', romaji: 'gatsu' }] },
  { romaji: 'febrero', hira: 'にがつ', kata: 'ニガツ', word: 'febrero', breakdown: [{ es: 'fe', romaji: 'ni' }, { es: 'brero', romaji: 'gatsu' }] },
  { romaji: 'marzo', hira: 'さんがつ', kata: 'サンガツ', word: 'marzo', breakdown: [{ es: 'mar', romaji: 'san' }, { es: 'zo', romaji: 'gatsu' }] },
  { romaji: 'abril', hira: 'しがつ', kata: 'シガツ', word: 'abril', breakdown: [{ es: 'a', romaji: 'shi' }, { es: 'bril', romaji: 'gatsu' }] },
  { romaji: 'mayo', hira: 'ごがつ', kata: 'ゴガツ', word: 'mayo', breakdown: [{ es: 'ma', romaji: 'go' }, { es: 'yo', romaji: 'gatsu' }] },
  { romaji: 'junio', hira: 'ろくがつ', kata: 'ロクガツ', word: 'junio', breakdown: [{ es: 'ju', romaji: 'roku' }, { es: 'nio', romaji: 'gatsu' }] },
  { romaji: 'julio', hira: 'しちがつ', kata: 'シチガツ', word: 'julio', breakdown: [{ es: 'ju', romaji: 'shichi' }, { es: 'lio', romaji: 'gatsu' }] },
  { romaji: 'agosto', hira: 'はちがつ', kata: 'ハチガツ', word: 'agosto', breakdown: [{ es: 'a', romaji: 'hachi' }, { es: 'gosto', romaji: 'gatsu' }] },
  { romaji: 'septiembre', hira: 'くがつ', kata: 'クガツ', word: 'septiembre', breakdown: [{ es: 'sep', romaji: 'ku' }, { es: 'tiembre', romaji: 'gatsu' }] },
  { romaji: 'octubre', hira: 'じゅうがつ', kata: 'ジュウガツ', word: 'octubre', breakdown: [{ es: 'oc', romaji: 'juu' }, { es: 'tubre', romaji: 'gatsu' }] },
  { romaji: 'noviembre', hira: 'じゅういちがつ', kata: 'ジュウイチガツ', word: 'noviembre', breakdown: [{ es: 'no', romaji: 'juuichi' }, { es: 'viembre', romaji: 'gatsu' }] },
  { romaji: 'diciembre', hira: 'じゅうにがつ', kata: 'ジュウニガツ', word: 'diciembre', breakdown: [{ es: 'dic', romaji: 'juuni' }, { es: 'iembre', romaji: 'gatsu' }] },
]

const numbers: KanaData[] = [
  { romaji: '1', hira: 'いち', kata: 'イチ', word: '1', breakdown: [{ es: 'ichi', romaji: 'ichi' }] },
  { romaji: '2', hira: 'に', kata: 'ニ', word: '2', breakdown: [{ es: 'ni', romaji: 'ni' }] },
  { romaji: '3', hira: 'さん', kata: 'サン', word: '3', breakdown: [{ es: 'san', romaji: 'san' }] },
  { romaji: '4', hira: 'よん', kata: 'ヨン', word: '4', breakdown: [{ es: 'yon', romaji: 'yon' }] },
  { romaji: '5', hira: 'ご', kata: 'ゴ', word: '5', breakdown: [{ es: 'go', romaji: 'go' }] },
  { romaji: '6', hira: 'ろく', kata: 'ロク', word: '6', breakdown: [{ es: 'roku', romaji: 'roku' }] },
  { romaji: '7', hira: 'なな', kata: 'ナナ', word: '7', breakdown: [{ es: 'nana', romaji: 'nana' }] },
  { romaji: '8', hira: 'はち', kata: 'ハチ', word: '8', breakdown: [{ es: 'hachi', romaji: 'hachi' }] },
  { romaji: '9', hira: 'きゅう', kata: 'キュウ', word: '9', breakdown: [{ es: 'kyuu', romaji: 'kyuu' }] },
  { romaji: '10', hira: 'じゅう', kata: 'ジュウ', word: '10', breakdown: [{ es: 'juu', romaji: 'juu' }] },
]

export default function JapaneseLearningApp() {
  const [screen, setScreen] = useState<Screen>('main')
  const [currentData, setCurrentData] = useState<KanaData[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedScript, setSelectedScript] = useState<Script>('hira')
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set())
  const [kanjiData, setKanjiData] = useState<KanjiData[]>([])
  const [selectedLevel, setSelectedLevel] = useState<'N5' | 'N4' | 'N3' | 'N2' | 'N1'>('N5')
  const [loading, setLoading] = useState(false)
  const [syntaxMode, setSyntaxMode] = useState<'particles' | 'grammar'>('particles')
  const [selectedSyntaxLevel, setSelectedSyntaxLevel] = useState<string>('N5')
  const [selectedParticle, setSelectedParticle] = useState<string | null>(null)
  const [selectedTopic, setSelectedTopic] = useState<SyntaxTopic | null>(null)
  const [syntaxTopics, setSyntaxTopics] = useState<SyntaxTopic[]>([])
  const [syntaxCurrentIndex, setSyntaxCurrentIndex] = useState(0)

  const fetchKanji = async (level: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/kanji?level=${level}&limit=50`)
      const result = await response.json()
      if (result.success) {
        const kanaData: KanaData[] = result.data.map((kanji: KanjiData) => ({
          romaji: kanji.kanji,
          hira: kanji.kanji,
          kata: kanji.kanji,
          word: kanji.kanji,
          breakdown: [{ es: kanji.meaning, romaji: kanji.onyomi[0] || '' }],
          kanji: kanji.kanji,
          meaning: kanji.meaning,
          onyomi: kanji.onyomi,
          kunyomi: kanji.kunyomi,
        }))
        setCurrentData(kanaData)
      }
    } catch (error) {
      console.error('Error fetching kanji:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSyntaxModeSelect = (mode: 'particles' | 'grammar') => {
    setSyntaxMode(mode)
    setSelectedParticle(null)
    setSelectedTopic(null)
  }

  const handleSyntaxLevelSelect = (level: string) => {
    setSelectedSyntaxLevel(level)
    if (syntaxMode === 'grammar') {
      const levelData = syntaxData.grammar_levels[level]
      if (levelData) {
        setSyntaxTopics(levelData.topics)
        setSyntaxCurrentIndex(0)
        setSelectedTopic(levelData.topics[0])
      }
    }
  }

  const handleParticleSelect = (particleName: string) => {
    setSelectedParticle(particleName)
  }

  const handleTopicSelect = (index: number) => {
    setSyntaxCurrentIndex(index)
    setSelectedTopic(syntaxTopics[index])
  }

  const handleSyntaxNext = () => {
    if (syntaxMode === 'grammar') {
      if (syntaxCurrentIndex < syntaxTopics.length - 1) {
        const newIndex = syntaxCurrentIndex + 1
        setSyntaxCurrentIndex(newIndex)
        setSelectedTopic(syntaxTopics[newIndex])
      }
    }
  }

  const handleSyntaxPrevious = () => {
    if (syntaxMode === 'grammar' && syntaxCurrentIndex > 0) {
      const newIndex = syntaxCurrentIndex - 1
      setSyntaxCurrentIndex(newIndex)
      setSelectedTopic(syntaxTopics[newIndex])
    }
  }

  useEffect(() => {
    if (screen === 'game' && currentData.length > 0 && currentData[0].kanji) {
      // Kanji data is already loaded
    }
  }, [screen, currentData])

  const getDisplayKana = (item: KanaData): string => {
    return selectedScript === 'hira' ? item.hira : item.kata
  }

  const handleModeSelect = (mode: string) => {
    switch(mode) {
      case 'basic':
        setScreen('sub-basic')
        break
      case 'vocab-es':
        setScreen('sub-vocab-es')
        break
      case 'vocab-jp':
        setScreen('sub-vocab-jp')
        break
      case 'dates':
        setScreen('sub-dates')
        break
      case 'numbers':
        setScreen('sub-numbers')
        break
      case 'syntax':
        setScreen('sub-syntax')
        break
    }
  }

  const handleSubModeSelect = (script: Script, mode: Mode) => {
    setSelectedScript(script)
    setScreen('game')
    setCurrentIndex(0)
    setFlippedCards(new Set())

    switch(mode) {
      case 'basic':
        setCurrentData(basicKana)
        break
      case 'vocab-es':
        setCurrentData(vocabES)
        break
      case 'vocab-jp':
        setSelectedLevel('N5')
        fetchKanji('N5')
        setScreen('sub-vocab-jp')
        break
      case 'dates-days':
        setCurrentData(days)
        break
      case 'dates-months':
        setCurrentData(months)
        break
      case 'dates-ordinal':
        setCurrentData([])
        break
      case 'nums-normal':
        setCurrentData(numbers)
        break
      case 'nums-ordinal':
        setCurrentData([])
        break
    }
  }

  const toggleCard = (index: number) => {
    const newFlipped = new Set(flippedCards)
    if (newFlipped.has(index)) {
      newFlipped.delete(index)
    } else {
      newFlipped.add(index)
    }
    setFlippedCards(newFlipped)
  }

  const handleNext = () => {
    if (currentIndex < currentData.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setFlippedCards(new Set())
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setFlippedCards(new Set())
    }
  }

  const handleBack = () => {
    if (screen === 'game') {
      setScreen('main')
    } else {
      setScreen('main')
    }
  }

  const handleReset = () => {
    setScreen('main')
    setCurrentData([])
    setCurrentIndex(0)
    setFlippedCards(new Set())
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b-4 border-red-600 shadow-sm py-4 px-6 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <AnimatePresence mode="wait">
            {screen !== 'main' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Button variant="outline" size="sm" onClick={handleBack} className="gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  Volver
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-4">
            <ToriiGate size="lg" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">NihongoApp</h1>
              <p className="text-sm text-gray-600">Aprende japonés</p>
            </div>
          </div>

          <div className="flex-1" />

          <AnimatePresence mode="wait">
            {screen !== 'main' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <Button variant="ghost" size="sm" onClick={handleReset} className="gap-2">
                  <Home className="h-4 w-4" />
                  Inicio
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Progress Bar */}
      {screen === 'game' && currentData.length > 0 && (
        <div className="bg-white/50 backdrop-blur-sm border-b border-gray-200 py-2 px-6">
          <div className="max-w-6xl mx-auto flex items-center justify-center gap-4">
            <span className="text-sm font-medium text-gray-600">Progreso:</span>
            <div className="flex-1 max-w-md bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                className="bg-red-600 h-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentIndex + 1) / currentData.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className="text-sm font-bold text-red-700">
              {currentIndex + 1} / {currentData.length}
            </span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {screen === 'main' && (
              <motion.div
                key="main"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {/* Mode Cards */}
                <ModeCard
                  title="Silabario"
                  description="Aprende Hiragana y Katakana"
                  icon="あ"
                  onClick={() => handleModeSelect('basic')}
                />
                <ModeCard
                  title="Vocabulario (Español)"
                  description="Palabras comunes en Kana"
                  icon="言葉"
                  onClick={() => handleModeSelect('vocab-es')}
                />
                <ModeCard
                  title="Vocabulario (Japonés)"
                  description="+1000 kanjis JLPT"
                  icon="漢字"
                  onClick={() => handleModeSelect('vocab-jp')}
                />
                <ModeCard
                  title="Fechas"
                  description="Días, meses y fechas"
                  icon="日付"
                  onClick={() => handleModeSelect('dates')}
                />
                <ModeCard
                  title="Números"
                  description="Números y ordinales"
                  icon="数字"
                  onClick={() => handleModeSelect('numbers')}
                />
                <ModeCard
                  title="Sintaxis"
                  description="Gramática y partículas (N5-N1)"
                  icon="文法"
                  onClick={() => handleModeSelect('syntax')}
                />
              </motion.div>
            )}

            {screen === 'sub-basic' && (
              <motion.div
                key="sub-basic"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-6"
              >
                <h2 className="text-2xl font-bold text-gray-900">Elige el silabario</h2>
                <div className="flex gap-6">
                  <ModeCard
                    title="Hiragana"
                    description="ひらがな - Silabario básico"
                    icon="ひらがな"
                    onClick={() => handleSubModeSelect('hira', 'basic')}
                  />
                  <ModeCard
                    title="Katakana"
                    description="カタカナ - Para palabras extranjeras"
                    icon="カタカナ"
                    onClick={() => handleSubModeSelect('kata', 'basic')}
                  />
                </div>
              </motion.div>
            )}

            {screen === 'sub-vocab-es' && (
              <motion.div
                key="sub-vocab-es"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-6"
              >
                <h2 className="text-2xl font-bold text-gray-900">Vocabulario en Español</h2>
                <div className="flex gap-6">
                  <ModeCard
                    title="Hiragana"
                    description="ひらがな"
                    icon="ひらがな"
                    onClick={() => handleSubModeSelect('hira', 'vocab-es')}
                  />
                  <ModeCard
                    title="Katakana"
                    description="カタカナ"
                    icon="カタカナ"
                    onClick={() => handleSubModeSelect('kata', 'vocab-es')}
                  />
                </div>
              </motion.div>
            )}

            {screen === 'sub-dates' && (
              <motion.div
                key="sub-dates"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                <ModeCard
                  title="Días de la semana"
                  description="Lunes a domingo"
                  icon="曜日"
                  onClick={() => handleSubModeSelect('hira', 'dates-days')}
                />
                <ModeCard
                  title="Meses del año"
                  description="Enero a diciembre"
                  icon="月"
                  onClick={() => handleSubModeSelect('hira', 'dates-months')}
                />
                <ModeCard
                  title="Días del mes"
                  description="1º al 31º"
                  icon="日"
                  onClick={() => handleSubModeSelect('hira', 'dates-ordinal')}
                />
              </motion.div>
            )}

            {screen === 'sub-numbers' && (
              <motion.div
                key="sub-numbers"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex gap-6"
              >
                <ModeCard
                  title="Números normales"
                  description="0 al 100"
                  icon="数字"
                  onClick={() => handleSubModeSelect('hira', 'nums-normal')}
                />
                <ModeCard
                  title="Números ordinales"
                  description="1º, 2º, 3º..."
                  icon="番目"
                  onClick={() => handleSubModeSelect('hira', 'nums-ordinal')}
                />
              </motion.div>
            )}

            {screen === 'game' && currentData.length > 0 && (
              <motion.div
                key="game"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-8"
              >
                {/* Word Context */}
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">
                    {currentData[currentIndex].word}
                  </h3>
                  <p className="text-gray-600 text-lg">
                    {currentData[currentIndex].romaji}
                  </p>
                </div>

                {/* Kana Cards */}
                <div className="flex flex-wrap justify-center gap-4">
                  {currentData[currentIndex].breakdown.map((item, index) => {
                    const kana = getDisplayKana(currentData[currentIndex])
                    const kanaChar = kana[index] || kana
                    return (
                      <motion.div
                        key={index}
                        className="relative w-32 h-32 cursor-pointer"
                        style={{ perspective: '1000px' }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => toggleCard(index)}
                      >
                        <motion.div
                          className="w-full h-full relative"
                          style={{ transformStyle: 'preserve-3d' }}
                          animate={{ rotateY: flippedCards.has(index) ? 180 : 0 }}
                          transition={{ duration: 0.6 }}
                        >
                          {/* Front */}
                          <div className="absolute inset-0 bg-white rounded-xl shadow-lg border-2 border-red-600 flex items-center justify-center backface-hidden">
                            <span className="text-5xl font-bold text-gray-900">
                              {kanaChar}
                            </span>
                          </div>

                          {/* Back */}
                          <div className="absolute inset-0 bg-red-600 rounded-xl shadow-lg flex items-center justify-center backface-hidden"
                               style={{ transform: 'rotateY(180deg)' }}>
                            <span className="text-3xl font-bold text-white text-center">
                              {item.es}
                            </span>
                          </div>
                        </motion.div>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4">
                  <Button
                    size="lg"
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    variant="outline"
                  >
                    ← Anterior
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleNext}
                    disabled={currentIndex === currentData.length - 1}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Siguiente →
                  </Button>
                </div>
              </motion.div>
            )}

            {screen === 'sub-vocab-jp' && (
              <motion.div
                key="sub-vocab-jp"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto border-4 border-red-600">
                  <ToriiGate size="lg" className="mx-auto mb-6" />
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Vocabulario en Japonés</h2>
                  <p className="text-lg text-gray-600 mb-6">
                    Selecciona el nivel JLPT para practicar kanjis
                  </p>
                  
                  {loading ? (
                    <div className="flex flex-col items-center justify-center gap-4 py-12">
                      <Loader2 className="h-12 w-12 animate-spin text-red-600" />
                      <p className="text-gray-600">Cargando kanjis...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                      {['N5', 'N4', 'N3', 'N2', 'N1'].map((level) => (
                        <button
                          key={level}
                          onClick={() => {
                            setSelectedLevel(level as any)
                            fetchKanji(level)
                          }}
                          disabled={loading}
                          className={`p-6 rounded-xl border-2 transition-all ${
                            selectedLevel === level
                              ? 'bg-red-600 border-red-600 text-white'
                              : 'bg-white border-red-200 hover:border-red-400 hover:bg-red-50'
                          }`}
                        >
                          <span className="text-2xl font-bold">{level}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-500">
                    Total de kanjis: N5 (127), N4 (146), N3 (228), N2 (283), N1 (281)
                  </div>
                </div>
              </motion.div>
            )}

            {screen === 'sub-syntax' && (
              <motion.div
                key="sub-syntax"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-4xl mx-auto"
              >
                <div className="bg-white rounded-2xl shadow-xl p-8 border-4 border-red-600">
                  <ToriiGate size="lg" className="mx-auto mb-6" />
                  <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Sintaxis Japonesa</h2>
                  <p className="text-lg text-gray-600 mb-6 text-center">
                    Gramática y partículas del japonés (N5-N1)
                  </p>

                  {/* Mode Selection */}
                  <div className="flex gap-4 justify-center mb-8">
                    <button
                      onClick={() => handleSyntaxModeSelect('particles')}
                      className={`px-6 py-3 rounded-lg border-2 transition-all font-medium ${
                        syntaxMode === 'particles'
                          ? 'bg-red-600 border-red-600 text-white'
                          : 'bg-white border-red-200 hover:border-red-400 hover:bg-red-50'
                      }`}
                    >
                      Partículas
                    </button>
                    <button
                      onClick={() => handleSyntaxModeSelect('grammar')}
                      className={`px-6 py-3 rounded-lg border-2 transition-all font-medium ${
                        syntaxMode === 'grammar'
                          ? 'bg-red-600 border-red-600 text-white'
                          : 'bg-white border-red-200 hover:border-red-400 hover:bg-red-50'
                      }`}
                    >
                      Gramática
                    </button>
                  </div>

                  {/* Particles Mode */}
                  {syntaxMode === 'particles' && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Selecciona una partícula</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-96 overflow-y-auto">
                        {Object.entries(syntaxData.particles).map(([particle, data]) => (
                          <button
                            key={particle}
                            onClick={() => handleParticleSelect(particle)}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              selectedParticle === particle
                                ? 'bg-red-600 border-red-600 text-white'
                                : 'bg-white border-red-200 hover:border-red-400 hover:bg-red-50'
                            }`}
                          >
                            <div className="text-2xl font-bold mb-1">{particle}</div>
                            <div className="text-xs opacity-80">{data.jlpt}</div>
                          </button>
                        ))}
                      </div>

                      {/* Particle Details */}
                      {selectedParticle && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-6 p-6 bg-red-50 rounded-xl border-2 border-red-200"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-2xl font-bold text-red-700">{selectedParticle}</h4>
                            <span className="px-3 py-1 bg-red-600 text-white rounded-full text-sm font-medium">
                              {syntaxData.particles[selectedParticle].jlpt}
                            </span>
                          </div>
                          <p className="text-lg font-semibold text-gray-800 mb-2">
                            {syntaxData.particles[selectedParticle].meaning}
                          </p>
                          <p className="text-gray-700 mb-4">
                            {syntaxData.particles[selectedParticle].usage}
                          </p>
                          <h5 className="font-bold text-gray-900 mb-3">Ejemplos:</h5>
                          <div className="space-y-3">
                            {syntaxData.particles[selectedParticle].examples.map((example, index) => (
                              <div key={index} className="bg-white p-4 rounded-lg border border-red-200">
                                <p className="text-xl font-bold text-gray-900 mb-1">{example.japanese}</p>
                                <p className="text-red-600 italic mb-1">{example.romaji}</p>
                                <p className="text-gray-700 mb-1">{example.translation}</p>
                                <p className="text-sm text-gray-600 italic">{example.explanation}</p>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* Grammar Mode */}
                  {syntaxMode === 'grammar' && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Selecciona el nivel JLPT</h3>
                      <div className="grid grid-cols-5 gap-3 mb-8">
                        {['N5', 'N4', 'N3', 'N2', 'N1'].map((level) => (
                          <button
                            key={level}
                            onClick={() => handleSyntaxLevelSelect(level)}
                            className={`p-4 rounded-lg border-2 transition-all font-bold ${
                              selectedSyntaxLevel === level
                                ? 'bg-red-600 border-red-600 text-white'
                                : 'bg-white border-red-200 hover:border-red-400 hover:bg-red-50'
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>

                      {/* Topics List */}
                      {selectedSyntaxLevel && syntaxData.grammar_levels[selectedSyntaxLevel] && (
                        <div>
                          <h4 className="text-lg font-bold text-gray-900 mb-4">
                            {syntaxData.grammar_levels[selectedSyntaxLevel].title}
                          </h4>
                          <div className="space-y-3 max-h-96 overflow-y-auto">
                            {syntaxData.grammar_levels[selectedSyntaxLevel].topics.map((topic, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                              >
                                <button
                                  onClick={() => handleTopicSelect(index)}
                                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                                    selectedTopic?.topic === topic.topic
                                      ? 'bg-red-600 border-red-600 text-white'
                                      : 'bg-white border-red-200 hover:border-red-400 hover:bg-red-50'
                                  }`}
                                >
                                  <p className="font-bold mb-1">{topic.topic}</p>
                                  <p className="text-sm opacity-80 line-clamp-2">{topic.explanation}</p>
                                </button>
                              </motion.div>
                            ))}
                          </div>

                          {/* Topic Details */}
                          {selectedTopic && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-6 p-6 bg-red-50 rounded-xl border-2 border-red-200"
                            >
                              <h5 className="text-2xl font-bold text-red-700 mb-3">{selectedTopic.topic}</h5>
                              <p className="text-gray-700 mb-4">{selectedTopic.explanation}</p>
                              <h6 className="font-bold text-gray-900 mb-3">Ejemplos:</h6>
                              <div className="space-y-3">
                                {selectedTopic.examples.map((example, index) => (
                                  <div key={index} className="bg-white p-4 rounded-lg border border-red-200">
                                    <p className="text-xl font-bold text-gray-900 mb-1">{example.japanese}</p>
                                    <p className="text-red-600 italic mb-1">{example.romaji}</p>
                                    <p className="text-gray-700">{example.translation}</p>
                                    {example.explanation && (
                                      <p className="text-sm text-gray-600 italic mt-1">{example.explanation}</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-red-600 text-white py-4 mt-auto">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm">
            © 2024 NihongoApp - Aprende japonés
          </p>
        </div>
      </footer>
    </div>
  )
}

interface ModeCardProps {
  title: string
  description: string
  icon: string
  onClick: () => void
}

function ModeCard({ title, description, icon, onClick }: ModeCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <Card className="relative overflow-hidden border-2 border-red-200 hover:border-red-600 transition-all shadow-md hover:shadow-xl h-48 flex flex-col">
        {/* Left Torii Pillar */}
        <div className="absolute left-0 top-0 bottom-0 w-2 z-10">
          <svg
            width="8"
            height="100%"
            viewBox="0 0 8 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="0" y="0" width="8" height="200" fill="#BC002D" rx="1" />
          </svg>
        </div>

        {/* Right Torii Pillar */}
        <div className="absolute right-0 top-0 bottom-0 w-2 z-10">
          <svg
            width="8"
            height="100%"
            viewBox="0 0 8 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="0" y="0" width="8" height="200" fill="#BC002D" rx="1" />
          </svg>
        </div>

        {/* Top Torii Decoration */}
        <div className="bg-gradient-to-b from-red-600 to-red-700 h-10 flex items-center justify-center relative">
          <ToriiGate size="sm" showPillars={false} />
        </div>

        <div className="flex-1 p-4 flex flex-col items-center justify-center text-center px-6">
          <span className="text-4xl mb-2">{icon}</span>
          <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </Card>
    </motion.div>
  )
}
