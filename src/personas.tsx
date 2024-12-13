import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AiFillEdit, AiOutlineSearch } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';

const DropdownsComponent: React.FC = () => {
  const [personas, setPersonas] = useState([
    { id: 1, nombre: 'Juan', sexo: 'Masculino', edad: 30, telefono: '123456789', zona: 'Zona 1' },
    { id: 2, nombre: 'Pedro', sexo: 'Masculino', edad: 25, telefono: '987654321', zona: 'Zona 2' },
    { id: 3, nombre: 'Ana', sexo: 'Femenino', edad: 22, telefono: '555666777', zona: 'Zona 1' },
    { id: 4, nombre: 'María', sexo: 'Femenino', edad: 35, telefono: '444555666', zona: 'Zona 3' },
  ]);
  const [filters, setFilters] = useState({
    nombre: '',
    sexo: '',
    edad: '',
    telefono: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPersona, setNewPersona] = useState({
    nombre: '',
    sexo: '',
    edad: '',
    telefono: '',
    zona: '',
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => {
    setNewPersona({ nombre: '', sexo: '', edad: '', telefono: '', zona: '' });
    setIsModalOpen(false);
  };

  const handlePersonaAdd = () => {
    setPersonas([
      ...personas,
      {
        id: personas.length + 1,
        ...newPersona,
        edad: parseInt(newPersona.edad), // Asegurar que la edad sea numérica
      },
    ]);
    handleModalClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewPersona({ ...newPersona, [name]: value });
  };

  const filteredPersonas = personas.filter((persona) =>
    Object.entries(filters).every(([key, value]) =>
      value === '' ? true : String(persona[key as keyof typeof persona]).toLowerCase().includes(value.toLowerCase())
    )
  );

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Gestión de Personas</h3>
        <button className="btn btn-success" onClick={handleModalOpen}>
          Agregar Persona
        </button>
      </div>

      <div className="row mb-4">
        <div className="col-md-3">
          <input
            type="text"
            name="nombre"
            placeholder="Filtrar por nombre"
            className="form-control"
            value={filters.nombre}
            onChange={handleFilterChange}
          />
        </div>
        <div className="col-md-3">
          <select
            name="sexo"
            className="form-select"
            value={filters.sexo}
            onChange={handleFilterChange}
          >
            <option value="">Filtrar por sexo</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
          </select>
        </div>
        <div className="col-md-3">
          <input
            type="number"
            name="edad"
            placeholder="Filtrar por edad"
            className="form-control"
            value={filters.edad}
            onChange={handleFilterChange}
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            name="telefono"
            placeholder="Filtrar por teléfono"
            className="form-control"
            value={filters.telefono}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      <PersonTable personas={filteredPersonas} />

      {isModalOpen && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Agregar Nueva Persona</h5>
                <button type="button" className="btn-close" onClick={handleModalClose}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nombre"
                    value={newPersona.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Sexo</label>
                  <select
                    className="form-select"
                    name="sexo"
                    value={newPersona.sexo}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecciona</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Edad</label>
                  <input
                    type="number"
                    className="form-control"
                    name="edad"
                    value={newPersona.edad}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Teléfono</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="telefono"
                    value={newPersona.telefono}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Zona</label>
                  <input
                    type="text"
                    className="form-control"
                    name="zona"
                    value={newPersona.zona}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={handleModalClose}>
                  Cancelar
                </button>
                <button className="btn btn-primary" onClick={handlePersonaAdd}>
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PersonTable: React.FC<{ personas: any[] }> = ({ personas }) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Sexo</th>
          <th>Edad</th>
          <th>Teléfono</th>
          <th>Zona</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {personas.map((persona) => (
          <tr key={persona.id}>
            <td>{persona.nombre}</td>
            <td>{persona.sexo}</td>
            <td>{persona.edad}</td>
            <td>{persona.telefono}</td>
            <td>{persona.zona}</td>
            <td>
              <button className="btn btn-primary btn-sm mx-1">
                <AiFillEdit />
              </button>
              <button className="btn btn-danger btn-sm mx-1">
                <MdDelete />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DropdownsComponent;
