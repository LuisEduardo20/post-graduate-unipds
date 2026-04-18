# Monitor de Risco Cardíaco 🫀

Um sistema web moderno para previsão de risco de infarto usando TensorFlow.js, desenvolvido para personal trainers monitorarem a saúde cardiovascular de seus alunos.

## 🎯 Características

- ✅ **Dashboard Intuitivo**: Visualização clara do risco cardíaco de todos os alunos
- ✅ **CRUD Completo**: Gerenciamento total de usuários (Create, Read, Update, Delete)
- ✅ **Banco de Dados JSON**: Armazenamento simples e portável
- ✅ **Integração TensorFlow.js**: Previsões de risco em tempo real
- ✅ **Interface Responsiva**: Funciona perfeitamente em desktop, tablet e mobile
- ✅ **Indicadores Visuais**: Cores e gráficos para fácil interpretação do risco
- ✅ **Recomendações Personalizadas**: Dicas baseadas no nível de risco

## 📦 Stack Tecnológico

- **Frontend**: Next.js 16+ com TypeScript
- **Styling**: Tailwind CSS
- **UI Icons**: Lucide React
- **HTTP Client**: Axios
- **Modelos ML**: TensorFlow.js
- **Database**: JSON File-based
- **Package Manager**: npm

### Por que cada dependência?

| Dependência               | Razão                                                                    |
| ------------------------- | ------------------------------------------------------------------------ |
| **Next.js**               | Framework React moderno com SSR, excelente para aplicações web completas |
| **TypeScript**            | Type safety para evitar erros e melhor experiência de desenvolvimento    |
| **Tailwind CSS**          | Utility-first CSS para estilização rápida e consistente                  |
| **Lucide React**          | Ícones SVG modernos e agnósticos                                         |
| **Axios**                 | Cliente HTTP simples e confiável para requisições API                    |
| **TensorFlow.js**         | Permite carregar e executar modelos treinados no navegador               |
| **clsx + tailwind-merge** | Utilitários para gerenciar classNames com Tailwind                       |

## 📁 Estrutura do Projeto

```
src/
├── app/                          # App Router (Next.js 13+)
│   ├── api/
│   │   └── users/
│   │       ├── route.ts          # GET all users, POST new user
│   │       └── [id]/
│   │           └── route.ts      # GET, PUT, DELETE user by ID
│   ├── users/
│   │   └── [id]/
│   │       └── page.tsx          # Página de detalhes do usuário
│   ├── globals.css               # Estilos globais
│   ├── layout.tsx                # Layout raiz
│   └── page.tsx                  # Dashboard principal
├── components/
│   ├── Dashboard.tsx             # Componente principal com estatísticas
│   ├── UserForm.tsx              # Formulário para adicionar usuário
│   ├── UserCard.tsx              # Card para exibir usuário
│   └── UserList.tsx              # Grid de usuários
├── data/
│   └── users.json                # Banco de dados de usuários
├── lib/
│   ├── fileDB.ts                 # Operações CRUD com JSON
│   └── utils.ts                  # Funções utilitárias
└── types/
    └── user.ts                   # Tipos TypeScript
```

## 🚀 Como Começar

### Pré-requisitos

- Node.js 18+ instalado
- npm ou pnpm

### Instalação

```bash
# Clonar o repositório
git clone <seu-repositorio>
cd gym-user-heart-atack-risk

# Instalar dependências (já feito no setup)
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📊 Interface do Usuário

### Dashboard Principal

- **Estatísticas Rápidas**: Total de usuários, risco médio, usuários com risco elevado
- **Formulário de Novo Usuário**: Coleta dados pessoais, clínicos e de estilo de vida
- **Grid de Usuários**: Cards com informações resumidas e risco visual

### Página de Detalhes

- **Indicador de Risco Visual**: Percentual grande e cores intuitivas
- **Categorização de Risco**: Baixo (0-29%), Moderado (30-59%), Elevado (60-79%), Muito Elevado (80-100%)
- **Dados Completos**: Todos os parâmetros do usuário organizados em seções
- **Recomendações Personalizadas**: Dicas baseadas no nível de risco

## 🧠 Integração com TensorFlow.js

### Arquivos Relevantes

- `src/app/api/users/route.ts` - Função `predictHeartAttackRisk()`

### Como Treinar e Integrar seu Modelo

1. **Treinar seu modelo** (em Python com TensorFlow/Keras):

```python
# Exemplo básico
import tensorflow as tf
from tensorflow import keras

