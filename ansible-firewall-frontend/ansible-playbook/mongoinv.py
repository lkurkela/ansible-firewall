#!/usr/bin/python

from pymongo import MongoClient
import argparse
import json

def connectMongo():
	client = MongoClient('mongodb://localhost:27017/')
	return client['ansible']


def parseRuleVariable(rule, mongoVar, jsonVar):
	retDict = { }
	if mongoVar in rule:
		if mongoVar+'Not' in rule:	
			if (rule[mongoVar+'Not']):
				retDict['not_'+jsonVar] = rule[mongoVar]
			else:
				retDict[jsonVar] = rule[mongoVar]
		else:
			retDict[jsonVar] = rule[mongoVar]
	return retDict


def parseFW(fwRules):
	outputRules = [ ]
	for rule in fwRules:
		ruleDict = { }
		if 'target' in rule:
			ruleDict['target'] = rule['target']
		
		ruleDict.update(parseRuleVariable(rule, 'protocol', 'proto'))
		ruleDict.update(parseRuleVariable(rule, 'interfaceIn', 'in_iface'))
		ruleDict.update(parseRuleVariable(rule, 'interfaceOut', 'out_iface'))
		ruleDict.update(parseRuleVariable(rule, 'sourceAddress', 'source'))
		ruleDict.update(parseRuleVariable(rule, 'destinationAddress', 'destination'))
		ruleDict.update(parseRuleVariable(rule, 'sourcePort', 'sport'))
		ruleDict.update(parseRuleVariable(rule, 'destinationPort', 'dport'))

		outputRules.append(ruleDict)
	return outputRules	


def listInventory():
	dbAnsible = connectMongo()
	collGroups = dbAnsible['groups']
        collFW = dbAnsible['firewallrules']
	inventory = { }
	for group in collGroups.find():
		groupDict = { }
		groupDict['hosts'] = group['hosts']
		groupDict['vars'] = group['vars']
		groupDict['children'] = group['children']
		fwRules = collFW.find_one({"_id": group['name']})
		if (fwRules != None):
			group['vars']['firewall_rules'] = parseFW(fwRules['ruleset'])
		# print "group: {}".format(groupDict)
		# print "rules: {}".format(fwRules)
		inventory.update({group['name']: groupDict})

	print "{}".format(json.dumps(inventory))


def hostVariables(hostname):
	dbAnsible = connectMongo()
        collGroups = dbAnsible['groups']
        collFW = dbAnsible['firewallrules']
        host = { }
	fwRules = collFW.find_one({"_id": hostname})
	if (fwRules != None):
		host['firewall_rules'] = parseFW(fwRules['ruleset'])
	print "{}".format(json.dumps(host))



parser = argparse.ArgumentParser()
parserGroup = parser.add_mutually_exclusive_group()
parserGroup.add_argument("--list", help="list group inventory", action="store_true")
parserGroup.add_argument("--host", help="list host variables")
args = parser.parse_args()

if args.list:
	listInventory()
elif args.host:
	hostVariables(args.host)
else:
	print "nothing"
