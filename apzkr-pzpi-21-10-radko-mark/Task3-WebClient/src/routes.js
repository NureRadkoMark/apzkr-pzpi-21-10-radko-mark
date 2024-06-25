import register from './pages/register'
import login from "./pages/login";
import profile from "./pages/profile";
import createAppointment from "./pages/createAppointment";
import addPet from "./pages/addPet";
import myPets from "./pages/myPets";
import myAppointments from "./pages/myAppointments";
import addCompany from "./pages/addCompany";
import addDepartment from "./pages/addDepartment";
import companyManagement from "./pages/companyManagement";
import manageDepartment from "./pages/manageDepartment";
import addEmployee from "./pages/addEmployee";
import userCheck from "./pages/userCheck";
import userManage from "./pages/userManage";
import backup from "./pages/backup";
import getEmployeeAppointments from "./pages/getEmployeeAppointments";
import serviceManage from "./pages/serviceManage";
import addService from "./pages/addService";
import homePage from "./pages/HomePage";
import workingHours from "./pages/workingHours";

import {REGISTER_ROUTE, LOGIN_ROUTE, PROFILE_ROUTE, CREATE_APPOINTMENT_ROUTE, ADD_PET_ROUTE, MY_PET_ROUTE,
    MY_APPOINTMENTS_ROUTE, ADD_COMPANY_ROUTE, ADD_DEPARTMENT_ROUTE, COMPANY_MANAGE_ROUTE, DEPARTMENT_MANAGE_ROUTE,
    ADD_EMPLOYEE_ROUTE, USER_CHECK_ROUTE, USER_MANAGE_ROUTE, BACKUP_ROUTE, GET_EMPLOYEE_APPOINTMENTS,
SERVICE_MANAGE_ROUTE, ADD_SERVICE_ROUTE, HOME_ROUTE, WORK_HOURS_ROUTE} from "./utils/consts";


export const publicRoutes = [
    {
        path: REGISTER_ROUTE,
        Element: register
    },
    {
        path: LOGIN_ROUTE,
        Element: login
    },
    {
        path: PROFILE_ROUTE,
        Element: profile
    },
    {
        path: CREATE_APPOINTMENT_ROUTE,
        Element: createAppointment
    },
    {
        path: ADD_PET_ROUTE,
        Element: addPet
    },
    {
        path: MY_PET_ROUTE,
        Element: myPets
    },
    {
        path: MY_APPOINTMENTS_ROUTE,
        Element: myAppointments
    },
    {
        path: ADD_COMPANY_ROUTE,
        Element: addCompany
    },
    {
        path: ADD_DEPARTMENT_ROUTE,
        Element: addDepartment
    },
    {
        path: COMPANY_MANAGE_ROUTE,
        Element: companyManagement
    },
    {
        path: DEPARTMENT_MANAGE_ROUTE,
        Element: manageDepartment
    },
    {
        path: ADD_EMPLOYEE_ROUTE,
        Element: addEmployee
    },
    {
        path: USER_CHECK_ROUTE,
        Element: userCheck
    },
    {
        path: USER_MANAGE_ROUTE,
        Element: userManage
    },
    {
        path: BACKUP_ROUTE,
        Element: backup
    },
    {
        path: GET_EMPLOYEE_APPOINTMENTS,
        Element: getEmployeeAppointments
    },
    {
        path: SERVICE_MANAGE_ROUTE,
        Element: serviceManage
    },
    {
        path: ADD_SERVICE_ROUTE,
        Element: addService
    },
    {
        path: HOME_ROUTE,
        Element: homePage
    },
    {
        path: WORK_HOURS_ROUTE,
        Element: workingHours
    }
]