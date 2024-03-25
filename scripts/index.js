/**
 * This program implements a simple card guessing game. 
 * A card is randomly selected from a list of 9 cards and 
 * hidden from view while the player attempts to guess which
 * card it is. 
 * The 9 cards are displayed face up in a 3x3 grid and the player
 * guesses by clicking on one of the cards.
 * The player can opt to be given multiple chances to guess the card.
 * If the player wins or runs out of guesses, a 'show' button is
 * displayed, allowing the player to reveal the answer.
 */
import {
    
    getCard,
    getCardNode,
    getCheckbox,
    getContinueBtn,
    getNumberInput,
    getOutput,
    getPanel,
    getRestartBtn,
    getShowBtn,
    getTiles,
    getTries,
    setCard,
    showCard,
    shuffle,
    toggleInputState,
} from './helpers.js';

// Global variable for keeping track of player preferences.
// Needed because it is accessed and updated by multiple functions
let tries;

function setup() {
    /**
     * Register all the event listeners. These include:
     * - click events on the card tiles in the right panel. The behavior is
     * as follows: when a tile is clicked, its name is compared to the name of
     * the card to guess. If they match, player wins. Otherwise, the game ends 
     * or the player is given the chance to guess again.
     * 
     * - click events on the show button. When clicked, the card to guess is revealed.
     * 
     * 
     * - click events on the restart button. When clicked, a new round of the game is started.
     * 
     * - click events on continue button. When clicked, the player is given the opportunity to make another guess
     * 
     * - change event on the checkbox. This results in the input being enabled or disabled depending on whether 
     * the state of the checkbox.
     * 
     * - input event on the input box. If no value is entered, nothing happens, otherwise, the new value is 
     * assigned to the 'tries' variable and the game is restarted.
     * 
     */

    const tiles = getTiles();
    for (let tile of tiles) {
        tile.addEventListener('click', () => {
            const selectedCard = tile.alt;
            const answerCard = getCard();

            if (selectedCard === answerCard) {
                showResults(true);
            } else {
                tile.disabled = true;
                
                if (getTries() > 1) {
                    pause();
                } else {
                    showResults(false);
                }
            }
        });
    }

    getShowBtn().addEventListener('click', showCard);
    getRestartBtn().addEventListener('click',play);
    getCheckbox().addEventListener('change', toggleInputState);
    getNumberInput().addEventListener('input', (event)=> {
        play()
        getCheckbox().checked = false;
    }
    )

    getCardNode().classList.toggle('fade',true);
    getCardNode().parentElement.classList.toggle('flip', true);
    
}

function deactivate() {
    /**
     * Called after each guess
     * - Disable click events on the card tiles and dim
     * the selection panel
     */
    for( let tile of getTiles()){
        tile.toggleAttribute('disabled', true);
        tile.parentElement.classList.add('dim');
    }
    getCardNode().classList.toggle('fade', false);
    getCardNode().parentElement.classList.toggle('flip', false);
}

function activate() {
    /**
     * Called on page load or when the 'restart' button is clicked
     * - (Re-)enable click events on the card tiles and un-dim
     * the selection panel
     * - Uncheck the checkbox (if checked) and disable the input. 
     * - Hide the 'continue' button. 
     * - Restore the 'show' button (which might have been 
     * disabled in the previous round)to active state 
     */

    
    const tiles = getTiles();
    for (let tile of tiles) {
        tile.addEventListener('click', () => {
            const selectedCard = tile.alt;
            const answerCard = getCard();

            if (selectedCard === answerCard) {
                showResults(true);
            } else {
                tile.disabled = true;
                if (getTries() > 1) {
                    pause();
                } else {
                    showResults(false);
                }
            }
        });
    }

    getCheckbox().toggleAttribute('checked', false);
    getNumberInput().disabled = true;
    getContinueBtn().classList.toggle('hidden', true);
    getShowBtn().classList.remove('hidden');

}


function play() {
    /**
     * Called on page load or when the 'restart' button is clicked
     * - Randomly choose a card to guess
     * - Scramble the card tiles
     * - Restore number of tries
     * - Activate the selection panel
     * - Hide the 'show' and 'restart' buttons
     * - Clear the previous round's output
     */
    tries = getCheckbox().checked ? parseInt(getNumberInput().value) : 1;
    setCard();
    const tiles=getTiles();
    const randomizedTiles = shuffle(Array.from(tiles))
    for(let i=0; i< randomizedTiles.length; i++){
        randomizedTiles[i].parentElement.style.order=i+1;
    }
    
    activate();
    getShowBtn().classList.add('hidden');
    getRestartBtn().classList.add('hidden');
    getOutput().textContent = ""; 
}



function pause() {
    /**
     * Called only if the player has more guesses to try. (tries > 1)
     * - De-activate the selection panel
     * - Show the number of tries left
     * - Show the continue button
     */
    if (tries > 1) {
        deactivate();

        getOutput().textContent = 'You have ${tries} tries left.';

        const tiles = getTiles();
        for( let tile of getTiles()){
            tile.disabled = true;
        }
        getContinueBtn().classList.remove('hidden');

    }
}


function showResults() {
    /**
     * Called in case the player wins or ran out of guesses.
     * - De-activate the selection panel
     * - Hide the continue button
     * - Show the 'show' and 'restart' buttons
     * - Stop showing the number of tries left
     */
    if (tries === 0 || getCard() === getCardNode().alt()) {
        deactivate();

        getContinueBtn().classList.add('hidden');
        getShowBtn().classList.remove('hidden');
        getRestartBtn().classList.remove('hidden');

        if (tries === 0) {
            getOutput().textContent = "Sorry, you've run out of guesses.";
        } else {
            getOutput().textContent = "Congratulations! You've won!";
        }
    }
}

// Set up and start the game
setup();
play();