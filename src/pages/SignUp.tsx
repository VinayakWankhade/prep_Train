import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { Navigation } from '@/components/layout/Navigation';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add sign up logic
    alert('Sign up logic goes here');
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen flex items-center justify-center bg-gradient-surface px-4">
        <div className="w-full max-w-md bg-background rounded-2xl shadow-elegant p-8">
          <h1 className="text-3xl font-extrabold mb-2 text-center bg-gradient-primary bg-clip-text text-transparent antialiased text-shadow">Get Started</h1>
          <p className="text-text-secondary text-center mb-8">Create your account to unlock all features.</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="mt-1"
                placeholder="Your Name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="mt-1"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="mt-1"
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-primary text-white shadow-glow text-lg font-bold">Sign Up</Button>
          </form>
          <div className="text-center mt-6 text-sm text-text-secondary">
            Already have an account?{' '}
            <Link to="/signin" className="text-primary underline hover:text-primary/80">Sign In</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp; 