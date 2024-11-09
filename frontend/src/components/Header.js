import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
  <header className="header">
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/admin">Admin Page</Link></li>
        <li><Link to="/config">Config Page</Link></li>
      </ul>
    </nav>
  </header>
);

export default Header;
