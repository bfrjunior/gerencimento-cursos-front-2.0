import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useToast } from '@/hooks/use-toast';
import { api, Curso } from '@/services/api';

export function CursosPage() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCurso, setEditingCurso] = useState<Curso | null>(null);
  const [formData, setFormData] = useState({ nome: '', descricao: '' });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; curso: Curso | null }>({ open: false, curso: null });
  const { toast } = useToast();

  const fetchCursos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/cursos');
      setCursos(response.data);
    } catch (error) {
      toast({
        title: "Erro ao carregar cursos",
        description: "Não foi possível carregar a lista de cursos. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCursos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCurso) {
        await api.put(`/cursos/${editingCurso.id}`, formData);
        toast({
          title: "Curso atualizado!",
          description: "As informações do curso foram atualizadas com sucesso.",
        });
      } else {
        await api.post('/cursos', formData);
        toast({
          title: "Curso criado!",
          description: "O novo curso foi adicionado ao sistema.",
        });
      }
      fetchCursos();
      resetForm();
    } catch (error) {
      toast({
        title: "Erro ao salvar curso",
        description: "Não foi possível salvar o curso. Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = (curso: Curso) => {
    setDeleteDialog({ open: true, curso });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.curso) return;
    
    try {
      await api.delete(`/cursos/${deleteDialog.curso.id}`);
      toast({
        title: "Curso excluído!",
        description: "O curso foi removido do sistema com sucesso.",
      });
      fetchCursos();
    } catch (error) {
      toast({
        title: "Erro ao excluir curso",
        description: "Não foi possível excluir o curso. Verifique se não há matrículas associadas.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialog({ open: false, curso: null });
    }
  };

  const handleEdit = (curso: Curso) => {
    setEditingCurso(curso);
    setFormData({ nome: curso.nome, descricao: curso.descricao });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ nome: '', descricao: '' });
    setEditingCurso(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Cursos</h1>
          <p className="text-gray-600">Gerencie todos os cursos disponíveis</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Curso
        </Button>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCurso ? 'Editar Curso' : 'Novo Curso'}</DialogTitle>
            <DialogDescription>
              {editingCurso ? 'Atualize as informações do curso' : 'Preencha os dados do novo curso'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="nome">Nome do Curso</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Input
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit">
                {editingCurso ? 'Atualizar' : 'Criar'} Curso
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
            <BookOpen className="h-5 w-5" />
            Cursos Cadastrados
          </CardTitle>
          <CardDescription>
            Total de {cursos.length} cursos disponíveis
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Carregando cursos...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cursos.map((curso) => (
                  <TableRow key={curso.id}>
                    <TableCell>{curso.nome}</TableCell>
                    <TableCell>{curso.descricao}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Ativo</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(curso)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteClick(curso)}
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
        onOpenChange={(open) => setDeleteDialog({ open, curso: null })}
        title="Excluir Curso"
        description={`Tem certeza que deseja excluir o curso "${deleteDialog.curso?.nome}"? Esta ação não pode ser desfeita.`}
        onConfirm={handleDeleteConfirm}
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="destructive"
      />
    </div>
  );
}