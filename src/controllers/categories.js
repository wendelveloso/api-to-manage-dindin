const pool = require('../configs/connection');

const listarCategorias = async (req, res) => {
    try {
        const listagem = await pool.query('select * from categorias');

        return res.status(200).json(listagem.rows)
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
};

module.exports = {
    listarCategorias
}