import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLocalizedString } from '../locale/lang';
import '../styles/DepartmentDetails.css';

const DepartmentDetailsPage = () => {
    let preferredLang = localStorage.getItem('language');
    const [departmentDetails, setDepartmentDetails] = useState({ Name: '', Address: '', StartWorkingTime: '', EndWorkingTime: '', PhoneNumber: '', Info: '' });
    const [employees, setEmployees] = useState([]);
    const [isEditingDepartment, setIsEditingDepartment] = useState(false);
    const [editingEmployeeId, setEditingEmployeeId] = useState(null);
    const [editedEmployee, setEditedEmployee] = useState({ Role: '', Description: '', User: { FirstName: '', SecondName: '', PhoneNumber: '' } });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const selectedDepartmentId = localStorage.getItem('DepartmentId');

    useEffect(() => {
        fetchDepartmentDetails();
        fetchEmployees();
    }, []);

    const fetchDepartmentDetails = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/department/details`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ DepartmentId: selectedDepartmentId })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch department details');
            }

            const data = await response.json();
            setDepartmentDetails(data);
        } catch (error) {
            console.error('Error fetching department details:', error);
            setErrorMessage(error.message || 'Failed to fetch department details');
        }
    };

    const fetchEmployees = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/employee/department', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ DepartmentId: selectedDepartmentId })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch employees');
            }

            const data = await response.json();
            setEmployees(data);
        } catch (error) {
            console.error('Error fetching employees:', error);
            setErrorMessage(error.message || 'Failed to fetch employees');
        }
    };

    const handleDepartmentInputChange = (e) => {
        setDepartmentDetails({
            ...departmentDetails,
            [e.target.name]: e.target.value
        });
    };

    const handleSaveDepartmentChanges = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/department', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
                },
                body: JSON.stringify(departmentDetails)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update department details');
            }

            setSuccessMessage('Department data updated successfully');
            setIsEditingDepartment(false);
        } catch (error) {
            console.error('Error updating department details:', error);
            setErrorMessage(error.message || 'Failed to update department details');
        }
    };

    const handleEmployeeInputChange = (e) => {
        setEditedEmployee({
            ...editedEmployee,
            [e.target.name]: e.target.value,
            User: {
                ...editedEmployee.User,
                [e.target.name]: e.target.value
            }
        });
    };

    const handleSaveEmployeeChanges = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/employee', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
                },
                body: JSON.stringify({ ...editedEmployee, EmployeeId: editingEmployeeId })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update employee details');
            }

            setEmployees(employees.map(emp => emp.EmployeeId === editingEmployeeId ? { ...emp, ...editedEmployee } : emp));
            setSuccessMessage('Employee data updated successfully');
            setEditingEmployeeId(null);
        } catch (error) {
            console.error('Error updating employee details:', error);
            setErrorMessage(error.message || 'Failed to update employee details');
        }
    };

    const handleDeleteEmployee = async (employeeId) => {
        const confirmDelete = window.confirm(getLocalizedString(preferredLang, "Are you sure you want to delete this employee?"));
        if (!confirmDelete) return;

        try {
            const response = await fetch('http://localhost:5000/api/employee', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
                },
                body: JSON.stringify({ EmployeeId: employeeId, Lang: preferredLang })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete employee');
            }

            setEmployees(employees.filter(employee => employee.EmployeeId !== employeeId));
            setSuccessMessage('Employee deleted successfully');
        } catch (error) {
            console.error('Error deleting employee:', error);
            setErrorMessage(error.message || 'Failed to delete employee');
        }
    };

    const handleEditEmployee = (employeeId) => {
        const employee = employees.find(emp => emp.EmployeeId === employeeId);
        setEditedEmployee(employee);
        setEditingEmployeeId(employeeId);
    };

    const renderEmployeeFields = (employee, index) => {
        if (!employee || !employee.User) {
            return null; 
        }

        return (
            <div key={employee.EmployeeId} className="employee-card">
                <div className="employee-header">
                    <h4>{employee.User.FirstName} {employee.User.SecondName}</h4>
                    <p>{employee.User.PhoneNumber}</p>
                </div>
                <div className="employee-details">
                    <div className="employee-field">
                        <label>{getLocalizedString(preferredLang, "Role")}</label>
                        <p>{employee.Role}</p>
                    </div>
                    <div className="employee-field">
                        <label>{getLocalizedString(preferredLang, "Description")}</label>
                        <p>{employee.Description}</p>
                    </div>
                </div>
                <div className="employee-buttons">
                    <button className="edit-button" onClick={() => handleEditEmployee(employee.EmployeeId)}>
                        {getLocalizedString(preferredLang, "Edit")}
                    </button>
                    <button className="delete-button" onClick={() => handleDeleteEmployee(employee.EmployeeId)}>
                        {getLocalizedString(preferredLang, "Delete")}
                    </button>
                </div>
            </div>
        );
    };



    const handleAddEmployee = () => {
        navigate('/add-employee');
    };

    return (
        <div className="department-details-page">
            <h2>{getLocalizedString(preferredLang, "Department Details")}</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
            <div className="department-section">
                <div className="department-field">
                    <label>{getLocalizedString(preferredLang, "Name")}</label>
                    <input
                        type="text"
                        name="Name"
                        value={departmentDetails.Name}
                        onChange={handleDepartmentInputChange}
                        disabled={!isEditingDepartment}
                    />
                </div>
                <div className="department-field">
                    <label>{getLocalizedString(preferredLang, "Address")}</label>
                    <input
                        type="text"
                        name="Address"
                        value={departmentDetails.Address}
                        onChange={handleDepartmentInputChange}
                        disabled={!isEditingDepartment}
                    />
                </div>
                <div className="department-field">
                    <label>{getLocalizedString(preferredLang, "StartWorkingTime")}</label>
                    <input
                        type="text"
                        name="StartWorkingTime"
                        value={departmentDetails.StartWorkingTime}
                        onChange={handleDepartmentInputChange}
                        disabled={!isEditingDepartment}
                    />
                </div>
                <div className="department-field">
                    <label>{getLocalizedString(preferredLang, "EndWorkingTime")}</label>
                    <input
                        type="text"
                        name="EndWorkingTime"
                        value={departmentDetails.EndWorkingTime}
                        onChange={handleDepartmentInputChange}
                        disabled={!isEditingDepartment}
                    />
                </div>
                <div className="department-field">
                    <label>{getLocalizedString(preferredLang, "PhoneNumber")}</label>
                    <input
                        type="text"
                        name="PhoneNumber"
                        value={departmentDetails.PhoneNumber}
                        onChange={handleDepartmentInputChange}
                        disabled={!isEditingDepartment}
                    />
                </div>
                <div className="department-field">
                    <label>{getLocalizedString(preferredLang, "Info")}</label>
                    <input
                        type="text"
                        name="Info"
                        value={departmentDetails.Info}
                        onChange={handleDepartmentInputChange}
                        disabled={!isEditingDepartment}
                    />
                </div>
                {!isEditingDepartment && (
                    <button className="edit-button" onClick={() => setIsEditingDepartment(true)}>
                        {getLocalizedString(preferredLang, "Edit")}
                    </button>
                )}
                {isEditingDepartment && (
                    <>
                        <button className="save-button" onClick={handleSaveDepartmentChanges}>
                            {getLocalizedString(preferredLang, "Save")}
                        </button>
                        <button className="cancel-button" onClick={() => setIsEditingDepartment(false)}>
                            {getLocalizedString(preferredLang, "Cancel")}
                        </button>
                    </>
                )}
            </div>
            <div className="employees-section">
                <h3>{getLocalizedString(preferredLang, "Employees")}</h3>
                {employees.map(employee => renderEmployeeFields(employee))}
                <button className="add-employee-button" onClick={handleAddEmployee}>
                    {getLocalizedString(preferredLang, "Add Employee")}
                </button>
            </div>

            {editingEmployeeId && (
                <div className="edit-employee-modal">
                    <h3>{getLocalizedString(preferredLang, "Edit Employee")}</h3>
                    <div className="employee-field">
                        <label>{getLocalizedString(preferredLang, "First Name")}</label>
                        <input
                            type="text"
                            name="FirstName"
                            value={editedEmployee.User.FirstName}
                            onChange={handleEmployeeInputChange}
                        />
                    </div>
                    <div className="employee-field">
                        <label>{getLocalizedString(preferredLang, "Second Name")}</label>
                        <input
                            type="text"
                            name="SecondName"
                            value={editedEmployee.User.SecondName}
                            onChange={handleEmployeeInputChange}
                        />
                    </div>
                    <div className="employee-field">
                        <label>{getLocalizedString(preferredLang, "Phone Number")}</label>
                        <input
                            type="text"
                            name="PhoneNumber"
                            value={editedEmployee.User.PhoneNumber}
                            onChange={handleEmployeeInputChange}
                        />
                    </div>
                    <div className="employee-field">
                        <label>{getLocalizedString(preferredLang, "Role")}</label>
                        <input
                            type="text"
                            name="Role"
                            value={editedEmployee.Role}
                            onChange={handleEmployeeInputChange}
                        />
                    </div>
                    <div className="employee-field">
                        <label>{getLocalizedString(preferredLang, "Description")}</label>
                        <input
                            type="text"
                            name="Description"
                            value={editedEmployee.Description}
                            onChange={handleEmployeeInputChange}
                        />
                    </div>
                    <button className="save-button" onClick={handleSaveEmployeeChanges}>
                        {getLocalizedString(preferredLang, "Save")}
                    </button>
                    <button className="cancel-button" onClick={() => setEditingEmployeeId(null)}>
                        {getLocalizedString(preferredLang, "Cancel")}
                    </button>
                </div>
            )}
        </div>
    );
};

export default DepartmentDetailsPage;
