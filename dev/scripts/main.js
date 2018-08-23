// get certain categories. look for the ids of the catorgories we want out of 100 questions 


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
// ***can we filter through the inputs so we only get valid questions?***
    // can do this in the array we're given back 
    // filter through the array? 
// display answer and the choices users can pick from for multiple choice 
    // maybe choose the answers from multiple choice with Math.random just get 5 randome answers in the category doesnt have to be specific to value but could be from the larger array of 100 objects 
// make the random multiple choice choises and the correct answer into a button on the page 
// if user chooses the the right answer then add value to score 

// stretch goal 
// remove possible elements that are around answers 

const app = {};


app.foodFacts = 832;
app.movies= 309;
app.popMusic = 770;
app.stupidAnswers = 136;
app.animals = 21;
app.countriesOfTheWorld = 1361;
app.musicalInstruments = 184;
app.fruitsAndVegetables = 777;
app.actresses = 612;
app.threeLetterWords = 105;
app.worldCapitals = 78;
app.mythology = 680;
app.doubleTalk = 89;
app.rhymeTime = 215;
app.nurseryRhymes = 37; 
app.music = 70;

// 100, 200, 300 = easy 
// 400, 500, 600 = medium 
// 800, 1000 = hard 

app.value100 = 100;
app.value200 = 200;
app.value300 = 300;
app.value400 = 400;
app.value500 = 500;
app.value800 = 800;
app.value1000 = 1000;

// ==============
// GETTING STUFF FROM THE API
// ==============

app.getClues = function (categoryID, valueID){
    $.ajax({
        url: "http://jservice.io/api/clues",
        method: "GET",
        data: {
            count: 100,
            value: valueID,
            category: categoryID
        }
    })
    .then((res) => {
        app.displayQuestion(res);        
        });
}



// ===============
// USER CHOOSES CATEGORY AND VALUE
// ===============
app.events = function(){

    $(".category").on("click", function(){
        app.userCategoryChoice = $(".category:checked").val();
        console.log(app.userCategoryChoice);
    })    

    // When user submits, clear html and display value choices 
    $(".submitCategory").on("click", function(e){
        e.preventDefault();
        $(".categoryContainer").addClass("hide");
        $(".valueContainer").removeClass("hide");
    })

    $(".value").on("click", function(){
        app.userValueChoice = $(".value:checked").val();
        console.log(app.userValueChoice);
    // USING THE VALUE FROM INPUT TO REPLACE THE VALUES IN AJAX
        app.getClues(app.userCategoryChoice, app.userValueChoice);
        // console.log(app.getClues(app.userCategoryChoice());
        
    })

    $(".submitDifficulty").on("click", function (e) {
        e.preventDefault();
        $(".valueContainer").addClass("hide");
        $(".questionContainer").removeClass("hide");
    })
} // END OF EVENT FUNCTION

// DISPLAYING A RANDOM QUESTION BASED ON INPUT


app.displayQuestion = function (questions) {
    let randomNum = Math.floor(Math.random() * questions.length);

    const title = $("<h3>").text(questions[randomNum].category.title);
    const value = $("<h4>").text(app.userValueChoice);
    const question = $("<h2>").text(questions[randomNum].question);
    //this might need to be put into a button
    const displayAnswers = function() {
        app.correctAnswer = questions[randomNum].answer;
            // const answer = $("<h2>").text(questions[randomNum].answer);    

                $(".answerContainer").append(`<input type = "radio" name= "correctAnswer" value=${app.correctAnswer} id="${app.correctAnswer} class="answers"><label for=${app.correctAnswer}>${app.correctAnswer}</label>`)

        }
    

    $(".questionContainer").append(title, value, question);
    displayAnswers();
}

app.init = function(){
    app.events();
    $(".categoryContainer").removeClass("hide");
}


$(function(){
    app.init();
});
