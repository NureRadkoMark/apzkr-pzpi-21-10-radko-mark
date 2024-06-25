import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLocalizedString } from '../locale/lang';
import '../styles/AddServicePage.css';

const AddServicePage = () => {
    let preferredLang = localStorage.getItem('language');
    const [formData, setFormData] = useState({ Name: '', Info: '', Price: '', Lang: preferredLang });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/service/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to add service');
            }

            setSuccessMessage('Service added successfully');
            setFormData({ Name: '', Info: '', Price: '', Lang: preferredLang });
            setTimeout(() => {
                navigate('/services');
            }, 2000);
        } catch (error) {
            console.error('Error adding service:', error);
            setErrorMessage(error.message || 'Failed to add service');
        }
    };

    return (
        <div className="add-service-page">
            <h2>{getLocalizedString(preferredLang, "Add Service")}</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
            <form onSubmit={handleSubmit} className="service-form">
                <div className="service-field">
                    <label>{getLocalizedString(preferredLang, "Name")}</label>
                    <input
                        type="text"
                        name="Name"
                        value={formData.Name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="service-field">
                    <label>{getLocalizedString(preferredLang, "Info")}</label>
                    <input
                        type="text"
                        name="Info"
                        value={formData.Info}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="service-field">
                    <label>{getLocalizedString(preferredLang, "Price")}</label>
                    <input
                        type="number"
                        name="Price"
                        value={formData.Price}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit" className="submit-button">
                    {getLocalizedString(preferredLang, "Add")}
                </button>
                <button type="button" className="cancel-button" onClick={() => navigate('/services')}>
                    {getLocalizedString(preferredLang, "Cancel")}
                </button>
            </form>
        </div>
    );
};

export default AddServicePage;
