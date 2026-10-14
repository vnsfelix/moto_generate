//==========================
// NOSSA API DE MOTOS
//==========================
//
// Agora as fotos NÃO são mais baixadas automaticamente!.
// Elas DEVEM existir manualmente na pasta
// data/fotos
//==========================

// ROTAS:
// GET /api/motos/aleatorio
// GET /api/motos/:modelo

// Importar o framework Express para criar o servidor
const express = require("express");
// Importar o CORS para permitir requisições de outros dominios (ex: frontend)
const cors = require("cors");
// Importa o módulo de arquivos do NODE
const fs = require("fs");
// Importa utilidades para trabalhar com caminhos de arquivos
const path = require("path");
// Importa o arquivo JSON que contém as modelos e fotos
const motos = require("./data/motos.json");
// cria a aplicação Express
const app = express();
// definir a porta onde o servidor irá rodar
const PORT = 3000;
// Habilitar o uso do CORS na aplicacao
app.use(cors());

//=================================================
// SERVIR ARQUIVOS ESTÁTICOS
//=================================================

// Nós falamos para o express
// "Tudo o que estiver na pasta data/fotos pode ser acessado pela URL /fotos"
// Exemplo:
// http://localhost:3000/fotos/husky/1.jpg

app.use(
  "/fotos",
  express.static(
    path.join(__dirname, "data/fotos"), //caminho real da pasta do servidor
  ),
);

//=================================================
// FUNÇÃO AUXILIAR
//=================================================

// função que recebe um array e retorna um item aleatório dele
function sortear(array) {
  // gera um numero aleatório entre 0 e o tamanho do array
  // array.length - conta quantos itens existem na lista
  // math.random() - Sorteia um número decimal entre 0 e 1
  // math.random() - array.length - Multiplica o número sorteado pela quantidade de itens
  // math.floor() - tira a parte decimal, arredondando para baixo.
  const i = Math.floor(Math.random() * array.length);
  // const i = guarda a posição na variavel i
  // retorna o item sorteado
  return array[i];
}

//================================
// ROTAS DA API
//================================

// ROTA 1 - Motos aleatório
app.get("/api/motos/aleatorio", (req, res) => {
  // req - request(requisição) = é o pedido que chega ao servidor, por exemplo, o navegador pede uma foto de Moto
  // res - response(resposta) = é o que o servidor envia de volta, por exemplo, o endereço da foto do moto

  // pegar todas as fotos de todas as modelos
  // object.values pega os valores do objeto
  // flat transforma tudo em um único array
  const todasAsFotos = Object.values(motos).flat();

  //sorteia uma foto aleatória
  const item = sortear(todasAsFotos);

  //responder para o cliente em formato JSON
  res.json({
    //status da resposta
    status: "success",
    //URL da imagem que foi sorteada
    message: `http://localhost:${PORT}/fotos/${item}`,
  });
});

// ROTA 2 - Moto por raça
// exemplo de acesso:
// http://localhost:3000/api/motos/africa

app.get("/api/motos/:modelo", (req, res) => {
  //pega o parametro da URL (ex: husky)
  const modelo = req.params.modelo.toLocaleLowerCase();
  //params = contém os parâmetros definidos na URL da rota
  //.modelo = acessa o parâmetro chamado modelo.
  //.toLowerCase() = Transforma todas as letras em minúsculas
  if (!motos[modelo]) {
    //motos[modelo]: procurar a raça dentro do objeto *motos*
    //!: significa não: Nesse caso, verifica se a raça não existe ou se seu valor é falso
    //se não existir, retorna erro 404
    res.status(404).json({
      status: "error",
      message: `Raça "${modelo}" não encontrada`,
    });

    //encerra a execução da rota
    return;
  }

  //sorteia uma foto da modelo solicitada
  const item = sortear(motos[modelo]);

  // retorna a resposta em JSON
  res.json({
    status: "success",
    message: `http://localhost:${PORT}/fotos/${item}`,
  });
});

//======================================
// INICIA O SERVIDOR
//=====================================

//inicia o servidor express
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📂 Coloque as fotos manualmente em: data/fotos/`);
});