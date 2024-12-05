import '../styles/Card.css';

function Card({ imageUrl, title, author, children }) {
    return (
        <div className="card">
            <img src={imageUrl} alt={title} className="card-image" />
            <div className="card-content">
                <h2 className="card-title">{title}</h2>
                <p className="card-author"><b>Autor: <br/></b> {author}</p>
                {children && <div className="card-extra">{children}</div>}
            </div>
        </div>
    );
}

export default Card;
