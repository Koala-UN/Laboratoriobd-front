import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Importa Bootstrap JS
import './App.css'; // Personalizaciones de estilo adicionales

const NavbarComponent = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary w-100 shadow">
      <Link className="navbar-brand ms-3" to="/">
        <strong>MunicipiosApp</strong>
      </Link>
      <button
        className="navbar-toggler me-3"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNavDropdown">
        <ul className="navbar-nav me-auto ms-3">
          <li className="nav-item">
            <Link className="nav-link" to="/personas">
              Personas
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/viviendas">
              Viviendas
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/alcalde">
              Alcaldes
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/zonas">
              Zonas
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavbarComponent;
