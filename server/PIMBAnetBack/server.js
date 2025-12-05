const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'PIMBAnet'
});

db.getConnection((err, connection) => {
    if (err) {
        console.log('Erro ao conectar-se com o MySQL: '+ err);
        return;
    }
    console.log('Conexão efetuada com sucesso!');
    connection.release();
});

app.listen(3001, () => {
    console.log('O servidor está rodando na porta 3001.');
});

app.post('/dispositivos', (req, res) => {
    const {nome, endereco_ip, tipo} = req.body;

    if (!nome || !tipo){
        return res.status(400).json({erro: 'Está faltando nome, endereço de IP ou tipo.'});
    }

    const sql = 'INSERT INTO dispositivos (nome, endereco_ip, tipo) VALUES (?, ?, ?)'

    db.query(sql, [nome, endereco_ip, tipo], (err, resultado) => {
        if (err) {
            console.log('Erro:', err);
            return res.status(500).json({ erro: 'Não foi possível cadastrar no banco.' });
        }

        return res.status(201).json({
            aviso: "Dispositivo foi cadastrado no banco.",
            id: resultado.insertId,
            nome,
            endereco_ip,
            tipo
        });
    });
});