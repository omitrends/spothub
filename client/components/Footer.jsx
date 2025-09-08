import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-50 py-6 px-4 text-center text-gray-500 text-sm">
      <p>&copy; {new Date().getFullYear()} SpotHub. All rights reserved.</p>
    </footer>
  );
}

export default Footer;