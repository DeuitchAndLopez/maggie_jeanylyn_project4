(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

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

var app = {};
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
            category: categoryID
        }
    }).then(function (res) {
        app.displayQuestion(res);
    });
};

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
    }).then(function (res) {
        app.wrongAnswers(res, 6);
    });
};

// ===============
// USER CHOOSES CATEGORY AND VALUE
// ===============
app.events = function () {

    // starts the gmae
    $(app.startButton).on("click", function (e) {
        e.preventDefault();
        $(app.timerScore).removeClass("hide").addClass("flex");
        $(app.categoryContainer).removeClass("hide");
        $(app.startGame).addClass("hide");
        app.timer(120);
    });

    // storing the category value
    $(app.category).on("click", function () {
        app.userCategoryChoice = $(".category:checked").val();
    });

    // When user submits, hide Categories and show value choices 
    $(app.submitCategory).on("click", function (e) {
        e.preventDefault();
        $(app.categoryContainer).addClass("hide");
        $(app.valueContainer).removeClass("hide");
    });

    // When user submits, store value 
    $(app.value).on("click", function () {
        app.userValueChoice = $(".value:checked").val();
    });

    // When user submits value hide the value and show the random question
    $(app.submitDifficulty).on("click", function (e) {
        e.preventDefault();
        $(app.valueContainer).addClass("hide");
        $(app.questionContainer).removeClass("hide");
        $(app.answerContainer).removeClass("hide");
        app.getClues(app.userCategoryChoice, app.userValueChoice);
    });
}; // end of event function


// ===============
// TIMER FUNCTION
// ===============
app.timer = function (seconds) {
    var now = Date.now();
    var then = now + seconds * 1000;
    displayTimeLeft(seconds);
    var countdown = setInterval(function () {
        var secondsLeft = Math.round((then - Date.now()) / 1000);
        // if the timer runs out, clear the timer
        // display score 
        if (secondsLeft < 0) {
            clearInterval(countdown);
            return;
        }
        displayTimeLeft(secondsLeft);
        if (secondsLeft === 0) {
            clearInterval(countdown);
            $(app.timerScore).addClass("hide");
            $(app.categoryContainer).addClass("hide");
            $(app.questionContainer).addClass("hide");
            $(app.valueContainer).addClass("hide");
            $(app.answerContainer).addClass("hide");
            $(app.right).addClass("hide");
            $(app.wrong).addClass("hide");
            $(app.gameOver).removeClass("hide");
            $(app.finalScore).append("Your score was <span>$" + app.score + "</span>");
        }
    }, 1000);
};
// changing timer so it's compatible with minutes
function displayTimeLeft(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainderSeconds = seconds % 60;
    var display = minutes + ":" + (remainderSeconds < 10 ? "0" : "") + remainderSeconds;
    $(app.timerText).text(display);
}

