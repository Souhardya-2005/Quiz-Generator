import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, RotateCcw, ArrowLeft, Target, CheckCircle, XCircle } from "lucide-react";

interface ResultsProps {
  score: number;
  total: number;
  subject: string;
  onRestart: () => void;
  onBackToTopics: () => void;
}

export default function Results({ score, total, subject, onRestart, onBackToTopics }: ResultsProps) {
  const percentage = Math.round((score / total) * 100);
  
  const getFeedbackMessage = (percentage: number) => {
    if (percentage >= 90) return "Outstanding! You're a true expert!";
    if (percentage >= 80) return "Excellent work! You really know your stuff!";
    if (percentage >= 70) return "Great job! You have a solid understanding!";
    if (percentage >= 60) return "Good effort! Keep practicing to improve!";
    if (percentage >= 50) return "Not bad! A bit more study will help!";
    return "Keep practicing! You'll get there!";
  };

  const getFeedbackIcon = (percentage: number) => {
    if (percentage >= 70) return <Trophy className="h-16 w-16 text-yellow-500" />;
    if (percentage >= 50) return <Target className="h-16 w-16 text-blue-500" />;
    return <RotateCcw className="h-16 w-16 text-primary" />;
  };

  const getFeedbackColor = (percentage: number) => {
    if (percentage >= 70) return "text-yellow-600";
    if (percentage >= 50) return "text-blue-600";
    return "text-primary";
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card className="p-8 shadow-lg text-center animate-scale-in">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            {getFeedbackIcon(percentage)}
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold mb-2">Quiz Complete!</h1>
          <p className="text-xl text-muted-foreground mb-8">
            {subject.charAt(0).toUpperCase() + subject.slice(1)} Quiz Results
          </p>

          {/* Score Display */}
          <div className="bg-secondary rounded-xl p-8 mb-8">
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{total}</div>
                <div className="text-sm text-muted-foreground">Total Questions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-success mb-2 flex items-center justify-center gap-2">
                  <CheckCircle className="h-8 w-8" />
                  {score}
                </div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-destructive mb-2 flex items-center justify-center gap-2">
                  <XCircle className="h-8 w-8" />
                  {total - score}
                </div>
                <div className="text-sm text-muted-foreground">Incorrect</div>
              </div>
            </div>

            {/* Percentage Score */}
            <div className="border-t pt-6">
              <div className={`text-6xl font-bold mb-2 ${getFeedbackColor(percentage)}`}>
                {percentage}%
              </div>
              <div className="text-lg text-muted-foreground">Final Score</div>
            </div>
          </div>

          {/* Feedback Message */}
          <div className="mb-8">
            <p className="text-xl font-medium text-foreground">
              {getFeedbackMessage(percentage)}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={onRestart}
              variant="generate"
              size="lg"
              className="min-w-40"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Try Again
            </Button>
            <Button
              onClick={onBackToTopics}
              variant="outline"
              size="lg"
              className="min-w-40"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Topics
            </Button>
          </div>

          {/* Progress Indicator */}
          <div className="mt-8 pt-6 border-t">
            <div className="flex justify-center items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <div className="h-1 w-8 bg-muted rounded"></div>
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <div className="h-1 w-8 bg-muted rounded"></div>
              <div className="h-2 w-2 rounded-full bg-primary"></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Ready for your next challenge?
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}