// Managing the question list
function QuestionListCtrl($scope, Question) {
  $scope.questions = Question.query();
}

// Voting/viewing question results
 function QuestionItemCtrl($scope, $routeParams, socket, Question) { 
  $scope.question = Question.get({questionId: $routeParams.questionId});
  socket.on('myresponse', function(data) {
    console.dir(data);
    if(data._id === $routeParams.questionId) {
      $scope.question = data;
    }
  });
  socket.on('response', function(data) {
    console.dir(data);
    if(data._id === $routeParams.questionId) {
      $scope.question.choices = data.choices;
      $scope.question.totalresponses = data.totalresponses;
    }   
  });
  $scope.response = function() {
    var questionId = $scope.question._id,
        choiceId = $scope.question.userresponse;
    if(choiceId) {
      var responseObj = { question_id: questionId, choice: choiceId };
      socket.emit('send:response', responseObj);
    } else {
      alert('You must select an option to response for');
    }
  };
}

// Creating a new question
function QuestionNewCtrl($scope, $location, Question) {
  $scope.question = {
    question: '',
    choices: [{ text: '' }, { text: '' }, { text: '' }]
  };  
  $scope.addChoice = function() {
    $scope.question.choices.push({ text: '' });
  };
  $scope.createQuestion = function() {
    var question = $scope.question;
    if(question.question.length > 0) {
      var choiceCount = 0;
      for(var i = 0, ln = question.choices.length; i < ln; i++) {
        var choice = question.choices[i];        
        if(choice.text.length > 0) {
          choiceCount++
        }
      }    
      if(choiceCount > 1) {
        var newQuestion = new Question(question);       
        newQuestion.$save(function(p, resp) {
          if(!p.error) { 
            $location.path('questions');
          } else {
            alert('Could not create question');
          }
        });
      } else {
        alert('You must enter at least two choices');
      }
    } else {
      alert('You must enter a question');
    }
  };
}