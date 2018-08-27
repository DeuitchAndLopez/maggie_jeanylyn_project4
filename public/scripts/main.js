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
    axios({
        method: 'GET',
        url: 'https://proxy.hackeryou.com',
        //OR url: 'https://proxy.hackeryou.com',
        dataResponse: 'json',
        paramsSerializer: function paramsSerializer(params) {
            return Qs.stringify(params, { count: 100, value: valueID, category: categoryID });
        },
        params: {
            reqUrl: 'http://api.site.com/api',
            // proxyHeaders: {
            //     // data: {
            //     //     count: 100,
            //     //     value: valueID,
            //     //     category: categoryID,
            //     // }
            // },
            xmlToJSON: true
        }
    });
}.then(function (res) {
    app.displayQuestion(res);
});
// app.getClues = function (categoryID, valueID) {
//     $.ajax({
//         url: "http://jservice.io/api/clues",
//         method: "GET",
//         data: {
//             count: 100,
//             value: valueID,
//             category: categoryID,
//         }
//     })
//         .then((res) => {
//             app.displayQuestion(res);
//         });
// }

// ==============
// GETTING INFO FROM THE API
// FOR THE RANDOM ANSWERS 
// THAT MATCH THE CATEGORY
// ==============

app.getAnswers = function (categoryID) {
    axios({
        method: 'GET',
        url: 'https://proxy.hackeryou.com',
        dataResponse: 'json',
        paramsSerializer: function paramsSerializer(params) {
            return Qs.stringify(params, { count: 100, category: categoryID });
        },
        params: {
            reqUrl: 'http://jservice.io/api/clues',
            // proxyHeaders: {
            //     data: {
            //     count: 100,
            //     category: categoryID
            // }
            // },
            xmlToJSON: true
        }
    });
}.then(function (res) {
    // console.log(res);
    app.wrongAnswers(res, 6);
});

