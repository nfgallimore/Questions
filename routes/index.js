var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://heroku_app25570769:q59d9o89lf3lb9g35bd92kbjtc@ds051788.mongolab.com:51788/heroku_app25570769');
var QuestionSchema = require('../models/Question.js').QuestionSchema;
var Question = db.model('questions', QuestionSchema);

exports.index = function(req, res) {
  res.render('index', {title: 'Questions'});
};

// JSON API for list of questions
exports.list = function(req, res) {
  Question.find({}, 'question', function(error, questions){
    res.json(questions);
  });
};

// JSON API for getting a single question
exports.question = function(req, res) 
{
	var questionId = req.params.id;
	Question.findById(questionId, '', {lean:true}, function(err, question)
	{
		if (question)
		{
			var userresponsed = false,
			userChoice,
			
			totalresponses = 0;
			
			for(c in question.choices)
			{
				var choice = question.choices[c];
			
				for(v in choice.responses)
				{
					var response = choice.responses[v];
					totalresponses++;
					
					if(response.ip === (req.header('x-forwarded-for') || req.ip))
					{
						userresponsed = true;
						userChoice = 
						{
							_id: choice._id, 
							text: choice.text
						};
					}
				}
			}
			question.userresponsed = userresponsed;
			question.userChoice = userChoice;
			question.totalresponses = totalresponses;
			res.json(question);
		}
		
		else 
		{
			res.json({error:true});
		}
	});
};

// JSON API for creating a new question
exports.create = function(req, res)
{
	var reqBody = req.body,
    choices = reqBody.choices.filter(function(v)
	{
return v.text !== '';
    }),
    questionObj =
    {
		question: reqBody.question,
		choices: choices
	};
	var question = new Question(questionObj);
	question.save(function(err, doc)
	{
		if(err || !doc)
		{
			throw 'Error';
		}
		else
		{
			res.json(doc);
		}
	});
};

//Socket API for saving a response
exports.response = function(socket)
{
	socket.on('send:response', function(data)
	{
		var ip = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address.address;
		Question.findById(data.question_id, function(err, question)
		{
			var choice = question.choices.id(data.choice);
			choice.responses.push({ip:ip});
			question.save(function(err, doc)
			{
				var theDoc =
				{
					question: doc.question,
					_id: doc._id,
					choices: doc.choices,
					userresponsed: false,
					totalresponses: 0
				};
				for (var i = 0, ln = doc.choices.length; i < ln; i++)
				{
					var choice = doc.choices[i];
					for (var j = 0, jLn = choice.responses.length; j < jLn; j++)
					{
						var response = choice.responses[j];
						theDoc.totalresponses++;
						theDoc.ip = ip;
						if (response.ip === ip)
						{
							theDoc.userresponsed = true;
							theDoc.userChoice =
							{
								_id: choice._id,
								text: choice.text
							};
						}
					}
				}
				socket.emit('myresponse', theDoc);
				socket.broadcast.emit('response', theDoc);
			});
		});
	});
};
