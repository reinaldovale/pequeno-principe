import questoes from './questoes.js';

const JOGO = {
  videos: {
    introducao: {},
    finalizacao: {},
  },
  sons: {
    grito: {},
    asas: {},
    pulo: {},
    ponto: {},
    espaco: {},
    erro: {}
  },
  imagens: {},
  canvas: {},
  contexto: {},
  frames: 0
};

JOGO.sons.grito = new Audio()
JOGO.sons.grito.src = './efeitos/grito.wav'

JOGO.sons.asas = new Audio()
JOGO.sons.asas.src = './efeitos/pulo.wav'

JOGO.sons.ponto = new Audio()
JOGO.sons.ponto.src = './efeitos/ponto.wav'

JOGO.sons.erro = new Audio()
JOGO.sons.erro.src = './efeitos/erro.wav'

JOGO.sons.espaco = new Audio()
JOGO.sons.espaco.src = './efeitos/spaco.wav'

JOGO.imagens.sprites = new Image()
JOGO.imagens.sprites.src = './midia/sprites.png'

JOGO.videos.finalizacao = document.createElement("video");
JOGO.videos.finalizacao.src = './midia/finalizacao.mp4'
JOGO.videos.finalizacao.loop = true
JOGO.videos.finalizacao.parar = () => {
  JOGO.videos.finalizacao.pause()
  // JOGO.videos.finalizacao.currentTime = 100
  JOGO.sons.espaco.play()
}
JOGO.videos.finalizacao.iniciar = () => {
  JOGO.sons.espaco.pause()
  JOGO.videos.finalizacao.play()
}

JOGO.videos.introducao = document.createElement("video");
JOGO.videos.introducao.src = './midia/introducao.mp4'
JOGO.videos.introducao.loop = false
JOGO.videos.introducao.parar = () => {
  const iniciado = !JOGO.videos.introducao.paused;
  JOGO.videos.introducao.currentTime = 100.0; // Optional -- can be left out for pause
  // JOGO.videos.introducao.pause();

  // if (iniciado) { // This prevents the browser from trying to load the entire source
  // JOGO.videos.introducao.load();
  // }


  // JOGO.videos.introducao.pause()
  // JOGO.videos.introducao.currentTime = 100
  // JOGO.sons.espaco.play()
}

JOGO.videos.introducao.addEventListener('pause', JOGO.videos.introducao.parar)
JOGO.videos.introducao.iniciar = () => {
  JOGO.sons.espaco.pause()
  JOGO.videos.introducao.play()
}
JOGO.videos.introducao.addEventListener('ended', () => JOGO.mudaParaTela(JOGO.telas.ESPACO))

JOGO.criaAbertura = ({ contexto, imagens: { sprites }, videos: { introducao } }) => {
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
    introducao.iniciar()
    if (iniciado) {
      introducao.pause()
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
      contexto.drawImage(introducao, 0, 0)
      contexto.fillText('Introdução', 105, 30)
      contexto.fillText('Clique para pular', 150, 470)
    }
  }
  return {
    click,
    desenha
  }
}

JOGO.criaFinalizacao = ({ contexto, videos: { finalizacao }, planoDeFundo, telas, mudaParaTela }) => {

  const click = () => {
    planoDeFundo.recorde = 0
    finalizacao.parar()
    mudaParaTela(telas.INICIO)
  }

  const desenha = () => {
    contexto.font = 'normal bold 20px serif'
    contexto.fillStyle = "red"
    contexto.drawImage(finalizacao, 0, 0)
    contexto.fillText('Para Reiniciar, clique na Tela', 10, 470)

    planoDeFundo.desenhaPontos()
  }
  return {
    click,
    desenha
  }
}

