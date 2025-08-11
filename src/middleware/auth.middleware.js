// src/middleware/auth.middleware.js

// Middleware para proteger rutas según roles
const authorizeRoles = (allowedRoles = []) => {
    return (req, res, next) => {
        const user = req.session.user;

        if (!user) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }

        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({ error: 'Acceso denegado. No tienes permisos suficientes.' });
        }

        next();
    };
};

// Middleware para proteger rutas solo para usuarios logueados
const isAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Debes estar logueado para acceder' });
    }
    next();
};

// Exportar ambos middlewares
module.exports = {
    authorizeRoles,
    isAuthenticated
};