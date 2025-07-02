import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Brain, 
  BookOpen, 
  Calendar, 
  Users, 
  PenTool,
  CheckCircle,
  Timer,
  Star,
  Briefcase,
  MessageCircle,
  Code
} from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Smart Task Management",
    description: "Organize, prioritize, and track your academic tasks with intelligent scheduling and progress insights.",
    badge: "Productivity",
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  {
    icon: Brain,
    title: "Focus Mode",
    description: "Eliminate distractions with Pomodoro timers, website blockers, and focus analytics to maximize productivity.",
    badge: "Focus",
    color: "text-focus",
    bgColor: "bg-focus/10"
  },
  {
    icon: BookOpen,
    title: "Practice Questions",
    description: "Master UPSC, NDA, DSA, and development topics with curated question banks and detailed explanations.",
    badge: "Learning",
    color: "text-success",
    bgColor: "bg-success/10"
  },
  {
    icon: Calendar,
    title: "Expert Counseling",
    description: "Book one-on-one sessions with mentors and teachers for personalized guidance and career advice.",
    badge: "Mentorship",
    color: "text-warning",
    bgColor: "bg-warning/10"
  },
  {
    icon: Users,
    title: "Internship Hub",
    description: "Discover exclusive internship and placement opportunities shared by alumni and industry professionals.",
    badge: "Career",
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  {
    icon: PenTool,
    title: "Knowledge Sharing",
    description: "Read and write technical blogs, share insights, and learn from the developer community.",
    badge: "Community",
    color: "text-focus",
    bgColor: "bg-focus/10"
  }
];

const stats = [
  { icon: CheckCircle, label: "Tasks Completed", value: "50K+" },
  { icon: Timer, label: "Focus Sessions", value: "100K+" },
  { icon: Star, label: "5-Star Reviews", value: "2K+" },
  { icon: Briefcase, label: "Job Placements", value: "500+" },
  { icon: MessageCircle, label: "Mentoring Hours", value: "10K+" },
  { icon: Code, label: "Questions Solved", value: "1M+" }
];

export const FeaturesGrid = () => {
  return (
    <section className="py-20">
      {/* Section Header */}
      <div className="text-center mb-16">
        <Badge className="bg-accent text-accent-foreground mb-4">
          Platform Features
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-text-primary">
          Everything You Need to
          <span className="bg-gradient-primary bg-clip-text text-transparent"> Succeed</span>
        </h2>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          From task management to career guidance, we've built a comprehensive ecosystem 
          to support your academic and professional growth.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card 
              key={index} 
              className="card-interactive group hover:shadow-glow border-border"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-text-secondary leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-surface rounded-2xl p-8 border border-border">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-text-primary mb-2">
            Join Thousands of Successful Students
          </h3>
          <p className="text-text-secondary">
            See what our community has achieved together
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-2xl font-bold text-text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-text-secondary">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};