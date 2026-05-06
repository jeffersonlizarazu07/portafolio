import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

/**
 * Layout global que envuelve todas las páginas.
 * Incluye Header (menú de navegación) y Footer.
 * 
 * IMPORTANTE: Cada página mantiene su propio contenedor (colors, efectos, etc.)
 * porque tienen diseños visuales distintos.
 */
export const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};