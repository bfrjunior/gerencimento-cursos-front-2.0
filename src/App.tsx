
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { HomePage } from '@/pages/HomePage';
import { CursosPage } from '@/pages/CursosPage';
import { AlunosPage } from '@/pages/AlunosPage';
import { MatriculasPage } from '@/pages/MatriculasPage';
import { Toaster } from '@/components/ui/toaster';

export function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cursos" element={<CursosPage />} />
            <Route path="/alunos" element={<AlunosPage />} />
            <Route path="/matriculas" element={<MatriculasPage />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  );
}

