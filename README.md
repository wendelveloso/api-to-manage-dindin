# API | ToManage DinDin

API RESTful de um sistema que contém recursos que auxiliam no gerenciamento financeiro do usuário, uma forma eficaz de manter o equilíbrio entre suas receitas e despesas.

<br>
<img align=center src="img/img-readme.png">

## Como rodar

Para rodar o projeto localmente, você precisa:

- _Instalar as dependências_

```shell
npm install
```

- _Iniciar o projeto com:_

```shell
npm run dev
```

## _Rotas usáveis_ 

O servidor será iniciado na porta 3000 e você poderá acessá-lo em:

 <br>

 ```shell
 http://localhost:3000/login
```
`POST` _Essa é a rota que permite o usuario cadastrado realizar o login no sistema._<br>
<br>

<details>
<summary><b>Exemplo de Requisição json</b></summary>
<br>
 
```javascript
// POST /login
{
    "email": "jose@email.com",
    "senha": "123456"
}
```
</details>

<br>
<br>

```shell
http://localhost:3000/usuario
```
`POST` _Essa é a rota que será utilizada para cadastrar um novo usuario no sistema._<br>
`GET` _Essa é a rota que será chamada quando o usuario quiser obter os dados do seu próprio perfil._<br>
`PUT` _Essa é a rota que será chamada quando o usuário quiser realizar alterações no seu próprio usuário._<br>
<details>
<summary><b>Exemplo de Requisição json</b></summary>
<br>
 
```javascript
// POST /usuario
{
    "nome": "José",
    "email": "jose@email.com",
    "senha": "123456"
}

// PUT /usuario
{
    "nome": "José de Abreu",
    "email": "jose_abreu@email.com",
    "senha": "j4321"
}
```
</details>

<br>
<br>

```shell
http://localhost:3000/categoria
```
`GET` _Essa é a rota que será chamada quando o usuario logado quiser listar todas as categorias cadastradas._<br>

<br>
<br>

```shell
http://localhost:3000/transacao
```
`POST` _Essa é a rota que será utilizada para cadastrar uma transação associada ao usuário logado._<br>
`GET` _Essa é a rota que será chamada quando o usuario logado quiser listar todas as suas transações cadastradas e podendo usar uma opcão de filtro caso deseje alguma transação específica._<br>
`PUT` `/transacao/:id` _Essa é a rota que será chamada quando o usuario logado quiser atualizar uma das suas transações cadastradas._<br>
`DELETE` `/transacao/:id` _Essa é a rota que será chamada quando o usuario logado quiser excluir uma das suas transações cadastradas._<br>
`GET` `/transacao/extrato` _Essa é a rota que será chamada quando o usuario logado quiser obter o extrato de todas as suas transações cadastradas._
<details>
<summary><b>Exemplo de Requisição json</b></summary>
<br>
 
```javascript
// GET /transacao?filtro[]=roupas&filtro[]=salários
// Sem conteúdo no corpo (body) da requisição

// POST /transacao
{
    "tipo": "entrada",
    "descricao": "Salário",
    "valor": 300000,
    "data": "2022-03-24T15:30:00.000Z",
    "categoria_id": 6
}

// PUT /transacao/2
{
    "descricao": "Sapato amarelo",
    "valor": 15800,
    "data": "2022-03-23 12:35:00",
    "categoria_id": 4,
    "tipo": "saida"
}
```
</details>


## _Tecnologias usadas_
- Javascript
- Node.js
- Express.js
- JSON
