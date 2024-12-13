
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de importar Bootstrap CSS
import NavbarComponent from './App';


import DropdownsComponent from './personas.tsx';

const rootElement = document.getElementById('root')!;
const root = createRoot(rootElement);

root.render(
  <>
    <NavbarComponent />
    <DropdownsComponent/>
  </>,
);
