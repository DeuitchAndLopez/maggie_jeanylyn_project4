
// ==============
// CATGEORY IDS
// ==============
// foodFacts = 832;
// movies= 309;
// popMusic = 770;
// stupidAnswers = 136;
// animals = 21;
// countriesOfTheWorld = 1361;
// musicalInstruments = 184;
// fruitsAndVegetables = 777;
// actresses = 612;
// threeLetterWords = 105;
// worldCapitals = 78;
// mythology = 680;
// doubleTalk = 89;
// rhymeTime = 215;
// nurseryRhymes = 37; 
// music = 70;

const app = {};
app.score = 0;

app.startButton = $(".startButton");
app.timerScore = $(".timerScore");
app.timerText = $(".timer");
app.scoreText = $(".score");


app.startGame = $(".startGame");
app.category = $(".category");
app.value = $(".value");


app.submitCategory = $(".submitCategory");
app.submitDifficulty = $(".submitDifficulty");
app.nextQuestion = $(".nextQuestion");


app.answerForm = $(".answerForm");
app.right = $(".right");
app.wrong = $(".wrong");
app.rightAnswer = $(".rightAnswer");
app.gameOver = $(".gameOver");
app.finalScore = $(".finalScore");


app.categoryContainer = $(".categoryContainer");
app.valueContainer = $(".valueContainer");
app.questionContainer = $(".questionContainer");
app.answerContainer = $(".answerContainer");


// ==============
// GETTING INFO FROM THE API
// FOR THE QUESTION THE USSER PICS
// BASED ON CATEGORY AND VALUE
// ==============

app.getClues = function (categoryID, valueID) {
    $.ajax({
        url: "http://jservice.io/api/clues",
        method: "GET",
        data: {
            count: 100,
            value: valueID,
            category: categoryID,
        }
    })
        .then((res) => {
            app.displayQuestion(res);
        });
}

// ==============
// GETTING INFO FROM THE API
// FOR THE RANDOM ANSWERS 
// THAT MATCH THE CATEGORY
// ==============

app.getAnswers = function (categoryID) {
    $.ajax({
        url: "http://jservice.io/api/clues",
        method: "GET",
        data: {
            count: 100,
            category: categoryID
        }
    })
        .then((res) => {
            app.wrongAnswers(res, 6);
        });
}

// ===============
// USER CHOOSES CATEGORY AND VALUE
// ===============
app.events = function () {

    // starts the gmae
    $(app.startButton).on("click", function(e){
        e.preventDefault();
        $(app.timerScore).removeClass("hide").addClass("flex");
        $(app.categoryContainer).removeClass("hide");
        $(app.startGame).addClass("hide");
        app.timer(120);
    })

    // storing the category value
    $(app.category).on("click", function () {
        app.userCategoryChoice = $(".category:checked").val();
    })

    // When user submits, hide Categories and show value choices 
    $(app.submitCategory).on("click", function (e) {
        e.preventDefault();
        $(app.categoryContainer).addClass("hide");
        $(app.valueContainer).removeClass("hide");
    })

    // When user submits, store value 
    $(app.value).on("click", function () {
        app.userValueChoice = $(".value:checked").val();
    })

    // When user submits value hide the value and show the random question
    $(app.submitDifficulty).on("click", function (e) {
        e.preventDefault();
        $(app.valueContainer).addClass("hide");
        $(app.questionContainer).removeClass("hide");
        $(app.answerContainer).removeClass("hide");
        app.getClues(app.userCategoryChoice, app.userValueChoice);
    })
} // end of event function


// ===============
// TIMER FUNCTION
// ===============
app.timer = function(seconds) {
    const now = Date.now();
    const then = now + seconds * 1000;
    displayTimeLeft(seconds);
    let countdown = setInterval(function () {
        const secondsLeft = Math.round((then - Date.now()) / 1000);
        // if the timer runs out, clear the timer
        // display score 
        if (secondsLeft < 0) {
            clearInterval(countdown);
            return;
        }
        displayTimeLeft(secondsLeft);
        if (secondsLeft === 0){
            clearInterval(countdown);
            $(app.timerScore).addClass("hide");
            $(app.categoryContainer).addClass("hide");
            $(app.questionContainer).addClass("hide");
            $(app.valueContainer).addClass("hide");
            $(app.answerContainer).addClass("hide");
            $(app.right).addClass("hide");
            $(app.wrong).addClass("hide");
            $(app.gameOver).removeClass("hide");
            $(app.finalScore).append(`Your score was <span>$${app.score}</span>`)
        }

    }, 1000);
}
    // changing timer so it's compatible with minutes
    function displayTimeLeft(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainderSeconds = seconds % 60;
        const display = `${minutes}:${remainderSeconds < 10 ? "0" : ""}${remainderSeconds}`;
        $(app.timerText).text(display);
    }


