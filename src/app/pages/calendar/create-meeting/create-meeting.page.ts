/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BusinessService } from '../../../services/business.service';
import { AlertController, ToastController } from '@ionic/angular';
import { CalendarService } from '../../../services/calendar.service';
import { CalendarMode, Step } from 'ionic2-calendar/calendar';
import * as moment from 'moment';
import { TimeMeeting } from '../../../interfaces/timeMeeting';
import { CalendarComponent } from 'ionic2-calendar';
import { MeetingService } from '../../../services/meeting.service';
import { Meeting } from '../../../interfaces/meeting';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-create-meeting',
  templateUrl: './create-meeting.page.html',
  styleUrls: ['./create-meeting.page.scss'],
})
export class CreateMeetingPage implements OnInit {

  selectedDay;
  timeMeeting: TimeMeeting[] = [];
  selectedDayByCalendar: string;
  selectedDateByCalendar: Date;
  meetingsByDateBusiness: Meeting[] = [];
  defaultOpeningHours: TimeMeeting[] = [];
  businessCalendar = true;
  selectedBusinessId: string;
  pastDay = false;

  //todo set correct date month number
  //todo nastavenie kalendar kolko dni vpred sa moze registrovat
  // kazda pobocka si to moze  urcit sama


  viewTitle: string;
  eventSource = [];

  calendar = {
    mode: 'month' as CalendarMode,
    step: 30 as Step,
    currentDate: new Date()
  };

  // eslint-disable-next-line @typescript-eslint/member-ordering
  @ViewChild(CalendarComponent) myCal: CalendarComponent;

