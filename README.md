# 🎓 Sistema de Gerenciamento de Cursos

<div align="center">
  <img src="https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Vite-7.2.2-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tests-28_Passing-4CAF50?style=for-the-badge&logo=vitest&logoColor=white" alt="Tests" />
</div>

<br />

<div align="center">
  <h3>Sistema moderno e completo para gerenciamento de cursos, alunos e matrículas</h3>
  <p>Desenvolvido com as melhores práticas e tecnologias mais atuais do mercado</p>
</div>

---

## ✨ Funcionalidades

### 📚 **Gerenciamento de Cursos**
- ➕ Criar novos cursos com nome e descrição
- ✏️ Editar informações de cursos existentes
- 📋 Listar todos os cursos disponíveis
- 🗑️ Excluir cursos (com confirmação)

### 👥 **Gerenciamento de Alunos**
- 👤 Cadastrar alunos com validação de idade (18+)
- 📧 Validação de email obrigatória
- 📅 Controle de data de nascimento
- ✏️ Editar dados dos alunos
- 🗑️ Remover alunos do sistema

### 📝 **Sistema de Matrículas**
- 🔗 Matricular alunos em cursos específicos
- 🚫 Prevenção de matrículas duplicadas
- 📊 Relatórios de alunos por curso
- 📈 Dashboard com estatísticas

### 🎨 **Interface Moderna**
- 📱 Design responsivo (mobile-first)
- 🌟 Componentes shadcn/ui elegantes
- 🔔 Notificações toast profissionais
- ⚡ Loading states e feedback visual
- 🛡️ Modais de confirmação para ações críticas

---

## 🛠️ Stack Tecnológica

### **Frontend Core**
- **React 19** - Framework frontend mais atual
- **TypeScript** - Tipagem estática para maior segurança
- **Vite** - Build tool ultra-rápido

### **Estilização & UI**
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes modernos e acessíveis
- **Lucide React** - Ícones consistentes e elegantes

### **Roteamento & HTTP**
- **React Router** - Roteamento SPA
- **Axios** - Cliente HTTP com interceptors

### **Testes & Qualidade**
- **Vitest** - Framework de testes moderno
- **Testing Library** - Testes focados no usuário
- **jsdom** - Ambiente de teste para DOM

---

## 🚀 Início Rápido

### **Pré-requisitos**
- Node.js 18+ 
- pnpm (recomendado) ou npm
- Docker (opcional, para containerização)

### **Instalação Local**
```bash
# Clone o repositório
git clone <repository-url>
cd gerencimento-cursos-front-2

# Instale as dependências
pnpm install

# Execute em desenvolvimento
pnpm dev
```

### **Scripts Disponíveis**
```bash
pnpm dev          # Servidor de desenvolvimento (porta 5173)
pnpm build        # Build para produção
pnpm preview      # Preview da build de produção
pnpm lint         # Verificar código com ESLint
pnpm test         # Executar testes em modo watch
pnpm test:run     # Executar testes uma vez
pnpm test:ui      # Interface visual dos testes
pnpm test:coverage # Relatório de cobertura
```

### **🐳 Deploy com Docker**

#### **Build e Execução**
```bash
# Build da imagem Docker
docker build -t gerenciamento-cursos-front .

# Executar container
docker run -p 3000:80 gerenciamento-cursos-front
```

#### **Docker Compose**
```bash
# Build e execução com docker-compose
docker-compose up --build

# Executar em background
docker-compose up -d --build
```

#### **Acesso**
- **Desenvolvimento**: http://localhost:5173
- **Produção (Docker)**: http://localhost:3000

---

## 🔧 Configuração da API

### **Detecção Automática de Ambiente**
O sistema detecta automaticamente o ambiente e configura a URL da API:

- **🏠 Desenvolvimento Local**: `https://localhost:7238/api`
- **🌐 Produção**: `https://gerenciamento-de-cursos.onrender.com/api`

### **Endpoints da API**

#### **Alunos**
```http
GET    /alunos           # Listar todos os alunos
POST   /alunos           # Criar novo aluno
PUT    /alunos/:id       # Atualizar aluno
DELETE /alunos/:id       # Excluir aluno
```

#### **Cursos**
```http
GET    /cursos           # Listar todos os cursos
POST   /cursos           # Criar novo curso
PUT    /cursos/:id       # Atualizar curso
DELETE /cursos/:id       # Excluir curso
```

#### **Matrículas**
```http
POST   /matriculas                           # Criar matrícula
GET    /relatorios/alunos-por-curso/:id      # Relatório de alunos
```

---

## 🧪 Testes

