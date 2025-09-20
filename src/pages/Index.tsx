import { useState } from "react";
import Landing from "@/components/Landing";
import Quiz from "@/components/Quiz";
import Results from "@/components/Results";

type AppState = 'landing' | 'quiz' | 'results';

interface QuizConfig {
  subject: string;
  questionCount: number;
}

interface QuizResults {
  score: number;
  total: number;
}

const Index = () => {
  const [appState, setAppState] = useState<AppState>('landing');
  const [quizConfig, setQuizConfig] = useState<QuizConfig>({ subject: '', questionCount: 10 });
  const [quizResults, setQuizResults] = useState<QuizResults>({ score: 0, total: 0 });

  const handleStartQuiz = (subject: string, questionCount: number) => {
    setQuizConfig({ subject, questionCount });
    setAppState('quiz');
  };

  const handleQuizComplete = (score: number, total: number) => {
    setQuizResults({ score, total });
    setAppState('results');
  };

  const handleRestart = () => {
    setAppState('quiz');
  };

  const handleBackToTopics = () => {
    setAppState('landing');
  };

  return (
    <div className="min-h-screen bg-background">
      {appState === 'landing' && (
        <Landing onStartQuiz={handleStartQuiz} />
      )}
      
      {appState === 'quiz' && (
        <Quiz
          subject={quizConfig.subject}
          questionCount={quizConfig.questionCount}
          onComplete={handleQuizComplete}
          onBack={handleBackToTopics}
        />
      )}
      
      {appState === 'results' && (
        <Results
          score={quizResults.score}
          total={quizResults.total}
          subject={quizConfig.subject}
          onRestart={handleRestart}
          onBackToTopics={handleBackToTopics}
        />
      )}
    </div>
  );
};

export default Index;
