import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { Navigation } from '@/components/layout/Navigation';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add authentication logic
    alert('Sign in logic goes here');
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen flex items-center justify-center bg-gradient-surface px-4">
        <div className="w-full max-w-md bg-background rounded-2xl shadow-elegant p-8">
          <h1 className="text-3xl font-extrabold mb-2 text-center bg-gradient-primary bg-clip-text text-transparent antialiased text-shadow">Sign In</h1>
          <p className="text-text-secondary text-center mb-8">Welcome back! Please sign in to your account.</p>
          <form onSubmit={handleSubmit} className="space-y-6">
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
                autoComplete="current-password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="mt-1"
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-primary text-white shadow-glow text-lg font-bold">Sign In</Button>
          </form>
          <div className="text-center mt-6 text-sm text-text-secondary">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary underline hover:text-primary/80">Get Started</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn; 