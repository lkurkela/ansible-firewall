var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var firewallRulesSchema = new Schema({
    _id: { type: String },
    ruleset: [ { 
      interfaceIn: String, interfaceInNot: Boolean,
      interfaceOut: String, interfaceInNot: Boolean,
      sourceAddress: String, sourceAddressNot: Boolean,
      destinationAddress: String, destinationAddressNot: Boolean,
      sourcePort: Number, sourcePortNot: Boolean,
      destinationPort: Number, destinationPortNot: Boolean,
      protocol: String, protocolNot: Boolean,
      target: String } ]
});

var FirewallRules = mongoose.model('FirewallRules', firewallRulesSchema);

module.exports = FirewallRules;
