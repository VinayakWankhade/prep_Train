import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, BookOpen, Target, Brain, Calendar, Users, PenTool } from "lucide-react";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/tasks", label: "Tasks", icon: Target },
    { href: "/focus", label: "Focus", icon: Brain },
    { href: "/practice", label: "Practice", icon: BookOpen },
    { href: "/counseling", label: "Counseling", icon: Calendar },
    { href: "/internships", label: "Internships", icon: Users },
    { href: "/blogs", label: "Blogs", icon: PenTool },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              FocusPrep
            </span>
            <Badge variant="secondary" className="text-xs">Beta</Badge>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} to={item.href}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center space-x-2 hover:bg-accent hover:text-accent-foreground"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
            <Button size="sm" className="bg-gradient-primary">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden animate-fade-in border-t border-border bg-background/95 backdrop-blur-xl">
            <div className="py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} to={item.href} onClick={() => setIsOpen(false)}>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start space-x-3 hover:bg-accent"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Button>
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-border space-y-2">
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
                <Button className="w-full bg-gradient-primary">
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};