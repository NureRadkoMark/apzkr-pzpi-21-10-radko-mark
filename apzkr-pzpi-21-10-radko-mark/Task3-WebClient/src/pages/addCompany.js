import React, { useState } from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { getLocalizedString } from '../locale/lang';
import '../styles/AddCompanyPage.css';

const AddCompanyPage = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'ua');

    const handleAddCompany = async () => {
        if (!name || !description) {
            NotificationManager.error(getLocalizedString(language, 'requiredFieldsMissing'));
            return;
        }

        try {
            const token = localStorage.getItem('jwtToken');
            const response = await fetch('http://localhost:5000/api/company/', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Name: name,
                    Description: description,
                    Lang: language,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                NotificationManager.success(getLocalizedString(language, 'companyAdded'));
                setName('');
                setDescription('');
            } else {
                const error = await response.json();
                NotificationManager.error(error.error);
            }
        } catch (error) {
            console.error('Unexpected error:', error);
            NotificationManager.error(getLocalizedString(language, 'internalServerError'));
        }
    };

    return (
        <div className="add-company-container">
            <h1>{getLocalizedString(language, 'addCompany')}</h1>

            <div className="form-group">
                <label>{getLocalizedString(language, 'companyName')}</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={getLocalizedString(language, 'enterCompanyName')}
                />
            </div>

            <div className="form-group">
                <label>{getLocalizedString(language, 'companyDescription')}</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={getLocalizedString(language, 'enterCompanyDescription')}
                />
            </div>

            <button onClick={handleAddCompany} className="submit-button">
                {getLocalizedString(language, 'addCompanyButton')}
            </button>

            <NotificationContainer />
        </div>
    );
};

export default AddCompanyPage;
