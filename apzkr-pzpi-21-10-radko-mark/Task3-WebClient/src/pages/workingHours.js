import React, { useState, useEffect } from 'react';
import { getLocalizedString } from '../locale/lang';
import { NotificationManager, NotificationContainer } from 'react-notifications';
import '../styles/WorkHoursPage.css';

const EmployeePage = () => {
    const preferredLang = localStorage.getItem('language');
    const [employees, setEmployees] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const selectedDepartmentId = localStorage.getItem('DepartmentId');

            const response = await fetch('http://localhost:5000/api/employee/hours/department', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ DepartmentId: selectedDepartmentId })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Не удалось загрузить данные о сотрудниках');
            }

            const data = await response.json();

            if (!Array.isArray(data)) {
                throw new Error('Непредвиденный формат данных');
            }

            setEmployees(data);
        } catch (error) {
            console.error('Ошибка при загрузке данных о сотрудниках:', error);
            const errorMessage = error.message || getLocalizedString(preferredLang, 'Ошибка при загрузке данных о сотрудниках');
            setErrorMessage(errorMessage);
            NotificationManager.error(errorMessage);
        }
    };

    return (
        <div className="employee-page">
            <h2>{getLocalizedString(preferredLang, 'Робітники')}</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <div className="employees-list">
                {employees.map((employeeWorkHours) => (
                    <div key={employeeWorkHours.EmployeeWorkHoursId} className="employee-card">
                        {employeeWorkHours.Employee && employeeWorkHours.Employee.User && (
                            <>
                                <p>{`${employeeWorkHours.Employee.User.FirstName || ''} ${employeeWorkHours.Employee.User.SecondName || ''}`}</p>
                                <p>{getLocalizedString(preferredLang, 'Роль')}: {employeeWorkHours.Employee.Role}</p>
                                <p>{getLocalizedString(preferredLang, 'Номер телефону')}: {employeeWorkHours.Employee.User.PhoneNumber || ''}</p>
                            </>
                        )}
                        <p>{getLocalizedString(preferredLang, 'Дата')}: {new Date(employeeWorkHours.WorkDate).toLocaleDateString(preferredLang)}</p>
                        <p>{getLocalizedString(preferredLang, 'Час початку')}: {employeeWorkHours.StartTime}</p>
                        <p>{getLocalizedString(preferredLang, 'Кінець зміни')}: {employeeWorkHours.EndTime || getLocalizedString(preferredLang, 'Працює')}</p>
                    </div>
                ))}
            </div>
            <NotificationContainer />
        </div>
    );
};

export default EmployeePage;



