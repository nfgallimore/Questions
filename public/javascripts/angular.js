angular.module('questions', ['questionServices'])
.config(['$routeProvider', function($routeProvider)
{
    $routeProvider.
    when('/questions', {templateUrl: 'partials/list.html', controller: QuestionListCtrl}).
    when('/question/:questionId', {templateUrl: 'partials/item.html', controller: QuestionItemCtrl}).
    when('/new', {templateUrl: 'partials/new.html', controller: QuestionNewCtrl}).
    //when('/quiz', {templateUrl: 'partials/quiz.html', controller: TimerCtrl}).
    otherwise({redirectTo: '/questions'});
}]);
