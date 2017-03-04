import { Component, OnInit } from '@angular/core';

import { GroupsComponent } from '../groups/groups.component';
import { FirewallRuleset } from '../firewall-ruleset';
import { FirewallRule } from '../firewall-rule';
import { InventoryGroup } from '../inventory-group';
import { BackendServiceService } from '../backend-service.service';


@Component({
  selector: 'app-fw-rules',
  templateUrl: './fw-rules.component.html',
  styleUrls: ['./fw-rules.component.css']
})
export class FwRulesComponent implements OnInit {
  protocolList: string[];
  targetList: string[];
  inventoryGroup: InventoryGroup;
  firewallRuleset : FirewallRuleset;
  ruleId: Number;
  newRule: FirewallRule;

  constructor(private backendService: BackendServiceService) { 
    this.firewallRuleset = new FirewallRuleset();
    this.newRule = new FirewallRule();
    this.protocolList=['tcp','udp','icmp'];
    this.targetList=['accept','drop','reject','forward','masquerade'];
  }

  ngOnInit() {
  }

  selectGroup(group: InventoryGroup) {
    this.inventoryGroup = group;
    this.backendService.getFirewallRules(group.name)
      .then(rules => {
        this.firewallRuleset = rules;
    });
  }

  ruleSubmit() {
    if (this.newRule._id !== undefined) {
      for (let i in this.firewallRuleset.ruleset) {
        if (this.firewallRuleset.ruleset[i]._id == this.newRule._id) {
          this.firewallRuleset.ruleset[i] = this.newRule;
        }
      }
      this.backendService.updateFirewallRules(this.firewallRuleset)
        .then(rules => {
           this.firewallRuleset = rules;
      });

    } else {
      if (this.firewallRuleset.ruleset !== undefined) {
        this.firewallRuleset.ruleset.push(this.newRule);
        this.backendService.updateFirewallRules(this.firewallRuleset)
          .then(rules => {
             this.firewallRuleset = rules;
        });

      } else {
        let newRuleSet = new FirewallRuleset;
        newRuleSet._id = this.inventoryGroup.name;
        let ruleset: FirewallRule[] = [ this.newRule ];
        newRuleSet.ruleset = ruleset;
        this.firewallRuleset = newRuleSet;
        this.backendService.createFirewallRules(this.firewallRuleset)
          .then(rules => {
            this.firewallRuleset = rules;
        });
      }
    }

    this.newRule = new FirewallRule();
  }

  updateRule(rule: FirewallRule) {
    this.newRule = Object.assign({}, rule);
  }
 
  deleteRule(rule: FirewallRule) {
    this.firewallRuleset.ruleset = this.firewallRuleset.ruleset.filter(r => r._id !== rule._id);
    this.backendService.updateFirewallRules(this.firewallRuleset);
  }
}
