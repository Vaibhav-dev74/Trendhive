import React from "react";
import { Link } from "react-router-dom";
import { Store, ShieldCheck, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="text-gray-400 bg-gray-950 border-t border-gray-800">
      <div className="px-6 py-12 mx-auto max-w-7xl sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span className="text-yellow-400">🛍️</span> TrendHive
            </Link>
            <p className="text-xs leading-relaxed text-gray-400">
              Modern multi-merchant marketplace connecting smart buyers directly with verified local shopkeepers and trusted brands across India.
            </p>
            <div className="flex items-center gap-2 text-xs text-yellow-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Secure & Verified Platform</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-white">Help & Explore</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/products" className="hover:text-white transition">All Products</Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-white transition">Purchased History</Link>
              </li>
              <li>
                <Link to="/track-order" className="hover:text-white transition">Live Order Tracker</Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-white transition">Customer Support & FAQs</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition">Shopping Cart</Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white transition">Account & Addresses</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-white">Categories</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/products?category=Electronics" className="hover:text-white transition">Electronics</Link>
              </li>
              <li>
                <Link to="/products?category=Fashion" className="hover:text-white transition">Fashion</Link>
              </li>
              <li>
                <Link to="/products?category=Footwear" className="hover:text-white transition">Footwear</Link>
              </li>
              <li>
                <Link to="/products?category=Home%20%26%20Living" className="hover:text-white transition">Home & Living</Link>
              </li>
              <li>
                <Link to="/products?category=Gaming" className="hover:text-white transition">Gaming</Link>
              </li>
            </ul>
          </div>

          {/* Merchant Portal */}
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-white">For Shopkeepers</h4>
            <p className="mb-3 text-xs leading-relaxed text-gray-400">
              Own a store or brand? Start selling on TrendHive with zero setup fees.
            </p>
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-black bg-yellow-400 hover:bg-yellow-500 rounded-lg transition"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Merchant Portal</span>
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} TrendHive Marketplace. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
            <span>for shoppers & local merchants</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
