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
      q10: "Which of the following players earned both the MVP and Defensive Player of the Year Awards in the same season?"
    },
    
    choices: {
      q1: ['James Creighton', 'James Naismith', 'Walter Camp', 'Walter Wingfield'],
      q2: ['Michael Jordan', 'Bill Russell', 'Wilt Chamberlain', 'Jerry West'],
      q3: ['New York Knicks', 'Los Angeles Lakers', 'Boston Celtics', 'San Antonio Spurs'],
      q4: ['Kobe Bryant', 'Michael Jordan', 'LeBron James', 'Kareem Abdul-Jabbar'],
      q5: ['LeBron James','Larry Bird','Kareem Abdul-Jabbar','Oscar Robertson'],
      q6: ['Magic Johnson','Chris Paul','Steve Nash','John Stockton'],
      q7: ['Dirk Nowitzki', 'Robert Parish', 'Michael Jordan','LeBron James'],
      q8: ['Kobe Bryant', 'David Robinson', 'Wilt Chamberlain', 'Devin Booker'],
      q9: ['Oklahoma City Thunder', 'New Orleans Pelicans', 'Toronto Rapters', 'Memphis Grizzlies'],
      q10: ['LeBron James', 'Tim Duncan', 'Kawhi Leonard', 'Michael Jordan']
    },
   
    answers: {
      q1: 'James Naismith',
      q2: 'Jerry West',
      q3: 'Boston Celtics',
      q4: 'Kareem Abdul-Jabbar',
      q5: 'Kareem Abdul-Jabbar',
      q6: 'John Stockton',
      q7: 'Robert Parish',
      q8: 'Wilt Chamberlain',
      q9: 'New Orleans Pelicans',
      q10: 'Michael Jordan'
    },
  
    startGame: function(){
      trivia.currentSet = 0;
      trivia.correct = 0;
      trivia.incorrect = 0;
      trivia.unanswered = 0;
      clearInterval(trivia.timerId);
      
      $('#game').show();
      
      $('#results').html('');
      
      $('#timer').text(trivia.timer);
      
      $('#start').hide();
  
      $('#remaining-time').show();
      
      trivia.nextQuestion();
      
    },

    nextQuestion : function(){
      
      trivia.timer = 25;
       $('#timer').removeClass('last-seconds');
      $('#timer').text(trivia.timer);
      
      if(!trivia.timerOn){
        trivia.timerId = setInterval(trivia.timerRunning, 1000);
      }
      
      var questionContent = Object.values(trivia.questions)[trivia.currentSet];
      $('#question').text(questionContent);
      
      var questionOptions = Object.values(trivia.choices)[trivia.currentSet];
      
      $.each(questionOptions, function(index, key){
        $('#options').append($('<button class="option btn btn-info btn-lg">'+key+'</button>'));
      })
      
    },
    
    timerRunning : function(){
      
      if(trivia.timer > -1 && trivia.currentSet < Object.keys(trivia.questions).length){
        $('#timer').text(trivia.timer);
        trivia.timer--;
          if(trivia.timer === 4){
            $('#timer').addClass('last-seconds');
          }
      }

      else if(trivia.timer === -1){
        trivia.unanswered++;
        trivia.result = false;
        clearInterval(trivia.timerId);
        resultId = setTimeout(trivia.guessResult, 1000);
        $('#results').html('<h3>Out of time! The answer was '+ Object.values(trivia.answers)[trivia.currentSet] +'</h3>');
      }

      else if(trivia.currentSet === Object.keys(trivia.questions).length){
        
        $('#results')
          .html('<h3>Thanks for balling with me!</h3>'+
          '<p>Correct: '+ trivia.correct +'</p>'+
          '<p>Incorrect: '+ trivia.incorrect +'</p>'+
          '<p>Unaswered: '+ trivia.unanswered +'</p>'+
          '<p>Wanna run it back?</p>');
        
        $('#game').hide();
        
        $('#start').show();
      }
      
    },
    
    guessChecker : function() {
      
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

    guessResult : function(){
      
      trivia.currentSet++;
      
      $('.option').remove();
      $('#results h3').remove();
      
      trivia.nextQuestion();
       
    }
  
  }