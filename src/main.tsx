/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de importar Bootstrap CSS
import NavbarComponent from './App';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Viviendas from './viviendas.tsx';
import Personas from './personas.tsx';
import Alcalde from './alcalde.tsx';
import ZonasDropdownComponent from './zonas.tsx';

const rootElement = document.getElementById('root')!;
const root = createRoot(rootElement);

root.render(
  <>
  <Router>
        <Routes>
        <Route path="/" element={<Navigate to="/personas" />} />

          <Route path="/personas" element={
          <>
            <NavbarComponent/>
            <Personas/>
            </>
            } ></Route> 
          <Route path="/zonas" element={
          <>
            <NavbarComponent/>
            <ZonasDropdownComponent/>
            </>
            } ></Route> 
           <Route path="/viviendas" element={
          <>
            <NavbarComponent/>
            <Viviendas/>
            </>
            } ></Route>
    
        <Route path="/alcalde" element={
          <>
            <NavbarComponent/>
            <Alcalde/>
            </>
            } >

            </Route>
        </Routes>
        </Router>
  </>
);
