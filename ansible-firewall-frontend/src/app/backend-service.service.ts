import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { InventoryGroup } from './inventory-group';
import { FirewallRuleset } from './firewall-ruleset';
import { PlaybookLog } from './playbook-log';

@Injectable()
export class BackendServiceService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private groupsUrl = 'api/group';
  private fwrulesUrl = 'api/fwrules';
  private playUrl = 'api/play';
  inventoryGroups: InventoryGroup[];

  constructor(private http: Http) { }

  getGroups(): Observable<InventoryGroup[]> {
    return this.http.get(this.groupsUrl)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  updateGroup(group: InventoryGroup): Promise<InventoryGroup> {
    const url = `${this.groupsUrl}/${group._id}`;
    return this.http.put(url, JSON.stringify(group), {headers: this.headers})
    .toPromise()
    .then(() => group)
    .catch(this.handleError);
  }

  createGroup(group: InventoryGroup): Promise<InventoryGroup> {
    return this.http
      .post(this.groupsUrl, JSON.stringify(group), {headers: this.headers})
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  deleteGroup(group: InventoryGroup): Promise<void> {
    const url = `${this.groupsUrl}/${group._id}`;
    return this.http.delete(url, {headers: this.headers})
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

  getFirewallRulesAll(): Promise<FirewallRuleset[]> {
    return this.http.get(this.fwrulesUrl)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  getFirewallRules(name: String): Promise<FirewallRuleset> {
    const url = `${this.fwrulesUrl}/${name}`;
    return this.http.get(url)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  updateFirewallRules(rules: FirewallRuleset): Promise<FirewallRuleset> {
    const url = `${this.fwrulesUrl}/${rules._id}`;
    return this.http.put(url, JSON.stringify(rules), {headers: this.headers})
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  createFirewallRules(rules: FirewallRuleset): Promise<FirewallRuleset> {
    return this.http
      .post(this.fwrulesUrl, JSON.stringify(rules), {headers: this.headers})
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  deleteFirewallRules(rules: FirewallRuleset): Promise<void> {
    const url = `${this.fwrulesUrl}/${rules._id}`;
    return this.http.delete(url, {headers: this.headers})
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

  executePlaybook(limit: String): Promise<PlaybookLog> {
    return this.http
      .post(this.playUrl, JSON.stringify({limit: limit}), {headers: this.headers})
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  getPlaybookLog(id: String): Promise<PlaybookLog> {
    const url = `${this.playUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || [ { } ];
  }

  private handleError (error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}
