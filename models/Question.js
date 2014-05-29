var mongoose = require('mongoose');

// Sub document schema for responses
var responseSchema = new mongoose.Schema
({
	ip: 'String',
});

// Sub document schema for question choices
var choiceSchema = new mongoose.Schema
({
	text: String,
	responses: [responseSchema],
	correct: Boolean,
});

// Document schema for questions
exports.QuestionSchema = new mongoose.Schema
({
  question: { type: String, required: true },
  choices: [choiceSchema],
});