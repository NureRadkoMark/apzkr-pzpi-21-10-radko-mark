import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLocalizedString } from '../locale/lang';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import '../styles/AddEmployee.css';

const AddEmployeePage = () => {
    let preferredLang = localStorage.getItem('language');
    const [roles, setRoles] = useState([]);
    const [newRole, setNewRole] = useState('');
    const [description, setDescription] = useState('');
    const [IOTCode, setIOTCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const departmentId = localStorage.getItem('DepartmentId');

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/role/all', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch roles');
            }

            const data = await response.json();
            setRoles(data);
        } catch (error) {
            console.error('Error fetching roles:', error);
            setErrorMessage(error.message || 'Failed to fetch roles');
        }
    };

    const handleAddEmployee = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/employee/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
                },
                body: JSON.stringify({ NewRole: newRole, Description: description, DepartmentId: departmentId, IOTCode: IOTCode, Lang: preferredLang })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to add employee');
            }

            const data = await response.json();
            NotificationManager.success('Employee added successfully')
        } catch (error) {
            console.error('Error adding employee:', error);
            setErrorMessage(getLocalizedString(preferredLang, 'Failed to add employee'));
            NotificationManager.error(getLocalizedString(preferredLang, 'Failed to add employee'));
        }
    };

    return (
        <div className="add-employee-page">
            <h2>{getLocalizedString(preferredLang, 'Add Employee')}</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
            <div className="form-field">
                <label>{getLocalizedString(preferredLang, 'Role')}</label>
                <select name="NewRole" value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                    <option value="">{getLocalizedString(preferredLang, 'Select Role')}</option>
                    {roles.map((role) => (
                        <option key={role.RoleId} value={role.RoleName}>
                            {role.RoleName}
                        </option>
                    ))}
                </select>
            </div>
            <div className="form-field">
                <label>{getLocalizedString(preferredLang, 'Description')}</label>
                <input
                    type="text"
                    name="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <div className="form-field">
                <label>{getLocalizedString(preferredLang, 'IOT Code')}</label>
                <input
                    type="text"
                    name="IOTCode"
                    value={IOTCode}
                    onChange={(e) => setIOTCode(e.target.value)}
                />
            </div>
            <button className="add-button" onClick={handleAddEmployee}>
                {getLocalizedString(preferredLang, 'Add Employee')}
            </button>
            <NotificationContainer />
        </div>
    );
};

export default AddEmployeePage;
