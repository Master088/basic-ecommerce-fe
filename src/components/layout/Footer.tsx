import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
        <div>
          <h4 className="font-semibold mb-2">OShoPairIn.com</h4>
          <ul>
            <li>About</li>
            <li>Career</li>
            <li>Blog</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Buy</h4>
          <ul>
            <li>Bill & Top Up</li>
            <li>COD</li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold mb-2">Help</h4>
          <ul>
            <li>Privacy</li>
            <li>Terms</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Categories</h4>
          <ul>
            <li>Fashion</li>
            <li>Electronics</li>
            <li>Home & Living</li>
            <li>Beauty</li>
            <li>Groceries</li>
          </ul>
        </div>
      </div>

      <div className="text-center mt-8 text-sm text-gray-400">
        © 2025, OShoPairIn.com
      </div>
    </footer>
  );
}

export default Footer;