JOGO.criaPlanoDeFundo = ({ contexto, imagens: { sprites }, sons: { erro, ponto }, canvas }) => {
  const planoDeFundo = {
    spriteX: 390,
    spriteY: 0,
    largura: 320,
    altura: 480,
    x: 0,
    y: 0,
    recorde: 0
  }
  const atualizaRecorde = (pontuou, pontos) => {
    if (pontuou) {
      console.log(`Você ganhou ${pontos} pontos!`);
      ponto.play()
      planoDeFundo.recorde += pontos
      return
    }

    erro.play()

    if (planoDeFundo.recorde > 2) {
      planoDeFundo.recorde -= 3
      return
    }
    planoDeFundo.recorde = 0
  }
  const desenhaPontos = () => {
    contexto.font = 'normal normal 20px serif'
    contexto.fillStyle = "white"
    contexto.fillText("Pontos: ", 200, 20)
    contexto.font = 'normal bold 30px serif'
    contexto.fillStyle = "red"
    contexto.fillText(planoDeFundo.recorde.toString().padStart(3, '0'), 270, 25)
  }
  const atualiza = () => {
    const movimentoDoFundo = 0.2
    const repeteEm = planoDeFundo.largura
    const movimentacao = planoDeFundo.x - movimentoDoFundo

    planoDeFundo.x = movimentacao % repeteEm
  }
  const desenha = () => {
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
      desenhaPontos()
    }
  }
  return {
    atualiza,
    desenha,
    desenhaPontos,
    atualizaRecorde
  }
}

