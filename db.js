const dns = require("node:dns");
const mongoose = require("mongoose");

require("dotenv").config();

dns.setServers(["1.1.1.1"]);
mongoose.set("strictQuery", true);

async function main() {
  await mongoose.connect(
    `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@cluster0.eqqkhen.mongodb.net/?appName=Cluster0`
  );

  console.log("Conectado com sucesso!");
}

main().catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

module.exports = main;