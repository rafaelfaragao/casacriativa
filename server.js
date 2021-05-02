//usei o express para criar e configurar meu servidor
const express = require("express")
const server = express()

const db = require("./db")

//configurar arquivos estaticos - CSS, Imagens, scripts

server.use(express.static("public"))

//habilitar uso do req.body

server.use(express.urlencoded({ extended: true }))

//configuração do nunjucks
const nunjucks = require("nunjucks")
nunjucks.configure("views", {
    express: server,
    noCache: true, //boolean
})

//criei uma rota /
// e capturo o pedido do cliente para responder
server.get("/", function (req, res) {

    db.all('SELECT * FROM ideas', function (err, rows) {
        if (err) return console.log(err)

        const reservedIdeas = [...rows].reverse()
        let lastIdeas = []
        for (let idea of reservedIdeas) {
            if (lastIdeas.length < 3) {
                lastIdeas.push(idea)
            }
        }

        return res.render("index.html", { ideas: lastIdeas })
    })


})

server.get("/Ideias", function (req, res) {

    db.all('SELECT * FROM ideas', function (err, rows) {

        if (err) {
            console.log(err)
            return res.send("Erro no banco de dados!")
        }

        const reservedIdeas = [...rows].reverse()
        return res.render("ideias.html", { ideas: reservedIdeas })
    })
})

server.post("/", function (req, res) {
    //Inserir dados na tabela
    const query = `
    INSERT INTO ideas(
        image,
        title,
        category,
        description,
        link
    ) VALUES (?,?,?,?,?);
    `
    const values = [
        req.body.image,
        req.body.title,
        req.body.category,
        req.body.description,
        req.body.link
    ]
    db.run(query, values, function (err) {

        if (err) {
            console.log(err)
            return res.send("Erro no banco de dados!")
        }

        return res.redirect("/Ideias")
    })
})

server.post("/delete/:id", (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM ideas WHERE id = ?', id, function(err, rows){
        if (err) return console.log(err)

        res.redirect("/Ideias");
    })
})

//liguei meu servidor na porta 3000
server.listen(3000, ()=> {
    console.log("Server is running, port 3000")
})


