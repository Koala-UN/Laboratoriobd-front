/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de importar Bootstrap CSS
import NavbarComponent from './App';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Viviendas from './Viviendas.tsx';
import Personas from './personas.tsx';
import Alcalde from './alcalde.tsx';

const rootElement = document.getElementById('root')!;
const root = createRoot(rootElement);

root.render(
  <>
  <Router>
        <Routes>

          <Route path="/personas" element={
          <>
            <NavbarComponent/>
            <Personas/>
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
