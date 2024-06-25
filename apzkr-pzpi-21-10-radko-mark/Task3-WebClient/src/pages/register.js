import React, { useState } from 'react';
import { Container, Card, Form, FormControl, Button } from 'react-bootstrap';
import { NotificationManager, NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { getLocalizedString } from '../locale/lang';
import '../styles/register.css';
import {Link} from "react-router-dom";

const Reg = () => {
    let preferredLang = localStorage.getItem('language') || 'ua'; // Установите язык по умолчанию, если не задан
    const [FirstName, setFirstName] = useState('');
    const [SecondName, setSecondName] = useState('');
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [PhoneNumber, setPhoneNumber] = useState('');
    const [BirthDay, setBirthDay] = useState('');
    const [PassportCode, setPassportCode] = useState('');
    const [error, setError] = useState(null);

    const click = async () => {
        try {
            const url = 'http://localhost:5000/api/user/register';
            const data = {
                FirstName: FirstName,
                SecondName: SecondName,
                Email: Email,
                Password: Password,
                PhoneNumber: PhoneNumber,
                BirthDay: BirthDay,
                PassportCode: PassportCode,
                Lang: preferredLang
            };

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const responseData = await response.json();

            if (!response.ok) {
                const errorMessage = responseData.error || 'Server error';
                setError(errorMessage);
                NotificationManager.error(errorMessage);
                return;
            }

            NotificationManager.success('Registration successful');

            setFirstName('');
            setSecondName('');
            setEmail('');
            setPassword('');
            setPhoneNumber('');
            setBirthDay('');
            setPassportCode('');
            window.location.href = '/home';
        } catch (error) {
            setError(error.message);
            NotificationManager.error(error.message);
        }
    };

    return (
        <Container className="container">
            <Card className="card">
                <h2>{getLocalizedString(preferredLang, "Registration")}</h2>
                <Form className="d-flex flex-column">
                    <FormControl
                        className="form-control"
                        placeholder={getLocalizedString(preferredLang, "First Name")}
                        value={FirstName}
                        onChange={e => setFirstName(e.target.value)}
                    />
                    <FormControl
                        className="form-control"
                        placeholder={getLocalizedString(preferredLang, "Second Name")}
                        value={SecondName}
                        onChange={e => setSecondName(e.target.value)}
                    />
                    <FormControl
                        className="form-control"
                        placeholder={getLocalizedString(preferredLang, "Email")}
                        value={Email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <FormControl
                        className="form-control"
                        placeholder={getLocalizedString(preferredLang, "Password")}
                        value={Password}
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                    />
                    <FormControl
                        className="form-control"
                        placeholder={getLocalizedString(preferredLang, "Phone Number")}
                        value={PhoneNumber}
                        onChange={e => setPhoneNumber(e.target.value)}
                    />
                    <FormControl
                        className="form-control"
                        placeholder={getLocalizedString(preferredLang, "Birth Day (YYYY-MM-DD)")}
                        value={BirthDay}
                        onChange={e => setBirthDay(e.target.value)}
                        type="date"
                    />
                    <FormControl
                        className="form-control"
                        placeholder={getLocalizedString(preferredLang, "Passport Code")}
                        value={PassportCode}
                        onChange={e => setPassportCode(e.target.value)}
                    />
                    <Button
                        className="button"
                        onClick={click}
                    >
                        {getLocalizedString(preferredLang, "Register")}
                    </Button>
                    <div className="mt-3">
                        {getLocalizedString(preferredLang, "Already have account?")}{" "}
                        <Link to="/login">
                            {getLocalizedString(preferredLang, "Login here")}
                        </Link>
                    </div>
                    <NotificationContainer />
                </Form>
            </Card>
        </Container>
    );
};

export default Reg;
