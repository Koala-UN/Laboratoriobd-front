import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AiOutlineEdit } from 'react-icons/ai';

type DepartamentoData = {
  municipios: string[];
  alcaldes: { [municipio: string]: string | null };
};

const DropdownsComponent: React.FC = () => {
  const [departamento, setDepartamento] = useState<string | null>(null);
  const [municipios, setMunicipios] = useState<string[]>([]);
  const [filteredDepartamentos, setFilteredDepartamentos] = useState<string[]>([]);
  const [filteredMunicipios, setFilteredMunicipios] = useState<string[]>([]);
  const [alcalde, setAlcalde] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMunicipio, setSelectedMunicipio] = useState<string | null>(null);
  const [departamentos, setDepartamentos] = useState<string[]>([]);
  const [departamentoData, setDepartamentoData] = useState<{ [key: string]: DepartamentoData }>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMunicipios = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('http://localhost:4000/api/municipalities');
        if (!response.ok) {
          throw new Error('Error fetching data from API');
        }

        const data = await response.json();

        const departamentoMap: { [key: string]: DepartamentoData } = {};
        const uniqueDepartamentos = new Set<string>();

        data.forEach((item: any) => {
          const { departamento_nombre, nombre, alcalde_nombre } = item;

          if (!departamentoMap[departamento_nombre]) {
            departamentoMap[departamento_nombre] = { municipios: [], alcaldes: {} };
            uniqueDepartamentos.add(departamento_nombre);
          }

          departamentoMap[departamento_nombre].municipios.push(nombre);
          departamentoMap[departamento_nombre].alcaldes[nombre] = alcalde_nombre;
        });

        setDepartamentoData(departamentoMap);
        setDepartamentos(Array.from(uniqueDepartamentos));
        setFilteredDepartamentos(Array.from(uniqueDepartamentos));
      } catch (err: any) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMunicipios();
  }, []);

  const handleDepartamentoChange = (selectedDepartamento: string) => {
    setDepartamento(selectedDepartamento);
    const data = departamentoData[selectedDepartamento];
    setMunicipios(data?.municipios || []);
    setFilteredMunicipios(data?.municipios || []);
  };

  const handleMunicipioSelect = (municipio: string) => {
    setSelectedMunicipio(municipio);
    setAlcalde(departamentoData[departamento!]?.alcaldes[municipio] || null);
  };

  const handleDepartamentoSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = departamentos.filter((dep) =>
      dep.toLowerCase().includes(searchTerm)
    );
    setFilteredDepartamentos(filtered);
  };

  const handleMunicipioSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = municipios.filter((mun) =>
      mun.toLowerCase().includes(searchTerm)
    );
    setFilteredMunicipios(filtered);
  };

  const toggleEditing = () => setIsEditing(!isEditing);

  const handleAlcaldeChange = (newAlcalde: string) => {
    setAlcalde(newAlcalde);
    toggleEditing();
  };

  const alcaldesList = ['Alcalde A', 'Alcalde B', 'Alcalde C'];

  return (
    <div className="container mt-4">
      {isLoading ? (
        <div>Loading data...</div>
      ) : error ? (
        <div className="alert alert-danger">Error: {error}</div>
      ) : (
        <>
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
                {selectedMunicipio || 'Selecciona un municipio'}
              </button>
              <div className="dropdown-menu" aria-labelledby="municipioDropdown">
                <input
                  className="form-control mb-2"
                  type="text"
                  placeholder="Buscar municipio..."
                  onChange={handleMunicipioSearch}
                />
                {filteredMunicipios.map((mun, index) => (
                  <button
                    key={index}
                    className="dropdown-item"
                    onClick={() => handleMunicipioSelect(mun)}
                  >
                    {mun}
                  </button>
                ))}
                {filteredMunicipios.length === 0 && (
                  <div className="text-muted">No se encontraron resultados</div>
                )}
              </div>
            </div>
          </div>

          {selectedMunicipio && (
            <div className="box p-3 border rounded">
              <h5 className="mb-3">Información del Municipio</h5>
              <p><strong>Municipio:</strong> {selectedMunicipio}</p>
              <p>
                <strong>Alcalde:</strong> {alcalde || 'No asignado'}{' '}
                <AiOutlineEdit onClick={toggleEditing} style={{ cursor: 'pointer', color: 'blue' }} />
              </p>
            </div>
          )}

          {isEditing && (
            <div className="modal d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Editar Alcalde</h5>
                    <button type="button" className="btn-close" onClick={toggleEditing}></button>
                  </div>
                  <div className="modal-body">
                    <ul className="list-group">
                      {alcaldesList.map((name, index) => (
                        <li
                          key={index}
                          className="list-group-item list-group-item-action"
                          onClick={() => handleAlcaldeChange(name)}
                          style={{ cursor: 'pointer' }}
                        >
                          {name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DropdownsComponent;
