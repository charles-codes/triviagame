$(document).ready(function(){
  
    $("#remaining-time").hide();
    $("#start").on('click', trivia.startGame);
    $(document).on('click' , '.option', trivia.guessChecker);
    
  })
  
  var trivia = {
  
    correct: 0,
    incorrect: 0,
    unanswered: 0,
    currentSet: 0,
    timer: 20,
    timerOn: false,
    timerId : '',
   
    // List of Questions //
    questions: {
      q1: 'Who invented the game of basketball?',
      q2: 'What former player is now immortalized in the NBA logo?',
      q3: 'Which NBA franchise has won the most NBA Championships?',
      q4: 'Who is the NBA all-time leading scorer?',
      q5: "Which player has won the most MVP awards?",
      q6: 'Who is the NBA all-time leader in assists?',
      q7: "Which player has played in the most NBA games?",
      q8: "Which player holds the record for the most points scored in a single game?",
      q9: "Which NBA franchise is the most recently established?",
      q10: "Which player earned both the MVP and Defensive Player of the Year Awards in the same season?"
    },
    // List of Question Choices //
    choices: {
      q1: ['Jonathan Doolittle', 'James Naismith', 'Arthur Stansby', 'Robert Wilhite'],
      q2: ['Michael Jordan', 'Bill Russell', 'Wilt Chamberlain', 'Jerry West'],
      q3: ['New York Knicks', 'Los Angeles Lakers', 'Boston Celtics1', 'San Antonio Spurs'],
      q4: ['Kobe Bryant', 'Michael Jordan', 'LeBron James', 'Kareem Abdul Jabar'],
      q5: ['LeBron James','Larry Bird','Kareem Abdul Jabar','Oscar Robertson'],
      q6: ['Magic Johnson','Chris Paul','Steve Nash','John Stockton'],
      q7: ['Kareem Abdul Jabar', 'Karl Malone', 'Michael Jordan','LeBron James'],
      q8: ['Kobe Bryant', 'David Robinson', 'Wilt Chamberlain', 'Devin Booker'],
      q9: ['New Orleans Pelcians', 'Oklahoma City Thunder', 'Toronto Rapters', 'Memphis Grizzlies'],
      q10: ['LeBron James', 'Tim Duncan', 'Kawhi Leonard', 'Michael Jordan']
    },
    // List of Answers //
    answers: {
      q1: 'James Naismith',
      q2: 'Jerry West',
      q3: 'Los Angeles Lakers',
      q4: 'Kareem Abdul Jabar',
      q5: 'Michael Jordan',
      q6: 'John Stockton',
      q7: 'LeBron James',
      q8: 'Wilt Chamberlain',
      q9: 'Oklahoma City Thunder',
      q10: 'Michael Jordan'
    },
  
    // Functions to start, play, and reset game //
    startGame: function(){
      trivia.currentSet = 0;
      trivia.correct = 0;
      trivia.incorrect = 0;
      trivia.unanswered = 0;
      clearInterval(trivia.timerId);
      
      // Show game section //
      $('#game').show();
      
      //  Empty last results //
      $('#results').html('');
      
      // Show timer //
      $('#timer').text(trivia.timer);
      
      // Hide start button //
      $('#start').hide();
  
      $('#remaining-time').show();
      
      // Ask first question //
      trivia.nextQuestion();
      
    },
    // method to loop through and display questions and options 
    nextQuestion : function(){
      
      // set timer to 20 seconds each question
      trivia.timer = 10;
       $('#timer').removeClass('last-seconds');
      $('#timer').text(trivia.timer);
      
      // to prevent timer speed up
      if(!trivia.timerOn){
        trivia.timerId = setInterval(trivia.timerRunning, 1000);
      }
      
      // gets all the questions then indexes the current questions
      var questionContent = Object.values(trivia.questions)[trivia.currentSet];
      $('#question').text(questionContent);
      
      // an array of all the user options for the current question
      var questionOptions = Object.values(trivia.choices)[trivia.currentSet];
      
      // creates all the trivia guess options in the html
      $.each(questionOptions, function(index, key){
        $('#options').append($('<button class="option btn btn-info btn-lg">'+key+'</button>'));
      })
      
    },
    // method to decrement counter and count unanswered if timer runs out
    timerRunning : function(){
      // if timer still has time left and there are still questions left to ask
      if(trivia.timer > -1 && trivia.currentSet < Object.keys(trivia.questions).length){
        $('#timer').text(trivia.timer);
        trivia.timer--;
          if(trivia.timer === 4){
            $('#timer').addClass('last-seconds');
          }
      }
      // the time has run out and increment unanswered, run result
      else if(trivia.timer === -1){
        trivia.unanswered++;
        trivia.result = false;
        clearInterval(trivia.timerId);
        resultId = setTimeout(trivia.guessResult, 1000);
        $('#results').html('<h3>Out of time! The answer was '+ Object.values(trivia.answers)[trivia.currentSet] +'</h3>');
      }
      // if all the questions have been shown end the game, show results
      else if(trivia.currentSet === Object.keys(trivia.questions).length){
        
        // adds results of game (correct, incorrect, unanswered) to the page
        $('#results')
          .html('<h3>Thank you for balling!</h3>'+
          '<p>Correct: '+ trivia.correct +'</p>'+
          '<p>Incorrect: '+ trivia.incorrect +'</p>'+
          '<p>Unaswered: '+ trivia.unanswered +'</p>'+
          '<p>Wanna run it back?</p>');
        
        // hide game sction
        $('#game').hide();
        
        // show start button to begin a new game
        $('#start').show();
      }
      
    },
    
    // method to evaluate the option clicked
    guessChecker : function() {
      
      // timer ID for gameResult setTimeout
      var resultId;
      
      // the answer to the current question being asked
      var currentAnswer = Object.values(trivia.answers)[trivia.currentSet];
      
      // if the text of the option picked matches the answer of the current question, increment correct
      if($(this).text() === currentAnswer){
        // turn button green for correct
        $(this).addClass('btn-success').removeClass('btn-info');
        
        trivia.correct++;
        clearInterval(trivia.timerId);
        resultId = setTimeout(trivia.guessResult, 1000);
        $('#results').html('<h3>Correct Answer!</h3>');
      }
      // else the user picked the wrong option, increment incorrect
      else{
        // turn button clicked red for incorrect
        $(this).addClass('btn-danger').removeClass('btn-info');
        
        trivia.incorrect++;
        clearInterval(trivia.timerId);
        resultId = setTimeout(trivia.guessResult, 1000);
        $('#results').html('<h3>Better get back in the gym! '+ currentAnswer +'</h3>');
      }
      
    },
    // method to remove previous question results and options
    guessResult : function(){
      
      // increment to next question set
      trivia.currentSet++;
      
      // remove the options and results
      $('.option').remove();
      $('#results h3').remove();
      
      // begin next question
      trivia.nextQuestion();
       
    }
  
  }