// app.getAnswers = function (categoryID) {
//     $.ajax({
//         url: "http://jservice.io/api/clues",
//         method: "GET",
//         data: {
//             count: 100,
//             category: categoryID
//         }
//     })
//         .then((res) => {
//             app.wrongAnswers(res, 6);
//         });
// }

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
        app.timer(2);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvc2NyaXB0cy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxJQUFNLE1BQU0sRUFBWjtBQUNBLElBQUksS0FBSixHQUFZLENBQVo7O0FBRUEsSUFBSSxXQUFKLEdBQWtCLEVBQUUsY0FBRixDQUFsQjtBQUNBLElBQUksVUFBSixHQUFpQixFQUFFLGFBQUYsQ0FBakI7QUFDQSxJQUFJLFNBQUosR0FBZ0IsRUFBRSxRQUFGLENBQWhCO0FBQ0EsSUFBSSxTQUFKLEdBQWdCLEVBQUUsUUFBRixDQUFoQjs7QUFHQSxJQUFJLFNBQUosR0FBZ0IsRUFBRSxZQUFGLENBQWhCO0FBQ0EsSUFBSSxRQUFKLEdBQWUsRUFBRSxXQUFGLENBQWY7QUFDQSxJQUFJLEtBQUosR0FBWSxFQUFFLFFBQUYsQ0FBWjs7QUFHQSxJQUFJLGNBQUosR0FBcUIsRUFBRSxpQkFBRixDQUFyQjtBQUNBLElBQUksZ0JBQUosR0FBdUIsRUFBRSxtQkFBRixDQUF2QjtBQUNBLElBQUksWUFBSixHQUFtQixFQUFFLGVBQUYsQ0FBbkI7O0FBR0EsSUFBSSxVQUFKLEdBQWlCLEVBQUUsYUFBRixDQUFqQjtBQUNBLElBQUksS0FBSixHQUFZLEVBQUUsUUFBRixDQUFaO0FBQ0EsSUFBSSxLQUFKLEdBQVksRUFBRSxRQUFGLENBQVo7QUFDQSxJQUFJLFdBQUosR0FBa0IsRUFBRSxjQUFGLENBQWxCO0FBQ0EsSUFBSSxRQUFKLEdBQWUsRUFBRSxXQUFGLENBQWY7QUFDQSxJQUFJLFVBQUosR0FBaUIsRUFBRSxhQUFGLENBQWpCOztBQUdBLElBQUksaUJBQUosR0FBd0IsRUFBRSxvQkFBRixDQUF4QjtBQUNBLElBQUksY0FBSixHQUFxQixFQUFFLGlCQUFGLENBQXJCO0FBQ0EsSUFBSSxpQkFBSixHQUF3QixFQUFFLG9CQUFGLENBQXhCO0FBQ0EsSUFBSSxlQUFKLEdBQXNCLEVBQUUsa0JBQUYsQ0FBdEI7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxJQUFJLFFBQUosR0FBZSxVQUFVLFVBQVYsRUFBc0IsT0FBdEIsRUFBK0I7QUFDMUMsVUFBTTtBQUNOLGdCQUFRLEtBREY7QUFFTixhQUFLLDZCQUZDO0FBR047QUFDQSxzQkFBYyxNQUpSO0FBS04sMEJBQWtCLDBCQUFVLE1BQVYsRUFBa0I7QUFDaEMsbUJBQU8sR0FBRyxTQUFILENBQWEsTUFBYixFQUFxQixFQUFFLE9BQU8sR0FBVCxFQUFjLE9BQU8sT0FBckIsRUFBOEIsVUFBVSxVQUF4QyxFQUFyQixDQUFQO0FBQ0gsU0FQSztBQVFOLGdCQUFRO0FBQ0osb0JBQVEseUJBREo7QUFFSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUFXO0FBVFA7QUFSRixLQUFOO0FBb0JILENBckJjLENBcUJiLElBckJhLENBcUJSLFVBQUMsR0FBRCxFQUFTO0FBQ1IsUUFBSSxlQUFKLENBQW9CLEdBQXBCO0FBQ0gsQ0F2QlUsQ0FBZjtBQXdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsSUFBSSxVQUFKLEdBQWlCLFVBQVMsVUFBVCxFQUFxQjtBQUNsQyxVQUFNO0FBQ04sZ0JBQVEsS0FERjtBQUVOLGFBQUssNkJBRkM7QUFHTixzQkFBYyxNQUhSO0FBSU4sMEJBQWtCLDBCQUFVLE1BQVYsRUFBa0I7QUFDaEMsbUJBQU8sR0FBRyxTQUFILENBQWEsTUFBYixFQUFxQixFQUFFLE9BQU8sR0FBVCxFQUFjLFVBQVUsVUFBeEIsRUFBckIsQ0FBUDtBQUNILFNBTks7QUFPTixnQkFBUTtBQUNKLG9CQUFRLDhCQURKO0FBRUo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQVc7QUFSUDtBQVBGLEtBQU47QUFrQkMsQ0FuQlksQ0FtQlgsSUFuQlcsQ0FtQk4sVUFBQyxHQUFELEVBQVM7QUFDWjtBQUNBLFFBQUksWUFBSixDQUFpQixHQUFqQixFQUFzQixDQUF0QjtBQUNILENBdEJZLENBQWpCOztBQXdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLE1BQUosR0FBYSxZQUFZOztBQUVyQjtBQUNBLE1BQUUsSUFBSSxXQUFOLEVBQW1CLEVBQW5CLENBQXNCLE9BQXRCLEVBQStCLFVBQVMsQ0FBVCxFQUFXO0FBQ3RDLFVBQUUsY0FBRjtBQUNBLFVBQUUsSUFBSSxVQUFOLEVBQWtCLFdBQWxCLENBQThCLE1BQTlCLEVBQXNDLFFBQXRDLENBQStDLE1BQS9DO0FBQ0EsVUFBRSxJQUFJLGlCQUFOLEVBQXlCLFdBQXpCLENBQXFDLE1BQXJDO0FBQ0EsVUFBRSxJQUFJLFNBQU4sRUFBaUIsUUFBakIsQ0FBMEIsTUFBMUI7QUFDQSxZQUFJLEtBQUosQ0FBVSxDQUFWO0FBQ0gsS0FORDs7QUFRQTtBQUNBLE1BQUUsSUFBSSxRQUFOLEVBQWdCLEVBQWhCLENBQW1CLE9BQW5CLEVBQTRCLFlBQVk7QUFDcEMsWUFBSSxrQkFBSixHQUF5QixFQUFFLG1CQUFGLEVBQXVCLEdBQXZCLEVBQXpCO0FBQ0gsS0FGRDs7QUFJQTtBQUNBLE1BQUUsSUFBSSxjQUFOLEVBQXNCLEVBQXRCLENBQXlCLE9BQXpCLEVBQWtDLFVBQVUsQ0FBVixFQUFhO0FBQzNDLFVBQUUsY0FBRjtBQUNBLFVBQUUsSUFBSSxpQkFBTixFQUF5QixRQUF6QixDQUFrQyxNQUFsQztBQUNBLFVBQUUsSUFBSSxjQUFOLEVBQXNCLFdBQXRCLENBQWtDLE1BQWxDO0FBQ0gsS0FKRDs7QUFNQTtBQUNBLE1BQUUsSUFBSSxLQUFOLEVBQWEsRUFBYixDQUFnQixPQUFoQixFQUF5QixZQUFZO0FBQ2pDLFlBQUksZUFBSixHQUFzQixFQUFFLGdCQUFGLEVBQW9CLEdBQXBCLEVBQXRCO0FBQ0gsS0FGRDs7QUFJQTtBQUNBLE1BQUUsSUFBSSxnQkFBTixFQUF3QixFQUF4QixDQUEyQixPQUEzQixFQUFvQyxVQUFVLENBQVYsRUFBYTtBQUM3QyxVQUFFLGNBQUY7QUFDQSxVQUFFLElBQUksY0FBTixFQUFzQixRQUF0QixDQUErQixNQUEvQjtBQUNBLFVBQUUsSUFBSSxpQkFBTixFQUF5QixXQUF6QixDQUFxQyxNQUFyQztBQUNBLFVBQUUsSUFBSSxlQUFOLEVBQXVCLFdBQXZCLENBQW1DLE1BQW5DO0FBQ0EsWUFBSSxRQUFKLENBQWEsSUFBSSxrQkFBakIsRUFBcUMsSUFBSSxlQUF6QztBQUNILEtBTkQ7QUFPSCxDQXBDRCxDLENBb0NFOzs7QUFHRjtBQUNBO0FBQ0E7QUFDQSxJQUFJLEtBQUosR0FBWSxVQUFTLE9BQVQsRUFBa0I7QUFDMUIsUUFBTSxNQUFNLEtBQUssR0FBTCxFQUFaO0FBQ0EsUUFBTSxPQUFPLE1BQU0sVUFBVSxJQUE3QjtBQUNBLG9CQUFnQixPQUFoQjtBQUNBLFFBQUksWUFBWSxZQUFZLFlBQVk7QUFDcEMsWUFBTSxjQUFjLEtBQUssS0FBTCxDQUFXLENBQUMsT0FBTyxLQUFLLEdBQUwsRUFBUixJQUFzQixJQUFqQyxDQUFwQjtBQUNBO0FBQ0E7QUFDQSxZQUFJLGNBQWMsQ0FBbEIsRUFBcUI7QUFDakIsMEJBQWMsU0FBZDtBQUNBO0FBQ0g7QUFDRCx3QkFBZ0IsV0FBaEI7QUFDQSxZQUFJLGdCQUFnQixDQUFwQixFQUFzQjtBQUNsQiwwQkFBYyxTQUFkO0FBQ0EsY0FBRSxJQUFJLFVBQU4sRUFBa0IsUUFBbEIsQ0FBMkIsTUFBM0I7QUFDQSxjQUFFLElBQUksaUJBQU4sRUFBeUIsUUFBekIsQ0FBa0MsTUFBbEM7QUFDQSxjQUFFLElBQUksaUJBQU4sRUFBeUIsUUFBekIsQ0FBa0MsTUFBbEM7QUFDQSxjQUFFLElBQUksY0FBTixFQUFzQixRQUF0QixDQUErQixNQUEvQjtBQUNBLGNBQUUsSUFBSSxlQUFOLEVBQXVCLFFBQXZCLENBQWdDLE1BQWhDO0FBQ0EsY0FBRSxJQUFJLEtBQU4sRUFBYSxRQUFiLENBQXNCLE1BQXRCO0FBQ0EsY0FBRSxJQUFJLEtBQU4sRUFBYSxRQUFiLENBQXNCLE1BQXRCO0FBQ0EsY0FBRSxJQUFJLFFBQU4sRUFBZ0IsV0FBaEIsQ0FBNEIsTUFBNUI7QUFDQSxjQUFFLElBQUksVUFBTixFQUFrQixNQUFsQiw0QkFBa0QsSUFBSSxLQUF0RDtBQUNIO0FBRUosS0F0QmUsRUFzQmIsSUF0QmEsQ0FBaEI7QUF1QkgsQ0EzQkQ7QUE0Qkk7QUFDQSxTQUFTLGVBQVQsQ0FBeUIsT0FBekIsRUFBa0M7QUFDOUIsUUFBTSxVQUFVLEtBQUssS0FBTCxDQUFXLFVBQVUsRUFBckIsQ0FBaEI7QUFDQSxRQUFNLG1CQUFtQixVQUFVLEVBQW5DO0FBQ0EsUUFBTSxVQUFhLE9BQWIsVUFBd0IsbUJBQW1CLEVBQW5CLEdBQXdCLEdBQXhCLEdBQThCLEVBQXRELElBQTJELGdCQUFqRTtBQUNBLE1BQUUsSUFBSSxTQUFOLEVBQWlCLElBQWpCLENBQXNCLE9BQXRCO0FBQ0g7O0FBR0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksZUFBSixHQUFzQixVQUFVLFNBQVYsRUFBcUI7O0FBRXZDO0FBQ0EsUUFBTSxnQkFBZ0IsVUFBVSxNQUFWLENBQWlCLFVBQUMsUUFBRCxFQUFjO0FBQ2pELGVBQU8sU0FBUyxhQUFULEtBQTJCLElBQWxDO0FBQ0gsS0FGcUIsQ0FBdEI7O0FBSUE7QUFDQTtBQUNBLFFBQUksWUFBWSxLQUFLLEtBQUwsQ0FBVyxLQUFLLE1BQUwsS0FBZ0IsY0FBYyxNQUF6QyxDQUFoQjtBQUNBO0FBQ0EsUUFBTSxRQUFRLCtCQUE2QixJQUE3QixnQkFBK0MsY0FBYyxTQUFkLEVBQXlCLFFBQXpCLENBQWtDLEtBQWpGLENBQWQ7QUFDQSxRQUFNLFFBQVEsRUFBRSxNQUFGLEVBQVUsSUFBVixjQUEwQixJQUFJLGVBQTlCLENBQWQ7QUFDQSxRQUFNLFdBQVcsaUNBQStCLElBQS9CLENBQW9DLGNBQWMsU0FBZCxFQUF5QixRQUE3RCxDQUFqQjs7QUFFQTtBQUNBLFFBQUksU0FBUyxFQUFiOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBSSxZQUFKLEdBQW1CLFVBQVUsR0FBVixFQUFlLGNBQWYsRUFBK0I7QUFDOUM7QUFDQTtBQUNBLFlBQU0sa0JBQWtCLElBQUksR0FBSixDQUFRLFVBQUMsTUFBRCxFQUFZO0FBQ3hDLG1CQUFPLE9BQU8sTUFBZDtBQUNILFNBRnVCLENBQXhCOztBQUlBO0FBQ0EsYUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLGNBQXBCLEVBQW9DLEdBQXBDLEVBQXlDO0FBQ3JDLG1CQUFPLElBQVAsQ0FBWSxnQkFBZ0IsS0FBSyxLQUFMLENBQVcsS0FBSyxNQUFMLEtBQWdCLElBQUksTUFBL0IsQ0FBaEIsQ0FBWjtBQUNIOztBQUVEO0FBQ0EsWUFBSSwwQ0FBSjtBQUNBLFlBQUksYUFBYSxFQUFqQjtBQUNBLFlBQUksS0FBSywwQ0FBVDtBQUNBLFlBQUksaUNBQWlDLE9BQU8sT0FBUCxDQUFlLFVBQUMsSUFBRCxFQUFVO0FBQzFELGdEQUFvQyxLQUFLLE9BQUwsQ0FBYSxFQUFiLEVBQWlCLEVBQWpCLENBQXBDO0FBQ0EsdUJBQVcsSUFBWCxDQUFnQixpQ0FBaEI7QUFDSCxTQUhvQyxDQUFyQzs7QUFLQSxZQUFJLGFBQUosR0FBb0IsSUFBSSxhQUFKLENBQWtCLE9BQWxCLENBQTBCLEVBQTFCLEVBQThCLEVBQTlCLENBQXBCOztBQUVBO0FBQ0E7QUFDQSxZQUFJLGdCQUFnQixJQUFJLEdBQUosQ0FBUSxVQUFSLENBQXBCO0FBQ0Esc0JBQWMsR0FBZCxDQUFrQixJQUFJLGFBQXRCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxZQUFJLGlCQUFpQixNQUFNLElBQU4sQ0FBVyxhQUFYLENBQXJCOztBQUVBO0FBQ0E7QUFDQSxhQUFLLElBQUksS0FBSSxlQUFlLE1BQTVCLEVBQW9DLEtBQUksQ0FBeEMsRUFBMkMsSUFBM0MsRUFBZ0Q7QUFDNUMsMkJBQWUsR0FBZjtBQUNIOztBQUVEO0FBQ0EsdUJBQWUsSUFBZixDQUFvQixVQUFVLENBQVYsRUFBYSxDQUFiLEVBQWdCO0FBQUUsbUJBQU8sTUFBTSxLQUFLLE1BQUwsRUFBYjtBQUE0QixTQUFsRTs7QUFFQTtBQTlDOEM7QUFBQTtBQUFBOztBQUFBO0FBK0M5QyxpQ0FBbUIsY0FBbkIsOEhBQW1DO0FBQUEsb0JBQTFCLE1BQTBCOztBQUMvQixrQkFBRSxJQUFJLFVBQU4sRUFBa0IsTUFBbEIsc0RBQXVFLE1BQXZFLGdCQUFzRixNQUF0RiwwQ0FBNkgsTUFBN0gsZ0NBQTJKLE1BQTNKO0FBQ0g7QUFDRDtBQWxEOEM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFtRDlDLFVBQUUsSUFBSSxVQUFOLEVBQWtCLE1BQWxCOztBQUVBO0FBQ0EsVUFBRSxVQUFGLEVBQWMsRUFBZCxDQUFpQixPQUFqQixFQUEwQixZQUFZO0FBQ2xDLGdCQUFJLGVBQUosR0FBc0IsRUFBRSxrQkFBRixFQUFzQixHQUF0QixFQUF0QjtBQUNILFNBRkQ7O0FBSUE7QUFDQSxVQUFFLGVBQUYsRUFBbUIsRUFBbkIsQ0FBc0IsT0FBdEIsRUFBK0IsVUFBVSxDQUFWLEVBQWE7QUFDeEMsY0FBRSxjQUFGO0FBQ0EsY0FBRSxJQUFJLGlCQUFOLEVBQXlCLFFBQXpCLENBQWtDLE1BQWxDLEVBQTBDLEtBQTFDO0FBQ0EsY0FBRSxJQUFJLFVBQU4sRUFBa0IsS0FBbEI7QUFDQSxjQUFFLElBQUksZUFBTixFQUF1QixRQUF2QixDQUFnQyxNQUFoQztBQUNBO0FBQ0E7QUFDQSxnQkFBSSxJQUFJLGVBQUosS0FBd0IsSUFBSSxhQUFoQyxFQUErQztBQUMzQyxvQkFBSSxLQUFKLEdBQVksSUFBSSxLQUFKLEdBQVksY0FBYyxTQUFkLEVBQXlCLEtBQWpEO0FBQ0Esa0JBQUUsSUFBSSxTQUFOLEVBQWlCLElBQWpCLGNBQWlDLElBQUksS0FBckM7QUFDQSxrQkFBRSxJQUFJLEtBQU4sRUFBYSxXQUFiLENBQXlCLE1BQXpCO0FBQ0gsYUFKRCxNQUlPO0FBQ0gsb0JBQUksS0FBSixHQUFZLElBQUksS0FBSixHQUFZLGNBQWMsU0FBZCxFQUF5QixLQUFqRDtBQUNBLGtCQUFFLElBQUksU0FBTixFQUFpQixJQUFqQixjQUFpQyxJQUFJLEtBQXJDO0FBQ0Esa0JBQUUsSUFBSSxLQUFOLEVBQWEsV0FBYixDQUF5QixNQUF6QjtBQUNBLGtCQUFFLElBQUksV0FBTixFQUFtQixJQUFuQiwyQkFBZ0QsSUFBSSxhQUFwRDtBQUNIO0FBQ0osU0FqQkQ7O0FBbUJBO0FBQ0EsVUFBRSxJQUFJLFlBQU4sRUFBb0IsRUFBcEIsQ0FBdUIsT0FBdkIsRUFBZ0MsVUFBUyxDQUFULEVBQVc7QUFDdkMsY0FBRSxjQUFGO0FBQ0EsY0FBRSxJQUFJLGlCQUFOLEVBQXlCLFdBQXpCLENBQXFDLE1BQXJDO0FBQ0EsY0FBRSxJQUFJLEtBQU4sRUFBYSxRQUFiLENBQXNCLE1BQXRCO0FBQ0EsY0FBRSxJQUFJLEtBQU4sRUFBYSxRQUFiLENBQXNCLE1BQXRCO0FBQ0gsU0FMRDtBQU9ILEtBdEZELENBdEJ1QyxDQTRHckM7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFJLGFBQUo7QUFDQSxRQUFNLGlCQUFpQixTQUFqQixjQUFpQixHQUFZO0FBQy9CO0FBQ0EsWUFBSSxhQUFKLEdBQW9CLGNBQWMsU0FBZCxFQUF5QixNQUE3Qzs7QUFFQTtBQUNBLGVBQU8sSUFBUCxDQUFZLElBQUksYUFBaEI7QUFDQTtBQUNBO0FBQ0EsWUFBSSxVQUFKLENBQWUsSUFBSSxrQkFBbkI7QUFFSCxLQVZEOztBQVlBO0FBQ0EsTUFBRSxJQUFJLGlCQUFOLEVBQXlCLE1BQXpCLENBQWdDLEtBQWhDLEVBQXVDLEtBQXZDLEVBQThDLFFBQTlDO0FBQ0E7QUFDSCxDQWxJRCxDLENBa0lFOztBQUVGO0FBQ0E7QUFDQTtBQUNBLElBQUksSUFBSixHQUFXLFlBQVk7QUFDbkIsUUFBSSxNQUFKO0FBQ0EsTUFBRSxJQUFJLFNBQU4sRUFBaUIsV0FBakIsQ0FBNkIsTUFBN0I7QUFDSCxDQUhEOztBQUtBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsWUFBWTtBQUNWLFFBQUksSUFBSjtBQUNILENBRkQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcclxuLy8gPT09PT09PT09PT09PT1cclxuLy8gQ0FUR0VPUlkgSURTXHJcbi8vID09PT09PT09PT09PT09XHJcbi8vIGZvb2RGYWN0cyA9IDgzMjtcclxuLy8gbW92aWVzPSAzMDk7XHJcbi8vIHBvcE11c2ljID0gNzcwO1xyXG4vLyBzdHVwaWRBbnN3ZXJzID0gMTM2O1xyXG4vLyBhbmltYWxzID0gMjE7XHJcbi8vIGNvdW50cmllc09mVGhlV29ybGQgPSAxMzYxO1xyXG4vLyBtdXNpY2FsSW5zdHJ1bWVudHMgPSAxODQ7XHJcbi8vIGZydWl0c0FuZFZlZ2V0YWJsZXMgPSA3Nzc7XHJcbi8vIGFjdHJlc3NlcyA9IDYxMjtcclxuLy8gdGhyZWVMZXR0ZXJXb3JkcyA9IDEwNTtcclxuLy8gd29ybGRDYXBpdGFscyA9IDc4O1xyXG4vLyBteXRob2xvZ3kgPSA2ODA7XHJcbi8vIGRvdWJsZVRhbGsgPSA4OTtcclxuLy8gcmh5bWVUaW1lID0gMjE1O1xyXG4vLyBudXJzZXJ5Umh5bWVzID0gMzc7IFxyXG4vLyBtdXNpYyA9IDcwO1xyXG5cclxuY29uc3QgYXBwID0ge307XHJcbmFwcC5zY29yZSA9IDA7XHJcblxyXG5hcHAuc3RhcnRCdXR0b24gPSAkKFwiLnN0YXJ0QnV0dG9uXCIpO1xyXG5hcHAudGltZXJTY29yZSA9ICQoXCIudGltZXJTY29yZVwiKTtcclxuYXBwLnRpbWVyVGV4dCA9ICQoXCIudGltZXJcIik7XHJcbmFwcC5zY29yZVRleHQgPSAkKFwiLnNjb3JlXCIpO1xyXG5cclxuXHJcbmFwcC5zdGFydEdhbWUgPSAkKFwiLnN0YXJ0R2FtZVwiKTtcclxuYXBwLmNhdGVnb3J5ID0gJChcIi5jYXRlZ29yeVwiKTtcclxuYXBwLnZhbHVlID0gJChcIi52YWx1ZVwiKTtcclxuXHJcblxyXG5hcHAuc3VibWl0Q2F0ZWdvcnkgPSAkKFwiLnN1Ym1pdENhdGVnb3J5XCIpO1xyXG5hcHAuc3VibWl0RGlmZmljdWx0eSA9ICQoXCIuc3VibWl0RGlmZmljdWx0eVwiKTtcclxuYXBwLm5leHRRdWVzdGlvbiA9ICQoXCIubmV4dFF1ZXN0aW9uXCIpO1xyXG5cclxuXHJcbmFwcC5hbnN3ZXJGb3JtID0gJChcIi5hbnN3ZXJGb3JtXCIpO1xyXG5hcHAucmlnaHQgPSAkKFwiLnJpZ2h0XCIpO1xyXG5hcHAud3JvbmcgPSAkKFwiLndyb25nXCIpO1xyXG5hcHAucmlnaHRBbnN3ZXIgPSAkKFwiLnJpZ2h0QW5zd2VyXCIpO1xyXG5hcHAuZ2FtZU92ZXIgPSAkKFwiLmdhbWVPdmVyXCIpO1xyXG5hcHAuZmluYWxTY29yZSA9ICQoXCIuZmluYWxTY29yZVwiKTtcclxuXHJcblxyXG5hcHAuY2F0ZWdvcnlDb250YWluZXIgPSAkKFwiLmNhdGVnb3J5Q29udGFpbmVyXCIpO1xyXG5hcHAudmFsdWVDb250YWluZXIgPSAkKFwiLnZhbHVlQ29udGFpbmVyXCIpO1xyXG5hcHAucXVlc3Rpb25Db250YWluZXIgPSAkKFwiLnF1ZXN0aW9uQ29udGFpbmVyXCIpO1xyXG5hcHAuYW5zd2VyQ29udGFpbmVyID0gJChcIi5hbnN3ZXJDb250YWluZXJcIik7XHJcblxyXG5cclxuLy8gPT09PT09PT09PT09PT1cclxuLy8gR0VUVElORyBJTkZPIEZST00gVEhFIEFQSVxyXG4vLyBGT1IgVEhFIFFVRVNUSU9OIFRIRSBVU1NFUiBQSUNTXHJcbi8vIEJBU0VEIE9OIENBVEVHT1JZIEFORCBWQUxVRVxyXG4vLyA9PT09PT09PT09PT09PVxyXG5cclxuYXBwLmdldENsdWVzID0gZnVuY3Rpb24gKGNhdGVnb3J5SUQsIHZhbHVlSUQpIHtcclxuICAgIGF4aW9zKHtcclxuICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICB1cmw6ICdodHRwczovL3Byb3h5LmhhY2tlcnlvdS5jb20nLFxyXG4gICAgLy9PUiB1cmw6ICdodHRwczovL3Byb3h5LmhhY2tlcnlvdS5jb20nLFxyXG4gICAgZGF0YVJlc3BvbnNlOiAnanNvbicsXHJcbiAgICBwYXJhbXNTZXJpYWxpemVyOiBmdW5jdGlvbiAocGFyYW1zKSB7XHJcbiAgICAgICAgcmV0dXJuIFFzLnN0cmluZ2lmeShwYXJhbXMsIHsgY291bnQ6IDEwMCwgdmFsdWU6IHZhbHVlSUQsIGNhdGVnb3J5OiBjYXRlZ29yeUlEfSwgKVxyXG4gICAgfSxcclxuICAgIHBhcmFtczoge1xyXG4gICAgICAgIHJlcVVybDogJ2h0dHA6Ly9hcGkuc2l0ZS5jb20vYXBpJyxcclxuICAgICAgICAvLyBwcm94eUhlYWRlcnM6IHtcclxuICAgICAgICAvLyAgICAgLy8gZGF0YToge1xyXG4gICAgICAgIC8vICAgICAvLyAgICAgY291bnQ6IDEwMCxcclxuICAgICAgICAvLyAgICAgLy8gICAgIHZhbHVlOiB2YWx1ZUlELFxyXG4gICAgICAgIC8vICAgICAvLyAgICAgY2F0ZWdvcnk6IGNhdGVnb3J5SUQsXHJcbiAgICAgICAgLy8gICAgIC8vIH1cclxuICAgICAgICAvLyB9LFxyXG4gICAgICAgIHhtbFRvSlNPTjogdHJ1ZVxyXG4gICAgfVxyXG4gICAgfSlcclxufS50aGVuKChyZXMpID0+IHtcclxuICAgICAgICBhcHAuZGlzcGxheVF1ZXN0aW9uKHJlcyk7XHJcbiAgICB9KTtcclxuLy8gYXBwLmdldENsdWVzID0gZnVuY3Rpb24gKGNhdGVnb3J5SUQsIHZhbHVlSUQpIHtcclxuLy8gICAgICQuYWpheCh7XHJcbi8vICAgICAgICAgdXJsOiBcImh0dHA6Ly9qc2VydmljZS5pby9hcGkvY2x1ZXNcIixcclxuLy8gICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbi8vICAgICAgICAgZGF0YToge1xyXG4vLyAgICAgICAgICAgICBjb3VudDogMTAwLFxyXG4vLyAgICAgICAgICAgICB2YWx1ZTogdmFsdWVJRCxcclxuLy8gICAgICAgICAgICAgY2F0ZWdvcnk6IGNhdGVnb3J5SUQsXHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgfSlcclxuLy8gICAgICAgICAudGhlbigocmVzKSA9PiB7XHJcbi8vICAgICAgICAgICAgIGFwcC5kaXNwbGF5UXVlc3Rpb24ocmVzKTtcclxuLy8gICAgICAgICB9KTtcclxuLy8gfVxyXG5cclxuLy8gPT09PT09PT09PT09PT1cclxuLy8gR0VUVElORyBJTkZPIEZST00gVEhFIEFQSVxyXG4vLyBGT1IgVEhFIFJBTkRPTSBBTlNXRVJTIFxyXG4vLyBUSEFUIE1BVENIIFRIRSBDQVRFR09SWVxyXG4vLyA9PT09PT09PT09PT09PVxyXG5cclxuYXBwLmdldEFuc3dlcnMgPSBmdW5jdGlvbihjYXRlZ29yeUlEKSB7XHJcbiAgICBheGlvcyh7XHJcbiAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgdXJsOiAnaHR0cHM6Ly9wcm94eS5oYWNrZXJ5b3UuY29tJyxcclxuICAgIGRhdGFSZXNwb25zZTogJ2pzb24nLFxyXG4gICAgcGFyYW1zU2VyaWFsaXplcjogZnVuY3Rpb24gKHBhcmFtcykge1xyXG4gICAgICAgIHJldHVybiBRcy5zdHJpbmdpZnkocGFyYW1zLCB7IGNvdW50OiAxMDAsIGNhdGVnb3J5OiBjYXRlZ29yeUlEIH0sIClcclxuICAgIH0sXHJcbiAgICBwYXJhbXM6IHtcclxuICAgICAgICByZXFVcmw6ICdodHRwOi8vanNlcnZpY2UuaW8vYXBpL2NsdWVzJyxcclxuICAgICAgICAvLyBwcm94eUhlYWRlcnM6IHtcclxuICAgICAgICAvLyAgICAgZGF0YToge1xyXG4gICAgICAgIC8vICAgICBjb3VudDogMTAwLFxyXG4gICAgICAgIC8vICAgICBjYXRlZ29yeTogY2F0ZWdvcnlJRFxyXG4gICAgICAgIC8vIH1cclxuICAgICAgICAvLyB9LFxyXG4gICAgICAgIHhtbFRvSlNPTjogdHJ1ZVxyXG4gICAgfVxyXG4gICAgfSlcclxuICAgIH0udGhlbigocmVzKSA9PiB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2cocmVzKTtcclxuICAgICAgICBhcHAud3JvbmdBbnN3ZXJzKHJlcywgNilcclxuICAgIH0pO1xyXG5cclxuLy8gYXBwLmdldEFuc3dlcnMgPSBmdW5jdGlvbiAoY2F0ZWdvcnlJRCkge1xyXG4vLyAgICAgJC5hamF4KHtcclxuLy8gICAgICAgICB1cmw6IFwiaHR0cDovL2pzZXJ2aWNlLmlvL2FwaS9jbHVlc1wiLFxyXG4vLyAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuLy8gICAgICAgICBkYXRhOiB7XHJcbi8vICAgICAgICAgICAgIGNvdW50OiAxMDAsXHJcbi8vICAgICAgICAgICAgIGNhdGVnb3J5OiBjYXRlZ29yeUlEXHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgfSlcclxuLy8gICAgICAgICAudGhlbigocmVzKSA9PiB7XHJcbi8vICAgICAgICAgICAgIGFwcC53cm9uZ0Fuc3dlcnMocmVzLCA2KTtcclxuLy8gICAgICAgICB9KTtcclxuLy8gfVxyXG5cclxuLy8gPT09PT09PT09PT09PT09XHJcbi8vIFVTRVIgQ0hPT1NFUyBDQVRFR09SWSBBTkQgVkFMVUVcclxuLy8gPT09PT09PT09PT09PT09XHJcbmFwcC5ldmVudHMgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgLy8gc3RhcnRzIHRoZSBnbWFlXHJcbiAgICAkKGFwcC5zdGFydEJ1dHRvbikub24oXCJjbGlja1wiLCBmdW5jdGlvbihlKXtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgJChhcHAudGltZXJTY29yZSkucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpLmFkZENsYXNzKFwiZmxleFwiKTtcclxuICAgICAgICAkKGFwcC5jYXRlZ29yeUNvbnRhaW5lcikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG4gICAgICAgICQoYXBwLnN0YXJ0R2FtZSkuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG4gICAgICAgIGFwcC50aW1lcigyKTtcclxuICAgIH0pXHJcblxyXG4gICAgLy8gc3RvcmluZyB0aGUgY2F0ZWdvcnkgdmFsdWVcclxuICAgICQoYXBwLmNhdGVnb3J5KS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBhcHAudXNlckNhdGVnb3J5Q2hvaWNlID0gJChcIi5jYXRlZ29yeTpjaGVja2VkXCIpLnZhbCgpO1xyXG4gICAgfSlcclxuXHJcbiAgICAvLyBXaGVuIHVzZXIgc3VibWl0cywgaGlkZSBDYXRlZ29yaWVzIGFuZCBzaG93IHZhbHVlIGNob2ljZXMgXHJcbiAgICAkKGFwcC5zdWJtaXRDYXRlZ29yeSkub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAkKGFwcC5jYXRlZ29yeUNvbnRhaW5lcikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG4gICAgICAgICQoYXBwLnZhbHVlQ29udGFpbmVyKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcbiAgICB9KVxyXG5cclxuICAgIC8vIFdoZW4gdXNlciBzdWJtaXRzLCBzdG9yZSB2YWx1ZSBcclxuICAgICQoYXBwLnZhbHVlKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBhcHAudXNlclZhbHVlQ2hvaWNlID0gJChcIi52YWx1ZTpjaGVja2VkXCIpLnZhbCgpO1xyXG4gICAgfSlcclxuXHJcbiAgICAvLyBXaGVuIHVzZXIgc3VibWl0cyB2YWx1ZSBoaWRlIHRoZSB2YWx1ZSBhbmQgc2hvdyB0aGUgcmFuZG9tIHF1ZXN0aW9uXHJcbiAgICAkKGFwcC5zdWJtaXREaWZmaWN1bHR5KS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICQoYXBwLnZhbHVlQ29udGFpbmVyKS5hZGRDbGFzcyhcImhpZGVcIik7XHJcbiAgICAgICAgJChhcHAucXVlc3Rpb25Db250YWluZXIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuICAgICAgICAkKGFwcC5hbnN3ZXJDb250YWluZXIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuICAgICAgICBhcHAuZ2V0Q2x1ZXMoYXBwLnVzZXJDYXRlZ29yeUNob2ljZSwgYXBwLnVzZXJWYWx1ZUNob2ljZSk7XHJcbiAgICB9KVxyXG59IC8vIGVuZCBvZiBldmVudCBmdW5jdGlvblxyXG5cclxuXHJcbi8vID09PT09PT09PT09PT09PVxyXG4vLyBUSU1FUiBGVU5DVElPTlxyXG4vLyA9PT09PT09PT09PT09PT1cclxuYXBwLnRpbWVyID0gZnVuY3Rpb24oc2Vjb25kcykge1xyXG4gICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcclxuICAgIGNvbnN0IHRoZW4gPSBub3cgKyBzZWNvbmRzICogMTAwMDtcclxuICAgIGRpc3BsYXlUaW1lTGVmdChzZWNvbmRzKTtcclxuICAgIGxldCBjb3VudGRvd24gPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY29uc3Qgc2Vjb25kc0xlZnQgPSBNYXRoLnJvdW5kKCh0aGVuIC0gRGF0ZS5ub3coKSkgLyAxMDAwKTtcclxuICAgICAgICAvLyBpZiB0aGUgdGltZXIgcnVucyBvdXQsIGNsZWFyIHRoZSB0aW1lclxyXG4gICAgICAgIC8vIGRpc3BsYXkgc2NvcmUgXHJcbiAgICAgICAgaWYgKHNlY29uZHNMZWZ0IDwgMCkge1xyXG4gICAgICAgICAgICBjbGVhckludGVydmFsKGNvdW50ZG93bik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZGlzcGxheVRpbWVMZWZ0KHNlY29uZHNMZWZ0KTtcclxuICAgICAgICBpZiAoc2Vjb25kc0xlZnQgPT09IDApe1xyXG4gICAgICAgICAgICBjbGVhckludGVydmFsKGNvdW50ZG93bik7XHJcbiAgICAgICAgICAgICQoYXBwLnRpbWVyU2NvcmUpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuICAgICAgICAgICAgJChhcHAuY2F0ZWdvcnlDb250YWluZXIpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuICAgICAgICAgICAgJChhcHAucXVlc3Rpb25Db250YWluZXIpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuICAgICAgICAgICAgJChhcHAudmFsdWVDb250YWluZXIpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuICAgICAgICAgICAgJChhcHAuYW5zd2VyQ29udGFpbmVyKS5hZGRDbGFzcyhcImhpZGVcIik7XHJcbiAgICAgICAgICAgICQoYXBwLnJpZ2h0KS5hZGRDbGFzcyhcImhpZGVcIik7XHJcbiAgICAgICAgICAgICQoYXBwLndyb25nKS5hZGRDbGFzcyhcImhpZGVcIik7XHJcbiAgICAgICAgICAgICQoYXBwLmdhbWVPdmVyKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcbiAgICAgICAgICAgICQoYXBwLmZpbmFsU2NvcmUpLmFwcGVuZChgWW91ciBzY29yZSB3YXMgPHNwYW4+JCR7YXBwLnNjb3JlfTwvc3Bhbj5gKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LCAxMDAwKTtcclxufVxyXG4gICAgLy8gY2hhbmdpbmcgdGltZXIgc28gaXQncyBjb21wYXRpYmxlIHdpdGggbWludXRlc1xyXG4gICAgZnVuY3Rpb24gZGlzcGxheVRpbWVMZWZ0KHNlY29uZHMpIHtcclxuICAgICAgICBjb25zdCBtaW51dGVzID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gNjApO1xyXG4gICAgICAgIGNvbnN0IHJlbWFpbmRlclNlY29uZHMgPSBzZWNvbmRzICUgNjA7XHJcbiAgICAgICAgY29uc3QgZGlzcGxheSA9IGAke21pbnV0ZXN9OiR7cmVtYWluZGVyU2Vjb25kcyA8IDEwID8gXCIwXCIgOiBcIlwifSR7cmVtYWluZGVyU2Vjb25kc31gO1xyXG4gICAgICAgICQoYXBwLnRpbWVyVGV4dCkudGV4dChkaXNwbGF5KTtcclxuICAgIH1cclxuXHJcblxyXG4vLyA9PT09PT09PT09PT09PT1cclxuLy8gRElTUExBWSBSQU5ET00gUVVFU1RJT04gQkFTRUQgT04gVVNFUiBJTlBVVCBcclxuLy8gQU5EIFJBTkRPTSBBTlNXRVJTIEJBU0VEIE9OIFRIRSBDQVRSR09SWVxyXG4vLyBVU0VSIFBVVCBJTiAgXHJcbi8vID09PT09PT09PT09PT09PVxyXG5hcHAuZGlzcGxheVF1ZXN0aW9uID0gZnVuY3Rpb24gKHF1ZXN0aW9ucykge1xyXG5cclxuICAgIC8vIGZpbHRlcmluZyBmb3IgZ29vZCBxdWVzdGlvbnNcclxuICAgIGNvbnN0IGdvb2RRdWVzdGlvbnMgPSBxdWVzdGlvbnMuZmlsdGVyKChxdWVzdGlvbikgPT4ge1xyXG4gICAgICAgIHJldHVybiBxdWVzdGlvbi5pbnZhbGlkX2NvdW50ID09PSBudWxsO1xyXG4gICAgfSlcclxuXHJcbiAgICAvLyBnZXQgYSByYW5kb20gbnVtYmVyIGFuZCBkaXNwbGF5IGEgcmFuZG9tIHF1ZXN0aW9uXHJcbiAgICAvLyBiYXNlZCBvbiB0aGF0IHJhbmRvbSBudW1iZXIgXHJcbiAgICBsZXQgcmFuZG9tTnVtID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogZ29vZFF1ZXN0aW9ucy5sZW5ndGgpO1xyXG4gICAgLy8gYXBwZW5kIHRoZSByYW5kb20gcXVlc3Rpb24gaW4gb3VyIGluZGV4IHBhZ2UgXHJcbiAgICBjb25zdCB0aXRsZSA9ICQoYDxoNCBjbGFzcz1cImNhcGl0YWxpemVcIj5gKS50ZXh0KGBDYXRlZ29yeTogJHtnb29kUXVlc3Rpb25zW3JhbmRvbU51bV0uY2F0ZWdvcnkudGl0bGV9YCk7XHJcbiAgICBjb25zdCB2YWx1ZSA9ICQoXCI8aDQ+XCIpLnRleHQoYFdhZ2VyOiAkJHthcHAudXNlclZhbHVlQ2hvaWNlfWApO1xyXG4gICAgY29uc3QgcXVlc3Rpb24gPSAkKGA8aDMgY2xhc3M9XCJxdWVzdGlvblRleHRcIj5gKS50ZXh0KGdvb2RRdWVzdGlvbnNbcmFuZG9tTnVtXS5xdWVzdGlvbik7XHJcblxyXG4gICAgLy8gYW4gYXJyYXkgd2l0aCB0aGUgcmVzdWx0cyB0byBoZWxwIGdldCByYW5kb20gYW5zd2Vyc1xyXG4gICAgbGV0IHJlc3VsdCA9IFtdO1xyXG5cclxuICAgIC8vID09PT09PT09PT09PT09PVxyXG4gICAgLy8gR0VUVElORyBSQU5ET00gQU5TV0VSUyBcclxuICAgIC8vIEZST00gQ0FURUdPUlkgVEhFIFVTRVIgQ0hPU0UgXHJcbiAgICAvLyA9PT09PT09PT09PT09PT1cclxuICAgIGFwcC53cm9uZ0Fuc3dlcnMgPSBmdW5jdGlvbiAocmVzLCBuZWVkZWRFbGVtZW50cykge1xyXG4gICAgICAgIC8vIGZpbHRlcmluZyB0aHJvdWdoIHRoZSByZXN1bHRzIG9mIFxyXG4gICAgICAgIC8vdGhlIHNlY29uZCBhamF4IGNhbGwgZm9yIGFuc3dlcnNcclxuICAgICAgICBjb25zdCBmaWx0ZXJlZEFuc3dlcnMgPSByZXMubWFwKChhbnN3ZXIpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGFuc3dlci5hbnN3ZXI7XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgLy8gZ2V0dGluZyBhIHJhbmRvbSAxMCBhbnNzd2VycyBmcm9tIHNlY29uZCBhamF4IHJlcXVlc3QgXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuZWVkZWRFbGVtZW50czsgaSsrKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKGZpbHRlcmVkQW5zd2Vyc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiByZXMubGVuZ3RoKV0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gdXNpbmcgcmVnZXggaGVyZVxyXG4gICAgICAgIGxldCBuZXdBbnN3ZXJzV2l0aG91dFJhbmRvbUNoYXJhY3RlcnM7XHJcbiAgICAgICAgbGV0IGVtcHR5QXJyYXkgPSBbXTtcclxuICAgICAgICBsZXQgcmUgPSAvPFxcLz9bXFx3XFxzPVwiLy4nOjsjLVxcL1xcP10rPnxbXFwvXFxcXDorPVwiI10rL2dpXHJcbiAgICAgICAgbGV0IGFuc3dlcnNXaXRob3V0UmFuZG9tQ2hhcmFjdGVycyA9IHJlc3VsdC5mb3JFYWNoKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgIG5ld0Fuc3dlcnNXaXRob3V0UmFuZG9tQ2hhcmFjdGVycyA9IGl0ZW0ucmVwbGFjZShyZSwgJycpO1xyXG4gICAgICAgICAgICBlbXB0eUFycmF5LnB1c2gobmV3QW5zd2Vyc1dpdGhvdXRSYW5kb21DaGFyYWN0ZXJzKVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGFwcC5jb3JyZWN0QW5zd2VyID0gYXBwLmNvcnJlY3RBbnN3ZXIucmVwbGFjZShyZSwgXCJcIilcclxuXHJcbiAgICAgICAgLy8gZmlsdGVyIHRocm91Z2ggYW5zd2VycyB0byBtYWtlIHN1cmUgdGhleSdyZSB1bmlxdWUgXHJcbiAgICAgICAgLy8gYW5kIGR1cGxpY2F0ZXMgZG9uJ3Qgc2hvdyB1cCBcclxuICAgICAgICBsZXQgdW5pcXVlQW5zd2VycyA9IG5ldyBTZXQoZW1wdHlBcnJheSk7XHJcbiAgICAgICAgdW5pcXVlQW5zd2Vycy5hZGQoYXBwLmNvcnJlY3RBbnN3ZXIpO1xyXG5cclxuICAgICAgICAvLyBsb29wIHRocm91Z2ggbmV3IGFycmF5IG9mIHVuaXF1ZSBhbnN3ZXJzIFxyXG4gICAgICAgIC8vIGFuZCBhcHBlbmQgdGhlIGFuc3dlcnMgaW4gdGhlIGFycmF5XHJcbiAgICAgICAgLy8gZm9yIChsZXQgYW5zd2VyIG9mIHVuaXF1ZUFuc3dlcnMudmFsdWVzKCkpIHtcclxuICAgICAgICAvLyAgICAgLy8gJChcIi5hbnN3ZXJDb250YWluZXJcIikuYXBwZW5kKGA8aW5wdXQgdHlwZSA9XCJyYWRpb1wiIG5hbWU9XCJhbnN3ZXJzXCIgdmFsdWU9XCIke2Fuc3dlcn1cIiBpZD1cIiR7YW5zd2VyfVwiIGNsYXNzPVwiYW5zd2Vyc1wiPjxsYWJlbCBmb3I9XCIke2Fuc3dlcn1cIj4ke2Fuc3dlcn08L2xhYmVsPmApXHJcbiAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICAvLyB0aGlzIHRha2VzIHRoZSBuZXcgU2V0IGFuZCBtYWtlcyBpdCBpbnRvIGFuIGFycmF5XHJcbiAgICAgICAgbGV0IGJhY2tUb1JlZ0FycmF5ID0gQXJyYXkuZnJvbSh1bmlxdWVBbnN3ZXJzKTtcclxuXHJcbiAgICAgICAgLy8gbG9vcGluZyBvdmVyIHJlZ3VsYXIgYXJyYXkgXHJcbiAgICAgICAgLy8gdG8gbWFrZSBzdXJlIHdlIG9ubHkgaGF2ZSA1IGFuc3dlcnMgXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IGJhY2tUb1JlZ0FycmF5Lmxlbmd0aDsgaSA+IDU7IGktLSkge1xyXG4gICAgICAgICAgICBiYWNrVG9SZWdBcnJheS5wb3AoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHRoaXMgcmFuZG9taXplcyB0aGUgb3JkZXIgb2YgdGhlIGFycmF5LiBcclxuICAgICAgICBiYWNrVG9SZWdBcnJheS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7IHJldHVybiAwLjUgLSBNYXRoLnJhbmRvbSgpIH0pO1xyXG5cclxuICAgICAgICAvLyBmb3IgZXZlcnkgYW5zd2VyIGFwcGVuZCBpdCB0byB0aGUgcGFnZSBcclxuICAgICAgICBmb3IgKGxldCBhbnN3ZXIgb2YgYmFja1RvUmVnQXJyYXkpIHtcclxuICAgICAgICAgICAgJChhcHAuYW5zd2VyRm9ybSkuYXBwZW5kKGA8aW5wdXQgdHlwZSA9XCJyYWRpb1wiIG5hbWU9XCJhbnN3ZXJzXCIgdmFsdWU9XCIke2Fuc3dlcn1cIiBpZD1cIiR7YW5zd2VyfVwiIGNsYXNzPVwiYW5zd2Vyc1wiPjxsYWJlbCBmb3I9XCIke2Fuc3dlcn1cIiBjbGFzcz1cImNhcGl0YWxpemVcIj4ke2Fuc3dlcn08L2xhYmVsPmApO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBhcHBlbmRpbmcgdGhlIHN1Ym1pdCBidXR0b24gXHJcbiAgICAgICAgJChhcHAuYW5zd2VyRm9ybSkuYXBwZW5kKGA8aW5wdXQgdHlwZT1cInN1Ym1pdFwiIHZhbHVlPVwiU3VibWl0IEFuc3dlclwiIGNsYXNzPVwic3VibWl0QW5zd2VyIGJ1dHRvblwiPmApO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIHN0b3JpbmcgdXNlcidzIGFuc3dlciBjaG9pY2VcclxuICAgICAgICAkKFwiLmFuc3dlcnNcIikub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGFwcC51c2VyVmFsdWVDaG9pY2UgPSAkKFwiLmFuc3dlcnM6Y2hlY2tlZFwiKS52YWwoKTtcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICAvLyBzdWJtaXR0aW5nIHRoZSBhbnN3ZXIgYW5kIGNvbXBhcmluZyB0aGUgdXNlciBjaG9pY2UgdG8gY29ycmVjdCBhbnN3ZXIgXHJcbiAgICAgICAgJChcIi5zdWJtaXRBbnN3ZXJcIikub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICQoYXBwLnF1ZXN0aW9uQ29udGFpbmVyKS5hZGRDbGFzcyhcImhpZGVcIikuZW1wdHkoKTtcclxuICAgICAgICAgICAgJChhcHAuYW5zd2VyRm9ybSkuZW1wdHkoKTtcclxuICAgICAgICAgICAgJChhcHAuYW5zd2VyQ29udGFpbmVyKS5hZGRDbGFzcyhcImhpZGVcIilcclxuICAgICAgICAgICAgLy8gaWYgdXNlciBjaG9pY2UgaXMgY29ycmVjdCBzaG93IHJpZ2h0IHBhZ2VcclxuICAgICAgICAgICAgLy8gaWYgbm90IHNob3cgdGhlIHdyb25nIHBhZ2VcclxuICAgICAgICAgICAgaWYgKGFwcC51c2VyVmFsdWVDaG9pY2UgPT09IGFwcC5jb3JyZWN0QW5zd2VyKSB7XHJcbiAgICAgICAgICAgICAgICBhcHAuc2NvcmUgPSBhcHAuc2NvcmUgKyBnb29kUXVlc3Rpb25zW3JhbmRvbU51bV0udmFsdWU7XHJcbiAgICAgICAgICAgICAgICAkKGFwcC5zY29yZVRleHQpLnRleHQoYFNjb3JlOiAkJHthcHAuc2NvcmV9YClcclxuICAgICAgICAgICAgICAgICQoYXBwLnJpZ2h0KS5yZW1vdmVDbGFzcyhcImhpZGVcIilcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGFwcC5zY29yZSA9IGFwcC5zY29yZSAtIGdvb2RRdWVzdGlvbnNbcmFuZG9tTnVtXS52YWx1ZTtcclxuICAgICAgICAgICAgICAgICQoYXBwLnNjb3JlVGV4dCkudGV4dChgU2NvcmU6ICQke2FwcC5zY29yZX1gKVxyXG4gICAgICAgICAgICAgICAgJChhcHAud3JvbmcpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKVxyXG4gICAgICAgICAgICAgICAgJChhcHAucmlnaHRBbnN3ZXIpLnRleHQoYFRoZSByaWdodCBhbnN3ZXIgd2FzICR7YXBwLmNvcnJlY3RBbnN3ZXJ9YClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIC8vIGdvIHRvIHRoZSBuZXh0IHF1ZXN0aW9uXHJcbiAgICAgICAgJChhcHAubmV4dFF1ZXN0aW9uKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICQoYXBwLmNhdGVnb3J5Q29udGFpbmVyKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcbiAgICAgICAgICAgICQoYXBwLndyb25nKS5hZGRDbGFzcyhcImhpZGVcIik7XHJcbiAgICAgICAgICAgICQoYXBwLnJpZ2h0KS5hZGRDbGFzcyhcImhpZGVcIik7XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICB9IC8vIGVuZCBvZiB3cm9uZyBhbnN3ZXJzIGZ1bmN0aW9uIFxyXG5cclxuICAgIC8vID09PT09PT09PT09PT09PVxyXG4gICAgLy8gRElTUExBWSBDT1JSRUNUIEFOU1dFUlMgXHJcbiAgICAvLyBGUk9NIENBVEVHT1JZIFRIRSBVU0VSIENIT1NFXHJcbiAgICAvLyA9PT09PT09PT09PT09PT1cclxuICAgIGFwcC5jb3JyZWN0QW5zd2VyO1xyXG4gICAgY29uc3QgZGlzcGxheUFuc3dlcnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgLy8gdGhpcyBpcyB0aGUgY29ycmVjdCBhbnN3ZXIgXHJcbiAgICAgICAgYXBwLmNvcnJlY3RBbnN3ZXIgPSBnb29kUXVlc3Rpb25zW3JhbmRvbU51bV0uYW5zd2VyO1xyXG5cclxuICAgICAgICAvLyBwdXNoaW5nIHRoZSBjb3JyZWN0IGFuc3dlciBpbnRvIHJlc3VsdCBcclxuICAgICAgICByZXN1bHQucHVzaChhcHAuY29ycmVjdEFuc3dlcik7XHJcbiAgICAgICAgLy8gY2FsbGluZyBhcHAuZ2V0QW5zd2VycyBcclxuICAgICAgICAvLyBzbyB3ZSBoYXZlIHRoZSBpbmZvIGZyb20gdGhlIEFQSSBcclxuICAgICAgICBhcHAuZ2V0QW5zd2VycyhhcHAudXNlckNhdGVnb3J5Q2hvaWNlKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLy8gZGlzcGxheWluZyBpbmZvIGZvciByYW5kb20gcXVlc3Rpb25cclxuICAgICQoYXBwLnF1ZXN0aW9uQ29udGFpbmVyKS5hcHBlbmQodGl0bGUsIHZhbHVlLCBxdWVzdGlvbik7XHJcbiAgICBkaXNwbGF5QW5zd2VycygpO1xyXG59IC8vIGVuZCBvZiBkaXNwbGF5UXVlc3Rpb25zIGZ1bmN0aW9uXHJcblxyXG4vLyA9PT09PT09PT09PT09PT1cclxuLy8gSU5JVElBTElaRSBUSEUgQVBQXHJcbi8vID09PT09PT09PT09PT09PVxyXG5hcHAuaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGFwcC5ldmVudHMoKTtcclxuICAgICQoYXBwLnN0YXJ0R2FtZSkucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG59XHJcblxyXG4vLyA9PT09PT09PT09PT09PT1cclxuLy8gRE9DIFJFQURZXHJcbi8vID09PT09PT09PT09PT09PVxyXG4kKGZ1bmN0aW9uICgpIHtcclxuICAgIGFwcC5pbml0KCk7XHJcbn0pOyJdfQ==
