import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/NavBar.css';
import { getLocalizedString } from '../locale/lang';

const NavBar = () => {
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'ua');
    let preferredLang = localStorage.getItem('language') || 'ua';

    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
        window.location.reload();
    };

    const storedToken = localStorage.getItem('jwtToken');
    const role = localStorage.getItem('Role');

    const isAuthenticated = !!storedToken;

    function handleLogout() {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('Role');
        window.location.reload();
        window.location.href = '/home';
    }

    const fetchCompanyDetails = async (url) => {
        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
                }
            });
            const company = await response.json();

            if (company && company.CompanyId) {
                localStorage.setItem('selectedCompanyId', company.CompanyId);
            } else {
                console.error("Company data is invalid", company);
            }
        } catch (error) {
            console.error("Failed to fetch company details", error);
        }
    };

    useEffect(() => {
        if (role === 'Client') {
            fetchCompanyDetails('http://localhost:5000/api/company/user');
        } else if (role === 'Admin') {
            fetchCompanyDetails('http://localhost:5000/api/company/admin');
        }
    }, [role]);

    const renderNavItems = () => {
        if (!isAuthenticated) {
            return (
                <>
                    <Link to="/register">{getLocalizedString(preferredLang, "Register")}</Link>
                    <Link to="/login">{getLocalizedString(preferredLang, "login")}</Link>
                </>
            );
        }

        switch (role) {
            case 'Client':
                return (
                    <>
                        <Link to="/profile">{getLocalizedString(preferredLang, "Profile")}</Link>
                        <Link to='/my-appointments'>{getLocalizedString(preferredLang, "MyAppointments")}</Link>
                        <div className="dropdown">
                            <button className="dropbtn">{getLocalizedString(preferredLang, "MyCompany")}</button>
                            <div className="dropdown-content">
                                <Link to="/add-company">{getLocalizedString(preferredLang, "CreateCompany")}</Link>
                                <Link to="/company-manage">{getLocalizedString(preferredLang, "CompanyManager")}</Link>
                            </div>
                        </div>
                        <Link to="/user-check">{getLocalizedString(preferredLang, "myChecks")}</Link>
                        <Link to="/manage-subscription">{getLocalizedString(preferredLang, "manageSubscription")}</Link>
                        <Link to="/my-pet">{getLocalizedString(preferredLang, "MyPets")}</Link>
                    </>
                );
            case 'Employee':
                return (
                    <>
                        <Link to="/profile">{getLocalizedString(preferredLang, "Profile")}</Link>
                        <Link to='/service-manage'>{getLocalizedString(preferredLang, "invoice")}</Link>
                        <Link to='add-service'>Add service</Link>
                    </>
                );
            case 'Doctor':
                return (
                    <>
                        <Link to="/doctor-appointments">{getLocalizedString(preferredLang, "schedule")}</Link>
                        <Link to="/profile">{getLocalizedString(preferredLang, "Profile")}</Link>
                    </>
                );
            case 'Admin':
                return (
                    <>
                        <Link to="/profile">{getLocalizedString(preferredLang, "Profile")}</Link>
                        <Link to="/company-manage">{getLocalizedString(preferredLang, "manageCompanyBranches")}</Link>
                        <Link to="/work-hours">{getLocalizedString(preferredLang, "timeTracking")}</Link>
                    </>
                );
            case 'SuperAdmin':
                return (
                    <>
                        <Link to="/backup">{getLocalizedString(preferredLang, "backup")}</Link>
                        <Link to="/user-manage">{getLocalizedString(preferredLang, "manageUsers")}</Link>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <nav className="navbar">
            <div className="left">
                <Link to="/home">VetLab</Link>
            </div>
            <div className="right">
                <div className="dropdown">
                    <button className="dropbtn">
                        Мова ({language === 'ua' ? 'UA' : 'EN'})
                    </button>
                    <div className="dropdown-content">
                        <span onClick={() => handleLanguageChange('ua')}>Українська</span>
                        <span onClick={() => handleLanguageChange('en')}>English</span>
                    </div>
                </div>
                {renderNavItems()}
                {isAuthenticated && <Link to="/logout" onClick={handleLogout}>{getLocalizedString(preferredLang, "logout")}</Link>}
            </div>
        </nav>
    );
};

export default NavBar;







