import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AiFillEdit } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';

// TypeScript Type Definitions
type Persona = {
  id: number;
  nombre: string;
  sexo: string;
  edad: number;
  telefono: string;
  zona: string;
};

const Personas: React.FC = () => {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [filters, setFilters] = useState({
    nombre: '',
    sexo: '',
    edad: '',
    telefono: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newPersona, setNewPersona] = useState<Partial<Omit<Persona, 'id'>>>({
    nombre: '',
    sexo: '',
    edad: 0,
    telefono: '',
    zona: '',
  });
  const [editingPersona, setEditingPersona] = useState<Partial<Persona> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch Personas on component mount
  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:4000/api/people/');
        if (!response.ok) throw new Error('Error fetching personas');
        const data: Persona[] = await response.json();
        setPersonas(data);
      } catch (err: any) {
        setError(err.message || 'Error fetching personas');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPersonas();
  }, []);

  // Handle filters
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Handle modal open/close
  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => {
    setNewPersona({ nombre: '', sexo: '', edad: 0, telefono: '', zona: '' });
    setIsModalOpen(false);
  };

  // Handle edit modal open/close
  const handleEditModalOpen = (persona: Persona) => {
    setEditingPersona(persona);
    setIsEditModalOpen(true);
  };
  const handleEditModalClose = () => {
    setEditingPersona(null);
    setIsEditModalOpen(false);
  };

  // Add a new persona
  const handlePersonaAdd = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:4000/api/people/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPersona),
      });
      if (!response.ok) throw new Error('Error adding persona');
      const addedPersona: Persona = await response.json();
      setPersonas([...personas, addedPersona]);
      handleModalClose();
    } catch (err: any) {
      setError(err.message || 'Error adding persona');
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing persona
  const handlePersonaUpdate = async () => {
    if (!editingPersona || !editingPersona.id) return;

    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:4000/api/people/${editingPersona.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPersona),
      });
      if (!response.ok) throw new Error('Error updating persona');
      const updatedPersona: Persona = await response.json();

      // Update the state
      setPersonas(personas.map((p) => (p.id === updatedPersona.id ? updatedPersona : p)));
      handleEditModalClose();
    } catch (err: any) {
      setError(err.message || 'Error updating persona');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a persona
  const handlePersonaDelete = async (id: number) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:4000/api/people/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error deleting persona');
      setPersonas(personas.filter((persona) => persona.id !== id));
    } catch (err: any) {
      setError(err.message || 'Error deleting persona');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter personas based on user input
  const filteredPersonas = personas.filter((persona) =>
    Object.entries(filters).every(([key, value]) =>
      value === '' ? true : String(persona[key as keyof Persona]).toLowerCase().includes(value.toLowerCase())
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

      {isLoading && <p>Loading...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Filters */}
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

      {/* Personas Table */}
      <PersonTable personas={filteredPersonas} onDelete={handlePersonaDelete} onEdit={handleEditModalOpen} />

      {/* Add Persona Modal */}
      {isModalOpen && (
        <Modal
          title="Agregar Nueva Persona"
          persona={newPersona}
          setPersona={setNewPersona}
          onClose={handleModalClose}
          onSave={handlePersonaAdd}
        />
      )}

      {/* Edit Persona Modal */}
      {isEditModalOpen && editingPersona && (
        <Modal
          title="Editar Persona"
          persona={editingPersona}
          setPersona={setEditingPersona}
          onClose={handleEditModalClose}
          onSave={handlePersonaUpdate}
        />
      )}
    </div>
  );
};

const PersonTable: React.FC<{
  personas: Persona[];
  onDelete: (id: number) => void;
  onEdit: (persona: Persona) => void;
}> = ({ personas, onDelete, onEdit }) => (
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
            <button className="btn btn-primary btn-sm mx-1" onClick={() => onEdit(persona)}>
              <AiFillEdit />
            </button>
            <button className="btn btn-danger btn-sm mx-1" onClick={() => onDelete(persona.id)}>
              <MdDelete />
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const Modal: React.FC<{
  title: string;
  persona: Partial<Omit<Persona, 'id'>>;
  setPersona: React.Dispatch<React.SetStateAction<Partial<Omit<Persona, 'id'>>>>;
  onClose: () => void;
  onSave: () => void;
}> = ({ title, persona, setPersona, onClose, onSave }) => (
  <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">{title}</h5>
          <button type="button" className="btn-close" onClick={onClose}></button>
        </div>
        <div className="modal-body">
          {Object.keys(persona).map((key) =>
            key !== 'id' ? (
              <div className="mb-3" key={key}>
                <label className="form-label">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                {key === 'sexo' ? (
                  <select
                    className="form-select"
                    value={persona[key as keyof Persona] as string}
                    onChange={(e) =>
                      setPersona((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                  >
                    <option value="">Selecciona</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                  </select>
                ) : (
                  <input
                    type={key === 'edad' ? 'number' : 'text'}
                    className="form-control"
                    value={persona[key as keyof Persona] as string}
                    onChange={(e) =>
                      setPersona((prev) => ({
                        ...prev,
                        [key]: key === 'edad' ? Number(e.target.value) : e.target.value,
                      }))
                    }
                  />
                )}
              </div>
            ) : null
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={onSave}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default Personas;
