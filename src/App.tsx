 
 
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Importa Bootstrap JS
import './App.css'; // Personalizaciones de estilo adicionales

const NavbarComponent = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary w-100 shadow">
      <a className="navbar-brand ms-3" href="#">
        <strong>MunicipiosApp</strong>
      </a>
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
            <a className="nav-link active" aria-current="page" href="#">
              Personas
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Municipios
            </a>
          </li>
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdownMenuLink"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Más opciones
            </a>
            <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
              <li>
                <a className="dropdown-item" href="#">
                  Acción 1
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Acción 2
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Otra opción
                </a>
              </li>
            </ul>
          </li>
          <li className="nav-item">
            <a className="nav-link disabled" href="#" tabIndex={-1} aria-disabled="true">
              Deshabilitado
            </a>
          </li>
        </ul>
        <form className="d-flex align-items-center me-3">
          <input
            className="form-control me-2 rounded-pill"
            type="search"
            placeholder="Buscar..."
            aria-label="Search"
          />
          <button className="btn btn-light btn-rounded" type="submit">
            Buscar
          </button>
        </form>
      </div>
    </nav>
  );
};

export default NavbarComponent;
