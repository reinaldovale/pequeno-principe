const questoes = [{
  pergunta: 'Qual é o tema do jogo?',
  alternativas: '(A) pequeno principe; (B) pequeno príncipe preto; (C) pinóquio',
  resposta: 'A',
  pontos: 1
}, {
  pergunta: 'O que o pequeno príncipe # usou para voar?',
  alternativas: '(A) borboleta; (B) nave espacial; (C) pássaro',
  resposta: 'C',
  pontos: 1
},
{
  pergunta: 'O que o pequeno príncipe pediu # por aviador para desenhar?',
  alternativas: '(A) bode; (B) carneiro; (C) vaca',
  resposta: 'B',
  pontos: 5
},
{
  pergunta: 'Onde o aviador conhece # pequeno príncipe?',
  alternativas: '(A) no deserto; (B) em uma ilha; (C) na floresta',
  resposta: 'A',
  pontos: 10
},
{
  pergunta: 'O 7° planeta que o pequeno # príncipe visitou... Foi?',
  alternativas: '(A) empresário; (B) terra; (C) rei',
  resposta: 'B',
  pontos: 6
},
{
  pergunta: 'Quem escreveu o livro: # O pequeno príncipe?',
  alternativas: '(A) Rodrigo França; (B) Cecília Meireles; (C) Antoine de Saint-Exupéry',
  resposta: 'C',
  pontos: 20
},
{
  pergunta: 'De quem era o primeiro planeta # que o pequeno príncipe visitou?',
  alternativas: '(A) Empresário; (B) acendedor de lampiões; (C) nenhuma tá correto',
  resposta: 'C',
  pontos: 6
},
{
  pergunta: 'Em que lugar do espaço # o pequeno príncipe mora?',
  alternativas: '(A) no sol; (B) asteroide; (C) em um planeta',
  resposta: 'B',
  pontos: 7
},
{
  pergunta: 'O Aviador tentou # consertar o motor?',
  alternativas: '(A) sim; (B) não; (C) nenhuma tá correto',
  resposta: 'A',
  pontos: 20
},
{
  pergunta: 'A Rosa foi egoísta # com Pequeno Príncipe?',
  alternativas: '(A) não; (B) sim; (C) nenhuma tá correto',
  resposta: 'B',
  pontos: 10
}]

const canvas = document.querySelector('canvas')
const contexto = canvas.getContext('2d')

const globais = {}
let telaAtiva = {}
let frames = 0

const somGrito = new Audio()
somGrito.src = './efeitos/grito.wav'

const somAsas = new Audio()
somAsas.src = './efeitos/pulo.wav'

const somPonto = new Audio()
somPonto.src = './efeitos/ponto.wav'

const somErro = new Audio()
somErro.src = './efeitos/erro.wav'

const somEspaco = new Audio()
somEspaco.src = './efeitos/spaco.wav'
somEspaco.loop = true

const sprites = new Image()
sprites.src = './midia/sprites.png'

const criaVideoFinalizacao = (fonte = './midia/finalizacao.mp4') => {
  const video = document.createElement("video");
  video.src = fonte
  video.autoplay = true
  video.loop = true
  video.muted = false
  // video.addEventListener('ended', evento => mudaParaTela(Telas.JOGO))
  const parar = () => {
    video.pause()
    video.currentTime = 100
    somEspaco.play()
  }
  const iniciar = () => {
    somEspaco.pause()
    video.play()
  }

  return {
    iniciar,
    parar,
    video
  }
}

const criaIntroducao = (fonte = './midia/introducao.mp4') => {
  const somEspaco = new Audio()
  somEspaco.src = './efeitos/spaco.wav'
  somEspaco.loop = true

  const video = document.createElement("video");
  video.src = fonte
  video.autoplay = true
  video.loop = false
  video.muted = false
  video.addEventListener('ended', evento => mudaParaTela(Telas.JOGO))
  const parar = () => {
    video.pause()
    video.currentTime = 100
    somEspaco.play()
  }
  const iniciar = () => {
    somEspaco.pause()
    video.play()
  }

  return {
    iniciar,
    parar,
    video
  }
}

const videoIntroducao = criaIntroducao()
const videoFinalizacao = criaVideoFinalizacao()

