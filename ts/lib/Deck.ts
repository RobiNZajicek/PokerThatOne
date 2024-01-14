// Class representing a deck of playing cards
class Deck {
    // Private array to store the cards in the deck
    private cards: Card[];

    // Constructor to initialize the deck with a standard set of 52 cards
    public constructor() {
        this.cards = [];

        // Loop through each suit and rank to create the deck
        for (let s = 0; s < 4; s++) {
            for (let r = 1; r <= 13; r++) {
                // Create a new card and add it to the deck
                this.cards.push(new Card(r, s));
            }
        }
    }

    // Method to shuffle the cards in the deck
    public shuffle(): void {
        // Loop through the cards in reverse order
        for (let i = this.cards.length; i > 0; i--) {
            // Generate a random index within the remaining cards
            let j = Math.floor(Math.random() * i);

            // Swap the current card with the randomly chosen card
            [this.cards[i - 1], this.cards[j]] = [this.cards[j], this.cards[i - 1]];
        }
    }

    // Method to draw a card from the top of the deck
    public draw(): Card {
        // Shift and return the first card in the array (top of the deck)
        return <Card>this.cards.shift();
    }
}
