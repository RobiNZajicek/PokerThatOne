// Class representing the User Interface for a poker game
class UI {
    // Private properties
    private parent: Element;
    private cashDisplay: Element;
    private cardsListElement: Element;
    private _cards: Map<Card, UICard>;

    // Public properties for UI elements
    public readonly betInput: HTMLInputElement;
    public readonly betButton: HTMLButtonElement;
    public readonly playButton: HTMLButtonElement;
    public readonly resetButton: HTMLButtonElement;
    public readonly msg: HTMLParagraphElement;

    // Constructor to initialize UI elements
    public constructor(parent: Element) {
        // Set parent element and initialize UI elements
        this.parent = parent;
        this.cashDisplay = <Element>parent.querySelector('.cash');
        this.betInput = <HTMLInputElement>parent.querySelector('.bet-input');
        this.betButton = <HTMLButtonElement>parent.querySelector('.bet-button');
        this.playButton = <HTMLButtonElement>parent.querySelector('.play-button');
        this.resetButton = <HTMLButtonElement>parent.querySelector('.reset-button');
        this.cardsListElement = <Element>parent.querySelector('.cards');
        this.msg = <HTMLParagraphElement>parent.querySelector('.msg');

        // Initialize a Map to store Card and UICard associations
        this._cards = new Map();
    }

    // Method to set the UI in bet mode
    public betMode(): void {
        this.betInput.disabled = false;
        this.betButton.disabled = false;
        this.playButton.disabled = true;
        this.resetButton.disabled = true;
    }

    // Method to set the UI in play mode
    public playMode(): void {
        this.betInput.disabled = true;
        this.betButton.disabled = true;
        this.playButton.disabled = false;
        this.resetButton.disabled = true;
    }

    // Method to set the UI in game over mode
    public gameOverMode(): void {
        this.betInput.disabled = true;
        this.betButton.disabled = true;
        this.playButton.disabled = true;
        this.resetButton.disabled = false;
    }

    // Method to enable user interaction with cards
    public enableCards(): void {
        this.cards.forEach((c) => {
            c.disabled = false;
        });
    }

    // Method to disable user interaction with cards
    public disableCards(): void {
        this.cards.forEach((c) => {
            c.disabled = true;
        });
    }

    // Method to update the displayed cash amount
    public updateCash(cash: number): void {
        this.cashDisplay.textContent = '$' + cash;
    }

    // Getter for the Map of Card and UICard associations
    public get cards(): Map<Card, UICard> {
        return this._cards;
    }

    // Method to add a new card to the UI
    public addCard(card: Card): UICard {
        let u = new UICard(card);
        this._cards.set(card, u);

        this.cardsListElement.appendChild(u.element);

        return u;
    }

    // Method to replace an old card with a new card in the UI
    public replaceCard(newCard: Card, oldCard: Card): UICard {
        let oldUICard = this._cards.get(oldCard);

        if (oldUICard === undefined)
            throw 'Card not in display';

        let u = new UICard(newCard);

        this.cardsListElement.replaceChild(u.element, oldUICard.element);
        this._cards.delete(oldCard);
        this._cards.set(newCard, u);

        return u;
    }

    // Method to clear all cards from the UI
    public clearCards(): void {
        this._cards = new Map();

        while (this.cardsListElement.firstChild) {
            this.cardsListElement.removeChild(this.cardsListElement.firstChild);
        }
    }
}
