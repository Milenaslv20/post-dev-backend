const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL
}));
app.use(bodyParser.json());


const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});
db.connect((err) =>{
    if(err){
        console.log("Erro ao conectar com o banco:", err);
        return;
    }
    console.log("Conectado ao banco com sucesso\n");
});



//post dados
app.post("/register", (req, res) => {
    console.log("body recebido:", req.body);

    const {nome, idade
    } = req.body;

    db.beginTransaction((err) =>{
        if(err){
            console.log("Erro ao iniciar transação\n")
        }
    })

    let sqlPessoa = "INSERT INTO Pessoa(nome, idade) VALUES (?, ?)";
    db.query(sqlPessoa, [nome, idade], (err, result) =>{
        if(err){
            return db.rollback(() =>{
                console.log("Erro ao cadastrar pessoa", err);
                res.status(500).send("Erro ao cadastrar pessoa");
            })
        } else{
            console.log("Pessoa cadastrada com sucesso")
        }

        db.commit((err) =>{
            if(err){
                return db.rollback(() =>{
                    console.log("Erro ao finalizar a transação:", err);
                    res.status(500).send("Erro ao finalizar transação");
                })
            }
            console.log("registro feito com sucesso\n");
            res.status(200).send("Registro feito com sucesso");
        })
    })
})



const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>{
    console.log("servidor rodando, porta 5000", PORT);
});