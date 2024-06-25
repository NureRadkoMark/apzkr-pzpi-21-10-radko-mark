import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLocalizedString } from '../locale/lang';
import '../styles/CompanyManagement.css';

const CompanyManagementPage = () => {
    let preferredLang = localStorage.getItem('language');
    const [companyDetails, setCompanyDetails] = useState({ Name: '', Description: '' });
    const [departments, setDepartments] = useState([]);
    const [isEditingCompany, setIsEditingCompany] = useState(false);
    const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const selectedCompanyId = localStorage.getItem('selectedCompanyId');

    useEffect(() => {
        fetchCompanyDetails();
        fetchDepartments();
    }, []);

    const fetchCompanyDetails = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/company/details', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ CompanyId: selectedCompanyId, Lang: preferredLang })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch company details');
            }

            const data = await response.json();
            setCompanyDetails(data);
        } catch (error) {
            console.error('Error fetching company details:', error);
            setErrorMessage(error.message || 'Failed to fetch company details');
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/department/company', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
                },
                body: JSON.stringify({ CompanyId: selectedCompanyId, Lang: preferredLang })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch departments');
            }

            const data = await response.json();
            setDepartments(data);
        } catch (error) {
            console.error('Error fetching departments:', error);
            setErrorMessage(error.message || 'Failed to fetch departments');
        }
    };

    const handleCompanyInputChange = (e) => {
        setCompanyDetails({
            ...companyDetails,
            [e.target.name]: e.target.value
        });
    };

    const ManageDepartmentClick = () => {
        if (selectedDepartmentId) {
            window.location.href = `/book-appointment`;
        }
    };

    const handleSaveCompanyChanges = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/company', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
                },
                body: JSON.stringify(companyDetails)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update company details');
            }

            setSuccessMessage('Company data updated successfully');
            setIsEditingCompany(false);
        } catch (error) {
            console.error('Error updating company details:', error);
            setErrorMessage(error.message || 'Failed to update company details');
        }
    };

    const handleDeleteDepartment = async (departmentId) => {
        const confirmDelete = window.confirm(getLocalizedString(preferredLang, "Are you sure you want to delete this department?"));
        if (!confirmDelete) return;

        try {
            const response = await fetch('http://localhost:5000/api/department', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
                },
                body: JSON.stringify({ DepartmentId: departmentId, Lang: preferredLang })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete department');
            }

            setDepartments(departments.filter(department => department.DepartmentId !== departmentId));
            setSuccessMessage('Department deleted successfully');
        } catch (error) {
            console.error('Error deleting department:', error);
            setErrorMessage(error.message || 'Failed to delete department');
        }
    };

    const handleDeleteCompany = async () => {
        const confirmDelete = window.confirm(getLocalizedString(preferredLang, "Are you sure you want to delete this company?"));
        if (!confirmDelete) return;

        try {
            const response = await fetch('http://localhost:5000/api/company', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
                },
                body: JSON.stringify({ CompanyId: companyDetails.CompanyId, Lang: preferredLang })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete company');
            }

            navigate('/'); // Redirect to homepage after deletion
        } catch (error) {
            console.error('Error deleting company:', error);
            setErrorMessage(error.message || 'Failed to delete company');
        }
    };

    const handleDepartmentClick = (departmentId) => {
        setSelectedDepartmentId(departmentId);
        localStorage.setItem('DepartmentId', departmentId)
    };

    const renderCompanyFields = () => (
        <>
            <div className="company-field">
                <label>{getLocalizedString(preferredLang, "Name")}</label>
                <input
                    type="text"
                    name="Name"
                    value={companyDetails.Name}
                    onChange={handleCompanyInputChange}
                    disabled={!isEditingCompany}
                />
            </div>
            <div className="company-field">
                <label>{getLocalizedString(preferredLang, "Description")}</label>
                <input
                    type="text"
                    name="Description"
                    value={companyDetails.Description}
                    onChange={handleCompanyInputChange}
                    disabled={!isEditingCompany}
                />
            </div>
        </>
    );

    const renderDepartmentFields = (department, index) => (
        <div
            key={department.DepartmentId}
            className={`department-card ${selectedDepartmentId === department.DepartmentId ? 'selected' : ''}`}
            onClick={() => handleDepartmentClick(department.DepartmentId)}
        >
            <div className="department-field">
                <label>{getLocalizedString(preferredLang, "Name")}</label>
                <p>{department.Name}</p>
            </div>
            <div className="department-field">
                <label>{getLocalizedString(preferredLang, "Address")}</label>
                <p>{department.Address}</p>
            </div>
            <div className="department-field">
                <label>{getLocalizedString(preferredLang, "StartWorkingTime")}</label>
                <p>{department.StartWorkingTime}</p>
            </div>
            <div className="department-field">
                <label>{getLocalizedString(preferredLang, "EndWorkingTime")}</label>
                <p>{department.EndWorkingTime}</p>
            </div>
            <div className="department-field">
                <label>{getLocalizedString(preferredLang, "PhoneNumber")}</label>
                <p>{department.PhoneNumber}</p>
            </div>
            <div className="department-field">
                <label>{getLocalizedString(preferredLang, "Info")}</label>
                <p>{department.Info}</p>
            </div>
            {selectedDepartmentId === department.DepartmentId && (
                <>
                    <button className="manage-button" onClick={() => navigate('/department-manage')}>
                        {getLocalizedString(preferredLang, "Manage")}
                    </button>
                    <button className="delete-button" onClick={() => handleDeleteDepartment(department.DepartmentId)}>
                        {getLocalizedString(preferredLang, "Delete")}
                    </button>
                </>
            )}
        </div>
    );

    return (
        <div className="company-management-page">
            <h2>{getLocalizedString(preferredLang, "Company Management")}</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
            <div className="company-section">
                <h3>{getLocalizedString(preferredLang, "Company Details")}</h3>
                {renderCompanyFields()}
                {!isEditingCompany && (
                    <button className="edit-button" onClick={() => setIsEditingCompany(true)}>
                        {getLocalizedString(preferredLang, "Edit")}
                    </button>
                )}
                {isEditingCompany && (
                    <>
                        <button className="save-button" onClick={handleSaveCompanyChanges}>
                            {getLocalizedString(preferredLang, "Save")}
                        </button>
                        <button className="cancel-button" onClick={() => setIsEditingCompany(false)}>
                            {getLocalizedString(preferredLang, "Cancel")}
                        </button>
                    </>
                )}
                <button className="delete-button" onClick={handleDeleteCompany}>
                    {getLocalizedString(preferredLang, "Delete Company")}
                </button>
            </div>
            <div className="departments-section">
                <h3>{getLocalizedString(preferredLang, "Departments")}</h3>
                {departments.map((department, index) => renderDepartmentFields(department, index))}
                <button className="add-department-button" onClick={() => navigate('/add-department')}>
                    {getLocalizedString(preferredLang, "Add Department")}
                </button>
            </div>
        </div>
    );
};

export default CompanyManagementPage;

