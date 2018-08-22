console.log("linked");
const app ={};

app.questionList =[];
app.foodFacts = 832;
app.movies= 309;
app.stupidAnswers = 136;
app.animals =21;
app.countriesOfTheWorld = 1361;
app.musicalInstruments = 184;
app.fruitsAndVegetables = 777;
app.actresses = 612;
app.popMusic = 770;
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
            value: 100,
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

app.init = function(){
    app.getClues(app.countriesOfTheWorld);
    // app.getClues(app.food);
    // app.getClues(app.movies);
    // app.getClues(app.stupidAnswers);
    // app.getClues();
}

$(function(){
    app.init();
});