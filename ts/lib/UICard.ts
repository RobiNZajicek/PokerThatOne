// Class representing the UI for an individual card in the poker game
class UICard {
    // Public properties
    public readonly card: Card; // The corresponding Card object
    public readonly element: Element = document.createElement('div'); // HTML element for the card
    public readonly img: HTMLImageElement = document.createElement('img'); // Image element for the card
    public disabled: boolean = false; // Flag indicating whether the card is disabled
    private _discarded: boolean = false; // Flag indicating whether the card is discarded
    private _highlighted: boolean = false; // Flag indicating whether the card is highlighted

    // Constructor to initialize the UICard with a corresponding Card object
    public constructor(card: Card) {
        this.card = card;
        this.element.classList.add('card'); // Add 'card' class to the element
        this.element.appendChild(this.img); // Append the image element to the card element
        this.img.src = 'img/' + this.card.imageName; // Set the image source based on the Card's imageName

        // Add a click event listener to the card element
        this.element.addEventListener('click', () => {
            // If the card is not disabled, toggle its discarded state on click
            if (!this.disabled)
                this.discarded = !this.discarded;
        });
    }

    // Getter for the discarded state of the card
    public get discarded(): boolean {
        return this._discarded;
    }

    // Getter for the highlighted state of the card
    public get highlighted(): boolean {
        return this._highlighted;
    }

    // Setter for the discarded state of the card
    public set discarded(value: boolean) {
        this._discarded = value;
        // Toggle the 'discarded' class on the element based on the discarded state
        this.element.classList.toggle('discarded', this.discarded);
    }

    // Setter for the highlighted state of the card
    public set highlighted(value: boolean) {
        this._highlighted = value;
        // Toggle the 'highlighted' class on the element based on the highlighted state
        this.element.classList.toggle('highlighted', this.highlighted);
    }
}
