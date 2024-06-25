import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { publicRoutes } from '../routes';

const AppRouter = () => {
    return (
        <Routes>
            {publicRoutes.map(({path, Element}) => (
                <Route key={path} path={path} element={<Element />} />
            ))}
        </Routes>
    );
};

export default AppRouter;