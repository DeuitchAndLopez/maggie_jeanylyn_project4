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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvc2NyaXB0cy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxJQUFNLE1BQU0sRUFBWjtBQUNBLElBQUksS0FBSixHQUFZLENBQVo7O0FBRUEsSUFBSSxXQUFKLEdBQWtCLEVBQUUsY0FBRixDQUFsQjtBQUNBLElBQUksVUFBSixHQUFpQixFQUFFLGFBQUYsQ0FBakI7QUFDQSxJQUFJLFNBQUosR0FBZ0IsRUFBRSxRQUFGLENBQWhCO0FBQ0EsSUFBSSxTQUFKLEdBQWdCLEVBQUUsUUFBRixDQUFoQjs7QUFHQSxJQUFJLFNBQUosR0FBZ0IsRUFBRSxZQUFGLENBQWhCO0FBQ0EsSUFBSSxRQUFKLEdBQWUsRUFBRSxXQUFGLENBQWY7QUFDQSxJQUFJLEtBQUosR0FBWSxFQUFFLFFBQUYsQ0FBWjs7QUFHQSxJQUFJLGNBQUosR0FBcUIsRUFBRSxpQkFBRixDQUFyQjtBQUNBLElBQUksZ0JBQUosR0FBdUIsRUFBRSxtQkFBRixDQUF2QjtBQUNBLElBQUksWUFBSixHQUFtQixFQUFFLGVBQUYsQ0FBbkI7O0FBR0EsSUFBSSxVQUFKLEdBQWlCLEVBQUUsYUFBRixDQUFqQjtBQUNBLElBQUksS0FBSixHQUFZLEVBQUUsUUFBRixDQUFaO0FBQ0EsSUFBSSxLQUFKLEdBQVksRUFBRSxRQUFGLENBQVo7QUFDQSxJQUFJLFdBQUosR0FBa0IsRUFBRSxjQUFGLENBQWxCO0FBQ0EsSUFBSSxRQUFKLEdBQWUsRUFBRSxXQUFGLENBQWY7QUFDQSxJQUFJLFVBQUosR0FBaUIsRUFBRSxhQUFGLENBQWpCOztBQUdBLElBQUksaUJBQUosR0FBd0IsRUFBRSxvQkFBRixDQUF4QjtBQUNBLElBQUksY0FB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LFFBQWIsQ0FBc0IsTUFBdEI7QUFDSCxTQUxEO0FBT0gsS0F0RkQsQ0F0QnVDLENBNEdyQzs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQUksYUFBSjtBQUNBLFFBQU0saUJBQWlCLFNBQWpCLGNBQWlCLEdBQVk7QUFDL0I7QUFDQSxZQUFJLGFBQUosR0FBb0IsY0FBYyxTQUFkLEVBQXlCLE1BQTdDOztBQUVBO0FBQ0EsZUFBTyxJQUFQLENBQVksSUFBSSxhQUFoQjtBQUNBO0FBQ0E7QUFDQSxZQUFJLFVBQUosQ0FBZSxJQUFJLGtCQUFuQjtBQUVILEtBVkQ7O0FBWUE7QUFDQSxNQUFFLElBQUksaUJBQU4sRUFBeUIsTUFBekIsQ0FBZ0MsS0FBaEMsRUFBdUMsS0FBdkMsRUFBOEMsUUFBOUM7QUFDQTtBQUNILENBbElELEMsQ0FrSUU7O0FBRUY7QUFDQTtBQUNBO0FBQ0EsSUFBSSxJQUFKLEdBQVcsWUFBWTtBQUNuQixRQUFJLE1BQUo7QUFDQSxNQUFFLElBQUksU0FBTixFQUFpQixXQUFqQixDQUE2QixNQUE3QjtBQUNILENBSEQ7O0FBS0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxZQUFZO0FBQ1YsUUFBSSxJQUFKO0FBQ0gsQ0FGRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIlxyXG4vLyA9PT09PT09PT09PT09PVxyXG4vLyBDQVRHRU9SWSBJRFNcclxuLy8gPT09PT09PT09PT09PT1cclxuLy8gZm9vZEZhY3RzID0gODMyO1xyXG4vLyBtb3ZpZXM9IDMwOTtcclxuLy8gcG9wTXVzaWMgPSA3NzA7XHJcbi8vIHN0dXBpZEFuc3dlcnMgPSAxMzY7XHJcbi8vIGFuaW1hbHMgPSAyMTtcclxuLy8gY291bnRyaWVzT2ZUaGVXb3JsZCA9IDEzNjE7XHJcbi8vIG11c2ljYWxJbnN0cnVtZW50cyA9IDE4NDtcclxuLy8gZnJ1aXRzQW5kVmVnZXRhYmxlcyA9IDc3NztcclxuLy8gYWN0cmVzc2VzID0gNjEyO1xyXG4vLyB0aHJlZUxldHRlcldvcmRzID0gMTA1O1xyXG4vLyB3b3JsZENhcGl0YWxzID0gNzg7XHJcbi8vIG15dGhvbG9neSA9IDY4MDtcclxuLy8gZG91YmxlVGFsayA9IDg5O1xyXG4vLyByaHltZVRpbWUgPSAyMTU7XHJcbi8vIG51cnNlcnlSaHltZXMgPSAzNzsgXHJcbi8vIG11c2ljID0gNzA7XHJcblxyXG5jb25zdCBhcHAgPSB7fTtcclxuYXBwLnNjb3JlID0gMDtcclxuXHJcbmFwcC5zdGFydEJ1dHRvbiA9ICQoXCIuc3RhcnRCdXR0b25cIik7XHJcbmFwcC50aW1lclNjb3JlID0gJChcIi50aW1lclNjb3JlXCIpO1xyXG5hcHAudGltZXJUZXh0ID0gJChcIi50aW1lclwiKTtcclxuYXBwLnNjb3JlVGV4dCA9ICQoXCIuc2NvcmVcIik7XHJcblxyXG5cclxuYXBwLnN0YXJ0R2FtZSA9ICQoXCIuc3RhcnRHYW1lXCIpO1xyXG5hcHAuY2F0ZWdvcnkgPSAkKFwiLmNhdGVnb3J5XCIpO1xyXG5hcHAudmFsdWUgPSAkKFwiLnZhbHVlXCIpO1xyXG5cclxuXHJcbmFwcC5zdWJtaXRDYXRlZ29yeSA9ICQoXCIuc3VibWl0Q2F0ZWdvcnlcIik7XHJcbmFwcC5zdWJtaXREaWZmaWN1bHR5ID0gJChcIi5zdWJtaXREaWZmaWN1bHR5XCIpO1xyXG5hcHAubmV4dFF1ZXN0aW9uID0gJChcIi5uZXh0UXVlc3Rpb25cIik7XHJcblxyXG5cclxuYXBwLmFuc3dlckZvcm0gPSAkKFwiLmFuc3dlckZvcm1cIik7XHJcbmFwcC5yaWdodCA9ICQoXCIucmlnaHRcIik7XHJcbmFwcC53cm9uZyA9ICQoXCIud3JvbmdcIik7XHJcbmFwcC5yaWdodEFuc3dlciA9ICQoXCIucmlnaHRBbnN3ZXJcIik7XHJcbmFwcC5nYW1lT3ZlciA9ICQoXCIuZ2FtZU92ZXJcIik7XHJcbmFwcC5maW5hbFNjb3JlID0gJChcIi5maW5hbFNjb3JlXCIpO1xyXG5cclxuXHJcbmFwcC5jYXRlZ29yeUNvbnRhaW5lciA9ICQoXCIuY2F0ZWdvcnlDb250YWluZXJcIik7XHJcbmFwcC52YWx1ZUNvbnRhaW5lciA9ICQoXCIudmFsdWVDb250YWluZXJcIik7XHJcbmFwcC5xdWVzdGlvbkNvbnRhaW5lciA9ICQoXCIucXVlc3Rpb25Db250YWluZXJcIik7XHJcbmFwcC5hbnN3ZXJDb250YWluZXIgPSAkKFwiLmFuc3dlckNvbnRhaW5lclwiKTtcclxuXHJcblxyXG4vLyA9PT09PT09PT09PT09PVxyXG4vLyBHRVRUSU5HIElORk8gRlJPTSBUSEUgQVBJXHJcbi8vIEZPUiBUSEUgUVVFU1RJT04gVEhFIFVTU0VSIFBJQ1NcclxuLy8gQkFTRUQgT04gQ0FURUdPUlkgQU5EIFZBTFVFXHJcbi8vID09PT09PT09PT09PT09XHJcblxyXG5cclxuYXBwLmdldENsdWVzID0gZnVuY3Rpb24gKGNhdGVnb3J5SUQsIHZhbHVlSUQpIHtcclxuICAgICQuYWpheCh7XHJcbiAgICAgICAgdXJsOiBcImh0dHA6Ly9qc2VydmljZS5pby9hcGkvY2x1ZXNcIixcclxuICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICBjb3VudDogMTAwLFxyXG4gICAgICAgICAgICB2YWx1ZTogdmFsdWVJRCxcclxuICAgICAgICAgICAgY2F0ZWdvcnk6IGNhdGVnb3J5SUQsXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgICAgICAudGhlbigocmVzKSA9PiB7XHJcbiAgICAgICAgICAgIGFwcC5kaXNwbGF5UXVlc3Rpb24ocmVzKTtcclxuICAgICAgICB9KTtcclxufVxyXG5cclxuLy8gPT09PT09PT09PT09PT1cclxuLy8gR0VUVElORyBJTkZPIEZST00gVEhFIEFQSVxyXG4vLyBGT1IgVEhFIFJBTkRPTSBBTlNXRVJTIFxyXG4vLyBUSEFUIE1BVENIIFRIRSBDQVRFR09SWVxyXG4vLyA9PT09PT09PT09PT09PVxyXG5cclxuYXBwLmdldEFuc3dlcnMgPSBmdW5jdGlvbiAoY2F0ZWdvcnlJRCkge1xyXG4gICAgJC5hamF4KHtcclxuICAgICAgICB1cmw6IFwiaHR0cDovL2pzZXJ2aWNlLmlvL2FwaS9jbHVlc1wiLFxyXG4gICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgIGNvdW50OiAxMDAsXHJcbiAgICAgICAgICAgIGNhdGVnb3J5OiBjYXRlZ29yeUlEXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgICAgICAudGhlbigocmVzKSA9PiB7XHJcbiAgICAgICAgICAgIGFwcC53cm9uZ0Fuc3dlcnMocmVzLCA2KTtcclxuICAgICAgICB9KTtcclxufVxyXG5cclxuLy8gPT09PT09PT09PT09PT09XHJcbi8vIFVTRVIgQ0hPT1NFUyBDQVRFR09SWSBBTkQgVkFMVUVcclxuLy8gPT09PT09PT09PT09PT09XHJcbmFwcC5ldmVudHMgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgLy8gc3RhcnRzIHRoZSBnbWFlXHJcbiAgICAkKGFwcC5zdGFydEJ1dHRvbikub24oXCJjbGlja1wiLCBmdW5jdGlvbihlKXtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgJChhcHAudGltZXJTY29yZSkucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpLmFkZENsYXNzKFwiZmxleFwiKTtcclxuICAgICAgICAkKGFwcC5jYXRlZ29yeUNvbnRhaW5lcikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG4gICAgICAgICQoYXBwLnN0YXJ0R2FtZSkuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG4gICAgICAgIGFwcC50aW1lcigxMjApO1xyXG4gICAgfSlcclxuXHJcbiAgICAvLyBzdG9yaW5nIHRoZSBjYXRlZ29yeSB2YWx1ZVxyXG4gICAgJChhcHAuY2F0ZWdvcnkpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGFwcC51c2VyQ2F0ZWdvcnlDaG9pY2UgPSAkKFwiLmNhdGVnb3J5OmNoZWNrZWRcIikudmFsKCk7XHJcbiAgICB9KVxyXG5cclxuICAgIC8vIFdoZW4gdXNlciBzdWJtaXRzLCBoaWRlIENhdGVnb3JpZXMgYW5kIHNob3cgdmFsdWUgY2hvaWNlcyBcclxuICAgICQoYXBwLnN1Ym1pdENhdGVnb3J5KS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICQoYXBwLmNhdGVnb3J5Q29udGFpbmVyKS5hZGRDbGFzcyhcImhpZGVcIik7XHJcbiAgICAgICAgJChhcHAudmFsdWVDb250YWluZXIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuICAgIH0pXHJcblxyXG4gICAgLy8gV2hlbiB1c2VyIHN1Ym1pdHMsIHN0b3JlIHZhbHVlIFxyXG4gICAgJChhcHAudmFsdWUpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGFwcC51c2VyVmFsdWVDaG9pY2UgPSAkKFwiLnZhbHVlOmNoZWNrZWRcIikudmFsKCk7XHJcbiAgICB9KVxyXG5cclxuICAgIC8vIFdoZW4gdXNlciBzdWJtaXRzIHZhbHVlIGhpZGUgdGhlIHZhbHVlIGFuZCBzaG93IHRoZSByYW5kb20gcXVlc3Rpb25cclxuICAgICQoYXBwLnN1Ym1pdERpZmZpY3VsdHkpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgJChhcHAudmFsdWVDb250YWluZXIpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuICAgICAgICAkKGFwcC5xdWVzdGlvbkNvbnRhaW5lcikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG4gICAgICAgICQoYXBwLmFuc3dlckNvbnRhaW5lcikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG4gICAgICAgIGFwcC5nZXRDbHVlcyhhcHAudXNlckNhdGVnb3J5Q2hvaWNlLCBhcHAudXNlclZhbHVlQ2hvaWNlKTtcclxuICAgIH0pXHJcbn0gLy8gZW5kIG9mIGV2ZW50IGZ1bmN0aW9uXHJcblxyXG5cclxuLy8gPT09PT09PT09PT09PT09XHJcbi8vIFRJTUVSIEZVTkNUSU9OXHJcbi8vID09PT09PT09PT09PT09PVxyXG5hcHAudGltZXIgPSBmdW5jdGlvbihzZWNvbmRzKSB7XHJcbiAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xyXG4gICAgY29uc3QgdGhlbiA9IG5vdyArIHNlY29uZHMgKiAxMDAwO1xyXG4gICAgZGlzcGxheVRpbWVMZWZ0KHNlY29uZHMpO1xyXG4gICAgbGV0IGNvdW50ZG93biA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBjb25zdCBzZWNvbmRzTGVmdCA9IE1hdGgucm91bmQoKHRoZW4gLSBEYXRlLm5vdygpKSAvIDEwMDApO1xyXG4gICAgICAgIC8vIGlmIHRoZSB0aW1lciBydW5zIG91dCwgY2xlYXIgdGhlIHRpbWVyXHJcbiAgICAgICAgLy8gZGlzcGxheSBzY29yZSBcclxuICAgICAgICBpZiAoc2Vjb25kc0xlZnQgPCAwKSB7XHJcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoY291bnRkb3duKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkaXNwbGF5VGltZUxlZnQoc2Vjb25kc0xlZnQpO1xyXG4gICAgICAgIGlmIChzZWNvbmRzTGVmdCA9PT0gMCl7XHJcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoY291bnRkb3duKTtcclxuICAgICAgICAgICAgJChhcHAudGltZXJTY29yZSkuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG4gICAgICAgICAgICAkKGFwcC5jYXRlZ29yeUNvbnRhaW5lcikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG4gICAgICAgICAgICAkKGFwcC5xdWVzdGlvbkNvbnRhaW5lcikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG4gICAgICAgICAgICAkKGFwcC52YWx1ZUNvbnRhaW5lcikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG4gICAgICAgICAgICAkKGFwcC5hbnN3ZXJDb250YWluZXIpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuICAgICAgICAgICAgJChhcHAucmlnaHQpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuICAgICAgICAgICAgJChhcHAud3JvbmcpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuICAgICAgICAgICAgJChhcHAuZ2FtZU92ZXIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuICAgICAgICAgICAgJChhcHAuZmluYWxTY29yZSkuYXBwZW5kKGBZb3VyIHNjb3JlIHdhcyA8c3Bhbj4kJHthcHAuc2NvcmV9PC9zcGFuPmApXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sIDEwMDApO1xyXG59XHJcbiAgICAvLyBjaGFuZ2luZyB0aW1lciBzbyBpdCdzIGNvbXBhdGlibGUgd2l0aCBtaW51dGVzXHJcbiAgICBmdW5jdGlvbiBkaXNwbGF5VGltZUxlZnQoc2Vjb25kcykge1xyXG4gICAgICAgIGNvbnN0IG1pbnV0ZXMgPSBNYXRoLmZsb29yKHNlY29uZHMgLyA2MCk7XHJcbiAgICAgICAgY29uc3QgcmVtYWluZGVyU2Vjb25kcyA9IHNlY29uZHMgJSA2MDtcclxuICAgICAgICBjb25zdCBkaXNwbGF5ID0gYCR7bWludXRlc306JHtyZW1haW5kZXJTZWNvbmRzIDwgMTAgPyBcIjBcIiA6IFwiXCJ9JHtyZW1haW5kZXJTZWNvbmRzfWA7XHJcbiAgICAgICAgJChhcHAudGltZXJUZXh0KS50ZXh0KGRpc3BsYXkpO1xyXG4gICAgfVxyXG5cclxuXHJcbi8vID09PT09PT09PT09PT09PVxyXG4vLyBESVNQTEFZIFJBTkRPTSBRVUVTVElPTiBCQVNFRCBPTiBVU0VSIElOUFVUIFxyXG4vLyBBTkQgUkFORE9NIEFOU1dFUlMgQkFTRUQgT04gVEhFIENBVFJHT1JZXHJcbi8vIFVTRVIgUFVUIElOICBcclxuLy8gPT09PT09PT09PT09PT09XHJcbmFwcC5kaXNwbGF5UXVlc3Rpb24gPSBmdW5jdGlvbiAocXVlc3Rpb25zKSB7XHJcblxyXG4gICAgLy8gZmlsdGVyaW5nIGZvciBnb29kIHF1ZXN0aW9uc1xyXG4gICAgY29uc3QgZ29vZFF1ZXN0aW9ucyA9IHF1ZXN0aW9ucy5maWx0ZXIoKHF1ZXN0aW9uKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHF1ZXN0aW9uLmludmFsaWRfY291bnQgPT09IG51bGw7XHJcbiAgICB9KVxyXG5cclxuICAgIC8vIGdldCBhIHJhbmRvbSBudW1iZXIgYW5kIGRpc3BsYXkgYSByYW5kb20gcXVlc3Rpb25cclxuICAgIC8vIGJhc2VkIG9uIHRoYXQgcmFuZG9tIG51bWJlciBcclxuICAgIGxldCByYW5kb21OdW0gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBnb29kUXVlc3Rpb25zLmxlbmd0aCk7XHJcbiAgICAvLyBhcHBlbmQgdGhlIHJhbmRvbSBxdWVzdGlvbiBpbiBvdXIgaW5kZXggcGFnZSBcclxuICAgIGNvbnN0IHRpdGxlID0gJChgPGg0IGNsYXNzPVwiY2FwaXRhbGl6ZVwiPmApLnRleHQoYENhdGVnb3J5OiAke2dvb2RRdWVzdGlvbnNbcmFuZG9tTnVtXS5jYXRlZ29yeS50aXRsZX1gKTtcclxuICAgIGNvbnN0IHZhbHVlID0gJChcIjxoND5cIikudGV4dChgV2FnZXI6ICQke2FwcC51c2VyVmFsdWVDaG9pY2V9YCk7XHJcbiAgICBjb25zdCBxdWVzdGlvbiA9ICQoYDxoMyBjbGFzcz1cInF1ZXN0aW9uVGV4dFwiPmApLnRleHQoZ29vZFF1ZXN0aW9uc1tyYW5kb21OdW1dLnF1ZXN0aW9uKTtcclxuXHJcbiAgICAvLyBhbiBhcnJheSB3aXRoIHRoZSByZXN1bHRzIHRvIGhlbHAgZ2V0IHJhbmRvbSBhbnN3ZXJzXHJcbiAgICBsZXQgcmVzdWx0ID0gW107XHJcblxyXG4gICAgLy8gPT09PT09PT09PT09PT09XHJcbiAgICAvLyBHRVRUSU5HIFJBTkRPTSBBTlNXRVJTIFxyXG4gICAgLy8gRlJPTSBDQVRFR09SWSBUSEUgVVNFUiBDSE9TRSBcclxuICAgIC8vID09PT09PT09PT09PT09PVxyXG4gICAgYXBwLndyb25nQW5zd2VycyA9IGZ1bmN0aW9uIChyZXMsIG5lZWRlZEVsZW1lbnRzKSB7XHJcbiAgICAgICAgLy8gZmlsdGVyaW5nIHRocm91Z2ggdGhlIHJlc3VsdHMgb2YgXHJcbiAgICAgICAgLy90aGUgc2Vjb25kIGFqYXggY2FsbCBmb3IgYW5zd2Vyc1xyXG4gICAgICAgIGNvbnN0IGZpbHRlcmVkQW5zd2VycyA9IHJlcy5tYXAoKGFuc3dlcikgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gYW5zd2VyLmFuc3dlcjtcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICAvLyBnZXR0aW5nIGEgcmFuZG9tIDEwIGFuc3N3ZXJzIGZyb20gc2Vjb25kIGFqYXggcmVxdWVzdCBcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5lZWRlZEVsZW1lbnRzOyBpKyspIHtcclxuICAgICAgICAgICAgcmVzdWx0LnB1c2goZmlsdGVyZWRBbnN3ZXJzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHJlcy5sZW5ndGgpXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyB1c2luZyByZWdleCBoZXJlXHJcbiAgICAgICAgbGV0IG5ld0Fuc3dlcnNXaXRob3V0UmFuZG9tQ2hhcmFjdGVycztcclxuICAgICAgICBsZXQgZW1wdHlBcnJheSA9IFtdO1xyXG4gICAgICAgIGxldCByZSA9IC88XFwvP1tcXHdcXHM9XCIvLic6OyMtXFwvXFw/XSs+fFtcXC9cXFxcOis9XCIjXSsvZ2lcclxuICAgICAgICBsZXQgYW5zd2Vyc1dpdGhvdXRSYW5kb21DaGFyYWN0ZXJzID0gcmVzdWx0LmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgbmV3QW5zd2Vyc1dpdGhvdXRSYW5kb21DaGFyYWN0ZXJzID0gaXRlbS5yZXBsYWNlKHJlLCAnJyk7XHJcbiAgICAgICAgICAgIGVtcHR5QXJyYXkucHVzaChuZXdBbnN3ZXJzV2l0aG91dFJhbmRvbUNoYXJhY3RlcnMpXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgYXBwLmNvcnJlY3RBbnN3ZXIgPSBhcHAuY29ycmVjdEFuc3dlci5yZXBsYWNlKHJlLCBcIlwiKVxyXG5cclxuICAgICAgICAvLyBmaWx0ZXIgdGhyb3VnaCBhbnN3ZXJzIHRvIG1ha2Ugc3VyZSB0aGV5J3JlIHVuaXF1ZSBcclxuICAgICAgICAvLyBhbmQgZHVwbGljYXRlcyBkb24ndCBzaG93IHVwIFxyXG4gICAgICAgIGxldCB1bmlxdWVBbnN3ZXJzID0gbmV3IFNldChlbXB0eUFycmF5KTtcclxuICAgICAgICB1bmlxdWVBbnN3ZXJzLmFkZChhcHAuY29ycmVjdEFuc3dlcik7XHJcblxyXG4gICAgICAgIC8vIGxvb3AgdGhyb3VnaCBuZXcgYXJyYXkgb2YgdW5pcXVlIGFuc3dlcnMgXHJcbiAgICAgICAgLy8gYW5kIGFwcGVuZCB0aGUgYW5zd2VycyBpbiB0aGUgYXJyYXlcclxuICAgICAgICAvLyBmb3IgKGxldCBhbnN3ZXIgb2YgdW5pcXVlQW5zd2Vycy52YWx1ZXMoKSkge1xyXG4gICAgICAgIC8vICAgICAvLyAkKFwiLmFuc3dlckNvbnRhaW5lclwiKS5hcHBlbmQoYDxpbnB1dCB0eXBlID1cInJhZGlvXCIgbmFtZT1cImFuc3dlcnNcIiB2YWx1ZT1cIiR7YW5zd2VyfVwiIGlkPVwiJHthbnN3ZXJ9XCIgY2xhc3M9XCJhbnN3ZXJzXCI+PGxhYmVsIGZvcj1cIiR7YW5zd2VyfVwiPiR7YW5zd2VyfTwvbGFiZWw+YClcclxuICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgIC8vIHRoaXMgdGFrZXMgdGhlIG5ldyBTZXQgYW5kIG1ha2VzIGl0IGludG8gYW4gYXJyYXlcclxuICAgICAgICBsZXQgYmFja1RvUmVnQXJyYXkgPSBBcnJheS5mcm9tKHVuaXF1ZUFuc3dlcnMpO1xyXG5cclxuICAgICAgICAvLyBsb29waW5nIG92ZXIgcmVndWxhciBhcnJheSBcclxuICAgICAgICAvLyB0byBtYWtlIHN1cmUgd2Ugb25seSBoYXZlIDUgYW5zd2VycyBcclxuICAgICAgICBmb3IgKGxldCBpID0gYmFja1RvUmVnQXJyYXkubGVuZ3RoOyBpID4gNTsgaS0tKSB7XHJcbiAgICAgICAgICAgIGJhY2tUb1JlZ0FycmF5LnBvcCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gdGhpcyByYW5kb21pemVzIHRoZSBvcmRlciBvZiB0aGUgYXJyYXkuIFxyXG4gICAgICAgIGJhY2tUb1JlZ0FycmF5LnNvcnQoZnVuY3Rpb24gKGEsIGIpIHsgcmV0dXJuIDAuNSAtIE1hdGgucmFuZG9tKCkgfSk7XHJcblxyXG4gICAgICAgIC8vIGZvciBldmVyeSBhbnN3ZXIgYXBwZW5kIGl0IHRvIHRoZSBwYWdlIFxyXG4gICAgICAgIGZvciAobGV0IGFuc3dlciBvZiBiYWNrVG9SZWdBcnJheSkge1xyXG4gICAgICAgICAgICAkKGFwcC5hbnN3ZXJGb3JtKS5hcHBlbmQoYDxpbnB1dCB0eXBlID1cInJhZGlvXCIgbmFtZT1cImFuc3dlcnNcIiB2YWx1ZT1cIiR7YW5zd2VyfVwiIGlkPVwiJHthbnN3ZXJ9XCIgY2xhc3M9XCJhbnN3ZXJzXCI+PGxhYmVsIGZvcj1cIiR7YW5zd2VyfVwiIGNsYXNzPVwiY2FwaXRhbGl6ZVwiPiR7YW5zd2VyfTwvbGFiZWw+YCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGFwcGVuZGluZyB0aGUgc3VibWl0IGJ1dHRvbiBcclxuICAgICAgICAkKGFwcC5hbnN3ZXJGb3JtKS5hcHBlbmQoYDxpbnB1dCB0eXBlPVwic3VibWl0XCIgdmFsdWU9XCJTdWJtaXQgQW5zd2VyXCIgY2xhc3M9XCJzdWJtaXRBbnN3ZXIgYnV0dG9uXCI+YCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gc3RvcmluZyB1c2VyJ3MgYW5zd2VyIGNob2ljZVxyXG4gICAgICAgICQoXCIuYW5zd2Vyc1wiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgYXBwLnVzZXJWYWx1ZUNob2ljZSA9ICQoXCIuYW5zd2VyczpjaGVja2VkXCIpLnZhbCgpO1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIC8vIHN1Ym1pdHRpbmcgdGhlIGFuc3dlciBhbmQgY29tcGFyaW5nIHRoZSB1c2VyIGNob2ljZSB0byBjb3JyZWN0IGFuc3dlciBcclxuICAgICAgICAkKFwiLnN1Ym1pdEFuc3dlclwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgJChhcHAucXVlc3Rpb25Db250YWluZXIpLmFkZENsYXNzKFwiaGlkZVwiKS5lbXB0eSgpO1xyXG4gICAgICAgICAgICAkKGFwcC5hbnN3ZXJGb3JtKS5lbXB0eSgpO1xyXG4gICAgICAgICAgICAkKGFwcC5hbnN3ZXJDb250YWluZXIpLmFkZENsYXNzKFwiaGlkZVwiKVxyXG4gICAgICAgICAgICAvLyBpZiB1c2VyIGNob2ljZSBpcyBjb3JyZWN0IHNob3cgcmlnaHQgcGFnZVxyXG4gICAgICAgICAgICAvLyBpZiBub3Qgc2hvdyB0aGUgd3JvbmcgcGFnZVxyXG4gICAgICAgICAgICBpZiAoYXBwLnVzZXJWYWx1ZUNob2ljZSA9PT0gYXBwLmNvcnJlY3RBbnN3ZXIpIHtcclxuICAgICAgICAgICAgICAgIGFwcC5zY29yZSA9IGFwcC5zY29yZSArIGdvb2RRdWVzdGlvbnNbcmFuZG9tTnVtXS52YWx1ZTtcclxuICAgICAgICAgICAgICAgICQoYXBwLnNjb3JlVGV4dCkudGV4dChgU2NvcmU6ICQke2FwcC5zY29yZX1gKVxyXG4gICAgICAgICAgICAgICAgJChhcHAucmlnaHQpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYXBwLnNjb3JlID0gYXBwLnNjb3JlIC0gZ29vZFF1ZXN0aW9uc1tyYW5kb21OdW1dLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgJChhcHAuc2NvcmVUZXh0KS50ZXh0KGBTY29yZTogJCR7YXBwLnNjb3JlfWApXHJcbiAgICAgICAgICAgICAgICAkKGFwcC53cm9uZykucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpXHJcbiAgICAgICAgICAgICAgICAkKGFwcC5yaWdodEFuc3dlcikudGV4dChgVGhlIHJpZ2h0IGFuc3dlciB3YXMgJHthcHAuY29ycmVjdEFuc3dlcn1gKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgLy8gZ28gdG8gdGhlIG5leHQgcXVlc3Rpb25cclxuICAgICAgICAkKGFwcC5uZXh0UXVlc3Rpb24pLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgJChhcHAuY2F0ZWdvcnlDb250YWluZXIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuICAgICAgICAgICAgJChhcHAud3JvbmcpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuICAgICAgICAgICAgJChhcHAucmlnaHQpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuICAgICAgICB9KVxyXG5cclxuICAgIH0gLy8gZW5kIG9mIHdyb25nIGFuc3dlcnMgZnVuY3Rpb24gXHJcblxyXG4gICAgLy8gPT09PT09PT09PT09PT09XHJcbiAgICAvLyBESVNQTEFZIENPUlJFQ1QgQU5TV0VSUyBcclxuICAgIC8vIEZST00gQ0FURUdPUlkgVEhFIFVTRVIgQ0hPU0VcclxuICAgIC8vID09PT09PT09PT09PT09PVxyXG4gICAgYXBwLmNvcnJlY3RBbnN3ZXI7XHJcbiAgICBjb25zdCBkaXNwbGF5QW5zd2VycyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLyB0aGlzIGlzIHRoZSBjb3JyZWN0IGFuc3dlciBcclxuICAgICAgICBhcHAuY29ycmVjdEFuc3dlciA9IGdvb2RRdWVzdGlvbnNbcmFuZG9tTnVtXS5hbnN3ZXI7XHJcblxyXG4gICAgICAgIC8vIHB1c2hpbmcgdGhlIGNvcnJlY3QgYW5zd2VyIGludG8gcmVzdWx0IFxyXG4gICAgICAgIHJlc3VsdC5wdXNoKGFwcC5jb3JyZWN0QW5zd2VyKTtcclxuICAgICAgICAvLyBjYWxsaW5nIGFwcC5nZXRBbnN3ZXJzIFxyXG4gICAgICAgIC8vIHNvIHdlIGhhdmUgdGhlIGluZm8gZnJvbSB0aGUgQVBJIFxyXG4gICAgICAgIGFwcC5nZXRBbnN3ZXJzKGFwcC51c2VyQ2F0ZWdvcnlDaG9pY2UpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvLyBkaXNwbGF5aW5nIGluZm8gZm9yIHJhbmRvbSBxdWVzdGlvblxyXG4gICAgJChhcHAucXVlc3Rpb25Db250YWluZXIpLmFwcGVuZCh0aXRsZSwgdmFsdWUsIHF1ZXN0aW9uKTtcclxuICAgIGRpc3BsYXlBbnN3ZXJzKCk7XHJcbn0gLy8gZW5kIG9mIGRpc3BsYXlRdWVzdGlvbnMgZnVuY3Rpb25cclxuXHJcbi8vID09PT09PT09PT09PT09PVxyXG4vLyBJTklUSUFMSVpFIFRIRSBBUFBcclxuLy8gPT09PT09PT09PT09PT09XHJcbmFwcC5pbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgYXBwLmV2ZW50cygpO1xyXG4gICAgJChhcHAuc3RhcnRHYW1lKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcbn1cclxuXHJcbi8vID09PT09PT09PT09PT09PVxyXG4vLyBET0MgUkVBRFlcclxuLy8gPT09PT09PT09PT09PT09XHJcbiQoZnVuY3Rpb24gKCkge1xyXG4gICAgYXBwLmluaXQoKTtcclxufSk7Il19
