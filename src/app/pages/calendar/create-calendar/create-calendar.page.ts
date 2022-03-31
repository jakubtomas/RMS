/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CalendarService } from '../../../services/calendar.service';
import { Calendar } from '../../../interfaces/calendar';
import { AlertController, ToastController } from '@ionic/angular';


import { Day } from '../../../interfaces/day';
import * as moment from 'moment';
import { TimeMeeting } from '../../../interfaces/timeMeeting';
import { MeetingService } from '../../../services/meeting.service';
import { BusinessService } from 'src/app/services/business.service';
import { Meeting } from 'src/app/interfaces/meeting';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-create-calendar',
  templateUrl: './create-calendar.page.html',
  styleUrls: ['./create-calendar.page.scss'],
})
export class CreateCalendarPage implements OnInit {

  // contactForm: FormGroup;
  messageFirebase: string;
  selectedBusinessId: string;
  calendar: Calendar;
  isUpdateCalendar = false;
  docIdCalendar: string;
  errorsFromHours: string[] = [];
  timeZone: string = moment().format().toString().substring(19, 25);//25
  todayDate = moment().format('L');
  timeMeeting: TimeMeeting[] = [];
  formatOpeningHours = false;
  countOfMeetings = 0;
  permissionUpdate = false;
  private allMeetingsFromDb: Meeting[] = [];
  private deleteDay = false;
  private dateForDelete = [];
  private allDatesForDelete = [];
  private allIdsMeetingsForDelete = [];
  private daysForDelete = [];


  //data for UI component
  ionTitle: string;
  ionButton: string;


  get MinutesForMeeting(): FormControl {
    return this.contactForm.get('MinutesForMeeting') as FormControl;
  }

  contactForm = new FormGroup(
    {
      MondayOpening: new FormControl('',),
      MondayClosing: new FormControl('',),

      TuesdayOpening: new FormControl('',),
      TuesdayClosing: new FormControl('',),

      WednesdayOpening: new FormControl('',),
      WednesdayClosing: new FormControl('',),

      ThursdayOpening: new FormControl('',),
      ThursdayClosing: new FormControl('',),

      FridayOpening: new FormControl('',),
      FridayClosing: new FormControl('',),

      SaturdayOpening: new FormControl('',),
      SaturdayClosing: new FormControl('',),

      SundayOpening: new FormControl('',),
      SundayClosing: new FormControl('',),

      MinutesForMeeting: new FormControl('', [Validators.required,
      Validators.min(10),
      Validators.max(360)]),

    });

  constructor(private route: ActivatedRoute,
    private calendarService: CalendarService,
    private meetingService: MeetingService,
    private toastCtrl: ToastController,
    private router: Router,
    public alertController: AlertController,
    private businessService: BusinessService,
  ) { }

  ngOnInit() {
    this.messageFirebase = null;
    this.isUpdateCalendar = false;

    this.route.queryParams.subscribe((params: Params) => {
      if (params.businessId !== undefined) {
        this.selectedBusinessId = params.businessId;
      }
      if (params.docCalendarId !== undefined && params.businessId !== undefined) {
        this.docIdCalendar = params.docCalendarId;

        this.controlBusinessPermission(params.businessId, params.docCalendarId);
        this.isUpdateCalendar = true;

      } else {
        this.isUpdateCalendar = false; //We are creating calendar
      }
      this.setValuesForPage();
    });
  }




  setValuesForPage(): void {
    if (this.isUpdateCalendar) {
      this.ionTitle = 'Update opening hours';
      this.ionButton = 'Update';
    } else {
      this.ionTitle = 'Create opening hours';
      this.ionButton = 'Create';
    }
  }



  controlBusinessPermission(businessId: string, docCalendarId: string): void {

    this.businessService.getBusinessPermission(businessId)
      .subscribe((permissions) => {
        const myId = localStorage.getItem('idUser');

        if (permissions.idUser === myId) {
          this.getOneCalendar(docCalendarId);
          console.log('this todaydate');
          console.log(this.todayDate);

          this.getCountOfMeetingsForBusiness(businessId, this.todayDate);
        } else {
          this.router.navigate(['/dashboard']);
        }

      }, error => {
        console.error(error);
      });
  }

