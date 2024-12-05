class Player{
    constructor(money, position){
        this.money = money;
        this.hand = [];
        this.sum = [0,0];
        this.position = position;
        this.cardsPositions = [];
        this.chipsValues = ["1", "5", "10", "25", "50", "100"];
        this.wallet = [5,2,2,1,1,1]; // Cantidad de fichas de cada tipo que tiene
    }

    calculateCardsPositions(spacing, allCards = true){
        const amountCards = allCards ? this.hand.length : this.hand.length-1;
        const cardsPositions = [];
        for(let i = 0 ; i < amountCards ; i++){
            const j = i-(amountCards-1)/2;
            cardsPositions.push({x:this.position.x + j*spacing,y: this.position.y});
        }
        this.cardsPositions = cardsPositions;
    }

    drawCards(ctx, cw, ch, crupier = false){
        for(let i = 0 ; i < this.hand.length ; i++){
            const card = this.hand[i];
            card.draw(ctx, this.cardsPositions[i].x, this.cardsPositions[i].y, cw, ch);
        }
    }

    sumCards(){
        let sum1 = 0;
        let sum2 = 0;

        this.hand.forEach((card) => {
            if(card.number == 1){
                sum1 += 1;
                sum2 += 11;
            } else if(card.number == 11 || card.number == 12 || card.number == 13){
                sum1 += 10;
                sum2 += 10;
            } else {
                sum1 += card.number;
                sum2 += card.number;
            }
        });

        this.sum = [sum1, sum2];
    }

    // cuando el jugador es el crupier no quieres que se sumen todas las cartas al principio porque sabrias cuanto tiene
    // entonces solo sumamos la primera carta
    sumCardsCrupier(){ 
        let sum1 = 0;
        let sum2 = 0;

        const card = this.hand[0];

        if(card.number == 1){
            sum1 += 1;
            sum2 += 11;
        } else if(card.number == 11 || card.number == 12 || card.number == 13){
            sum1 += 10;
            sum2 += 10;
        } else {
            sum1 += card.number;
            sum2 += card.number;
        }
        this.sum = [sum1, sum2];
    }
}