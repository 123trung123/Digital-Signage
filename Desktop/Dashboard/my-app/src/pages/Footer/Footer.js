import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>DSS Signage &copy; {new Date().getFullYear()} Created by Tran Ngoc Trung. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
