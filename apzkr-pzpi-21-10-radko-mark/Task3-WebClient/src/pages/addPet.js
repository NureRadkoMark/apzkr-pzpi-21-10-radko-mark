import React, { useState } from 'react';
import { getLocalizedString } from '../locale/lang';
import '../styles/AddPetPage.css';

const AddPetPage = () => {
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'ua');
    const [breed, setBreed] = useState('');
    const [animalType, setAnimalType] = useState('');
    const [name, setName] = useState('');
    const [docCode, setDocCode] = useState('');
    const [dateBirth, setDateBirth] = useState('');
    const [message, setMessage] = useState('');

    const handleBreedChange = (e) => {
        setBreed(e.target.value);
    };

    const handleAnimalTypeChange = (e) => {
        setAnimalType(e.target.value);
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleDocCodeChange = (e) => {
        setDocCode(e.target.value);
    };

    const handleDateBirthChange = (e) => {
        setDateBirth(e.target.value);
    };

    const handleAddPet = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/pet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                },
                body: JSON.stringify({
                    Breed: breed,
                    AnimalType: animalType,
                    Name: name,
                    DocCode: docCode,
                    DateBirth: dateBirth,
                    Lang: language
                })
            });
            const data = await response.json();
            if (response.ok) {
                setMessage(getLocalizedString(language, 'petAddedSuccessfully'));
            } else {
                setMessage(data.error);
            }
        } catch (error) {
            console.error('Error adding pet:', error);
            setMessage(getLocalizedString(language, 'error'));
        }
    };

    return (
        <div className="add-pet-container">
            <h1>{getLocalizedString(language, 'addPet')}</h1>
            <div>
                <label>{getLocalizedString(language, 'breed')}:</label>
                <input type="text" value={breed} onChange={handleBreedChange} />
            </div>
            <div>
                <label>{getLocalizedString(language, 'animalType')}:</label>
                <input type="text" value={animalType} onChange={handleAnimalTypeChange} />
            </div>
            <div>
                <label>{getLocalizedString(language, 'name')}:</label>
                <input type="text" value={name} onChange={handleNameChange} />
            </div>
            <div>
                <label>{getLocalizedString(language, 'docCode')}:</label>
                <input type="text" value={docCode} onChange={handleDocCodeChange} />
            </div>
            <div>
                <label>{getLocalizedString(language, 'dateBirth')}:</label>
                <input type="date" value={dateBirth} onChange={handleDateBirthChange} />
            </div>
            <button onClick={handleAddPet}>{getLocalizedString(language, 'addPet')}</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default AddPetPage;
