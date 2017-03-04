var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var groupSchema = new Schema({
    name: { type: String },
    hosts: [ String ],
    children: [ String ],
    vars: Schema.Types.Mixed
});

var Group = mongoose.model('Group', groupSchema);

module.exports = Group;
