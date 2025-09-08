import React from 'react';
import { Github, Linkedin, Twitter, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 border-t border-gray-800 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Copyright */}
          <div className="text-sm text-gray-400 hover:text-gray-300 transition-colors duration-300">
            © {currentYear} BingeKaro. All rights reserved.
          </div>

          {/* Right side - Social Links and Made with love */}
          <div className="flex items-center space-x-6">
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/jayg2309"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-2 text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"
                aria-label="GitHub"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Github className="w-5 h-5 relative z-10" />
              </a>
              <a
                href="https://www.linkedin.com/in/jay-gondaliya-b8902326b/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-2 text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Linkedin className="w-5 h-5 relative z-10" />
              </a>
              <a
                href="https://twitter.com/jayg2309"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-2 text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"
                aria-label="Twitter"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-sky-500/20 to-blue-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 to-blue-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Twitter className="w-5 h-5 relative z-10" />
              </a>
            </div>

            {/* Made with love */}
            <div className="flex items-center text-sm text-gray-400 hover:text-gray-300 transition-colors duration-300 group">
              <span>Made with</span>
              <Heart className="w-4 h-4 mx-1 text-red-500 fill-current group-hover:animate-pulse group-hover:scale-110 transition-transform duration-300" />
              <span>by Jay</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
