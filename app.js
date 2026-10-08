const express = require("express")
const path = require("node:path")
const app = express()

require("dotenv").config()
require("./db")

const port = process.env.PORT || 3000;

const pictureRouter = require("./routes/picture")

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "upload-teste.html")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/pictures", pictureRouter);  

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
})
