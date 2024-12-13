import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AiFillEdit } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';

const DropdownsComponent: React.FC = () => {
  const [departamento, setDepartamento] = useState<string | null>(null);
  const [municipios, setMunicipios] = useState<string[]>([]);
  const [zonas, setZonas] = useState<string[]>([]);
  const [selectedZona, setSelectedZona] = useState<string | null>(null);
  const [filteredDepartamentos, setFilteredDepartamentos] = useState<string[]>([]);
  const [filteredMunicipios, setFilteredMunicipios] = useState<string[]>([]);
  const [viviendas, setViviendas] = useState([
    { id: 1, direccion: 'Calle 123', capacidad: 4, niveles: 2 },
    { id: 2, direccion: 'Avenida 456', capacidad: 6, niveles: 3 },
    { id: 3, direccion: 'Calle 789', capacidad: 3, niveles: 1 },
    { id: 4, direccion: 'Avenida 987', capacidad: 5, niveles: 2 },
  ]);
  const [selectedVivienda, setSelectedVivienda] = useState<{
    index: number;
    direccion: string;
    capacidad: number;
    niveles: number;
  } | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  type MunicipiosList = {
    [key: string]: { municipios: string[]; zonas: string[] };
  };

  const departamentos = ['Departamento 1', 'Departamento 2', 'Departamento 3'];
  const municipiosList: MunicipiosList = {
    'Departamento 1': {
      municipios: ['Municipio 1.1', 'Municipio 1.2', 'Municipio 1.3'],
      zonas: ['Zona 1.1.1', 'Zona 1.1.2', 'Zona 1.1.3'],
    },
    'Departamento 2': {
      municipios: ['Municipio 2.1', 'Municipio 2.2', 'Municipio 2.3'],
      zonas: ['Zona 2.2.1', 'Zona 2.2.2', 'Zona 2.2.3'],
    },
    'Departamento 3': {
      municipios: ['Municipio 3.1', 'Municipio 3.3'],
      zonas: ['Zona 3.3.1', 'Zona 3.3.2'],
    },
  };

  const handleDepartamentoChange = (selectedDepartamento: string) => {
    setDepartamento(selectedDepartamento);
    setMunicipios(municipiosList[selectedDepartamento]?.municipios || []);
  };

  const handleMunicipioSelect = (municipio: string) => {
    setSelectedZona(null); // Reset the selected zone when a new municipality is selected
    setZonas(municipiosList[departamento!]?.zonas || []);
  };

  const handleZonaSelect = (zona: string) => {
    setSelectedZona(zona);
  };

  const handleDepartamentoSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = departamentos.filter((dep) => dep.toLowerCase().includes(searchTerm));
    setFilteredDepartamentos(filtered);
  };

  const handleMunicipioSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = municipios.filter((mun) => mun.toLowerCase().includes(searchTerm));
    setFilteredMunicipios(filtered);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex gap-3 mb-4">
        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="departamentoDropdown"
            data-bs-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            {departamento || 'Selecciona un departamento'}
          </button>
          <div className="dropdown-menu" aria-labelledby="departamentoDropdown">
            <input
              className="form-control mb-2"
              type="text"
              placeholder="Buscar departamento..."
              onChange={handleDepartamentoSearch}
            />
            {filteredDepartamentos.map((dep, index) => (
              <button
                key={index}
                className="dropdown-item"
                onClick={() => handleDepartamentoChange(dep)}
              >
                {dep}
              </button>
            ))}
            {filteredDepartamentos.length === 0 && (
              <div className="text-muted">No se encontraron resultados</div>
            )}
          </div>
        </div>

        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="municipioDropdown"
            data-bs-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            disabled={!departamento}
          >
            {selectedZona ? `Selecciona una zona` : 'Selecciona un municipio'}
          </button>
          <div className="dropdown-menu" aria-labelledby="municipioDropdown">
            <input
              className="form-control mb-2"
              type="text"
              placeholder="Buscar municipio..."
              onChange={handleMunicipioSearch}
            />
            {filteredMunicipios.map((mun, index) => (
              <button key={index} className="dropdown-item" onClick={() => handleMunicipioSelect(mun)}>
                {mun}
              </button>
            ))}
            {filteredMunicipios.length === 0 && (
              <div className="text-muted">No se encontraron resultados</div>
            )}
          </div>
        </div>

        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="zonaDropdown"
            data-bs-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            disabled={!municipios.length} // Deshabilitar si no hay municipios disponibles
          >
            {selectedZona || 'Selecciona una zona'}
          </button>
          <div className="dropdown-menu" aria-labelledby="zonaDropdown">
            {zonas.map((zona, index) => (
              <button key={index} className="dropdown-item" onClick={() => handleZonaSelect(zona)}>
                {zona}
              </button>
            ))}
          </div>
        </div>
      </div>

      <HousingTable zonaSeleccionada={selectedZona} />
    </div>
  );
};

