import React from 'react';
import { socialHandles } from '../../utils/constant';

const Footer = () => {
  return (
    <footer className="h-[36px] bg-B1 flex items-center">
      <div className="mx-auto max-w-5xl w-full px-4 flex items-center justify-between">
        <div className="flex justify-center items-center space-x-3">
          <p className="hidden md:block text-center text-xs leading-5 text-zinc-300 mr-4">
            &copy; {new Date().getFullYear()} Defilens. All rights reserved.
          </p>
          {socialHandles.map((item) => (
            <a
              key={item.key}
              href={item.href}
              target="_blank"
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">{item.key}</span>
              <item.icon />
            </a>
          ))}
        </div>
        <span className="hidden md:block text-center text-xs leading-5 text-zinc-300">
          Gas Fee is sponsered by us.
        </span>
        <p className="sm:hidden text-center text-xs leading-5 text-gray-500">
          &copy; {new Date().getFullYear()} Defilens. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
