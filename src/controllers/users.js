const pool = require('../configs/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const senhaJwt = require('../passwordJwt');

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: 'É necessário preencher todos os campos' })
    }

    try {
        const queryEmail = 'select * from usuarios where email = $1';
        const emailExistente = await pool.query(queryEmail, [email]);

        if (emailExistente.rowCount > 0) {
            return res.status(400).json({ mensagem: 'Endereço de e-mail já registrado' });
        }

        const querySenha = 'insert into usuarios (nome, email, senha) values ($1, $2, $3) returning *';
        const senhaSegura = await bcrypt.hash(senha, 10);
        const novoUsuario = await pool.query(querySenha, [nome, email, senhaSegura]);

        return res.status(201).json(novoUsuario.rows[0])
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
};

const login = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ mensagem: 'É necessário preencher todos os campos' });
    }

    try {
        const queryEmail = 'select * from usuarios where email = $1';
        const usuario = await pool.query(queryEmail, [email]);

        if (usuario.rowCount < 1) {
            return res.status(404).json({ mensagem: 'E-mail e/ou senha inválidos' });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.rows[0].senha);

        if (!senhaValida) {
            return res.status(400).json({ mensagem: 'E-mail e/ou senha inválidos' });
        }

        const token = jwt.sign({ id: usuario.rows[0].id }, senhaJwt, { expiresIn: '1d' });
        const { senha: _, ...usuarioLogado } = usuario.rows[0]

        return res.json({ usuario: usuarioLogado, token });
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
};

const detalharUsuario = async (req, res) => {
    const { senha: _, ...usuario } = req.usuario;
    
    return res.status(200).json(usuario);
};

const atualizarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;
    const idLogado = req.usuario.id

    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: 'É necessário preencher todos os campos' });
    }
    
    try {
        const queryUsuario = 'select * from usuarios where id = $1';
        const usuario = await pool.query(queryUsuario, [idLogado]);
       
        if (usuario.rows[0].email === email && usuario.rows[0].id !== idLogado) {
            return res.status(404).json({ mensagem: 'O e-mail informado já está sendo utilizado por outro usuário' });
        }

        const atualizacaoQuery = 'update usuarios set nome = $1, email = $2, senha = $3 where id = $4'
        const senhaValida = await bcrypt.hash(senha, 10);
        await pool.query(atualizacaoQuery, [nome, email, senhaValida, idLogado]);

        return res.status(204).json()
    } catch (error) {
        console.log(error);
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
};


module.exports = {
    cadastrarUsuario,
    login,
    detalharUsuario,
    atualizarUsuario
}