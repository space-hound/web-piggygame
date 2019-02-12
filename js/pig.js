var PiggyGame = (function(){
    
    var Dicer = (function(){
        const FACES = [ 'one', 'two', 'three', 'four', 'five', 'six' ];
        
        let rnd = function(min, max){
            return Math.floor(Math.random() * (max - min) + min);
        }
        
        function Dicer(container){
            this.container = sQ(container);
        }
        
        let builder = function(face){
            let dice = '<div class="dice ' + FACES[face] + '">';
            for(let i = 0; i <= face; i++){
                dice += '<div></div>';
            }
            dice += '</div>';
            
            return dice;
        }
        
        Dicer.prototype.roll = function(){
            this.container.children().remove();
            
            let face = rnd(0, 6);
            
            this.container.append(builder(face));
            
            return face;
        }
        
        return function(container){
            return new Dicer(container);
        }
        
    })();
    
    var Player = (function(){
        
        function Player(container){
            this.container = sQ(container);
            
            this.name = container;
            
            this.totalScore = 0;
            this.currentScore = 0;
            
            this.isCurrent = false;
        }
        
        Player.prototype.resetAll = function(){
            this.resetTotal();
            this.resetCurrent();
            this.isCurrent = false;
        }
        
        Player.prototype.startTurn = function(){
            this.container.toggleClass('current-player');
            this.isCurrent = true;
        }
        
        Player.prototype.endTurn = function(){
            this.container.toggleClass('current-player');
            this.isCurrent = false;
        }
        
        Player.prototype.updateCurrentInfo = function(){
            let info = this.container.find('.info .current-score');
            info.text(this.currentScore);
        }
        
        Player.prototype.addCurrent = function(score){
            this.currentScore += score;
            this.updateCurrentInfo();
        }
        
        Player.prototype.resetCurrent = function(){
            this.currentScore = 0;
            this.updateCurrentInfo();
        }
        
        Player.prototype.updateTotalInfo = function(){
            let info = this.container.find('.info .total-score');
            info.text(this.totalScore);
        }
        
        Player.prototype.addTotal = function(){
            this.totalScore += this.currentScore;
            this.updateTotalInfo();
        }
        
        Player.prototype.resetTotal = function(){
            this.totalScore = 0;
            this.updateTotalInfo();
        }
        
        Player.prototype.isWinner = function(){
            if(this.totalScore >= 50){
                return true;
            }
            
            return false;
        }
        
        Player.prototype.Roll = function(Dices){
            if(!this.isCurrent){
                return;
            }
            
            let rolls = Dices.roll();
            
            let sum = 0;
            
            rolls.forEach((roll) => {
                sum += roll
            });
            
            if(sum === 2 || sum === 12){
                this.resetCurrent();
                this.endTurn();
                return ;
            }
            
            this.addCurrent(sum);
        }
        
        Player.prototype.Hold = function(){
            if(!this.isCurrent){
                return;
            }
            
            this.addTotal();
            this.resetCurrent();
            this.endTurn();
        }
        
        return Player;
        
    })();
    
    var Game = (function(){
        const PLAYERS = ['.player-1', '.player-2'];
        
        function DiceTable(){
            this.diceTable = sQ('#dices').children();
            this.loadDices();
        }
        
        DiceTable.prototype.loadDices = function(){
            this.dices = [];
            let self = this;
            this.diceTable.each(function(el){
                self.dices.push(Dicer(el));
            });
        }
        
        DiceTable.prototype.roll = function(){
            let _dices = [];
            this.dices.forEach((dc) => {
                _dices.push(dc.roll() + 1);
            });
            
            console.log(_dices);
            return _dices;
        }
        
        function Game(){            
            this.diceTable = new DiceTable();
            this.loadPlayers();
            this.onRoll();
            this.onHold();
            this.onEnd();
        }
        
        Game.prototype.loadPlayers = function(){
            this.players = [];
            PLAYERS.forEach((pl) => {
                this.players.push(new Player(pl));
            });
            
            this.players[0].startTurn();
            this.current = 0;
        }
        
        Game.prototype.nextTurn = function(){
            if(this.players[this.current].isWinner()){
                this.players[this.current].endTurn();
                this.endGame(this.players[this.current].name);
                return;
            }
            
            if(!this.players[this.current].isCurrent){
                this.current++;
                if(this.current >= this.players.length){
                    this.current = 0;
                }
                this.players[this.current].startTurn();
            }
        }
        
        Game.prototype.onRoll = function(){
            let self = this;
            sQ('.player-1').on('click', 'button.roll', function(evt){
                self.players[0].Roll(self.diceTable);
                self.nextTurn();
            });
            sQ('.player-2').on('click', 'button.roll', function(evt){
                self.players[1].Roll(self.diceTable);
                self.nextTurn();
            });
        }
        
        Game.prototype.onHold = function(){
            let self = this;
            sQ('.player-1').on('click', 'button.hold', function(){
                self.players[0].Hold();
                self.nextTurn();
            });
            sQ('.player-2').on('click', 'button.hold', function(){
                self.players[1].Hold();
                self.nextTurn();
            });
        }
        
        Game.prototype.resetAll = function(){
            this.players.forEach((pl) => {
               pl.resetAll(); 
            });
            
            this.players[this.current].isCurrent = true;
        }
        
        Game.prototype.onEnd = function(){
            let self = this;
            sQ('.end-game').on('click', function(evt){
                if(sQ(this).css('display') === 'flex'){
                    self.resetAll();
                    sQ(this).css('display', 'none');
                } 
            });
        }
        
        Game.prototype.endGame = function(name){
            sQ('.end-game').css('display', 'flex')
            .find('p').text(name + ' WINS !');
        }
        
        return function(){
            return new Game();
        }
    })();
    
    return Game;
    
})();


document.addEventListener('DOMContentLoaded', function(){
    PiggyGame();
});
