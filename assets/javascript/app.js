// Answer Class
function Answer(text, correct){
    this.text = text;
    this.correct = correct;
};

// Question Class
function Question(text){
    this.text = text;
    this.answers = [];
    this.correct = false;
};

Question.prototype.addAnswer = function(text, correct){
    var answer = new Answer(text, correct);
    this.answers.push(answer);
    return this;
};

// Game Class that takes in an element id with which to attach the game content.
function Game(view){
    // Timer Constants
    this.TIME_PER_QUESTION = 10;
    this.TIME_BETWEEN_QUESTION = 3;
    this.view = $('#' + view);
    this.timer;
    this.interval;
    this.countdownTimer;
    this.currentQuestion;
    this.questions;
    this.answeredQuestions;
    this.correctAnswers;
};

// Entry point for the game object to start running.
Game.prototype.start = function(){
    this.questions = [
        new Question('Which rap group was the first to publicly endorse sneakers in their music?')
            .addAnswer('Public Enemy', false).addAnswer('Run-D.M.C', true).addAnswer('Beastie Boys', false),
        new Question('What was the first sneaker ever mass produced?')
            .addAnswer('Keds', true).addAnswer('Converse', false).addAnswer('Pumas', false),
        new Question('How many different styles of Air Jordans have been created by Nike since they debuted in 1984?')
            .addAnswer('18', false).addAnswer('26', false).addAnswer('32', true),
        new Question("True or False: Nike's original name was Blue Ribbon Sports.")
            .addAnswer('True', true).addAnswer('False', false),
        new Question('Which sports moment solidified Reebok pumps as sneakerhead-worthy shoes?')
            .addAnswer("Boston Celtics' Dee Brown pumping his Reeboks before winning the 1991 NBA Slam Dunk Contest.", true)
            .addAnswer("Michael Chang's French Open win in 1989, making him the youngest male player to win a Grand Slam singles at the age of 17.", false)
            .addAnswer('Legendary Atlanta Hawks player Dominique Wilkins starring in the commercial “Reebok Pump 1989."', true),
        new Question('True or False: Rubber-soled shoes were called "sneakers" because they were so quiet, a person wearing them could sneak up on someone.')
            .addAnswer('True', true).addAnswer('False', false),
        new Question('In 2010, video producer and fashion designer Vashtie Kola became the first woman to land an iconic sneaker design deal. Which shoe did she design?')
            .addAnswer('Adidas Superstar 2', false).addAnswer('Nike Air Jordan 2', true).addAnswer('Puma Suede Classic', false),
        new Question('What cult 80s teen film helped bring Vans into the sneaker culture?')
            .addAnswer("Valley Girl", false).addAnswer("The Breakfast Club", false).addAnswer("Fast Times at Ridgemont High", true),
        new Question('Where can you find the biggest sneaker collection in the world?')
            .addAnswer("Las Vegas", true).addAnswer("New York City", false).addAnswer("Los Angeles", false),
        new Question('Which sneaker brand garnered the most Instagram follows in 2015?')
            .addAnswer('Adidas', true).addAnswer('Nike', false).addAnswer('Reebok', false)
    ];
    this.answeredQuestions = [];
    this.correctAnswers = 0;
    this.view.empty();
    var startButton = $('<button>').text('Click Here to Start!');
    startButton.addClass('btn btn-primary btn-lg btn-block center-block col-12');
    startButton.click(() => {
        this.ask();
    });
    this.view.append(startButton);
};

Game.prototype.ask = function(){
    this.view.empty();
    var randomIndex = Math.floor(Math.random() * this.questions.length);
    var question = $('<div>');
    this.currentQuestion = this.questions[randomIndex];
    this.questions.splice(randomIndex, 1);
    question.append($('<h4>').text(this.currentQuestion.text));
    question.append($('<br>'));
    this.currentQuestion.answers.forEach((answer, index) => {
        var answerElement = $('<p>').text(answer.text);
        answerElement.attr('data-id', index);
        answerElement.click( function(event){
            var answerId = $(event.target).attr('data-id');
            var correct = this.currentQuestion.answers[answerId].correct;
            if(correct){
                this.correct();
            }else{
                this.wrong();
            }
        }.bind(this));
        question.append(answerElement);
    });
    this.view.append(question);
    this.startTimer(this.TIME_PER_QUESTION, this.timeUp);
};

Game.prototype.timeUp = function(){
    this.view.empty();
    this.view.append($('<h3>').text("Time Up!"));
    this.answeredQuestions.push(this.currentQuestion);
    if(this.questions.length <= 0){
        this.gameOver();
    }else{
        this.startTimer(this.TIME_BETWEEN_QUESTION, this.ask);
    }
};

Game.prototype.correct = function(question){
    this.view.empty();
    this.view.append($('<h3>').text("Congrats!"));
    this.currentQuestion.correct = true;
    this.answeredQuestions.push(this.currentQuestion);
    if(this.questions.length <= 0){
        this.gameOver();
    }else{
        this.startTimer(this.TIME_BETWEEN_QUESTION, this.ask);
    }
};

Game.prototype.wrong = function(question){
    this.view.empty();
    this.view.append($('<h3>').text("Oh No!"));
    this.answeredQuestions.push(this.currentQuestion);
    if(this.questions.length <= 0){
        this.gameOver();
    }else{
        this.startTimer(this.TIME_BETWEEN_QUESTION, this.ask);
    }
};

Game.prototype.gameOver = function(){
    this.view.empty();
    clearInterval(this.interval);
    clearTimeout(this.timer);
    $('#countdown').empty();
    this.view.append($('<h3>').text("You answered all questions!"));
    this.view.append('<p>You got ' + this.answeredQuestions. + '</p>');
}

Game.prototype.startTimer = function(time, callback){
    clearTimeout(this.timer);
    this.showTimeRemaining(time);
    this.timer = setTimeout(function(){
        callback.call(this);
    }.bind(this), time * 1000);
};

Game.prototype.showTimeRemaining = function(time){
    clearInterval(this.interval);
    this.countdownTimer = time;
    $('#countdown').empty();
    $('#countdown').append('<p>Time Remaining: ' + this.countdownTimer + '</p>');
    this.interval = setInterval(function(){
        this.countdownTimer--;
        $('#countdown').empty();
        $('#countdown').append('<p>Time Remaining: ' + this.countdownTimer + '</p>');
    }.bind(this), 1000);
}

$(document).ready(function(){
    var game = new Game('triviaGame');
    game.start();
});