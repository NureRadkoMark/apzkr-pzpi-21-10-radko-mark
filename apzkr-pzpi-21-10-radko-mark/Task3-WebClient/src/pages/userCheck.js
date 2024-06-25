import React, { useState, useEffect } from 'react';
import { getLocalizedString } from '../locale/lang';
import { NotificationManager, NotificationContainer } from 'react-notifications';
import '../styles/UserCheckPage.css';

const UserCheckPage = () => {
    let preferredLang = localStorage.getItem('language');
    const [checkData, setCheckData] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchUserCheck();
    }, []);

    const fetchUserCheck = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/check/user', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch user check');
            }

            const data = await response.json();
            const totalAmount = calculateTotalAmount(data.services); // Calculate total amount
            setCheckData({ ...data, totalAmount }); // Update state with total amount
        } catch (error) {
            console.error('Error fetching user check:', error);
            setErrorMessage(error.message || getLocalizedString(preferredLang, 'Failed to fetch user check'));
            NotificationManager.error(error.message || getLocalizedString(preferredLang, 'Failed to fetch user check'));
        }
    };

    const calculateTotalAmount = (services) => {
        let total = 0;
        services.forEach(service => {
            total += service.price * service.count; // Calculate total based on price and count
        });
        return total.toFixed(2); // Ensure total amount is formatted to two decimal places
    };

    const handlePayment = () => {
        NotificationManager.success(getLocalizedString(preferredLang, 'Payment successful'));
        // Here you can add the actual payment processing logic
    };

    return (
        <div className="user-check-page">
            <h2>{getLocalizedString(preferredLang, 'User Check')}</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {checkData ? (
                <div className="check-container">
                    <div className="check-header">
                        <h3>{getLocalizedString(preferredLang, 'Check ID')}: {checkData.CheckId}</h3>
                        <p>{getLocalizedString(preferredLang, 'Date')}: {new Date(checkData.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="services-list">
                        {checkData.services.map((service, index) => (
                            <div key={index} className="service-item">
                                <p><strong>{service.serviceName}</strong> ({service.departmentName})</p>
                                <p>{getLocalizedString(preferredLang, 'Price')}: {service.price} x {service.count} = {service.price * service.count}</p>
                            </div>
                        ))}
                    </div>
                    <div className="total-amount">
                        <p>{getLocalizedString(preferredLang, 'Total Amount')}: {checkData.totalAmount}</p>
                    </div>
                    <button className="pay-button" onClick={handlePayment}>
                        {getLocalizedString(preferredLang, 'Pay')}
                    </button>
                </div>
            ) : (
                <p>{getLocalizedString(preferredLang, 'Loading check data...')}</p>
            )}
            <NotificationContainer />
        </div>
    );
};

export default UserCheckPage;

