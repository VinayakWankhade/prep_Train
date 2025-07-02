import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Play, Pause, RotateCcw, Target, Clock, Flame, Shield, Eye, History } from "lucide-react";
import { cn } from "@/lib/utils";

interface FocusSession {
  id: string;
  duration: number;
  startTime: string;
  endTime: string;
  distractionsAvoided: number;
}

interface DistractionToggle {
  id: string;
  name: string;
  icon: React.ReactNode;
  enabled: boolean;
  color: string;
}

const FocusPage = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(25);
  const [sessions, setSessions] = useState<FocusSession[]>([
    {
      id: '1',
      duration: 25,
      startTime: '2024-07-01T10:00:00Z',
      endTime: '2024-07-01T10:25:00Z',
      distractionsAvoided: 3
    }
  ]);

  const [distractions, setDistractions] = useState<DistractionToggle[]>([
    { id: '1', name: 'YouTube', icon: '🎥', enabled: true, color: 'text-red-500' },
    { id: '2', name: 'Instagram', icon: '📷', enabled: true, color: 'text-pink-500' },
    { id: '3', name: 'WhatsApp', icon: '💬', enabled: false, color: 'text-green-500' },
    { id: '4', name: 'Twitter', icon: '🐦', enabled: true, color: 'text-blue-500' },
    { id: '5', name: 'TikTok', icon: '🎵', enabled: false, color: 'text-purple-500' },
  ]);

  const totalFocusTime = sessions.reduce((acc, session) => acc + session.duration, 0);
  const totalDistractions = sessions.reduce((acc, session) => acc + session.distractionsAvoided, 0);
  const currentStreak = 7; // Mock data

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Session completed
      const newSession: FocusSession = {
        id: Date.now().toString(),
        duration: sessionDuration,
        startTime: new Date(Date.now() - sessionDuration * 60 * 1000).toISOString(),
        endTime: new Date().toISOString(),
        distractionsAvoided: distractions.filter(d => d.enabled).length
      };
      setSessions([...sessions, newSession]);
      setIsActive(false);
      resetTimer();
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, sessionDuration, sessions, distractions]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setTimeLeft(sessionDuration * 60);
    setIsActive(false);
  };

  const setTimer = (minutes: number) => {
    setSessionDuration(minutes);
    setTimeLeft(minutes * 60);
    setIsActive(false);
  };

  const toggleDistraction = (id: string) => {
    setDistractions(distractions.map(d => 
      d.id === id ? { ...d, enabled: !d.enabled } : d
    ));
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = ((sessionDuration * 60 - timeLeft) / (sessionDuration * 60)) * 100;

  return (
    <div className="min-h-screen bg-gradient-surface dark:bg-gradient-surface">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-text-primary mb-2">Focus Mode</h1>
          <p className="text-text-secondary">Eliminate distractions and boost your productivity</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Timer Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pomodoro Timer */}
            <Card className="text-center card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <Target className="h-6 w-6 text-primary" />
                  Pomodoro Timer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Timer Display */}
                <div className="relative">
                  <div className="mx-auto w-64 h-64 relative">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        className="text-muted opacity-20"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 45}`}
                        strokeDashoffset={`${2 * Math.PI * 45 * (1 - progressPercentage / 100)}`}
                        className="text-primary transition-all duration-1000 ease-out"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl font-mono font-bold text-text-primary">
                          {formatTime(timeLeft)}
                        </div>
                        <div className="text-sm text-text-secondary mt-1">
                          {isActive ? 'Focus Time' : 'Ready to Start'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timer Controls */}
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={toggleTimer}
                    size="lg"
                    className={cn(
                      "gap-2 px-8",
                      isActive 
                        ? "bg-warning text-warning-foreground" 
                        : "bg-gradient-primary text-white shadow-glow"
                    )}
                  >
                    {isActive ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    {isActive ? 'Pause' : 'Start'}
                  </Button>
                  <Button variant="outline" onClick={resetTimer} size="lg" className="gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </Button>
                </div>

                {/* Duration Presets */}
                <div className="flex justify-center gap-2">
                  {[15, 25, 45, 60].map((minutes) => (
                    <Button
                      key={minutes}
                      variant={sessionDuration === minutes ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTimer(minutes)}
                      disabled={isActive}
                    >
                      {minutes}m
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Distraction Blockers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-focus" />
                  Distraction Blockers
                </CardTitle>
                <p className="text-sm text-text-secondary">
                  Toggle the apps and sites you want to avoid during focus sessions
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {distractions.map((distraction) => (
                    <div
                      key={distraction.id}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-lg border transition-all",
                        distraction.enabled 
                          ? "bg-destructive/10 border-destructive/20" 
                          : "bg-muted/50 border-border"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{distraction.icon}</span>
                        <div>
                          <Label htmlFor={distraction.id} className="text-sm font-medium">
                            {distraction.name}
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            {distraction.enabled ? 'Blocked' : 'Allowed'}
                          </p>
                        </div>
                      </div>
                      <Switch
                        id={distraction.id}
                        checked={distraction.enabled}
                        onCheckedChange={() => toggleDistraction(distraction.id)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            {/* Focus Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-success" />
                  Focus Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-gradient-primary rounded-lg text-white">
                  <div className="text-2xl font-bold">{currentStreak}</div>
                  <div className="text-sm opacity-90">Day Streak</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-success/10 rounded-lg">
                    <Clock className="h-6 w-6 text-success mx-auto mb-1" />
                    <div className="font-semibold text-success">{totalFocusTime}m</div>
                    <div className="text-xs text-muted-foreground">Total Focus</div>
                  </div>
                  <div className="text-center p-3 bg-focus/10 rounded-lg">
                    <Shield className="h-6 w-6 text-focus mx-auto mb-1" />
                    <div className="font-semibold text-focus">{totalDistractions}</div>
                    <div className="text-xs text-muted-foreground">Blocked</div>
                  </div>
                </div>
                
                <div className="text-center p-3 bg-warning/10 rounded-lg">
                  <Flame className="h-6 w-6 text-warning mx-auto mb-1" />
                  <div className="font-semibold text-warning">{sessions.length}</div>
                  <div className="text-xs text-muted-foreground">Sessions Today</div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  Recent Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sessions.slice(-3).reverse().map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{session.duration}m session</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(session.startTime).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {session.distractionsAvoided} blocked
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusPage;