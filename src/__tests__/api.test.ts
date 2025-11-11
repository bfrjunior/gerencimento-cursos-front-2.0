import { describe, it, expect } from 'vitest'
import { api } from '@/services/api'

// Mock do window.location
Object.defineProperty(window, 'location', {
  value: {
    hostname: 'localhost'
  },
  writable: true
})

describe('API Service', () => {
  it('deve usar URL local quando hostname for localhost', () => {
    // Como estamos em ambiente de teste (localhost), deve usar a URL local
    expect(api.defaults.baseURL).toBe('https://localhost:7238/api')
  })

  it('deve ter o header Content-Type correto', () => {
    expect(api.defaults.headers['Content-Type']).toBe('application/json')
  })

  it('deve ter os métodos HTTP disponíveis', () => {
    expect(api.get).toBeDefined()
    expect(api.post).toBeDefined()
    expect(api.put).toBeDefined()
    expect(api.delete).toBeDefined()
  })
})