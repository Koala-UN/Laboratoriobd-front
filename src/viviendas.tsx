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
    niveles: number; // Added niveles attribute
  };

  type Zona = {
    id: number;
    nombre: string;
  };

  const ViviendasDropdownComponent: React.FC = () => {
    const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
    const [municipios, setMunicipios] = useState<Municipio[]>([]);
    const [zonas, setZonas] = useState<Zona[]>([]);
    const [viviendas, setViviendas] = useState<Vivienda[]>([]);

    const [selectedDepartamento, setSelectedDepartamento] = useState<Departamento | null>(null);
    const [selectedMunicipio, setSelectedMunicipio] = useState<Municipio | null>(null);
    const [selectedZona, setSelectedZona] = useState<Zona | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVivienda, setEditingVivienda] = useState<Vivienda | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const fetchDepartamentos = async () => {
        try {
          setIsLoading(true);
          const response = await fetch('http://localhost:4000/api/departments');
          if (!response.ok) throw new Error('Error fetching departamentos');
          const data: Departamento[] = await response.json();
          setDepartamentos(data);
        } catch (err: any) {
          setError(err.message || 'Error fetching data');
        } finally {
          setIsLoading(false);
        }
      };

      fetchDepartamentos();
    }, []);

    const handleDepartamentoChange = async (departamento: Departamento) => {
      setSelectedDepartamento(departamento);
      setSelectedMunicipio(null);
      setSelectedZona(null);
      setZonas([]);
      setViviendas([]);

      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:4000/api/municipalities/department/${departamento.id}`);
        if (!response.ok) throw new Error('Error fetching municipios');
        const data: Municipio[] = await response.json();
        setMunicipios(data);
      } catch (err: any) {
        setError(err.message || 'Error fetching data');
        setMunicipios([]);
      } finally {
        setIsLoading(false);
      }
    };

    const handleMunicipioChange = async (municipio: Municipio) => {
      setSelectedMunicipio(municipio);
      setSelectedZona(null);
      setZonas([]);
      setViviendas([]);

      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:4000/api/zone/municipio/${municipio.id}`);
        if (!response.ok) throw new Error('Error fetching zonas');
        const data: Zona[] = await response.json();
        setZonas(data);
      } catch (err: any) {
        setError(err.message || 'Error fetching data');
        setZonas([]);
      } finally {
        setIsLoading(false);
      }
    };

    const handleZonaChange = async (zona: Zona) => {
      setSelectedZona(zona);
      setViviendas([]);

      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:4000/api/houses/zone/${zona.id}`);
        if (!response.ok) throw new Error('Error fetching viviendas');
        const data: Vivienda[] = await response.json();
        setViviendas(data);
      } catch (err: any) {
        setError(err.message || 'Error fetching data');
        setViviendas([]);
      } finally {
        setIsLoading(false);
      }
    };

    const handleEditVivienda = (vivienda: Vivienda) => {
      setEditingVivienda(vivienda);
      setIsModalOpen(true);
    };

    const handleModalClose = () => {
      setEditingVivienda(null);
      setIsModalOpen(false);
    };

    return (
      <div className="container mt-4">
        {isLoading && <div>Loading...</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        {!isLoading && !error && (
          <>
            <div className="d-flex gap-3 mb-4">
              {/* Departamento Dropdown */}
              <Dropdown
                title={selectedDepartamento?.nombre || 'Selecciona un departamento'}
                options={departamentos}
                onSelect={handleDepartamentoChange}
              />

              {/* Municipio Dropdown */}
              <Dropdown
                title={selectedMunicipio?.nombre || 'Selecciona un municipio'}
                options={municipios}
                onSelect={handleMunicipioChange}
                disabled={!selectedDepartamento}
              />

              {/* Zona Dropdown */}
              <Dropdown
                title={selectedZona?.nombre || 'Selecciona una zona'}
                options={zonas}
                onSelect={handleZonaChange}
                disabled={!selectedMunicipio}
              />
            </div>

            {/* Viviendas Table */}
            <ViviendasTable viviendas={viviendas} onEdit={handleEditVivienda} />
          </>
        )}

        {/* Modal for Editing Vivienda */}
        {isModalOpen && editingVivienda && (
          <Modal
            vivienda={editingVivienda}
            onClose={handleModalClose}
            onSave={(updatedVivienda) => {
              setViviendas((prev) =>
                prev.map((v) => (v.id === updatedVivienda.id ? updatedVivienda : v))
              );
              handleModalClose();
            }}
          />
        )}
      </div>
    );
  };

  const Dropdown: React.FC<{
    title: string;
    options: { id: number; nombre: string }[];
    onSelect: (option: any) => void;
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
  }> = ({ viviendas, onEdit }) => (
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
        {viviendas.map((vivienda) => (
          <tr key={vivienda.id}>
            <td>{vivienda.direccion}</td>
            <td>{vivienda.capacidad}</td>
            <td>{vivienda.niveles}</td>
            <td>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => onEdit(vivienda)}
              >
                <AiFillEdit />
              </button>
              <button className="btn btn-danger btn-sm">
                <MdDelete />
              </button>
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
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
      onSave(formData);
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

  export default ViviendasDropdownComponent;
