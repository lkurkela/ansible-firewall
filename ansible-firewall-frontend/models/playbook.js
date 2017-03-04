var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var playbookSchema = new Schema({
    date: { type: Date, default: Date.now },
    limit: { type: String },
    log: { type: String },
    error: { type: String },
    resultcode: { type: Number }
});

var PlaybookLog = mongoose.model('Playbook', playbookSchema);

module.exports = PlaybookLog;

