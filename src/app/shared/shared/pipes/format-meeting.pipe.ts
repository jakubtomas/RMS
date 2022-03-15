import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'formatMeeting'
})
export class FormatMeetingPipe implements PipeTransform {

  transform(date: unknown, ...args: unknown[]): string {
    return moment(date).format('LL');
  }

}