const criaAbertura = (contexto, videoIntroducao) => {
  let iniciado = false
  const titulo = {
    spriteX: 0,
    spriteY: 0,
    largura: 320,
    altura: 70,
    x: 0,
    y: 10
  }

  const daniel = {
    spriteX: 0,
    spriteY: 80,
    largura: 320,
    altura: 154,
    x: 0,
    y: 127
  }

  const pequenoPrincipe = {
    spriteX: 0,
    spriteY: 245,
    largura: 320,
    altura: 232,
    x: 0,
    y: 480 - 232
  }

  const click = () => {
    videoIntroducao.iniciar()
    if (iniciado) {
      videoIntroducao.parar()
    }
    iniciado = true
  }

  const desenha = () => {
    contexto.font = 'normal bold 20px serif'
    contexto.fillStyle = "blue"

    if (!iniciado) {
      contexto.drawImage(sprites, titulo.spriteX, titulo.spriteY, titulo.largura, titulo.altura, titulo.x, titulo.y, titulo.largura, titulo.altura)
      contexto.drawImage(sprites, pequenoPrincipe.spriteX, pequenoPrincipe.spriteY, pequenoPrincipe.largura, pequenoPrincipe.altura, pequenoPrincipe.x, pequenoPrincipe.y, pequenoPrincipe.largura, pequenoPrincipe.altura)
      contexto.drawImage(sprites, daniel.spriteX, daniel.spriteY, daniel.largura, daniel.altura, daniel.x, daniel.y, daniel.largura, daniel.altura)
      contexto.fillText('Para Começar, clique na Tela', 10, 470)
    }
    else {
      contexto.drawImage(videoIntroducao.video, 0, 0)
      contexto.fillText('Introdução', 105, 30)
      contexto.fillText('Clique para pular', 150, 470)
    }
  }
  return {
    click,
    desenha
  }
}

const criaFinalizacao = (contexto, videoFinalizacao) => {

  const click = () => {
    planoDeFundo.recorde = 0
    videoFinalizacao.parar()
    mudaParaTela(Telas.INICIO)
  }

  const desenha = () => {
    contexto.font = 'normal bold 20px serif'
    contexto.fillStyle = "red"
    contexto.drawImage(videoFinalizacao.video, 0, 0)
    contexto.fillText('Para Reiniciar, clique na Tela', 10, 470)

    planoDeFundo.desenhaPontos(contexto)
  }
  return {
    click,
    desenha
  }
}

const planoDeFundo = {
  spriteX: 390,
  spriteY: 0,
  largura: 320,
  altura: 480,
  x: 0,
  y: 0,
  recorde: 0,
  atualiza() {
    const movimentoDoFundo = 0.2
    const repeteEm = planoDeFundo.largura
    const movimentacao = planoDeFundo.x - movimentoDoFundo

    planoDeFundo.x = movimentacao % repeteEm
  },
  desenha() {
    contexto.fillStyle = '#000407'
    contexto.fillRect(0, 0, canvas.width, canvas.height)

    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      planoDeFundo.x, planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    )

    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    )

    if (planoDeFundo.recorde > 0) {
      planoDeFundo.desenhaPontos(contexto)
    }
  },
  desenhaPontos(contexto) {
    contexto.font = 'normal normal 20px serif'
    contexto.fillStyle = "white"
    contexto.fillText("Pontos: ", 200, 20)
    contexto.font = 'normal bold 30px serif'
    contexto.fillStyle = "red"
    contexto.fillText(planoDeFundo.recorde.toString().padStart(3, '0'), 270, 25)
  }
}

function criaSol() {
  const sol = {
    spriteX: 0,
    spriteY: 758,
    largura: 320,
    altura: 120,
    x: 0,
    y: canvas.height - 120,
    atualiza() {
    },
    movimentos: [
      { spriteX: 0, spriteY: 758, },
      { spriteX: 320, spriteY: 758, },
      { spriteX: 640, spriteY: 758, },
      { spriteX: 960, spriteY: 758, },
      { spriteX: 1280, spriteY: 758, },
      { spriteX: 0, spriteY: 878, },
      { spriteX: 320, spriteY: 878, },
      { spriteX: 640, spriteY: 878, },
      { spriteX: 960, spriteY: 878, },
      { spriteX: 1280, spriteY: 878, },
      { spriteX: 0, spriteY: 998, },
      { spriteX: 320, spriteY: 998, },
      { spriteX: 640, spriteY: 998, },
      { spriteX: 960, spriteY: 998, },
      { spriteX: 1280, spriteY: 998, },
    ],
    frameAtual: 0,
    atualizaOFrameAtual() {
      const intervaloDeFrames = 20
      const passouOIntervalo = frames % intervaloDeFrames === 0

      if (passouOIntervalo) {
        const baseDoIncremento = 1
        const incremento = baseDoIncremento + sol.frameAtual
        const baseRepeticao = sol.movimentos.length
        sol.frameAtual = incremento % baseRepeticao
      }
    },
    desenha() {
      sol.atualizaOFrameAtual()
      const { spriteX, spriteY } = sol.movimentos[sol.frameAtual]

      contexto.drawImage(
        sprites,
        spriteX, spriteY,
        sol.largura, sol.altura,
        sol.x, sol.y,
        sol.largura, sol.altura,
      )
    }
  }
  return sol
}