### **Cobertura Completa**
- ✅ **28 testes passando** com 100% de sucesso
- 🔗 **Testes de Integração** - Componentes + API + Hooks
- ⚙️ **Testes Unitários** - Funções e utilitários
- 🎯 **Cenários Reais** - Fluxos completos do usuário

### **Componentes Testados**
| Componente | Testes | Cobertura |
|------------|--------|----------|
| HomePage | 4 | Renderização, navegação |
| AlunosPage | 6 | CRUD, validações, erros |
| CursosPage | 5 | Formulários, operações |
| MatriculasPage | 6 | Matrículas, relatórios |
| API Service | 3 | Configuração, métodos |
| Utils | 4 | Funções utilitárias |

### **Executar Testes**
```bash
# Modo interativo (recomendado para desenvolvimento)
pnpm test

# Executar uma vez (CI/CD)
pnpm test:run

# Interface visual dos testes
pnpm test:ui

# Relatório de cobertura
pnpm test:coverage
```

---

## 📋 Validações e Regras de Negócio

### **👤 Alunos**
- ✅ Nome completo obrigatório
- ✅ Email válido e único
- ✅ Data de nascimento obrigatória
- 🔞 **Apenas maiores de idade** (18+)
- 📅 Data não pode ser futura

### **📚 Cursos**
- ✅ Nome do curso obrigatório
- ✅ Descrição detalhada obrigatória
- 🔤 Campos de texto com validação

### **📝 Matrículas**
- ✅ Aluno e curso obrigatórios
- 🚫 Não permite matrículas duplicadas
- ⚠️ Validação de conflitos no backend

---

## 🎨 Design System

### **🎯 Princípios de Design**
- **Mobile-First** - Responsivo em todas as telas
- **Acessibilidade** - WCAG 2.1 AA compliant
- **Consistência** - Componentes padronizados
- **Performance** - Otimizado para velocidade

### **🌈 Paleta de Cores**
- **Primary**: Azul (#3B82F6)
- **Success**: Verde (#10B981)
- **Warning**: Amarelo (#F59E0B)
- **Danger**: Vermelho (#EF4444)
- **Neutral**: Cinza (#6B7280)

### **📱 Breakpoints**
```css
sm: 640px   /* Tablet */
md: 768px   /* Desktop pequeno */
lg: 1024px  /* Desktop médio */
xl: 1280px  /* Desktop grande */
```

---

## 🔒 Segurança

### **🛡️ Medidas Implementadas**
- **IDs Ocultos** - Não expostos na interface
- **Validação Dupla** - Frontend + Backend
- **Sanitização** - Inputs limpos e seguros
- **HTTPS Only** - Comunicação criptografada
- **Error Handling** - Tratamento seguro de erros

---

## 📈 Performance

### **⚡ Otimizações**
- **Code Splitting** - Carregamento sob demanda
- **Tree Shaking** - Remoção de código não usado
- **Lazy Loading** - Componentes carregados quando necessário
- **Bundle Optimization** - Vite com otimizações automáticas
- **Nginx Caching** - Cache de assets estáticos (1 ano)
- **Docker Multi-stage** - Imagem otimizada para produção

### **📊 Métricas**
- **First Contentful Paint** < 1.5s
- **Largest Contentful Paint** < 2.5s
- **Cumulative Layout Shift** < 0.1
- **Bundle Size** < 500KB gzipped
- **Docker Image** < 50MB (Alpine + Nginx)

---

## 🏗️ Arquitetura

### **📁 Estrutura de Pastas**
```
src/
├── components/          # Componentes reutilizáveis
│   ├── layout/         # Layout components
│   └── ui/             # shadcn/ui components
├── pages/              # Páginas da aplicação
├── services/           # Serviços e API
├── hooks/              # Custom hooks
├── __tests__/          # Testes
└── test/               # Configuração de testes
```

### **🔄 Fluxo de Dados**
```
UI Component → API Service → Backend → Database
     ↓              ↓           ↓         ↓
  useState    →   Axios    →   REST   →  SQL
```

---

## 🐳 Docker

### **📁 Arquivos Docker**
- `Dockerfile` - Multi-stage build com Node.js + Nginx
- `docker-compose.yml` - Orquestração simplificada
- `nginx.conf` - Configuração otimizada para SPA
- `.dockerignore` - Exclusão de arquivos desnecessários

### **🔧 Configuração Nginx**
- **SPA Routing** - Fallback para index.html
- **Cache Headers** - Assets com cache de 1 ano
- **MIME Types** - Suporte completo a tipos de arquivo
- **Compressão** - Otimização automática

---



### **📋 Padrões de Código**
- **ESLint** - Linting automático
- **TypeScript** - Tipagem obrigatória
- **Prettier** - Formatação consistente
- **Conventional Commits** - Mensagens padronizadas

