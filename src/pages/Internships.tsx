import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Clock, Users, Building2, Plus, Search, Bookmark, ExternalLink, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface Internship {
  id: string;
  title: string;
  company: string;
  type: 'remote' | 'onsite' | 'hybrid';
  duration: string;
  postedBy: string;
  postedByRole: 'teacher' | 'alumni';
  location: string;
  description: string;
  tags: string[];
  applyLink: string;
  isBookmarked: boolean;
  postedDate: string;
}

const InternshipsPage = () => {
  const [internships, setInternships] = useState<Internship[]>([
    {
      id: '1',
      title: 'Frontend Developer Intern',
      company: 'TechCorp',
      type: 'remote',
      duration: '3 months',
      postedBy: 'Prof. Sarah Wilson',
      postedByRole: 'teacher',
      location: 'Remote',
      description: 'Work on React applications and learn modern web development practices.',
      tags: ['React', 'JavaScript', 'Remote'],
      applyLink: 'https://techcorp.com/apply',
      isBookmarked: false,
      postedDate: '2024-07-01'
    },
    {
      id: '2',
      title: 'Data Science Intern',
      company: 'DataFlow Inc',
      type: 'onsite',
      duration: '6 months',
      postedBy: 'Alex Chen (Alumni)',
      postedByRole: 'alumni',
      location: 'Bangalore',
      description: 'Analyze large datasets and build machine learning models.',
      tags: ['Python', 'ML', 'Data Analysis'],
      applyLink: 'https://dataflow.com/careers',
      isBookmarked: true,
      postedDate: '2024-06-28'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'remote' | 'onsite' | 'hybrid'>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newInternship, setNewInternship] = useState({
    title: '',
    company: '',
    type: 'remote' as const,
    duration: '',
    location: '',
    description: '',
    applyLink: ''
  });

  const filteredInternships = internships.filter(internship => {
    const matchesSearch = internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'all' || internship.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const toggleBookmark = (id: string) => {
    setInternships(internships.map(internship => 
      internship.id === id ? { ...internship, isBookmarked: !internship.isBookmarked } : internship
    ));
  };

  const addInternship = () => {
    if (newInternship.title && newInternship.company) {
      const internship: Internship = {
        id: Date.now().toString(),
        ...newInternship,
        postedBy: 'You',
        postedByRole: 'teacher',
        tags: [newInternship.type, newInternship.company],
        isBookmarked: false,
        postedDate: new Date().toISOString().split('T')[0]
      };
      setInternships([...internships, internship]);
      setNewInternship({
        title: '',
        company: '',
        type: 'remote',
        duration: '',
        location: '',
        description: '',
        applyLink: ''
      });
      setIsDialogOpen(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'remote': return 'bg-success/10 text-success border-success/20';
      case 'onsite': return 'bg-primary/10 text-primary border-primary/20';
      case 'hybrid': return 'bg-focus/10 text-focus border-focus/20';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-surface">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text-primary mb-2">Internships & Placements</h1>
          <p className="text-text-secondary">Discover opportunities shared by teachers and alumni</p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search internships, companies, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-gradient-primary text-white shadow-glow">
                  <Plus className="h-4 w-4" />
                  Post Opportunity
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Post New Internship</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Position Title</Label>
                      <Input
                        id="title"
                        value={newInternship.title}
                        onChange={(e) => setNewInternship({ ...newInternship, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={newInternship.company}
                        onChange={(e) => setNewInternship({ ...newInternship, company: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <select
                        id="type"
                        value={newInternship.type}
                        onChange={(e) => setNewInternship({ ...newInternship, type: e.target.value as any })}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      >
                        <option value="remote">Remote</option>
                        <option value="onsite">On-site</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="duration">Duration</Label>
                      <Input
                        id="duration"
                        value={newInternship.duration}
                        onChange={(e) => setNewInternship({ ...newInternship, duration: e.target.value })}
                        placeholder="e.g., 3 months"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={newInternship.location}
                        onChange={(e) => setNewInternship({ ...newInternship, location: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newInternship.description}
                      onChange={(e) => setNewInternship({ ...newInternship, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="applyLink">Application Link</Label>
                    <Input
                      id="applyLink"
                      value={newInternship.applyLink}
                      onChange={(e) => setNewInternship({ ...newInternship, applyLink: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  
                  <Button onClick={addInternship} className="w-full">
                    Post Internship
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Type Filters */}
          <div className="flex gap-2">
            <Button
              variant={typeFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTypeFilter('all')}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              All
            </Button>
            <Button
              variant={typeFilter === 'remote' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTypeFilter('remote')}
            >
              Remote
            </Button>
            <Button
              variant={typeFilter === 'onsite' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTypeFilter('onsite')}
            >
              On-site
            </Button>
            <Button
              variant={typeFilter === 'hybrid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTypeFilter('hybrid')}
            >
              Hybrid
            </Button>
          </div>
        </div>

        {/* Internships Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredInternships.map((internship) => (
            <Card key={internship.id} className="card-interactive group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl mb-1">{internship.title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      {internship.company}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleBookmark(internship.id)}
                    className={cn(
                      "p-2",
                      internship.isBookmarked && "text-primary"
                    )}
                  >
                    <Bookmark className={cn("h-4 w-4", internship.isBookmarked && "fill-current")} />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge className={getTypeColor(internship.type)}>
                    {internship.type}
                  </Badge>
                  {internship.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {internship.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {internship.duration}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    Posted by {internship.postedBy}
                    <Badge variant={internship.postedByRole === 'teacher' ? 'default' : 'secondary'}>
                      {internship.postedByRole}
                    </Badge>
                  </div>
                </div>
                
                <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                  {internship.description}
                </p>
                
                <Button asChild className="w-full gap-2">
                  <a href={internship.applyLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    Apply Now
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredInternships.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Building2 className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">No internships found</h3>
            <p className="text-text-secondary">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InternshipsPage;