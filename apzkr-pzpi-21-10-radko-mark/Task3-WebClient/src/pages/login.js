import React, { useState } from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { getLocalizedString } from '../locale/lang';
import '../styles/login.css';
import {Link} from "react-router-dom";

const Login = () => {
    let preferredLang = localStorage.getItem('language');
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const click = async () => {
        try {
            const url = 'http://localhost:5000/api/user/login';
            const data = {
                Email: Email,
                Password: Password,
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

            const token = responseData.token;

            const roleResponse = await fetch('http://localhost:5000/api/role/user', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const roleData = await roleResponse.json();

            if (!roleResponse.ok) {
                const roleErrorMessage = roleData.error || 'Server error';
                setError(roleErrorMessage);
                NotificationManager.error(roleErrorMessage);
                return;
            }

            const userRole = roleData.role.RoleName;

            localStorage.setItem('jwtToken', token);
            localStorage.setItem('Role', userRole);

            NotificationManager.success('Login successful');

            setEmail('');
            setPassword('');
            window.location.reload()
            window.location.href = '/home';
        } catch (error) {
            setError(error.message);
            NotificationManager.error(error.message);
        }
    }

    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{ height: window.innerHeight - 110 }}
        >
            <Card style={{ width: 600 }} className="p-5">
                <h2 className="m-auto">{getLocalizedString(preferredLang, "Login")}</h2>
                <Form className="d-flex flex-column">
                    <Form.Control
                        className="mt-3"
                        placeholder={getLocalizedString(preferredLang, "Email")}
                        value={Email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <Form.Control
                        className="mt-3"
                        placeholder={getLocalizedString(preferredLang, "Password")}
                        value={Password}
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                    />
                    <Button
                        className="mt-3 static-button"
                        variant={"outline-success"}
                        onClick={click}
                    >
                        {getLocalizedString(preferredLang, "Sign In")}
                    </Button>
                    <div className="mt-3">
                        {getLocalizedString(preferredLang, "No account?")}{" "}
                        <Link to="/register">
                            {getLocalizedString(preferredLang, "Register here")}
                        </Link>
                    </div>
                    <NotificationContainer />
                </Form>
            </Card>
        </Container>
    );
};

export default Login;
