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

app.get('/dispositivos', (_req, res) => {
    const sql = 'SELECT * FROM dispositivos';

    db.query(sql, (err, resultado) => {
        if (err) {
            console.log("Não foi possível encontrar dispositivos:", err);
            return res.status(500).json({ erro: "Não foi possível encontrar dispositivos" });
        }
        res.json(resultado);
    });
});

app.get('/testes', (_req, res) => {
    const sql = 'SELECT * FROM testes';

    db.query(sql, (err, resultado) => {
        if (err) {
            console.log('Não foi possível encontrar testes:', err);
            return res.status(500).json({ erro: 'Não foi possível encontrar testes' });
        }
        res.json(resultado);
    });
});

app.listen(3001, () => {
    console.log('O servidor está rodando na porta 3001.');
});

app.post('/dispositivos', (req, res) => {
    const {nome, endereco_ip, tipo} = req.body;

    if (!nome || !tipo || !endereco_ip){
        return res.status(400).json({erro: 'Está faltando nome, endereço de IP ou tipo.'});
    }

    const sql = 'INSERT INTO dispositivos (nome, endereco_ip, tipo) VALUES (?, ?, ?)'

    db.query(sql, [nome, endereco_ip, tipo], (err, resultado) => {
        if (err) {
            console.log('Erro:', err);
            return res.status(500).json({ erro: 'Não foi possível cadastrar no banco.' });
        }

        const id_dispositivo = resultado.insertId;
        const ping = require('ping')

        ping.promise.probe(endereco_ip, {timeout: 1})
        .then(pingResult => {
            const estado = pingResult.alive ? 'online' : 'offline';
            const latencia = pingResult.alive ? parseFloat(pingResult.time) : null;

            const sqlTeste = `INSERT INTO testes (id_dispositivo, estado, latencia, tempo) VALUES (?, ?, ?, CURRENT_TIME())`;

            db.query(
                sqlTeste, [id_dispositivo, estado, latencia], (err) => {
                    if (err) {
                        console.log('Não foi possível salvar o teste: ', err)
                    }

                    return res.status(201).json({
                    aviso: "Dispositivo foi cadastrado no banco e seu teste foi feito.",
                    id: id_dispositivo,
                    nome,
                    endereco_ip,
                    tipo,
                    teste: {
                       estado,
                       latencia
                    }
                 });
            });
        });
    });
});