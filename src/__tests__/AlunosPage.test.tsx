import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock do toast
const mockToast = vi.fn()

// Mocks usando factory functions
vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }
}))

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast })
}))

import { AlunosPage } from '@/pages/AlunosPage'
import { api } from '@/services/api'

const mockApi = api as any

const mockAlunos = [
  {
    id: 1,
    nome: 'João Silva',
    email: 'joao@email.com',
    dataNascimento: '1995-01-15T00:00:00.000Z'
  },
  {
    id: 2,
    nome: 'Maria Santos',
    email: 'maria@email.com',
    dataNascimento: '1990-05-20T00:00:00.000Z'
  }
]

describe('AlunosPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockApi.get.mockResolvedValue({ data: mockAlunos })
  })

  it('deve renderizar o título da página', async () => {
    render(<AlunosPage />)
    
    expect(screen.getByText('Gerenciamento de Alunos')).toBeInTheDocument()
    expect(screen.getByText('Gerencie todos os alunos cadastrados')).toBeInTheDocument()
  })

  it('deve carregar e exibir lista de alunos', async () => {
    render(<AlunosPage />)
    
    await waitFor(() => {
      expect(screen.getByText('João Silva')).toBeInTheDocument()
      expect(screen.getByText('Maria Santos')).toBeInTheDocument()
    })
    
    expect(mockApi.get).toHaveBeenCalledWith('/alunos')
  })

  it('deve mostrar formulário ao clicar em Novo Aluno', async () => {
    const user = userEvent.setup()
    render(<AlunosPage />)
    
    const novoAlunoButton = screen.getByText('Novo Aluno')
    await user.click(novoAlunoButton)
    
    expect(screen.getByText('Preencha os dados do novo aluno')).toBeInTheDocument()
    expect(screen.getByLabelText('Nome Completo')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Data de Nascimento')).toBeInTheDocument()
  })

  it('deve validar data de nascimento máxima', async () => {
    const user = userEvent.setup()
    render(<AlunosPage />)
    
    await user.click(screen.getByText('Novo Aluno'))
    
    const dateInput = screen.getByLabelText('Data de Nascimento')
    const today = new Date().toISOString().split('T')[0]
    
    expect(dateInput).toHaveAttribute('max', today)
  })

  it('deve submeter formulário com dados válidos', async () => {
    const user = userEvent.setup()
    mockApi.post.mockResolvedValue({ data: { id: 3 } })
    
    render(<AlunosPage />)
    
    await user.click(screen.getByText('Novo Aluno'))
    
    await user.type(screen.getByLabelText('Nome Completo'), 'Pedro Costa')
    await user.type(screen.getByLabelText('Email'), 'pedro@email.com')
    await user.type(screen.getByLabelText('Data de Nascimento'), '1995-03-10')
    
    await user.click(screen.getByText('Cadastrar Aluno'))
    
    await waitFor(() => {
      expect(mockApi.post).toHaveBeenCalledWith('/alunos', {
        nome: 'Pedro Costa',
        email: 'pedro@email.com',
        dataNascimento: '1995-03-10'
      })
    })
  })

  it('deve mostrar erro quando aluno é menor de idade', async () => {
    const user = userEvent.setup()
    mockApi.post.mockRejectedValue({
      response: { 
        status: 400, 
        data: 'Aluno deve ser maior de idade para se matricular' 
      }
    })
    
    render(<AlunosPage />)
    
    await user.click(screen.getByText('Novo Aluno'))
    await user.type(screen.getByLabelText('Nome Completo'), 'João Menor')
    await user.type(screen.getByLabelText('Email'), 'joao@email.com')
    await user.type(screen.getByLabelText('Data de Nascimento'), '2010-01-01')
    
    await user.click(screen.getByText('Cadastrar Aluno'))
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Erro ao salvar aluno',
        description: 'Aluno deve ser maior de idade para se matricular',
        variant: 'destructive'
      })
    })
  })
})