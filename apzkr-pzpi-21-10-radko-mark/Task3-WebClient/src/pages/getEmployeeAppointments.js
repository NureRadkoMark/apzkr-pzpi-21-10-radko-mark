import React, { useState, useEffect } from 'react';
import '../styles/DoctorCalendar.css';
import { getLocalizedString } from '../locale/lang';

const DoctorCalendar = () => {
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [lang, setLang] = useState(localStorage.getItem('language'));

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        const token = localStorage.getItem('jwtToken');
        let url = 'http://localhost:5000/api/appointment/employee';

        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch appointments');
            }

            const data = await response.json();
            data.sort((a, b) => new Date(a.DateAndTime) - new Date(b.DateAndTime));
            setAppointments(data);
            setFilteredAppointments(data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
            setAppointments([]);
            setFilteredAppointments([]);
        }
    };

    const handleAppointmentClick = (appointment) => {
        setSelectedAppointment(appointment);
        localStorage.setItem('PetId', appointment.Pet.PetId);
    };

    const handleCreatePrescription = async (body) => {
        const token = localStorage.getItem('jwtToken');
        const petId = localStorage.getItem('PetId');

        try {
            const response = await fetch('http://localhost:5000/api/prescription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ PetId: petId, Body: body, Lang: lang }),
            });

            if (response.ok) {
                alert(getLocalizedString(lang, 'Prescription created successfully.'));
                setSelectedAppointment(null);
            } else {
                const errorData = await response.json();
                alert(getLocalizedString(lang, errorData.error));
            }
        } catch (error) {
            console.error('Error creating prescription:', error);
            alert(getLocalizedString(lang, 'Internal Server Error - Unexpected error'));
        }
    };

    const handleFilterSubmit = () => {
        // Применяем фильтрацию локально, не отправляя запрос на сервер
        const filtered = appointments.filter(appointment => {
            const appointmentDate = new Date(appointment.DateAndTime).getTime();
            const filterStartDate = startDate ? new Date(startDate).getTime() : 0;
            const filterEndDate = endDate ? new Date(endDate).getTime() : Number.MAX_SAFE_INTEGER;
            return appointmentDate >= filterStartDate && appointmentDate <= filterEndDate;
        });

        setFilteredAppointments(filtered);
    };

    return (
        <div className="doctor-calendar">
            <div className="date-filter">
                <label>{getLocalizedString(lang, 'Start Date')}:</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <label>{getLocalizedString(lang, 'End Date')}:</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                <button onClick={handleFilterSubmit}>{getLocalizedString(lang, 'Apply')}</button>
            </div>
            <div className="appointments-container">
                <div className="appointments-list">
                    {filteredAppointments.length > 0 ? (
                        filteredAppointments.map((appointment) => (
                            <div key={appointment.AppointmentId} className={`appointment-item ${selectedAppointment === appointment ? 'selected' : ''}`} onClick={() => handleAppointmentClick(appointment)}>
                                <p>{getLocalizedString(lang, 'Time')}: {new Date(appointment.DateAndTime).toLocaleTimeString()}</p>
                                <p>{getLocalizedString(lang, 'Animal')}: {appointment.Pet.AnimalType + "   " + appointment.Pet.Breed}</p>
                                <p>{getLocalizedString(lang, 'Owner IOT Code')}: {appointment.Employee.User.IOTCode}</p>
                            </div>
                        ))
                    ) : (
                        <p>{getLocalizedString(lang, 'No appointments found.')}</p>
                    )}
                </div>
                {selectedAppointment && (
                    <div className="appointment-details">
                        <h3>{getLocalizedString(lang, 'Appointment Details')}</h3>
                        <p>{getLocalizedString(lang, 'Time')}: {new Date(selectedAppointment.DateAndTime).toLocaleString()}</p>
                        <p>{getLocalizedString(lang, 'Animal')}: {selectedAppointment.Pet.Name}</p>
                        <p>{getLocalizedString(lang, 'Breed')}: {selectedAppointment.Pet.Breed}</p>
                        <p>{getLocalizedString(lang, 'Animal Type')}: {selectedAppointment.Pet.AnimalType}</p>
                        <p>{getLocalizedString(lang, 'Owner Name')}: {selectedAppointment.Employee.User.FirstName} {selectedAppointment.Employee.User.SecondName}</p>
                        <p>{getLocalizedString(lang, 'Owner Phone')}: {selectedAppointment.Employee.User.PhoneNumber}</p>
                        <p>{getLocalizedString(lang, 'Department')}: {selectedAppointment.Employee.Department.Name}</p>
                        <p>{getLocalizedString(lang, 'Department Address')}: {selectedAppointment.Employee.Department.Address}</p>
                        <form onSubmit={(e) => { e.preventDefault(); handleCreatePrescription(e.target.body.value); }}>
                            <label>{getLocalizedString(lang, 'Enter prescription details:')}</label>
                            <textarea name="body" rows="4" required />
                            <button type="submit">{getLocalizedString(lang, 'Create Prescription')}</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorCalendar;

