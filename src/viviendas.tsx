import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AiFillEdit } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';

// TypeScript Type Definitions
type Departamento = {
  id: number;
  nombre: string;
};

type Municipio = {
  id: number;
  nombre: string;
};

type Vivienda = {
  id: number;
  direccion: string;
  capacidad: number;
  niveles: number;
  zona_id: number;
};

type Zona = {
  id: number;
  nombre: string;
};

type Persona = {
  id: number;
  nombre: string;
};


const ViviendasDropdownComponent: React.FC = () => {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [zonas, setZonas] = useState<Zona[]>([]);
  const [viviendas, setViviendas] = useState<Vivienda[]>([]);
  const [residentes, setResidentes] = useState<Persona[] | null>(null);
  const [selectedVivienda, setSelectedVivienda] = useState<Vivienda | null>(null);

  const [selectedDepartamento, setSelectedDepartamento] = useState<Departamento | null>(null);
  const [selectedMunicipio, setSelectedMunicipio] = useState<Municipio | null>(null);
  const [selectedZona, setSelectedZona] = useState<Zona | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVivienda, setEditingVivienda] = useState<Vivienda | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newVivienda, setNewVivienda] = useState<Vivienda | null>(null);

  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        console.log('Fetching departamentos...');
        setIsLoading(true);
        const response = await fetch('https://laboratoriobd.onrender.com/api/departments');
        if (!response.ok) throw new Error('Error fetching departamentos');
        const data: Departamento[] = await response.json();
        console.log('Departamentos fetched:', data);
        setDepartamentos(data);
      } catch (err) {
        const error = err as Error;
        console.error('Error fetching departamentos:', error.message);
        setError(error.message || 'Error fetching data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartamentos();
  }, []);

  const handleDepartamentoChange = async (departamento: Departamento) => {
    console.log('Selected departamento:', departamento);
    setSelectedDepartamento(departamento);
    setSelectedMunicipio(null);
    setSelectedZona(null);
    setZonas([]);
    setViviendas([]);
    setResidentes(null);

    try {
      console.log(`Fetching municipios for departamento ${departamento.id}...`);
      setIsLoading(true);
      const response = await fetch(`https://laboratoriobd.onrender.com/api/municipalities/department/${departamento.id}`);
      if (!response.ok) throw new Error('Error fetching municipios');
      const data: Municipio[] = await response.json();
      console.log('Municipios fetched:', data);
      setMunicipios(data);
    } catch (err) {
      const error = err as Error;
      console.error('Error fetching municipios:', error.message);
      setError(error.message || 'Error fetching data');
      setMunicipios([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMunicipioChange = async (municipio: Municipio) => {
    console.log('Selected municipio:', municipio);
    setSelectedMunicipio(municipio);
    setSelectedZona(null);
    setZonas([]);
    setViviendas([]);
    setResidentes(null);

    try {
      console.log(`Fetching zonas for municipio ${municipio.id}...`);
      setIsLoading(true);
      const response = await fetch(`https://laboratoriobd.onrender.com/api/zone/municipio/${municipio.id}`);
      if (!response.ok) throw new Error('Error fetching zonas');
      const data: Zona[] = await response.json();
      console.log('Zonas fetched:', data);
      setZonas(data);
    } catch (err) {
      const error = err as Error;
      console.error('Error fetching zonas:', error.message);
      setError(error.message || 'Error fetching data');
      setZonas([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleZonaChange = async (zona: Zona) => {
    console.log('Selected zona:', zona);
    setSelectedZona(zona);
    setViviendas([]);
    setResidentes(null);

    try {
      console.log(`Fetching viviendas for zona ${zona.id}...`);
      setIsLoading(true);
      const response = await fetch(`https://laboratoriobd.onrender.com/api/houses/zone/${zona.id}`);
      if (!response.ok) throw new Error('Error fetching viviendas');
      const data: Vivienda[] = await response.json();
      console.log('Viviendas fetched:', data);
      setViviendas(data);
    } catch (err) {
      const error = err as Error;
      console.error('Error fetching viviendas:', error.message);
      setError(error.message || 'Error fetching data');
      setViviendas([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewResidentes = async (vivienda: Vivienda) => {
    console.log('Viewing residentes for vivienda:', vivienda);
    try {
      setSelectedVivienda(vivienda);
      setIsLoading(true);
      const response = await fetch(`https://laboratoriobd.onrender.com/api/people/house/${vivienda.id}`);
      if (!response.ok) throw new Error('Error fetching residentes');
      const data: Persona[] = await response.json();
      console.log('Residentes fetched:', data);
      setResidentes(data);
    } catch (err) {
      const error = err as Error;
      console.error('Error fetching residentes:', error.message);
      setError(error.message || 'Error fetching residentes');
      setResidentes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditVivienda = (vivienda: Vivienda) => {
    console.log('Editing vivienda:', vivienda);
    setEditingVivienda(vivienda);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    console.log('Closing modal...');
    setEditingVivienda(null);
    setIsModalOpen(false);
  };

  const handleAddVivienda = () => {
    console.log('Adding new vivienda');
    setNewVivienda({
      id: 0,
      direccion: '',
      capacidad: 0,
      niveles: 0,
      zona_id: selectedZona?.id || 0,
    });
    setIsAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    console.log('Closing add modal...');
    setNewVivienda(null);
    setIsAddModalOpen(false);
  };

  return (
    <div className="container mt-4">
      {isLoading && <div>Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!isLoading && !error && (
        <>
          <div className="d-flex gap-3 mb-4">
            <Dropdown
              title={selectedDepartamento?.nombre || 'Selecciona un departamento'}
              options={departamentos}
              onSelect={handleDepartamentoChange}
            />
            <Dropdown
              title={selectedMunicipio?.nombre || 'Selecciona un municipio'}
              options={municipios}
              onSelect={handleMunicipioChange}
              disabled={!selectedDepartamento}
            />
            <Dropdown
              title={selectedZona?.nombre || 'Selecciona una zona'}
              options={zonas}
              onSelect={handleZonaChange}
              disabled={!selectedMunicipio}
            />
          </div>

          <button className="btn btn-success mb-4" onClick={handleAddVivienda}>
            Agregar Vivienda
          </button>

          <ViviendasTable
            viviendas={viviendas}
            onEdit={handleEditVivienda}
            onViewResidentes={handleViewResidentes}
          />

          {residentes && selectedVivienda && (
            <div className="mt-4">
              <h5>Residentes en {selectedVivienda.direccion}</h5>
              {residentes.length > 0 ? (
                <ul className="list-group">
                  {residentes.map((persona) => (
                    <li key={persona.id} className="list-group-item">
                      {persona.nombre}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay residentes en esta vivienda.</p>
              )}
            </div>
          )}
        </>
      )}

      {isModalOpen && editingVivienda && (
        <Modal
          vivienda={editingVivienda}
          onClose={handleModalClose}
          onSave={(updatedVivienda) => {
            console.log('Saving updated vivienda:', updatedVivienda);
            setViviendas((prev) =>
              prev.map((v) => (v.id === updatedVivienda.id ? updatedVivienda : v))
            );
            handleModalClose();
          }}
        />
      )}

      {isAddModalOpen && newVivienda && (
        <AddModal
          vivienda={newVivienda}
          zonas={zonas}
          onClose={handleAddModalClose}
          onSave={(createdVivienda) => {
            console.log('Saving new vivienda:', createdVivienda);
            setViviendas((prev) => [...prev, createdVivienda]);
            handleAddModalClose();
          }}
        />
      )}
    </div>
  );
};
interface Option {
  id: number;
  nombre: string;
}
const Dropdown: React.FC<{
  title: string;
  options: { id: number; nombre: string }[];
  onSelect: (option: Option) => void;
  disabled?: boolean;
}> = ({ title, options, onSelect, disabled }) => (
  <div className="dropdown">
    <button
      className="btn btn-secondary dropdown-toggle"
      type="button"
      data-bs-toggle="dropdown"
      disabled={disabled}
    >
      {title}
    </button>
    <div className="dropdown-menu">
      {options.map((option) => (
        <button
          key={option.id}
          className="dropdown-item"
          onClick={() => onSelect(option)}
        >
          {option.nombre}
        </button>
      ))}
    </div>
  </div>
);

const ViviendasTable: React.FC<{
  viviendas: Vivienda[];
  onEdit: (vivienda: Vivienda) => void;
  onViewResidentes: (vivienda: Vivienda) => void;
}> = ({ viviendas, onEdit, onViewResidentes }) => (
  <table className="table table-bordered">
    <thead>
      <tr>
        <th>Dirección</th>
        <th>Capacidad</th>
        <th>Niveles</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {viviendas.map((vivienda, index) => (
        <tr key={index}>
          <td>{vivienda.direccion}</td>
          <td>{vivienda.capacidad}</td>
          <td>{vivienda.niveles}</td>
          <td>
            <div className="d-flex">
              <button
                className="btn btn-info btn-sm me-2"
                onClick={() => onViewResidentes(vivienda)}
              >
                Ver Residentes
              </button>
              <button
                className="btn btn-primary btn-sm me-2"
                onClick={() => onEdit(vivienda)}
              >
                <AiFillEdit />
              </button>
              <button className="btn btn-danger btn-sm">
                <MdDelete />
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);
const Modal: React.FC<{
  vivienda: Vivienda;
  onClose: () => void;
  onSave: (updatedVivienda: Vivienda) => void;
}> = ({ vivienda, onClose, onSave }) => {
  const [formData, setFormData] = useState<Vivienda>(vivienda);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'capacidad' || name === 'niveles' ? Number(value) : value, // Convert to number if needed
    }));
  };

  const handleSave = async () => {

    console.log('Saving vivienda:', formData);
    try {
      const payload = {
        direccion: formData.direccion,
        capacidad: Number(formData.capacidad),
        niveles: Number(formData.niveles),
        zona_id: Number(formData.zona_id)
      };

      console.log('Payload to send:', payload);
      console.log('form:', formData);
      const response = await fetch(
        `https://laboratoriobd.onrender.com/api/houses/${formData.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error('Error al actualizar la vivienda');
      }

      const updatedVivienda = await response.json();
      console.log('Updated vivienda:', updatedVivienda);
      onSave(updatedVivienda);

      window.location.reload();

    } catch (err) {
      const error = err as Error;
      console.error('Error updating vivienda:', error.message);
      alert(error.message || 'Error al actualizar la vivienda');
    }
  };

  return (
    <div className="modal show d-block">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar Vivienda</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Dirección</label>
              <input
                type="text"
                className="form-control"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Capacidad</label>
              <input
                type="number"
                className="form-control"
                name="capacidad"
                value={formData.capacidad}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Niveles</label>
              <input
                type="number"
                className="form-control"
                name="niveles"
                value={formData.niveles}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AddModal: React.FC<{
  vivienda: Vivienda;
  zonas: Zona[];
  onClose: () => void;
  onSave: (createdVivienda: Vivienda) => void;
}> = ({ vivienda, zonas, onClose, onSave }) => {
  const [formData, setFormData] = useState<Omit<Vivienda, 'id'>>({
    direccion: vivienda.direccion,
    capacidad: vivienda.capacidad,
    niveles: vivienda.niveles,
    zona_id: vivienda.zona_id,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'capacidad' || name === 'niveles' || name === 'zona_id' ? Number(value) : value,
    }));
  };

  const handleSave = async () => {
    console.log('Saving new vivienda:', formData);
    try {
      const payload = {
        direccion: formData.direccion,
        capacidad: Number(formData.capacidad),
        niveles: Number(formData.niveles),
        zona_id: Number(formData.zona_id),
      };

      console.log('Payload to send:', payload);
      const response = await fetch('https://laboratoriobd.onrender.com/api/houses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Error al crear la vivienda');
      }

      const data = await response.json();
      console.log('Created vivienda:', data);
      const houseid = data.houseId;
    const createdVivienda: Vivienda = {
      id: houseid,
      direccion: formData.direccion,
      capacidad: formData.capacidad,
      niveles: formData.niveles,
      zona_id: formData.zona_id,
    };
    onSave(createdVivienda);
    } catch (err) {
      const error = err as Error;
      console.error('Error creating vivienda:', error.message);
      alert(error.message || 'Error al crear la vivienda');
    }
  };

  return (
    <div className="modal show d-block">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Agregar Vivienda</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Dirección</label>
              <input
                type="text"
                className="form-control"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Capacidad</label>
              <input
                type="number"
                className="form-control"
                name="capacidad"
                value={formData.capacidad}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Niveles</label>
              <input
                type="number"
                className="form-control"
                name="niveles"
                value={formData.niveles}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Zona</label>
              <select
                className="form-select"
                name="zona_id"
                value={formData.zona_id}
                onChange={handleChange}
              >
                <option value="">Selecciona una zona</option>
                {zonas.map((zona) => (
                  <option key={zona.id} value={zona.id}>
                    {zona.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViviendasDropdownComponent;
