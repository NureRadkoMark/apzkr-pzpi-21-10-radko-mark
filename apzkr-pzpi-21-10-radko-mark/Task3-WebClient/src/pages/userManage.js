import React, { useState } from 'react';
import { getLocalizedString } from '../locale/lang';
import {NotificationManager, NotificationContainer} from 'react-notifications';
import '../styles/UserManagement.css'

const UserManagement = () => {
    let preferredLang = localStorage.getItem('language');
    const [IOTCode, setIOTCode] = useState('');
    const [user, setUser] = useState(null);

    const handleSearch = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/user/code', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ IOTCode })
            });
            const data = await response.json();
            if (data === "User not found") {
                NotificationManager.error(getLocalizedString(preferredLang, 'User not found'));
                setUser(null);
            } else {
                setUser(data);
            }
        } catch (error) {
            NotificationManager.error(getLocalizedString(preferredLang, 'Error fetching user data'));
        }
    };

    const handleBan = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/user/ban', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ UserId: user.UserId})
            });
            const data = await response.json();
            if (data.error) {
                NotificationManager.error(getLocalizedString(preferredLang, data.error));
            } else {
                NotificationManager.success(getLocalizedString(preferredLang, data));
            }
        } catch (error) {
            NotificationManager.error(getLocalizedString(preferredLang, 'Error banning user'));
        }
    };

    const handleUnban = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/user/unban', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ UserId: user.UserId})
            });
            const data = await response.json();
            if (data.error) {
                NotificationManager.error(getLocalizedString(preferredLang, data.error));
            } else {
                NotificationManager.success(getLocalizedString(preferredLang, data));
            }
        } catch (error) {
            NotificationManager.error(getLocalizedString(preferredLang, 'Error unbanning user'));
        }
    };

    return (
        <div className="user-management-container">
            <h1>{getLocalizedString(preferredLang, 'User Management')}</h1>
            <div className="search-container">
                <input
                    type="text"
                    placeholder={getLocalizedString(preferredLang, 'Enter IOT Code')}
                    value={IOTCode}
                    onChange={(e) => setIOTCode(e.target.value)}
                />
                <button onClick={handleSearch}>{getLocalizedString(preferredLang, 'Search')}</button>
            </div>
            {user && (
                <div className="user-card">
                    <h2>{user.FirstName} {user.SecondName}</h2>
                    <p>{getLocalizedString(preferredLang, 'Phone')}: {user.PhoneNumber}</p>
                    <p>{getLocalizedString(preferredLang, 'Birth Day')}: {user.BirthDay}</p>
                    <p>{getLocalizedString(preferredLang, 'Passport Code')}: {user.PassportCode}</p>
                    <div className="button-group">
                        <button onClick={handleBan}>{getLocalizedString(preferredLang, 'Ban User')}</button>
                        <button onClick={handleUnban}>{getLocalizedString(preferredLang, 'Unban User')}</button>
                    </div>
                </div>
            )}
            <NotificationContainer />
        </div>
    );
};

export default UserManagement;

