// Initialize the UI, Round, and player
let ui = new UI(document.querySelector('main')!),
    round: Round,
    player = {
        cash: 100,
    };

// Function to initialize the game
function init(): void {
    // Reset the game state
    reset();

    // Event listener for the bet button
    ui.betButton.addEventListener('click', function () {
        // Parse the bet amount from the input
        let bet: number = parseInt(ui.betInput.value);
        // Check if the bet is valid
        if (bet > player.cash && bet <= 0) return;
        // Create a new round with the specified bet and draw cards
        round = new Round(bet);
        round.draw();

        // Update player cash and UI
        player.cash -= bet;
        updateCash();

        // Display the drawn cards in the UI
        round.hand.cards.forEach(c => {
            ui.addCard(c);
        });

        // Switch to play mode and prompt the player to discard cards
        ui.playMode();
        msg('Click on the cards you wish to discard');
    });

    // Event listener for the play button
    ui.playButton.addEventListener('click', function () {
        // Iterate through the player's hand
        round.hand.cards.forEach((c, i) => {
            let u: UICard = ui.cards.get(c)!;

            // If a card is discarded, replace it with a new card from the deck
            if (u.discarded) {
                let newCard = round.deck.draw();
                round.hand.cards[i] = newCard;
                ui.replaceCard(newCard, c);
            }
        });

        // Get the hand score and calculate the payout
        let score = round.hand.getScore(),
            payout = score.rank.payout * round.bet;

        // Update player cash and highlight scoring cards in the UI
        player.cash += payout;
        updateCash();
        score.scoringCards.forEach(c => {
            ui.cards.get(c)!.highlighted = true;
        });

        // Switch to game over mode, disable cards, and display the result message
        ui.gameOverMode();
        ui.disableCards();
        msg('Hand: ' + score.rank.name + '<br>Winnings: $' + payout);
    });

    // Event listener for the reset button
    ui.resetButton.addEventListener('click', function () {
        // Reset the game state
        reset();
    });
}

// Function to reset the game state
function reset() {
    ui.betMode();
    ui.clearCards();
    ui.enableCards();
    clearMsg();
}

// Function to update the player's cash in the UI
function updateCash(): void {
    ui.updateCash(player.cash);
}

// Function to display a message in the UI
function msg(str: string): void {
    ui.msg.innerHTML += str + '<br>';
}

// Function to clear the message in the UI
function clearMsg(): void {
    ui.msg.innerHTML = '';
}

// Initialize the game
init();
