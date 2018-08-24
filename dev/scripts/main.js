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
// make the random multiple choice choices and the correct answer into a button on the page 


// maybe choose the answers from multiple choice with Math.random just get 5 random answers in the category doesnt have to be specific to value but could be from the larger array of 100 objects 
// if user chooses the the right answer then add value to score 
// link the value on click or submit 
// make a timer 
// add score 
// next question empty everything and display everything 
//timer will run out 
// display Times Up and final score 
// play again button 

// stretch goal 
// remove possible elements that are around answers 



const app = {};

// app.filteredQ = [];
 

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
            category: categoryID,
        }
    })
    .then((res) => {
        //console.log(res);
        
        // app.goodQuestions = res.filter((question) => {
        //     return question.invalid_count !== null;
        // })
        
        // console.log("good questions");
        // console.log(app.goodQuestions);
        
        app.displayQuestion(res);     
    });
}

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
            // console.log(res[1], res[5].answer);
            app.wrongAnswers(res, 100);
            
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
    // console.log(app.getClues(app.userCategoryChoice());
    
})

$(".submitDifficulty").on("click", function (e) {
    e.preventDefault();
    $(".valueContainer").addClass("hide");
    $(".questionContainer").removeClass("hide");
    app.getClues(app.userCategoryChoice, app.userValueChoice);
    })
} // END OF EVENT FUNCTION

// DISPLAYING A RANDOM QUESTION BASED ON INPUT


app.displayQuestion = function (questions) {

    //  let filteredQ = questions.filter((question) => {
    //     return question.invalid_count === null
    //     }
    // )
    console.log("All filtered questions");
    console.log(questions);
    
    const goodQuestions = questions.filter((question) => {
        return question.invalid_count === null;
    })

    console.log("good questions");
    console.log(goodQuestions);
    

    
    let randomNum = Math.floor(Math.random() * questions.length);
    // console.log(questions[randomNum]);
    
    // console.log(questions[randomNum]);
    
    const title = $("<h3>").text(questions[randomNum].category.title);
    const value = $("<h4>").text(app.userValueChoice);
    const question = $("<h2>").text(questions[randomNum].question);


    let result=[];

    app.wrongAnswers = function (res, neededElements) {
        // let result = [];
        const filteredAnswers = res.map((answer)=> {
            return answer.answer;
        })

        
        for (let i = 0; i < neededElements; i++) {
            result.push(filteredAnswers[Math.floor(Math.random() * res.length)]);
        }
        
        
        console.log(result);
        // console.log(questions);
        
        result.forEach((answer) => {
            $(".answerContainer").append(`<input type = "radio" name= "wrongAnswer" value=${answer} id="${answer} class="answers"><label for=${answer}>${answer}</label>`)
            // console.log(answer.answer);
        })
        // return result;
    }


    
    const displayAnswers = function() {
        // DISPLAY CORRECT ANSWER 
        //create an object with a key of answer and value of key shuold be app.correctanswer. 
        app.correctAnswer = questions[randomNum].answer;
        // const answer = $("<h2>").text(questions[randomNum].answer);    
        // $(".answerContainer").append(`<input type = "radio" name= "correctAnswer" value=${app.correctAnswer} id="${app.correctAnswer} class="answers"><label for=${app.correctAnswer}>${app.correctAnswer}</label>`)
        result.push(app.correctAnswer);
        console.log(app.correctAnswer);
        // GET RANDOM ANSWERS FROM SECOND AJAX CALL 
        app.getAnswers(app.userCategoryChoice);
    }
    

    $(".questionContainer").append(title, value, question);
    displayAnswers();
} // end of displayQuestions function

app.init = function(){
    app.events();
    $(".categoryContainer").removeClass("hide");
}


$(function(){
    app.init();
});
