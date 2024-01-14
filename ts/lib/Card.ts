// Enum defining the suits of a standard deck of cards
enum Suit {
    Spades,
    Clubs,
    Hearts,
    Diamonds,
};

// Class representing a playing card
class Card {
    // Readonly properties for rank and suit
    public readonly rank: number;
    public readonly suit: number;

    // Constructor to initialize the card with a rank and suit
    public constructor(rank: number, suit: Suit) {
        this.rank = rank;
        this.suit = suit;
    }

    // Static array holding the names of card ranks
    private static rankNames = [
        'Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King',
    ];

    // Getter for the name of the card's rank
    public get rankName(): string {
        return Card.rankNames[this.rank - 1];
    }

    // Getter for the name of the card's suit
    public get suitName(): string {
        return Suit[this.suit];
    }

    // Getter for the full name of the card, e.g., "Ace of Spades"
    public get name(): string {
        return this.rankName + ' of ' + this.suitName;
    }

    // Getter for the filename of the card's image
    public get imageName(): string {
        let s: string, r: string;

        // Determine the representation of the rank and suit for the filename
        if (this.rank === 1 || this.rank > 10) {
            r = this.rankName.charAt(0);
        } else {
            r = this.rank + '';
        }

        s = this.suitName.charAt(0);

        // Concatenate the rank and suit to form the image filename
        return r + s + '.svg';
    }
}
