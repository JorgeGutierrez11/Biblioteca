const BASE_URL = 'https://openlibrary.org';

// Función para obtener libros por búsqueda
export const searchBooks = async (query) => {
    try {
        const response = await fetch(`${BASE_URL}/search.json?q=${query}&limit=10`); // Limitar a 10 resultados
        const data = await response.json();
        return data.docs.map(book => ({
            title: book.title,
            author: book.author_name ? book.author_name[0] : 'Autor desconocido',
            cover: book.cover_i
                ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
                : 'URL_DEFAULT_IMAGEN',
        }));
    } catch (error) {
        console.error('Error fetching books:', error);
        return [];
    }
};

// Función para obtener libros por categoría
export const searchBooksByCategory = async (category) => {
    try {
        const response = await fetch(`${BASE_URL}/search.json?subject=${category}&limit=10`);
        const data = await response.json();
        return data.docs.map(book => ({
            title: book.title,
            author: book.author_name ? book.author_name[0] : 'Autor desconocido',
            cover: book.cover_i
                ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
                : 'URL_DEFAULT_IMAGEN',
        }));
    } catch (error) {
        console.error('Error fetching books by category:', error);
        return [];
    }
};
