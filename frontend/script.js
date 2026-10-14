/*
=====================================
  FRONT-END — consome nossa API local
=====================================

Este arquivo roda no navegador.
Ele faz requisições para nossa API Node.js
e mostra os dados na tela.
*/

//=======================
//ELEMENTOS DO HTML
//=======================
//foto do moto
const motoImage = document.getElementById("motoImage");
//nome raça
const breedName = document.getElementById("breedName");
//moto aleatório
const randomBtn = document.getElementById("randomBtn");
//botão que busca moto por raça
const searchBtn = document.getElementById("searchBtn");
//campo de texto onde o usuário digita a raça
const breedInput = document.getElementById("breedInput");
//area onde fica a imagem do moto
//usamos querySelector porque é uma classe(.moto-area)
const motoArea = document.querySelector(".moto-area");

//==============================
// URL DA API
//==============================

const API = "http://localhost:3000/api/motos";

//==============================
// FUNÇÃO PRINCIPAL
//==============================

async function buscarMoto(url){
  // adiciona a classe "loading"
  // normalmente usada para mostrar animação de carregamento
  motoArea.classList.add("loading");

  try {
    //faz requisição HTTP para a API
    const response = await fetch(url);
    // converte a resposta para JSON
    const data = await response.json();
    //mostra no console a resposta da API
    console.log("Resposta da API:", data)

    //Vamos verificar se a API retornou erro
    if (data.status === "error"){
      //mostra a mensagem de erro na tela
      //breedName - Elemento HTML
      //.textContent - Propriedade que define o texto do elemento
      //data - Objeto com os dados recebidos da API
      //.message - Propriedade que contém a mensagem ou URL
      breedName.textContent = data.message;
      //remove a imagem
      motoImage.src = "";
      //execução da função
      return;
    }

    //coloca a imagem do moto na tela 
    // o src define qual imagem será exibida
    motoImage.src = data.message;

    // extrai o nome da raça da URL da imagem
    // exemplo da URL:
    // http://localhost:3000/fotos/husky/1.jpg

    //separa a URL em partes usando "/"
    const partes = data.message.split("/")

    //pega a posição 5 do array
    // que corresponde ao nome da raça
    const moto = partes[5]

    //coloca a primeira letra maiúscula
    // ex: husky --> Husky
    breedName.textContent = 
      //moto.charAt(0) - pega a primeira letra
      //.toUpperCase() - Transforma em maiúscula
      //moto.slice(1) - pega o texto a partir da segunda letra
      moto.charAt(0).toUpperCase() + moto.slice(1);

  } catch (erro){
    //caso o servidor esteja desligado
    //ou aconteça algum erro na requisição

    console.error(erro);
    
    //mostra mensagem na tela
    breedName.textContent = 
      "📴 servidor offline - rode: node server.js"
    
    //remove a imagem
    motoImage.src = "";
  } finally {
    //remove a classe de carregamento
    //independentemente de erro ou sucesso.
    motoArea.classList.remove("loading")
  }
}

// ==============================
// AÇÕES
// ==============================

//função que busca o moto aleatório
function motoAleatorio(){
  //chamar a função principal
  //passando a rota /aleatorio da API
  buscarMoto(`${API}/aleatorio`);
}

//função que busca moto por raça
function buscarPorModelo(){
  //pegar o texto digitado input
  //Trim ele remove os espaços em branco {trim()} do inicio e do fim do texto.
  const moto = breedInput.value.trim().toLowerCase();

  //verificar se o usuário digitou algo
  if (!moto) {
    // se não digitou, mostra alerta
    alert ("Digite um modelo!")
    // interrompe a função
    return;
  }

  //chamar a API passando a moto na URL
  //exemplo: /api/motos/husky
  buscarMoto(`${API}/${moto}`)
}

// ====================================
// EVENTOS
// ====================================

// quando clicar no botão "aleatório"
randomBtn.addEventListener("click", motoAleatorio);

// quando clicar no botão "buscar"
searchBtn.addEventListener("click", buscarPorModelo);

//quando clicar na imagem do moto
//carrega outro moto aleatório
motoImage.addEventListener("click", motoAleatorio);

//quando o usuário apertar o ENTER no input
breedInput.addEventListener("keypress", (event) =>{
  //verifica se a tecla pressionada foi enter
  if (event.key === "Enter"){
    //executa a busca por raça
    buscarPorModelo();
  }
})

//CARREGA AO ABRIR A PÁGINA

motoAleatorio();