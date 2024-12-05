import React, { useState, useEffect } from "react";
import { searchBooks, searchBooksByCategory } from "../api/getBooks";
import "../styles/BooksList.css";
import lupaIcon from "../assets/lupa.png";

const BooksList = () => {
  const [query, setQuery] = useState(""); 
  const [category, setCategory] = useState(""); 
  const [books, setBooks] = useState([]); 
  const [loading, setLoading] = useState(false); 

  // Función para cargar libros por defecto
  const loadDefaultBooks = async () => {
    setLoading(true);
    try {
      const defaultBooks = await searchBooksByCategory("Calculo"); 
      setBooks(defaultBooks);
    } catch (error) {
      console.error("Error al cargar los libros por defecto:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDefaultBooks();
  }, []);

  const handleSearch = async () => {
    if (query.trim()) {
      setLoading(true);
      try {
        const booksResult = await searchBooks(query);
        setBooks(booksResult);
      } catch (error) {
        console.error("Error al buscar libros:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setBooks([]); 
    }
  };

  const handleCategoryChange = async (event) => {
    setCategory(event.target.value);
    setLoading(true);
    try {
      if (!query.trim()) {
        const booksResult = await searchBooksByCategory(event.target.value);
        setBooks(booksResult);
      } else {
        const booksByText = await searchBooks(query);
        const booksByCategory = await searchBooksByCategory(event.target.value);
        setBooks([...booksByText, ...booksByCategory]); // Combinamos los resultados
      }
    } catch (error) {
      console.error("Error al buscar libros por categoría:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = (bookTitle) => {
    const bookURL = `https://openlibrary.org/search?q=${bookTitle}&mode=everything&document_type=work`;
    window.open(bookURL, "_blank");
  };

  return (
    <div className="books-list">
      <div className="search-container">
        <h1>Bienvenidos a la Biblioteca Virtual</h1>
        <h2>BookUIS</h2>
        <div className="search-bar">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ingrese el título del libro"
          />
          <button onClick={handleSearch}>
            <img src={lupaIcon} alt="Buscar" className="search-icon" />
          </button>
        </div>
      </div>

      {/* Filtro por categoría */}
      <div className="category-filter">
        <label htmlFor="category">Filtrar por categoría:</label>
        <select
          id="category"
          value={category}
          onChange={handleCategoryChange}
        >
          <option value="">Selecciona una categoría</option>
          <option value="Fiction">Ficción</option>
          <option value="Science">Ciencia</option>
          <option value="History">Historia</option>
          <option value="Technology">Tecnología</option>
          <option value="Biography">Biografía</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Cargando...</div>
      ) : (
        <div className="books-container">
          {books.map((book, index) => (
            <div
              className="book-card"
              key={index}
              onClick={() => handleBookClick(book.title)}
            >
              <img src={book.cover} alt={book.title} />
              <h3>{book.title}</h3>
              <p>{book.author}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BooksList;
