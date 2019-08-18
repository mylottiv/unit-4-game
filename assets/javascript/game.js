$(document).ready(function (){
    // Game object to hold global variables and arrays
    const Game = {
        // Database array to store all created character
        characterDatabase: [],
        wins: 0,
        losses: 0,
        playerSelected: false,
        enemySelected: false,
        currentPlayer: '',
        currentEnemy: '',
        defeatedEnemies: 0,
    }
    // Hardcode the characters for now
    Game.characterDatabase[0] = characterFactory('Sisko', 'assets/images/BenSisko.jpg', 100, 15, 5);
    Game.characterDatabase[1] = characterFactory("G'Kar", 'assets/images/GKar.jpg', 90, 15, 10);
    Game.characterDatabase[2] = characterFactory('Greedo', 'assets/images/Greedo.jpg', 70, 10, 15);
    Game.characterDatabase[3] = characterFactory('Skywalker', 'assets/images/luke-skywalker-1_5f370d5f.jpeg', 120, 5, 5);
    Game.characterDatabase[4] = characterFactory('Worf', 'assets/images/wharf.jpg', 80, 20, 10);
    Game.characterDatabase[5] = characterFactory('Xenomorph', 'assets/images/xenomorph.jpg', 100, 5, 15);
    // Calls character card initializer
    initializeCharacterCards(); 
    // Choose the player and enemy character by clicking on their cards
    // Parent is used to get the holder for a larger clickbox
    $('.available-character-card').parent().click(function (){
        // First checks if there is a currently selected player character
        if (!Game.playerSelected){
            // Creates a player card for selected character
            // Initializes pointer as a reference to the card itself
            let pointer = $(this).children().attr('id');
            Game.characterDatabase.find(char => char.name === pointer).displayNewCard('player');
            // Sets playerSelected flag and updates currentPlayer pointer
            Game.playerSelected = true;
            Game.currentPlayer = pointer;
            // Updates combat display
            $('#combat-output').children('.col').text(`Choose your Foe`)
        }
        // Then checks if there is a currently selected enemy character
        else if (!Game.enemySelected){
            // Creates an enemy card
            // Initializes pointer as a reference to the card itself
            let pointer = $(this).children().attr('id');
            Game.characterDatabase.find(char => char.name === pointer).displayNewCard('enemy');
            // Sets enemySelected flag and updates currentEnemy pointer
            Game.enemySelected = true;
            Game.currentEnemy = pointer;
            // Updates combat display
            $('#combat-output').children('.col').text(`Click the attack button to begin!`)
        }
    })
    // Initiate a round of combat by clicking the attack button
    $('#attack-button').click(function(){
        // First checks if both an enemy and a player have been selected
        if (!Game.playerSelected){
            $('#combat-output').children('.col').text(`Click a character to choose your Avatar!`);
            return
        }
        else if (!Game.enemySelected){
            $('#combat-output').children('.col').text(`Click a character to choose your Foe!`);
            return
        }
        // Initializes pointers
        let player = Game.characterDatabase.find(char => char.name === Game.currentPlayer)
        let enemy = Game.characterDatabase.find(char => char.name === Game.currentEnemy)
        // Applies damage to both characters
        player.takeDamage(enemy.counter);
        enemy.takeDamage(player.attack);
        // Updates combat display
        $('#combat-output').children('.col').text(`
            You inflict ${player.attack} damage! Your Foe inflicts ${enemy.counter} damage`);
        // Updates player attack
        player.updateAttack();
        // Checks if player is dead
        // Even if enemy also dead, loss on player death no matter what
        if (player.HP <= 0){
            // Reinitialize player and enemy cards
            player.reset();
            enemy.reset();
            // Increment losses
            Game.losses++;
            // Call character card initializer
            initializeCharacterCards();
            // Initializes Player AND Enemy flags
            Game.playerSelected = false;
            Game.enemySelected = false;
            Game.defeatedEnemies = 0;
            // Updates relevant displays
            $('#combat-output').children('.col').text(`Choose your Avatar!`);
            $('#enemies-defeated').text(`Enemies Defeated: ${Game.defeatedEnemies}`)
            $('#win-loss').text(`Wins: ${Game.wins} Losses: ${Game.losses}`)
        }
        // Checks if enemy is dead
        if (enemy.HP <= 0){
            // Clears dead enemy from the enemy area
            enemy.destroyOldCard();
            // Resets enemy stats (the dead enemy will remain without a card until game over
            enemy.reset();
            // Resets enemySelected
            Game.enemySelected = false;
            // Increments defeatedEnemies
            Game.defeatedEnemies++;
            // Updates enemies-defeated display
            $('#enemies-defeated').text(`Enemies Defeated: ${Game.defeatedEnemies}`);
            // Checks if the last enemy has been destroyed
            if (Game.defeatedEnemies === 5){
                // Reinitialize player and enemy cards
                player.reset();
                enemy.reset();
                // Increment wins
                Game.wins++;
                // Call character card initializer
                initializeCharacterCards();
                // Reinitializes Player AND Enemy flags
                Game.playerSelected = false;
                Game.enemySelected = false;
                Game.defeatedEnemies = 0;
                // Updates relevant displays
                $('#combat-output').children('.col').text(`Choose your Avatar!`);
                $('#enemies-defeated').text(`Enemies Defeated: ${Game.defeatedEnemies}`);
                $('#win-loss').text(`Wins: ${Game.wins} Losses: ${Game.losses}`);
            }
        }
        console.log(`Wins: ${Game.wins}`);
        console.log(`Losses: ${Game.losses}`)
    })
    // Initializes character cards for all characters
    function initializeCharacterCards(){
        for (let i = 0; i < 6; i++){
            Game.characterDatabase[i].displayNewCard(i);
        }
    }
    // Factory function for Character objects
    function characterFactory(name, image, HP, baseAttack, counter){
        let character = {
            name: name,
            image: image,
            baseHP: HP,
            HP: HP,
            baseAttack: baseAttack,
            counter: counter,
            attack: baseAttack,
            position: '',
            displayNewCard: function(newPosition){
                if (this.position !== ''){
                    this.destroyOldCard();
                }
                let newHTML = ''
                if (newPosition === 'player'){                    
                    newHTML = `
                        <div id=${this.name} class='card-body'>
                            <h4 class='card-header'>
                                Player
                            </h4>
                            <h5 class='card-subtitle name'>
                                ${this.name}
                            </h5>
                            <img src='${this.image}' class='character-img img-thumbnail'>
                            <p class='card-text hit-points'>
                                HP: ${this.HP}
                            </p>
                            <p class='card-text attack'>
                                Attack: ${this.attack}
                            </p>
                        </div>`;
                }
                else if (newPosition === 'enemy'){
                    newHTML = `
                        <div id=${this.name} class='card-body'>
                            <h4 class='card-header'>
                                Player
                            </h4>
                            <h5 class='card-subtitle name'>
                                ${this.name}
                            </h5>
                            <img src='${this.image}' class='character-img img-thumbnail'>
                            <p class='card-text hit-points'>
                                HP: ${this.HP}
                            </p>
                            <p class='card-text attack'>
                                Counter: ${this.counter}
                            </p>
                        </div>`;
                }
                else {
                    newHTML = `
                        <div id=${this.name} class='card-body available-character-card'>
                            <h5 class='card-subtitle name'>
                                ${this.name}
                            </h5>
                            <img src='${this.image}' class='character-img img-thumbnail'>
                            <p class='card-text hit-points'>
                                HP: ${this.HP}
                            </p>
                            <p class='card-text base-attack'>
                                Attack: ${this.baseAttack}
                            </p>
                            <p class='card-text counter'>
                                Counter: ${this.counter}
                            </p>
                        </div>`;
                }
                $(`#card-holder-${newPosition}`).html(newHTML);
                this.position = newPosition;
            },
            destroyOldCard: function(){
                $(`#card-holder-${this.position}`).children().remove();
            },
            updateAttack: function(){
                // Updates attack stat with baseAttack
                this.attack += this.baseAttack;
                // Updates character card attack stat display
                $(`#card-holder-${this.position}`).children().children('.attack').text(`Attack: ${this.attack}`);
            },
            takeDamage: function(damage){
                this.HP -= damage;
                // Updates character card HP display
                $(`#card-holder-${this.position}`).children().children('.hit-points').text(`HP: ${this.HP}`);
            },
            reset: function(){
                this.HP = this.baseHP;
                this.attack = this.baseAttack;
                this.pointer = '';
                // Does not update character card because this function only called on character death
                // Or Game Over
            },
        }
        return character;
    }
})