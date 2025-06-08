Devs Richard Reiel. RA: 2001354
Caio Saab. RA: 1988558
Felipe Braz. RA: 2003682
Eduardo Roberto. RA: 1989600

Ebot - Sistema de Anúncios com Perguntas e Respostas
====================================================

Este projeto é um sistema completo para gerenciamento de produtos/anúncios, onde usuários podem cadastrar produtos, visualizar anúncios e interagir com perguntas e respostas.

Tecnologias Utilizadas
----------------------

Frontend:
- Vue.js 3 (Composition API)
- Tailwind CSS
- Vite
- Axios

Backend:
- ASP.NET Core 7
- Entity Framework Core
- Banco de dados relacional (ex: SQL Server)

Funcionalidades
---------------
- Cadastro de produtos
- Upload e exibição de imagens dos produtos
- Visualização pública de anúncios
- Sistema de perguntas por produto
- Área para responder perguntas pendentes
- Autenticação JWT
- API REST protegida com [Authorize]

Como Rodar o Projeto Localmente
-------------------------------

Pré-requisitos:
- .NET 7 SDK
- Node.js
- SQL Server

Backend (ASP.NET Core):
    cd backend
    dotnet restore
    dotnet ef database update
    dotnet run
