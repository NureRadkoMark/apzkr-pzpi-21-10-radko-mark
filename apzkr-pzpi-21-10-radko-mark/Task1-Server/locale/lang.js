const languages = {
    "en":   {
        "Internal Server Error - Unexpected error": "Internal Server Error - Unexpected error",
        "User is not found": "User is not found",
        "Conflict - User already created": "Conflict - User already created",
        "Bad Request - Some required fields are missing": "Bad Request - Some required fields are missing",
        "Internal Server Error - User not created": "Internal Server Error - User not created",
        "Internal Server Error - Token not created": "Internal Server Error - Token not created",
        "Incorrect password": "Incorrect password",
        "Not authorised": "Not authorised",
        "Employee is not found": "Employee is not found",
        "Employee deleted": "Employee deleted",
        "Department is not found": "Department is not found",
        "Company is not found": "Company is not found",
        "Appointment not found": "Appointment not found",
        "Appointment deleted": "Appointment deleted",
        "User role is not found": "User role is not found",
        "Service is not found": "Service is not found",
        "Service deleted": "Service deleted",
        invalidDateFormat: 'Invalid date format. Please use YYYY-MM-DD HH:mm',
        noAvailableAppointment: 'No available appointment',
        internalServerError: 'Internal Server Error - Unexpected error'
    },

    "ua":   {
        "Internal Server Error - Unexpected error": "Внутрішня помилка сервера – неочікувана помилка",
        "User is not found": "Користувач не знайдений",
        "Conflict - User already created": "Конфлікт – Користувач уже створений",
        "Bad Request - Some required fields are missing": "Неправильний запит – відсутні деякі обов’язкові поля",
        "Internal Server Error - User not created": "Внутрішня помилка сервера - Користувач не створений",
        "Internal Server Error - Token not created": "Внутрішня помилка сервера - токен не створено",
        "Incorrect password": "Невірний пароль",
        "Not authorised": "Користувач не авторизований",
        "Employee is not found": "Робітник не знайдений",
        "Employee deleted": "Робітника видалено",
        "Department is not found": "Філіал не знайдено",
        "Company is not found": "Мережу клінік не знайдено",
        "Appointment not found": "Запис до лікаря не знайдено",
        "Appointment deleted": "Запис видалено",
        "User role is not found": "Роль користувача не знайдено",
        "Service is not found": "Послуги не знайдені",
        "Service deleted": "Послугу видалено",
        invalidDateFormat: 'Невірний формат дати. Будь ласка, використовуйте YYYY-MM-DD HH:mm',
        noAvailableAppointment: 'Немає доступних записів',
        internalServerError: 'Внутрішня помилка сервера - Несподівана помилка'
    }
}

function getLocalizedString(language, key) {
    const selectedLanguage = languages[language] || languages.en;
    return selectedLanguage[key] || key;
}

module.exports = {
    getLocalizedString
};