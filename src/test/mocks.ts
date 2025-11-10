import { vi } from 'vitest'

// Mock do axios
export const mockApi = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
}

// Mock do useToast
export const mockToast = vi.fn()

// Mock do react-router-dom
export const mockNavigate = vi.fn()

// Dados de teste
export const mockAlunos = [
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

export const mockCursos = [
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