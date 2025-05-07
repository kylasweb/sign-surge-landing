
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple authentication - in a real app, this should be handled securely
    if (username === 'admin' && password === 'admin123') {
      // Set a session token in localStorage (use a more secure method in production)
      localStorage.setItem('adminToken', 'admin-session-token');
      
      toast({
        title: "Login successful",
        description: "Welcome to the admin dashboard",
      });
      
      // Navigate to admin dashboard
      navigate('/admin/dashboard');
    } else {
      toast({
        title: "Login failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const handleQuickLogin = () => {
    setIsLoading(true);
    
    // Set admin token for quick login
    localStorage.setItem('adminToken', 'admin-session-token');
    
    toast({
      title: "Quick login successful",
      description: "Welcome to the admin dashboard",
    });
    
    // Navigate to admin dashboard
    navigate('/admin/dashboard');
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleQuickLogin} 
              className="w-full bg-green-500 hover:bg-green-600 mb-4" 
              disabled={isLoading}
            >
              One-Click Admin Login
            </Button>
            
            <Separator className="my-4">
              <span className="mx-2 text-xs text-gray-500">OR</span>
            </Separator>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">Username</label>
                <Input 
                  id="username"
                  type="text" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  placeholder="Username"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <Input 
                  id="password"
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Password"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-center text-gray-500 mt-4 w-full">
              Use username: "admin" and password: "admin123" to login
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
