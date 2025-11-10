import { describe, it, expect } from 'vitest'

// Testes de funções utilitárias
describe('Utility Functions', () => {
  it('deve formatar data corretamente', () => {
    const dateString = '1995-01-15'
    const [year, month, day] = dateString.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    const formatted = date.toLocaleDateString('pt-BR')
    
    expect(formatted).toBe('15/01/1995')
  })

  it('deve validar email', () => {
    const validEmail = 'test@email.com'
    const invalidEmail = 'invalid-email'
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    
    expect(emailRegex.test(validEmail)).toBe(true)
    expect(emailRegex.test(invalidEmail)).toBe(false)
  })

  it('deve calcular idade corretamente', () => {
    const birthDate = new Date('1995-01-15')
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    
    expect(age).toBeGreaterThan(0)
    expect(age).toBeLessThan(150)
  })

  it('deve validar se é maior de idade', () => {
    const adultBirthDate = new Date('1995-01-15')
    const minorBirthDate = new Date('2010-01-15')
    const today = new Date()
    
    const adultAge = today.getFullYear() - adultBirthDate.getFullYear()
    const minorAge = today.getFullYear() - minorBirthDate.getFullYear()
    
    expect(adultAge).toBeGreaterThanOrEqual(18)
    expect(minorAge).toBeLessThan(18)
  })
})