// get certain categories. look for the ids of the catorgories we want out of 100 questions 

    // 3-letter words = 105
    // pop music =
    // world capitals = 78
    // mythology =  680
    // double talk = 89
    // nursery rhymes = 37
    // fruits & vegetables = 777
    // music = 70 
    // rhyme time = 215
    // musical instruments = 184
    // countries of the world = 1361
    // animals = 21
    // stupid answers = 136
    // food facts = 832
    // the movies = 309

// 
    
// filter the values of them so the user can choose value 
// make sure the value we want is there so the user has choices 
    // 100, 200, 300 = easy 
    // 400, 500, 600 = medium 
    // 800, 1000 = hard 
//


const app = {};

// app.userCategoryChoice = "hello";

// app.questionList = [];

// app.allCategories = [
//     {popMusic: 770}
// ]

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

app.getClues = function(categoryID){
    $.ajax({
        url: "http://jservice.io/api/clues",
        method: "GET",
        data: {
            count: 100,
            // value: 100,
            category: categoryID
        }
    })
    .then((res) => {
        console.log(res);
        // res
        // .filter((singleQuestion) => singleQuestion.category.title === "mov")
        // .forEach((singleQuestion) => {
        //     console.log(singleQuestion.question);
        //     app.questionList.push(singleQuestion);
        //     });    
            
        });
        // app.questionList.filter((categories)=> categories.category.title === "let's play some basketball")
        // .forEach((categories) => {
        //     console.log(categories.question);
            
        // })
        // console.log(app.questionList);

        
        // $(".question").append(`<h1>${res[0].question}</h1>`)
        
    // });
}

// app.displayCategories() = function(){

// }


app.events = function(){
    $(".category").on("click", function(e){
        e.preventDefault();
        // console.log('yay');
        // app.userCategoryChoice = "app." + $(".category:checked").val();

        app.userCategoryChoice = $(".category:checked").val();
        // console.log(app.userCategoryChoice)



        // if user choice is equal to music display music 
        // loop into new array 
        // match userinput to the category array name 
        // then filter the questions with value 
        // console.log(app.userCategoryChoice);

        // app.getClues(userCategoryChoice);
        console.log(app.userCategoryChoice);
        app.getClues(app.userCategoryChoice);
        // 
        

    })

}

app.init = function(){
    app.events();
    // console.log(app.userCategoryChoice);

    // app.getClues();
}

$(function(){
    app.init();
});
