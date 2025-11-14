import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Users, FileText, TrendingUp } from 'lucide-react';
import { api } from '@/services/api';
import type { Aluno, Curso } from '@/interfaces';

export function HomePage() {
  const [stats, setStats] = useState({
    cursos: 0,
    alunos: 0,
    matriculas: 0,
    apiStatus: 'checking' as 'online' | 'offline' | 'checking',
    loading: true
  });

  const fetchStats = async () => {
    try {
      const [cursosRes, alunosRes] = await Promise.all([
        api.get('/cursos'),
        api.get('/alunos')
      ]);
      
      // Backend agora retorna ApiResult<T>, então os dados estão em .data.data
      const cursosData = cursosRes.data?.data || cursosRes.data;
      const alunosData = alunosRes.data?.data || alunosRes.data;
      
      const cursos: Curso[] = Array.isArray(cursosData) ? cursosData : [];
      const alunos: Aluno[] = Array.isArray(alunosData) ? alunosData : [];
      
      const totalMatriculas = alunos.reduce((total, aluno) => {
        return total + (aluno.matriculas?.length || 0);
      }, 0);
      
      setStats({
        cursos: cursos.length,
        alunos: alunos.length,
        matriculas: totalMatriculas,
        apiStatus: 'online',
        loading: false
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      setStats(prev => ({ 
        ...prev, 
        apiStatus: 'offline',
        loading: false 
      }));
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const dashboardStats = [
    { 
      title: 'Cursos Disponíveis', 
      value: stats.loading ? '...' : stats.cursos.toString(), 
      icon: GraduationCap, 
      color: 'text-blue-600' 
    },
    { 
      title: 'Alunos Cadastrados', 
      value: stats.loading ? '...' : stats.alunos.toString(), 
      icon: Users, 
      color: 'text-green-600' 
    },
    { 
      title: 'Total de Matrículas', 
      value: stats.loading ? '...' : stats.matriculas.toString(), 
      icon: FileText, 
      color: 'text-purple-600' 
    },
    { 
      title: 'Status da API', 
      value: stats.apiStatus === 'checking' ? 'Verificando...' : 
             stats.apiStatus === 'online' ? '✓ Online' : '✗ Offline - Verifique a API', 
      icon: TrendingUp, 
      color: stats.apiStatus === 'online' ? 'text-green-600' : 
             stats.apiStatus === 'offline' ? 'text-red-600' : 'text-yellow-600'
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Bem-vindo ao Sistema de Gerenciamento de Cursos
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Gerencie cursos, alunos e matrículas de forma simples e eficiente
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recursos Principais</CardTitle>
            <CardDescription>
              Principais funcionalidades do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <GraduationCap className="h-5 w-5 text-blue-600" />
              <span>Gerenciamento completo de cursos</span>
            </div>
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-green-600" />
              <span>Cadastro e controle de alunos</span>
            </div>
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-purple-600" />
              <span>Sistema de matrículas e relatórios</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Começar Agora</CardTitle>
            <CardDescription>
              Acesse rapidamente as principais seções
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <a href="/cursos" className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <div className="font-medium">Gerenciar Cursos</div>
              <div className="text-sm text-gray-600">Criar, editar e visualizar cursos</div>
            </a>
            <a href="/alunos" className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <div className="font-medium">Gerenciar Alunos</div>
              <div className="text-sm text-gray-600">Cadastrar e editar informações dos alunos</div>
            </a>
            <a href="/matriculas" className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <div className="font-medium">Matrículas</div>
              <div className="text-sm text-gray-600">Realizar matrículas e gerar relatórios</div>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}