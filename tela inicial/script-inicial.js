function tratarSucessoAdUsuario(resposta){
    const statusCode = resposta.status
    if (statusCode === 200){
        localStorage.setItem("nome",nome)
        // Adicionar tela de carregando aqui
        window.location.href = "../index.html"
    }
}

function tratarErroAdUsuario(erro){
    const statusCode = erro.response.status;
    if (statusCode === 400){
        alert("Nome de usuário em uso. Informe outro!")
    }
}

let objNome
let nome

function entrarSala(){
    nome = document.querySelector("input").value

    objNome = {
        name: nome
    }

    let promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", objNome)

    promise.catch(tratarErroAdUsuario)
    promise.then(tratarSucessoAdUsuario)

    document.querySelector("input").value = ""
}