import { Component, OnInit } from '@angular/core';

import { InventoryGroup } from '../inventory-group';
import { BackendServiceService } from '../backend-service.service';
import { PlaybookLog } from '../playbook-log';


@Component({
  selector: 'app-playbook',
  templateUrl: './playbook.component.html',
  styleUrls: ['./playbook.component.css']
})
export class PlaybookComponent implements OnInit {
  inventoryGroups: InventoryGroup[];
  errorMessage: string;
  playRunning: boolean;
  playLimit: string;
  playLog: PlaybookLog;

  constructor(private backendService: BackendServiceService) { 
    this.playRunning = false;
  }

  ngOnInit() {
    this.backendService.getGroups().subscribe(groups => this.inventoryGroups = groups,  error => this.errorMessage = <any>error);
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  pollPlay() {
    if (this.playLog.resultcode === undefined) {
      this.delay(2000).then( () => {
        this.backendService.getPlaybookLog(this.playLog._id)
              .then(log => { 
                this.playLog = log;
                if (log.resultcode === undefined) {
                  this.pollPlay();
                } else {
		  this.playRunning = false;
		}
              });
      });
    }
  }

  executePlay() {
    this.backendService.executePlaybook(this.playLimit)
      .then(log => {
	this.playLog = log;
        this.playRunning = true;
        this.pollPlay();
    });

  }

}
