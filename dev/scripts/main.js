console.log("linked");
const app ={};

app.questionList =[];

app.getClues = function(){
    $.ajax({
        url: "http://jservice.io/api/clues",
        method: "GET",
        data: {
            count: 100,
            value: 400,
            category: 1
        }
    })
    .then((res) => {
        console.log(res);
        // res
        // .filter((singleQuestion) => singleQuestion.value === 100)
        // .forEach((singleQuestion) => {
        //     console.log(singleQuestion.question);
            // app.questionList.push(singleQuestion);
            
            
        } );
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
    // app.getClues();
}

$(function(){
    app.init();
});