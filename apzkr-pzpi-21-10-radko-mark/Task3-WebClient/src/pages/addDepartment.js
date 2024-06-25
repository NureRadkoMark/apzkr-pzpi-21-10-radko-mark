import React, { useState } from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { getLocalizedString } from '../locale/lang';
import '../styles/AddDepartmentPage.css';

const AddDepartmentPage = () => {
    const [address, setAddress] = useState('');
    const [startWorkingTime, setStartWorkingTime] = useState('');
    const [endWorkingTime, setEndWorkingTime] = useState('');
    const [name, setName] = useState('');
    const [info, setInfo] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'ua');
    const selectedCompanyId = localStorage.getItem('selectedCompanyId');

    const handleAddDepartment = async () => {
        if (!address || !startWorkingTime || !endWorkingTime || !name || !phoneNumber) {
            NotificationManager.error(getLocalizedString(language, 'requiredFieldsMissing'));
            return;
        }

        try {
            const token = localStorage.getItem('jwtToken');
            const response = await fetch('http://localhost:5000/api/department', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Address: address,
                    StartWorkingTime: startWorkingTime,
                    EndWorkingTime: endWorkingTime,
                    Name: name,
                    Info: info,
                    PhoneNumber: phoneNumber,
                    CompanyId: selectedCompanyId,
                    Lang: language,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                NotificationManager.success(getLocalizedString(language, 'departmentAdded'));
                setAddress('');
                setStartWorkingTime('');
                setEndWorkingTime('');
                setName('');
                setInfo('');
                setPhoneNumber('');
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
        <div className="add-department-container">
            <h1>{getLocalizedString(language, 'addDepartment')}</h1>

            <div className="form-group">
                <label>{getLocalizedString(language, 'departmentAddress')}</label>
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={getLocalizedString(language, 'enterDepartmentAddress')}
                />
            </div>

            <div className="form-group">
                <label>{getLocalizedString(language, 'startWorkingTime')}</label>
                <input
                    type="time"
                    value={startWorkingTime}
                    onChange={(e) => setStartWorkingTime(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label>{getLocalizedString(language, 'endWorkingTime')}</label>
                <input
                    type="time"
                    value={endWorkingTime}
                    onChange={(e) => setEndWorkingTime(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label>{getLocalizedString(language, 'departmentName')}</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={getLocalizedString(language, 'enterDepartmentName')}
                />
            </div>

            <div className="form-group">
                <label>{getLocalizedString(language, 'departmentInfo')}</label>
                <textarea
                    value={info}
                    onChange={(e) => setInfo(e.target.value)}
                    placeholder={getLocalizedString(language, 'enterDepartmentInfo')}
                />
            </div>

            <div className="form-group">
                <label>{getLocalizedString(language, 'phoneNumber')}</label>
                <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder={getLocalizedString(language, 'enterPhoneNumber')}
                />
            </div>

            <button onClick={handleAddDepartment} className="submit-button">
                {getLocalizedString(language, 'addDepartmentButton')}
            </button>

            <NotificationContainer />
        </div>
    );
};

export default AddDepartmentPage;
