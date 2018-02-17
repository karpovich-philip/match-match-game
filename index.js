class MatchGame {
    constructor() {
        this.amountOpenCards = 0;
        this.currentCards = [];
        this.handleStopWatch = null;
        this.currentCardBack = null;
        this.activeCardBack = null;
        this.activeLevel = null;
        this.activeBg = null;
        this.minutes = 0;
        this.seconds = 0;
        this.hours = 0;
    }

    init() {
        this.settingsMenu = document.querySelector('#settingsWrapper');
        this.gameField = document.querySelector('main > .container');
        this.newGameBtn = document.querySelector('#newGame');
        this.headerMenu = document.querySelector('.menuWrap');
        this.startBtn = document.querySelector("#startBtn");
        this.rulesBtn = document.querySelector('#rulesBtn');
        this.watch = document.querySelector("#stopWatch");

        this.settingsMenu.onclick = this.getParameters.bind(this);
        this.rulesBtn.onclick = this.hiddenRulesPage.bind(this);
        this.startBtn.onclick = this.runGame.bind(this);
        this.gameField.onclick = this.openCard.bind(this);
        this.newGameBtn.onclick = this.runNewGame.bind(this);
    }

    getParameters (event) {
        let target = event.target;
        if (target.tagName === 'IMG' || target.tagName === 'BUTTON') {
            let targetClass = target.getAttribute('class');
            this.activeElement(target, targetClass);
            return false;
        }
    }

    activeElement (target, targetClass) {
        if (targetClass === 'cardBack') {
            if (this.activeCardBack) {this.activeCardBack.classList.remove('active')}
            this.activeCardBack = target;
            this.activeCardBack.classList.add('active');
        } else if (targetClass === 'board') {
            if (this.activeBg) {this.activeBg.classList.remove('active')}
            this.activeBg = target;
            this.activeBg.classList.add('active');
        } else if (targetClass === 'btn') {
            if (this.activeLevel) {this.activeLevel.classList.remove('active')}
            this.activeLevel = target;
            this.activeLevel.classList.add('active');
        }
    }

    hiddenRulesPage (event) {
        let rulesPage = document.querySelector('#rulesPage');
        this.settingsMenu.classList.remove('hidden');
        rulesPage.classList.add('hidden');
        event.stopPropagation(); //для своевременного запуска таймера
        return false;
    }

    runGame () {
        let innerHTMLGameField = [];
        let currentLevel = document.querySelector('.btn.active');
        let currentBg = document.querySelector('.board.active');
        this.currentCardBack = document.querySelector('.cardBack.active');

        if(!currentLevel || !currentBg || !this.currentCardBack) {
            alert('Select the required parameters!');
            return;
        }

        currentLevel = parseInt(currentLevel.getAttribute('id'));
        currentBg = currentBg.getAttribute('src');
        this.currentCardBack = this.currentCardBack.getAttribute('id');

        this.gameField.classList.add('align');

        this.gameField.classList.remove('hidden');
        this.settingsMenu.classList.add('hidden');
        this.headerMenu.classList.remove('hidden');
        this.headerMenu.classList.add('menuWrap');

        document.querySelector('body').style.backgroundImage = `url('${currentBg}')`;

        for (let i = 0; i < currentLevel / 2; i++) {
            innerHTMLGameField.push(`<div id='${i}' class="card card${i} ${this.currentCardBack}"> </div>`);
            innerHTMLGameField.push(`<div id='${i + currentLevel / 2}' class="card card${i} ${this.currentCardBack}"> </div>`);
        }

        this.gameField.innerHTML = `<section class="gameFieldWrap">${innerHTMLGameField.sort(this.sortRandom).join('')}</section>`;
    }

    openCard (event) {
        let target = event.target;
        if (!target.classList.contains('card')) return; //проверка на клик не по картинке
        if (this.amountOpenCards === 2) return; //проверка на колчиество одновременно открытых картинок (не больше двух)
        if (target === this.currentCards[0]) return; //проверка на повторный клик по открытой картинке
        if (this.watch.innerHTML === '00:00:00') this.stopWatch();
        this.amountOpenCards++;
        this.currentCards.push(target);
        target.classList.add('openCard');
        target.classList.remove('closeCard');
        target.classList.remove(this.currentCardBack);

        if (this.currentCards.length === 2) {
            setTimeout(this.compareCards.bind(this), 1000, ...this.currentCards, this.currentCardBack);
        }
    }

    compareCards (cardOne, cardTwo, cardBack) {
        if (cardOne.className === cardTwo.className &&
            cardOne.attributes[0].value !== cardTwo.attributes[0].value) {
            this.rotate (cardOne, cardTwo, cardBack);
            setTimeout(this.closingCards.bind(this), 300, cardOne, cardTwo);
        } else {
            this.rotate(cardOne, cardTwo, cardBack);
        }
        this.currentCards = [];
        this.amountOpenCards = 0;
    }

    rotate (cardOne, cardTwo, cardBack) {
        cardOne.classList.remove('openCard');
        cardTwo.classList.remove('openCard');
        cardOne.classList.add('closeCard');
        cardTwo.classList.add('closeCard');
        cardOne.classList.add(cardBack);
        cardTwo.classList.add(cardBack);
    }

    closingCards (cardOne, cardTwo) {
        cardOne.classList.add('invisible');
        cardTwo.classList.add('invisible');
        //debugger
        this.isFinish();
    }

    sortRandom (a, b) {
        return Math.random() - 0.5;
    }

    stopWatch () {
        this.seconds++;
        if (this.seconds >= 60) {
            this.seconds = 0;
            this.minutes++;
            if (this.minutes >= 60) {
                this.minutes = 0;
                this.hours++;
            }
        }
        this.watch.innerHTML =
            (this.hours > 9 ? this.hours : '0' + this.hours) + ":" +
            (this.minutes > 9 ? this.minutes : '0' + this.minutes) + ":" +
            (this.seconds > 9 ? this.seconds : '0' + this.seconds);
        this.handleStopWatch = setTimeout(this.stopWatch.bind(this), 1000);
    }

    runNewGame () {
        let res = confirm('Are you sure?');
        if (res) {
            this.headerMenu.classList.remove('menuWrap');
            this.headerMenu.classList.add('hidden');
            this.gameField.classList.add('hidden');
            this.settingsMenu.classList.remove('hidden');
            this.watch.innerHTML = '00:00:00';
            clearTimeout(this.handleStopWatch);
            this.hours = 0;
            this.minutes = 0;
            this.seconds = 0;
        }
    }

    isFinish () {
        let children = document.querySelector('.gameFieldWrap').children;
        for (let i = 0; i < children.length; i++) {
            if (!children[i].classList.contains('invisible')) return;
        }
        clearTimeout(this.handleStopWatch);
        this.gameField.innerHTML = `<h1>Congratulations! Your result ${this.watch.innerHTML}!</h1>`;
    }
}

let newGame = new MatchGame();
newGame.init();
