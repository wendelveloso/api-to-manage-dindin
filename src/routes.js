const express = require("express");

const {
    cadastrarUsuario,
    login,
    detalharUsuario,
    atualizarUsuario
} = require('./controllers/users');


const { verificarLogin } = require("./middlewares/authentication");
const {
  listarTransacoes,
  listarTransacaoId,
  cadastrarTransacao,
  atualizarTransacao,
  deletandoTransacao,
  extratoTransacoes,
  listarTransacoesPorCategoria,
} = require("./controllers/transactions");

const { listarCategorias } = require('./controllers/categories');

const routes = express();

routes.post("/usuario", cadastrarUsuario);
routes.post("/login", login);

routes.use(verificarLogin);

routes.get("/usuario", detalharUsuario);
routes.put('/usuario', atualizarUsuario);
routes.get('/categoria', listarCategorias);
routes.get("/transacao", (req, res) => {
  if (req.query.filtro) {
    listarTransacoesPorCategoria(req, res);
  } else {
    listarTransacoes(req, res);
  }
});
routes.get("/transacao/extrato", extratoTransacoes);
routes.get("/transacao/:id", listarTransacaoId);
routes.post("/transacao", cadastrarTransacao);
routes.put("/transacao/:id", atualizarTransacao);
routes.delete("/transacao/:id", deletandoTransacao);


module.exports = routes;
