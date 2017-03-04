import { Pipe, PipeTransform } from '@angular/core';
import { InventoryGroup } from './inventory-group';

@Pipe({
  name: 'groupFilter', pure: false
})
export class GroupFilterPipe implements PipeTransform {

  transform(items: InventoryGroup[], group: InventoryGroup): any {
   return items.filter(item => item.name !== group.name);
  }

}
