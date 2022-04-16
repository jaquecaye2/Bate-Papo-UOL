function tratarSucessoAdUsuario(resposta){
    const statusCode = resposta.status
    console.log(statusCode)
}

function tratarErroAdUsuario(erro){
    const statusCode = erro.response.status;
    if (statusCode === 400){
        entrarSala()
    }
}

let objNome

function entrarSala(){
    let nome = prompt("Qual seu nome?")

    objNome = {
        name: nome
    }

    let promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", objNome)

    promise.catch(tratarErroAdUsuario)
    promise.then(tratarSucessoAdUsuario)
}

function manterConexao(){
    let promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", objNome)

    promise.then(function (resposta){
        const statusCode = resposta.status
        console.log(statusCode)
    })
    promise.catch(function (erro){
        const statusCode = erro.response.status;
        console.log(statusCode)
    })
}

let mensagens = []

function buscarMensagens() {
    let promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages")
    console.log(promise)
    promise.then(function (resposta){
        mensagens = resposta.data
        exibirMensagens()
    })
}

function exibirMensagens(){
    let ulMensagens = document.querySelector(".container-mensagens")
    ulMensagens.innerHTML = ""
    for(let i = 0; i < mensagens.length; i++){
        if (mensagens[i].type === "status"){
            ulMensagens.innerHTML += `  
            <div class="mensagem mensagem-entrada-saida">
                <p class="hora">(${mensagens[i].time})</p>
                <p><strong>${mensagens[i].from}</strong> ${mensagens[i].text}</p>
            </div>
            `
        } else if (mensagens[i].type === "private_message" && mensagens[i].to === objNome.name) {
            ulMensagens.innerHTML += `  
            <div class="mensagem mensagem-reservada">
                <p class="hora">(${mensagens[i].time})</p>
                <p><strong>${mensagens[i].from}</strong> para <strong>${mensagens[i].to}</strong>: ${mensagens[i].text}</p>
            </div>
            `
        } else {
            ulMensagens.innerHTML += `  
            <div class="mensagem">
                <p class="hora">(${mensagens[i].time})</p>
                <p><strong>${mensagens[i].from}</strong> para <strong>${mensagens[i].to}</strong>: ${mensagens[i].text}</p>
            </div>
            `
        }
    }
    ulMensagens.scrollIntoView(false)
}

entrarSala()

setInterval(manterConexao, 4500)

setInterval(buscarMensagens, 3000)