function criaPergunta() {
  const principeSentado = {
    spriteX: 0,
    spriteY: 482,
    largura: 320,
    altura: 155,
    x: 0,
    y: 480 - 155,
  }
  const daniel = {
    spriteX: 0,
    spriteY: 80,
    largura: 320,
    altura: 154,
    x: 0,
    y: 0
  }
  const pergunta = {
    spriteX: 1194,
    spriteY: 385,
    largura: 320,
    altura: 284,
    x: 0,
    y: 120,
    botaoA: document.querySelector('#botaoA'),
    botaoB: document.querySelector('#botaoB'),
    botaoC: document.querySelector('#botaoC'),
    questao: {},
    exibirBotoes() {
      pergunta.botaoA.style.display = 'block'
      pergunta.botaoB.style.display = 'block'
      pergunta.botaoC.style.display = 'block'
    },
    esconderBotoes() {
      pergunta.botaoA.style.display = 'none'
      pergunta.botaoB.style.display = 'none'
      pergunta.botaoC.style.display = 'none'
    },
    click({ target: { tagName, value } } = { target: '', value: '' }) {
      if (!/BUTTON/.test(tagName)) {
        return
      }

      if (value === pergunta.questao.resposta) {
        console.log("Você ganhou 10 pontos!");
        somPonto.play()
        planoDeFundo.recorde += pergunta.questao.pontos;
      }
      else {
        planoDeFundo.recorde = planoDeFundo.recorde > 2
          ? planoDeFundo.recorde - 3
          : 0
        somErro.play()
      }

      pergunta.questao = {}
      globais.principe.y = -globais.principe.altura / 2
      pergunta.esconderBotoes()
      mudaParaTela(Telas.JOGO)
    },
    atualiza() {
    },
    desenha() {
      contexto.drawImage(sprites, pergunta.spriteX, pergunta.spriteY, pergunta.largura, pergunta.altura, pergunta.x, pergunta.y, pergunta.largura, pergunta.altura)
      contexto.drawImage(sprites, daniel.spriteX, daniel.spriteY, daniel.largura, daniel.altura, daniel.x, daniel.y, daniel.largura, daniel.altura)


      contexto.drawImage(
        sprites,
        principeSentado.spriteX, principeSentado.spriteY,
        principeSentado.largura, principeSentado.altura,
        principeSentado.x, principeSentado.y,
        principeSentado.largura, principeSentado.altura,
      )

      if (Object.keys(pergunta.questao).length === 0) {
        pergunta.questao = questoes[Math.floor(Math.random() * questoes.length)]
      }

      // contexto.textAlign = "center"
      contexto.fillStyle = "black"
      contexto.font = 'normal bold 18px serif'
      const [parte1, parte2=''] = pergunta.questao.pergunta.split("# ")
      contexto.fillText(parte1, 40, 180)
      contexto.fillText(parte2, 45, 195)

      contexto.font = '14px serif'
      const [altA, altB, altC] = pergunta.questao.alternativas.split("; ")
      contexto.fillText(altA, 40, 230)
      contexto.fillText(altB, 40, 250)
      contexto.fillText(altC, 40, 270)

      contexto.fillStyle = "red"
      contexto.fillText('*Vale: ' + pergunta.questao.pontos + ' pontos', 5, 310)

      pergunta.exibirBotoes()

    }
  }
  return pergunta
}

