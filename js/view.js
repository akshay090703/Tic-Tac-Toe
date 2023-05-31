export default class View {
    $ = {}; // namespace
    $$ = {};

    constructor() {
        this.$.menu= this.#qs('[data-id="menu"]');
        this.$.menuBtn = this.#qs('[data-id="menu-btn"]')
        this.$.menuItems= this.#qs('[data-id="menu-items"]');
        this.$.resetBtn= this.#qs('[data-id="reset-btn"]');
        this.$.newRoundBtn= this.#qs('[data-id="new-round-btn"]');
        this.$.modal= this.#qs('[data-id="modal"]');
        this.$.modalText= this.#qs('[data-id="modal-text"]');
        this.$.modalBtn= this.#qs('[data-id="modal-btn"]');
        this.$.turn= this.#qs('[data-id="turn"]');
        this.$.p1ScoreBoard = this.#qs('[data-id="p1-scoreboard"]');
        this.$.p2ScoreBoard = this.#qs('[data-id="p2-scoreboard"]');
        this.$.draws = this.#qs('[data-id="draws"]');
        
        this.$$.squares= this.#qsAll('[data-id="square"]');

        // UI-only event listeners
        this.$.menuBtn.addEventListener('click', event => {
            this.#toggeMenu();
        })
    };

    /*
    * Register all the event listeners
     */

    bindGameResetEvent(handler) {
        this.$.resetBtn.addEventListener('click', handler);
        this.$.modalBtn.addEventListener('click', handler);
    };

    bindNewRoundEvent(handler){
        this.$.newRoundBtn.addEventListener('click', handler);
    };

    bindPlayerMoveEvent(handler) {
        this.$$.squares.forEach(square => {
            square.addEventListener('click', () => handler(square));
        });
    };

    /*
    * DOM helper methods
     */
    updateScoreBoard(p1Wins, p2Wins, ties) {
        this.$.p1ScoreBoard.textContent = `${p1Wins} Wins`;
        this.$.p2ScoreBoard.textContent = `${p2Wins} Wins`;
        this.$.draws.textContent = `${ties} Draws`;
    }

    openModal(message){
        this.$.modal.classList.remove('hidden');
        this.$.modalText.textContent = message;
    };

    #closeModal() {
        this.$.modal.classList.add('hidden');
    };

    closeAll() {
        this.#closeModal();
        this.#closeMenu();
    }

    clearMoves() {
        this.$$.squares.forEach((square) => {
            square.replaceChildren();
        })
    }
    
    initializeMoves(moves) {
        this.$$.squares.forEach(square => {
            const existingMove = moves.find(move => move.squareId === +square.id);

            if(existingMove) {
                this.handlePlayerMove(square, existingMove.player);
            }
        })
    }

    #closeMenu() {
        this.$.menuItems.classList.add('hidden');
        this.$.menuBtn.classList.remove('border');

        const icon = this.$.menuBtn.querySelector("i");

        icon.classList.add("fa-chevron-down");
        icon.classList.remove("fa-chevron-up");
    }

    #toggeMenu() {
        this.$.menuItems.classList.toggle('hidden');
        this.$.menuBtn.classList.toggle('border');

        const icon = this.$.menuBtn.querySelector('i');
        icon.classList.toggle("fa-chevron-down");
        icon.classList.toggle("fa-chevron-up");
    };

    handlePlayerMove(squareEl, player) {
        const icon = document.createElement('i');
        icon.classList.add('fa-solid', player.iconClass, player.colorClass);
        squareEl.replaceChildren(icon);
    }

    setTurnIndicator(player, opponent) {
        const icon = document.createElement('i');
        const label = document.createElement('p');
        
        icon.classList.add('fa-solid' , player.colorClass, player.iconClass );

        label.classList.add(player.colorClass);
        label.textContent = `${player.name}, you're up!`

        this.$.turn.replaceChildren(icon, label);
    }

    #qs(selector, parent) {
        const el = parent ? parent.querySelector(selector) : document.querySelector(selector);

        if(!el) throw new Error('Could not find elements');

        return el;
    }

    #qsAll(selector) {
        const elList = document.querySelectorAll(selector);

        if(!elList) throw new Error('Could not find elements');

        return elList;
    }
}