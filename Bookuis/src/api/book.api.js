import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/book/api/'
});

// Usuarios
export const getAllUsuarios = () => api.get('/usuarios/');
export const getUsuario = (id) => api.get(`/usuarios/${id}/`);
export const createUsuario = (usuario) => api.post('/usuarios/', usuario);
export const deleteUsuario = (id) => api.delete(`/usuarios/${id}/`);
export const updateUsuario = (id, usuario) => api.put(`/usuarios/${id}/`, usuario);

// Libros
export const getAllLibros = () => api.get('/libros/');
export const getLibro = (id) => api.get(`/libros/${id}/`);
export const createLibro = (libro) => api.post('/libros/', libro);
export const deleteLibro = (id) => api.delete(`/libros/${id}/`);
export const updateLibro = (id, libro) => api.put(`/libros/${id}/`, libro);

// Reservas
export const getAllReservas = () => api.get('/reservas/');
export const getReserva = (id) => api.get(`/reservas/${id}/`);
export const createReserva = (reserva) => api.post('/reservas/', reserva);
export const deleteReserva = (id) => api.delete(`/reservas/${id}/`);
export const updateReserva = (id, reserva) => api.put(`/reservas/${id}/`, reserva);

// Préstamos
export const getAllPrestamos = () => api.get('/prestamos/');
export const getPrestamo = (id) => api.get(`/prestamos/${id}/`);
export const createPrestamo = (prestamo) => api.post('/prestamos/', prestamo);
export const deletePrestamo = (id) => api.delete(`/prestamos/${id}/`);
export const updatePrestamo = (id, prestamo) => api.put(`/prestamos/${id}/`, prestamo);

// Multas
export const getAllMultas = () => api.get('/multas/');
export const getMulta = (id) => api.get(`/multas/${id}/`);
export const createMulta = (multa) => api.post('/multas/', multa);
export const deleteMulta = (id) => api.delete(`/multas/${id}/`);
export const updateMulta = (id, multa) => api.put(`/multas/${id}/`, multa);

// Notificaciones
export const getAllNotificaciones = () => api.get('/notificaciones/');
export const getNotificacion = (id) => api.get(`/notificaciones/${id}/`);
export const createNotificacion = (notificacion) => api.post('/notificaciones/', notificacion);
export const deleteNotificacion = (id) => api.delete(`/notificaciones/${id}/`);
export const updateNotificacion = (id, notificacion) => api.put(`/notificaciones/${id}/`, notificacion);
