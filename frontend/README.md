# Fisa Store - Frontend

Este é o frontend do sistema de pedidos do Fisa Store, desenvolvido com React, TypeScript e Material-UI.

## Tecnologias Utilizadas

- React
- TypeScript
- Material-UI
- React Hook Form
- Yup
- Zustand
- Axios

## Funcionalidades

- Formulário de cadastro de pedidos
- Seleção de cliente
- Data de entrega
- Lista de produtos com quantidade
- Cálculo automático do valor total
- Validação de formulários
- Integração com API REST

## Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn
- Backend do Fisa Store rodando na porta 8000

## Instalação

1. Clone o repositório
2. Navegue até a pasta do projeto:

```bash
cd frontend
```

3. Instale as dependências:

```bash
npm install
```

4. Inicie o servidor de desenvolvimento:

```bash
npm start
```

O aplicativo estará disponível em `http://localhost:3000`

## Estrutura do Projeto

```
src/
  ├── components/     # Componentes React
  ├── services/      # Serviços de API
  ├── store/         # Gerenciamento de estado (Zustand)
  ├── types/         # Definições de tipos TypeScript
  └── App.tsx        # Componente principal
```

## Decisões de Design

- Utilização do Material-UI para uma interface moderna e responsiva
- Cores da marca (verde #CBE504) aplicadas consistentemente
- Formulário intuitivo com validação em tempo real
- Gerenciamento de estado centralizado com Zustand
- Tipagem forte com TypeScript para maior segurança
- Validação de formulários com Yup e React Hook Form

## Integração com Backend

O frontend se comunica com o backend através de uma API REST, utilizando Axios para as requisições HTTP. As principais operações incluem:

- Listagem de clientes
- Listagem de produtos
- Criação de pedidos
- Atualização de estoque

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request