  getCountOfMeetingsForBusiness(idBusiness: string, dateForCalendar: string): void {
    this.meetingService.getMeetingsByIdBusinessByDate(idBusiness, dateForCalendar)
      .subscribe((meetings: Meeting[]) => {
        console.log('vsetky meeting od dnesneho dna');
        console.log(meetings);
        console.log(' ');
        this.allMeetingsFromDb = meetings;
        this.countOfMeetings = meetings.length;
      });
  }


  saveData(): void {

    const calendar: Calendar = {
      idBusiness: this.selectedBusinessId,
      timeMeeting: this.contactForm.value.MinutesForMeeting,
      week: this.mapOpeningClosingHours(),
      break: 'hello',
      timeZone: this.timeZone
    };

    if (this.errorsFromHours.length === 0) { // when we do not have errors
      this.calendarService.addCalendar(calendar).then(() => {
        this.showToast('Calendar has been created successfully');
        this.router.navigate(['/detail-business'],
          { queryParams: { businessId: this.selectedBusinessId } });

      }).catch((error) => {
        console.log('error');
        console.log(error);
        this.showToast('Something is wrong');
      });
    }
  }

  prepareUpdate(): void {
    this.dateForDelete = [];
    this.daysForDelete = [];

    let readyTimeZone = this.timeZone;
    if (this.docIdCalendar !== undefined) {
      // old value
      readyTimeZone = this.calendar.timeZone;
    }

    const updateCalendar: Calendar = {
      idBusiness: this.calendar.idBusiness,
      week: this.mapOpeningClosingHours(),
      timeMeeting: this.contactForm.value.MinutesForMeeting,
      break: 'no break',
      timeZone: readyTimeZone
    };

    // control error messages from OH
    if (this.errorsFromHours.length > 0) {
      return;
    }

    // this.calendar.week
    // compare
    // newCalendar

    // ist array , for or foreach
    // 2 array compare values and if

    // 1 case  change old value  // should delete all metting in better case delete only this date
    //2 case change empty value to new  // should not delete any meeting
    //3  ak sa zmenil hodnota na  prazdny string
    // v pripade ze sa zmeni otvaranie hodin nastavit vymazanie stretnuti

    // pripad iba rozsiri otvaracie hodiny nevymazavat
    // pripda ked zmeni iba jeden den preco vymyzat vsetky
    // in case that delete one day or more day just for closing // empty you should not delete any
    // or should delete only this day
    // v pripade ze sa zmenia minutes for meeting , asi vymazat vsetko mozno prepocitat

    // v pripade vymazania calendara pomocou delete calendar
    // potrebne osetrit ked sa meni s prazdneho stringu na new aby sa nevymazal kalendar



    const lengthArray = this.calendar.week.length;
    let counter = 0;
    let counterNoChange = 0;

    // go across every day/line and control that we have different value
    while (counter < lengthArray) {

      // compare old calendar with new calendar
      if (this.calendar.week[counter].openingHours !== updateCalendar.week[counter].openingHours
        || this.calendar.week[counter].closingHours !== updateCalendar.week[counter].closingHours) {

        this.deleteDay = true;
        this.daysForDelete.push(updateCalendar.week[counter].day);

        // in case that new value is empty string just for closing day
        // todo control that calendar is showing posibility create meeting according to value, opening and closingHours

        // if (updateCalendar.week[counter].openingHours === '' && updateCalendar.week[counter].closingHours === '') {
        //   this.deleteDay = false; // todo change I think we should also delete this
        // }

        // in case when hours are empty string, we won't delete any meeting
        if (this.calendar.week[counter].openingHours === ''
          && this.calendar.week[counter].closingHours === '') {
          this.daysForDelete.pop();
        }
      } else {
        counterNoChange++;
      }
      ++counter;
    }

    let deleteWithoutCalculate = false;
    // in case that user change minutes for meeting , app have delete all meetings
    if (this.calendar.timeMeeting !== updateCalendar.timeMeeting) {
      this.deleteDay = true;// todo use old function for deleting all meetings
      deleteWithoutCalculate = true;
    }

    // no change counter for 7 days , no different timeMeeting value
    if (counterNoChange === 7 && this.calendar.timeMeeting === updateCalendar.timeMeeting) {
      this.showToast('You did not change any value. Nothing for update.');
      return;
    }

    // count of meeting for this calendar from Firestore
    if (this.countOfMeetings > 0) {

      console.log(this.daysForDelete);

      //daysForDelete.forEach((day) => this.calculateDateByName0fDate(day));
      // this.getMeetingsByBusinessAndDay(this.calendar.idBusiness);
      const newLocal = 'Warning are you sure with updating this calendar. This calendar has ' + this.countOfMeetings + ' meetings ';
      this.showAlertMessage(newLocal, updateCalendar, deleteWithoutCalculate); // todo change this message counf of meetings
    } else {
      this.updateCalendar(updateCalendar);
    }
  }


