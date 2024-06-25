const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('User', {
    UserId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    FirstName: { type: DataTypes.STRING, allowNull: false },
    SecondName: { type: DataTypes.STRING, allowNull: false },
    PhoneNumber: { type: DataTypes.STRING, allowNull: false },
    BirthDay: { type: DataTypes.DATE },
    PassportCode: { type: DataTypes.STRING, allowNull: false },
    Email: { type: DataTypes.STRING, allowNull: false },
    Password: { type: DataTypes.STRING, allowNull: false },
    IsBanned: {type: DataTypes.BOOLEAN, defaultValue: false},
    IOTCode: {type: DataTypes.STRING(7), allowNull: false, unique: true}
});

const Company = sequelize.define('Company', {
    CompanyId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    Name: { type: DataTypes.STRING, allowNull: false },
    Description: { type: DataTypes.STRING, allowNull: false }
});

const Department = sequelize.define('Department', {
    DepartmentId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    Address: { type: DataTypes.STRING, allowNull: false },
    StartWorkingTime: { type: DataTypes.TIME, allowNull: false },
    EndWorkingTime: { type: DataTypes.TIME, allowNull: false },
    Name: { type: DataTypes.STRING, allowNull: false },
    Info: { type: DataTypes.STRING },
    PhoneNumber: { type: DataTypes.STRING, allowNull: false }
});

const Pet = sequelize.define('Pet', {
    PetId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    Breed: { type: DataTypes.STRING, allowNull: false },
    AnimalType: { type: DataTypes.STRING, allowNull: false },
    Name: { type: DataTypes.STRING },
    DocCode: { type: DataTypes.STRING , allowNull: false},
    DateBirth: { type: DataTypes.DATE, allowNull: false }
});

const Appointment = sequelize.define('Appointment', {
    AppointmentId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    DateAndTime: { type: DataTypes.DATE, allowNull: false }
});

const Prescription = sequelize.define('Prescription', {
    PrescriptionId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    Body: { type: DataTypes.STRING, allowNull: false }
});

const EmployeeWorkHours = sequelize.define('EmployeeWorkHours', {
    EmployeeWorkHoursId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    WorkDate: { type: DataTypes.DATE, allowNull: false },
    StartTime: { type: DataTypes.TIME, allowNull: false },
    EndTime: { type: DataTypes.TIME, allowNull: true }
});

const Subscription = sequelize.define('Subscription', {
    SubscriptionId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ValidUntil: { type: DataTypes.DATE, allowNull: false },
    IsValid: { type: DataTypes.BOOLEAN, allowNull: false }
});

const UserRole = sequelize.define('UserRole', {
    UserRoleId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const Employee = sequelize.define('Employee', {
    EmployeeId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    Role: { type: DataTypes.STRING, allowNull: false },
    Description: { type: DataTypes.STRING }
});

const Role = sequelize.define('Role', {
    RoleId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    RoleName: { type: DataTypes.STRING, allowNull: false },
    RoleDescription: { type: DataTypes.STRING, allowNull: false }
});

const Check = sequelize.define('Check', {
   CheckId: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
});

const Service = sequelize.define('Service', {
   ServiceId: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
   Name: {type: DataTypes.STRING, allowNull: false},
   Info: {type: DataTypes.STRING, allowNull: false},
   Price: {type: DataTypes.DECIMAL(10, 2), allowNull: false}
});

const ServiceInCheck = sequelize.define('ServiceInCheck', {
   ServiceInCheckId: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
   Count:  {type: DataTypes.INTEGER, allowNull: true, defaultValue: 1}
});

Service.belongsToMany(Check, {through: ServiceInCheck})
Check.belongsToMany(Service, {through: ServiceInCheck})

Role.belongsToMany(User, {through: UserRole})
User.belongsToMany(Role, {through: UserRole})

Employee.hasMany(Appointment)
Appointment.belongsTo(Employee)

User.hasOne(Check)
Check.belongsTo(User)

Department.hasMany(Service)
Service.belongsTo(Department)

Employee.hasMany(Prescription)
Prescription.belongsTo(Employee)

User.hasOne(Company)
Company.belongsTo(User)

User.hasOne(Employee)
Employee.belongsTo(User)

Company.hasMany(Department)
Department.belongsTo(Company)

Department.hasMany(Employee)
Employee.belongsTo(Department)

Pet.hasMany(Appointment)
Appointment.belongsTo(Pet)

Pet.hasMany(Prescription)
Prescription.belongsTo(Pet)

User.hasMany(Pet)
Pet.belongsTo(User)

Employee.hasMany(EmployeeWorkHours)
EmployeeWorkHours.belongsTo(Employee)

User.hasOne(Subscription)
Subscription.belongsTo(User)

module.exports = {
    User,
    Company,
    Department,
    Pet,
    Appointment,
    Prescription,
    EmployeeWorkHours,
    Subscription,
    UserRole,
    Employee,
    Role,
    ServiceInCheck,
    Service,
    Check
};