function criaPlanetario() {
  const planetario = {
    spriteX: 1159,
    spriteY: 0,
    largura: 117,
    altura: 117,
    planetas: [],
    desenha() {
      planetario.atualizaOFrameAtual()
      const { spriteX, spriteY } = planetario.movimentos[planetario.frameAtual]

      planetario.planetas.forEach(function (planeta) {
        const yRandom = planeta.y
        const planetaX = planeta.x
        const planetaY = yRandom

        contexto.drawImage(
          sprites,
          spriteX, spriteY,
          planetario.largura, planetario.altura,
          planetaX, planetaY,
          planetario.largura, planetario.altura,
        )

        planeta.x = planetaX
        planeta.y = planetaY
        // planeta.y = planetario.altura + planetaY

      })

    },
    temColisaoComOPrincipe(planeta) {
      const peDoPrincipe = globais.principe.y + globais.principe.altura

      if (globais.principe.x === planeta.x
        && peDoPrincipe > planeta.y
        && peDoPrincipe < planeta.y + planetario.altura) {
        return true
      }
      return false
    },
    estaOPrincipeEmCondicoesDeEntrarNo(planeta) {
      const peDoPrincipe = globais.principe.y + globais.principe.altura

      if (globais.principe.x > planeta.x
        && globais.principe.x < planeta.x + (planetario.largura / 2)
        && peDoPrincipe < planeta.y
        && (planeta.y - peDoPrincipe) < 3) {
        return true
      }
      return false
    },
    atualiza() {
      const passou200Frames = frames % 200 === 0
      if (passou200Frames) {
        // console.log('Passou 200 frames')
        planetario.planetas.push({
          x: canvas.width,
          y: Math.floor(Math.random() * 350),
        })
      }

      planetario.planetas.forEach(function (planeta) {
        planeta.x = planeta.x - 1

        if (planetario.estaOPrincipeEmCondicoesDeEntrarNo(planeta)) {
          console.log('Principe entrou no planeta')
          mudaParaTela(Telas.PERGUNTA)
        }

        if (planetario.temColisaoComOPrincipe(planeta)) {
          console.log('Você perdeu!')
          somGrito.play()
          mudaParaTela(Telas.FIM)
        }

        if (planeta.x + planetario.largura <= 0) {
          planetario.planetas.shift()
        }
      })

    },
    movimentos: [
      { spriteX: 1159, spriteY: 0, },
      { spriteX: 1276, spriteY: 0, },
      { spriteX: 1393, spriteY: 0, },
      { spriteX: 1510, spriteY: 0, },
      { spriteX: 1627, spriteY: 0, },
      { spriteX: 1159, spriteY: 117, },
      { spriteX: 1276, spriteY: 117, },
      { spriteX: 1393, spriteY: 117, },
      { spriteX: 1510, spriteY: 117, },
      { spriteX: 1627, spriteY: 117, },
      { spriteX: 1159, spriteY: 234, },
      { spriteX: 1276, spriteY: 234, },
      { spriteX: 1393, spriteY: 234, },
      { spriteX: 1510, spriteY: 234, },
      { spriteX: 1627, spriteY: 234, },

    ],
    frameAtual: 0,
    atualizaOFrameAtual() {
      const intervaloDeFrames = 5
      const passouOIntervalo = frames % intervaloDeFrames === 0

      if (passouOIntervalo) {
        const baseDoIncremento = 1
        const incremento = baseDoIncremento + planetario.frameAtual
        const baseRepeticao = planetario.movimentos.length
        planetario.frameAtual = incremento % baseRepeticao
      }
    },
  }
  return planetario
}

