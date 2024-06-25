import React, { useState, useEffect } from 'react';
import { getLocalizedString } from '../locale/lang';

const AppointmentsPage = () => {
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [lang, setLang] = useState(localStorage.getItem('language'));

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await fetch('http://localhost:5000/api/appointment/user', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch appointments');
            }

            const data = await response.json();
            const upcomingAppointments = data.filter(appointment =>
                new Date(appointment.DateAndTime) > new Date()
            );
            upcomingAppointments.sort((a, b) => new Date(a.DateAndTime) - new Date(b.DateAndTime));
            setAppointments(upcomingAppointments);
            setFilteredAppointments(upcomingAppointments);
        } catch (error) {
            console.error('Error fetching appointments:', error);
            setAppointments([]);
            setFilteredAppointments([]);
        }
    };

    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime);
        return date.toLocaleString(lang === 'ua' ? 'uk-UA' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
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
        <div className="appointments-page">
            <h1 style={{ textAlign: 'center' }}>{getLocalizedString(lang, 'appointmentsTitle')}</h1>
            <div className="date-filter">
                <label>{getLocalizedString(lang, 'StartDate')}:</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <label>{getLocalizedString(lang, 'EndDate')}:</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                <button onClick={handleFilterSubmit}>{getLocalizedString(lang, 'Apply')}</button>
            </div>
            <div className="appointments-list">
                {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((appointment) => (
                        <div key={appointment.AppointmentId} className="appointment-item">
                            <p>{getLocalizedString(lang, 'dateTime')}: {formatDateTime(appointment.DateAndTime)}</p>
                            <p>{getLocalizedString(lang, 'petName')}: {appointment.Pet.Name}</p>
                            <p>{getLocalizedString(lang, 'breed')}: {appointment.Pet.Breed}</p>
                            <p>{getLocalizedString(lang, 'animalType')}: {appointment.Pet.AnimalType}</p>
                            <p>{getLocalizedString(lang, 'clinicName')}: {appointment.Employee.Department.Name}</p>
                            <p>{getLocalizedString(lang, 'clinicAddress')}: {appointment.Employee.Department.Address}</p>
                            <p>{getLocalizedString(lang, 'doctorName')}: {`${appointment.Employee.User.FirstName} ${appointment.Employee.User.SecondName}`}</p>
                        </div>
                    ))
                ) : (
                    <p>{getLocalizedString(lang, 'noAppointmentsFound')}</p>
                )}
            </div>
        </div>
    );
};

export default AppointmentsPage;









