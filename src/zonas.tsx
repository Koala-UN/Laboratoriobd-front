import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { MdAdd, MdDelete } from 'react-icons/md';
import { AiFillEdit } from 'react-icons/ai';

// TypeScript Type Definitions
type Departamento = {
  id: number;
  nombre: string;
};

type Municipio = {
  id: number;
  nombre: string;
};

type Zona = {
  id: number;
  nombre: string;
  tipo_zona_id: string;
};

const ZonasDropdownComponent: React.FC = () => {
  const [zonas, setZonas] = useState<Zona[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [selectedDepartamento, setSelectedDepartamento] = useState<Departamento | null>(null);
  const [selectedMunicipio, setSelectedMunicipio] = useState<Municipio | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newZona, setNewZona] = useState<Partial<Zona>>({ nombre: '', tipo_zona_id: 'vereda' });
  const [editingZona, setEditingZona] = useState<Zona | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDepartamentos();
  }, []);

  const fetchDepartamentos = async () => {
    try {
      const response = await fetch('https://laboratoriobd.onrender.com/api/departments');
      if (!response.ok) throw new Error('Error fetching departamentos');
      const data: Departamento[] = await response.json();
      setDepartamentos(data);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    }
  };

  const handleDepartamentoChange = async (departamento: Departamento) => {
    setSelectedDepartamento(departamento);
    setSelectedMunicipio(null);
    setZonas([]);
    try {
      const response = await fetch(`https://laboratoriobd.onrender.com/api/municipalities/department/${departamento.id}`);
      if (!response.ok) throw new Error('Error fetching municipios');
      const data: Municipio[] = await response.json();
      setMunicipios(data);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    }
  };

  const handleMunicipioChange = async (municipio: Municipio) => {
    setSelectedMunicipio(municipio);
    fetchZonas(municipio.id);
  };

  const fetchZonas = async (municipioId: number) => {
    try {
      const response = await fetch(`https://laboratoriobd.onrender.com/api/zone/municipio/${municipioId}`);
      if (!response.ok) throw new Error('Error fetching zonas');
      const data: Zona[] = await response.json();
      setZonas(data);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    }
  };
  const handleAddOrEditZona = async () => {
    try {
      const url = editingZona
        ? `https://laboratoriobd.onrender.com/api/zone/${editingZona.id}`
        : 'https://laboratoriobd.onrender.com/api/zone/';
      const method = editingZona ? 'PUT' : 'POST';
  
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: newZona.nombre,
          municipio_id: selectedMunicipio?.id,
          tipo_zona_id: newZona.tipo_zona_id,
        }),
      });
  
      if (!response.ok) throw new Error(`Error ${editingZona ? 'updating' : 'adding'} zona`);
  
      // Cerrar modal y refrescar zonas
      closeModal();
      if (selectedMunicipio) {
        fetchZonas(selectedMunicipio.id); // Actualiza la lista de zonas
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    }
  };
  

  const handleDeleteZona = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar esta zona?')) return;

    try {
      const response = await fetch(`https://laboratoriobd.onrender.com/api/zone/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error deleting zona');
      setZonas((prev) => prev.filter((z) => z.id !== id));
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    }
  };

  const openModalForEdit = (zona: Zona) => {
    setEditingZona(zona);
    setNewZona(zona);
    setIsModalOpen(true);
  };

  const openModalForAdd = () => {
    setEditingZona(null);
    setNewZona({ nombre: '', tipo_zona_id: 'vereda' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewZona({ nombre: '', tipo_zona_id: 'vereda' });
    setEditingZona(null);
  };

  return (
    <div className="container mt-4">
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="d-flex gap-3 mb-4">
        {/* Departamento Dropdown */}
        <div className="dropdown">
          <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
            {selectedDepartamento?.nombre || 'Selecciona un departamento'}
          </button>
          <ul className="dropdown-menu">
            {departamentos.map((dep) => (
              <li key={dep.id}>
                <button className="dropdown-item" onClick={() => handleDepartamentoChange(dep)}>
                  {dep.nombre}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Municipio Dropdown */}
        <div className="dropdown">
          <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
            {selectedMunicipio?.nombre || 'Selecciona un municipio'}
          </button>
          <ul className="dropdown-menu">
            {municipios.map((mun) => (
              <li key={mun.id}>
                <button className="dropdown-item" onClick={() => handleMunicipioChange(mun)}>
                  {mun.nombre}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Add Zona Button */}
        <button className="btn btn-success" onClick={openModalForAdd} disabled={!selectedMunicipio}>
          <MdAdd /> Agregar Zona
        </button>
      </div>

      {/* Zonas Table */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {zonas.map((zona) => (
            <tr key={zona.id}>
              <td>{zona.nombre}</td>
              <td>{zona.tipo_zona_id}</td>
              <td>
                <button className="btn btn-primary btn-sm mx-1" onClick={() => openModalForEdit(zona)}>
                  <AiFillEdit />
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteZona(zona.id)}>
                  <MdDelete />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingZona ? 'Editar Zona' : 'Agregar Zona'}</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Nombre de la zona"
                  value={newZona.nombre || ''}
                  onChange={(e) => setNewZona({ ...newZona, nombre: e.target.value })}
                />
                <select
                  className="form-control"
                  value={newZona.tipo_zona_id}
                  onChange={(e) => setNewZona({ ...newZona, tipo_zona_id: e.target.value })}
                >
                  <option value="vereda">Vereda</option>
                  <option value="barrio">Barrio</option>
                </select>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>
                  Cancelar
                </button>
                <button className="btn btn-primary" onClick={handleAddOrEditZona}>
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

export default ZonasDropdownComponent;
