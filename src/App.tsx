import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Ministries from "./pages/Ministries";
import Tour from "./pages/Tour";
import Project from "./pages/Project";
import Notices from "./pages/Notices";
import Wall from "./pages/Wall";
import Booking from "./pages/Booking";
import Library from "./pages/Library";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Prayer from "./pages/Prayer";
import HomeCells from "./pages/HomeCells";
import Confessions from "./pages/Confessions";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="ministries" element={<Ministries />} />
          <Route path="tour" element={<Tour />} />
          <Route path="project" element={<Project />} />
          <Route path="notices" element={<Notices />} />
          <Route path="wall" element={<Wall />} />
          <Route path="booking" element={<Booking />} />
          <Route path="library" element={<Library />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="contact" element={<Contact />} />
          <Route path="prayer" element={<Prayer />} />
          <Route path="prayer-center" element={<Navigate to="/prayer" replace />} />
          <Route path="home-cells" element={<HomeCells />} />
          <Route path="confessions" element={<Confessions />} />
          <Route path="admin" element={<Admin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