  constructor(private route: ActivatedRoute,
    private toastCtrl: ToastController,
    public alertController: AlertController,
    private meetingService: MeetingService,
    private calendarService: CalendarService) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {

      if (params.businessId !== undefined) {
        this.selectedBusinessId = params.businessId;
        console.log('---------------');
        console.log('I got business id ' + this.selectedBusinessId);
        console.log('---------------');
      }
    });
  }

  private async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'middle'
    });

    toast.onDidDismiss();
    await toast.present();
  }

  next(): void {
    this.myCal.slideNext();
  }

  back(): void {
    this.myCal.slidePrev();
  }

  onViewTittleChanged(title: string): void {
    this.viewTitle = title;
  }

  onCurrentDateChanged(event: Date): void {
    console.log('--------');
    const today = moment().format();
    const yesterday = moment().subtract(1, 'day').format();
    const selectedDay = moment(event).format();


    console.log('===============');

    console.log(today + ' --+---- ' + selectedDay + ' -----  ' + event);

    if (selectedDay > yesterday) {
      this.pastDay = false;
    } else {
      this.pastDay = true;
    }

    this.selectedDateByCalendar = event;
    this.selectedDayByCalendar = event.toString().substring(0, 3);
    this.selectedDay = 'hello';

    console.log('checko hours ' + moment(this.selectedDateByCalendar).format('L'));
    console.log('checko hours ' + moment(this.selectedDateByCalendar).format());

    this.getOpeningHoursByIdBusiness(this.selectedBusinessId);

  }

  private getOpeningHoursByIdBusiness(idBusiness: string): void {
    this.calendarService.getOpeningHoursByIdBusiness(idBusiness).subscribe(calendar => {

      if (calendar.length < 1) {
        this.businessCalendar = false;
        return;
      }

      let open;
      let close;
      switch (this.selectedDayByCalendar) {
        case 'Mon':
          console.log('It is a pondelok.');
          open = calendar[0].week[0]?.openingHours;
          close = calendar[0].week[0]?.closingHours;
          break;
        case 'Tue':
          console.log('It is a utorok.');
          open = calendar[0].week[1]?.openingHours;
          close = calendar[0].week[1]?.closingHours;
          break;
        case 'Wed':
          console.log('It is a Streda.');
          open = calendar[0].week[2]?.openingHours;
          close = calendar[0].week[2]?.closingHours;
          break;
        case 'Thu':
          console.log('It is a Stvrotok.');
          open = calendar[0].week[3]?.openingHours;
          close = calendar[0].week[3]?.closingHours;
          break;
        case 'Fri':
          console.log('It is a Piatok.');
          open = calendar[0].week[4]?.openingHours;
          close = calendar[0].week[4]?.closingHours;
          break;
        case 'Sat':
          console.log('It is a Sobota.');
          open = calendar[0].week[5]?.openingHours;
          close = calendar[0].week[5]?.closingHours;
          break;
        case 'Sun':
          console.log('It is a Nedela.');
          open = calendar[0].week[6]?.openingHours;
          close = calendar[0].week[6]?.closingHours;
          break;
        default:
          console.log('No such day exists!');
          break;
      }

      // create logaritmus
      const realEnd = moment(close, 'HH:mm');

      let isCalculate = true;
      let starts = moment(open, 'HH:mm');
      const ends = moment(open, 'HH:mm');

      let timeMeeting;
      if (calendar[0].timeMeeting) {
        timeMeeting = calendar[0].timeMeeting;
      } else {
        timeMeeting = 15;
      }

      this.defaultOpeningHours = [];
      while (isCalculate) {
        // todo change dates acccording to data from firestore
        ends.add(timeMeeting, 'minutes');

        if (ends <= realEnd) {
          this.defaultOpeningHours.push(
            { start: starts.format('HH:mm'), end: ends.format('HH:mm') }
          );
          starts = moment(ends);
        } else {
          isCalculate = false;
        }
      }


      this.timeMeeting = [];


      if (this.defaultOpeningHours.length > 0) {

        const dateForFirestore = moment(this.selectedDateByCalendar).format('L');

        this.getMeetingsByIdBusinessByDate(idBusiness, dateForFirestore);
      }
      // when I have data in help Array I will call function for data
      // for meeting in this day , this Business
      // And just do filter according to conditions


      //// after push we have to filter which opening are okey and no
      //// take data from firestore collection meetings according to idBusiness
      //// this.timeMeeting = helpArray;

    }, error => {
      // todo set ErrorMessage Something is wrong
      console.log('you got error ');
      console.log(error);
    });
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  selectTime(time: any): void {
    if (this.selectedDateByCalendar && time) {
      this.showAlertForConfirmMeeting(this.selectedDateByCalendar, time);
    }
  }

  private async showAlertForConfirmMeeting(date: Date, time): Promise<any> {
    const confirmDay = moment(date).format('D.M.YYYY');
    // 2022-01-06T14:24:36+01:00
    let upravenyCas = moment(date).format('YYYY-MM-DD');
    upravenyCas = upravenyCas + 'T00:00:00';

    const modifyDate = upravenyCas;

    const alert = await this.alertController.create({
      cssClass: 'alertForm',
      header: 'Confirm Meeting',

      message: 'Are you sure you want to create appointment?' +
        '\n' + '' + confirmDay + '\n' + ' Start  ' + time.start + '\n\n\n\n\n' + '\n' + 'End  ' + time.end,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => { }
        }, {
          text: 'Yes',
          handler: () => {
            this.saveMeeting(time, modifyDate);
          }
        }]
    });
    await alert.present();
  }

  private async showAlertMessage(alertMessage: string): Promise<any> {

    const alert = await this.alertController.create({
      cssClass: 'alertForm',
      header: 'Warning',

      message: alertMessage,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => { }
        },
        // {
        //   text: 'OK',
        //   handler: () => {}
        // }
      ]
    });
    await alert.present();
  }

  private saveMeeting(time, modifyDate): void {
    const userId = localStorage.getItem('idUser');

    console.log(time.start);
    const minutesFromHour = moment(time.start, 'HH:mm').hours() * 60;
    const minutesFromMinutes = moment(time.start, 'HH:mm').minutes();
    const startInMinutes = minutesFromHour + minutesFromMinutes;
    // try new Date ('2017-01-01')
    // modifyDate = moment(modifyDate).add(startInMinutes, 'minutes').format();

    const beforeSave = moment(modifyDate).add(startInMinutes, 'minutes').format();
    console.log('before save');
    console.log(beforeSave);
    console.log(beforeSave.substring(0, 16));

    const meetingData: Meeting = {

      // here is this
      dateForCalendar: moment(this.selectedDateByCalendar).format('L'),
      //date: beforeSave.substring(0, 16),
      date: beforeSave,
      time: {
        end: time.end,
        start: time.start
        //startMinutes: startInMinutes
      },
      minutes: startInMinutes,
      idBusiness: this.selectedBusinessId,
      idUser: userId
    };


    this.meetingService
      .getExistMeeting(meetingData.idBusiness, meetingData.minutes, meetingData.dateForCalendar)
      .subscribe((existMeeting) => {

        if (!existMeeting) {

          //create Meeting
          this.meetingService.addMeeting(meetingData).then(() => {
            this.showToast('A meeting has been created successfully.');

          }).catch((error) => {
            console.error(error);
            //this.showToast('A meeting has not been created');
            this.showAlertMessage('A meeting has not been created. Try again. Something is wrong');
          });

        } else {// its not available termin
          this.showAlertMessage('Please select another time, because this time has been used by another customer.');
        }

      }, error => {
        this.showAlertMessage('A meeting has not been created. Try again. Something is wrong');
        console.error(error);
      });


    // this.meetingService
    //   .getExistMeeting(meetingData.idBusiness, meetingData.minutes, meetingData.dateForCalendar)
    //   .pipe(
    //     mergeMap((existMeeting) => )
    // )
  }

  private getMeetingsByIdBusinessByDate(idBusiness: string, dateForCalendar: string): void {
    this.meetingService.getMeetingsByIdBusinessByDate(idBusiness, dateForCalendar)
      .subscribe(meetings => {
        this.timeMeeting = [];
        this.meetingsByDateBusiness = meetings;
        this.filterReservedHours(this.defaultOpeningHours, meetings);
      }, error => {
        // todo set ErrorMessage Something is wrong
        console.log('you got error ');
        console.error(error);
      });

  }


  private filterReservedHours(openingHour: TimeMeeting[], reservedHours: Meeting[]): void {

    this.timeMeeting = [];
    openingHour.forEach(time => {
      let permissionForSave = true;
      reservedHours.forEach(timeDB => {

        if (time.start === timeDB.time.start && time.end === timeDB.time.end) {
          permissionForSave = false;
        }
      });

      if (permissionForSave) {
        this.timeMeeting.push({
          start: time.start,
          end: time.end,
          isAvailable: true
        });
      } else {
        this.timeMeeting.push({
          start: time.start,
          end: time.end,
          isAvailable: false
        });
      }
    });

  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  reverseTimeList(): void {
    this.timeMeeting.reverse();
  }

}
