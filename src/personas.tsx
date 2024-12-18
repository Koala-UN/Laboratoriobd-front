import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AiFillEdit } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';

type Persona = {
  id: number;
  nombre: string;
  sexo: string;
  edad: number;
  telefono: string;
  responsable_id?: number;
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
    responsable_id: undefined,
  });
  const [editingPersona, setEditingPersona] = useState<Partial<Persona> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);



  
  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://laboratoriobd.onrender.com/api/people/');
        if (!response.ok) throw new Error('Error fetching personas');
        const data: Persona[] = await response.json();
        setPersonas(data);
      } catch (err) {
        const error = err as Error;
        setError(error.message || 'Error fetching personas');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPersonas();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => {
    setNewPersona({ nombre: '', sexo: '', edad: 0, telefono: '', responsable_id: undefined });
    setIsModalOpen(false);
  };

  const handleEditModalOpen = (persona: Persona) => {
    setEditingPersona(persona);
    setIsEditModalOpen(true);
  };
  const handleEditModalClose = () => {
    setEditingPersona(null);
    setIsEditModalOpen(false);
  };
  const handlePersonaAdd = async () => {
    try {
      console.log("Adding persona:", newPersona);
      setIsLoading(true);
      const payload = { ...newPersona };

      const response = await fetch('https://laboratoriobd.onrender.com/api/people/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      console.log("Response status:", response.status);

      if (!response.ok) throw new Error('Error adding persona');
      const data = await response.json();
      console.log("Persona added successfully:", data);
      if (isModalOpen) setIsModalOpen(false);
      window.location.reload();
    } catch (err) {
      const error = err as Error;
      console.error("Error adding persona:", error.message);
      setError(error.message || 'Error adding persona');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePersonaUpdate = async () => {
    if (!editingPersona || !editingPersona.id) return;

    try {
      console.log("Updating persona:", editingPersona);
      setIsLoading(true);
      const payload = {
        nombre: editingPersona.nombre,
        sexo: editingPersona.sexo,
        edad: editingPersona.edad,
        telefono: editingPersona.telefono,
        responsable_id: editingPersona.responsable_id || null,
      };

      const response = await fetch(`https://laboratoriobd.onrender.com/api/people/${editingPersona.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      console.log("Response status:", response.status);

      if (!response.ok) throw new Error('Error updating persona');
      const data = await response.json();
      console.log("Persona updated successfully:", data);
      if (isEditModalOpen) setIsEditModalOpen(false);
      window.location.reload();
    } catch (err) {
      const error = err as Error;
      console.error("Error updating persona:", error.message);
      setError(error.message || 'Error updating persona');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePersonaDelete = async (id: number) => {
    try {
      console.log("Deleting persona with ID:", id);
      setIsLoading(true);
      const response = await fetch(`https://laboratoriobd.onrender.com/api/people/${id}`, { method: 'DELETE' });
      console.log("Response status:", response.status);

      if (!response.ok) throw new Error('Error deleting persona');
      console.log("Persona deleted successfully with ID:", id);

      window.location.reload();
    } catch (err) {
      const error = err as Error;
      console.error("Error deleting persona:", error.message);
      setError(error.message || 'Error deleting persona');
    } finally {
      setIsLoading(false);
    }
  };

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
          <select name="sexo" className="form-select" value={filters.sexo} onChange={handleFilterChange}>
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

      <PersonTable personas={filteredPersonas} onDelete={handlePersonaDelete} onEdit={handleEditModalOpen} />

      {isModalOpen && (
        <Modal
          title="Agregar Nueva Persona"
          persona={newPersona}
          setPersona={setNewPersona}
          onClose={handleModalClose}
          onSave={handlePersonaAdd}
          personas={personas}
        />
      )}

      {isEditModalOpen && editingPersona && (
        <ModalEdit
          title="Editar Persona"
          persona={editingPersona}
          setPersona={setEditingPersona}
          onClose={handleEditModalClose}
          onSave={handlePersonaUpdate}
          personas={personas}
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
        <th>Responsable</th>
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
          <td>{personas.find((p) => p.id === persona.responsable_id)?.nombre || 'Sin Responsable'}</td>
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
  personas: Persona[];
}> = ({ title, persona, setPersona, onClose, onSave, personas }) => (
  <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">{title}</h5>
          <button type="button" className="btn-close" onClick={onClose}></button>
        </div>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              value={persona.nombre || ''}
              onChange={(e) => setPersona({ ...persona, nombre: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Sexo</label>
            <select
              className="form-select"
              value={persona.sexo || ''}
              onChange={(e) => setPersona({ ...persona, sexo: e.target.value })}
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
              value={persona.edad || ''}
              onChange={(e) => setPersona({ ...persona, edad: Number(e.target.value) })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Teléfono</label>
            <input
              type="text"
              className="form-control"
              value={persona.telefono || ''}
              onChange={(e) => setPersona({ ...persona, telefono: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Responsable</label>
            <select
              className="form-select"
              value={persona.responsable_id || ''}
              onChange={(e) =>
                setPersona({ ...persona, responsable_id: Number(e.target.value) || undefined })
              }
            >
              <option value="">Sin Responsable</option>
              {personas.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} {p.id === persona.responsable_id ? '(Actual)' : ''}
                </option>
              ))}
            </select>
          </div>
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

const ModalEdit: React.FC<{
  title: string;
  persona: Partial<Persona>;
  setPersona: React.Dispatch<React.SetStateAction<Partial<Persona> | null>>;
  onClose: () => void;
  onSave: () => void;
  personas: Persona[];
}> = ({ title, persona, setPersona, onClose, onSave, personas }) => (
  <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">{title}</h5>
          <button type="button" className="btn-close" onClick={onClose}></button>
        </div>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              value={persona.nombre || ''}
              onChange={(e) => setPersona({ ...persona, nombre: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Sexo</label>
            <select
              className="form-select"
              value={persona.sexo || ''}
              onChange={(e) => setPersona({ ...persona, sexo: e.target.value })}
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
              value={persona.edad || ''}
              onChange={(e) => setPersona({ ...persona, edad: Number(e.target.value) })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Teléfono</label>
            <input
              type="text"
              className="form-control"
              value={persona.telefono || ''}
              onChange={(e) => setPersona({ ...persona, telefono: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Responsable</label>
            <select
              className="form-select"
              value={persona.responsable_id || ''}
              onChange={(e) =>
                setPersona({ ...persona, responsable_id: Number(e.target.value) || undefined })
              }
            >
              <option value="">Sin Responsable</option>
              {personas.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} {p.id === persona.responsable_id ? '(Actual)' : ''}
                </option>
              ))}
            </select>
          </div>
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