function criaPrincipe() {
  const principe = {
    spriteX: 735,
    spriteY: 0,
    largura: 83,
    altura: 191,
    x: 10,
    y: 10,
    pulo: 4.6,
    pula() {
      principe.velocidade = - principe.pulo
      somAsas.play()
    },
    gravidade: 0.25,
    velocidade: 0,
    momentoColisao: 0,
    espera: 1000, //1 segundo
    atualiza(timestamp) {
      if (principe.fazColisao(globais.sol)) {
        console.log('Fez colisao')
        somGrito.play()
        let { momentoColisao, espera } = principe
        if (momentoColisao === 0) {
          principe.momentoColisao = momentoColisao = timestamp
        }

        const delta = timestamp - momentoColisao
        if (delta > espera) {
          mudaParaTela(Telas.FIM)
        }
        return
      }

      principe.velocidade = principe.velocidade + principe.gravidade
      principe.y = principe.y + principe.velocidade
    },
    movimentos: [
      { spriteX: 735, spriteY: 0, },
      { spriteX: 818, spriteY: 0, },
      { spriteX: 901, spriteY: 0, },
      { spriteX: 984, spriteY: 0, },
      { spriteX: 1067, spriteY: 0, },
      { spriteX: 735, spriteY: 191, },
      { spriteX: 818, spriteY: 191, },
      { spriteX: 901, spriteY: 191, },
      { spriteX: 984, spriteY: 191, },
      { spriteX: 1067, spriteY: 191, },
      { spriteX: 735, spriteY: 382, },
      { spriteX: 818, spriteY: 382, },
      { spriteX: 901, spriteY: 382, },
      { spriteX: 984, spriteY: 382, },
      { spriteX: 1067, spriteY: 382, },
    ],
    frameAtual: 0,
    atualizaOFrameAtual() {
      const intervaloDeFrames = 10
      const passouOIntervalo = frames % intervaloDeFrames === 0

      if (passouOIntervalo) {
        const baseDoIncremento = 1
        const incremento = baseDoIncremento + principe.frameAtual
        const baseRepeticao = principe.movimentos.length
        principe.frameAtual = incremento % baseRepeticao
      }
    },
    fazColisao(sol) {
      const principeY = principe.y + principe.altura
      const solY = sol.y
      const coroaSolar = 100

      if (principeY >= solY + coroaSolar) {
        return true
      }

      return false
    },
    desenha() {
      principe.atualizaOFrameAtual()
      const { spriteX, spriteY } = principe.movimentos[principe.frameAtual]

      contexto.drawImage(
        sprites,
        spriteX, spriteY,
        principe.largura, principe.altura, // Tamanho do recorte na sprite
        principe.x, principe.y,
        principe.largura, principe.altura,
      )
    }
  }
  return principe
}

function mudaParaTela(novaTela) {
  telaAtiva = novaTela

  if (telaAtiva.inicializa) {
    telaAtiva.inicializa()
  }
}

const Telas = {
  INICIO: {
    inicializa() {
      globais.sol = criaSol()
      globais.principe = criaPrincipe()
      globais.planetario = criaPlanetario()
      globais.pergunta = criaPergunta()
      globais.abertura = criaAbertura(contexto, videoIntroducao)
    },
    desenha() {
      planoDeFundo.desenha()
      globais.abertura.desenha()
    },
    click() {
      globais.abertura.click()
    },
    atualiza() {
      planoDeFundo.atualiza()
    }
  }
}

Telas.FIM = {
  inicializa() {
    globais.sol = criaSol()
    globais.principe = criaPrincipe()
    globais.finalizacao = criaFinalizacao(contexto, videoFinalizacao)
    videoFinalizacao.iniciar()
  },
  desenha() {
    planoDeFundo.desenha()
    globais.finalizacao.desenha()
  },
  click() {
    globais.finalizacao.click()
  },
  atualiza() {
    planoDeFundo.atualiza()
  }
}

Telas.PERGUNTA = {
  desenha() {
    planoDeFundo.desenha()
    // globais.sol.desenha()
    // globais.planetario.desenha()
    // globais.principe.desenha()
    globais.pergunta.desenha()
  },
  click(evento) {
    globais.pergunta.click(evento)
  },
  atualiza() {
    globais.pergunta.atualiza()
  }
}

Telas.JOGO = {
  desenha() {
    planoDeFundo.desenha()
    globais.sol.desenha()
    globais.planetario.desenha()
    globais.principe.desenha()
  },
  click() {
    globais.principe.pula()
  },
  atualiza(tempoAtual) {
    planoDeFundo.atualiza()
    globais.sol.atualiza()
    globais.planetario.atualiza()
    globais.principe.atualiza(tempoAtual)
  }
}

function loop(timestamp) {
  telaAtiva.desenha(timestamp)
  telaAtiva.atualiza(timestamp)

  frames = frames + 1
  requestAnimationFrame(loop)
}

const reageACliques = evento => {
  if (telaAtiva.click) {
    telaAtiva.click(evento)
  }
};
const reageATeclaEspacoOuSetaParaCima = (evento) => {
  const espacoPressionado = evento.code === 'Space';
  const setaParaCimaPressionada = evento.code === 'ArrowUp';
  const pula = espacoPressionado || setaParaCimaPressionada;
  if (pula) {
    evento.preventDefault();
    evento.stopPropagation();
    telaAtiva.click();
  }
}

const iniciar = () => {
  window.addEventListener('click', reageACliques);
  window.addEventListener('keydown', reageATeclaEspacoOuSetaParaCima);
  mudaParaTela(Telas.INICIO)
  loop()
}

window.PequenoPrincipe = iniciar
