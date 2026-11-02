
import { Suspense, lazy, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import Home from './pages/Home.jsx';
import Courses from './pages/Courses.jsx';
import Branches from './pages/Branches.jsx';
import Admission from './pages/Admission.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import SplashScreen from './Utils/SplashScreen.jsx';
import GalleryAll from './components/sections/GalleryAll.jsx';
import ProgramsCatalog from './components/sections/Programscatlog.jsx';

const Login = lazy(() => import('./pages/Login.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      const t = setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 60);
      return () => clearTimeout(t);
    }
    window.scrollTo({ top: 0 });
    return undefined;
  }, [pathname, hash]);
  return null;
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <Suspense
      fallback={
        <div className="page-loader">
          <span />
        </div>
      }
    >
      <ScrollManager />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/branches" element={<Branches />} />
        <Route path="/admission" element={<Admission />} />
         <Route path="/gallery" element={<GalleryAll />} />
         <Route path="/programs/*" element={<ProgramsCatalog />} />
        <Route path="/dashboard/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
