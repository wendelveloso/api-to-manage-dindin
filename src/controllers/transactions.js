const pool = require("../configs/connection");

const listarTransacoes = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const transacoes = await pool.query(
      "SELECT t.*, categorias.descricao AS categoria_nome FROM transacoes t JOIN categorias ON t.categoria_id = categorias.id WHERE t.usuario_id = $1",
      [usuarioId]
    );

    return res.status(200).json(transacoes.rows);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const listarTransacaoId = async (req, res) => {
  const { id } = req.params;
  try {
    const usuarioId = req.usuario.id;
    const transacao = await pool.query(
      "SELECT * FROM transacoes where usuario_id = $1 AND id = $2",
      [usuarioId, id]
    );
    if (transacao.rowCount < 1) {
      return res
        .status(404)
        .json({ mensagem: "Não existe transações para esse usuário" });
    }
    if (!transacao) {
      return res
        .status(404)
        .json({ mensagem: "Essa transação não pertence ao usuário logado" });
    }

    return res.status(200).json(transacao.rows[0]);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const cadastrarTransacao = async (req, res) => {
  const { descricao, valor, data, categoria_id, tipo } = req.body;
  try {
    const usuarioId = req.usuario.id;
    if (!descricao || !valor || !data || !categoria_id || !tipo) {
      return res.status(404).json({
        mensagem: "Todos os campos obrigatórios devem ser informados.",
      });
    }
    const verificandoIdCategoria = await pool.query(
      "SELECT id FROM categorias"
    );
    const idsCategorias = verificandoIdCategoria.rows.map((row) => row.id);
    if (!idsCategorias.includes(categoria_id)) {
      return res
        .status(404)
        .json({ mensagem: "O id da categoria informada não existe" });
    }
    if (tipo !== "entrada" && tipo !== "saida") {
      return res
        .status(404)
        .json({ mensagem: "O tipo precisa ser uma entrada ou saida" });
    }
    const transacao = await pool.query(
      "SELECT * FROM transacoes where usuario_id = $1",
      [usuarioId]
    );
    if (!transacao) {
      return res
        .status(404)
        .json({ mensagem: "Essa transação não pertence ao usuário logado" });
    }

    const novaTransacao = await pool.query(
      "INSERT INTO transacoes (tipo, descricao, valor, data, usuario_id, categoria_id) VALUES ($1, $2, $3, $4, $5, $6) returning *, (SELECT descricao FROM categorias WHERE id = $6) AS categoria_nome",
      [tipo, descricao, valor, data, usuarioId, categoria_id]
    );

    return res.status(201).json(novaTransacao.rows[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const atualizarTransacao = async (req, res) => {
  const { id } = req.params;
  const { descricao, valor, data, categoria_id, tipo } = req.body;
  try {
    const usuarioId = req.usuario.id;
    if (!descricao || !valor || !data || !categoria_id || !tipo) {
      return res.status(404).json({
        mensagem: "Todos os campos obrigatórios devem ser informados.",
      });
    }
    const verificandoIdCategoria = await pool.query(
      "SELECT id FROM categorias"
    );
    const idsCategorias = verificandoIdCategoria.rows.map((row) => row.id);
    if (!idsCategorias.includes(categoria_id)) {
      return res
        .status(404)
        .json({ mensagem: "O id da categoria informada não existe" });
    }
    if (tipo !== "entrada" && tipo !== "saida") {
      return res
        .status(404)
        .json({ mensagem: "O tipo precisa ser uma entrada ou saida" });
    }
    const transacao = await pool.query(
      "SELECT * FROM transacoes WHERE id = $1",
      [id]
    );
    if (transacao.rowCount < 1) {
      return res
        .status(404)
        .json({ mensagem: "Não existe transações para esse usuário" });
    }
    if (transacao.rows[0].usuario_id !== usuarioId) {
      return res
        .status(404)
        .json({ mensagem: "Essa transação não pertence ao usuário logado" });
    }
    const atualizandoTransacao = await pool.query(
      "UPDATE transacoes SET descricao = $1, valor = $2, data = $3, categoria_id = $4, tipo = $5 where id = $6",
      [descricao, valor, data, categoria_id, tipo, transacao.rows[0].id]
    );
    return res.status(201).send();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const deletandoTransacao = async (req, res) => {
  const { id } = req.params;
  try {
    const usuarioId = req.usuario.id;
    const transacao = await pool.query(
      "SELECT * FROM transacoes where usuario_id = $1",
      [usuarioId]
    );
    if (transacao.rowCount < 1) {
      return res
        .status(404)
        .json({ mensagem: "Não existe transações para esse usuário" });
    }
    if (transacao.rows[0].usuario_id !== usuarioId) {
      return res
        .status(404)
        .json({ mensagem: "Essa transação não pertence ao usuário logado" });
    }
    await pool.query("DELETE FROM transacoes where id = $1", [id]);
    return res.status(200).send();
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const extratoTransacoes = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const transacao = await pool.query(
      "SELECT * FROM transacoes where usuario_id = $1",
      [usuarioId]
    );

    const somaSaida = await pool.query(
      "SELECT SUM(valor) AS total FROM transacoes where usuario_id = $1 AND tipo = $2",
      [usuarioId, "saida"]
    );
    const totalSaida = somaSaida.rows[0].total || 0;

    const somaEntrada = await pool.query(
      "SELECT SUM(valor) AS total FROM transacoes where usuario_id = $1 AND tipo = $2",
      [usuarioId, "entrada"]
    );
    const totalEntrada = somaEntrada.rows[0].total || 0;

    const resultado = {
      entrada: totalEntrada,
      saida: totalSaida,
    };
    return res.status(201).json(resultado);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const listarTransacoesPorCategoria = async (req, res) => {
  const { filtro } = req.query;
  try {
    const usuarioId = req.usuario.id;
    const transacoes = await pool.query(
      "SELECT t.*, categorias.descricao AS categoria_nome FROM transacoes t JOIN categorias ON t.categoria_id = categorias.id WHERE t.usuario_id = $1",
      [usuarioId]
    );

    const filtrandoTransacoes = transacoes.rows.filter((transacao) =>
      filtro.includes(transacao.categoria_nome)
    );

    return res.status(201).json(filtrandoTransacoes);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

module.exports = {
  listarTransacoes,
  listarTransacaoId,
  cadastrarTransacao,
  atualizarTransacao,
  deletandoTransacao,
  extratoTransacoes,
  listarTransacoesPorCategoria,
};
