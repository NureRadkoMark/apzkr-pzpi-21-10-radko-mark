import React, {useState} from 'react';
import { getLocalizedString } from '../locale/lang';
import '../styles/HomePage.css';

const HomePage = () => {
    const [lang, setLang] = useState(localStorage.getItem('language'));
    return (
        <div className="home-page">
            <div className="header">
                <h1>{getLocalizedString(lang, "welcome")}</h1>
            </div>
            <div className="intro">
                <p>{getLocalizedString(lang, "intro")}</p>
            </div>
            <div className="features">
                <h2>{getLocalizedString(lang, "Title")}</h2>
                <ul>
                    <li>{getLocalizedString(lang, "feature1")}</li>
                    <li>{getLocalizedString(lang, "feature2")}</li>
                    <li>{getLocalizedString(lang, "feature3")}</li>
                    <li>{getLocalizedString(lang, "feature4")}</li>
                    <li>{getLocalizedString(lang, "feature5")}</li>
                </ul>
            </div>
            <div className="description">
                <p>{getLocalizedString(lang, "description")}</p>
            </div>
            <div className="contact">
                <h2>{getLocalizedString(lang, "contact")}</h2>
                <p>{getLocalizedString(lang, "phone")}: +123 456 789</p>
                <p>{getLocalizedString(lang, "email")}: info@vetnet.com</p>
            </div>
        </div>
    );
};

export default HomePage;
