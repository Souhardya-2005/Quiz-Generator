import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, ChevronLeft, CheckCircle, XCircle } from "lucide-react";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  userAnswer?: number | null;
}

interface ReviewProps {
  questions: Question[];
  userAnswers: (number | null)[];
  subject: string;
  onBackToResults: () => void;
}

export default function Review({ questions, userAnswers, subject, onBackToResults }: ReviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentQuestion = questions[currentIndex];
  const userAnswer = userAnswers[currentIndex];
  const isCorrect = userAnswer === currentQuestion?.correctAnswer;

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 text-center">
          <p className="text-lg text-muted-foreground">No questions to review.</p>
          <Button onClick={onBackToResults} className="mt-4">
            Back to Results
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <Button
            onClick={onBackToResults}
            variant="outline"
            className="hover-scale"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Results
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Review Mode</h1>
            <p className="text-muted-foreground">
              {subject.charAt(0).toUpperCase() + subject.slice(1)} Quiz
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            Question {currentIndex + 1} of {questions.length}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="w-full bg-secondary rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="max-w-4xl mx-auto">
        <Card className="p-8 shadow-lg animate-fade-in">
          {/* Question */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground leading-relaxed">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="space-y-4 mb-8">
            {currentQuestion.options.map((option, index) => {
              const isUserAnswer = userAnswer === index;
              const isCorrectAnswer = index === currentQuestion.correctAnswer;
              
              let className = "w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ";
              
              if (isCorrectAnswer) {
                className += "border-success bg-success-lighter text-success-foreground ";
              } else if (isUserAnswer && !isCorrect) {
                className += "border-destructive bg-destructive-light text-destructive-foreground ";
              } else {
                className += "border-border bg-card text-card-foreground ";
              }

              return (
                <div key={index} className={className}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option}</span>
                    <div className="flex items-center gap-2">
                      {isCorrectAnswer && (
                        <CheckCircle className="h-5 w-5 text-success" />
                      )}
                      {isUserAnswer && !isCorrect && (
                        <XCircle className="h-5 w-5 text-destructive" />
                      )}
                      {isUserAnswer && (
                        <span className="text-xs font-medium px-2 py-1 rounded bg-primary/10 text-primary">
                          Your Answer
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Explanation */}
          <div className="bg-secondary rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-foreground mb-2">Explanation:</h3>
            <p className="text-muted-foreground leading-relaxed">
              {currentQuestion.explanation}
            </p>
          </div>

          {/* Status */}
          <div className="flex items-center justify-center mb-8">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              isCorrect 
                ? 'bg-success-lighter text-success' 
                : 'bg-destructive-light text-destructive'
            }`}>
              {isCorrect ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Correct Answer
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4" />
                  Incorrect Answer
                </>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              onClick={prevQuestion}
              disabled={currentIndex === 0}
              variant="outline"
              className="hover-scale"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentIndex
                      ? 'bg-primary scale-125'
                      : userAnswers[index] === questions[index]?.correctAnswer
                      ? 'bg-success'
                      : 'bg-destructive'
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={nextQuestion}
              disabled={currentIndex === questions.length - 1}
              variant="outline"
              className="hover-scale"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}