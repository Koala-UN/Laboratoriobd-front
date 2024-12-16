import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

type Departamento = {
  id: number;
  nombre: string;
};

type Municipio = {
  id: number;
  nombre: string;
  alcalde?: string; // Nuevo campo para el nombre del alcalde
};

type Persona = {
  id: number;
  nombre: string;
};

const Alcalde: React.FC = () => {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [selectedDepartamento, setSelectedDepartamento] = useState<Departamento | null>(null);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [selectedMunicipio, setSelectedMunicipio] = useState<Municipio | null>(null);
  const [peopleList, setPeopleList] = useState<Persona[]>([]);
  const [filteredPeople, setFilteredPeople] = useState<Persona[]>([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limit] = useState(5);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    fetchDepartamentos();
  }, []);
  const fetchDepartamentos = async () => {
    try {
      console.log("Fetching departments...");
      setIsLoading(true);
      const response = await fetch('https://laboratoriobd.onrender.com/api/departments');
      console.log("Departments response:", response);
  
      if (!response.ok) throw new Error('Failed to fetch departments');
      const data = await response.json();
      console.log("Departments data:", data);
  
      setDepartamentos(data);
    } catch (err: any) {
      console.error("Error fetching departments:", err.message);
      setError(err.message || 'Error fetching departments');
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchMunicipios = async (departmentId: number) => {
    try {
      console.log(`Fetching municipalities for department ID: ${departmentId}...`);
      setIsLoading(true);
      const response = await fetch(
        `https://laboratoriobd.onrender.com/api/municipalities/department/${departmentId}`
      );
      console.log("Municipalities response:", response);
  
      if (!response.ok) throw new Error('Failed to fetch municipalities');
      const data = await response.json();
      console.log("Municipalities data:", data);
  
      setMunicipios(data);
      setSelectedMunicipio(null);
    } catch (err: any) {
      console.error("Error fetching municipalities:", err.message);
      setError(err.message || 'Error fetching municipalities');
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchMunicipioAlcalde = async (municipioId: number) => {
    try {
      console.log(`Fetching municipality details for ID: ${municipioId}...`);
      const response = await fetch(
        `https://laboratoriobd.onrender.com/api/municipalities/${municipioId}`
      );
      console.log("Municipality details response:", response);
  
      if (!response.ok) throw new Error('Failed to fetch municipality details');
      const data = await response.json();
      console.log("Municipality details data:", data);
  
      const alcalde = data.alcalde_nombre || 'No asignado';
      console.log("Alcalde:", alcalde);
  
      setSelectedMunicipio({ ...data, alcalde });
    } catch (err: any) {
      console.error("Error fetching municipality details:", err.message);
      setError(err.message || 'Error fetching municipality details');
    }
  };
  
  const fetchPeopleList = async () => {
    try {
      console.log(`Fetching people list with limit=${limit} and offset=${offset}...`);
      setIsLoading(true);
      const response = await fetch(
        `https://laboratoriobd.onrender.com/api/people/?limit=${limit}&offset=${offset}`
      );
      console.log("People list response:", response);
  
      if (!response.ok) throw new Error('Failed to fetch people list');
      const data = await response.json();
      console.log("People list data:", data);
  
      setPeopleList(data);
      setFilteredPeople(data);
    } catch (err: any) {
      console.error("Error fetching people list:", err.message);
      setError(err.message || 'Error fetching people list');
    } finally {
      setIsLoading(false);
    }
  };
  
  const assignMayor = async (personId: number) => {
    if (!selectedMunicipio) return;
  
    try {
      console.log(`Assigning mayor ID: ${personId} to municipality ID: ${selectedMunicipio.id}...`);
      setIsLoading(true);
      console.log(personId)
      const response = await fetch(
        `https://laboratoriobd.onrender.com/api/municipalities/${selectedMunicipio.id}/mayor`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ alcaldeId: personId }),
        }
      );
      console.log("Assign mayor response:", response);
  
      if (!response.ok) throw new Error('Failed to assign mayor');
      const updatedData = await response.json();
      console.log("Assign mayor updated data:", updatedData);
  
      alert('Alcalde asignado correctamente');
      fetchMunicipioAlcalde(selectedMunicipio.id);
      setIsEditing(false);
    } catch (err: any) {
      console.error("Error assigning mayor:", err.message);
      setError(err.message || 'Error assigning mayor');
    } finally {
      setIsLoading(false);
    }
  };
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setFilterQuery(query);
    const filtered = peopleList.filter((person) =>
      person.nombre.toLowerCase().includes(query)
    );
    setFilteredPeople(filtered);
  };

  return (
    <div className="container mt-4">
      {isLoading && <div className="text-center my-3">Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="d-flex gap-3 mb-3">
        <div className="dropdown">
          <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
            {selectedDepartamento ? selectedDepartamento.nombre : 'Selecciona un departamento'}
          </button>
          <ul className="dropdown-menu">
            {departamentos.map((dep) => (
              <li key={dep.id}>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setSelectedDepartamento(dep);
                    fetchMunicipios(dep.id);
                  }}
                >
                  {dep.nombre}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            disabled={!selectedDepartamento}
          >
            {selectedMunicipio ? selectedMunicipio.nombre : 'Selecciona un municipio'}
          </button>
          <ul className="dropdown-menu">
            {municipios.map((mun) => (
              <li key={mun.id}>
                <button
                  className="dropdown-item"
                  onClick={() => fetchMunicipioAlcalde(mun.id)}
                >
                  {mun.nombre}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {selectedMunicipio && (
        <div>
          <h5>Municipio: {selectedMunicipio.nombre}</h5>
          <p><strong>Alcalde Actual:</strong> {selectedMunicipio.alcalde}</p>
          <button className="btn btn-primary" onClick={() => {
            setIsEditing(true);
            fetchPeopleList();
          }}>
            Asignar Alcalde
          </button>
        </div>
      )}

      {isEditing && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Asignar Alcalde</h5>
                <button type="button" className="btn-close" onClick={() => setIsEditing(false)}></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Filtrar por nombre"
                  value={filterQuery}
                  onChange={handleFilterChange}
                />
                <ul className="list-group">
                  {filteredPeople.map((person) => (
                    <li
                      key={person.id}
                      className="list-group-item"
                      onClick={() => assignMayor(person.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      {person.nombre}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alcalde;
