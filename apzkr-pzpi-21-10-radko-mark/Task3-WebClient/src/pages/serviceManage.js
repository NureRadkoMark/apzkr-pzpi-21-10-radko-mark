import React, { useState, useEffect } from 'react';
import { getLocalizedString } from '../locale/lang';
import { NotificationManager, NotificationContainer } from 'react-notifications';
import '../styles/ServicePage.css';

const ServicePage = () => {
    let preferredLang = localStorage.getItem('language');
    const [services, setServices] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState(null);
    const [formData, setFormData] = useState({ Name: '', Info: '', Price: '', Lang: preferredLang });
    const [IOTCode, setIOTCode] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/service/department', {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                }
            });
            const data = await response.json();
            setServices(data);
        } catch (error) {
            console.error('Error fetching services:', error);
            NotificationManager.error(getLocalizedString(preferredLang, 'Error fetching services'));
        }
    };

    const handleSearchUser = async () => {
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

    const handleAddServiceToCart = async (serviceId) => {
        if (!user) {
            NotificationManager.error(getLocalizedString(preferredLang, 'No user selected'));
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/service/user', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ServiceId: serviceId, IOTCode, Count: 1 })
            });
            const data = await response.json();
            NotificationManager.success(getLocalizedString(preferredLang, 'Service added to cart'));
            if (data.error) {
                NotificationManager.error(getLocalizedString(preferredLang, data.error));
            } else {
            }
        } catch (error) {
            NotificationManager.error(getLocalizedString(preferredLang, 'Error adding service to cart'));
        }
    };

    const handleEditService = (service) => {
        setIsEditing(true);
        setSelectedServiceId(service.ServiceId);
        setFormData({
            Name: service.Name,
            Info: service.Info,
            Price: service.Price,
            Lang: preferredLang
        });
    };

    const handleSaveService = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/service/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                },
                body: JSON.stringify({ ...formData, ServiceId: selectedServiceId })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update service');
            }

            NotificationManager.success(getLocalizedString(preferredLang, 'Service updated successfully'));
            setIsEditing(false);
            setSelectedServiceId(null);
            fetchServices();
        } catch (error) {
            console.error('Error updating service:', error);
            NotificationManager.error(getLocalizedString(preferredLang, 'Failed to update service'));
        }
    };

    const handleDeleteService = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/service/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...formData, ServiceId: selectedServiceId })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete service');
            }

            NotificationManager.success(getLocalizedString(preferredLang, 'Service deleted successfully'));
            setSelectedServiceId(null);
            fetchServices();
        } catch (error) {
            console.error('Error deleting service:', error);
            NotificationManager.error(getLocalizedString(preferredLang, 'Failed to delete service'));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div className="service-page">
            <h2>{getLocalizedString(preferredLang, "Services")}</h2>
            {isEditing && (
                <div className="edit-service-form">
                    <h3>{getLocalizedString(preferredLang, "Edit Service")}</h3>
                    <form onSubmit={handleSaveService}>
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
                        <button type="submit" className="save-button">
                            {getLocalizedString(preferredLang, "Save")}
                        </button>
                        <button type="button" className="cancel-button" onClick={() => setIsEditing(false)}>
                            {getLocalizedString(preferredLang, "Cancel")}
                        </button>
                        <button type="button" className="delete-button" onClick={handleDeleteService}>
                            {getLocalizedString(preferredLang, "Delete")}
                        </button>
                    </form>
                </div>
            )}

            <div className="user-search-section">
                <input
                    type="text"
                    placeholder={getLocalizedString(preferredLang, 'Enter IOT Code')}
                    value={IOTCode}
                    onChange={(e) => setIOTCode(e.target.value)}
                />
                <button onClick={handleSearchUser}>{getLocalizedString(preferredLang, 'Search')}</button>
            </div>

            {user && (
                <div className="user-card">
                    <h2>{user.FirstName} {user.SecondName}</h2>
                    <p>{getLocalizedString(preferredLang, 'Phone')}: {user.PhoneNumber}</p>
                    <p>{getLocalizedString(preferredLang, 'Birth Day')}: {user.BirthDay}</p>
                    <p>{getLocalizedString(preferredLang, 'Passport Code')}: {user.PassportCode}</p>
                </div>
            )}

            <div className="services-list">
                {services.map(service => (
                    <div key={service.ServiceId} className="service-card" onClick={() => setSelectedServiceId(service.ServiceId)}>
                        <h3>{service.Name}</h3>
                        <p>{service.Info}</p>
                        <p>{getLocalizedString(preferredLang, 'Price')}: {service.Price}</p>
                        <button onClick={() => handleAddServiceToCart(service.ServiceId)}>
                            {getLocalizedString(preferredLang, 'Add to Cart')}
                        </button>
                        {selectedServiceId === service.ServiceId && (
                            <>
                                <button onClick={() => handleEditService(service)}>
                                    {getLocalizedString(preferredLang, 'Edit')}
                                </button>
                                <button onClick={handleDeleteService}>
                                    {getLocalizedString(preferredLang, 'Delete')}
                                </button>
                            </>
                        )}
                    </div>
                ))}
            </div>

            <NotificationContainer />
        </div>
    );
};

export default ServicePage;



