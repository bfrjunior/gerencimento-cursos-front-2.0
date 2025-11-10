import axios from 'axios';

// Detecta se está rodando localmente
const isLocalhost = window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1' ||
                   window.location.hostname === '[::1]';

const BASE_URL = isLocalhost 
  ? 'https://localhost:7238/api'
  : 'https://gerenciamento-de-cursos.onrender.com/api';

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
}

export interface Aluno {
  id: number;
  nome: string;
  email: string;
  dataNascimento: string;
}

export interface Matricula {
  id: number;
  alunoId: number;
  cursoId: number;
  dataMatricula: string;
  aluno?: Aluno;
  curso?: Curso;
}