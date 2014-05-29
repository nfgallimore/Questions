var mongoose = require('mongoose');

// Subdocument schema for responses
var responseSchema = new mongoose.Schema({ ip: 'String' });

// Subdocument schema for question choices
var choiceSchema = new mongoose.Schema({
	text: String,
  	responses: [responseSchema],
	correct: Boolean
});

// Document schema for questions
exports.QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  choices: [choiceSchema]
});