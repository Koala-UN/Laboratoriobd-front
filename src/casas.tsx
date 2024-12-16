  import React, { useState, useEffect } from 'react';
  import 'bootstrap/dist/css/bootstrap.min.css';
  import { AiFillEdit } from 'react-icons/ai';
  import { MdDelete } from 'react-icons/md';

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
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Estados para filtrado
    const [departamentoFilter, setDepartamentoFilter] = useState('');
    const [municipioFilter, setMunicipioFilter] = useState('');
    const [zonaFilter, setZonaFilter] = useState('');

    // Estados para mostrar el campo de búsqueda al abrir el dropdown
    const [isDepartamentoDropdownOpen, setIsDepartamentoDropdownOpen] = useState(false);
    const [isMunicipioDropdownOpen, setIsMunicipioDropdownOpen] = useState(false);
    const [isZonaDropdownOpen, setIsZonaDropdownOpen] = useState(false);

    useEffect(() => {
      const fetchDepartamentos = async () => {
        try {
          setIsLoading(true);
          const response = await fetch('https://laboratoriobd.onrender.com/api/departments');
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
        const response = await fetch(`https://laboratoriobd.onrender.com/api/municipalities/department/${departamento.id}`);
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
        const response = await fetch(`https://laboratoriobd.onrender.com/api/zone/municipio/${municipio.id}`);
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
        const response = await fetch(`https://laboratoriobd.onrender.com/api/houses/zone/${zona.id}`);
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

    return (
      <div className="container mt-4">
        {isLoading && <div>Loading...</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        {!isLoading && !error && (
          <>
            <div className="d-flex gap-3 mb-4">
              {/* Departamento Dropdown */}
              <div className="dropdown">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  id="departamentoDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  onClick={() =>
                    setIsDepartamentoDropdownOpen(!isDepartamentoDropdownOpen)
                  }
                >
                  {selectedDepartamento
                    ? selectedDepartamento.nombre
                    : 'Selecciona un departamento'}
                </button>
                {isDepartamentoDropdownOpen && (
                  <div className="dropdown-menu show">
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Filtrar departamentos"
                      value={departamentoFilter}
                      onChange={(e) => setDepartamentoFilter(e.target.value)}
                    />
                    {departamentos
                      .filter((dep) =>
                        dep.nombre
                          .toLowerCase()
                          .includes(departamentoFilter.toLowerCase())
                      )
                      .map((dep) => (
                        <button
                          key={dep.id}
                          className="dropdown-item"
                          onClick={() => handleDepartamentoChange(dep)}
                        >
                          {dep.nombre}
                        </button>
                      ))}
                  </div>
                )}
              </div>

              {/* Municipio Dropdown */}
              <div className="dropdown">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  id="municipioDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  disabled={!selectedDepartamento}
                  onClick={() =>
                    setIsMunicipioDropdownOpen(!isMunicipioDropdownOpen)
                  }
                >
                  {selectedMunicipio
                    ? selectedMunicipio.nombre
                    : 'Selecciona un municipio'}
                </button>
                {isMunicipioDropdownOpen && (
                  <div className="dropdown-menu show">
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Filtrar municipios"
                      value={municipioFilter}
                      onChange={(e) => setMunicipioFilter(e.target.value)}
                    />
                    {municipios
                      .filter((mun) =>
                        mun.nombre
                          .toLowerCase()
                          .includes(municipioFilter.toLowerCase())
                      )
                      .map((mun) => (
                        <button
                          key={mun.id}
                          className="dropdown-item"
                          onClick={() => handleMunicipioChange(mun)}
                        >
                          {mun.nombre}
                        </button>
                      ))}
                  </div>
                )}
              </div>

              {/* Zona Dropdown */}
              <div className="dropdown">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  id="zonaDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  disabled={!selectedMunicipio}
                  onClick={() => setIsZonaDropdownOpen(!isZonaDropdownOpen)}
                >
                  {selectedZona ? selectedZona.nombre : 'Selecciona una zona'}
                </button>
                {isZonaDropdownOpen && (
                  <div className="dropdown-menu show">
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Filtrar zonas"
                      value={zonaFilter}
                      onChange={(e) => setZonaFilter(e.target.value)}
                    />
                    {zonas
                      .filter((zn) =>
                        zn.nombre.toLowerCase().includes(zonaFilter.toLowerCase())
                      )
                      .map((zn) => (
                        <button
                          key={zn.id}
                          className="dropdown-item"
                          onClick={() => handleZonaChange(zn)}
                        >
                          {zn.nombre}
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Viviendas List */}
            {viviendas.length > 0 ? (
              <div>
                <h5>Viviendas en la zona</h5>
                <ViviendasTable viviendas={viviendas}/>
              </div>
            ) : selectedZona ? (
              <p>No hay viviendas disponibles en esta zona.</p>
            ) : null}
          </>
        )}
      </div>
    );
  };

  const ViviendasTable: React.FC<{ viviendas: Vivienda[] }> = ({ viviendas }) => {
      return (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Dirección</th>
              <th>Capacidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {viviendas.map((vivienda) => (
              <tr key={vivienda.id}>
                <td>{vivienda.direccion}</td>
                <td>{vivienda.capacidad}</td>
                <td>
                  <button className="btn btn-primary btn-sm mx-1"> <AiFillEdit /></button>
                  <button className="btn btn-danger btn-sm mx-1"><MdDelete /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    };
    
  export default ViviendasDropdownComponent;
