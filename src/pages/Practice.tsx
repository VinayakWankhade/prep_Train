import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Brain, Award, Timer, Search, Filter, Star, TrendingUp, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { Navigation } from "@/components/layout/Navigation";

interface Question {
  id: string;
  title: string;
  category: 'UPSC' | 'NDA' | 'DSA' | 'Development';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  type: 'MCQ' | 'Subjective' | 'Coding';
  tags: string[];
  isRecommended: boolean;
  isPopular: boolean;
  question: string;
  options?: string[];
  correctAnswer?: string;
  explanation: string;
  attempts: number;
  successRate: number;
}

const PracticePage = () => {
  const [questions] = useState<Question[]>([
    {
      id: '1',
      title: 'Array Manipulation in JavaScript',
      category: 'Development',
      difficulty: 'Medium',
      type: 'MCQ',
      tags: ['JavaScript', 'Arrays', 'ES6'],
      isRecommended: true,
      isPopular: false,
      question: 'Which method returns a new array with all elements that pass a test implemented by the provided function?',
      options: ['map()', 'filter()', 'reduce()', 'forEach()'],
      correctAnswer: 'filter()',
      explanation: 'The filter() method creates a new array with all elements that pass the test implemented by the provided function.',
      attempts: 245,
      successRate: 78
    },
    {
      id: '2',
      title: 'Indian Independence Movement',
      category: 'UPSC',
      difficulty: 'Hard',
      type: 'Subjective',
      tags: ['History', 'Independence', 'Gandhi'],
      isRecommended: false,
      isPopular: true,
      question: 'Analyze the role of Mahatma Gandhi in the Indian Independence Movement and explain how his philosophy influenced the freedom struggle.',
      explanation: 'Gandhi\'s philosophy of non-violence and civil disobedience was instrumental in mobilizing masses...',
      attempts: 89,
      successRate: 65
    },
    {
      id: '3',
      title: 'Binary Search Tree Implementation',
      category: 'DSA',
      difficulty: 'Hard',
      type: 'Coding',
      tags: ['Trees', 'Data Structures', 'Algorithms'],
      isRecommended: true,
      isPopular: true,
      question: 'Implement a Binary Search Tree with insert, search, and delete operations.',
      explanation: 'A BST is a tree data structure where left child is smaller and right child is larger than parent...',
      attempts: 156,
      successRate: 45
    }
  ]);

  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'UPSC' | 'NDA' | 'DSA' | 'Development'>('All');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [isAttemptDialogOpen, setIsAttemptDialogOpen] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'All' || question.category === categoryFilter;
    const matchesDifficulty = difficultyFilter === 'All' || question.difficulty === difficultyFilter;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-success/10 text-success border-success/20';
      case 'Medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'Hard': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'UPSC': return 'bg-primary/10 text-primary border-primary/20';
      case 'NDA': return 'bg-focus/10 text-focus border-focus/20';
      case 'DSA': return 'bg-success/10 text-success border-success/20';
      case 'Development': return 'bg-warning/10 text-warning border-warning/20';
      default: return 'bg-muted';
    }
  };

  const handleAttempt = (question: Question) => {
    setSelectedQuestion(question);
    setUserAnswer('');
    setShowResult(false);
    setIsAttemptDialogOpen(true);
  };

  const submitAnswer = () => {
    setShowResult(true);
  };

  const isCorrect = selectedQuestion?.type === 'MCQ' && userAnswer === selectedQuestion?.correctAnswer;

  return (
    <div className="min-h-screen bg-gradient-surface">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text-primary mb-2">Practice Questions</h1>
          <p className="text-text-secondary">Master concepts with curated questions from various domains</p>
        </div>

        {/* Search & Filters */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search questions, topics, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Category:</span>
            </div>
            {['All', 'UPSC', 'NDA', 'DSA', 'Development'].map((category) => (
              <Button
                key={category}
                variant={categoryFilter === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCategoryFilter(category as any)}
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium">Difficulty:</span>
            {['All', 'Easy', 'Medium', 'Hard'].map((difficulty) => (
              <Button
                key={difficulty}
                variant={difficultyFilter === difficulty ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDifficultyFilter(difficulty as any)}
              >
                {difficulty}
              </Button>
            ))}
          </div>
        </div>

        {/* Questions Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredQuestions.map((question) => (
            <Card key={question.id} className="card-interactive group">
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <CardTitle className="text-lg line-clamp-2">{question.title}</CardTitle>
                  <div className="flex gap-1">
                    {question.isRecommended && (
                      <Badge className="bg-primary/10 text-primary border-primary/20">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Recommended
                      </Badge>
                    )}
                    {question.isPopular && (
                      <Badge className="bg-focus/10 text-focus border-focus/20">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Badge className={getCategoryColor(question.category)}>
                    {question.category}
                  </Badge>
                  <Badge className={getDifficultyColor(question.difficulty)}>
                    {question.difficulty}
                  </Badge>
                  <Badge variant="secondary">
                    {question.type}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="flex flex-wrap gap-1">
                    {question.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{question.attempts} attempts</span>
                    <span className={cn(
                      "font-medium",
                      question.successRate >= 70 ? "text-success" : 
                      question.successRate >= 50 ? "text-warning" : "text-destructive"
                    )}>
                      {question.successRate}% success
                    </span>
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleAttempt(question)}
                  className="w-full gap-2"
                >
                  <Play className="h-4 w-4" />
                  Attempt Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Attempt Dialog */}
        <Dialog open={isAttemptDialogOpen} onOpenChange={setIsAttemptDialogOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
            {selectedQuestion && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    {selectedQuestion.title}
                  </DialogTitle>
                  <div className="flex gap-2 mt-2">
                    <Badge className={getCategoryColor(selectedQuestion.category)}>
                      {selectedQuestion.category}
                    </Badge>
                    <Badge className={getDifficultyColor(selectedQuestion.difficulty)}>
                      {selectedQuestion.difficulty}
                    </Badge>
                  </div>
                </DialogHeader>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Question:</h3>
                    <p className="text-text-secondary">{selectedQuestion.question}</p>
                  </div>

                  {!showResult && (
                    <div>
                      <h3 className="font-semibold mb-3">Your Answer:</h3>
                      {selectedQuestion.type === 'MCQ' && selectedQuestion.options ? (
                        <RadioGroup value={userAnswer} onValueChange={setUserAnswer}>
                          {selectedQuestion.options.map((option, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <RadioGroupItem value={option} id={`option-${index}`} />
                              <Label htmlFor={`option-${index}`}>{option}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      ) : (
                        <Textarea
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          placeholder="Enter your answer here..."
                          rows={5}
                        />
                      )}
                    </div>
                  )}

                  {showResult && (
                    <div className="space-y-4">
                      {selectedQuestion.type === 'MCQ' && (
                        <div className={cn(
                          "p-4 rounded-lg border",
                          isCorrect 
                            ? "bg-success/10 border-success/20 text-success" 
                            : "bg-destructive/10 border-destructive/20 text-destructive"
                        )}>
                          <div className="flex items-center gap-2 font-semibold mb-2">
                            <Award className="h-5 w-5" />
                            {isCorrect ? 'Correct!' : 'Incorrect'}
                          </div>
                          {!isCorrect && (
                            <p>Correct answer: <strong>{selectedQuestion.correctAnswer}</strong></p>
                          )}
                        </div>
                      )}
                      
                      <div>
                        <h3 className="font-semibold mb-2">Explanation:</h3>
                        <p className="text-text-secondary">{selectedQuestion.explanation}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {!showResult ? (
                      <Button 
                        onClick={submitAnswer} 
                        disabled={!userAnswer.trim()}
                        className="flex-1"
                      >
                        Submit Answer
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => setIsAttemptDialogOpen(false)}
                        className="flex-1"
                      >
                        Close
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {filteredQuestions.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <BookOpen className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">No questions found</h3>
            <p className="text-text-secondary">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PracticePage;