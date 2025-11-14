
export interface Curso {
  id: number;
  nome: string;
  descricao: string;
  matriculas?: Matricula[];
}

export interface Aluno {
  id: number;
  nome: string;
  email: string;
  dataNascimento: string;
  idade?: number;
  matriculas?: Matricula[];
}

export interface Matricula {
  alunoId: number;
  cursoId: number;
  dataMatricula: string;
  aluno?: Aluno;
  curso?: Curso;
}

export interface AlunoDto {
  nome: string;
  email: string;
  dataNascimento: string;
}

export interface CursoDto {
  nome: string;
  descricao: string;
}

export interface MatricularDto {
  alunoId: number;
  cursoId: number;
}

export interface ValidationResult {
  success: boolean;
  errorMessage?: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface FormData {
  [key: string]: string | number | boolean;
}

export interface DialogState {
  open: boolean;
  data?: any;
}

export interface ToastConfig {
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
}

export interface LoadingState {
  loading: boolean;
  error?: string;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
}

export type EntityId = number;
export type DateString = string;
export type EmailString = string;

export type StatusMatricula = 'ATIVA' | 'CANCELADA' | 'CONCLUIDA';
export type TipoUsuario = 'ALUNO' | 'PROFESSOR' | 'ADMIN';

export const STATUS_MATRICULA = {
  ATIVA: 'ATIVA' as const,
  CANCELADA: 'CANCELADA' as const,
  CONCLUIDA: 'CONCLUIDA' as const
} as const;

export const TIPO_USUARIO = {
  ALUNO: 'ALUNO' as const,
  PROFESSOR: 'PROFESSOR' as const,
  ADMIN: 'ADMIN' as const
} as const;