const HousingTable: React.FC<{ zonaSeleccionada: string | null }> = ({ zonaSeleccionada }) => {
  const [viviendas, setViviendas] = useState([
    { id: 1, direccion: 'Calle 123', capacidad: 4, niveles: 2 },
    { id: 2, direccion: 'Avenida 456', capacidad: 6, niveles: 3 },
    { id: 3, direccion: 'Calle 789', capacidad: 3, niveles: 1 },
    { id: 4, direccion: 'Avenida 987', capacidad: 5, niveles: 2 },
  ]);

  const [selectedVivienda, setSelectedVivienda] = useState<{
    index: number;
    direccion: string;
    capacidad: number;
    niveles: number;
  } | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const filteredViviendas = zonaSeleccionada
    ? viviendas.filter((vivienda) => vivienda.direccion.includes(zonaSeleccionada))
    : viviendas;

  const handleEditClick = (index: number) => {
    setSelectedVivienda({ index, ...filteredViviendas[index] });
  };

  const handleDeleteClick = (index: number) => {
    const updatedViviendas = filteredViviendas.filter((_, i) => i !== index);
    setViviendas(updatedViviendas);
  };

  const handleSaveChanges = () => {
    if (selectedVivienda) {
      const updatedViviendas = [...viviendas];
      updatedViviendas[selectedVivienda.index] = {
        id: selectedVivienda.index + 1,
        direccion: selectedVivienda.direccion,
        capacidad: selectedVivienda.capacidad,
        niveles: selectedVivienda.niveles,
      };
      setViviendas(updatedViviendas);
      setSelectedVivienda(null);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Lista de Viviendas</h2>
      <table className="table table-striped mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Dirección</th>
            <th>Capacidad</th>
            <th>Niveles</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredViviendas.map((vivienda, index) => (
            <tr key={index}>
              <td>{vivienda.id}</td>
              <td>{vivienda.direccion}</td>
              <td>{vivienda.capacidad}</td>
              <td>{vivienda.niveles}</td>
              <td>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-warning btn-sm d-flex align-items-center gap-1"
                    onClick={() => handleEditClick(index)}
                  >
                    <AiFillEdit />
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm d-flex align-items-center gap-1"
                    onClick={() => handleDeleteClick(index)}
                  >
                    <MdDelete />
                    Del
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de edición */}
      {selectedVivienda && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Vivienda</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedVivienda(null)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Dirección</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedVivienda.direccion}
                    onChange={(e) =>
                      setSelectedVivienda({ ...selectedVivienda, direccion: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Capacidad</label>
                  <input
                    type="number"
                    className="form-control"
                    value={selectedVivienda.capacidad}
                    onChange={(e) =>
                      setSelectedVivienda({ ...selectedVivienda, capacidad: parseInt(e.target.value, 10) })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Niveles</label>
                  <input
                    type="number"
                    className="form-control"
                    value={selectedVivienda.niveles}
                    onChange={(e) =>
                      setSelectedVivienda({ ...selectedVivienda, niveles: parseInt(e.target.value, 10) })
                    }
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setSelectedVivienda(null)}>
                  Cancelar
                </button>
                <button className="btn btn-primary" onClick={handleSaveChanges}>
                  Guardar cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownsComponent;