// ===============
// DISPLAY RANDOM QUESTION BASED ON USER INPUT 
// AND RANDOM ANSWERS BASED ON THE CATRGORY
// USER PUT IN  
// ===============
app.displayQuestion = function (questions) {

    // filtering for good questions
    const goodQuestions = questions.filter((question) => {
        return question.invalid_count === null;
    })

    // get a random number and display a random question
    // based on that random number 
    let randomNum = Math.floor(Math.random() * goodQuestions.length);
    // append the random question in our index page 
    const title = $(`<h4 class="capitalize">`).text(`Category: ${goodQuestions[randomNum].category.title}`);
    const value = $("<h4>").text(`Wager: $${app.userValueChoice}`);
    const question = $(`<h3 class="questionText">`).text(goodQuestions[randomNum].question);

    // an array with the results to help get random answers
    let result = [];

    // ===============
    // GETTING RANDOM ANSWERS 
    // FROM CATEGORY THE USER CHOSE 
    // ===============
    app.wrongAnswers = function (res, neededElements) {
        // filtering through the results of 
        //the second ajax call for answers
        const filteredAnswers = res.map((answer) => {
            return answer.answer;
        })

        // getting a random 10 ansswers from second ajax request 
        for (let i = 0; i < neededElements; i++) {
            result.push(filteredAnswers[Math.floor(Math.random() * res.length)]);
        }

        // using regex here
        let newAnswersWithoutRandomCharacters;
        let emptyArray = [];
        let re = /<\/?[\w\s="/.':;#-\/\?]+>|[\/\\:+="#]+/gi
        let answersWithoutRandomCharacters = result.forEach((item) => {
            newAnswersWithoutRandomCharacters = item.replace(re, '');
            emptyArray.push(newAnswersWithoutRandomCharacters)
        })

        app.correctAnswer = app.correctAnswer.replace(re, "")

        // filter through answers to make sure they're unique 
        // and duplicates don't show up 
        let uniqueAnswers = new Set(emptyArray);
        uniqueAnswers.add(app.correctAnswer);

        // loop through new array of unique answers 
        // and append the answers in the array
        // for (let answer of uniqueAnswers.values()) {
        //     // $(".answerContainer").append(`<input type ="radio" name="answers" value="${answer}" id="${answer}" class="answers"><label for="${answer}">${answer}</label>`)
        // }

        // this takes the new Set and makes it into an array
        let backToRegArray = Array.from(uniqueAnswers);

        // looping over regular array 
        // to make sure we only have 5 answers 
        for (let i = backToRegArray.length; i > 5; i--) {
            backToRegArray.pop();
        }

        // this randomizes the order of the array. 
        backToRegArray.sort(function (a, b) { return 0.5 - Math.random() });

        // for every answer append it to the page 
        for (let answer of backToRegArray) {
            $(app.answerForm).append(`<input type ="radio" name="answers" value="${answer}" id="${answer}" class="answers"><label for="${answer}" class="capitalize">${answer}</label>`);
        }
        // appending the submit button 
        $(app.answerForm).append(`<input type="submit" value="Submit Answer" class="submitAnswer button">`);
        
        // storing user's answer choice
        $(".answers").on("click", function () {
            app.userValueChoice = $(".answers:checked").val();
        })

        // submitting the answer and comparing the user choice to correct answer 
        $(".submitAnswer").on("click", function (e) {
            e.preventDefault();
            $(app.questionContainer).addClass("hide").empty();
            $(app.answerForm).empty();
            $(app.answerContainer).addClass("hide")
            // if user choice is correct show right page
            // if not show the wrong page
            if (app.userValueChoice === app.correctAnswer) {
                app.score = app.score + goodQuestions[randomNum].value;
                $(app.scoreText).text(`Score: $${app.score}`)
                $(app.right).removeClass("hide")
            } else {
                app.score = app.score - goodQuestions[randomNum].value;
                $(app.scoreText).text(`Score: $${app.score}`)
                $(app.wrong).removeClass("hide")
                $(app.rightAnswer).text(`The right answer was ${app.correctAnswer}`)
            }
        })

        // go to the next question
        $(app.nextQuestion).on("click", function(e){
            e.preventDefault();
            $(app.categoryContainer).removeClass("hide");
            $(app.wrong).addClass("hide");
            $(app.right).addClass("hide");
        })

    } // end of wrong answers function 

    // ===============
    // DISPLAY CORRECT ANSWERS 
    // FROM CATEGORY THE USER CHOSE
    // ===============
    app.correctAnswer;
    const displayAnswers = function () {
        // this is the correct answer 
        app.correctAnswer = goodQuestions[randomNum].answer;

        // pushing the correct answer into result 
        result.push(app.correctAnswer);
        // calling app.getAnswers 
        // so we have the info from the API 
        app.getAnswers(app.userCategoryChoice);

    }

    // displaying info for random question
    $(app.questionContainer).append(title, value, question);
    displayAnswers();
} // end of displayQuestions function

// ===============
// INITIALIZE THE APP
// ===============
app.init = function () {
    app.events();
    $(app.startGame).removeClass("hide");
}

// ===============
// DOC READY
// ===============
$(function () {
    app.init();
});