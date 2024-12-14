import React from 'react';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-white pt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Full Stack Developer
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Passionate about building scalable applications and creating exceptional user experiences
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <a
              href="#projects"
              className="px-8 py-3 bg-purple-600 text-white rounded-full flex items-center gap-2 hover:bg-purple-700 transition-colors"
            >
              View Projects <ArrowRight size={20} />
            </a>
            <a
              href="#contact"
              className="px-8 py-3 border-2 border-purple-600 text-purple-600 rounded-full hover:bg-purple-50 transition-colors"
            >
              Contact Me
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;