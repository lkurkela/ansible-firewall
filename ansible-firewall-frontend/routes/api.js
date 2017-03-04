var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var Group = require('../models/group.js');
var FirewallRules = require('../models/firewallRules.js');
var PlaybookLog = require('../models/playbook.js');

var Ansible = require('node-ansible');

var conn = mongoose.connect('localhost', 'ansible');

router.get('/group', function(req, res, next) {
  Group.find(function(err, groups) {
    if (err) return next(err);
    res.send(groups);
  });
});

router.post('/group', function(req, res, next) {
  var group = new Group(req.body);
  group.save(function (err) {
    if (err) return next(err);
    res.send(group);
  });
});

router.get('/group/:id', function(req, res, next) {
  Group.findById(req.params.id, function(err, group) {
    if (err) return next(err);
    res.send(group);
  });
});

router.put('/group/:id', function(req, res, next) {
   Group.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (err, group) {
     if (err) return next(err);
     res.send(group);
   });
});

router.delete('/group/:id', function(req, res, next) {
  Group.remove({_id: req.params.id}, function(err) {
    if (err) return next(err);
    res.send();
  });
});

router.get('/fwrules', function(req, res, next) {
  FirewallRules.find(function(err,rules) {
    if (err) return next(err);
    res.send(rules);
  });
});

router.post('/fwrules', function(req, res, next) {
  var ruleset = new FirewallRules(req.body);
  ruleset.save(function (err) {
    if (err) return next(err);
    res.send(ruleset);
  });
});

router.get('/fwrules/:id', function(req, res, next) {
  FirewallRules.findById(req.params.id, function(err, ruleset) {
    if (err) return next(err);
    if (ruleset==null) {
      ruleset = new FirewallRules();
      ruleset._id = req.params.id;
    }
    res.send(ruleset);
  });
});

router.put('/fwrules/:id', function(req, res, next) {
  FirewallRules.findOneAndUpdate({'_id': req.params.id}, req.body, {new: true, upsert: true}, function(err, ruleset) {
    if (err) return next(err);
    res.send(ruleset);
  });
});

router.delete('/fwrules/:id', function (req, res, next) {
  FirewallRules.remove({_id: req.params.id}, function(err) {
    if (err) return next(err);
    res.send();
  });
});

router.post('/play', function(req, res, next) {
  var peli = req.body;
  var playlog = new PlaybookLog();
  if (peli.limit) {
    playlog.limit = peli.limit;
    var playbook = new Ansible.Playbook().playbook('ansible-playbook/site').inventory('ansible-playbook/mongoinv.py').limit(playlog.limit);
  } else {
    var playbook = new Ansible.Playbook().playbook('ansible-playbook/site').inventory('ansible-playbook/mongoinv.py');
  }
  playlog.save();

  playlog.log = "";
  playbook.on('stdout', function(data) { playlog.log = playlog.log.concat(data.toString()); playlog.save() });
  playbook.on('stderr', function(data) { playlog.log = playlog.log.concat(data.toString()); playlog.save() });

  var promise = playbook.exec();
  promise.then(function(successResult) {
    playlog.resultcode = successResult.code;
    playlog.log = successResult.output;
    playlog.save();

  }, function(error) {
    playlog.resultcode = -1;
    playlog.error = error;
    playlog.save();
    // console.error(error);
  });

  res.send(playlog);
});

router.get('/play/:id', function(req, res, next) {
  PlaybookLog.findById(req.params.id, function(err, log) {
    if (err) return next(err);
    res.send(log);
  });
});


module.exports = router;
