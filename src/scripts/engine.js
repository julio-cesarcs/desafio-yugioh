const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    playerSides: {
        player1: "#player-cards",
        player1Box: document.querySelector("#player-cards"),
        computer: "#computer-cards",
        computerBox: document.querySelector("#computer-cards"),
    },
    actions: {
        button: document.getElementById("next-duel"),
    }
};

const playerSides = {
    player1: "player-cards",
    computer: "computer-cards",
}

const pathImages = "./src/assets/icons/"

const cardData = [
    {
        id: 0,
        name: "Exodia",
        type: "Super",
        img: `${pathImages}exodia.png`,
        winOf: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        loseOf: [0],
    },
    {
        id: 1,
        name: "Blue Eyes White Dragon",
        type: "Rock",
        img: `${pathImages}blue-dragon.png`,
        winOf: [3, 4, 9, 10],
        loseOf: [0, 5, 6, 7, 8],
    },
    {
        id: 2,
        name: "Kuriboh",
        type: "Rock",
        img: `${pathImages}kuriboh.png`,
        winOf: [3, 4, 9, 10],
        loseOf: [0, 5, 6, 7, 8],
    },
    {
        id: 3,
        name: "Dark Magician",
        type: "Scissors",
        img: `${pathImages}magician.png`,
        winOf: [5, 6, 9, 10],
        loseOf: [0, 1, 2, 7, 8],
    },
    {
        id: 4,
        name: "Time Wizard",
        type: "Scissors",
        img: `${pathImages}wizard.png`,
        winOf: [5, 6, 9, 10],
        loseOf: [0, 1, 2, 7, 8],
    },
    {
        id: 5,
        name: "Gaia The Fierce Knight",
        type: "Paper",
        img: `${pathImages}knight.png`,
        winOf: [1, 2, 7, 8],
        loseOf: [0, 3, 4, 9, 10],
    },
    {
        id: 6,
        name: "Beaver Warior",
        type: "Paper",
        img: `${pathImages}warior.png`,
        winOf: [1, 2, 7, 8],
        loseOf: [0, 3, 4, 9, 10],
    },
    {
        id: 7,
        name: "Celtic Guardian",
        type: "Spock",
        img: `${pathImages}guardian.png`,
        winOf: [1, 2, 3, 4],
        loseOf: [0, 5, 6, 9, 10],
    },
    {
        id: 8,
        name: "Red Eyes Dark Dragon",
        type: "Spock",
        img: `${pathImages}red-dragon.png`,
        winOf: [1, 2, 3, 4],
        loseOf: [0, 5, 6, 9, 10],
    },
    {
        id: 9,
        name: "Curse of Dragon",
        type: "Lizard",
        img: `${pathImages}curse.png`,
        winOf: [5, 6, 7, 8],
        loseOf: [0, 1, 2, 3, 4],
    },
    {
        id: 10,
        name: "Summoned Skull",
        type: "Lizard",
        img: `${pathImages}skull.png`,
        winOf: [5, 6, 7, 8],
        loseOf: [0, 1, 2, 3, 4],
    },

];

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length)
    return cardData[randomIndex].id;
}

async function createCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", `${pathImages}card-back.png`);
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");

    if (fieldSide === playerSides.player1) {
        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(IdCard);
        });

        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        });
    }

    if (fieldSide === playerSides.computer) {
        cardImage.style.transform = "none"
    }

    return cardImage
}

async function setCardsField(cardId) {


    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    state.fieldCards.player.style.display = "block"
    state.fieldCards.computer.style.display = "block"

    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    state.cardSprites.avatar.src = ""

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
}

async function drawButton(msg) {
    state.actions.button.innerText = msg;
    state.actions.button.style.display = "block"
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win : ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "draw"
    let playerCard = cardData[playerCardId];

    if (playerCard.winOf.includes(computerCardId)) {
        duelResults = "win"
        state.score.playerScore++
    }

    if (playerCard.loseOf.includes(computerCardId)) {
        duelResults = "lose"
        state.score.computerScore++
    }

    await playAudio(duelResults)

    return duelResults
}

async function removeAllCardsImages() {
    let { computerBox, player1Box } = state.playerSides

    let imgElements = computerBox.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    imgElements = player1Box.querySelectorAll("img")
    imgElements.forEach((img) => img.remove());
}

async function drawSelectCard(index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = `Attribute: ${cardData[index].type}`;
}

async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage)
    }
}

async function resetDuel() {
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";
    state.cardSprites.name.innerText = "Selecione"
    state.cardSprites.type.innerText = "uma carta"
    init()

}

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`)

    try {
        audio.play()
    } catch {
    }
}

function init() {
    state.fieldCards.player.style.display = "none"
    state.fieldCards.computer.style.display = "none"
    drawCards(5, playerSides.player1)
    drawCards(5, playerSides.computer)

    const bgm = document.getElementById("bgm");
    bgm.play();
}

init();


