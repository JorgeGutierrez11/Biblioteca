import React, { useState, useEffect } from 'react';
import { getAllLibros, createReserva, getAllReservas, getAllPrestamos } from '../api/book.api';
import Card from "./Card";
import { SearchIcon } from "../icons";
import { useAuth } from '../contexts/AuthContext';
import "../styles/Reservations.css";

function Reservations() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [books, setBooks] = useState([]);
    const [reservas, setReservas] = useState([]);
    const [prestamos, setPrestamos] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); 
    const { user } = useAuth();

    const tabs = ["Libros", "Reservaciones", "Mis libros"];

    useEffect(() => {
        async function loadBooks() {
            try {
                const res = await getAllLibros();
                setBooks(res.data);
            } catch (error) {
                console.error('Error al cargar los libros:', error);
            }
        }
        loadBooks();
    }, []);

    useEffect(() => {
        async function loadReservas() {
            if (!user || !user.id) {
                setReservas([]);
                return;
            }
            try {
                const allReservas = await getAllReservas();
                const userReservas = allReservas.data.filter((reserva) => reserva.usuario === user.id);
                setReservas(userReservas);
            } catch (error) {
                console.error('Error al cargar las reservas:', error);
            }
        }
        loadReservas();
    }, [user, activeIndex]);

    useEffect(() => {
        async function loadPrestamos() {
            if (!user || !user.id) {
                setPrestamos([]);
                return;
            }
            try {
                const allPrestamos = await getAllPrestamos();
                const userPrestamos = allPrestamos.data.filter((prestamo) => prestamo.reserva.usuario === user.id);
                setPrestamos(userPrestamos);
            } catch (error) {
                console.error('Error al cargar los préstamos:', error);
            }
        }
        loadPrestamos();
    }, [activeIndex]);

    const handleReserva = async (bookId) => {
        if (!user || !user.id) {
            alert("Por favor, inicie sesión.");
            return;
        }
        try {
            const reserva = { usuario: user.id, libro_id: bookId };
            const response = await createReserva(reserva);
            alert('Reserva creada exitosamente!');
            closeBookDetails();
        } catch (error) {
            console.error('Error al crear la reserva:', error);
            alert('Hubo un problema al realizar la reserva.');
        }
    };

    const handleTabClick = (index) => {
        setActiveIndex(index);
        setSearchTerm('');
    };

    const handleBookClick = (book) => {
        setSelectedBook(book);
    };

    const closeBookDetails = () => {
        setSelectedBook(null);
    };

    const filteredBooks = books.filter((book) =>
        book.titulo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const filteredReservas = reservas.filter((reserva) =>
        reserva.libro?.titulo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const filteredPrestamos = prestamos.filter((prestamo) =>
        prestamo.reserva.libro?.titulo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="tab-bg">
            <div className="tab-container">
                <ul className="tab-ul">
                    {tabs.map((tab, index) => (
                        <li
                            key={index}
                            className={`tab-li ${activeIndex === index ? 'visible' : ''}`}
                            onClick={() => handleTabClick(index)}
                        >
                            {tab}
                        </li>
                    ))}
                </ul>
                <div className="tab-input">
                    <button className="tab-boton-search"><SearchIcon /></button>
                    <input
                        type="text"
                        placeholder={`Buscar en ${tabs[activeIndex]}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="books-container">
                    {activeIndex === 0 && filteredBooks.map((book, index) => (
                        <div
                            key={index}
                            className="book-card"
                            onClick={() => handleBookClick(book)}
                        >
                            <Card imageUrl={book.portada} title={book.titulo} author={book.autor}>
                                <p className="card-quantity"><b>Disponibles: </b> <span style={{ color: 'red' }}>{book.cantidad_disponible}</span></p>
                            </Card>
                        </div>
                    ))}

                    {activeIndex === 1 && (
                        <div className="reservas-container">
                            {filteredReservas.length === 0 ? (
                                <p>No tienes reservas activas.</p>
                            ) : (
                                filteredReservas.map((reserva) => (
                                    <div key={reserva.id} className="book-card">
                                        <Card
                                            imageUrl={reserva.libro?.portada}
                                            title={reserva.libro?.titulo}
                                            author={reserva.libro?.autor}
                                        >
                                            <p><strong>Estado reserva:</strong> {reserva.estado_reserva}</p>
                                            <p><strong>Fecha reserva:</strong> {new Date(reserva.fecha_reserva).toLocaleDateString()}</p>
                                        </Card>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeIndex === 2 && (
                        <div className="pretamos-container">
                            {filteredPrestamos.length === 0 ? (
                                <p>No tienes préstamos activos.</p>
                            ) : (
                                filteredPrestamos.map((prestamo) => (
                                    <div key={prestamo.id} className="book-card">
                                        <Card
                                            imageUrl={prestamo.reserva.libro?.portada}
                                            title={prestamo.reserva.libro?.titulo}
                                            author={prestamo.reserva.libro?.autor}
                                        >
                                            <p><strong>Fecha Entrega:</strong> {new Date(prestamo.fecha_entrega).toLocaleDateString()}</p>
                                            <p>
                                                <strong>Fecha Devolución:</strong><br />
                                                {
                                                    prestamo.fecha_devolucion
                                                    ? new Date(prestamo.fecha_devolucion).toLocaleDateString()
                                                    : 'Pendiente'
                                                }
                                            </p>
                                        </Card>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {selectedBook && (
                    <div className="book-details-modal">
                        <div className="modal-content">
                            <div className='modal-content-1'>
                                <button className="close-button" onClick={closeBookDetails}>X</button>
                                <h2 style={{ color: '#66B53D' }}>{selectedBook.titulo}</h2>
                                <p><b>Autor: </b>{selectedBook.autor}</p>
                                <p><b>Disponibles: </b><span style={{ color: 'red' }}>{selectedBook.cantidad_disponible}</span></p>
                                <button className="reserve-button" onClick={() => handleReserva(selectedBook.id)}>Reservar</button>
                            </div>
                            <div className='modal-content-2'>
                                <img src={selectedBook.portada} alt={selectedBook.titulo} className="card-image" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Reservations;
