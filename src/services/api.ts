import axios from 'axios';

// Detecta o ambiente baseado no hostname e porta
const hostname = window.location.hostname;
const port = window.location.port;

// Configuração de URLs da API
const getApiUrl = (): string => {
  // Container frontend (porta 3000) acessando API no host
  if (hostname === 'localhost' && port === '3000') {
    return 'http://localhost:8080/api';
  }
  
  // Desenvolvimento local
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]') {
    // Se a página está na porta 8080, usa a mesma porta para API
    if (port === '8080') {
      return 'http://localhost:8080/api';
    }
    // Caso contrário, usa a porta padrão do desenvolvimento
    return 'https://localhost:7238/api';
  }
  
  // Produção
  return 'https://gerenciamento-de-cursos.onrender.com/api';
};

const BASE_URL = getApiUrl();

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export type {
  // Interfaces principais
  Aluno,
  Curso,
  Matricula,
  // DTOs
  AlunoDto,
  CursoDto,
  MatricularDto,
  // Utilitárias
  ValidationResult,
  ApiResponse,
  FormData,
  DialogState,
  ToastConfig,
  LoadingState,
  PaginationState,
  // Types
  EntityId,
  DateString,
  EmailString,
  // Enums
  StatusMatricula,
  TipoUsuario
} from '@/interfaces';