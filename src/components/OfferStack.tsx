
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const OfferStack = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [slotsLeft, setSlotsLeft] = useState(3);
  const [timer, setTimer] = useState({ hours: 0, minutes: 59, seconds: 59 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      toast({
        title: "Please enter a valid email",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success!",
      description: "Your free signage profit calculator has been sent to your email.",
    });
    
    setEmail('');
    setSlotsLeft(prev => Math.max(prev - 1, 0));
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-blue-900 to-blue-800 text-white">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Calculate How Much Revenue You're Losing With Poor Signage
            </h2>
            <p className="mb-8 text-blue-100">
              Our free Signage Profit Calculator shows exactly how many customers you're missing out on and the potential revenue increase with our proven signage solutions.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="cta-button w-full font-bold text-lg"
              >
                GET MY FREE CALCULATOR NOW
              </Button>
            </form>
            
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center text-yellow-300">
                <span className="text-lg mr-2">⚠️</span>
                <p className="text-sm">Only {slotsLeft} project slots left this month</p>
              </div>
              
              <div className="text-sm text-yellow-300 font-mono">
                {String(timer.hours).padStart(2, '0')}:
                {String(timer.minutes).padStart(2, '0')}:
                {String(timer.seconds).padStart(2, '0')}
              </div>
            </div>
          </div>
          
          <div className="bg-blue-700 p-8 rounded-xl space-y-6">
            <h3 className="text-2xl font-bold border-b border-blue-500 pb-4">Limited Time Bonuses</h3>
            
            <div className="flex gap-4 items-start">
              <div className="bg-blue-500 rounded-full p-2 text-center flex-shrink-0">
                <span className="text-xl">🎁</span>
              </div>
              <div>
                <h4 className="font-bold text-lg">Free 3D Mockup</h4>
                <p className="text-blue-100 text-sm">See exactly how your signage will look before production ($500 Value)</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="bg-blue-500 rounded-full p-2 text-center flex-shrink-0">
                <span className="text-xl">🔒</span>
              </div>
              <div>
                <h4 className="font-bold text-lg">24-Month Warranty</h4>
                <p className="text-blue-100 text-sm">Extended coverage for complete peace of mind (Limited Time Only)</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="bg-blue-500 rounded-full p-2 text-center flex-shrink-0">
                <span className="text-xl">💰</span>
              </div>
              <div>
                <h4 className="font-bold text-lg">Price Lock Guarantee</h4>
                <p className="text-blue-100 text-sm">Lock in 2024 pricing before our annual increase (Save up to 25%)</p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-blue-500">
              <div className="bg-yellow-400 text-black p-3 rounded-lg font-bold text-center shadow-lg blinking">
                ⚠️ OFFER EXPIRES WHEN TIMER HITS ZERO ⚠️
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OfferStack;
