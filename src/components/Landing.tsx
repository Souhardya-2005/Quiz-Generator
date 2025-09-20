import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { BookOpen } from "lucide-react";

import {
  FaAtom,
  FaFlask,
  FaCalculator,
  FaDna,
  FaLandmark,
  FaGlobeAsia,
  FaBookOpen,
  FaLaptopCode,
} from "react-icons/fa";

interface LandingProps {
  onStartQuiz: (subject: string, questionCount: number) => void;
}

export const subjects = [
  { id: "physics", name: "Physics", icon: FaAtom, color: "bg-blue-50 border-blue-200 hover:border-blue-500", iconColor: "text-blue-500" },
  { id: "chemistry", name: "Chemistry", icon: FaFlask, color: "bg-green-50 border-green-200 hover:border-green-500", iconColor: "text-green-500" },
  { id: "mathematics", name: "Mathematics", icon: FaCalculator, color: "bg-purple-50 border-purple-200 hover:border-purple-500", iconColor: "text-purple-500" },
  { id: "computer", name: "Computer", icon: FaLaptopCode, color: "bg-indigo-50 border-indigo-200 hover:border-indigo-500", iconColor: "text-indigo-500" },
  { id: "biology", name: "Biology", icon: FaDna, color: "bg-emerald-50 border-emerald-200 hover:border-emerald-500", iconColor: "text-emerald-500" },
  { id: "history", name: "History", icon: FaLandmark, color: "bg-amber-50 border-amber-200 hover:border-amber-500", iconColor: "text-amber-500" },
  { id: "geography", name: "Geography", icon: FaGlobeAsia, color: "bg-cyan-50 border-cyan-200 hover:border-cyan-500", iconColor: "text-cyan-500" },
  { id: "english", name: "English", icon: FaBookOpen, color: "bg-rose-50 border-rose-200 hover:border-rose-500", iconColor: "text-rose-500" }
  
];

export default function Landing({ onStartQuiz }: LandingProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [questionCount, setQuestionCount] = useState([10]);

  const handleStartQuiz = () => {
    if (selectedSubject) {
      onStartQuiz(selectedSubject, questionCount[0]);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-10 w-10 text-primary" />
            <h1 className="text-5xl font-bold text-foreground">Question Pitcher</h1>
          </div>
          <p className="text-xl text-muted-foreground">Pitch your knowledge, test your skills.</p>
        </div>

        {/* Subject Selection */}
        <Card className="p-8 mb-8 shadow-lg animate-slide-up">
          <h2 className="text-2xl font-semibold text-center mb-8">Choose Your Subject</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {subjects.map((subject) => {
              const Icon = subject.icon;
              return (
                <button
                  key={subject.id}
                  onClick={() => setSelectedSubject(subject.id)}
                  className={`p-6 rounded-xl border-2 transition-all hover:scale-105 ${
                    selectedSubject === subject.id
                      ? "border-primary bg-primary/10 shadow-md"
                      : `${subject.color} hover:shadow-md`
                  }`}
                >
                  {/* ✅ Apply the subject-specific color here */}
                  <Icon className={`h-8 w-8 mx-auto mb-3 ${subject.iconColor}`} />
                  <p className="font-medium text-foreground text-center">{subject.name}</p>
                </button>
              );
            })}
          </div>

          {/* Question Count Selector */}
          <div className="max-w-md mx-auto mb-8">
            <h3 className="text-lg font-medium mb-4 text-center">Number of Questions</h3>
            <div className="space-y-4">
              <Slider
                value={questionCount}
                onValueChange={setQuestionCount}
                max={20}
                min={5}
                step={1}
                className="w-full"
              />
              <div className="text-center">
                <span className="text-2xl font-bold text-primary">{questionCount[0]}</span>
                <span className="text-muted-foreground ml-2">questions</span>
              </div>
            </div>
          </div>

          {/* Generate Quiz Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleStartQuiz}
              disabled={!selectedSubject}
              variant="generate"
              size="lg"
              className="min-w-48"
            >
              Generate Quiz
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
