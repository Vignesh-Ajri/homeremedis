import { Link, useLocation } from 'react-router';
import { Sprout, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Plants', path: '/plants' },
    { name: 'Remedies', path: '/remedies' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return location.pathname === path;
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-stone-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 transition group-hover:bg-emerald-200">
            <Sprout className="h-6 w-6" />
          </div>
          <span
            className="text-2xl text-stone-900 transition group-hover:text-emerald-800"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 700 }}
          >
            HomeRemedis
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-semibold transition ${
                isActive(link.path)
                  ? 'text-emerald-700'
                  : 'text-stone-500 hover:text-emerald-600'
              }`}
            >
              {link.name}
            </Link>
          ))}
          {/* Action button placeholder */}
          <Link
            to="/plants"
            className="rounded-full bg-emerald-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-900"
          >
            Explore Catalog
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-stone-600 hover:text-emerald-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-stone-100 bg-white shadow-lg">
          <div className="flex flex-col px-6 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`text-base font-semibold transition ${
                  isActive(link.path)
                    ? 'text-emerald-700'
                    : 'text-stone-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-stone-100">
              <Link
                to="/plants"
                onClick={() => setIsMenuOpen(false)}
                className="flex justify-center rounded-full bg-emerald-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900"
              >
                Explore Catalog
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
