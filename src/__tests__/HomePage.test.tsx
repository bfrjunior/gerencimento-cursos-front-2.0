import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HomePage } from '@/pages/HomePage'

describe('HomePage', () => {
  it('deve renderizar o título principal', () => {
    render(<HomePage />)
    
    expect(screen.getByText('Bem-vindo ao Sistema de Gerenciamento de Cursos')).toBeInTheDocument()
  })

  it('deve mostrar os cards de estatísticas', () => {
    render(<HomePage />)
    
    expect(screen.getByText('Cursos Disponíveis')).toBeInTheDocument()
    expect(screen.getByText('Alunos Cadastrados')).toBeInTheDocument()
    expect(screen.getByText('Total de Matrículas')).toBeInTheDocument()
    expect(screen.getByText('Status da API')).toBeInTheDocument()
  })

  it('deve mostrar os recursos principais', () => {
    render(<HomePage />)
    
    expect(screen.getByText('Gerenciamento completo de cursos')).toBeInTheDocument()
    expect(screen.getByText('Cadastro e controle de alunos')).toBeInTheDocument()
    expect(screen.getByText('Sistema de matrículas e relatórios')).toBeInTheDocument()
  })

  it('deve ter links para as seções principais', () => {
    render(<HomePage />)
    
    expect(screen.getByText('Gerenciar Cursos')).toBeInTheDocument()
    expect(screen.getByText('Gerenciar Alunos')).toBeInTheDocument()
    expect(screen.getByText('Matrículas')).toBeInTheDocument()
  })
})