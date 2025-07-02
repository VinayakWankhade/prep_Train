import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PenTool, Search, Clock, User, Plus, Eye, Heart, MessageCircle, BookOpen, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: {
    name: string;
    avatar: string;
    role: 'teacher' | 'student';
  };
  publishedAt: string;
  readTime: number;
  tags: string[];
  views: number;
  likes: number;
  comments: number;
  thumbnail?: string;
}

const BlogsPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([
    {
      id: '1',
      title: 'Mastering React Hooks: A Complete Guide',
      content: 'React Hooks have revolutionized how we write React components...',
      excerpt: 'Learn how to effectively use React Hooks to build modern, efficient React applications.',
      author: {
        name: 'Prof. Sarah Wilson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150',
        role: 'teacher'
      },
      publishedAt: '2024-07-01',
      readTime: 8,
      tags: ['React', 'JavaScript', 'Frontend'],
      views: 1234,
      likes: 89,
      comments: 23,
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400'
    },
    {
      id: '2',
      title: 'Cracking the UPSC: Study Strategies That Work',
      content: 'Preparing for UPSC requires a systematic approach...',
      excerpt: 'Discover proven study strategies and techniques to excel in UPSC examinations.',
      author: {
        name: 'Rahul Kumar',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        role: 'student'
      },
      publishedAt: '2024-06-28',
      readTime: 12,
      tags: ['UPSC', 'Study Tips', 'Preparation'],
      views: 892,
      likes: 67,
      comments: 15,
      thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400'
    },
    {
      id: '3',
      title: 'Data Structures and Algorithms: The Foundation',
      content: 'Understanding DSA is crucial for any developer...',
      excerpt: 'Build a strong foundation in data structures and algorithms for technical interviews.',
      author: {
        name: 'Dr. Priya Sharma',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        role: 'teacher'
      },
      publishedAt: '2024-06-25',
      readTime: 15,
      tags: ['DSA', 'Programming', 'Interview Prep'],
      views: 1567,
      likes: 123,
      comments: 34
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [isWriteDialogOpen, setIsWriteDialogOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [isReadDialogOpen, setIsReadDialogOpen] = useState(false);
  const [newBlog, setNewBlog] = useState({
    title: '',
    content: '',
    tags: '',
    excerpt: ''
  });

  const allTags = ['All', ...Array.from(new Set(blogs.flatMap(blog => blog.tags)))];

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.author.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === 'All' || blog.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const handleReadBlog = (blog: Blog) => {
    setSelectedBlog(blog);
    setIsReadDialogOpen(true);
    // Increment view count
    setBlogs(blogs.map(b => b.id === blog.id ? { ...b, views: b.views + 1 } : b));
  };

  const handleLikeBlog = (blogId: string) => {
    setBlogs(blogs.map(blog => 
      blog.id === blogId ? { ...blog, likes: blog.likes + 1 } : blog
    ));
  };

  const createBlog = () => {
    if (newBlog.title && newBlog.content && newBlog.excerpt) {
      const blog: Blog = {
        id: Date.now().toString(),
        title: newBlog.title,
        content: newBlog.content,
        excerpt: newBlog.excerpt,
        author: {
          name: 'You',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
          role: 'student'
        },
        publishedAt: new Date().toISOString().split('T')[0],
        readTime: Math.ceil(newBlog.content.split(' ').length / 200), // Rough estimate
        tags: newBlog.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        views: 0,
        likes: 0,
        comments: 0
      };
      setBlogs([blog, ...blogs]);
      setNewBlog({ title: '', content: '', tags: '', excerpt: '' });
      setIsWriteDialogOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-surface">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text-primary mb-2">Tech Blogs</h1>
          <p className="text-text-secondary">Share knowledge, learn from others, and grow together</p>
        </div>

        {/* Search & Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search blogs, authors, or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Dialog open={isWriteDialogOpen} onOpenChange={setIsWriteDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-gradient-primary text-white shadow-glow">
                <PenTool className="h-4 w-4" />
                Write Blog
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Write New Blog</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newBlog.title}
                    onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                    placeholder="Enter blog title..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={newBlog.excerpt}
                    onChange={(e) => setNewBlog({ ...newBlog, excerpt: e.target.value })}
                    placeholder="Brief description of your blog..."
                    rows={2}
                  />
                </div>
                
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={newBlog.content}
                    onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                    placeholder="Write your blog content here..."
                    rows={10}
                  />
                </div>
                
                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={newBlog.tags}
                    onChange={(e) => setNewBlog({ ...newBlog, tags: e.target.value })}
                    placeholder="React, JavaScript, Tutorial"
                  />
                </div>
                
                <Button onClick={createBlog} className="w-full">
                  Publish Blog
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tag Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Tag className="h-4 w-4 text-muted-foreground mt-1" />
          {allTags.map((tag) => (
            <Button
              key={tag}
              variant={selectedTag === tag ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </Button>
          ))}
        </div>

        {/* Blogs Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBlogs.map((blog) => (
            <Card key={blog.id} className="card-interactive group overflow-hidden">
              {blog.thumbnail && (
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={blog.thumbnail} 
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3 mb-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={blog.author.avatar} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-text-primary truncate">
                        {blog.author.name}
                      </span>
                      <Badge variant={blog.author.role === 'teacher' ? 'default' : 'secondary'}>
                        {blog.author.role}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {blog.readTime} min read
                    </div>
                  </div>
                </div>
                
                <CardTitle className="text-xl line-clamp-2 hover:text-primary cursor-pointer transition-colors">
                  {blog.title}
                </CardTitle>
                
                <p className="text-sm text-text-secondary line-clamp-3 mt-2">
                  {blog.excerpt}
                </p>
              </CardHeader>
              
              <CardContent>
                <div className="flex flex-wrap gap-1 mb-4">
                  {blog.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {blog.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {blog.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      {blog.comments}
                    </span>
                  </div>
                  <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleReadBlog(blog)}
                    className="flex-1 gap-2"
                  >
                    <BookOpen className="h-4 w-4" />
                    Read
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => handleLikeBlog(blog.id)}
                    className="gap-1"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Read Blog Dialog */}
        <Dialog open={isReadDialogOpen} onOpenChange={setIsReadDialogOpen}>
          <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
            {selectedBlog && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar>
                      <AvatarImage src={selectedBlog.author.avatar} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{selectedBlog.author.name}</span>
                        <Badge variant={selectedBlog.author.role === 'teacher' ? 'default' : 'secondary'}>
                          {selectedBlog.author.role}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {selectedBlog.readTime} min read • {new Date(selectedBlog.publishedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <DialogTitle className="text-2xl">{selectedBlog.title}</DialogTitle>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedBlog.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </DialogHeader>

                <div className="space-y-6">
                  {selectedBlog.thumbnail && (
                    <img 
                      src={selectedBlog.thumbnail} 
                      alt={selectedBlog.title}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  )}
                  
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    <p className="text-lg text-text-secondary italic border-l-4 border-primary pl-4">
                      {selectedBlog.excerpt}
                    </p>
                    <div className="mt-6 text-text-primary leading-relaxed whitespace-pre-wrap">
                      {selectedBlog.content}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-border">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {selectedBlog.views} views
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {selectedBlog.likes} likes
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {selectedBlog.comments} comments
                      </span>
                    </div>
                    
                    <Button 
                      variant="outline"
                      onClick={() => handleLikeBlog(selectedBlog.id)}
                      className="gap-2"
                    >
                      <Heart className="h-4 w-4" />
                      Like
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {filteredBlogs.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <PenTool className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">No blogs found</h3>
            <p className="text-text-secondary">Try adjusting your search or write the first blog!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogsPage;