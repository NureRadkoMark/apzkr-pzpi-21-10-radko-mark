import React, { useState, useEffect } from 'react';
import { getLocalizedString } from '../locale/lang';
import '../styles/AppointmentPage.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment-timezone';
moment.tz.setDefault('Europe/Kiev');

const CreateAppointment = () => {
    const [address, setAddress] = useState('');
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'ua');
    const [appointmentDate, setAppointmentDate] = useState(moment().tz('Europe/Kiev'));

    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    const searchDepartments = async () => {
        try {
            if (!address) {
                setDepartments([]);
                return;
            }

            const response = await fetch('http://localhost:5000/api/department/search', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Address: address, Lang: language }),
            });

            if (response.ok) {
                const data = await response.json();
                setDepartments(data);
            } else {
                setDepartments([]);
                const error = await response.json();
                console.error('Error fetching departments:', error);
            }
        } catch (error) {
            console.error('Unexpected error:', error);
        }
    };

    const makeAppointment = async () => {
        const petId = localStorage.getItem('selectedPetId');
        if (!petId || !selectedDepartment) {
            NotificationManager.error(getLocalizedString(language, 'selectDepartmentAndPet'));
            return;
        }

        // Преобразуем выбранную дату в нужный формат и часовой пояс
        const formattedDate = appointmentDate.clone().tz('Europe/Kiev').format('YYYY-MM-DD HH:mm');

        try {
            const token = localStorage.getItem('jwtToken');
            const response = await fetch('http://localhost:5000/api/appointment', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    DepartmentId: selectedDepartment.DepartmentId,
                    PetId: petId,
                    DateAndTime: formattedDate,
                    Lang: language,
                }),
            });

            if (response.ok) {
                NotificationManager.success(
                    getLocalizedString(language, 'appointmentSuccess'),
                    `${getLocalizedString(language, 'appointmentDateTime')} ${formattedDate}`,
                    3000
                );
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
        <div className="mypets-container">
            <h1>{getLocalizedString(language, 'createAppointment')}</h1>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder={getLocalizedString(language, 'searchPlaceholder')}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
                <button onClick={searchDepartments} className="search-button">
                    {getLocalizedString(language, 'searchButton')}
                </button>
            </div>

            <div className="departments-grid">
                {departments.length === 0 ? (
                    <p>{getLocalizedString(language, 'noDepartmentsFound')}</p>
                ) : (
                    departments.map((department) => (
                        <div
                            key={department.DepartmentId}
                            className={`department-card ${selectedDepartment?.DepartmentId === department.DepartmentId ? 'selected' : ''}`}
                            onClick={() => setSelectedDepartment(department)}
                        >
                            <h2>{department.Name}</h2>
                            <p>{getLocalizedString(language, 'departmentAddress')}: {department.Address}</p>
                            <p>{getLocalizedString(language, 'departmentPhone')}: {department.PhoneNumber}</p>
                            <p>{getLocalizedString(language, 'departmentInfo')}: {department.Info}</p>
                            <p>{getLocalizedString(language, 'departmentWorkingHours')}: {department.StartWorkingTime} - {department.EndWorkingTime}</p>
                        </div>
                    ))
                )}
            </div>

            {selectedDepartment && (
                <div className="appointment-form">
                    <DatePicker
                        selected={appointmentDate.toDate()}
                        onChange={(date) => setAppointmentDate(moment(date).tz('Europe/Kiev'))}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        timeCaption="Time"
                        dateFormat="yyyy-MM-dd HH:mm"
                        className="date-picker"
                    />
                    <button onClick={makeAppointment} className="appointment-button">
                        {getLocalizedString(language, 'makeAppointmentButton')}
                    </button>
                </div>
            )}

            <NotificationContainer />
        </div>
    );
};

export default CreateAppointment;







