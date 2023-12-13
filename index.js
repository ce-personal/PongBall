class Pong {
  ball;

  // { x: decimal, y: decimal, mouvement: { x: '+' | '-' | '', y: '+' | '-' | '' } }
  // Ejemplo de mouvement
  // { x: '+', y: '-' } ->  Aqui seria x: hacia abajo, y: hacia izqierda 
  ballProperty;

  gameZone;
  limitGameZone;

  players;
  score;

  constructor() {
    this.ball = document.querySelector(".ball");
    this.gameZone = document.querySelector('.zone-game');
    this.score = document.querySelector('.accountant');


    this.ballProperty = {
      x: this.#getPositionBall().x, y: this.#getPositionBall().y,
      mouvement: { x: this.#getMouvementRandom(), y: this.#getMouvementRandom() }
    }

    this.limitGameZone = {
      top: 0,
      left: 0,
      rigth: this.gameZone.clientWidth - 24,
      bottom: this.gameZone.clientHeight - 24
    }

    this.players = {
      1: { score: 0, dom: document.querySelector(".player-1") },
      2: { score: 0, dom: document.querySelector(".player-2") }
    }

  }

  //#region COMMON FUNCTIONS
  setRootAttr(name, value) {
    document.documentElement.style.setProperty(name, value);
  }

  #getMouvementRandom() {
    const numRandom = Math.floor(Math.random() * 2)
    return numRandom ? '+' : '-';
  }
  //#endregion





  //#region BALL ACTIONS
  #setPositionBall(x, y) {
    this.setRootAttr("--ball-position-y", `${x}px`);
    this.setRootAttr("--ball-position-x", `${y}px`);
  }

  #getPositionBall() {
    const positionBall = this.ball.getBoundingClientRect();
    const positionGameZone = this.gameZone.getBoundingClientRect();

    const position = {
      y: positionBall.top - positionGameZone.top - 4,
      x: positionBall.left - positionGameZone.left
    }

    position.x = parseInt(position.x);
    position.y = parseInt(position.y);

    return position;
  }

  #getPositionBallByConfig(value, mouvementOpt) {
    let newValue = value;
    let valueSum = 1;

    if (mouvementOpt === "+")
      newValue += valueSum;

    else if (mouvementOpt === '-')
      newValue -= valueSum;

    return newValue;
  }



  #detectContactY(y) {
    // En caso de tocar los bordes superiores
    if (y === this.limitGameZone.bottom) this.ballProperty.mouvement.y = '-';
    if (y === this.limitGameZone.top) this.ballProperty.mouvement.y = '+';
  }

  #detectContactX(x) {
    // En caso de tocar los bordes laterales
    if (x === this.limitGameZone.left) {
      this.ballProperty.mouvement.x = '+';
      this.players[2].score += 1;
      this.#setScores();
    }

    if (x === this.limitGameZone.rigth) {
      this.ballProperty.mouvement.x = '-';
      this.players[1].score += 1;
      this.#setScores();
    }
  }

  #detectContactPlayers() {
    const positionsPlayers = this.#getPositionsPlayers();
    const { y, x } = this.#getPositionBall();
    const heightPlayers = this.players[1].dom.clientHeight;
    const widthPlayers = this.players[1].dom.clientWidth;



    // Player 1
    const rangeValid1 = { from: positionsPlayers[1].y, to: positionsPlayers[1].y + heightPlayers };
    if (positionsPlayers[1].x === x) {
      if (y >= rangeValid1.from && y <= rangeValid1.to) this.ballProperty.mouvement.x = '+';
    }


    // Player 2
    const rangeValid2 = { from: positionsPlayers[2].y, to: positionsPlayers[2].y + heightPlayers };

    if (positionsPlayers[2].x === (x + widthPlayers * 3)) {
      if (y >= rangeValid2.from && y <= rangeValid2.to) this.ballProperty.mouvement.x = '-';
    }

  }


  ballActions() {
    const positionBall = this.#getPositionBall();
    const y = this.#getPositionBallByConfig(positionBall.y, this.ballProperty.mouvement.y);
    const x = this.#getPositionBallByConfig(positionBall.x, this.ballProperty.mouvement.x);

    this.#detectContactY(y);
    this.#detectContactX(x);
    this.#detectContactPlayers(x, y);
    this.#setPositionBall(x, y);
  }
  //#endregion BALL ACTIONS





  //#region PLAYERS_SECTION
  #setScores() {
    this.score.innerHTML = `${this.players[1].score} : ${this.players[2].score}`
  }

  #getPositionsPlayers() {
    const positions = {
      1: { x: 0, y: 0 },
      2: { x: 0, y: 0 }
    };

    const positionGameZone = this.gameZone.getBoundingClientRect();

    for (let i = 1; i <= 2; i++) {
      const player = this.players[i];
      const x = player.dom.getBoundingClientRect().left - positionGameZone.left;
      const y = player.dom.getBoundingClientRect().top - positionGameZone.top;

      positions[i] = {
        x: parseInt(x) - 5,
        y: parseInt(y)
      };
    }

    return positions;
  }

  //#endregion



  //#region Rackets
  moveRacket(player, value) {
    const positionPlayer = this.players[player].dom.getBoundingClientRect();
    const positionGameZone = this.gameZone.getBoundingClientRect();
    const heightPlayers = this.players[1].dom.clientHeight;
    const y = positionPlayer.top - positionGameZone.top - 4;
    const step = 10;

    const maxBottom = positionGameZone.height - heightPlayers - 4;
    const maxTop = 0;

    let playerNameTop = "";

    if (player === 1) playerNameTop = "--player1-top";
    else if (player === 2) playerNameTop = "--player2-top";


    if (value === "+") {
      const newPosition = y - step;
      if (newPosition < maxTop) return;

      this.setRootAttr(playerNameTop, `${newPosition}px`);
    }

    else if (value === "-") {
      const newPosition = y + step;
      if (newPosition > maxBottom) return;

      this.setRootAttr(playerNameTop, `${y + step}px`);
    }
  }

  //#endregion Rackets

}



const game = new Pong();
setInterval(() => {

  game.ballActions();
}, 5);


// Usar con el teclado
document.addEventListener('keydown', (evt) => {
  const key = evt.key;

  // Player 1
  if (key === "w") game.moveRacket(1, "+");
  else if (key === "s") game.moveRacket(1, "-");


  // Player 2
  if (key === "ArrowUp") game.moveRacket(2, "+");
  else if (key === "ArrowDown") game.moveRacket(2, "-");
});



// Para usar con el touch 
const playersNameButton = [
  {
    selector: ".btns-player-1 .btn-top",
    function: () => game.moveRacket(1, "+")
  },

  {
    selector: ".btns-player-1 .btn-bottom",
    function: () => game.moveRacket(1, "-")
  },


  {
    selector: ".btns-player-2 .btn-top",
    function: () => game.moveRacket(2, "+")
  },

  {
    selector: ".btns-player-2 .btn-bottom",
    function: () => game.moveRacket(2, "-")
  },
];


document.addEventListener("click", (evt) => {
  for (const item of playersNameButton) {
    const inList = evt.target.matches(item.selector);
    if (inList) item.function();
  }
});