JOGO.criaSol = ({ contexto, imagens: { sprites }, canvas }) => {
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
    atualizaOFrameAtual(frames) {
      const intervaloDeFrames = 20
      const passouOIntervalo = frames % intervaloDeFrames === 0

      if (passouOIntervalo) {
        const baseDoIncremento = 1
        const incremento = baseDoIncremento + sol.frameAtual
        const baseRepeticao = sol.movimentos.length
        sol.frameAtual = incremento % baseRepeticao
      }
    },
    desenha(frames) {
      sol.atualizaOFrameAtual(frames)
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

JOGO.criaPergunta = ({ contexto, imagens: { sprites }, principe, telas, mudaParaTela, planoDeFundo }) => {
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

      const { resposta, pontos } = pergunta.questao
      const acertou = (value === resposta)
      planoDeFundo.atualizaRecorde(acertou, pontos);

      pergunta.questao = {}
      principe.y = -principe.altura / 2
      pergunta.esconderBotoes()
      mudaParaTela(telas.ESPACO)
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
      const [parte1, parte2 = ''] = pergunta.questao.pergunta.split("# ")
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

JOGO.criaPlanetario = ({ contexto, imagens: { sprites }, principe, canvas, telas, sons: { grito }, mudaParaTela }) => {
  const planetario = {
    spriteX: 1159,
    spriteY: 0,
    largura: 117,
    altura: 117,
    planetas: [],
    desenha(frames) {
      planetario.atualizaOFrameAtual(frames)
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
      const peDoPrincipe = principe.y + principe.altura

      if (principe.x === planeta.x
        && peDoPrincipe > planeta.y
        && peDoPrincipe < planeta.y + planetario.altura) {
        return true
      }
      return false
    },
    estaOPrincipeEmCondicoesDeEntrarNo(planeta) {
      const peDoPrincipe = principe.y + principe.altura

      if (principe.x > planeta.x
        && principe.x < planeta.x + (planetario.largura / 2)
        && peDoPrincipe < planeta.y
        && (planeta.y - peDoPrincipe) < 3) {
        return true
      }
      return false
    },
    atualiza(frames) {
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
          mudaParaTela(telas.PERGUNTA)
        }

        if (planetario.temColisaoComOPrincipe(planeta)) {
          console.log('Você perdeu!')
          grito.play()
          mudaParaTela(telas.FIM)
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
    atualizaOFrameAtual(frames) {
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

JOGO.criaPrincipe = ({ contexto, imagens: { sprites }, sol, sons: { grito, asas }, telas, mudaParaTela }) => {
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
      asas.play()
    },
    gravidade: 0.25,
    velocidade: 0,
    momentoColisao: 0,
    espera: 1000, //1 segundo
    atualiza(timestamp) {
      if (principe.fazColisao(sol)) {
        console.log('Fez colisao')
        grito.play()
        let { momentoColisao, espera } = principe
        if (momentoColisao === 0) {
          principe.momentoColisao = momentoColisao = timestamp
        }

        const delta = timestamp - momentoColisao
        if (delta > espera) {
          mudaParaTela(telas.FIM)
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
    atualizaOFrameAtual(frames) {
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
    desenha(frames) {
      principe.atualizaOFrameAtual(frames)
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

JOGO.mudaParaTela = (novaTela) => {
  JOGO.telaAtiva = novaTela

  if (JOGO.telaAtiva.inicializa) {
    JOGO.telaAtiva.inicializa()
  }
}

JOGO.telas = {
  INICIO: {
    inicializa() {
      JOGO.planoDeFundo = JOGO.criaPlanoDeFundo(JOGO)
      JOGO.sol = JOGO.criaSol(JOGO)
      JOGO.principe = JOGO.criaPrincipe(JOGO)
      JOGO.planetario = JOGO.criaPlanetario(JOGO)
      JOGO.pergunta = JOGO.criaPergunta(JOGO)
      JOGO.abertura = JOGO.criaAbertura(JOGO)
    },
    desenha() {
      JOGO.planoDeFundo.desenha()
      JOGO.abertura.desenha()
    },
    click() {
      JOGO.abertura.click()
    },
    atualiza() {
      JOGO.planoDeFundo.atualiza()
    }
  },
  FIM: {
    inicializa() {
      // JOGO.sol = criaSol()
      // JOGO.principe = criaPrincipe()
      JOGO.finalizacao = JOGO.criaFinalizacao(JOGO)
      JOGO.videos.finalizacao.iniciar()
    },
    desenha(frames) {
      // JOGO.planoDeFundo.desenha(frames)
      JOGO.finalizacao.desenha()
    },
    click() {
      JOGO.finalizacao.click()
    },
    atualiza(tempoAtual, frames) {
      JOGO.planoDeFundo.atualiza(frames)
    }
  },
  PERGUNTA: {
    desenha(frames) {
      JOGO.planoDeFundo.desenha(frames)
      // JOGO.sol.desenha()
      // JOGO.planetario.desenha()
      // JOGO.principe.desenha()
      JOGO.pergunta.desenha()
    },
    click(evento) {
      JOGO.pergunta.click(evento)
    },
    atualiza(frames) {
      // JOGO.pergunta.atualiza()
      JOGO.planoDeFundo.atualiza(frames)
    }
  },
  ESPACO: {
    inicializa() {
      JOGO.sons.espaco.play()
    },
    desenha(frames) {
      JOGO.planoDeFundo.desenha(frames)
      JOGO.sol.desenha(frames)
      JOGO.planetario.desenha(frames)
      JOGO.principe.desenha(frames)
    },
    click() {
      JOGO.principe.pula()
    },
    atualiza(tempoAtual, frames) {
      JOGO.planoDeFundo.atualiza(frames)
      JOGO.sol.atualiza(frames)
      JOGO.planetario.atualiza(frames)
      JOGO.principe.atualiza(tempoAtual)
    }
  }
}

JOGO.loop = (timestamp) => {
  JOGO.telaAtiva.desenha(JOGO.frames)
  JOGO.telaAtiva.atualiza(timestamp, JOGO.frames)

  JOGO.frames = JOGO.frames + 1
  requestAnimationFrame(JOGO.loop)
}

JOGO.reageACliques = evento => {
  if (JOGO.telaAtiva.click) {
    JOGO.telaAtiva.click(evento)
  }
}
JOGO.reageATeclaEspacoOuSetaParaCima = evento => {
  const espacoPressionado = evento.code === 'Space';
  const setaParaCimaPressionada = evento.code === 'ArrowUp';
  const pula = espacoPressionado || setaParaCimaPressionada;
  if (pula) {
    JOGO.telaAtiva.click();
  }
}

JOGO.iniciar = () => {
  JOGO.conteiner = document.querySelector('#conteiner')
  JOGO.canvas = JOGO.conteiner.querySelector('canvas')
  JOGO.contexto = JOGO.canvas.getContext('2d')
  JOGO.conteiner.addEventListener('click', JOGO.reageACliques);
  window.addEventListener('keydown', JOGO.reageATeclaEspacoOuSetaParaCima);
  JOGO.mudaParaTela(JOGO.telas.INICIO)
  JOGO.loop()
}

window.addEventListener('DOMContentLoaded', () => JOGO.iniciar())

