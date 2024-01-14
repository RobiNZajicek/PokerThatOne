// Interface defining the structure of a hand rank
interface HandRank {
    name: string;
    payout: number;
}

// Interface defining the structure of a hand score
interface Score {
    rank: HandRank;
    scoringCards: Card[];
}

// Object containing predefined hand ranks and their corresponding payouts
let Ranks: { [x: string]: HandRank } = {
    ROYAL_FLUSH: {
        name: 'Royal Flush',
        payout: 800,
    },
    STRAIGHT_FLUSH: {
        name: 'Straight Flush',
        payout: 50,
    },
    FOUR_OF_A_KIND: {
        name: 'Four of a Kind',
        payout: 25,
    },
    FULL_HOUSE: {
        name: 'Full House',
        payout: 9,
    },
    FLUSH: {
        name: 'Flush',
        payout: 6,
    },
    STRAIGHT: {
        name: 'Straight',
        payout: 4,
    },
    THREE_OF_A_KIND: {
        name: 'Three of a Kind',
        payout: 3,
    },
    TWO_PAIR: {
        name: 'Two Pair',
        payout: 2,
    },
    JACKS_OR_BETTER: {
        name: 'Jacks or Better',
        payout: 1,
    },
    NOTHING: {
        name: 'Nothing',
        payout: 0,
    },
};

// Interface defining the structure of a group of cards with a specific rank
interface KindsGroup {
    cards: Card[];
    rank: number;
}

// Class representing a group of cards with the same rank
class Kinds {
    private kinds: { [rank: number]: Card[] };

    // Constructor to initialize the Kinds class with a set of cards
    public constructor(cards: Card[]) {
        this.kinds = {};

        // Group cards by rank
        cards.forEach((c) => {
            let r = c.rank;

            if (this.kinds[r] === undefined) this.kinds[r] = [];

            this.kinds[r].push(c);
        });
    }

    // Method to check if there is a group with a specific number of cards
    public has(numOfKinds: number): KindsGroup | false {
        let kg = this.all(numOfKinds);

        if (kg) return kg[0];

        return false;
    }

    // Method to retrieve all groups with a specific number of cards
    public all(numOfKinds: number): KindsGroup[] | false {
        let result: KindsGroup[] = [];

        for (let rank of Object.keys(this.kinds)) {
            if (this.kinds[rank].length === numOfKinds) {
                result.push({
                    cards: this.kinds[rank],
                    rank: +rank,
                });
            }
        }

        if (result.length === 0) return false;

        return result;
    }
}

// Class representing a hand of cards
class Hand {
    public readonly cards: Card[];

    // Constructor to initialize the hand with a set of cards (optional)
    public constructor(cards?: Card[]) {
        if (cards !== undefined) {
            this.cards = cards;
        } else {
            this.cards = [];
        }
    }

    // Private method to check if the hand has a flush
    private isFlush(): boolean {
        let suit = this.cards[0].suit;

        return this.cards.every((c) => c.suit === suit);
    }

    // Private method to check if the hand has a straight
    private isStraight(): boolean {
        return this.isAceHighStraight() || this.isAceLowStraight();
    }

    // Private method to check if the hand has an Ace-high straight
    private isAceHighStraight(): boolean {
        let high, low, ranks: number[] = [];

        high = low = this.cards[0].rank;

        for (let i = 0; i < this.cards.length; i++) {
            let c = this.cards[i];
            let r = c.rank;

            if (r === 1) r = 14;

            if (ranks.indexOf(r) !== -1) return false;
            ranks.push(r);

            if (r > high) high = r;
            if (r < low) low = r;
        }

        return high - low === 4;
    }

    // Private method to check if the hand has an Ace-low straight
    private isAceLowStraight(): boolean {
        let high, low, ranks: number[] = [];

        high = low = this.cards[0].rank;

        for (let i = 0; i < this.cards.length; i++) {
            let c = this.cards[i];
            let r = c.rank;

            if (ranks.indexOf(r) !== -1) return false;
            ranks.push(r);

            if (r > high) high = r;
            if (r < low) low = r;
        }

        return high - low === 4;
    }

    // Method to check if the hand has specific ranks among its cards
    public has(...ranks: number[]): boolean {
        return this.cards.some((c) => {
            let r = c.rank,
                i = ranks.indexOf(r);

            if (i !== -1) {
                ranks.splice(i, 1);
            }

            return ranks.length === 0;
        });
    }

    // Method to calculate the score of the hand
    public getScore(): Score {
        // Check for Royal Flush and Straight Flush
        if (this.isFlush() && this.isStraight()) {
            if (this.has(1, 10, 11, 12, 13)) {
                // Royal flush
                return {
                    rank: Ranks.ROYAL_FLUSH,
                    scoringCards: this.cards,
                };
            }

            // Straight flush
            return {
                rank: Ranks.STRAIGHT_FLUSH,
                scoringCards: this.cards,
            };
        }

        // Create a Kinds instance to analyze the cards
        let kinds = new Kinds(this.cards);

        // Check for Four of a Kind
        let has4 = kinds.has(4);

        if (has4) {
            return {
                rank: Ranks.FOUR_OF_A_KIND,
                scoringCards: has4.cards,
            };
        }

        // Check for Full House
        let has3 = kinds.has(3),
            has2 = kinds.has(2);

        if (has3 && has2) {
            return {
                rank: Ranks.FULL_HOUSE,
                scoringCards: this.cards,
            };
        }

        // Check for Flush
        if (this.isFlush()) {
            return {
                rank: Ranks.FLUSH,
                scoringCards: this.cards,
            };
        }

        // Check for Straight
        if (this.isStraight()) {
            return {
                rank: Ranks.STRAIGHT,
                scoringCards: this.cards,
            };
        }

        // Check for Three of a Kind
        if (has3) {
            return {
                rank: Ranks.THREE_OF_A_KIND,
                scoringCards: has3.cards,
            };
        }

        // Check for Two Pair
        let all2 = kinds.all(2);

        if (all2 && all2.length === 2) {
            return {
                rank: Ranks.TWO_PAIR,
                scoringCards: (() => {
                    let cards: Card[] = [];

                    all2.forEach((kg) => {
                        cards = cards.concat(kg.cards);
                    });

                    return cards;
                })(),
            };
        }

        // Check for Jacks or Better
        if (has2 && (has2.rank >= 11 || has2.rank === 1)) {
            return {
                rank: Ranks.JACKS_OR_BETTER,
                scoringCards: has2.cards,
            };
        }

        // Default case: Nothing
        return {
            rank: Ranks.NOTHING,
            scoringCards: [],
        };
    }
}
