import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderByOpeningHours'
})
export class OrderByOpeningHoursPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;

    // todo change name of this pipe
    // input is pole meetings
    // take meeting compare with meeting before
    // when date is sme check the start this meeting
    // when is number of minutes less than first change position and
    // check with another
  }

}
