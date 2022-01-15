import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'formatMeeting'
})
export class FormatMeetingPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
   return moment(value).format('LL');
    //return value;
  }

}