# Seus dados de treinamento
X_train = ...  # Features
y_train = ...  # Labels (risco de infarto: 0-1)

# Criar modelo
model = keras.Sequential([
    keras.layers.Dense(64, activation='relu', input_shape=(11,)),
    keras.layers.Dense(32, activation='relu'),
    keras.layers.Dense(1, activation='sigmoid')  # Saída: probabilidade 0-1
])

model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
model.fit(X_train, y_train, epochs=10, batch_size=32)

# Converter para TensorFlow.js
!pip install tensorflowjs
!tensorflowjs_converter --input_format keras model.h5 ./web_model
```

2. **Colocar o modelo na pasta pública**:

```
public/
└── model/
    ├── model.json
    ├── group1-shard1of1.bin
    └── ...
```

3. **Implementar a previsão no backend** (em `src/app/api/users/route.ts`):

Substitua a função `predictHeartAttackRisk()` mock pela sua implementação usando TensorFlow.js.

### Features do Modelo Esperadas

O modelo deve aceitar um tensor de shape (1, 11) com os seguintes features na ordem:

1. age (0-120)
2. gender (0 ou 1: M=1, F=0)
3. bloodPressure (80-200)
4. cholesterol (100-400)
5. glucose (70-300)
6. smoker (0 ou 1)
7. physicalActivity (0-10 horas/semana)
8. bmi (10-50)
9. family_history (0 ou 1)
10. alcohol_consumption (0-20 unidades/semana)
11. stress_level (1-10)

**Output**: Um valor entre 0 e 1 (será multiplicado por 100 para percentual)

## 📝 API Endpoints

### Usuários

```
GET    /api/users              # Listar todos os usuários
POST   /api/users              # Criar novo usuário
GET    /api/users/[id]         # Obter usuário específico
PUT    /api/users/[id]         # Atualizar usuário
DELETE /api/users/[id]         # Deletar usuário
```

## 🔒 Segurança & Performance

- ✅ Validação de entrada no backend
- ✅ IDs únicos para cada usuário
- ✅ Timestamps de criação e atualização
- ✅ Tratamento de erros robusta
- ✅ Loading states para melhor UX

## 🛠️ Desenvolvimento

### Scripts Disponíveis

```bash
npm run dev      # Inicia servidor de desenvolvimento (porta 3000)
npm run build    # Build para produção
npm start        # Inicia servidor de produção
npm run lint     # Executa ESLint
```

## 📚 Próximos Passos

1. **Treinar seu modelo TensorFlow**
2. **Implementar a função de previsão com seu modelo**
3. **Testar com dados reais**
4. **Deploy em produção** (Vercel, Railway, etc)
5. **Adicionar autenticação de usuários**
6. **Integrar com banco de dados real** (PostgreSQL, MongoDB)
7. **Histórico de previsões** por usuário

## 💡 Dicas de Desenvolvimento

- Use o DevTools do navegador para debugar requisições API
- Componentes marcados com `'use client'` rodam no navegador
- JSON é armazenado em `src/data/users.json`
- Modifique `src/lib/utils.ts` para estender funções utilitárias

## 📞 Recursos

Para aprender mais sobre TensorFlow.js:

- Documentação Oficial: https://js.tensorflow.org/
- Exemplos: https://github.com/tensorflow/tfjs-examples

---

**Desenvolvido para fins educacionais em IA Aplicada** 🚀
