
import React from 'react';
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="py-4 px-4 bg-white shadow-sm">
      <div className="container flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-primary">
            <span className="text-highlight">I</span>Design Ads
          </h1>
        </div>
        <nav className="hidden md:flex space-x-6 items-center">
          <a href="#services" className="text-gray-600 hover:text-highlight transition-colors">Services</a>
          <a href="#testimonials" className="text-gray-600 hover:text-highlight transition-colors">Testimonials</a>
          <a href="#pricing" className="text-gray-600 hover:text-highlight transition-colors">Pricing</a>
          <a href="#faq" className="text-gray-600 hover:text-highlight transition-colors">FAQ</a>
          <Button className="bg-highlight hover:bg-highlight/90">Contact Us</Button>
        </nav>
        <Button className="md:hidden">Menu</Button>
      </div>
    </header>
  );
};

export default Header;
