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

        app.correctAnswer = app.correctAnswer.replace(re, "");

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
            app.userValueChoice = $(".answers:checked").val();
        });

        // submitting the answer and comparing the user choice to correct answer 
        $(".submitAnswer").on("click", function (e) {
            e.preventDefault();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvc2NyaXB0cy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxJQUFNLE1BQU0sRUFBWjtBQUNBLElBQUksS0FBSixHQUFZLENBQVo7O0FBRUEsSUFBSSxXQUFKLEdBQWtCLEVBQUUsY0FBRixDQUFsQjtBQUNBLElBQUksVUFBSixHQUFpQixFQUFFLGFBQUYsQ0FBakI7QUFDQSxJQUFJLFNBQUosR0FBZ0IsRUFBRSxRQUFGLENBQWhCO0FBQ0EsSUFBSSxTQUFKLEdBQWdCLEVBQUUsUUFBRixDQUFoQjs7QUFHQSxJQUFJLFNBQUosR0FBZ0IsRUFBRSxZQUFGLENBQWhCO0FBQ0EsSUFBSSxRQUFKLEdBQWUsRUFBRSxXQUFGLENBQWY7QUFDQSxJQUFJLEtBQUosR0FBWSxFQUFFLFFBQUYsQ0FBWjs7QUFHQSxJQUFJLGNBQUosR0FBcUIsRUFBRSxpQkFBRixDQUFyQjtBQUNBLElBQUksZ0JBQUosR0FBdUIsRUFBRSxtQkFBRixDQUF2QjtBQUNBLElBQUksWUFBSixHQUFtQixFQUFFLGVBQUYsQ0FBbkI7O0FBR0EsSUFBSSxVQUFKLEdBQWlCLEVBQUUsYUFBRixDQUFqQjtBQUNBLElBQUksS0FBSixHQUFZLEVBQUUsUUFBRixDQUFaO0FBQ0EsSUFBSSxLQUFKLEdBQVksRUFBRSxRQUFGLENBQVo7QUFDQSxJQUFJLFdBQUosR0FBa0IsRUFBRSxjQUFGLENBQWxCO0FBQ0EsSUFBSSxRQUFKLEdBQWUsRUFBRSxXQUFGLENBQWY7QUFDQSxJQUFJLFVBQUosR0FBaUIsRUFBRSxhQUFGLENBQWpCOztBQUdBLElBQUksaUJBQUosR0FBd0IsRUFBRSxvQkFBRixDQUF4QjtBQUNBLElBQUksY0FB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UUFBYixDQUFzQixNQUF0QjtBQUNILFNBTEQ7QUFPSCxLQXRGRCxDQXRCdUMsQ0E0R3JDOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBSSxhQUFKO0FBQ0EsUUFBTSxpQkFBaUIsU0FBakIsY0FBaUIsR0FBWTtBQUMvQjtBQUNBLFlBQUksYUFBSixHQUFvQixjQUFjLFNBQWQsRUFBeUIsTUFBN0M7O0FBRUE7QUFDQSxlQUFPLElBQVAsQ0FBWSxJQUFJLGFBQWhCO0FBQ0E7QUFDQTtBQUNBLFlBQUksVUFBSixDQUFlLElBQUksa0JBQW5CO0FBRUgsS0FWRDs7QUFZQTtBQUNBLE1BQUUsSUFBSSxpQkFBTixFQUF5QixNQUF6QixDQUFnQyxLQUFoQyxFQUF1QyxLQUF2QyxFQUE4QyxRQUE5QztBQUNBO0FBQ0gsQ0FsSUQsQyxDQWtJRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQSxJQUFJLElBQUosR0FBVyxZQUFZO0FBQ25CLFFBQUksTUFBSjtBQUNBLE1BQUUsSUFBSSxTQUFOLEVBQWlCLFdBQWpCLENBQTZCLE1BQTdCO0FBQ0gsQ0FIRDs7QUFLQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLFlBQVk7QUFDVixRQUFJLElBQUo7QUFDSCxDQUZEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXHJcbi8vID09PT09PT09PT09PT09XHJcbi8vIENBVEdFT1JZIElEU1xyXG4vLyA9PT09PT09PT09PT09PVxyXG4vLyBmb29kRmFjdHMgPSA4MzI7XHJcbi8vIG1vdmllcz0gMzA5O1xyXG4vLyBwb3BNdXNpYyA9IDc3MDtcclxuLy8gc3R1cGlkQW5zd2VycyA9IDEzNjtcclxuLy8gYW5pbWFscyA9IDIxO1xyXG4vLyBjb3VudHJpZXNPZlRoZVdvcmxkID0gMTM2MTtcclxuLy8gbXVzaWNhbEluc3RydW1lbnRzID0gMTg0O1xyXG4vLyBmcnVpdHNBbmRWZWdldGFibGVzID0gNzc3O1xyXG4vLyBhY3RyZXNzZXMgPSA2MTI7XHJcbi8vIHRocmVlTGV0dGVyV29yZHMgPSAxMDU7XHJcbi8vIHdvcmxkQ2FwaXRhbHMgPSA3ODtcclxuLy8gbXl0aG9sb2d5ID0gNjgwO1xyXG4vLyBkb3VibGVUYWxrID0gODk7XHJcbi8vIHJoeW1lVGltZSA9IDIxNTtcclxuLy8gbnVyc2VyeVJoeW1lcyA9IDM3OyBcclxuLy8gbXVzaWMgPSA3MDtcclxuXHJcbmNvbnN0IGFwcCA9IHt9O1xyXG5hcHAuc2NvcmUgPSAwO1xyXG5cclxuYXBwLnN0YXJ0QnV0dG9uID0gJChcIi5zdGFydEJ1dHRvblwiKTtcclxuYXBwLnRpbWVyU2NvcmUgPSAkKFwiLnRpbWVyU2NvcmVcIik7XHJcbmFwcC50aW1lclRleHQgPSAkKFwiLnRpbWVyXCIpO1xyXG5hcHAuc2NvcmVUZXh0ID0gJChcIi5zY29yZVwiKTtcclxuXHJcblxyXG5hcHAuc3RhcnRHYW1lID0gJChcIi5zdGFydEdhbWVcIik7XHJcbmFwcC5jYXRlZ29yeSA9ICQoXCIuY2F0ZWdvcnlcIik7XHJcbmFwcC52YWx1ZSA9ICQoXCIudmFsdWVcIik7XHJcblxyXG5cclxuYXBwLnN1Ym1pdENhdGVnb3J5ID0gJChcIi5zdWJtaXRDYXRlZ29yeVwiKTtcclxuYXBwLnN1Ym1pdERpZmZpY3VsdHkgPSAkKFwiLnN1Ym1pdERpZmZpY3VsdHlcIik7XHJcbmFwcC5uZXh0UXVlc3Rpb24gPSAkKFwiLm5leHRRdWVzdGlvblwiKTtcclxuXHJcblxyXG5hcHAuYW5zd2VyRm9ybSA9ICQoXCIuYW5zd2VyRm9ybVwiKTtcclxuYXBwLnJpZ2h0ID0gJChcIi5yaWdodFwiKTtcclxuYXBwLndyb25nID0gJChcIi53cm9uZ1wiKTtcclxuYXBwLnJpZ2h0QW5zd2VyID0gJChcIi5yaWdodEFuc3dlclwiKTtcclxuYXBwLmdhbWVPdmVyID0gJChcIi5nYW1lT3ZlclwiKTtcclxuYXBwLmZpbmFsU2NvcmUgPSAkKFwiLmZpbmFsU2NvcmVcIik7XHJcblxyXG5cclxuYXBwLmNhdGVnb3J5Q29udGFpbmVyID0gJChcIi5jYXRlZ29yeUNvbnRhaW5lclwiKTtcclxuYXBwLnZhbHVlQ29udGFpbmVyID0gJChcIi52YWx1ZUNvbnRhaW5lclwiKTtcclxuYXBwLnF1ZXN0aW9uQ29udGFpbmVyID0gJChcIi5xdWVzdGlvbkNvbnRhaW5lclwiKTtcclxuYXBwLmFuc3dlckNvbnRhaW5lciA9ICQoXCIuYW5zd2VyQ29udGFpbmVyXCIpO1xyXG5cclxuXHJcbi8vID09PT09PT09PT09PT09XHJcbi8vIEdFVFRJTkcgSU5GTyBGUk9NIFRIRSBBUElcclxuLy8gRk9SIFRIRSBRVUVTVElPTiBUSEUgVVNTRVIgUElDU1xyXG4vLyBCQVNFRCBPTiBDQVRFR09SWSBBTkQgVkFMVUVcclxuLy8gPT09PT09PT09PT09PT1cclxuXHJcbmFwcC5nZXRDbHVlcyA9IGZ1bmN0aW9uIChjYXRlZ29yeUlELCB2YWx1ZUlEKSB7XHJcbiAgICAkLmFqYXgoe1xyXG4gICAgICAgIHVybDogXCJodHRwOi8vanNlcnZpY2UuaW8vYXBpL2NsdWVzXCIsXHJcbiAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgY291bnQ6IDEwMCxcclxuICAgICAgICAgICAgdmFsdWU6IHZhbHVlSUQsXHJcbiAgICAgICAgICAgIGNhdGVnb3J5OiBjYXRlZ29yeUlELFxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbiAgICAgICAgLnRoZW4oKHJlcykgPT4ge1xyXG4gICAgICAgICAgICBhcHAuZGlzcGxheVF1ZXN0aW9uKHJlcyk7XHJcbiAgICAgICAgfSk7XHJcbn1cclxuXHJcbi8vID09PT09PT09PT09PT09XHJcbi8vIEdFVFRJTkcgSU5GTyBGUk9NIFRIRSBBUElcclxuLy8gRk9SIFRIRSBSQU5ET00gQU5TV0VSUyBcclxuLy8gVEhBVCBNQVRDSCBUSEUgQ0FURUdPUllcclxuLy8gPT09PT09PT09PT09PT1cclxuXHJcbmFwcC5nZXRBbnN3ZXJzID0gZnVuY3Rpb24gKGNhdGVnb3J5SUQpIHtcclxuICAgICQuYWpheCh7XHJcbiAgICAgICAgdXJsOiBcImh0dHA6Ly9qc2VydmljZS5pby9hcGkvY2x1ZXNcIixcclxuICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICBjb3VudDogMTAwLFxyXG4gICAgICAgICAgICBjYXRlZ29yeTogY2F0ZWdvcnlJRFxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbiAgICAgICAgLnRoZW4oKHJlcykgPT4ge1xyXG4gICAgICAgICAgICBhcHAud3JvbmdBbnN3ZXJzKHJlcywgNik7XHJcbiAgICAgICAgfSk7XHJcbn1cclxuXHJcbi8vID09PT09PT09PT09PT09PVxyXG4vLyBVU0VSIENIT09TRVMgQ0FURUdPUlkgQU5EIFZBTFVFXHJcbi8vID09PT09PT09PT09PT09PVxyXG5hcHAuZXZlbnRzID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIC8vIHN0YXJ0cyB0aGUgZ21hZVxyXG4gICAgJChhcHAuc3RhcnRCdXR0b24pLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICQoYXBwLnRpbWVyU2NvcmUpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKS5hZGRDbGFzcyhcImZsZXhcIik7XHJcbiAgICAgICAgJChhcHAuY2F0ZWdvcnlDb250YWluZXIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuICAgICAgICAkKGFwcC5zdGFydEdhbWUpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuICAgICAgICBhcHAudGltZXIoMTIwKTtcclxuICAgIH0pXHJcblxyXG4gICAgLy8gc3RvcmluZyB0aGUgY2F0ZWdvcnkgdmFsdWVcclxuICAgICQoYXBwLmNhdGVnb3J5KS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBhcHAudXNlckNhdGVnb3J5Q2hvaWNlID0gJChcIi5jYXRlZ29yeTpjaGVja2VkXCIpLnZhbCgpO1xyXG4gICAgfSlcclxuXHJcbiAgICAvLyBXaGVuIHVzZXIgc3VibWl0cywgaGlkZSBDYXRlZ29yaWVzIGFuZCBzaG93IHZhbHVlIGNob2ljZXMgXHJcbiAgICAkKGFwcC5zdWJtaXRDYXRlZ29yeSkub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAkKGFwcC5jYXRlZ29yeUNvbnRhaW5lcikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG4gICAgICAgICQoYXBwLnZhbHVlQ29udGFpbmVyKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcbiAgICB9KVxyXG5cclxuICAgIC8vIFdoZW4gdXNlciBzdWJtaXRzLCBzdG9yZSB2YWx1ZSBcclxuICAgICQoYXBwLnZhbHVlKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBhcHAudXNlclZhbHVlQ2hvaWNlID0gJChcIi52YWx1ZTpjaGVja2VkXCIpLnZhbCgpO1xyXG4gICAgfSlcclxuXHJcbiAgICAvLyBXaGVuIHVzZXIgc3VibWl0cyB2YWx1ZSBoaWRlIHRoZSB2YWx1ZSBhbmQgc2hvdyB0aGUgcmFuZG9tIHF1ZXN0aW9uXHJcbiAgICAkKGFwcC5zdWJtaXREaWZmaWN1bHR5KS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICQoYXBwLnZhbHVlQ29udGFpbmVyKS5hZGRDbGFzcyhcImhpZGVcIik7XHJcbiAgICAgICAgJChhcHAucXVlc3Rpb25Db250YWluZXIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuICAgICAgICAkKGFwcC5hbnN3ZXJDb250YWluZXIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuICAgICAgICBhcHAuZ2V0Q2x1ZXMoYXBwLnVzZXJDYXRlZ29yeUNob2ljZSwgYXBwLnVzZXJWYWx1ZUNob2ljZSk7XHJcbiAgICB9KVxyXG59IC8vIGVuZCBvZiBldmVudCBmdW5jdGlvblxyXG5cclxuXHJcbi8vID09PT09PT09PT09PT09PVxyXG4vLyBUSU1FUiBGVU5DVElPTlxyXG4vLyA9PT09PT09PT09PT09PT1cclxuYXBwLnRpbWVyID0gZnVuY3Rpb24oc2Vjb25kcykge1xyXG4gICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcclxuICAgIGNvbnN0IHRoZW4gPSBub3cgKyBzZWNvbmRzICogMTAwMDtcclxuICAgIGRpc3BsYXlUaW1lTGVmdChzZWNvbmRzKTtcclxuICAgIGxldCBjb3VudGRvd24gPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY29uc3Qgc2Vjb25kc0xlZnQgPSBNYXRoLnJvdW5kKCh0aGVuIC0gRGF0ZS5ub3coKSkgLyAxMDAwKTtcclxuICAgICAgICAvLyBpZiB0aGUgdGltZXIgcnVucyBvdXQsIGNsZWFyIHRoZSB0aW1lclxyXG4gICAgICAgIC8vIGRpc3BsYXkgc2NvcmUgXHJcbiAgICAgICAgaWYgKHNlY29uZHNMZWZ0IDwgMCkge1xyXG4gICAgICAgICAgICBjbGVhckludGVydmFsKGNvdW50ZG93bik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZGlzcGxheVRpbWVMZWZ0KHNlY29uZHNMZWZ0KTtcclxuICAgICAgICBpZiAoc2Vjb25kc0xlZnQgPT09IDApe1xyXG4gICAgICAgICAgICBjbGVhckludGVydmFsKGNvdW50ZG93bik7XHJcbiAgICAgICAgICAgICQoYXBwLnRpbWVyU2NvcmUpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuICAgICAgICAgICAgJChhcHAuY2F0ZWdvcnlDb250YWluZXIpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuICAgICAgICAgICAgJChhcHAucXVlc3Rpb25Db250YWluZXIpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuICAgICAgICAgICAgJChhcHAudmFsdWVDb250YWluZXIpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuICAgICAgICAgICAgJChhcHAuYW5zd2VyQ29udGFpbmVyKS5hZGRDbGFzcyhcImhpZGVcIik7XHJcbiAgICAgICAgICAgICQoYXBwLnJpZ2h0KS5hZGRDbGFzcyhcImhpZGVcIik7XHJcbiAgICAgICAgICAgICQoYXBwLndyb25nKS5hZGRDbGFzcyhcImhpZGVcIik7XHJcbiAgICAgICAgICAgICQoYXBwLmdhbWVPdmVyKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcbiAgICAgICAgICAgICQoYXBwLmZpbmFsU2NvcmUpLmFwcGVuZChgWW91ciBzY29yZSB3YXMgPHNwYW4+JCR7YXBwLnNjb3JlfTwvc3Bhbj5gKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LCAxMDAwKTtcclxufVxyXG4gICAgLy8gY2hhbmdpbmcgdGltZXIgc28gaXQncyBjb21wYXRpYmxlIHdpdGggbWludXRlc1xyXG4gICAgZnVuY3Rpb24gZGlzcGxheVRpbWVMZWZ0KHNlY29uZHMpIHtcclxuICAgICAgICBjb25zdCBtaW51dGVzID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gNjApO1xyXG4gICAgICAgIGNvbnN0IHJlbWFpbmRlclNlY29uZHMgPSBzZWNvbmRzICUgNjA7XHJcbiAgICAgICAgY29uc3QgZGlzcGxheSA9IGAke21pbnV0ZXN9OiR7cmVtYWluZGVyU2Vjb25kcyA8IDEwID8gXCIwXCIgOiBcIlwifSR7cmVtYWluZGVyU2Vjb25kc31gO1xyXG4gICAgICAgICQoYXBwLnRpbWVyVGV4dCkudGV4dChkaXNwbGF5KTtcclxuICAgIH1cclxuXHJcblxyXG4vLyA9PT09PT09PT09PT09PT1cclxuLy8gRElTUExBWSBSQU5ET00gUVVFU1RJT04gQkFTRUQgT04gVVNFUiBJTlBVVCBcclxuLy8gQU5EIFJBTkRPTSBBTlNXRVJTIEJBU0VEIE9OIFRIRSBDQVRSR09SWVxyXG4vLyBVU0VSIFBVVCBJTiAgXHJcbi8vID09PT09PT09PT09PT09PVxyXG5hcHAuZGlzcGxheVF1ZXN0aW9uID0gZnVuY3Rpb24gKHF1ZXN0aW9ucykge1xyXG5cclxuICAgIC8vIGZpbHRlcmluZyBmb3IgZ29vZCBxdWVzdGlvbnNcclxuICAgIGNvbnN0IGdvb2RRdWVzdGlvbnMgPSBxdWVzdGlvbnMuZmlsdGVyKChxdWVzdGlvbikgPT4ge1xyXG4gICAgICAgIHJldHVybiBxdWVzdGlvbi5pbnZhbGlkX2NvdW50ID09PSBudWxsO1xyXG4gICAgfSlcclxuXHJcbiAgICAvLyBnZXQgYSByYW5kb20gbnVtYmVyIGFuZCBkaXNwbGF5IGEgcmFuZG9tIHF1ZXN0aW9uXHJcbiAgICAvLyBiYXNlZCBvbiB0aGF0IHJhbmRvbSBudW1iZXIgXHJcbiAgICBsZXQgcmFuZG9tTnVtID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogZ29vZFF1ZXN0aW9ucy5sZW5ndGgpO1xyXG4gICAgLy8gYXBwZW5kIHRoZSByYW5kb20gcXVlc3Rpb24gaW4gb3VyIGluZGV4IHBhZ2UgXHJcbiAgICBjb25zdCB0aXRsZSA9ICQoYDxoNCBjbGFzcz1cImNhcGl0YWxpemVcIj5gKS50ZXh0KGBDYXRlZ29yeTogJHtnb29kUXVlc3Rpb25zW3JhbmRvbU51bV0uY2F0ZWdvcnkudGl0bGV9YCk7XHJcbiAgICBjb25zdCB2YWx1ZSA9ICQoXCI8aDQ+XCIpLnRleHQoYFdhZ2VyOiAkJHthcHAudXNlclZhbHVlQ2hvaWNlfWApO1xyXG4gICAgY29uc3QgcXVlc3Rpb24gPSAkKGA8aDMgY2xhc3M9XCJxdWVzdGlvblRleHRcIj5gKS50ZXh0KGdvb2RRdWVzdGlvbnNbcmFuZG9tTnVtXS5xdWVzdGlvbik7XHJcblxyXG4gICAgLy8gYW4gYXJyYXkgd2l0aCB0aGUgcmVzdWx0cyB0byBoZWxwIGdldCByYW5kb20gYW5zd2Vyc1xyXG4gICAgbGV0IHJlc3VsdCA9IFtdO1xyXG5cclxuICAgIC8vID09PT09PT09PT09PT09PVxyXG4gICAgLy8gR0VUVElORyBSQU5ET00gQU5TV0VSUyBcclxuICAgIC8vIEZST00gQ0FURUdPUlkgVEhFIFVTRVIgQ0hPU0UgXHJcbiAgICAvLyA9PT09PT09PT09PT09PT1cclxuICAgIGFwcC53cm9uZ0Fuc3dlcnMgPSBmdW5jdGlvbiAocmVzLCBuZWVkZWRFbGVtZW50cykge1xyXG4gICAgICAgIC8vIGZpbHRlcmluZyB0aHJvdWdoIHRoZSByZXN1bHRzIG9mIFxyXG4gICAgICAgIC8vdGhlIHNlY29uZCBhamF4IGNhbGwgZm9yIGFuc3dlcnNcclxuICAgICAgICBjb25zdCBmaWx0ZXJlZEFuc3dlcnMgPSByZXMubWFwKChhbnN3ZXIpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGFuc3dlci5hbnN3ZXI7XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgLy8gZ2V0dGluZyBhIHJhbmRvbSAxMCBhbnNzd2VycyBmcm9tIHNlY29uZCBhamF4IHJlcXVlc3QgXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuZWVkZWRFbGVtZW50czsgaSsrKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKGZpbHRlcmVkQW5zd2Vyc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiByZXMubGVuZ3RoKV0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gdXNpbmcgcmVnZXggaGVyZVxyXG4gICAgICAgIGxldCBuZXdBbnN3ZXJzV2l0aG91dFJhbmRvbUNoYXJhY3RlcnM7XHJcbiAgICAgICAgbGV0IGVtcHR5QXJyYXkgPSBbXTtcclxuICAgICAgICBsZXQgcmUgPSAvPFxcLz9bXFx3XFxzPVwiLy4nOjsjLVxcL1xcP10rPnxbXFwvXFxcXDorPVwiI10rL2dpXHJcbiAgICAgICAgbGV0IGFuc3dlcnNXaXRob3V0UmFuZG9tQ2hhcmFjdGVycyA9IHJlc3VsdC5mb3JFYWNoKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgIG5ld0Fuc3dlcnNXaXRob3V0UmFuZG9tQ2hhcmFjdGVycyA9IGl0ZW0ucmVwbGFjZShyZSwgJycpO1xyXG4gICAgICAgICAgICBlbXB0eUFycmF5LnB1c2gobmV3QW5zd2Vyc1dpdGhvdXRSYW5kb21DaGFyYWN0ZXJzKVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGFwcC5jb3JyZWN0QW5zd2VyID0gYXBwLmNvcnJlY3RBbnN3ZXIucmVwbGFjZShyZSwgXCJcIilcclxuXHJcbiAgICAgICAgLy8gZmlsdGVyIHRocm91Z2ggYW5zd2VycyB0byBtYWtlIHN1cmUgdGhleSdyZSB1bmlxdWUgXHJcbiAgICAgICAgLy8gYW5kIGR1cGxpY2F0ZXMgZG9uJ3Qgc2hvdyB1cCBcclxuICAgICAgICBsZXQgdW5pcXVlQW5zd2VycyA9IG5ldyBTZXQoZW1wdHlBcnJheSk7XHJcbiAgICAgICAgdW5pcXVlQW5zd2Vycy5hZGQoYXBwLmNvcnJlY3RBbnN3ZXIpO1xyXG5cclxuICAgICAgICAvLyBsb29wIHRocm91Z2ggbmV3IGFycmF5IG9mIHVuaXF1ZSBhbnN3ZXJzIFxyXG4gICAgICAgIC8vIGFuZCBhcHBlbmQgdGhlIGFuc3dlcnMgaW4gdGhlIGFycmF5XHJcbiAgICAgICAgLy8gZm9yIChsZXQgYW5zd2VyIG9mIHVuaXF1ZUFuc3dlcnMudmFsdWVzKCkpIHtcclxuICAgICAgICAvLyAgICAgLy8gJChcIi5hbnN3ZXJDb250YWluZXJcIikuYXBwZW5kKGA8aW5wdXQgdHlwZSA9XCJyYWRpb1wiIG5hbWU9XCJhbnN3ZXJzXCIgdmFsdWU9XCIke2Fuc3dlcn1cIiBpZD1cIiR7YW5zd2VyfVwiIGNsYXNzPVwiYW5zd2Vyc1wiPjxsYWJlbCBmb3I9XCIke2Fuc3dlcn1cIj4ke2Fuc3dlcn08L2xhYmVsPmApXHJcbiAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICAvLyB0aGlzIHRha2VzIHRoZSBuZXcgU2V0IGFuZCBtYWtlcyBpdCBpbnRvIGFuIGFycmF5XHJcbiAgICAgICAgbGV0IGJhY2tUb1JlZ0FycmF5ID0gQXJyYXkuZnJvbSh1bmlxdWVBbnN3ZXJzKTtcclxuXHJcbiAgICAgICAgLy8gbG9vcGluZyBvdmVyIHJlZ3VsYXIgYXJyYXkgXHJcbiAgICAgICAgLy8gdG8gbWFrZSBzdXJlIHdlIG9ubHkgaGF2ZSA1IGFuc3dlcnMgXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IGJhY2tUb1JlZ0FycmF5Lmxlbmd0aDsgaSA+IDU7IGktLSkge1xyXG4gICAgICAgICAgICBiYWNrVG9SZWdBcnJheS5wb3AoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHRoaXMgcmFuZG9taXplcyB0aGUgb3JkZXIgb2YgdGhlIGFycmF5LiBcclxuICAgICAgICBiYWNrVG9SZWdBcnJheS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7IHJldHVybiAwLjUgLSBNYXRoLnJhbmRvbSgpIH0pO1xyXG5cclxuICAgICAgICAvLyBmb3IgZXZlcnkgYW5zd2VyIGFwcGVuZCBpdCB0byB0aGUgcGFnZSBcclxuICAgICAgICBmb3IgKGxldCBhbnN3ZXIgb2YgYmFja1RvUmVnQXJyYXkpIHtcclxuICAgICAgICAgICAgJChhcHAuYW5zd2VyRm9ybSkuYXBwZW5kKGA8aW5wdXQgdHlwZSA9XCJyYWRpb1wiIG5hbWU9XCJhbnN3ZXJzXCIgdmFsdWU9XCIke2Fuc3dlcn1cIiBpZD1cIiR7YW5zd2VyfVwiIGNsYXNzPVwiYW5zd2Vyc1wiPjxsYWJlbCBmb3I9XCIke2Fuc3dlcn1cIiBjbGFzcz1cImNhcGl0YWxpemVcIj4ke2Fuc3dlcn08L2xhYmVsPmApO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBhcHBlbmRpbmcgdGhlIHN1Ym1pdCBidXR0b24gXHJcbiAgICAgICAgJChhcHAuYW5zd2VyRm9ybSkuYXBwZW5kKGA8aW5wdXQgdHlwZT1cInN1Ym1pdFwiIHZhbHVlPVwiU3VibWl0IEFuc3dlclwiIGNsYXNzPVwic3VibWl0QW5zd2VyIGJ1dHRvblwiPmApO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIHN0b3JpbmcgdXNlcidzIGFuc3dlciBjaG9pY2VcclxuICAgICAgICAkKFwiLmFuc3dlcnNcIikub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGFwcC51c2VyVmFsdWVDaG9pY2UgPSAkKFwiLmFuc3dlcnM6Y2hlY2tlZFwiKS52YWwoKTtcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICAvLyBzdWJtaXR0aW5nIHRoZSBhbnN3ZXIgYW5kIGNvbXBhcmluZyB0aGUgdXNlciBjaG9pY2UgdG8gY29ycmVjdCBhbnN3ZXIgXHJcbiAgICAgICAgJChcIi5zdWJtaXRBbnN3ZXJcIikub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICQoYXBwLnF1ZXN0aW9uQ29udGFpbmVyKS5hZGRDbGFzcyhcImhpZGVcIikuZW1wdHkoKTtcclxuICAgICAgICAgICAgJChhcHAuYW5zd2VyRm9ybSkuZW1wdHkoKTtcclxuICAgICAgICAgICAgJChhcHAuYW5zd2VyQ29udGFpbmVyKS5hZGRDbGFzcyhcImhpZGVcIilcclxuICAgICAgICAgICAgLy8gaWYgdXNlciBjaG9pY2UgaXMgY29ycmVjdCBzaG93IHJpZ2h0IHBhZ2VcclxuICAgICAgICAgICAgLy8gaWYgbm90IHNob3cgdGhlIHdyb25nIHBhZ2VcclxuICAgICAgICAgICAgaWYgKGFwcC51c2VyVmFsdWVDaG9pY2UgPT09IGFwcC5jb3JyZWN0QW5zd2VyKSB7XHJcbiAgICAgICAgICAgICAgICBhcHAuc2NvcmUgPSBhcHAuc2NvcmUgKyBnb29kUXVlc3Rpb25zW3JhbmRvbU51bV0udmFsdWU7XHJcbiAgICAgICAgICAgICAgICAkKGFwcC5zY29yZVRleHQpLnRleHQoYFNjb3JlOiAkJHthcHAuc2NvcmV9YClcclxuICAgICAgICAgICAgICAgICQoYXBwLnJpZ2h0KS5yZW1vdmVDbGFzcyhcImhpZGVcIilcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGFwcC5zY29yZSA9IGFwcC5zY29yZSAtIGdvb2RRdWVzdGlvbnNbcmFuZG9tTnVtXS52YWx1ZTtcclxuICAgICAgICAgICAgICAgICQoYXBwLnNjb3JlVGV4dCkudGV4dChgU2NvcmU6ICQke2FwcC5zY29yZX1gKVxyXG4gICAgICAgICAgICAgICAgJChhcHAud3JvbmcpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKVxyXG4gICAgICAgICAgICAgICAgJChhcHAucmlnaHRBbnN3ZXIpLnRleHQoYFRoZSByaWdodCBhbnN3ZXIgd2FzICR7YXBwLmNvcnJlY3RBbnN3ZXJ9YClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIC8vIGdvIHRvIHRoZSBuZXh0IHF1ZXN0aW9uXHJcbiAgICAgICAgJChhcHAubmV4dFF1ZXN0aW9uKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICQoYXBwLmNhdGVnb3J5Q29udGFpbmVyKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcbiAgICAgICAgICAgICQoYXBwLndyb25nKS5hZGRDbGFzcyhcImhpZGVcIik7XHJcbiAgICAgICAgICAgICQoYXBwLnJpZ2h0KS5hZGRDbGFzcyhcImhpZGVcIik7XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICB9IC8vIGVuZCBvZiB3cm9uZyBhbnN3ZXJzIGZ1bmN0aW9uIFxyXG5cclxuICAgIC8vID09PT09PT09PT09PT09PVxyXG4gICAgLy8gRElTUExBWSBDT1JSRUNUIEFOU1dFUlMgXHJcbiAgICAvLyBGUk9NIENBVEVHT1JZIFRIRSBVU0VSIENIT1NFXHJcbiAgICAvLyA9PT09PT09PT09PT09PT1cclxuICAgIGFwcC5jb3JyZWN0QW5zd2VyO1xyXG4gICAgY29uc3QgZGlzcGxheUFuc3dlcnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgLy8gdGhpcyBpcyB0aGUgY29ycmVjdCBhbnN3ZXIgXHJcbiAgICAgICAgYXBwLmNvcnJlY3RBbnN3ZXIgPSBnb29kUXVlc3Rpb25zW3JhbmRvbU51bV0uYW5zd2VyO1xyXG5cclxuICAgICAgICAvLyBwdXNoaW5nIHRoZSBjb3JyZWN0IGFuc3dlciBpbnRvIHJlc3VsdCBcclxuICAgICAgICByZXN1bHQucHVzaChhcHAuY29ycmVjdEFuc3dlcik7XHJcbiAgICAgICAgLy8gY2FsbGluZyBhcHAuZ2V0QW5zd2VycyBcclxuICAgICAgICAvLyBzbyB3ZSBoYXZlIHRoZSBpbmZvIGZyb20gdGhlIEFQSSBcclxuICAgICAgICBhcHAuZ2V0QW5zd2VycyhhcHAudXNlckNhdGVnb3J5Q2hvaWNlKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLy8gZGlzcGxheWluZyBpbmZvIGZvciByYW5kb20gcXVlc3Rpb25cclxuICAgICQoYXBwLnF1ZXN0aW9uQ29udGFpbmVyKS5hcHBlbmQodGl0bGUsIHZhbHVlLCBxdWVzdGlvbik7XHJcbiAgICBkaXNwbGF5QW5zd2VycygpO1xyXG59IC8vIGVuZCBvZiBkaXNwbGF5UXVlc3Rpb25zIGZ1bmN0aW9uXHJcblxyXG4vLyA9PT09PT09PT09PT09PT1cclxuLy8gSU5JVElBTElaRSBUSEUgQVBQXHJcbi8vID09PT09PT09PT09PT09PVxyXG5hcHAuaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGFwcC5ldmVudHMoKTtcclxuICAgICQoYXBwLnN0YXJ0R2FtZSkucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG59XHJcblxyXG4vLyA9PT09PT09PT09PT09PT1cclxuLy8gRE9DIFJFQURZXHJcbi8vID09PT09PT09PT09PT09PVxyXG4kKGZ1bmN0aW9uICgpIHtcclxuICAgIGFwcC5pbml0KCk7XHJcbn0pOyJdfQ==
