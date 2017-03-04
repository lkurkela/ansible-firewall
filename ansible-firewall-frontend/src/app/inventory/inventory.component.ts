import { Component, OnInit } from '@angular/core';

import { GroupsComponent } from '../groups/groups.component';
import { InventoryGroup } from '../inventory-group';
import { BackendServiceService } from '../backend-service.service';


@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})

export class InventoryComponent implements OnInit {
  inventoryGroups: InventoryGroup[];
  errorMessage: string;
  allowEdit: boolean;
  inventoryGroup: InventoryGroup;
  newHost: string;
  newChildGroup: string;
  firewallTypes: string[];

  constructor(private backendService: BackendServiceService) { 
    this.firewallTypes=['iptables','nftables'];
  }

  ngOnInit() {
    this.backendService.getGroups().subscribe(groups => this.inventoryGroups = groups,  error => this.errorMessage = <any>error);
  }

  deleteHost(host: string) {
    let index = this.inventoryGroup.hosts.indexOf(host, 0);
    if (index > -1) {
      this.inventoryGroup.hosts.splice(index,1);
    }
    this.backendService.updateGroup(this.inventoryGroup);
  }
 
  addHostSubmit() {
    this.inventoryGroup.hosts.push(this.newHost);
    this.newHost = "";
    this.backendService.updateGroup(this.inventoryGroup);
  }

  addGroupSubmit() {
    this.inventoryGroup.children.push(this.newChildGroup);
    this.newChildGroup = null;
    this.backendService.updateGroup(this.inventoryGroup);
  }

  deleteChildGroup(name: string) {
    this.inventoryGroup.children = this.inventoryGroup.children.filter(child => child !== name);
    this.backendService.updateGroup(this.inventoryGroup);
  }

  onChangeFirewallType(fwValue: string) {
    this.inventoryGroup.vars['firewallType'] = fwValue;
    this.backendService.updateGroup(this.inventoryGroup);
  }

  onChangeRouting(routing: boolean) {
    this.inventoryGroup.vars['routingEnabled'] = !routing;
    this.backendService.updateGroup(this.inventoryGroup);
  }

}
