import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [awake, setAwake] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const st = window.scrollY;
      if (st > 150) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      if (st > 350) {
        setAwake(true);
      } else {
        setAwake(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navbarClass = `navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light ${scrolled ? 'scrolled' : ''} ${awake ? 'awake' : ''}`;

  return (
    <nav className={navbarClass} id="ftco-navbar">
      <div className="container">
        <Link className="navbar-brand" to="/">Relic Lanka Tours<span>Travel Agency</span></Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-controls="ftco-nav"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          <span className="oi oi-menu"></span> Menu
        </button>

        <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`} id="ftco-nav">
          <ul className="navbar-nav ml-auto">
            <li className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}><Link to="/" className="nav-link">Home</Link></li>
            <li className={`nav-item ${location.pathname === '/tours' ? 'active' : ''}`}><Link to="/tours" className="nav-link">Tours</Link></li>
            <li className={`nav-item ${location.pathname === '/about' ? 'active' : ''}`}><Link to="/about" className="nav-link">About Us</Link></li>
            <li className={`nav-item ${location.pathname === '/contact' ? 'active' : ''}`}><Link to="/contact" className="nav-link">Contact Us</Link></li>
            <li className={`nav-item ${location.pathname === '/search' ? 'active' : ''}`}><Link to="/search" className="nav-link">Search</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
