# web-piggygame

[Live Demo Here!](https://space-hound.github.io/web-piggygame/)

A simple piggy game made in JavaScript without any library or framework. This was made for study purposes.

The rules are:
 - The player with the black background is the current player.
 - Each player can roll the dices until they either hold the score or lose the current score.
 - If the dices are `1 - 1` or `6 - 6` the player loose the current score.
 - If it holds the current score, it will be added to the total score.
 - The players to reach first to 50 points wins.

### Interesting things

 - The [logo](https://github.com/space-hound/web-piggygame/blob/master/css/logo.css) is made using only CSS, without any image:

<p align="center">
	<img src="https://i.imgur.com/QkW0nDr.png" alt="logo">
</p>

 - The [dices](https://github.com/space-hound/web-piggygame/blob/master/css/dices.css) again are not images but made with CSS: 
 
<p align="center">
	<img src="https://i.imgur.com/ORjhavi.png" alt="logo">
</p>

 - As I wanted to learn more than [prototypal inheritance](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain), [IIFE's](https://medium.com/javascript-in-plain-english/https-medium-com-javascript-in-plain-english-stop-feeling-iffy-about-using-an-iife-7b0292aba174), etc. I made this ["library" for DOM Manipulation](https://github.com/space-hound/web-piggygame/blob/master/js/sQ.js) for this game.
 - [This is the actual game file](https://github.com/space-hound/web-piggygame/blob/master/js/pig.js).