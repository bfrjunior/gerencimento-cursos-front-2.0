import { useState, useEffect } from 'react';
import { Plus, FileText, Users, BookOpen, Trash2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
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
  const [selectedAlunoRelatorio, setSelectedAlunoRelatorio] = useState('');
  const [alunosMatriculados, setAlunosMatriculados] = useState<Aluno[]>([]);
  const [cursosMatriculados, setCursosMatriculados] = useState<Curso[]>([]);
  const [loadingRelatorio, setLoadingRelatorio] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; alunoId: number; cursoId: number; alunoNome: string; cursoNome: string } | null>(null);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      
 
      const [alunosRes, cursosRes] = await Promise.all([
        api.get('/alunos'),
        api.get('/cursos')
      ]);
      
    
      const alunosData = alunosRes.data?.data || alunosRes.data;
      const cursosData = cursosRes.data?.data || cursosRes.data;
      
      setAlunos(Array.isArray(alunosData) ? alunosData : []);
      setCursos(Array.isArray(cursosData) ? cursosData : []);
      
    
      try {
        const matriculasRes = await api.get('/matriculas');
        const matriculasData = matriculasRes.data?.data || matriculasRes.data;
        setMatriculas(Array.isArray(matriculasData) ? matriculasData : []);
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
      const alunosData = response.data?.data || response.data;
      setAlunosMatriculados(Array.isArray(alunosData) ? alunosData : []);
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

  const handleBuscarCursosPorAluno = async (alunoId: string) => {
    if (!alunoId) {
      setCursosMatriculados([]);
      return;
    }

    try {
      setLoadingRelatorio(true);
      
      // Buscar em todos os cursos quais têm este aluno matriculado
      const cursosComAluno: Curso[] = [];
      
      for (const curso of cursos) {
        try {
          const response = await api.get(`/relatorios/alunos-por-curso/${curso.id}`);
          const alunosData = response.data?.data || response.data;
          const alunosMatriculadosNoCurso = Array.isArray(alunosData) ? alunosData : [];
          
          // Verificar se o aluno está matriculado neste curso
          const alunoEncontrado = alunosMatriculadosNoCurso.find(aluno => aluno.id.toString() === alunoId);
          if (alunoEncontrado) {
            cursosComAluno.push(curso);
          }
        } catch (error) {
          // Ignorar erros de cursos sem alunos
          continue;
        }
      }
      
      setCursosMatriculados(cursosComAluno);
    } catch (error: any) {
      toast({
        title: "Erro ao buscar relatório",
        description: "Não foi possível carregar os cursos do aluno.",
        variant: "destructive",
      });
      setCursosMatriculados([]);
    } finally {
      setLoadingRelatorio(false);
    }
  };

  const handleRemoverMatricula = (alunoId: number, cursoId: number, alunoNome: string, cursoNome: string) => {
    setDeleteDialog({ open: true, alunoId, cursoId, alunoNome, cursoNome });
  };

  const handleConfirmRemover = async () => {
    if (!deleteDialog) return;

    try {
      const desmatricularDto = {
        alunoId: deleteDialog.alunoId,
        cursoId: deleteDialog.cursoId
      };
      
      await api.post('/matriculas/desmatricular', desmatricularDto);
      
      toast({
        title: "Matrícula removida!",
        description: "A matrícula foi removida com sucesso.",
      });
      
      // Atualizar relatórios se estiverem sendo exibidos
      if (selectedCursoRelatorio) {
        handleBuscarRelatorio(selectedCursoRelatorio);
      }
      if (selectedAlunoRelatorio) {
        handleBuscarCursosPorAluno(selectedAlunoRelatorio);
      }
    } catch (error: any) {
      let errorMessage = "Não foi possível remover a matrícula. Tente novamente.";
      
      if (error.response?.data && typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      } else if (error.response?.status === 404) {
        errorMessage = "Matrícula não encontrada.";
      }
      
      toast({
        title: "Erro ao remover matrícula",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setDeleteDialog(null);
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
            <Filter className="h-5 w-5" />
            Relatórios de Matrículas
          </CardTitle>
          <CardDescription>
            Visualize matrículas por curso ou por aluno
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="por-curso" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="por-curso">Por Curso</TabsTrigger>
              <TabsTrigger value="por-aluno">Por Aluno</TabsTrigger>
            </TabsList>
            
            <TabsContent value="por-curso" className="space-y-4">
              <div>
                <Label>Selecionar Curso</Label>
                <Select
                  value={selectedCursoRelatorio}
                  onValueChange={(value) => {
                    setSelectedCursoRelatorio(value);
                    setSelectedAlunoRelatorio('');
                    setCursosMatriculados([]);
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
                          <TableHead className="text-right">Ações</TableHead>
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
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRemoverMatricula(
                                  aluno.id, 
                                  parseInt(selectedCursoRelatorio),
                                  aluno.nome,
                                  cursos.find(c => c.id.toString() === selectedCursoRelatorio)?.nome || ''
                                )}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
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
            </TabsContent>

            <TabsContent value="por-aluno" className="space-y-4">
              <div>
                <Label>Selecionar Aluno</Label>
                <Select
                  value={selectedAlunoRelatorio}
                  onValueChange={(value) => {
                    setSelectedAlunoRelatorio(value);
                    setSelectedCursoRelatorio('');
                    setAlunosMatriculados([]);
                    handleBuscarCursosPorAluno(value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um aluno para ver os cursos" />
                  </SelectTrigger>
                  <SelectContent>
                    {alunos.map((aluno) => (
                      <SelectItem key={aluno.id} value={aluno.id.toString()}>
                        {aluno.nome} - {aluno.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedAlunoRelatorio && (
                <div>
                  <h4 className="font-medium mb-3">
                    Cursos de: {alunos.find(a => a.id.toString() === selectedAlunoRelatorio)?.nome}
                  </h4>
                  
                  {loadingRelatorio ? (
                    <div className="text-center py-4">Carregando cursos...</div>
                  ) : cursosMatriculados.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome do Curso</TableHead>
                          <TableHead>Descrição</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cursosMatriculados.map((curso) => (
                          <TableRow key={curso.id}>
                            <TableCell className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                <BookOpen className="h-4 w-4 text-purple-600" />
                              </div>
                              {curso.nome}
                            </TableCell>
                            <TableCell className="max-w-xs truncate">{curso.descricao}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">Matriculado</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRemoverMatricula(
                                  parseInt(selectedAlunoRelatorio),
                                  curso.id,
                                  alunos.find(a => a.id.toString() === selectedAlunoRelatorio)?.nome || '',
                                  curso.nome
                                )}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      📚 Este aluno ainda não está matriculado em nenhum curso.
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteDialog?.open || false}
        onOpenChange={(open) => !open && setDeleteDialog(null)}
        onConfirm={handleConfirmRemover}
        title="Remover Matrícula"
        description={`Tem certeza que deseja remover a matrícula de ${deleteDialog?.alunoNome} do curso ${deleteDialog?.cursoNome}?`}
        confirmText="Remover"
        cancelText="Cancelar"
      />
    </div>
  );
}