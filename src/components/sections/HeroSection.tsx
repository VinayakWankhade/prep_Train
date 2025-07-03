import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, Star, Users, Trophy, Clock } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="py-20 md:py-28 text-center">
      {/* Hero Badge */}
      <div className="flex justify-center mb-6">
        <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
          <Star className="w-3 h-3 mr-1 fill-current" />
          Trusted by 10,000+ students
        </Badge>
      </div>

      {/* Main Heading */}
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 text-balance antialiased text-shadow tracking-tight">
        <span className="text-text-primary">Empower Your</span>
        <br />
        <span className="bg-gradient-primary bg-clip-text text-transparent antialiased text-shadow">
          Academic Journey
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-8 leading-relaxed">
        Master tasks, prepare for exams, boost focus, and accelerate your career with our 
        comprehensive platform designed for ambitious students and developers.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
        <Button 
          size="lg" 
          className="bg-gradient-primary text-white shadow-glow hover:shadow-xl transition-all duration-300"
        >
          Start Your Journey
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        <Button 
          variant="outline" 
          size="lg"
          className="border-border-strong hover:bg-accent group"
        >
          <Play className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
          Watch Demo
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-lg mx-auto">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Users className="w-5 h-5 text-primary mr-2" />
            <span className="text-2xl font-bold text-text-primary">10K+</span>
          </div>
          <p className="text-sm text-text-secondary">Active Students</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Trophy className="w-5 h-5 text-success mr-2" />
            <span className="text-2xl font-bold text-text-primary">95%</span>
          </div>
          <p className="text-sm text-text-secondary">Success Rate</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Clock className="w-5 h-5 text-focus mr-2" />
            <span className="text-2xl font-bold text-text-primary">2M+</span>
          </div>
          <p className="text-sm text-text-secondary">Focus Hours</p>
        </div>
      </div>
    </section>
  );
};