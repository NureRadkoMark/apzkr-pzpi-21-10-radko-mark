import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ProfilePage.css';
import { getLocalizedString } from '../locale/lang'; // Импорт функции локализации

const ProfilePage = () => {
    let preferredLang = localStorage.getItem('language');
    const [userDetails, setUserDetails] = useState({
        FirstName: '',
        SecondName: '',
        PhoneNumber: '',
        BirthDay: '',
        PassportCode: '',
        IOTCode: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const fetchUserDetails = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/user/details', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch user details');
            }

            const data = await response.json();
            setUserDetails(data.user);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching user details:', error);
            setErrorMessage(error.message || 'Failed to fetch user details');
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setUserDetails({
            ...userDetails,
            [e.target.name]: e.target.value
        });
    };

    const handleSaveChanges = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/user/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
                },
                body: JSON.stringify(userDetails)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update user details');
            }

            setSuccessMessage('User data updated successfully');
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating user details:', error);
            setErrorMessage(error.message || 'Failed to update user details');
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        fetchUserDetails(); // Refresh user details in case changes were not saved
    };

    const renderProfileFields = () => {
        return (
            <>
                <div className="profile-field">
                    <label>{getLocalizedString(preferredLang, "firstName")}</label>
                    <input
                        type="text"
                        name="FirstName"
                        value={userDetails.FirstName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                    />
                </div>
                <div className="profile-field">
                    <label>{getLocalizedString(preferredLang, "secondName")}</label>
                    <input
                        type="text"
                        name="SecondName"
                        value={userDetails.SecondName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                    />
                </div>
                <div className="profile-field">
                    <label>{getLocalizedString(preferredLang, "phoneNumber")}</label>
                    <input
                        type="text"
                        name="PhoneNumber"
                        value={userDetails.PhoneNumber}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                    />
                </div>
                <div className="profile-field">
                    <label>{getLocalizedString(preferredLang, "birthDay")}</label>
                    <input
                        type="text"
                        name="BirthDay"
                        value={userDetails.BirthDay}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                    />
                </div>
                <div className="profile-field">
                    <label>{getLocalizedString(preferredLang, "passportCode")}</label>
                    <input
                        type="text"
                        name="PassportCode"
                        value={userDetails.PassportCode}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                    />
                </div>
            </>
        );
    };

    return (
        <div className="profile-page">
            <h2>{getLocalizedString(preferredLang, "Profile") + "   " + userDetails.IOTCode}</h2>
            {isLoading && <p>Loading...</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
            {!isLoading && !errorMessage && (
                <>
                    {renderProfileFields()}
                    {!isEditing && (
                        <button className="edit-button" onClick={handleEditClick}>
                            {getLocalizedString(preferredLang, "Edit")}
                        </button>
                    )}
                    {isEditing && (
                        <>
                            <button className="save-button" onClick={handleSaveChanges}>
                                {getLocalizedString(preferredLang, "Save")}
                            </button>
                            <button className="cancel-button" onClick={handleCancelEdit}>
                                {getLocalizedString(preferredLang, "Cancel")}
                            </button>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default ProfilePage;
