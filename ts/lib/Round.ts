// Class representing a round in a poker game
class Round {
    // Readonly properties: deck, hand, and bet
    public readonly deck: Deck;
    public readonly hand: Hand;
    public readonly bet: number;

    // Constructor to initialize a round with a specified bet
    public constructor(bet: number) {
        // Set the bet for the round
        this.bet = bet;
        
        // Create a new deck, shuffle it, and initialize an empty hand
        this.deck = new Deck();
        this.deck.shuffle();
        this.hand = new Hand();
    }

    // Method to draw cards into the hand from the deck
    public draw(): void {
        // Draw five cards from the deck and add them to the hand
        this.hand.cards.push(this.deck.draw());
        this.hand.cards.push(this.deck.draw());
        this.hand.cards.push(this.deck.draw());
        this.hand.cards.push(this.deck.draw());
        this.hand.cards.push(this.deck.draw());
    }
}
