import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { InventoryGroup } from '../inventory-group';
import { BackendServiceService } from '../backend-service.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {
  inventoryGroups: InventoryGroup[];
  errorMessage: string;
  newGroup: string;

  @Input()  allowEdit: boolean = false;
  @Output() groupSelect = new EventEmitter<InventoryGroup>();

  constructor(private backendService: BackendServiceService) { }

  ngOnInit() {
	this.backendService.getGroups().subscribe(groups => this.setInventoryGroups(groups), error => this.errorMessage = <any>error);
  }

  setInventoryGroups(groups: InventoryGroup[]) {
    this.inventoryGroups = groups;
  }

  onSelect(group: InventoryGroup) {
    this.groupSelect.emit(group);
  }

  addGroupSubmit() {
    let newGroup = new InventoryGroup();
    newGroup.name = this.newGroup;
    newGroup.vars = { firewallType: "iptables", routingEnabled: false };
    this.backendService.createGroup(newGroup)
      .then(group => { 
        this.inventoryGroups.push(group); 
        this.newGroup = null; 
    });
  }

  deleteGroup(group: InventoryGroup): void {
    this.backendService.deleteGroup(group)
      .then(() => {
        this.inventoryGroups = this.inventoryGroups.filter(g => g !== group);
      });

  }

}
