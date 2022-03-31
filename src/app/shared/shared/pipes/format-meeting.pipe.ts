import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'formatMeeting'
})
export class FormatMeetingPipe implements PipeTransform {

  transform(date: string, ...args: unknown[]): string {
    const newDateFormat: string = moment(date).format('LL');
    const timeZone: string = date.substring(19, 25);//25

    return newDateFormat + ' ' + timeZone;
  }

}
