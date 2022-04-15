import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderByOpeningHours'
})
export class OrderByOpeningHoursPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;

  }

}
