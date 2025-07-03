import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Menu, X, BookOpen, Target, Brain, Calendar, Users, PenTool, Sun, Moon } from "lucide-react";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() =>
    typeof window !== 'undefined' ? document.documentElement.classList.contains('dark') : false
  );

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  const navItems = [
    { href: "/task-manager", label: "Task Manager", icon: Target },
    { href: "/tasks", label: "Tasks", icon: Calendar },
    { href: "/focus", label: "Focus", icon: Brain },
    { href: "/practice", label: "Practice", icon: BookOpen },
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
            {/* Color Mode Toggle */}
            <div className="flex items-center ml-4">
              <Sun className={`w-4 h-4 mr-1 ${!darkMode ? 'text-yellow-400' : 'text-muted-foreground'}`} />
              <Switch checked={darkMode} onCheckedChange={toggleDarkMode} aria-label="Toggle dark mode" />
              <Moon className={`w-4 h-4 ml-1 ${darkMode ? 'text-blue-400' : 'text-muted-foreground'}`} />
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-3">
            <Link to="/signin">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="bg-gradient-primary">
                Get Started
              </Button>
            </Link>
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
              {/* Color Mode Toggle for Mobile */}
              <div className="flex items-center pt-4 border-t border-border space-x-2">
                <Sun className={`w-4 h-4 ${!darkMode ? 'text-yellow-400' : 'text-muted-foreground'}`} />
                <Switch checked={darkMode} onCheckedChange={toggleDarkMode} aria-label="Toggle dark mode" />
                <Moon className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-muted-foreground'}`} />
              </div>
              <div className="pt-4 border-t border-border space-y-2">
                <Link to="/signin">
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="w-full bg-gradient-primary">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};