// get certain categories. look for the ids of the catorgories we want out of 100 questions 
    // australia = 5
    // it's australia, mate = 
    // a visit to australia = 
  
    // the internet 
    // internet slang 
    // internet shorthand
    // internet jargon
    // hiding on the internet
    // internet history 
    // free stuff on the internet 
    // on the internet 
    // internet lingo
    // 3 letter words 
    // food 
    // Potpourriiii
    
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
    
// filter the values of them so the user can choose value 
// make sure the value we want is there so the user has choices 
    // 100, 200, 300 = easy 
    // 400, 500, 600 = medium 
    // 800, 1000 = hard 
//


console.log("linked");
const app ={};

app.questionList =[];



app.getClues = function(){
    $.ajax({
        url: "http://jservice.io/api/clues",
        method: "GET",
        data: {
            count: 100,
            // value: 400,
            category: 105
        }
    })
    .then((res) => {
        console.log(res);
        // res
        // .filter((singleQuestion) => singleQuestion.value === 100)
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
    app.getClues();
    app.getClues();
}

$(function(){
    app.init();
});
