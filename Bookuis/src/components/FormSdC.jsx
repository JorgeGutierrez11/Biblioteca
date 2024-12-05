import { useState } from "react";
import '../styles/FormSdC.css'; // Ruta para el archivo de estilos

function FormSdC() {
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        editor: "",
        isbn: "",
        additionalInfo: ""
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Formulario enviado:", formData);
        setSubmitted(true);

        // Limpiar formulario después de enviar
        setFormData({
            title: "",
            author: "",
            editor: "",
            isbn: "",
            additionalInfo: ""
        });
    };

    return (
        <div className="form-sdc-container">
            <div className="form-sdc-wrapper">
                {/* Títulos */}
                <div className="form-sdc-header">
                    <h1>Enviar Solicitud de Compra</h1>
                    <p>Ayúdanos a construir nuestra colección</p>
                </div>
                {/* Formulario */}
                <form onSubmit={handleSubmit} className="form-sdc">
                    <div className="form-sdc-left">
                        <div className="form-group">
                            <label htmlFor="title">Título del libro:</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Título del libro"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="author">Autor:</label>
                            <input
                                type="text"
                                id="author"
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                                placeholder="Nombre del autor"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="editor">Editor:</label>
                            <input
                                type="text"
                                id="editor"
                                name="editor"
                                value={formData.editor}
                                onChange={handleChange}
                                placeholder="Nombre del editor"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="isbn">ISBN:</label>
                            <input
                                type="text"
                                id="isbn"
                                name="isbn"
                                value={formData.isbn}
                                onChange={handleChange}
                                placeholder="El ISBN del libro"
                                required
                            />
                        </div>
                    </div>
                    <div className="form-sdc-right">
                        <label htmlFor="additionalInfo">Información Adicional:</label>
                        <textarea
                            id="additionalInfo"
                            name="additionalInfo"
                            value={formData.additionalInfo}
                            onChange={handleChange}
                            placeholder="Cualquier información adicional que desee facilitar"
                            rows="6"
                        />
                    </div>
                </form>
                {/* Botón de envío fuera de .form-sdc-left y .form-sdc-right */}
                <button type="submit" className="submit-button">Enviar</button>
                {submitted && <p className="success-message">¡Formulario enviado con éxito!</p>}
            </div>
        </div>
    );
}

export default FormSdC;
