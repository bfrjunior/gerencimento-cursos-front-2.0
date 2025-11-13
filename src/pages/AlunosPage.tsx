import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useToast } from '@/hooks/use-toast';
import { api, Aluno, AlunoDto } from '@/services/api';

export function AlunosPage() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAluno, setEditingAluno] = useState<Aluno | null>(null);
  const [formData, setFormData] = useState({ nome: '', email: '', dataNascimento: '' });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; aluno: Aluno | null }>({ open: false, aluno: null });
  const { toast } = useToast();

  const fetchAlunos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/alunos');
      setAlunos(response.data);
    } catch (error) {
      toast({
        title: "Erro ao carregar alunos",
        description: "Não foi possível carregar a lista de alunos. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlunos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const alunoDto: AlunoDto = {
        nome: formData.nome.trim(),
        email: formData.email.trim(),
        dataNascimento: formData.dataNascimento
      };

      if (editingAluno) {
        await api.put(`/alunos/${editingAluno.id}`, alunoDto);
        toast({
          title: "Aluno atualizado!",
          description: "As informações do aluno foram atualizadas com sucesso.",
        });
      } else {
        await api.post('/alunos', alunoDto);
        toast({
          title: "Aluno cadastrado!",
          description: "O novo aluno foi adicionado ao sistema.",
        });
      }
      await fetchAlunos();
      resetForm();
    } catch (error: any) {
      let errorMessage = "Não foi possível salvar o aluno. Verifique os dados e tente novamente.";
      
      if (error.response?.data && typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      } else if (error.response?.status === 400) {
        errorMessage = "Dados inválidos. Verifique se o aluno é maior de idade.";
      }
      
      toast({
        title: "Erro ao salvar aluno",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = (aluno: Aluno) => {
    setDeleteDialog({ open: true, aluno });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.aluno) return;
    
    try {
      await api.delete(`/alunos/${deleteDialog.aluno.id}`);
      toast({
        title: "Aluno excluído!",
        description: "O aluno foi removido do sistema com sucesso.",
      });
      fetchAlunos();
    } catch (error) {
      toast({
        title: "Erro ao excluir aluno",
        description: "Não foi possível excluir o aluno. Verifique se não há matrículas associadas.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialog({ open: false, aluno: null });
    }
  };

  const handleEdit = (aluno: Aluno) => {
    setEditingAluno(aluno);
    setFormData({
      nome: aluno.nome,
      email: aluno.email,
      dataNascimento: aluno.dataNascimento.split('T')[0]
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ nome: '', email: '', dataNascimento: '' });
    setEditingAluno(null);
    setShowForm(false);
  };

  const handleDialogChange = (open: boolean) => {
    setShowForm(open);
    if (!open) {
      resetForm();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Alunos</h1>
          <p className="text-gray-600">Gerencie todos os alunos cadastrados</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Aluno
        </Button>
      </div>

      <Dialog open={showForm} onOpenChange={handleDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAluno ? 'Editar Aluno' : 'Novo Aluno'}</DialogTitle>
            <DialogDescription>
              {editingAluno ? 'Atualize as informações do aluno' : 'Preencha os dados do novo aluno'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                <Input
                  id="dataNascimento"
                  type="date"
                  value={formData.dataNascimento}
                  onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit">
                {editingAluno ? 'Atualizar' : 'Cadastrar'} Aluno
              </Button>
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
            <Users className="h-5 w-5" />
            Alunos Cadastrados
          </CardTitle>
          <CardDescription>
            Total de {alunos.length} alunos no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Carregando alunos...</div>
          ) : (
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
                {alunos.map((aluno) => (
                  <TableRow key={aluno.id}>
                    <TableCell>{aluno.nome}</TableCell>
                    <TableCell>{aluno.email}</TableCell>
                    <TableCell>{formatDate(aluno.dataNascimento)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Ativo</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(aluno)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteClick(aluno)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, aluno: null })}
        title="Excluir Aluno"
        description={`Tem certeza que deseja excluir o aluno "${deleteDialog.aluno?.nome}"? Esta ação não pode ser desfeita.`}
        onConfirm={handleDeleteConfirm}
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="destructive"
      />
    </div>
  );
}