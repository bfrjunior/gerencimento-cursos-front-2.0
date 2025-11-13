import { useState, useEffect } from 'react';
import { Plus, FileText, Users, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { api, Matricula, Aluno, Curso, MatricularDto } from '@/services/api';

export function MatriculasPage() {
  const [, setMatriculas] = useState<Matricula[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ alunoId: '', cursoId: '' });
  const [selectedCursoRelatorio, setSelectedCursoRelatorio] = useState('');
  const [alunosMatriculados, setAlunosMatriculados] = useState<Aluno[]>([]);
  const [loadingRelatorio, setLoadingRelatorio] = useState(false);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Carregar alunos e cursos primeiro
      const [alunosRes, cursosRes] = await Promise.all([
        api.get('/alunos'),
        api.get('/cursos')
      ]);
      
      setAlunos(alunosRes.data);
      setCursos(cursosRes.data);
      
      // Tentar carregar matrículas separadamente
      try {
        const matriculasRes = await api.get('/matriculas');
        setMatriculas(matriculasRes.data);
      } catch (matriculasError) {
        setMatriculas([]);
      }
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar as informações. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const matricularDto: MatricularDto = {
        alunoId: parseInt(formData.alunoId),
        cursoId: parseInt(formData.cursoId)
      };

      await api.post('/matriculas', matricularDto);
      toast({
        title: "Matrícula realizada!",
        description: "A matrícula foi criada com sucesso.",
      });
      resetForm();
    } catch (error: any) {
      let errorMessage = "Não foi possível criar a matrícula.";
      
      if (error.response?.status === 409) {
        errorMessage = error.response?.data || "Este aluno já está matriculado neste curso.";
      } else if (error.response?.data && typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      }
      
      toast({
        title: "Erro ao realizar matrícula",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({ alunoId: '', cursoId: '' });
    setShowForm(false);
  };

  const handleDialogChange = (open: boolean) => {
    setShowForm(open);
    if (!open) {
      resetForm();
    }
  };

  const handleBuscarRelatorio = async (cursoId: string) => {
    if (!cursoId) {
      setAlunosMatriculados([]);
      return;
    }

    try {
      setLoadingRelatorio(true);
      const response = await api.get(`/relatorios/alunos-por-curso/${cursoId}`);
      setAlunosMatriculados(response.data || []);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setAlunosMatriculados([]);
        toast({
          title: "Nenhum aluno encontrado",
          description: "Este curso ainda não possui alunos matriculados.",
        });
      } else {
        toast({
          title: "Erro ao buscar relatório",
          description: "Não foi possível carregar os alunos matriculados.",
          variant: "destructive",
        });
        setAlunosMatriculados([]);
      }
    } finally {
      setLoadingRelatorio(false);
    }
  };



  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const stats = [
    { title: 'Alunos Cadastrados', value: alunos.length, icon: Users, color: 'text-green-600' },
    { title: 'Cursos Disponíveis', value: cursos.length, icon: BookOpen, color: 'text-purple-600' },
    { title: 'Alunos no Curso Selecionado', value: alunosMatriculados.length, icon: FileText, color: 'text-blue-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Matrículas</h1>
          <p className="text-gray-600">Gerencie matrículas e visualize relatórios</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)} 
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nova Matrícula
        </Button>
      </div>

      {(alunos.length === 0 || cursos.length === 0) && !loading && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-gray-600">
              <p>📝 Para criar matrículas, certifique-se de ter alunos e cursos cadastrados.</p>
              <p className="text-sm mt-2">
                Alunos: {alunos.length} | Cursos: {cursos.length}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
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

      <Dialog open={showForm} onOpenChange={handleDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Matrícula</DialogTitle>
            <DialogDescription>
              Selecione o aluno e o curso para realizar a matrícula
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label>Aluno</Label>
                <Select
                  value={formData.alunoId}
                  onValueChange={(value) => setFormData({ ...formData, alunoId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um aluno" />
                  </SelectTrigger>
                  <SelectContent>
                    {alunos.length === 0 ? (
                      <SelectItem value="no-alunos" disabled>
                        Nenhum aluno cadastrado
                      </SelectItem>
                    ) : (
                      alunos.map((aluno) => (
                        <SelectItem key={aluno.id} value={aluno.id.toString()}>
                          {aluno.nome} - {aluno.email}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Curso</Label>
                <Select
                  value={formData.cursoId}
                  onValueChange={(value) => setFormData({ ...formData, cursoId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um curso" />
                  </SelectTrigger>
                  <SelectContent>
                    {cursos.length === 0 ? (
                      <SelectItem value="no-cursos" disabled>
                        Nenhum curso cadastrado
                      </SelectItem>
                    ) : (
                      cursos.map((curso) => (
                        <SelectItem key={curso.id} value={curso.id.toString()}>
                          {curso.nome}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit">Realizar Matrícula</Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Relatório de Alunos por Curso
          </CardTitle>
          <CardDescription>
            Selecione um curso para ver os alunos matriculados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Selecionar Curso para Relatório</Label>
            <Select
              value={selectedCursoRelatorio}
              onValueChange={(value) => {
                setSelectedCursoRelatorio(value);
                handleBuscarRelatorio(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um curso para ver os alunos" />
              </SelectTrigger>
              <SelectContent>
                {cursos.map((curso) => (
                  <SelectItem key={curso.id} value={curso.id.toString()}>
                    {curso.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCursoRelatorio && (
            <div>
              <h4 className="font-medium mb-3">
                Alunos matriculados em: {cursos.find(c => c.id.toString() === selectedCursoRelatorio)?.nome}
              </h4>
              
              {loadingRelatorio ? (
                <div className="text-center py-4">Carregando alunos...</div>
              ) : alunosMatriculados.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Data de Nascimento</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alunosMatriculados.map((aluno) => (
                      <TableRow key={aluno.id}>
                        <TableCell className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="h-4 w-4 text-blue-600" />
                          </div>
                          {aluno.nome}
                        </TableCell>
                        <TableCell>{aluno.email}</TableCell>
                        <TableCell>{formatDate(aluno.dataNascimento)}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Matriculado</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  📝 Nenhum aluno matriculado neste curso ainda.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}