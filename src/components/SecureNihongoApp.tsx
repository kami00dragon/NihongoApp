import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Users, Trophy, Zap } from 'lucide-react';

// Secure kana data (embedded to prevent external manipulation)
const HIRAGANA_DATA = [
  { character: 'あ', romaji: 'a', type: 'hiragana' },
  { character: 'か', romaji: 'ka', type: 'hiragana' },
  { character: 'さ', romaji: 'sa', type: 'hiragana' },
  { character: 'た', romaji: 'ta', type: 'hiragana' },
  { character: 'な', romaji: 'na', type: 'hiragana' },
  { character: 'は', romaji: 'ha', type: 'hiragana' },
  { character: 'ま', romaji: 'ma', type: 'hiragana' },
  { character: 'や', romaji: 'ya', type: 'hiragana' },
  { character: 'ら', romaji: 'ra', type: 'hiragana' },
  { character: 'わ', romaji: 'wa', type: 'hiragana' },
  { character: 'ん', romaji: 'n', type: 'hiragana' },
];

const KATAKANA_DATA = [
  { character: 'ア', romaji: 'a', type: 'katakana' },
  { character: 'カ', romaji: 'ka', type: 'katakana' },
  { character: 'サ', romaji: 'sa', type: 'katakana' },
  { character: 'タ', romaji: 'ta', type: 'katakana' },
  { character: 'ナ', romaji: 'na', type: 'katakana' },
  { character: 'ハ', romaji: 'ha', type: 'katakana' },
  { character: 'マ', romaji: 'ma', type: 'katakana' },
  { character: 'ヤ', romaji: 'ya', type: 'katakana' },
  { character: 'ラ', romaji: 'ra', type: 'katakana' },
  { character: 'ワ', romaji: 'wa', type: 'katakana' },
  { character: 'ン', romaji: 'n', type: 'katakana' },
];

const VOCAB_DATA = [
  { japanese: 'こんにちは', romaji: 'konnichiwa', english: 'Hello', level: 'N5' },
  { japanese: 'ありがとう', romaji: 'arigatou', english: 'Thank you', level: 'N5' },
  { japanese: '学校', romaji: 'gakkou', english: 'School', level: 'N5' },
  { japanese: '学生', romaji: 'gakusei', english: 'Student', level: 'N5' },
  { japanese: '先生', romaji: 'sensei', english: 'Teacher', level: 'N5' },
  { japanese: '友達', romaji: 'tomodachi', english: 'Friend', level: 'N5' },
];

