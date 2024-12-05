import { useState, useEffect } from "react";
import {
  HomeIcon,
  CarIcon,
  FinesIcon,
  PaperIcon,
  PqrIcon,
  NotificationIcon,
  ExitIcon,
  HamburgerIcon,
  CloseHamburgerIcon,
} from "../icons.jsx";
import { Link } from "react-router-dom";
import logo from "../assets/imgs/logo.png";
import { useAuth } from "../contexts/AuthContext";
import { getAllNotificaciones } from "../api/book.api.js";
import "../styles/BarNav.css";

function BarNav() {
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [notificaciones, setNotificaciones] = useState([]);
  const { logout, user } = useAuth();

  useEffect(() => {
    async function loadNotificaciones() {
      if (!user || !user.id) {
        setNotificaciones([]);
        return;
      }
      try {
        const allNotificaciones = await getAllNotificaciones();
        const userSetNoticacion = allNotificaciones.data.filter(
          (notificacion) => notificacion.usuario.id === user.id
        );
        setNotificaciones(userSetNoticacion);
      } catch (error) {
        console.error('Error al cargar las Notificaciones:', error);
      }
    }
    loadNotificaciones();
  }, [user, isModalVisible]);

  // console.log(notificaciones);

  const toggleMenu = () => {
    setIsNavVisible(!isNavVisible);
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const logOut = () => {
    logout();
  };

  return (
    <header className="nav_header">
      <nav className="navbar nav_lower">
        <div className="logo">
          <img src={logo} alt="Logo" className="logo-image" />
        </div>
        <ul className="nav-list">
          <li>
            <Link className="navButtons" to="/show">
              <HomeIcon className="icon" />
              <span>Inicio</span>
            </Link>
          </li>
          <li>
            <Link className="navButtons" to="/prestamos">
              <CarIcon className="icon" />
              <span>Préstamos</span>
            </Link>
          </li>
          <li>
            <Link className="navButtons" to="/multas">
              <FinesIcon className="icon" />
              <span>Multas</span>
            </Link>
          </li>
          <li>
            <Link className="navButtons" to="/solicitudes">
              <PaperIcon className="icon" />
              <span>Solicitudes</span>
            </Link>
          </li>
          <li>
            <Link className="navButtons" to="/pqr">
              <PqrIcon className="icon" />
              <span>PQR</span>
            </Link>
          </li>
        </ul>
      </nav>
      <nav className="navbar nav_upper">
        <ul className="nav-list">
          <li>
            <button className="navButtons " onClick={toggleModal}>
              <NotificationIcon className="icon" />
            </button>
          </li>
          <li>
            <Link className="navButtons" to="/login" onClick={() => logOut()}>
              <ExitIcon className="icon" />
              <span>Cerrar sesión</span>
            </Link>
          </li>
        </ul>
      </nav>

      <button className="open-menu" onClick={toggleMenu}>
        <HamburgerIcon />
      </button>
      <nav className={`nav-container-media ${isNavVisible ? "visible" : ""}`}>
        <button className="close-menu" onClick={toggleMenu}>
          <CloseHamburgerIcon />
        </button>
        <ul className="nav-list-phone">
          <li>
            <Link className="navButtons" to="/show">
              Inicio
            </Link>
          </li>
          <li>
            <Link className="navButtons" to="/prestamos">
              Préstamos
            </Link>
          </li>
          <li>
            <Link className="navButtons" to="/multas">
              Multas
            </Link>
          </li>
          <li>
            <Link className="navButtons" to="/solicitudes">
              Solicitudes
            </Link>
          </li>
          <li>
            <Link className="navButtons" to="/pqr">
              PQR
            </Link>
          </li>
          <li>
            <Link className="navButtons" to="/login" onClick={() => logOut()}>
              Salir
            </Link>
          </li>
        </ul>
      </nav>

      {isModalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={toggleModal}>
              X
            </button>
            <div className="modal-notification">
              <h2>Notificaciones</h2>
              {notificaciones.length > 0 ? (
                notificaciones.slice().reverse().map((notificacion) => (
                  <div key={notificacion.id} className="notificacion-item">
                    <p className="text-p">✳️ <p>{notificacion.mensaje}</p></p>
                    <p>
                      <strong>Fecha:</strong> {new Date(notificacion.fecha_envio).toLocaleString()}
                    </p>
                    <hr style={{ border: '0', borderTop: '2px solid #92db64' }} />
                  </div>
                ))
              ) : (
                <p>No tienes notificaciones recientes.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default BarNav;