  // For day set last date which is for this day . Monday result last Monday 04/11/2022
  private calculateDateByName0fDate(day: string) {
    let count = 0;
    while (count < 8) {

      const nameDayFromWeek = moment().subtract(count, 'days').format('dddd');
      const dateDayFromWeek = moment().subtract(count, 'days').format('L');

      // parameter
      if (day === nameDayFromWeek) {
        this.dateForDelete.push(dateDayFromWeek);
        count = 8;
      } else {
        count++;
      }
    }
    this.calculateAllPossibleDateForDelete();
  }

  //
  private calculateAllPossibleDateForDelete(): void {
    if (this.dateForDelete.length > 0) {
      this.dateForDelete.forEach((date) => this.calculateDatesForNext6Months(date));
    }
    this.filterMeetingsForDelete();

    console.log('this is end');
    console.log('----------');
    console.log(this.allDatesForDelete);
  }

  // Calculate  next 25 week dates since input date ,and push into array
  private calculateDatesForNext6Months(date: string): void {
    let counter = 0;
    let addDays = 0;
    let newDate: string;
    while (counter < 25) {
      addDays = counter * 7;

      newDate = moment(date).add(addDays, 'days').format('L');
      this.allDatesForDelete.push(newDate);
      ++counter;
    }
  }
  // filter meetings fore delete
  private filterMeetingsForDelete(): void {

    console.log(this.allMeetingsFromDb);
    console.log('------');
    console.log(this.allDatesForDelete);
    this.allIdsMeetingsForDelete = [];
    console.log('before filter');
    console.log(this.allIdsMeetingsForDelete.length);
    console.log(this.allIdsMeetingsForDelete);

    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < this.allMeetingsFromDb.length; i++) {
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let counter = 0; counter < this.allDatesForDelete.length; counter++) {
        if (this.allDatesForDelete[counter] === this.allMeetingsFromDb[i].dateForCalendar) {
          //resultArray.push(this.allMeetingsFromDb[i].id);
          this.allIdsMeetingsForDelete.push(this.allMeetingsFromDb[i].id);
        }
      }
    }

    this.allIdsMeetingsForDelete = // remove duplicate values in array
      this.allIdsMeetingsForDelete.filter((id, index) => this.allIdsMeetingsForDelete.indexOf(id) === index);
    console.log('                ');
    console.log('                ');
    console.log('show after filter ');
    console.log(this.allIdsMeetingsForDelete.length);
    console.log(this.allIdsMeetingsForDelete);

    // remove meetings
    this.allIdsMeetingsForDelete.forEach((id) => this.meetingService.deleteMeeting(id));
  }
  // todo opravit
  private updateCalendar(newCalendar: Calendar, deleteWithoutCalculate?: boolean): void {

    if (this.errorsFromHours.length === 0) {
      this.calendarService.updateCalendar(this.docIdCalendar, newCalendar).then(() => {

        if (this.deleteDay) {

          if (deleteWithoutCalculate) {
            this.deleteMeetingsForUpdateCalendar();

          } else {
            this.daysForDelete.forEach((day) => this.calculateDateByName0fDate(day));

          }
        }

        this.router.navigate(['/detail-business'], { queryParams: { businessId: newCalendar.idBusiness } });
        this.showToast('Calendar has been updated');


      }).catch((error) => {
        console.log('error you got error ');
        console.log(error);
      });
    }
  }

  private deleteMeetingsForUpdateCalendar() {

    this.meetingService.deleteMeetingsByIdBusiness(this.selectedBusinessId, this.todayDate)
      .toPromise().then(() => {
        console.log('Meetings have been deleted succesfully');
        console.log('Meetings have been deleted succesfully');
        console.log('Meetings have been deleted succesfully');
      }).catch((error) => {
        console.log('error you got error ');
        console.log(error);
        this.showToast('Operation failed. Something is wrong');
      });

  }

  private async showAlertMessage(alertMessage: string, updateCalendar: Calendar, deleteWithoutCalculate: boolean): Promise<any> {

    const alert = await this.alertController.create({
      cssClass: 'alertForm',
      header: 'Warning',

      message: alertMessage,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        },
        {
          text: 'OK',
          cssClass: 'secondary',
          handler: () => {
            this.updateCalendar(updateCalendar, deleteWithoutCalculate);
          }
        },
      ]
    });
    await alert.present();
  }

  private async showToast(msg: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'middle'
    });

    toast.onDidDismiss();
    await toast.present();
  }


  // private async showAlertForConfirmMeeting(date: Date, time): Promise<any> {
  //   const confirmDay = moment(date).format('D.M.YYYY');
  //   // 2022-01-06T14:24:36+01:00
  //   let upravenyCas = moment(date).format('YYYY-MM-DD');
  //   upravenyCas = upravenyCas + 'T00:00:00';

  //   const modifyDate = upravenyCas;

  //   const alert = await this.alertController.create({
  //     cssClass: 'alertForm',
  //     header: 'Confirm Meeting',

  //     message: 'Are you sure you want to create appointment?' +
  //       '\n' + '' + confirmDay + '\n' + ' Start  ' + time.start + '\n\n\n\n\n' + '\n' + 'End  ' + time.end,
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         role: 'cancel',
  //         cssClass: 'secondary',
  //         handler: () => { }
  //       }, {
  //         text: 'Yes',
  //         handler: () => {
  //           this.saveMeeting(time, modifyDate);
  //         }
  //       }]
  //   });
  //   await alert.present();
  // }

  getOneCalendar(docCalendarId: string): void {

    this.calendarService.getOneCalendar(docCalendarId)
      .subscribe(calendar => {

        this.calendar = calendar;
        // this.timeZone = calendar.timeZone;
        this.transformOpeningHoursDataForForm(calendar, true);

        // const open = calendar.week[0]?.openingHours;
        // const close = calendar.week[0]?.closingHours;

        // const openTime = moment(open, 'HH:mm');
        // openTime.add('10', 'minutes');

        // const realEnd = moment(close, 'HH:mm');

        // let isCalculate = true;
        // let starts = moment(open, 'HH:mm');
        // const ends = moment(open, 'HH:mm');
        // this.timeMeeting = [];

        // while (isCalculate) {

        //   ends.add('15', 'minutes');

        //   if (ends <= realEnd) {

        //     this.timeMeeting.push(
        //       { start: starts.format('HH:mm'), end: ends.format('HH:mm') }
        //     );
        //     starts = moment(ends);
        //   } else {
        //     isCalculate = false;
        //   }
        // }

      }, error => {
        console.log('you got error ');
        console.log(error);
      });
  }

  private mapOpeningClosingHours(skipChecking?: boolean): Day[] {
    const formData = this.contactForm.value;

    const sundayO = formData.SundayOpening;
    const sundayC = formData.SundayClosing;

    console.log(sundayO + ' -- ' + sundayC);
    console.log('we are here ');
    console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++ ');
    console.log(formData);

    // let duration =

    // let currentTime = moment
    //     .duration(moment(sundayC, 'YYYY/MM/DD HH:mm')
    //         .diff(moment(sundayO, 'YYYY/MM/DD HH:mm'))
    //     ).asMinutes();
    // console.log(currentTime);
    // console.log('Hodina');
    //
    // use this function for saving data intp firestore

    const withoutFormatDate = formData.MondayOpening;
    console.log('pred upravou');
    console.log(withoutFormatDate);
    console.log('po uprave ');
    const value = moment(formData.MondayOpening).format('HH:mm');
    console.log(value);

    const hours = [
      {
        day: 'Monday', // todo create ternar operater if formData.MondayOpening is empty string use '' else use
        //todo moment(formData.MondayOpening).format('HH:mm')
        openingHours: formData.MondayOpening === '' ? '' : moment(formData.MondayOpening).format('HH:mm'),
        closingHours: formData.MondayClosing === '' ? '' : moment(formData.MondayClosing).format('HH:mm')
      },
      {
        day: 'Tuesday',
        openingHours: formData.TuesdayOpening === '' ? '' : moment(formData.TuesdayOpening).format('HH:mm'),
        closingHours: formData.TuesdayClosing === '' ? '' : moment(formData.TuesdayClosing).format('HH:mm')
      },
      {
        day: 'Wednesday',
        openingHours: formData.WednesdayOpening === '' ? '' : moment(formData.WednesdayOpening).format('HH:mm'),
        closingHours: formData.WednesdayClosing === '' ? '' : moment(formData.WednesdayClosing).format('HH:mm')
      },
      {
        day: 'Thursday',
        openingHours: formData.ThursdayOpening === '' ? '' : moment(formData.ThursdayOpening).format('HH:mm'),
        closingHours: formData.ThursdayClosing === '' ? '' : moment(formData.ThursdayClosing).format('HH:mm')
      },
      {
        day: 'Friday',
        openingHours: formData.FridayOpening === '' ? '' : moment(formData.FridayOpening).format('HH:mm'),
        closingHours: formData.FridayClosing === '' ? '' : moment(formData.FridayClosing).format('HH:mm')
      },
      {
        day: 'Saturday',
        openingHours: formData.SaturdayOpening === '' ? '' : moment(formData.SaturdayOpening).format('HH:mm'),
        closingHours: formData.SaturdayClosing === '' ? '' : moment(formData.SaturdayClosing).format('HH:mm')
      },
      {
        day: 'Sunday',
        openingHours: formData.SundayOpening === '' ? '' : moment(formData.SundayOpening).format('HH:mm'),
        closingHours: formData.SundayClosing === '' ? '' : moment(formData.SundayClosing).format('HH:mm')
      },

    ];

    this.formatOpeningHours = true;

    this.errorsFromHours = [];

    if (skipChecking) {
      console.log('///////////////////////////////////////');
      console.log('podmienka splnena ');
      return hours;
    }


    // eslint-disable-next-line @typescript-eslint/no-shadow
    hours.forEach((value, index) => {

      if (value.openingHours === '' && value.closingHours !== '') {
        this.errorsFromHours.push(value.day + ' Opening hours is empty we got closing');
      } else if (value.openingHours !== '' && value.closingHours === '') {
        this.errorsFromHours.push(value.day + '  Closing hours is empty but we got Opening ');
      }
    });

    return hours;
  }

  resetForm(): void {
    this.contactForm.setValue({
      MondayOpening: '',
      MondayClosing: '',
      TuesdayOpening: '',
      TuesdayClosing: '',
      WednesdayOpening: '',
      WednesdayClosing: '',
      ThursdayOpening: '',
      ThursdayClosing: '',
      FridayOpening: '',
      FridayClosing: '',
      SaturdayOpening: '',
      SaturdayClosing: '',
      SundayOpening: '',
      SundayClosing: '',
      MinutesForMeeting: null
    });
  }




  private transformOpeningHoursDataForForm(calendar: Calendar, useCalendarTimeZone?: boolean): void {

    const todayDay = moment().format('YYYY-MM-DD');

    this.contactForm.setValue({ // todo create function and refactoring

      MondayOpening:
        calendar.week[0]?.openingHours === '' ? '' : todayDay + 'T' + calendar.week[0]?.openingHours + ':00.000' + this.timeZone,
      MondayClosing:
        calendar.week[0]?.closingHours === '' ? '' : todayDay + 'T' + calendar.week[0]?.closingHours + ':00.000' + this.timeZone,
      TuesdayOpening:
        calendar.week[1]?.openingHours === '' ? '' : todayDay + 'T' + calendar.week[1]?.openingHours + ':00.000' + this.timeZone,
      TuesdayClosing:
        calendar.week[1]?.closingHours === '' ? '' : todayDay + 'T' + calendar.week[1]?.closingHours + ':00.000' + this.timeZone,
      WednesdayOpening:
        calendar.week[2]?.openingHours === '' ? '' : todayDay + 'T' + calendar.week[2]?.openingHours + ':00.000' + this.timeZone,
      WednesdayClosing:
        calendar.week[2]?.closingHours === '' ? '' : todayDay + 'T' + calendar.week[2]?.closingHours + ':00.000' + this.timeZone,
      ThursdayOpening:
        calendar.week[3]?.openingHours === '' ? '' : todayDay + 'T' + calendar.week[3]?.openingHours + ':00.000' + this.timeZone,
      ThursdayClosing:
        calendar.week[3]?.closingHours === '' ? '' : todayDay + 'T' + calendar.week[3]?.closingHours + ':00.000' + this.timeZone,
      FridayOpening:
        calendar.week[4]?.openingHours === '' ? '' : todayDay + 'T' + calendar.week[4]?.openingHours + ':00.000' + this.timeZone,
      FridayClosing:
        calendar.week[4]?.closingHours === '' ? '' : todayDay + 'T' + calendar.week[4]?.closingHours + ':00.000' + this.timeZone,
      SaturdayOpening:
        calendar.week[5]?.openingHours === '' ? '' : todayDay + 'T' + calendar.week[5]?.openingHours + ':00.000' + this.timeZone,
      SaturdayClosing:
        calendar.week[5]?.closingHours === '' ? '' : todayDay + 'T' + calendar.week[5]?.closingHours + ':00.000' + this.timeZone,
      SundayOpening:
        calendar.week[6]?.openingHours === '' ? '' : todayDay + 'T' + calendar.week[6]?.openingHours + ':00.000' + this.timeZone,
      SundayClosing:
        calendar.week[6]?.closingHours === '' ? '' : todayDay + 'T' + calendar.week[6]?.closingHours + ':00.000' + this.timeZone,
      // show data for update

      MinutesForMeeting: calendar.timeMeeting == null ? null : calendar.timeMeeting

    });
  }

  private changeFormatTime(time: string, timeZone: string) {
    return time == '' ? '' : '2021-12-20T' + time + ':00.000' + timeZone;
  }


  resetHours(event: any, item: string | number): void {

    const weekData = this.mapOpeningClosingHours(true);
    console.log(weekData);


    // delete line time
    weekData[item].openingHours = '';
    weekData[item].closingHours = '';

    let readyTimeZone = this.timeZone;


    if (this.docIdCalendar !== undefined) {
      readyTimeZone = this.calendar.timeZone; // firebase timeZOne for update
    }

    const changeCalendar: Calendar = {
      idBusiness: this.selectedBusinessId,
      week: weekData,
      timeMeeting: this.contactForm.value.MinutesForMeeting,
      break: 'no break',
      timeZone: readyTimeZone

    };
    // set back to form
    this.transformOpeningHoursDataForForm(changeCalendar);
  }


}
