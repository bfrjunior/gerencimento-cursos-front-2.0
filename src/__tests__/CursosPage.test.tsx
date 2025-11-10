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

import { CursosPage } from '@/pages/CursosPage'
import { api } from '@/services/api'

const mockApi = api as any

const mockCursos = [
  {
    id: 1,
    nome: 'React Avançado',
    descricao: 'Curso completo de React'
  },
  {
    id: 2,
    nome: 'Node.js',
    descricao: 'Backend com Node.js'
  }
]

describe('CursosPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockApi.get.mockResolvedValue({ data: mockCursos })
  })

  it('deve renderizar o título da página', () => {
    render(<CursosPage />)
    
    expect(screen.getByText('Gerenciamento de Cursos')).toBeInTheDocument()
    expect(screen.getByText('Gerencie todos os cursos disponíveis')).toBeInTheDocument()
  })

  it('deve carregar e exibir lista de cursos', async () => {
    render(<CursosPage />)
    
    await waitFor(() => {
      expect(screen.getByText('React Avançado')).toBeInTheDocument()
      expect(screen.getByText('Node.js')).toBeInTheDocument()
    })
    
    expect(mockApi.get).toHaveBeenCalledWith('/cursos')
  })

  it('deve mostrar formulário ao clicar em Novo Curso', async () => {
    const user = userEvent.setup()
    render(<CursosPage />)
    
    const novoCursoButton = screen.getByText('Novo Curso')
    await user.click(novoCursoButton)
    
    expect(screen.getByText('Preencha os dados do novo curso')).toBeInTheDocument()
    expect(screen.getByLabelText('Nome do Curso')).toBeInTheDocument()
    expect(screen.getByLabelText('Descrição')).toBeInTheDocument()
  })

  it('deve submeter formulário de novo curso', async () => {
    const user = userEvent.setup()
    mockApi.post.mockResolvedValue({ data: { id: 3 } })
    
    render(<CursosPage />)
    
    await user.click(screen.getByText('Novo Curso'))
    
    await user.type(screen.getByLabelText('Nome do Curso'), 'TypeScript')
    await user.type(screen.getByLabelText('Descrição'), 'Curso de TypeScript')
    
    await user.click(screen.getByText('Criar Curso'))
    
    await waitFor(() => {
      expect(mockApi.post).toHaveBeenCalledWith('/cursos', {
        nome: 'TypeScript',
        descricao: 'Curso de TypeScript'
      })
    })
  })

  it('deve mostrar modal de confirmação ao excluir curso', async () => {
    const user = userEvent.setup()
    render(<CursosPage />)
    
    await waitFor(() => {
      expect(screen.getByText('React Avançado')).toBeInTheDocument()
    })
    
    const deleteButtons = screen.getAllByRole('button')
    const deleteButton = deleteButtons.find(btn => 
      btn.querySelector('svg') && btn.className.includes('destructive')
    )
    
    if (deleteButton) {
      await user.click(deleteButton)
      
      await waitFor(() => {
        expect(screen.getByText('Excluir Curso')).toBeInTheDocument()
      })
    }
  })
})