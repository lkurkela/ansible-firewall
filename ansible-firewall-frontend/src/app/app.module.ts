import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { InventoryComponent } from './inventory/inventory.component';
import { GroupsComponent } from './groups/groups.component';
import { FwRulesComponent } from './fw-rules/fw-rules.component';
import { FrontpageComponent } from './frontpage/frontpage.component';
import { PlaybookComponent } from './playbook/playbook.component';

import { BackendServiceService } from './backend-service.service';
import { GroupFilterPipe } from './group-filter.pipe';
import { NewlinePipe } from './newline.pipe';

const appRoutes: Routes = [
  { path: 'inventory',     component: InventoryComponent },
  { path: 'rules',         component: FwRulesComponent },
  { path: 'playbook',      component: PlaybookComponent },
  { path: '',              component: FrontpageComponent },
  { path: '**', component: FrontpageComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    InventoryComponent,
    GroupsComponent,
    FwRulesComponent,
    FrontpageComponent,
    PlaybookComponent,
    GroupFilterPipe,
    NewlinePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [BackendServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
