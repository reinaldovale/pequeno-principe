const canvas = document.querySelector('canvas')
const contexto = canvas.getContext('2d')

const videoIntroducao = './introducao.mp4'
const video = document.createElement("video");
video.src = videoIntroducao;
video.autoplay = true;
video.loop = false;
video.muted = false;
video.addEventListener('ended', evento => mudaParaTela(Telas.JOGO))

let frames = 0
const somGrito = new Audio()
somGrito.src = './efeitos/grito.wav'

const somAsas = new Audio()
somAsas.src = './efeitos/pulo.wav'

const somPonto = new Audio()
somPonto.src = './efeitos/ponto.wav'

const somErro = new Audio()
somErro.src = './efeitos/erro.wav'

const somSpaco = new Audio()
somSpaco.src = './efeitos/spaco.wav'
somSpaco.loop = true

const sprites = new Image()
sprites.src = './sprites.png'

const daniel = new Image()
daniel.src = './daniel.png'

const questoes = [{
  pergunta: "Pegunta de número UM ",
  alternativas: '(A) alternativa A; (B) alternativa B; (C) alternativa C',
  resposta: 'A',
}, {
  pergunta: "Pegunta de número DOIS ",
  alternativas: '(A) alternativa A; (B) alternativa B; (C) alternativa C',
  resposta: 'B',
}, {
  pergunta: "Pegunta de número TRÊS ",
  alternativas: '(A) alternativa A; (B) alternativa B; (C) alternativa C',
  resposta: 'C',
}]

function criaAbertura() {
  const abertura = {
    spriteX: 0,
    spriteY: 0,
    largura: 320,
    altura: 480,
    x: 0,
    y: 0,
    recorde: 0,
    iniciado: false,
    click() {
      somSpaco.pause();
      video.play()
      if (abertura.iniciado) {
        video.pause()
        somSpaco.play()
        video.currentTime = 100
      }
      abertura.iniciado = true
    },

    desenha() {
      contexto.font = 'normal bold 20px serif'
      contexto.fillStyle = "red"

      if (!abertura.iniciado) {
        contexto.drawImage(daniel, 0, 0)
        contexto.fillText('Para Começar, clique na Tela', 10, 470)
      }
      else {
        contexto.drawImage(video, 0, 0)
        contexto.fillText('Introdução', 105, 30)
        contexto.fillText('Clique para pular', 150, 470)
      }
    },
  }
  return abertura
}

// [Plano de Fundo]
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

    contexto.font = 'normal normal 20px serif'
    contexto.fillStyle = "white"
    contexto.fillText("Pontos: ", 200, 20)
    contexto.font = 'normal bold 30px serif'
    contexto.fillStyle = "red"
    contexto.fillText(planoDeFundo.recorde.toString().padStart(3, '0'), 270, 25)
  },
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
  const pergunta = {
    spriteX: 130,
    spriteY: 152,
    largura: 225,
    altura: 151,
    x: 50,
    y: 20,
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
    click({ target: { tagName, value } }) {
      if (!/BUTTON/.test(tagName)) {
        return
      }

      if (value === pergunta.questao.resposta) {
        console.log("Você ganhou 10 pontos!");
        somPonto.play()
        planoDeFundo.recorde += 10;
      }
      else {
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
      contexto.drawImage(
        sprites,
        pergunta.spriteX, pergunta.spriteY,
        pergunta.largura, pergunta.altura,
        pergunta.x, pergunta.y,
        pergunta.largura, pergunta.altura,
      )
      if (Object.keys(pergunta.questao).length === 0) {
        pergunta.questao = questoes[Math.floor(Math.random() * questoes.length)]
      }

      // contexto.textAlign = "center"
      contexto.font = 'normal bold 18px serif'
      contexto.fillText(pergunta.questao.pergunta, 65, 90)
      contexto.font = '14px serif'
      const [altA, altB, altC] = pergunta.questao.alternativas.split("; ")
      contexto.fillText(altA, 60, 130)
      contexto.fillText(altB, 60, 145)
      contexto.fillText(altC, 60, 160)

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
        console.log('Passou 200 frames')
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
          planoDeFundo.recorde = 0
          mudaParaTela(Telas.INICIO)
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
    atualiza() {
      if (fazColisao(principe, globais.sol)) {
        console.log('Fez colisao')
        planoDeFundo.recorde = 0
        somGrito.play()

        setTimeout(() => {
          mudaParaTela(Telas.INICIO)
        }, 500)
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

// 
// [Telas]
// 
const globais = {}
let telaAtiva = {}
function mudaParaTela(novaTela) {
  telaAtiva = novaTela

  if (telaAtiva.inicializa) {
    telaAtiva.inicializa()
  }
}

const Telas = {
  INICIO: {
    inicializa() {
      somSpaco.play()
      globais.sol = criaSol()
      globais.principe = criaPrincipe()
      globais.planetario = criaPlanetario()
      globais.pergunta = criaPergunta()
      globais.abertura = criaAbertura()
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

Telas.PERGUNTA = {
  desenha() {
    planoDeFundo.desenha()
    globais.sol.desenha()
    globais.planetario.desenha()
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
  atualiza() {
    planoDeFundo.atualiza()
    globais.sol.atualiza()
    globais.planetario.atualiza()
    globais.principe.atualiza()
  }
}

function fazColisao(principe, sol) {
  const principeY = principe.y + principe.altura
  const solY = sol.y
  const coroaSolar = 100

  if (principeY >= solY + coroaSolar) {
    return true
  }

  return false
}

function loop() {

  telaAtiva.desenha()
  telaAtiva.atualiza()

  frames = frames + 1
  requestAnimationFrame(loop)
}

const listenerClick = evento => {
  if (telaAtiva.click) {
    telaAtiva.click(evento)
  }
};
const listenerKeyDown = (evento) => {
  const isSpace = evento.code === 'Space';
  const isArrowUp = evento.code === 'ArrowUp';
  const fireJump = isSpace || isArrowUp;
  if (fireJump) {
    evento.preventDefault();
    evento.stopPropagation();
    telaAtiva.click();
  }
}


window.addEventListener('click', listenerClick);
window.addEventListener('keydown', listenerKeyDown);


mudaParaTela(Telas.INICIO)
loop()
