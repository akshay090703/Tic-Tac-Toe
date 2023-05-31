import View from './view.js';
import Store from './store.js';

const players = [
    {
        id: 1,
        name: "Player 1",
        iconClass: "fa-o",
        colorClass: 'turquoise',
    },
    {
        id: 2,
        name: "Player 2",
        iconClass: "fa-x",
        colorClass: "yellow",
    },
];

function init() {
    const view = new View();
    const store = new Store('live-localStorage-key' ,players);

    // Current Tab state changes
    // store.addEventListener('statechange', () => {
    //     view.render(store.game, store.stats);
    // })

    function initView() {
        view.closeAll();
        view.clearMoves();
        view.setTurnIndicator(store.game.currentPlayer);
        view.updateScoreBoard(
            store.stats.playerWithStats[0].wins,
            store.stats.playerWithStats[1].wins,
            store.stats.ties
        );
        view.initializeMoves(store.game.moves);
    }

    // A different tab state changes
    window.addEventListener('storage', () => {
        initView();
    });

    // First load of the document everytime
    initView();

    view.bindGameResetEvent(event => {
        store.reset();

        initView();
    })

    view.bindNewRoundEvent(event => {
        store.newRound();

        initView();
    })

    view.bindPlayerMoveEvent(square => {
        const existingMove = store.game.moves.find(move => move.squareId === +square.id);
        if(existingMove) {
            return;
        }

        // Place an icon of the current player in a square
        view.handlePlayerMove(square, store.game.currentPlayer);

        // Advance to the next state by pushing a move to the moves array
        store.playerMove(+square.id);

        if(store.game.status.isComplete) {

            view.openModal(store.game.status.winner ? `${store.game.status.winner.name} wins the game!` : `Draw Match!`);
        }

        // Set the next player's turn indicator
        view.setTurnIndicator(store.game.currentPlayer);
    });
}

window.addEventListener("load", init);