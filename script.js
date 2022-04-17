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
let nome

function entrarSala(){
    nome = prompt("Qual seu nome?")

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

function menuLateralAparecer(){
    document.querySelector(".menu-lateral").classList.remove("escondido")
}

function menuLateralDesaparecer(){
    document.querySelector(".menu-lateral").classList.add("escondido")
}

let contatoSelecionado
let nomeContatoSelecionado

function contatoSelelecionado(elemento){
    contatoSelecionado = document.querySelector(".contato-selecionado")

    if (contatoSelecionado !== null){
        contatoSelecionado.classList.remove('contato-selecionado')
    }
    elemento.querySelector(".checkmark").classList.add("contato-selecionado")

    nomeContatoSelecionado = elemento.querySelector("p").innerHTML

    if (nomeContatoSelecionado !== "Todos"){
        document.querySelector(".visibilidade-selecionada").classList.remove("visibilidade-selecionada")
        document.querySelector(".reservado .checkmark").classList.add("visibilidade-selecionada")

        document.querySelector("footer input").placeholder = `Escreva aqui... \n Enviando para ${nomeContatoSelecionado} (reservadamente)`
    }
    if (nomeContatoSelecionado === "Todos"){
        document.querySelector(".visibilidade-selecionada").classList.remove("visibilidade-selecionada")
        document.querySelector(".publico .checkmark").classList.add("visibilidade-selecionada")

        document.querySelector("footer input").placeholder = "Escreva aqui..."
    }
}

let participantes = []

function atualizarParticipantes(){
    let ulParticipantes = document.querySelector(".contatos")

    ulParticipantes.innerHTML = ""

    ulParticipantes.innerHTML = `
        <div class="contato" onclick="contatoSelelecionado(this)">
            <div>
                <ion-icon name="people" class="icone-contato"></ion-icon>
                <p>Todos</p>
            </div>
            <ion-icon name="checkmark" class="checkmark contato-selecionado"></ion-icon>
        </div>`

    for (let i = 0; i < participantes.length; i++){
        if (participantes[i].name !== nome){
            ulParticipantes.innerHTML += `
            <div class="contato" onclick="contatoSelelecionado(this)">
                <div>
                    <ion-icon name="person-circle" class="icone-contato"></ion-icon>
                    <p>${participantes[i].name}</p>
                </div>
                <ion-icon name="checkmark" class="checkmark"></ion-icon>
            </div>`
        }
    }
}

function listaParticipantes(){
    let promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants")

    promise.then(function (response){
        participantes = response.data
        atualizarParticipantes()
    })

    document.querySelector(".visibilidade-selecionada").classList.remove("visibilidade-selecionada")
    document.querySelector(".publico .checkmark").classList.add("visibilidade-selecionada")
}

setInterval(listaParticipantes, 10000)

function enviarMensagem(){
    let mensagem = document.querySelector("footer input").value

    let objMensagem

    if (nomeContatoSelecionado === "Todos"){
        objMensagem = {
            from: nome,
            to: "Todos",
            text: mensagem,
            type: "message"
        }
    } else {
        objMensagem = {
            from: nome,
            to: nomeContatoSelecionado,
            text: mensagem,
            type: "private_message"
        }
    }

    let promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", objMensagem)
    promise.then(function (){
        buscarMensagens()
        document.querySelector("footer input").value = ""
    })
    promise.catch(function (){
        window.location.reload()
    })
}


