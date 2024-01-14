var Suit;
(function (Suit) {
    Suit[Suit["Spades"] = 0] = "Spades";
    Suit[Suit["Clubs"] = 1] = "Clubs";
    Suit[Suit["Hearts"] = 2] = "Hearts";
    Suit[Suit["Diamonds"] = 3] = "Diamonds";
})(Suit || (Suit = {}));
;
var Card = /** @class */ (function () {
    function Card(rank, suit) {
        this.rank = rank;
        this.suit = suit;
    }
    Object.defineProperty(Card.prototype, "rankName", {
        get: function () {
            return Card.rankNames[this.rank - 1];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Card.prototype, "suitName", {
        get: function () {
            return Suit[this.suit];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Card.prototype, "name", {
        get: function () {
            return this.rankName + ' of ' + this.suitName;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Card.prototype, "imageName", {
        get: function () {
            var s, r;
            if (this.rank === 1 || this.rank > 10) {
                r = this.rankName.charAt(0);
            }
            else {
                r = this.rank + '';
            }
            s = this.suitName.charAt(0);
            return r + s + '.svg';
        },
        enumerable: false,
        configurable: true
    });
    Card.rankNames = [
        'Ace',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        'Jack',
        'Queen',
        'King',
    ];
    return Card;
}());
var Deck = /** @class */ (function () {
    function Deck() {
        this.cards = [];
        for (var s = 0; s < 4; s++) {
            for (var r = 1; r <= 13; r++) {
                this.cards.push(new Card(r, s));
            }
        }
    }
    Deck.prototype.shuffle = function () {
        var _a;
        for (var i = this.cards.length; i > 0; i--) {
            var j = Math.floor(Math.random() * i);
            _a = [this.cards[j], this.cards[i - 1]], this.cards[i - 1] = _a[0], this.cards[j] = _a[1];
        }
    };
    Deck.prototype.draw = function () {
        return this.cards.shift();
    };
    return Deck;
}());
;
;
var Ranks = {
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
;
var Kinds = /** @class */ (function () {
    function Kinds(cards) {
        var _this = this;
        this.kinds = {};
        cards.forEach(function (c) {
            var r = c.rank;
            if (_this.kinds[r] === undefined)
                _this.kinds[r] = [];
            _this.kinds[r].push(c);
        });
    }
    Kinds.prototype.has = function (numOfKinds) {
        var kg = this.all(numOfKinds);
        if (kg)
            return kg[0];
        return false;
    };
    Kinds.prototype.all = function (numOfKinds) {
        var result = [];
        for (var _i = 0, _a = Object.keys(this.kinds); _i < _a.length; _i++) {
            var rank = _a[_i];
            if (this.kinds[rank].length === numOfKinds) {
                result.push({
                    cards: this.kinds[rank],
                    rank: +rank,
                });
            }
        }
        if (result.length === 0)
            return false;
        return result;
    };
    return Kinds;
}());
var Hand = /** @class */ (function () {
    function Hand(cards) {
        if (cards !== undefined) {
            this.cards = cards;
        }
        else {
            this.cards = [];
        }
    }
    Hand.prototype.isFlush = function () {
        var suit = this.cards[0].suit;
        return this.cards.every(function (c) { return c.suit === suit; });
    };
    Hand.prototype.isStraight = function () {
        return this.isAceHighStraight() || this.isAceLowStraight();
    };
    Hand.prototype.isAceHighStraight = function () {
        var high, low, ranks = [];
        high = low = this.cards[0].rank;
        for (var i = 0; i < this.cards.length; i++) {
            var c = this.cards[i];
            var r = c.rank;
            if (r === 1)
                r = 14;
            if (ranks.indexOf(r) !== -1)
                return false;
            ranks.push(r);
            if (r > high)
                high = r;
            if (r < low)
                low = r;
        }
        return high - low === 4;
    };
    Hand.prototype.isAceLowStraight = function () {
        var high, low, ranks = [];
        high = low = this.cards[0].rank;
        for (var i = 0; i < this.cards.length; i++) {
            var c = this.cards[i];
            var r = c.rank;
            if (ranks.indexOf(r) !== -1)
                return false;
            ranks.push(r);
            if (r > high)
                high = r;
            if (r < low)
                low = r;
        }
        return high - low === 4;
    };
    Hand.prototype.has = function () {
        var ranks = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            ranks[_i] = arguments[_i];
        }
        return this.cards.some(function (c) {
            var r = c.rank, i = ranks.indexOf(r);
            if (i !== -1) {
                ranks.splice(i, 1);
            }
            return ranks.length === 0;
        });
    };
    Hand.prototype.getScore = function () {
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
        var kinds = new Kinds(this.cards);
        var has4 = kinds.has(4);
        if (has4) {
            return {
                rank: Ranks.FOUR_OF_A_KIND,
                scoringCards: has4.cards,
            };
        }
        var has3 = kinds.has(3), has2 = kinds.has(2);
        if (has3 && has2) {
            return {
                rank: Ranks.FULL_HOUSE,
                scoringCards: this.cards,
            };
        }
        if (this.isFlush()) {
            return {
                rank: Ranks.FLUSH,
                scoringCards: this.cards,
            };
        }
        if (this.isStraight()) {
            return {
                rank: Ranks.STRAIGHT,
                scoringCards: this.cards,
            };
        }
        if (has3) {
            return {
                rank: Ranks.THREE_OF_A_KIND,
                scoringCards: has3.cards,
            };
        }
        var all2 = kinds.all(2);
        if (all2 && all2.length === 2) {
            return {
                rank: Ranks.TWO_PAIR,
                scoringCards: (function () {
                    var cards = [];
                    all2.forEach(function (kg) {
                        cards = cards.concat(kg.cards);
                    });
                    return cards;
                })(),
            };
        }
        if (has2 && (has2.rank >= 11 || has2.rank === 1)) {
            return {
                rank: Ranks.JACKS_OR_BETTER,
                scoringCards: has2.cards,
            };
        }
        return {
            rank: Ranks.NOTHING,
            scoringCards: [],
        };
    };
    return Hand;
}());
var Round = /** @class */ (function () {
    function Round(bet) {
        this.bet = bet;
        this.deck = new Deck();
        this.deck.shuffle();
        this.hand = new Hand();
    }
    Round.prototype.draw = function () {
        this.hand.cards.push(this.deck.draw());
        this.hand.cards.push(this.deck.draw());
        this.hand.cards.push(this.deck.draw());
        this.hand.cards.push(this.deck.draw());
        this.hand.cards.push(this.deck.draw());
    };
    return Round;
}());
var UI = /** @class */ (function () {
    function UI(parent) {
        this.parent = parent;
        this.cashDisplay = parent.querySelector('.cash');
        this.betInput = parent.querySelector('.bet-input');
        this.betButton = parent.querySelector('.bet-button');
        this.playButton = parent.querySelector('.play-button');
        this.resetButton = parent.querySelector('.reset-button');
        this.cardsListElement = parent.querySelector('.cards');
        this.msg = parent.querySelector('.msg');
        this._cards = new Map();
    }
    UI.prototype.betMode = function () {
        this.betInput.disabled = false;
        this.betButton.disabled = false;
        this.playButton.disabled = true;
        this.resetButton.disabled = true;
    };
    UI.prototype.playMode = function () {
        this.betInput.disabled = true;
        this.betButton.disabled = true;
        this.playButton.disabled = false;
        this.resetButton.disabled = true;
    };
    UI.prototype.gameOverMode = function () {
        this.betInput.disabled = true;
        this.betButton.disabled = true;
        this.playButton.disabled = true;
        this.resetButton.disabled = false;
    };
    UI.prototype.enableCards = function () {
        this.cards.forEach(function (c) {
            c.disabled = false;
        });
    };
    UI.prototype.disableCards = function () {
        this.cards.forEach(function (c) {
            c.disabled = true;
        });
    };
    UI.prototype.updateCash = function (cash) {
        this.cashDisplay.textContent = '$' + cash;
    };
    Object.defineProperty(UI.prototype, "cards", {
        get: function () {
            return this._cards;
        },
        enumerable: false,
        configurable: true
    });
    UI.prototype.addCard = function (card) {
        var u = new UICard(card);
        this._cards.set(card, u);
        this.cardsListElement.appendChild(u.element);
        return u;
    };
    UI.prototype.replaceCard = function (newCard, oldCard) {
        var oldUICard = this._cards.get(oldCard);
        if (oldUICard === undefined)
            throw 'Card not in display';
        var u = new UICard(newCard);
        this.cardsListElement.replaceChild(u.element, oldUICard.element);
        this._cards.delete(oldCard);
        this._cards.set(newCard, u);
        return u;
    };
    UI.prototype.clearCards = function () {
        this._cards = new Map();
        while (this.cardsListElement.firstChild) {
            this.cardsListElement.removeChild(this.cardsListElement.firstChild);
        }
    };
    return UI;
}());
var UICard = /** @class */ (function () {
    function UICard(card) {
        var _this = this;
        this.element = document.createElement('div');
        this.img = document.createElement('img');
        this.disabled = false;
        this._discarded = false;
        this._highlighted = false;
        this.card = card;
        this.element.classList.add('card');
        this.element.appendChild(this.img);
        this.img.src = 'img/' + this.card.imageName;
        this.element.addEventListener('click', function () {
            if (!_this.disabled)
                _this.discarded = !_this.discarded;
        });
    }
    Object.defineProperty(UICard.prototype, "discarded", {
        get: function () {
            return this._discarded;
        },
        set: function (value) {
            this._discarded = value;
            this.element.classList.toggle('discarded', this.discarded);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UICard.prototype, "highlighted", {
        get: function () {
            return this._highlighted;
        },
        set: function (value) {
            this._highlighted = value;
            this.element.classList.toggle('highlighted', this.highlighted);
        },
        enumerable: false,
        configurable: true
    });
    return UICard;
}());
var ui = new UI(document.querySelector('main')), round, player = {
    cash: 100,
};
function init() {
    reset();
    ui.betButton.addEventListener('click', function () {
        var bet = parseInt(ui.betInput.value);
        if (bet > player.cash && bet <= 0)
            return;
        round = new Round(bet);
        round.draw();
        player.cash -= bet;
        updateCash();
        round.hand.cards.forEach(function (c) {
            ui.addCard(c);
        });
        ui.playMode();
        msg('Click on the cards you wish to discard');
    });
    ui.playButton.addEventListener('click', function () {
        round.hand.cards.forEach(function (c, i) {
            var u = ui.cards.get(c);
            if (u.discarded) {
                var newCard = round.deck.draw();
                round.hand.cards[i] = newCard;
                ui.replaceCard(newCard, c);
            }
        });
        var score = round.hand.getScore(), payout = score.rank.payout * round.bet;
        player.cash += payout;
        updateCash();
        score.scoringCards.forEach(function (c) {
            ui.cards.get(c).highlighted = true;
        });
        ui.gameOverMode();
        ui.disableCards();
        msg('Hand: ' + score.rank.name + '<br>Winnings: $' + payout);
    });
    ui.resetButton.addEventListener('click', function () {
        reset();
    });
}
function reset() {
    ui.betMode();
    ui.clearCards();
    ui.enableCards();
    clearMsg();
}
function updateCash() {
    ui.updateCash(player.cash);
}
function msg(str) {
    ui.msg.innerHTML += str + '<br>';
}
function clearMsg() {
    ui.msg.innerHTML = '';
}
init();
//# sourceMappingURL=app.js.map