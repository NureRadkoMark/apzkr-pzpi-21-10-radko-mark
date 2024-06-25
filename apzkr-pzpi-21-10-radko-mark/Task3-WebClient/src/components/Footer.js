import React, { useState, useEffect, useRef } from 'react';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
import refreshToken from '../functions/JWT';
import '../styles/Footer.css';

const Footer = () => {
    // useRef to access the footer DOM element
    const footerRef = useRef(null);

    // State to manage footer visibility based on scroll position
    const [isVisible, setIsVisible] = useState(false);

    // Effect to handle scroll events and determine footer visibility
    useEffect(() => {
        const handleScroll = async () => {
            await refreshToken(); // Refresh authentication token asynchronously
            const currentScrollPos = window.pageYOffset;
            setIsVisible(currentScrollPos > 0); // Show footer if scrolled down
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []); // Runs only once after component mounts

    // Effect to handle window resize events
    useEffect(() => {
        const handleResize = () => {
            checkFooterPosition(); // Adjust footer visibility on resize
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []); // Runs only once after component mounts

    // Effect to initially check footer position on component mount
    useEffect(() => {
        checkFooterPosition();
    }, []); // Runs only once after component mounts

    // Function to determine footer visibility based on content height and scroll position
    const checkFooterPosition = () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const bodyHeight = document.body.scrollHeight;
        const footerHeight = footerRef.current.clientHeight;

        // Calculate content height excluding the footer
        const contentHeight = Math.max(documentHeight, bodyHeight) - footerHeight;

        // Show footer if content height is more than window height or if there is a scroll down
        setIsVisible(contentHeight > windowHeight || window.pageYOffset > 0);
    };

    // JSX for rendering the footer component
    return (
        <footer ref={footerRef} className={`footer ${isVisible ? '' : 'hidden'}`}>
            <div className="footer-content">
                <div className="footer-left">
                    <p>We are on social media</p>
                    <div className="social-icons">
                        {/* Social media links */}
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                            <FaFacebookF />
                        </a>
                        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                            <FaTwitter />
                        </a>
                        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                            <FaInstagram />
                        </a>
                    </div>
                </div>
                <div className="footer-right">
                    <p>Created by Mark Radko</p>
                    <p>Support: mark.radko@nure.ua</p>
                    <p>
                        <a href="/about-us">About Us</a>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;












