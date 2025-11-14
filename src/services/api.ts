import axios from 'axios';


const hostname = window.location.hostname;
const port = window.location.port;

const getApiUrl = () => {

  if (hostname === 'localhost' && port === '3000') {
    return 'http://localhost:8080/api';
  }
  

  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]') {

    if (port === '8080') {
      return 'http://localhost:8080/api';
    }

    return 'https://localhost:7238/api';
  }
  

  return 'https://gerenciamento-de-cursos.onrender.com/api';
};

const BASE_URL = getApiUrl();

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


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