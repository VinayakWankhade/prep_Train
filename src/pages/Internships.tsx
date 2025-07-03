import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Clock, Users, Building2, Plus, Search, Bookmark, ExternalLink, Filter, CheckCircle, Star, MessageCircle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Navigation } from "@/components/layout/Navigation";

interface Internship {
  id: string;
  logo: string;
  title: string;
  company: string;
  type: 'remote' | 'onsite' | 'hybrid';
  paid: boolean;
  techStack: string[];
  duration: string;
  postedBy: {
    name: string;
    role: 'teacher' | 'alumni';
    year: string;
    avatar: string;
    verified: boolean;
  };
  location: string;
  description: string;
  tags: string[];
  applyLink: string;
  isBookmarked: boolean;
  postedDate: string;
  deadline: string;
  recommended: boolean;
  mostApplied: boolean;
  applications: number;
}

// Deadline progress bar
const getDeadlineProgress = (posted: string, deadline: string) => {
  const start = new Date(posted).getTime();
  const end = new Date(deadline).getTime();
  const now = Date.now();
  if (now >= end) return 100;
  if (now <= start) return 0;
  return Math.round(((now - start) / (end - start)) * 100);
};

const InternshipsPage = () => {
  const [internships, setInternships] = useState<Internship[]>([
    {
      id: '1',
      logo: 'https://logo.clearbit.com/google.com',
      title: 'Frontend Developer Intern',
      company: 'Google',
      type: 'remote',
      paid: true,
      techStack: ['React', 'TypeScript', 'Tailwind'],
      duration: '3 months',
      postedBy: {
        name: 'Prof. Sarah Wilson',
        role: 'teacher',
        year: '2022',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        verified: true
      },
      location: 'Remote',
      description: 'Work on React applications and learn modern web development practices.',
      tags: ['Remote', 'Paid', 'React', 'TypeScript', '3 months'],
      applyLink: 'https://careers.google.com',
      isBookmarked: false,
      postedDate: '2024-07-01',
      deadline: '2024-07-20',
      recommended: true,
      mostApplied: true,
      applications: 120
    },
    {
      id: '2',
      logo: 'https://logo.clearbit.com/microsoft.com',
      title: 'Backend Developer Intern',
      company: 'Microsoft',
      type: 'onsite',
      paid: false,
      techStack: ['Node.js', 'Express', 'MongoDB'],
      duration: '6 months',
      postedBy: {
        name: 'Alex Chen',
        role: 'alumni',
        year: '2021',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        verified: true
      },
      location: 'Bangalore',
      description: 'Build scalable backend APIs and work with cloud technologies.',
      tags: ['Onsite', 'Unpaid', 'Node.js', 'MongoDB', '6 months'],
      applyLink: 'https://careers.microsoft.com',
      isBookmarked: true,
      postedDate: '2024-07-05',
      deadline: '2024-07-25',
      recommended: false,
      mostApplied: false,
      applications: 80
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'remote' | 'onsite' | 'hybrid'>('all');
  const [selected, setSelected] = useState<null | typeof internships[0]>(null);
  const [modalOpen, setModalOpen] = useState(false);

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

  const openModal = (internship: typeof internships[0]) => {
    setSelected(internship);
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

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
      <Navigation />
      <div className="container mx-auto px-2 md:px-4 py-8">
        {/* Filter + Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center bg-background/90 rounded-lg border border-border p-4">
          <div className="flex-1 flex gap-2 items-center relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5 pointer-events-none" />
            <Input
              placeholder="Search internships, companies, or skills..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 rounded-full bg-background border border-border focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-2 items-center overflow-x-auto scrollbar-hide">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="h-9 px-4 rounded-full border border-border bg-background text-sm focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All</option>
              <option value="remote">Remote</option>
              <option value="onsite">On-site</option>
              <option value="hybrid">Hybrid</option>
            </select>
            <select
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 px-4 rounded-full border border-border bg-background text-sm focus:ring-2 focus:ring-primary/20"
            >
              {/* Add search options here */}
            </select>
          </div>
        </div>

        {/* Internship Cards (summary only) */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredInternships.map((internship) => (
            <div key={internship.id}>
              <Card className="relative rounded-xl bg-background border border-border hover:border-primary/30 transition-all duration-200 cursor-pointer" onClick={() => openModal(internship)}>
                <CardHeader className="pb-4 flex flex-row items-center gap-3">
                  <img src={internship.logo} alt={internship.company} className="w-12 h-12 rounded-lg object-contain bg-white border" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        {internship.title}
                        {internship.recommended && <Badge className="bg-success/10 text-success border-success/20">Recommended</Badge>}
                        {internship.mostApplied && <Badge className="bg-warning/10 text-warning border-warning/20">Popular</Badge>}
                      </CardTitle>
                      {internship.postedBy.verified && (
                        <ShieldCheck className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {internship.tags.map(tag => (
                        <Badge key={tag} className="rounded-full bg-muted text-muted-foreground border-muted-foreground/20 text-xs px-3 py-1">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn("absolute top-3 right-3 z-10 rounded-full bg-background hover:bg-primary/10 transition-all", internship.isBookmarked ? "text-primary" : "")}
                    onClick={e => { e.stopPropagation(); toggleBookmark(internship.id); }}
                    aria-label="Save internship"
                  >
                    <Bookmark className="w-5 h-5" fill={internship.isBookmarked ? "currentColor" : "none"} />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-2">
                    <img src={internship.postedBy.avatar} alt={internship.postedBy.name} className="w-7 h-7 rounded-full border" />
                    <span className="text-sm font-medium text-text-primary">{internship.postedBy.name}</span>
                    <span className="text-xs text-muted-foreground">({internship.postedBy.role}, {internship.postedBy.year})</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{internship.location}</span>
                    <Clock className="w-4 h-4 text-muted-foreground ml-4" />
                    <span className="text-xs text-muted-foreground">{internship.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs text-muted-foreground">Posted: {internship.postedDate}</span>
                    <span className="text-xs text-muted-foreground ml-auto">Deadline: {internship.deadline}</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full mb-4 overflow-hidden">
                    <div
                      className="h-2 rounded-full bg-gradient-primary transition-all duration-700"
                      style={{ width: `${getDeadlineProgress(internship.postedDate, internship.deadline)}%` }}
                    />
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-2 border-primary text-primary hover:bg-primary/10 transition-all"
                    onClick={e => { e.stopPropagation(); openModal(internship); }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Internship Details Modal */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-2xl">
            {selected && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    <img src={selected.logo} alt={selected.company} className="w-10 h-10 rounded-lg object-contain bg-white border" />
                    <span>{selected.title}</span>
                    {selected.recommended && <Badge className="bg-success/10 text-success border-success/20">Recommended</Badge>}
                    {selected.mostApplied && <Badge className="bg-warning/10 text-warning border-warning/20">Popular</Badge>}
                  </DialogTitle>
                </DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <img src={selected.postedBy.avatar} alt={selected.postedBy.name} className="w-7 h-7 rounded-full border" />
                  <span className="text-sm font-medium text-text-primary">{selected.postedBy.name}</span>
                  <span className="text-xs text-muted-foreground">({selected.postedBy.role}, {selected.postedBy.year})</span>
                  {selected.postedBy.verified && <ShieldCheck className="w-4 h-4 text-primary ml-2" />}
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {selected.tags.map(tag => (
                    <Badge key={tag} className="rounded-full bg-muted text-muted-foreground border-muted-foreground/20 text-xs px-3 py-1">{tag}</Badge>
                  ))}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{selected.location}</span>
                  <Clock className="w-4 h-4 text-muted-foreground ml-4" />
                  <span className="text-xs text-muted-foreground">{selected.duration}</span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs text-muted-foreground">Posted: {selected.postedDate}</span>
                  <span className="text-xs text-muted-foreground ml-auto">Deadline: {selected.deadline}</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full mb-4 overflow-hidden">
                  <div
                    className="h-2 rounded-full bg-gradient-primary transition-all duration-700"
                    style={{ width: `${getDeadlineProgress(selected.postedDate, selected.deadline)}%` }}
                  />
                </div>
                <div className="mb-4 text-text-secondary whitespace-pre-line">
                  {selected.description}
                </div>
                <Button
                  asChild
                  className="w-full bg-primary/90 text-white hover:bg-primary/80 transition-colors mb-2"
                >
                  <a href={selected.applyLink} target="_blank" rel="noopener noreferrer">
                    Apply
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary/10 transition-all"
                  onClick={closeModal}
                >
                  Close
                </Button>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default InternshipsPage;