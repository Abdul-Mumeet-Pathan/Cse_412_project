import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Footer = () => {
  const { user } = useSelector(store => store.auth);
  const userRole = user?.role; // Assuming role is stored in user object

  return (
    <footer className="bg-gray-800 text-gray-300 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">
              <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">JobPortal</span>
            </h3>
            <p className="text-sm">Connecting talent with opportunity across the globe.</p>
            <div className="flex space-x-4">
              {/* Social media icons remain the same */}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to={userRole === 'recruiter' ? '/admin/jobs' : '/jobs'} 
                  className="hover:text-white transition-colors"
                >
                  Browse Jobs
                </Link>
              </li>
              <li><Link to="/companies" className="hover:text-white transition-colors">Companies</Link></li>
              <li><Link to="/career-advice" className="hover:text-white transition-colors">Career Advice</Link></li>
              {userRole === 'recruiter' && (
                <li><Link to="/post-job" className="hover:text-white transition-colors">Post a Job</Link></li>
              )}
              <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Stay Updated</h3>
            <p className="text-sm">Subscribe to our newsletter for the latest jobs and tips</p>
            <form className="flex flex-col space-y-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
              />
              <button 
                type="submit" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 px-4 rounded transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">
            © {new Date().getFullYear()} JobHunt. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/terms" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Terms</Link>
            <Link to="/privacy" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Privacy</Link>
            <Link to="/cookies" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;