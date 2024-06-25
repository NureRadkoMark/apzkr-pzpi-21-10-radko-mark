import React, { useState, useEffect } from 'react';
import { getLocalizedString } from '../locale/lang';
import '../styles/MyPetsPage.css';

const MyPetsPage = () => {
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'ua');
    const [pets, setPets] = useState([]);
    const [message, setMessage] = useState('');
    const [selectedPetId, setSelectedPetId] = useState(null);

    useEffect(() => {
        fetchPets();
    }, []);

    const fetchPets = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/pet/user', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                }
            });
            const data = await response.json();
            setPets(data);
        } catch (error) {
            console.error('Error fetching pets:', error);
            setMessage(getLocalizedString(language, 'errorFetchingPets'));
        }
    };

    const handleAddPet = () => {
        window.location.href = '/add-pet';
    };

    const handlePetClick = (petId) => {
        setSelectedPetId(petId);
        localStorage.setItem('selectedPetId', petId);
    };

    const handleAppointmentClick = () => {
        if (selectedPetId) {
            window.location.href = `/book-appointment`;
        }
    };

    return (
        <div className="mypets-container">
            <h1>{getLocalizedString(language, 'myPets')}</h1>
            <div className="pets-grid">
                {pets.length > 0 ? (
                    pets.map(pet => (
                        <div
                            key={pet.PetId}
                            className={`pet-card ${selectedPetId === pet.PetId ? 'selected' : ''}`}
                            onClick={() => handlePetClick(pet.PetId)}
                        >
                            <h2>{pet.Name}</h2>
                            <p>{getLocalizedString(language, 'breed')}: {pet.Breed}</p>
                            <p>{getLocalizedString(language, 'animalType')}: {pet.AnimalType}</p>
                            <p>{getLocalizedString(language, 'docCode')}: {pet.DocCode}</p>
                            <p>{getLocalizedString(language, 'dateBirth')}: {new Date(pet.DateBirth).toLocaleDateString(language)}</p>
                        </div>
                    ))
                ) : (
                    <p>{message || getLocalizedString(language, 'noPets')}</p>
                )}
            </div>
            {selectedPetId && (
                <button className="appointment-button" onClick={handleAppointmentClick}>
                    {getLocalizedString(language, 'bookAppointment')}
                </button>
            )}
            <button className="add-pet-button" onClick={handleAddPet}>
                {getLocalizedString(language, 'addPet')}
            </button>
        </div>
    );
};

export default MyPetsPage;