export default function SecureNihongoApp() {
  const [activeTab, setActiveTab] = useState('kana');
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [studyTime, setStudyTime] = useState(0);

  // Study timer
  useEffect(() => {
    const timer = setInterval(() => {
      setStudyTime(prev => prev + 1);
    }, 60000); // Increment every minute
    return () => clearInterval(timer);
  }, []);

  const getCurrentData = () => {
    switch (activeTab) {
      case 'hiragana': return HIRAGANA_DATA;
      case 'katakana': return KATAKANA_DATA;
      case 'vocabulary': return VOCAB_DATA;
      default: return HIRAGANA_DATA;
    }
  };

  const handleNext = () => {
    const data = getCurrentData();
    setCurrentCard((prev) => (prev + 1) % data.length);
    setShowAnswer(false);
  };

  const handlePrevious = () => {
    const data = getCurrentData();
    setCurrentCard((prev) => (prev - 1 + data.length) % data.length);
    setShowAnswer(false);
  };

  const handleCorrect = () => {
    setScore(prev => prev + 1);
    setAttempts(prev => prev + 1);
    handleNext();
  };

  const handleIncorrect = () => {
    setAttempts(prev => prev + 1);
    handleNext();
  };

  const getAccuracy = () => {
    return attempts > 0 ? Math.round((score / attempts) * 100) : 0;
  };

  const currentData = getCurrentData();
  const currentItem = currentData[currentCard];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">NihongoApp Secure</h1>
          <p className="text-gray-600">Learn Japanese Safely</p>
          <div className="flex justify-center gap-4 mt-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Score: {score}/{attempts}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {getAccuracy()}% Accuracy
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Trophy className="w-3 h-3" />
              {Math.floor(studyTime)}min
            </Badge>
          </div>
        </header>

        {/* Progress */}
        <div className="mb-6">
          <Progress value={getAccuracy()} className="h-2" />
          <p className="text-center text-sm text-gray-600 mt-1">
            Learning Progress: {getAccuracy()}%
          </p>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="hiragana">Hiragana</TabsTrigger>
            <TabsTrigger value="katakana">Katakana</TabsTrigger>
            <TabsTrigger value="vocabulary">Vocabulary</TabsTrigger>
          </TabsList>

          <TabsContent value="hiragana" className="mt-6">
            <StudyCard
              item={currentItem}
              showAnswer={showAnswer}
              setShowAnswer={setShowAnswer}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onCorrect={handleCorrect}
              onIncorrect={handleIncorrect}
              currentIndex={currentCard}
              totalItems={currentData.length}
              type="kana"
            />
          </TabsContent>

          <TabsContent value="katakana" className="mt-6">
            <StudyCard
              item={currentItem}
              showAnswer={showAnswer}
              setShowAnswer={setShowAnswer}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onCorrect={handleCorrect}
              onIncorrect={handleIncorrect}
              currentIndex={currentCard}
              totalItems={currentData.length}
              type="kana"
            />
          </TabsContent>

          <TabsContent value="vocabulary" className="mt-6">
            <StudyCard
              item={currentItem}
              showAnswer={showAnswer}
              setShowAnswer={setShowAnswer}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onCorrect={handleCorrect}
              onIncorrect={handleIncorrect}
              currentIndex={currentCard}
              totalItems={currentData.length}
              type="vocabulary"
            />
          </TabsContent>
        </Tabs>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Attempts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attempts}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Correct Answers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{score}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Study Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.floor(studyTime)}m</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface StudyCardProps {
  item: any;
  showAnswer: boolean;
  setShowAnswer: (show: boolean) => void;
  onPrevious: () => void;
  onNext: () => void;
  onCorrect: () => void;
  onIncorrect: () => void;
  currentIndex: number;
  totalItems: number;
  type: 'kana' | 'vocabulary';
}

function StudyCard({
  item,
  showAnswer,
  setShowAnswer,
  onPrevious,
  onNext,
  onCorrect,
  onIncorrect,
  currentIndex,
  totalItems,
  type
}: StudyCardProps) {
  const displayContent = type === 'kana' 
    ? { main: item.character, sub: item.romaji }
    : { main: item.japanese, sub: `${item.romaji} - ${item.english}` };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center text-lg">
          {currentIndex + 1} / {totalItems}
        </CardTitle>
        <CardDescription className="text-center">
          {type === 'vocabulary' && item.level && (
            <Badge variant="secondary">{item.level}</Badge>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Display */}
        <div className="text-center py-12">
          <div className="text-6xl font-bold mb-4">{displayContent.main}</div>
          {showAnswer && (
            <div className="text-xl text-gray-600 animate-fade-in">
              {displayContent.sub}
            </div>
          )}
        </div>

        {/* Answer Button */}
        {!showAnswer ? (
          <Button 
            onClick={() => setShowAnswer(true)} 
            className="w-full"
            size="lg"
          >
            Show Answer
          </Button>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={onIncorrect} 
              variant="destructive"
              size="lg"
            >
              Incorrect
            </Button>
            <Button 
              onClick={onCorrect} 
              variant="default"
              size="lg"
            >
              Correct
            </Button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <Button onClick={onPrevious} variant="outline">
            Previous
          </Button>
          <Button onClick={onNext} variant="outline">
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}