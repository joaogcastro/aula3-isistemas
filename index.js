const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

///////////////////////////////////////////////////////////
// MyQSL Connection
///////////////////////////////////////////////////////////

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar no MySQL: ' + err.stack);
        return;
    }
    console.log('Conectado ao database MySQL');
});

///////////////////////////////////////////////////////////
// Express API
///////////////////////////////////////////////////////////

const app = express();
app.use(bodyParser.json());

app.post('/produtos', (req, res) => {
    const { nome, fornecedor, endereco_fornecedor, quantidade, endereco, preco_unitario } = req.body;
  
    if (!nome || !fornecedor || !endereco_fornecedor || !quantidade || !endereco || !preco_unitario) {
        console.log('Campos faltando no request. Operacao de INSERT abortada.')
        return res.status(400).json({ error: 'Todos os campos são mandatórios' });
    }
  
    const query = `INSERT INTO produtos (nome, fornecedor, endereco_fornecedor, quantidade, endereco, preco_unitario) VALUES (?, ?, ?, ?, ?, ?)`;
  
    db.query(query, [nome, fornecedor, endereco_fornecedor, quantidade, endereco, preco_unitario], (err, result) => {
        if (err) {
            console.log(`Erro no database: ${err}`);
            return res.status(500).json({ error: 'Erro no database' });
        }
        res.status(201).json({ 
            status: 'OK',
            id: result.insertId 
        });
    });
  });


app.get('/produtos', (req, res) => {
    const query = 'SELECT * FROM produtos';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro no database' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Nenhum produto encontrado' });
        }
        res.status(200).json(results);
    });
});

app.get('/produtos/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM produtos WHERE id = ?';

    db.query(query, [id], (err, result) => {
    if (err) {
        return res.status(500).json({ error: 'Erro no database' });
    }
    if (result.length === 0) {
        return res.status(404).json({ message: 'Produto não encontrado' });
    }

    res.status(200).json(result[0]);
    });
});

app.put('/produtos/:id', (req, res) => {
    const { id } = req.params;
    const paramKeys = [];
    const paramValues = [];

    for (const key of ['nome', 'fornecedor', 'endereco_fornecedor', 'quantidade', 'endereco', 'preco_unitario']) {
        if (req.body[key]) {
            paramKeys.push(`${key} = ?`);
            paramValues.push(req.body[key]);
        }
    }

    if (paramKeys.length === 0) {
        return res.status(400).json({ message: 'Nenhum campo para atualizar.' });
    }

    const query = `UPDATE produtos SET ${paramKeys.join(', ')} WHERE id = ?`;
    paramValues.push(id);

    db.query(query, paramValues, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Erro no database' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        res.status(201).json({ 
            status: 'OK',
            id: id
        });
    });
});

app.delete('/produtos/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM produtos WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Erro no database' });
        }

        res.status(200).json({ message: 'Produto deletado com sucesso' });
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server up http://localhost:${port}`);
});