// ===============
// DISPLAY RANDOM QUESTION BASED ON USER INPUT 
// AND RANDOM ANSWERS BASED ON THE CATRGORY
// USER PUT IN  
// ===============
app.displayQuestion = function (questions) {

    // filtering for good questions
    var goodQuestions = questions.filter(function (question) {
        return question.invalid_count === null;
    });

    // get a random number and display a random question
    // based on that random number 
    var randomNum = Math.floor(Math.random() * goodQuestions.length);
    // append the random question in our index page 
    var title = $("<h4 class=\"capitalize\">").text("Category: " + goodQuestions[randomNum].category.title);
    var value = $("<h4>").text("Wager: $" + app.userValueChoice);
    var question = $("<h3 class=\"questionText\">").text(goodQuestions[randomNum].question);

    // an array with the results to help get random answers
    var result = [];

    // ===============
    // GETTING RANDOM ANSWERS 
    // FROM CATEGORY THE USER CHOSE 
    // ===============
    app.wrongAnswers = function (res, neededElements) {
        // filtering through the results of 
        //the second ajax call for answers
        var filteredAnswers = res.map(function (answer) {
            return answer.answer;
        });

        // getting a random 10 ansswers from second ajax request 
        for (var i = 0; i < neededElements; i++) {
            result.push(filteredAnswers[Math.floor(Math.random() * res.length)]);
        }

        // using regex here
        var newAnswersWithoutRandomCharacters = void 0;
        var emptyArray = [];
        var re = /<\/?[\w\s="/.':;#-\/\?]+>|[\/\\:+="#]+/gi;
        var answersWithoutRandomCharacters = result.forEach(function (item) {
            newAnswersWithoutRandomCharacters = item.replace(re, '');
            emptyArray.push(newAnswersWithoutRandomCharacters);
        });

        console.log(app.correctAnswer);
        app.correctAnswer = app.correctAnswer.replace(re, "");

        // let re = /<\/?[\w\s="/.':;#-\/\?]+>/gi
        // var result = '<i>hello</i>';
        // var newResult = result.replace(re, '');
        // console.log(newResult); 

        // filter through answers to make sure they're unique 
        // and duplicates don't show up 
        var uniqueAnswers = new Set(emptyArray);
        uniqueAnswers.add(app.correctAnswer);

        // loop through new array of unique answers 
        // and append the answers in the array
        // for (let answer of uniqueAnswers.values()) {
        //     // $(".answerContainer").append(`<input type ="radio" name="answers" value="${answer}" id="${answer}" class="answers"><label for="${answer}">${answer}</label>`)
        // }

        // this takes the new Set and makes it into an array
        var backToRegArray = Array.from(uniqueAnswers);

        // looping over regular array 
        // to make sure we only have 5 answers 
        for (var _i = backToRegArray.length; _i > 5; _i--) {
            backToRegArray.pop();
        }

        // this randomizes the order of the array. 
        backToRegArray.sort(function (a, b) {
            return 0.5 - Math.random();
        });

        // for every answer append it to the page 
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = backToRegArray[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var answer = _step.value;

                $(app.answerForm).append("<input type =\"radio\" name=\"answers\" value=\"" + answer + "\" id=\"" + answer + "\" class=\"answers\"><label for=\"" + answer + "\" class=\"capitalize\">" + answer + "</label>");
            }
            // appending the submit button 
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        $(app.answerForm).append("<input type=\"submit\" value=\"Submit Answer\" class=\"submitAnswer button\">");

        // storing user's answer choice
        $(".answers").on("click", function () {
            console.log("clicked on an answer");
            app.userValueChoice = $(".answers:checked").val();
        });

        // submitting the answer and comparing the user choice to correct answer 
        $(".submitAnswer").on("click", function (e) {
            e.preventDefault();
            console.log("clicked submit button");
            $(app.questionContainer).addClass("hide").empty();
            $(app.answerForm).empty();
            $(app.answerContainer).addClass("hide");
            // if user choice is correct show right page
            // if not show the wrong page
            if (app.userValueChoice === app.correctAnswer) {
                app.score = app.score + goodQuestions[randomNum].value;
                $(app.scoreText).text("Score: $" + app.score);
                $(app.right).removeClass("hide");
            } else {
                app.score = app.score - goodQuestions[randomNum].value;
                $(app.scoreText).text("Score: $" + app.score);
                $(app.wrong).removeClass("hide");
                $(app.rightAnswer).text("The right answer was " + app.correctAnswer);
            }
        });

        // go to the next question
        $(app.nextQuestion).on("click", function (e) {
            e.preventDefault();
            $(app.categoryContainer).removeClass("hide");
            $(app.wrong).addClass("hide");
            $(app.right).addClass("hide");
        });
    }; // end of wrong answers function 

    // ===============
    // DISPLAY CORRECT ANSWERS 
    // FROM CATEGORY THE USER CHOSE
    // ===============
    app.correctAnswer;
    var displayAnswers = function displayAnswers() {
        // this is the correct answer 
        app.correctAnswer = goodQuestions[randomNum].answer;

        // pushing the correct answer into result 
        result.push(app.correctAnswer);
        // calling app.getAnswers 
        // so we have the info from the API 
        app.getAnswers(app.userCategoryChoice);
    };

    // displaying info for random question
    $(app.questionContainer).append(title, value, question);
    displayAnswers();
}; // end of displayQuestions function

// ===============
// INITIALIZE THE APP
// ===============
app.init = function () {
    app.events();
    $(app.startGame).removeClass("hide");
};

// ===============
// DOC READY
// ===============
$(function () {
    app.init();
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvc2NyaXB0cy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxJQUFNLE1BQU0sRUFBWjtBQUNBLElBQUksS0FBSixHQUFZLENBQVo7O0FBRUEsSUFBSSxXQUFKLEdBQWtCLEVBQUUsY0FBRixDQUFsQjtBQUNBLElBQUksVUFBSixHQUFpQixFQUFFLGFBQUYsQ0FBakI7QUFDQSxJQUFJLFNBQUosR0FBZ0IsRUFBRSxRQUFGLENBQWhCO0FBQ0EsSUFBSSxTQUFKLEdBQWdCLEVBQUUsUUFBRixDQUFoQjs7QUFHQSxJQUFJLFNBQUosR0FBZ0IsRUFBRSxZQUFGLENBQWhCO0FBQ0EsSUFBSSxRQUFKLEdBQWUsRUFBRSxXQUFGLENBQWY7QUFDQSxJQUFJLEtBQUosR0FBWSxFQUFFLFFBQUYsQ0FBWjs7QUFHQSxJQUFJLGNBQUosR0FBcUIsRUFBRSxpQkFBRixDQUFyQjtBQUNBLElBQUksZ0JBQUosR0FBdUIsRUFBRSxtQkFBRixDQUF2QjtBQUNBLElBQUksWUFBSixHQUFtQixFQUFFLGVBQUYsQ0FBbkI7O0FBR0EsSUFBSSxVQUFKLEdBQWlCLEVBQUUsYUFBRixDQUFqQjtBQUNBLElBQUksS0FBSixHQUFZLEVBQUUsUUFBRixDQUFaO0FBQ0EsSUFBSSxLQUFKLEdBQVksRUFBRSxRQUFGLENBQVo7QUFDQSxJQUFJLFdBQUosR0FBa0IsRUFBRSxjQUFGLENBQWxCO0FBQ0EsSUFBSSxRQUFKLEdBQWUsRUFBRSxXQUFGLENBQWY7QUFDQSxJQUFJLFVBQUosR0FBaUIsRUFBRSxhQUFGLENBQWpCOztBQUdBLElBQUksaUJBQUosR0FBd0IsRUFBRSxvQkFBRixDQUF4QjtBQUNBLElBQUksY0FB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LGNBQUUsSUFBSSxpQkFBTixFQUF5QixXQUF6QixDQUFxQyxNQUFyQztBQUNBLGNBQUUsSUFBSSxLQUFOLEVBQWEsUUFBYixDQUFzQixNQUF0QjtBQUNBLGNBQUUsSUFBSSxLQUFOLEVBQWEsUUFBYixDQUFzQixNQUF0QjtBQUNILFNBTEQ7QUFPSCxLQS9GRCxDQXRCdUMsQ0FxSHJDOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBSSxhQUFKO0FBQ0EsUUFBTSxpQkFBaUIsU0FBakIsY0FBaUIsR0FBWTtBQUMvQjtBQUNBLFlBQUksYUFBSixHQUFvQixjQUFjLFNBQWQsRUFBeUIsTUFBN0M7O0FBRUE7QUFDQSxlQUFPLElBQVAsQ0FBWSxJQUFJLGFBQWhCO0FBQ0E7QUFDQTtBQUNBLFlBQUksVUFBSixDQUFlLElBQUksa0JBQW5CO0FBRUgsS0FWRDs7QUFZQTtBQUNBLE1BQUUsSUFBSSxpQkFBTixFQUF5QixNQUF6QixDQUFnQyxLQUFoQyxFQUF1QyxLQUF2QyxFQUE4QyxRQUE5QztBQUNBO0FBQ0gsQ0EzSUQsQyxDQTJJRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQSxJQUFJLElBQUosR0FBVyxZQUFZO0FBQ25CLFFBQUksTUFBSjtBQUNBLE1BQUUsSUFBSSxTQUFOLEVBQWlCLFdBQWpCLENBQTZCLE1BQTdCO0FBQ0gsQ0FIRDs7QUFLQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLFlBQVk7QUFDVixRQUFJLElBQUo7QUFDSCxDQUZEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXHJcbi8vID09PT09PT09PT09PT09XHJcbi8vIENBVEdFT1JZIElEU1xyXG4vLyA9PT09PT09PT09PT09PVxyXG4vLyBmb29kRmFjdHMgPSA4MzI7XHJcbi8vIG1vdmllcz0gMzA5O1xyXG4vLyBwb3BNdXNpYyA9IDc3MDtcclxuLy8gc3R1cGlkQW5zd2VycyA9IDEzNjtcclxuLy8gYW5pbWFscyA9IDIxO1xyXG4vLyBjb3VudHJpZXNPZlRoZVdvcmxkID0gMTM2MTtcclxuLy8gbXVzaWNhbEluc3RydW1lbnRzID0gMTg0O1xyXG4vLyBmcnVpdHNBbmRWZWdldGFibGVzID0gNzc3O1xyXG4vLyBhY3RyZXNzZXMgPSA2MTI7XHJcbi8vIHRocmVlTGV0dGVyV29yZHMgPSAxMDU7XHJcbi8vIHdvcmxkQ2FwaXRhbHMgPSA3ODtcclxuLy8gbXl0aG9sb2d5ID0gNjgwO1xyXG4vLyBkb3VibGVUYWxrID0gODk7XHJcbi8vIHJoeW1lVGltZSA9IDIxNTtcclxuLy8gbnVyc2VyeVJoeW1lcyA9IDM3OyBcclxuLy8gbXVzaWMgPSA3MDtcclxuXHJcbmNvbnN0IGFwcCA9IHt9O1xyXG5hcHAuc2NvcmUgPSAwO1xyXG5cclxuYXBwLnN0YXJ0QnV0dG9uID0gJChcIi5zdGFydEJ1dHRvblwiKTtcclxuYXBwLnRpbWVyU2NvcmUgPSAkKFwiLnRpbWVyU2NvcmVcIik7XHJcbmFwcC50aW1lclRleHQgPSAkKFwiLnRpbWVyXCIpO1xyXG5hcHAuc2NvcmVUZXh0ID0gJChcIi5zY29yZVwiKTtcclxuXHJcblxyXG5hcHAuc3RhcnRHYW1lID0gJChcIi5zdGFydEdhbWVcIik7XHJcbmFwcC5jYXRlZ29yeSA9ICQoXCIuY2F0ZWdvcnlcIik7XHJcbmFwcC52YWx1ZSA9ICQoXCIudmFsdWVcIik7XHJcblxyXG5cclxuYXBwLnN1Ym1pdENhdGVnb3J5ID0gJChcIi5zdWJtaXRDYXRlZ29yeVwiKTtcclxuYXBwLnN1Ym1pdERpZmZpY3VsdHkgPSAkKFwiLnN1Ym1pdERpZmZpY3VsdHlcIik7XHJcbmFwcC5uZXh0UXVlc3Rpb24gPSAkKFwiLm5leHRRdWVzdGlvblwiKTtcclxuXHJcblxyXG5hcHAuYW5zd2VyRm9ybSA9ICQoXCIuYW5zd2VyRm9ybVwiKTtcclxuYXBwLnJpZ2h0ID0gJChcIi5yaWdodFwiKTtcclxuYXBwLndyb25nID0gJChcIi53cm9uZ1wiKTtcclxuYXBwLnJpZ2h0QW5zd2VyID0gJChcIi5yaWdodEFuc3dlclwiKTtcclxuYXBwLmdhbWVPdmVyID0gJChcIi5nYW1lT3ZlclwiKTtcclxuYXBwLmZpbmFsU2NvcmUgPSAkKFwiLmZpbmFsU2NvcmVcIik7XHJcblxyXG5cclxuYXBwLmNhdGVnb3J5Q29udGFpbmVyID0gJChcIi5jYXRlZ29yeUNvbnRhaW5lclwiKTtcclxuYXBwLnZhbHVlQ29udGFpbmVyID0gJChcIi52YWx1ZUNvbnRhaW5lclwiKTtcclxuYXBwLnF1ZXN0aW9uQ29udGFpbmVyID0gJChcIi5xdWVzdGlvbkNvbnRhaW5lclwiKTtcclxuYXBwLmFuc3dlckNvbnRhaW5lciA9ICQoXCIuYW5zd2VyQ29udGFpbmVyXCIpO1xyXG5cclxuXHJcbi8vID09PT09PT09PT09PT09XHJcbi8vIEdFVFRJTkcgSU5GTyBGUk9NIFRIRSBBUElcclxuLy8gRk9SIFRIRSBRVUVTVElPTiBUSEUgVVNTRVIgUElDU1xyXG4vLyBCQVNFRCBPTiBDQVRFR09SWSBBTkQgVkFMVUVcclxuLy8gPT09PT09PT09PT09PT1cclxuXHJcblxyXG5hcHAuZ2V0Q2x1ZXMgPSBmdW5jdGlvbiAoY2F0ZWdvcnlJRCwgdmFsdWVJRCkge1xyXG4gICAgJC5hamF4KHtcclxuICAgICAgICB1cmw6IFwiaHR0cDovL2pzZXJ2aWNlLmlvL2FwaS9jbHVlc1wiLFxyXG4gICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgIGNvdW50OiAxMDAsXHJcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZUlELFxyXG4gICAgICAgICAgICBjYXRlZ29yeTogY2F0ZWdvcnlJRCxcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgICAgIC50aGVuKChyZXMpID0+IHtcclxuICAgICAgICAgICAgYXBwLmRpc3BsYXlRdWVzdGlvbihyZXMpO1xyXG4gICAgICAgIH0pO1xyXG59XHJcblxyXG4vLyA9PT09PT09PT09PT09PVxyXG4vLyBHRVRUSU5HIElORk8gRlJPTSBUSEUgQVBJXHJcbi8vIEZPUiBUSEUgUkFORE9NIEFOU1dFUlMgXHJcbi8vIFRIQVQgTUFUQ0ggVEhFIENBVEVHT1JZXHJcbi8vID09PT09PT09PT09PT09XHJcblxyXG5hcHAuZ2V0QW5zd2VycyA9IGZ1bmN0aW9uIChjYXRlZ29yeUlEKSB7XHJcbiAgICAkLmFqYXgoe1xyXG4gICAgICAgIHVybDogXCJodHRwOi8vanNlcnZpY2UuaW8vYXBpL2NsdWVzXCIsXHJcbiAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgY291bnQ6IDEwMCxcclxuICAgICAgICAgICAgY2F0ZWdvcnk6IGNhdGVnb3J5SURcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgICAgIC50aGVuKChyZXMpID0+IHtcclxuICAgICAgICAgICAgYXBwLndyb25nQW5zd2VycyhyZXMsIDYpO1xyXG4gICAgICAgIH0pO1xyXG59XHJcblxyXG4vLyA9PT09PT09PT09PT09PT1cclxuLy8gVVNFUiBDSE9PU0VTIENBVEVHT1JZIEFORCBWQUxVRVxyXG4vLyA9PT09PT09PT09PT09PT1cclxuYXBwLmV2ZW50cyA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAvLyBzdGFydHMgdGhlIGdtYWVcclxuICAgICQoYXBwLnN0YXJ0QnV0dG9uKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAkKGFwcC50aW1lclNjb3JlKS5yZW1vdmVDbGFzcyhcImhpZGVcIikuYWRkQ2xhc3MoXCJmbGV4XCIpO1xyXG4gICAgICAgICQoYXBwLmNhdGVnb3J5Q29udGFpbmVyKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcbiAgICAgICAgJChhcHAuc3RhcnRHYW1lKS5hZGRDbGFzcyhcImhpZGVcIik7XHJcbiAgICAgICAgYXBwLnRpbWVyKDEyMCk7XHJcbiAgICB9KVxyXG5cclxuICAgIC8vIHN0b3JpbmcgdGhlIGNhdGVnb3J5IHZhbHVlXHJcbiAgICAkKGFwcC5jYXRlZ29yeSkub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgYXBwLnVzZXJDYXRlZ29yeUNob2ljZSA9ICQoXCIuY2F0ZWdvcnk6Y2hlY2tlZFwiKS52YWwoKTtcclxuICAgIH0pXHJcblxyXG4gICAgLy8gV2hlbiB1c2VyIHN1Ym1pdHMsIGhpZGUgQ2F0ZWdvcmllcyBhbmQgc2hvdyB2YWx1ZSBjaG9pY2VzIFxyXG4gICAgJChhcHAuc3VibWl0Q2F0ZWdvcnkpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgJChhcHAuY2F0ZWdvcnlDb250YWluZXIpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuICAgICAgICAkKGFwcC52YWx1ZUNvbnRhaW5lcikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG4gICAgfSlcclxuXHJcbiAgICAvLyBXaGVuIHVzZXIgc3VibWl0cywgc3RvcmUgdmFsdWUgXHJcbiAgICAkKGFwcC52YWx1ZSkub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgYXBwLnVzZXJWYWx1ZUNob2ljZSA9ICQoXCIudmFsdWU6Y2hlY2tlZFwiKS52YWwoKTtcclxuICAgIH0pXHJcblxyXG4gICAgLy8gV2hlbiB1c2VyIHN1Ym1pdHMgdmFsdWUgaGlkZSB0aGUgdmFsdWUgYW5kIHNob3cgdGhlIHJhbmRvbSBxdWVzdGlvblxyXG4gICAgJChhcHAuc3VibWl0RGlmZmljdWx0eSkub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAkKGFwcC52YWx1ZUNvbnRhaW5lcikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG4gICAgICAgICQoYXBwLnF1ZXN0aW9uQ29udGFpbmVyKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcbiAgICAgICAgJChhcHAuYW5zd2VyQ29udGFpbmVyKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcbiAgICAgICAgYXBwLmdldENsdWVzKGFwcC51c2VyQ2F0ZWdvcnlDaG9pY2UsIGFwcC51c2VyVmFsdWVDaG9pY2UpO1xyXG4gICAgfSlcclxufSAvLyBlbmQgb2YgZXZlbnQgZnVuY3Rpb25cclxuXHJcblxyXG4vLyA9PT09PT09PT09PT09PT1cclxuLy8gVElNRVIgRlVOQ1RJT05cclxuLy8gPT09PT09PT09PT09PT09XHJcbmFwcC50aW1lciA9IGZ1bmN0aW9uKHNlY29uZHMpIHtcclxuICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XHJcbiAgICBjb25zdCB0aGVuID0gbm93ICsgc2Vjb25kcyAqIDEwMDA7XHJcbiAgICBkaXNwbGF5VGltZUxlZnQoc2Vjb25kcyk7XHJcbiAgICBsZXQgY291bnRkb3duID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGNvbnN0IHNlY29uZHNMZWZ0ID0gTWF0aC5yb3VuZCgodGhlbiAtIERhdGUubm93KCkpIC8gMTAwMCk7XHJcbiAgICAgICAgLy8gaWYgdGhlIHRpbWVyIHJ1bnMgb3V0LCBjbGVhciB0aGUgdGltZXJcclxuICAgICAgICAvLyBkaXNwbGF5IHNjb3JlIFxyXG4gICAgICAgIGlmIChzZWNvbmRzTGVmdCA8IDApIHtcclxuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChjb3VudGRvd24pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRpc3BsYXlUaW1lTGVmdChzZWNvbmRzTGVmdCk7XHJcbiAgICAgICAgaWYgKHNlY29uZHNMZWZ0ID09PSAwKXtcclxuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChjb3VudGRvd24pO1xyXG4gICAgICAgICAgICAkKGFwcC50aW1lclNjb3JlKS5hZGRDbGFzcyhcImhpZGVcIik7XHJcbiAgICAgICAgICAgICQoYXBwLmNhdGVnb3J5Q29udGFpbmVyKS5hZGRDbGFzcyhcImhpZGVcIik7XHJcbiAgICAgICAgICAgICQoYXBwLnF1ZXN0aW9uQ29udGFpbmVyKS5hZGRDbGFzcyhcImhpZGVcIik7XHJcbiAgICAgICAgICAgICQoYXBwLnZhbHVlQ29udGFpbmVyKS5hZGRDbGFzcyhcImhpZGVcIik7XHJcbiAgICAgICAgICAgICQoYXBwLmFuc3dlckNvbnRhaW5lcikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG4gICAgICAgICAgICAkKGFwcC5yaWdodCkuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG4gICAgICAgICAgICAkKGFwcC53cm9uZykuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG4gICAgICAgICAgICAkKGFwcC5nYW1lT3ZlcikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG4gICAgICAgICAgICAkKGFwcC5maW5hbFNjb3JlKS5hcHBlbmQoYFlvdXIgc2NvcmUgd2FzIDxzcGFuPiQke2FwcC5zY29yZX08L3NwYW4+YClcclxuICAgICAgICB9XHJcblxyXG4gICAgfSwgMTAwMCk7XHJcbn1cclxuICAgIC8vIGNoYW5naW5nIHRpbWVyIHNvIGl0J3MgY29tcGF0aWJsZSB3aXRoIG1pbnV0ZXNcclxuICAgIGZ1bmN0aW9uIGRpc3BsYXlUaW1lTGVmdChzZWNvbmRzKSB7XHJcbiAgICAgICAgY29uc3QgbWludXRlcyA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDYwKTtcclxuICAgICAgICBjb25zdCByZW1haW5kZXJTZWNvbmRzID0gc2Vjb25kcyAlIDYwO1xyXG4gICAgICAgIGNvbnN0IGRpc3BsYXkgPSBgJHttaW51dGVzfToke3JlbWFpbmRlclNlY29uZHMgPCAxMCA/IFwiMFwiIDogXCJcIn0ke3JlbWFpbmRlclNlY29uZHN9YDtcclxuICAgICAgICAkKGFwcC50aW1lclRleHQpLnRleHQoZGlzcGxheSk7XHJcbiAgICB9XHJcblxyXG5cclxuLy8gPT09PT09PT09PT09PT09XHJcbi8vIERJU1BMQVkgUkFORE9NIFFVRVNUSU9OIEJBU0VEIE9OIFVTRVIgSU5QVVQgXHJcbi8vIEFORCBSQU5ET00gQU5TV0VSUyBCQVNFRCBPTiBUSEUgQ0FUUkdPUllcclxuLy8gVVNFUiBQVVQgSU4gIFxyXG4vLyA9PT09PT09PT09PT09PT1cclxuYXBwLmRpc3BsYXlRdWVzdGlvbiA9IGZ1bmN0aW9uIChxdWVzdGlvbnMpIHtcclxuXHJcbiAgICAvLyBmaWx0ZXJpbmcgZm9yIGdvb2QgcXVlc3Rpb25zXHJcbiAgICBjb25zdCBnb29kUXVlc3Rpb25zID0gcXVlc3Rpb25zLmZpbHRlcigocXVlc3Rpb24pID0+IHtcclxuICAgICAgICByZXR1cm4gcXVlc3Rpb24uaW52YWxpZF9jb3VudCA9PT0gbnVsbDtcclxuICAgIH0pXHJcblxyXG4gICAgLy8gZ2V0IGEgcmFuZG9tIG51bWJlciBhbmQgZGlzcGxheSBhIHJhbmRvbSBxdWVzdGlvblxyXG4gICAgLy8gYmFzZWQgb24gdGhhdCByYW5kb20gbnVtYmVyIFxyXG4gICAgbGV0IHJhbmRvbU51bSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGdvb2RRdWVzdGlvbnMubGVuZ3RoKTtcclxuICAgIC8vIGFwcGVuZCB0aGUgcmFuZG9tIHF1ZXN0aW9uIGluIG91ciBpbmRleCBwYWdlIFxyXG4gICAgY29uc3QgdGl0bGUgPSAkKGA8aDQgY2xhc3M9XCJjYXBpdGFsaXplXCI+YCkudGV4dChgQ2F0ZWdvcnk6ICR7Z29vZFF1ZXN0aW9uc1tyYW5kb21OdW1dLmNhdGVnb3J5LnRpdGxlfWApO1xyXG4gICAgY29uc3QgdmFsdWUgPSAkKFwiPGg0PlwiKS50ZXh0KGBXYWdlcjogJCR7YXBwLnVzZXJWYWx1ZUNob2ljZX1gKTtcclxuICAgIGNvbnN0IHF1ZXN0aW9uID0gJChgPGgzIGNsYXNzPVwicXVlc3Rpb25UZXh0XCI+YCkudGV4dChnb29kUXVlc3Rpb25zW3JhbmRvbU51bV0ucXVlc3Rpb24pO1xyXG5cclxuICAgIC8vIGFuIGFycmF5IHdpdGggdGhlIHJlc3VsdHMgdG8gaGVscCBnZXQgcmFuZG9tIGFuc3dlcnNcclxuICAgIGxldCByZXN1bHQgPSBbXTtcclxuXHJcbiAgICAvLyA9PT09PT09PT09PT09PT1cclxuICAgIC8vIEdFVFRJTkcgUkFORE9NIEFOU1dFUlMgXHJcbiAgICAvLyBGUk9NIENBVEVHT1JZIFRIRSBVU0VSIENIT1NFIFxyXG4gICAgLy8gPT09PT09PT09PT09PT09XHJcbiAgICBhcHAud3JvbmdBbnN3ZXJzID0gZnVuY3Rpb24gKHJlcywgbmVlZGVkRWxlbWVudHMpIHtcclxuICAgICAgICAvLyBmaWx0ZXJpbmcgdGhyb3VnaCB0aGUgcmVzdWx0cyBvZiBcclxuICAgICAgICAvL3RoZSBzZWNvbmQgYWpheCBjYWxsIGZvciBhbnN3ZXJzXHJcbiAgICAgICAgY29uc3QgZmlsdGVyZWRBbnN3ZXJzID0gcmVzLm1hcCgoYW5zd2VyKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBhbnN3ZXIuYW5zd2VyO1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIC8vIGdldHRpbmcgYSByYW5kb20gMTAgYW5zc3dlcnMgZnJvbSBzZWNvbmQgYWpheCByZXF1ZXN0IFxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmVlZGVkRWxlbWVudHM7IGkrKykge1xyXG4gICAgICAgICAgICByZXN1bHQucHVzaChmaWx0ZXJlZEFuc3dlcnNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcmVzLmxlbmd0aCldKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHVzaW5nIHJlZ2V4IGhlcmVcclxuICAgICAgICBsZXQgbmV3QW5zd2Vyc1dpdGhvdXRSYW5kb21DaGFyYWN0ZXJzO1xyXG4gICAgICAgIGxldCBlbXB0eUFycmF5ID0gW107XHJcbiAgICAgICAgbGV0IHJlID0gLzxcXC8/W1xcd1xccz1cIi8uJzo7Iy1cXC9cXD9dKz58W1xcL1xcXFw6Kz1cIiNdKy9naVxyXG4gICAgICAgIGxldCBhbnN3ZXJzV2l0aG91dFJhbmRvbUNoYXJhY3RlcnMgPSByZXN1bHQuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICBuZXdBbnN3ZXJzV2l0aG91dFJhbmRvbUNoYXJhY3RlcnMgPSBpdGVtLnJlcGxhY2UocmUsICcnKTtcclxuICAgICAgICAgICAgZW1wdHlBcnJheS5wdXNoKG5ld0Fuc3dlcnNXaXRob3V0UmFuZG9tQ2hhcmFjdGVycylcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhhcHAuY29ycmVjdEFuc3dlcik7XHJcbiAgICAgICAgYXBwLmNvcnJlY3RBbnN3ZXIgPSBhcHAuY29ycmVjdEFuc3dlci5yZXBsYWNlKHJlLCBcIlwiKVxyXG5cclxuXHJcbiAgICAgICAgLy8gbGV0IHJlID0gLzxcXC8/W1xcd1xccz1cIi8uJzo7Iy1cXC9cXD9dKz4vZ2lcclxuICAgICAgICAvLyB2YXIgcmVzdWx0ID0gJzxpPmhlbGxvPC9pPic7XHJcbiAgICAgICAgLy8gdmFyIG5ld1Jlc3VsdCA9IHJlc3VsdC5yZXBsYWNlKHJlLCAnJyk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2cobmV3UmVzdWx0KTsgXHJcblxyXG4gICAgICAgIC8vIGZpbHRlciB0aHJvdWdoIGFuc3dlcnMgdG8gbWFrZSBzdXJlIHRoZXkncmUgdW5pcXVlIFxyXG4gICAgICAgIC8vIGFuZCBkdXBsaWNhdGVzIGRvbid0IHNob3cgdXAgXHJcbiAgICAgICAgbGV0IHVuaXF1ZUFuc3dlcnMgPSBuZXcgU2V0KGVtcHR5QXJyYXkpO1xyXG4gICAgICAgIHVuaXF1ZUFuc3dlcnMuYWRkKGFwcC5jb3JyZWN0QW5zd2VyKTtcclxuXHJcbiAgICAgICAgLy8gbG9vcCB0aHJvdWdoIG5ldyBhcnJheSBvZiB1bmlxdWUgYW5zd2VycyBcclxuICAgICAgICAvLyBhbmQgYXBwZW5kIHRoZSBhbnN3ZXJzIGluIHRoZSBhcnJheVxyXG4gICAgICAgIC8vIGZvciAobGV0IGFuc3dlciBvZiB1bmlxdWVBbnN3ZXJzLnZhbHVlcygpKSB7XHJcbiAgICAgICAgLy8gICAgIC8vICQoXCIuYW5zd2VyQ29udGFpbmVyXCIpLmFwcGVuZChgPGlucHV0IHR5cGUgPVwicmFkaW9cIiBuYW1lPVwiYW5zd2Vyc1wiIHZhbHVlPVwiJHthbnN3ZXJ9XCIgaWQ9XCIke2Fuc3dlcn1cIiBjbGFzcz1cImFuc3dlcnNcIj48bGFiZWwgZm9yPVwiJHthbnN3ZXJ9XCI+JHthbnN3ZXJ9PC9sYWJlbD5gKVxyXG4gICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgLy8gdGhpcyB0YWtlcyB0aGUgbmV3IFNldCBhbmQgbWFrZXMgaXQgaW50byBhbiBhcnJheVxyXG4gICAgICAgIGxldCBiYWNrVG9SZWdBcnJheSA9IEFycmF5LmZyb20odW5pcXVlQW5zd2Vycyk7XHJcblxyXG4gICAgICAgIC8vIGxvb3Bpbmcgb3ZlciByZWd1bGFyIGFycmF5IFxyXG4gICAgICAgIC8vIHRvIG1ha2Ugc3VyZSB3ZSBvbmx5IGhhdmUgNSBhbnN3ZXJzIFxyXG4gICAgICAgIGZvciAobGV0IGkgPSBiYWNrVG9SZWdBcnJheS5sZW5ndGg7IGkgPiA1OyBpLS0pIHtcclxuICAgICAgICAgICAgYmFja1RvUmVnQXJyYXkucG9wKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyB0aGlzIHJhbmRvbWl6ZXMgdGhlIG9yZGVyIG9mIHRoZSBhcnJheS4gXHJcbiAgICAgICAgYmFja1RvUmVnQXJyYXkuc29ydChmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gMC41IC0gTWF0aC5yYW5kb20oKSB9KTtcclxuXHJcbiAgICAgICAgLy8gZm9yIGV2ZXJ5IGFuc3dlciBhcHBlbmQgaXQgdG8gdGhlIHBhZ2UgXHJcbiAgICAgICAgZm9yIChsZXQgYW5zd2VyIG9mIGJhY2tUb1JlZ0FycmF5KSB7XHJcbiAgICAgICAgICAgICQoYXBwLmFuc3dlckZvcm0pLmFwcGVuZChgPGlucHV0IHR5cGUgPVwicmFkaW9cIiBuYW1lPVwiYW5zd2Vyc1wiIHZhbHVlPVwiJHthbnN3ZXJ9XCIgaWQ9XCIke2Fuc3dlcn1cIiBjbGFzcz1cImFuc3dlcnNcIj48bGFiZWwgZm9yPVwiJHthbnN3ZXJ9XCIgY2xhc3M9XCJjYXBpdGFsaXplXCI+JHthbnN3ZXJ9PC9sYWJlbD5gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gYXBwZW5kaW5nIHRoZSBzdWJtaXQgYnV0dG9uIFxyXG4gICAgICAgICQoYXBwLmFuc3dlckZvcm0pLmFwcGVuZChgPGlucHV0IHR5cGU9XCJzdWJtaXRcIiB2YWx1ZT1cIlN1Ym1pdCBBbnN3ZXJcIiBjbGFzcz1cInN1Ym1pdEFuc3dlciBidXR0b25cIj5gKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBzdG9yaW5nIHVzZXIncyBhbnN3ZXIgY2hvaWNlXHJcbiAgICAgICAgJChcIi5hbnN3ZXJzXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImNsaWNrZWQgb24gYW4gYW5zd2VyXCIpXHJcbiAgICAgICAgICAgIGFwcC51c2VyVmFsdWVDaG9pY2UgPSAkKFwiLmFuc3dlcnM6Y2hlY2tlZFwiKS52YWwoKTtcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICAvLyBzdWJtaXR0aW5nIHRoZSBhbnN3ZXIgYW5kIGNvbXBhcmluZyB0aGUgdXNlciBjaG9pY2UgdG8gY29ycmVjdCBhbnN3ZXIgXHJcbiAgICAgICAgJChcIi5zdWJtaXRBbnN3ZXJcIikub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY2xpY2tlZCBzdWJtaXQgYnV0dG9uXCIpO1xyXG4gICAgICAgICAgICAkKGFwcC5xdWVzdGlvbkNvbnRhaW5lcikuYWRkQ2xhc3MoXCJoaWRlXCIpLmVtcHR5KCk7XHJcbiAgICAgICAgICAgICQoYXBwLmFuc3dlckZvcm0pLmVtcHR5KCk7XHJcbiAgICAgICAgICAgICQoYXBwLmFuc3dlckNvbnRhaW5lcikuYWRkQ2xhc3MoXCJoaWRlXCIpXHJcbiAgICAgICAgICAgIC8vIGlmIHVzZXIgY2hvaWNlIGlzIGNvcnJlY3Qgc2hvdyByaWdodCBwYWdlXHJcbiAgICAgICAgICAgIC8vIGlmIG5vdCBzaG93IHRoZSB3cm9uZyBwYWdlXHJcbiAgICAgICAgICAgIGlmIChhcHAudXNlclZhbHVlQ2hvaWNlID09PSBhcHAuY29ycmVjdEFuc3dlcikge1xyXG4gICAgICAgICAgICAgICAgYXBwLnNjb3JlID0gYXBwLnNjb3JlICsgZ29vZFF1ZXN0aW9uc1tyYW5kb21OdW1dLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgJChhcHAuc2NvcmVUZXh0KS50ZXh0KGBTY29yZTogJCR7YXBwLnNjb3JlfWApXHJcbiAgICAgICAgICAgICAgICAkKGFwcC5yaWdodCkucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhcHAuc2NvcmUgPSBhcHAuc2NvcmUgLSBnb29kUXVlc3Rpb25zW3JhbmRvbU51bV0udmFsdWU7XHJcbiAgICAgICAgICAgICAgICAkKGFwcC5zY29yZVRleHQpLnRleHQoYFNjb3JlOiAkJHthcHAuc2NvcmV9YClcclxuICAgICAgICAgICAgICAgICQoYXBwLndyb25nKS5yZW1vdmVDbGFzcyhcImhpZGVcIilcclxuICAgICAgICAgICAgICAgICQoYXBwLnJpZ2h0QW5zd2VyKS50ZXh0KGBUaGUgcmlnaHQgYW5zd2VyIHdhcyAke2FwcC5jb3JyZWN0QW5zd2VyfWApXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICAvLyBnbyB0byB0aGUgbmV4dCBxdWVzdGlvblxyXG4gICAgICAgICQoYXBwLm5leHRRdWVzdGlvbikub24oXCJjbGlja1wiLCBmdW5jdGlvbihlKXtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAkKGFwcC5jYXRlZ29yeUNvbnRhaW5lcikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG4gICAgICAgICAgICAkKGFwcC53cm9uZykuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG4gICAgICAgICAgICAkKGFwcC5yaWdodCkuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgfSAvLyBlbmQgb2Ygd3JvbmcgYW5zd2VycyBmdW5jdGlvbiBcclxuXHJcbiAgICAvLyA9PT09PT09PT09PT09PT1cclxuICAgIC8vIERJU1BMQVkgQ09SUkVDVCBBTlNXRVJTIFxyXG4gICAgLy8gRlJPTSBDQVRFR09SWSBUSEUgVVNFUiBDSE9TRVxyXG4gICAgLy8gPT09PT09PT09PT09PT09XHJcbiAgICBhcHAuY29ycmVjdEFuc3dlcjtcclxuICAgIGNvbnN0IGRpc3BsYXlBbnN3ZXJzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8vIHRoaXMgaXMgdGhlIGNvcnJlY3QgYW5zd2VyIFxyXG4gICAgICAgIGFwcC5jb3JyZWN0QW5zd2VyID0gZ29vZFF1ZXN0aW9uc1tyYW5kb21OdW1dLmFuc3dlcjtcclxuXHJcbiAgICAgICAgLy8gcHVzaGluZyB0aGUgY29ycmVjdCBhbnN3ZXIgaW50byByZXN1bHQgXHJcbiAgICAgICAgcmVzdWx0LnB1c2goYXBwLmNvcnJlY3RBbnN3ZXIpO1xyXG4gICAgICAgIC8vIGNhbGxpbmcgYXBwLmdldEFuc3dlcnMgXHJcbiAgICAgICAgLy8gc28gd2UgaGF2ZSB0aGUgaW5mbyBmcm9tIHRoZSBBUEkgXHJcbiAgICAgICAgYXBwLmdldEFuc3dlcnMoYXBwLnVzZXJDYXRlZ29yeUNob2ljZSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8vIGRpc3BsYXlpbmcgaW5mbyBmb3IgcmFuZG9tIHF1ZXN0aW9uXHJcbiAgICAkKGFwcC5xdWVzdGlvbkNvbnRhaW5lcikuYXBwZW5kKHRpdGxlLCB2YWx1ZSwgcXVlc3Rpb24pO1xyXG4gICAgZGlzcGxheUFuc3dlcnMoKTtcclxufSAvLyBlbmQgb2YgZGlzcGxheVF1ZXN0aW9ucyBmdW5jdGlvblxyXG5cclxuLy8gPT09PT09PT09PT09PT09XHJcbi8vIElOSVRJQUxJWkUgVEhFIEFQUFxyXG4vLyA9PT09PT09PT09PT09PT1cclxuYXBwLmluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBhcHAuZXZlbnRzKCk7XHJcbiAgICAkKGFwcC5zdGFydEdhbWUpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxufVxyXG5cclxuLy8gPT09PT09PT09PT09PT09XHJcbi8vIERPQyBSRUFEWVxyXG4vLyA9PT09PT09PT09PT09PT1cclxuJChmdW5jdGlvbiAoKSB7XHJcbiAgICBhcHAuaW5pdCgpO1xyXG59KTsiXX0=
