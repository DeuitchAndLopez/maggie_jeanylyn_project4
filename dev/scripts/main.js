// get certain categories. look for the ids of the catorgories we want out of 100 questions 

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

// filter the values of them so the user can choose value 
// make sure the value we want is there so the user has choices 
// 100, 200, 300 = easy 
// 400, 500, 600 = medium 
// 800, 1000 = hard 

// display all categories 
// update the radio buttons
// add submit button 
// remove buttons when submit is pressed 
// display question 
// can we filter through the inputs so we only get valid questions?
// can do this in the array we're given back 
// filter through the array? 
// display answer and the choices users can pick from for multiple choice 
// maybe choose the answers from multiple choice with Math.random just get 5 randome answers in the category doesnt have to be specific to value but could be from the larger array of 100 objects 
// make the random multiple choice choises and the correct answer into a button on the page 

// maybe choose the answers from multiple choice with Math.random just get 5 randome answers in the category doesnt have to be specific to value but could be from the larger array of 100 objects

// randomzing the answers 
// if user chooses the the right answer then add value to score
// link the value on click or submit
// make a timer
// add score
// next question empty everything and display everything
//timer will run out
// display Times Up and final score
// play again button

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

    $(app.startButton).on("click", function(e){
        e.preventDefault();
        console.log('click');
        $(app.timerScore).removeClass("hide").addClass("flex");
        $(app.categoryContainer).removeClass("hide");
        $(app.startGame).addClass("hide");
        app.timer(3200);
    })

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
// DISPLAY RANDOM QUESTION BASED ON USER INPUT 
// AND RANDOM ANSWERS BASED ON THE CATRGORY
// USER PUT IN  
// ===============

app.timer = function(seconds) {
    const now = Date.now();
    const then = now + seconds * 1000;
    displayTimeLeft(seconds);
    // $(".timer").text(display);

    let countdown = setInterval(function () {
        const secondsLeft = Math.round((then - Date.now()) / 1000);
        if (secondsLeft < 0) {
            clearInterval(countdown);
            return;
            // $(".timer").empty();
            // $(".timer").text(`0:0${secondsLeft}`);
        }
        displayTimeLeft(secondsLeft);
        // $(".timer").text(`0:${secondsLeft}`);

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
 // !!! this isn't cached           
            $(app.finalScore).append(`Your score was <span>${app.score}</span>`)
        
        }

    }, 1000);
}

    function displayTimeLeft(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainderSeconds = seconds % 60;
        const display = `${minutes}:${remainderSeconds < 10 ? "0" : ""}${remainderSeconds}`;
        $(app.timerText).text(display);
        // console.log({minutes, remainderSeconds});
    }

    


app.displayQuestion = function (questions) {

    // ARE WE EVEN USING THIS ANYMORE?? DOESN'T LOOK LIKE IT
    // SHOULD WE BE USING GOODQUESTIONS TO APPEND INSTEAD OF QUESTIONS
    const goodQuestions = questions.filter((question) => {
        return question.invalid_count === null;
    })

    // get a random number and display a random question
    // based on that random number 
    let randomNum = Math.floor(Math.random() * goodQuestions.length);
    // append the random question in our index page 
    const title = $("<h3>").text(`Category: ${goodQuestions[randomNum].category.title}`);
    const value = $("<h3>").text(`Wager: ${app.userValueChoice}`);
    const question = $("<h2>").text(goodQuestions[randomNum].question);

    // an array with the results from .....??????
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
            // console.log(newAnswersWithoutRandomCharacters);
        })

        // filter through answers to make sure they're unique 
        // and duplicates don't show up 
        let uniqueAnswers = new Set(emptyArray);
        uniqueAnswers.add(app.correctAnswer);
        console.log("These are unique answers in a Set");
        console.log(uniqueAnswers);

        // loop through new array of unique answers 
        // and append the answers in the array
        for (let answer of uniqueAnswers.values()) {
            // $(".answerContainer").append(`<input type ="radio" name="answers" value="${answer}" id="${answer}" class="answers"><label for="${answer}">${answer}</label>`)
        }

        // this takes the new Set and makes it into an array
        let backToRegArray = Array.from(uniqueAnswers);
        // console.log("This is a regular array again");
        // console.log(backToRegArray);

        // looping over regular array 
        // to make sure we only have 5 answers 
        for (let i = backToRegArray.length; i > 5; i--) {
            backToRegArray.pop();
        }

        // this randomizes the order of the array. 
        backToRegArray.sort(function (a, b) { return 0.5 - Math.random() });
        console.log("Array in random order");
        console.log(backToRegArray);

        // for every answer append it to the page 
        for (let answer of backToRegArray) {
            $(app.answerForm).append(`<input type ="radio" name="answers" value="${answer}" id="${answer}" class="answers"><label for="${answer}">${answer}</label>`);

        }
        // appending the submit button 
        $(app.answerForm).append(`<input type="submit" value="Submit Answer" class="submitAnswer button">`);
        // grab the value of what they chose 
        // and compare to value of the correct answer 
        // if it matches score increase 

        $(".answers").on("click", function () {
            console.log("clicked on an answer")
            app.userValueChoice = $(".answers:checked").val();
        })

        $(".submitAnswer").on("click", function (e) {
            e.preventDefault();
            console.log("clicked submit button");
            $(app.questionContainer).addClass("hide").empty();
            $(app.answerForm).empty();
            $(app.answerContainer).addClass("hide")
            if (app.userValueChoice === app.correctAnswer) {
                app.score = app.score + goodQuestions[randomNum].value;
                $(app.scoreText).text(`Score: $${app.score}`)
                $(app.right).removeClass("hide")
            } else {
                app.score = app.score - goodQuestions[randomNum].value;
                $(app.scoreText).text(`Score: $${app.score}`)
                $(app.wrong).removeClass("hide")
            }
        })

        $(app.nextQuestion).on("click", function(e){
            e.preventDefault();
            $(app.categoryContainer).removeClass("hide");
            // $(".nextQuestion").addClass("hide");
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
        // console.log("This is the right answer");
        // console.log(app.correctAnswer);

        // pushing the correct answer into result 
        result.push(app.correctAnswer);
        // calling app.getAnswers 
        // so we have the info from the API 
        app.getAnswers(app.userCategoryChoice);

    }


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