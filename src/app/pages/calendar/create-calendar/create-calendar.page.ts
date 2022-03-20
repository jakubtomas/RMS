/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { CalendarService } from '../../../services/calendar.service';
//import { ToastController } from 'ionic-angular';
import { Calendar } from '../../../interfaces/calendar';
import { ToastController } from '@ionic/angular';


import { Day } from '../../../interfaces/day';
import * as moment from 'moment';
import { TimeMeeting } from '../../../interfaces/timeMeeting';
import { MeetingService } from '../../../services/meeting.service';
import { BusinessService } from 'src/app/services/business.service';

// import * as moment from 'moment';

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


  //data for component
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


      MinutesForMeeting: new FormControl('', Validators.required),

    });

  constructor(private route: ActivatedRoute,
    private calendarService: CalendarService,
    private meetingService: MeetingService,
    private toastCtrl: ToastController,
    private router: Router,
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

        //this.getCountOfMeetingsForBusiness(params.businessId, this.todayDate);
        this.isUpdateCalendar = true;
      } else {
        this.isUpdateCalendar = false;
        console.log('We are creating calendar ');
      }
      this.setValuesForPage();
    });
  }
  ionViewWillEnter(): void {
    //  this.messageFirebase = null;
  }

  // getCountOfMeetingsForBusiness(idBusiness: string, dateForCalendar: string) {
  //   this.meetingService.getMeetingsByIdBusinessByDate(idBusiness, dateForCalendar)
  //     .subscribe((value) => {
  //       console.log('vsetky meeting od dnesneho dna');
  //       console.log(value);
  //     });
  // }

  setValuesForPage(): void {
    if (this.isUpdateCalendar) {
      this.ionTitle = 'Update opening hours';
      this.ionButton = 'Update';
    } else {
      this.ionTitle = 'Create opening hours';
      this.ionButton = 'Create';
    }
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

  controlBusinessPermission(businessId: string, docCalendarId: string): void {

    this.businessService.getBusinessPermission(businessId).subscribe((permissions) => {
      const myId = localStorage.getItem('idUser');
      if (permissions.idUser === myId) {
        // this.isThisMyBusiness = true;
        this.getOneCalendar(docCalendarId);
        //   this.showToast('Yeee this is your business ');

      } else {
        // this.showToast('Something is wrong');
        this.router.navigate(['/dashboard']);
      }

    }, error => {
      console.error(error);
    });
  }


  saveData(): void {
    console.log(moment().format());
    console.log(' calendar');
    console.log(this.contactForm.value);
    console.log(this.contactForm.value.MondayOpening);
    console.log(this.contactForm.value.ClosingOpening);

    //todo logaritmus  count all opening , closing Hours
    // porovnanie can not be empty opening and also closing if yes show error message

    console.log(this.contactForm.value.MinutesForMeeting);
    console.log(this.MinutesForMeeting);

    const calendar: Calendar = {
      idBusiness: this.selectedBusinessId,
      timeMeeting: this.contactForm.value.MinutesForMeeting,
      week: this.mapOpeningClosingHours(),
      break: 'hello',
      timeZone: this.timeZone

    };

    //todo pri nacitany stranky create meeting s calendarom
    // ked nemam otvaracie hodiny show message lebo inak error in console

    // todo prestavky niesu nastavene
    // todo typovanie v interface
    // todo add Timezone , and change interface
    console.log('save datat');
    console.log(JSON.stringify(calendar));

    if (this.errorsFromHours.length === 0) {// when we do not have errors

      console.log('this data I am saving ');
      console.log(calendar);


      this.calendarService.addCalendar(calendar).then(() => {
        this.showToast('Calendar successfully created');
        this.router.navigate(['/detail-business'],
          { queryParams: { businessId: this.selectedBusinessId } });

      }).catch((error) => {
        console.log('error');
        console.log(error);
        this.showToast('Something is wrong');
      });
    }
  }

  updateCalendars(): void {

    console.log('click update calendars ');
    console.log(moment().format());


    const updateCalendar: Calendar = {
      idBusiness: this.calendar.idBusiness,
      week: this.mapOpeningClosingHours(),
      timeMeeting: this.contactForm.value.MinutesForMeeting,
      break: 'no break',
      timeZone: this.timeZone

    };

    if (this.errorsFromHours.length === 0) {
      console.log(' data for update ');
      console.log(updateCalendar);

      this.calendarService.updateCalendar(this.docIdCalendar, updateCalendar).then(() => {

        this.router.navigate(['/detail-business'], { queryParams: { businessId: updateCalendar.idBusiness } });
        this.showToast('Calendar has been updated');

      }).catch((error) => {
        console.log('error you got error ');
        console.log(error);
      });
    }
  }

  private mapOpeningClosingHours(): Day[] {
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

    // if (!this.formatOpeningHours) {
    //   return
    // }

    // ternarny operator closingHours: (moment(item.closingHours).format('LT') == 'Invalid date') ? '---' : moment(item.closingHours).format('LT')
    const hours = [
      {
        day: 'Monday', // todo create ternar operater if formData.MondayOpening is empty string use '' else use
        //todo moment(formData.MondayOpening).format('HH:mm')
        openingHours: formData.MondayOpening == '' ? '' : moment(formData.MondayOpening).format('HH:mm'),
        closingHours: formData.MondayClosing == '' ? '' : moment(formData.MondayClosing).format('HH:mm')
      },
      {
        day: 'Tuesday',
        openingHours: formData.TuesdayOpening == '' ? '' : moment(formData.TuesdayOpening).format('HH:mm'),
        closingHours: formData.TuesdayClosing == '' ? '' : moment(formData.TuesdayClosing).format('HH:mm')
      },
      {
        day: 'Wednesday',
        openingHours: formData.WednesdayOpening == '' ? '' : moment(formData.WednesdayOpening).format('HH:mm'),
        closingHours: formData.WednesdayClosing == '' ? '' : moment(formData.WednesdayClosing).format('HH:mm')
      },
      {
        day: 'Thursday',
        openingHours: formData.ThursdayOpening == '' ? '' : moment(formData.ThursdayOpening).format('HH:mm'),
        closingHours: formData.ThursdayClosing == '' ? '' : moment(formData.ThursdayClosing).format('HH:mm')
      },
      {
        day: 'Friday',
        openingHours: formData.FridayOpening == '' ? '' : moment(formData.FridayOpening).format('HH:mm'),
        closingHours: formData.FridayClosing == '' ? '' : moment(formData.FridayClosing).format('HH:mm')
      },
      {
        day: 'Saturday',
        openingHours: formData.SaturdayOpening == '' ? '' : moment(formData.SaturdayOpening).format('HH:mm'),
        closingHours: formData.SaturdayClosing == '' ? '' : moment(formData.SaturdayClosing).format('HH:mm')
      },
      {
        day: 'Sunday',
        openingHours: formData.SundayOpening == '' ? '' : moment(formData.SundayOpening).format('HH:mm'),
        closingHours: formData.SundayClosing == '' ? '' : moment(formData.SundayClosing).format('HH:mm')
      },

    ];

    this.formatOpeningHours = true;
    // todo function which control result of opening and closing and check that is minus value ,
    // otvaranie nieje skor ako zatvaranie a nieje to nahodou malo casu
    console.log('///////////////////////////////////////');
    console.log(hours[0].openingHours);
    console.log(hours[0].closingHours);
    console.log(hours[1].openingHours);
    console.log(hours[1].closingHours);
    console.log('///////////////////////////////////////');
    console.log('po uprave ');
    console.log(hours);


    // const hours = [
    //     {day: "Monday", openingHours: moment(formData.MondayOpening).format('HH:mm'), closingHours: moment(formData.MondayClosing).format(('HH:mm'))},
    //     {day: "Tuesday", openingHours: moment(formData.TuesdayOpening).format('HH:mm'), closingHours: moment(formData.TuesdayClosing).format(('HH:mm'))},
    //     {day: "Wednesday", openingHours: moment(formData.WednesdayOpening).format('HH:mm'), closingHours: moment(formData.WednesdayClosing).format(('HH:mm'))},
    //     {day: "Thursday", openingHours: moment(formData.ThursdayOpening).format('HH:mm'), closingHours: moment(formData.ThursdayClosing).format(('HH:mm'))},
    //     {day: "Friday", openingHours: moment(formData.FridayOpening).format('HH:mm'), closingHours: moment(formData.FridayClosing).format(('HH:mm'))},
    //     {day: "Saturday", openingHours: moment(formData.SaturdayOpening).format('HH:mm'), closingHours: moment(formData.SaturdayClosing).format(('HH:mm'))},
    //     {day: "Sunday", openingHours: moment(formData.SundayOpening).format('HH:mm'), closingHours: moment(formData.SundayClosing).format('HH:mm')},
    //
    // ];


    this.errorsFromHours = [];
    // check hours

    //todo tento kod sa ma vykonat iba ked robim update alebo delete
    // eslint-disable-next-line @typescript-eslint/no-shadow
    hours.forEach((value, index) => {
      console.log('-----------------------');
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


  getOneCalendar(docCalendarId: string): void {

    this.calendarService.getOneCalendar(docCalendarId).subscribe(calendar => {


      const basicTime = '10:25';
      // const newTime2 = moment('Mon 03-Jul-2017, ' + basicTime, 'ddd DD-MMM-YYYY, hh:mm ');

      // const attemptValue =
      this.calendar = calendar;

      // console.log('your data from Firestore ');
      // console.log(calendar);
      // console.log(calendar.timeMeeting);
      // console.log(' show me this album ');

      // console.log(calendar.week[0]?.openingHours);
      // console.log(calendar.week[1]?.openingHours);

      const defaultInterval = '15';

      const open = calendar.week[0]?.openingHours;
      const close = calendar.week[0]?.closingHours;

      const openTime = moment(open, 'HH:mm');
      // console.log('default openTime ' + openTime.format('HH:mm'));
      openTime.add('10', 'minutes');
      //  console.log('after change  ' + openTime.format('HH:mm'));

      const realEnd = moment(close, 'HH:mm');

      let isCalculate = true;
      let starts = moment(open, 'HH:mm');
      const ends = moment(open, 'HH:mm');
      this.timeMeeting = [];

      while (isCalculate) {

        ends.add('15', 'minutes');

        if (ends <= realEnd) {

          this.timeMeeting.push(
            { start: starts.format('HH:mm'), end: ends.format('HH:mm') }
          );
          starts = moment(ends);
        } else {
          isCalculate = false;
        }

      }

      this.transformOpeningHoursDataForForm(calendar);
      // todo I am saving time zone in last value of string
      // const time = "2021-12-20T" + basicTime + ':56.702+01:00';

      // this.contactForm.setValue({ // todo create function and refactoring
      //   MondayOpening: calendar.week[0]?.openingHours == '' ? '' : '2021-12-20T' + calendar.week[0]?.openingHours + ':00.000' + this.calendar.timeZone,
      //   MondayClosing: calendar.week[0]?.closingHours == '' ? '' : '2021-12-20T' + calendar.week[0]?.closingHours + ':00.000' + this.calendar.timeZone,
      //   TuesdayOpening: calendar.week[1]?.openingHours == '' ? '' : '2021-12-20T' + calendar.week[1]?.openingHours + ':00.000' + this.calendar.timeZone,
      //   TuesdayClosing: calendar.week[1]?.closingHours == '' ? '' : '2021-12-20T' + calendar.week[1]?.closingHours + ':00.000' + this.calendar.timeZone,
      //   WednesdayOpening: calendar.week[2]?.openingHours == '' ? '' : '2021-12-20T' + calendar.week[2]?.openingHours + ':00.000' + this.calendar.timeZone,
      //   WednesdayClosing: calendar.week[2]?.closingHours == '' ? '' : '2021-12-20T' + calendar.week[2]?.closingHours + ':00.000' + this.calendar.timeZone,
      //   ThursdayOpening: calendar.week[3]?.openingHours == '' ? '' : '2021-12-20T' + calendar.week[3]?.openingHours + ':00.000' + this.calendar.timeZone,
      //   ThursdayClosing: calendar.week[3]?.closingHours == '' ? '' : '2021-12-20T' + calendar.week[3]?.closingHours + ':00.000' + this.calendar.timeZone,
      //   FridayOpening: calendar.week[4]?.openingHours == '' ? '' : '2021-12-20T' + calendar.week[4]?.openingHours + ':00.000' + this.calendar.timeZone,
      //   FridayClosing: calendar.week[4]?.closingHours == '' ? '' : '2021-12-20T' + calendar.week[4]?.closingHours + ':00.000' + this.calendar.timeZone,
      //   SaturdayOpening: calendar.week[5]?.openingHours == '' ? '' : '2021-12-20T' + calendar.week[5]?.openingHours + ':00.000' + this.calendar.timeZone,
      //   SaturdayClosing: calendar.week[5]?.closingHours == '' ? '' : '2021-12-20T' + calendar.week[5]?.closingHours + ':00.000' + this.calendar.timeZone,
      //   SundayOpening: calendar.week[6]?.openingHours == '' ? '' : '2021-12-20T' + calendar.week[6]?.openingHours + ':00.000' + this.calendar.timeZone,
      //   SundayClosing: calendar.week[6]?.closingHours == '' ? '' : '2021-12-20T' + calendar.week[6]?.closingHours + ':00.000' + this.calendar.timeZone,
      //   // show data for update

      //   MinutesForMeeting: calendar.timeMeeting == null ? null : calendar.timeMeeting

      // });

    }, error => {
      console.log('you got error ');
      console.log(error);
    });
  }

  private transformOpeningHoursDataForForm(calendar: Calendar): void {

    console.log('transformOpeningHours');
    console.log(calendar);
    console.log(calendar.week);
    console.log(calendar.week[0]?.openingHours);
    console.log(calendar.week[0]?.openingHours);
    console.log('-----------------------');
    console.log(calendar);
    console.log('-----------------------');

    this.contactForm.setValue({ // todo create function and refactoring
      MondayOpening:
        calendar.week[0]?.openingHours == '' ? '' : '2021-12-20T' + calendar.week[0]?.openingHours + ':00.000' + this.calendar.timeZone,
      MondayClosing:
        calendar.week[0]?.closingHours == '' ? '' : '2021-12-20T' + calendar.week[0]?.closingHours + ':00.000' + this.calendar.timeZone,
      TuesdayOpening:
        calendar.week[1]?.openingHours == '' ? '' : '2021-12-20T' + calendar.week[1]?.openingHours + ':00.000' + this.calendar.timeZone,
      TuesdayClosing:
        calendar.week[1]?.closingHours == '' ? '' : '2021-12-20T' + calendar.week[1]?.closingHours + ':00.000' + this.calendar.timeZone,
      WednesdayOpening:
        calendar.week[2]?.openingHours == '' ? '' : '2021-12-20T' + calendar.week[2]?.openingHours + ':00.000' + this.calendar.timeZone,
      WednesdayClosing:
        calendar.week[2]?.closingHours == '' ? '' : '2021-12-20T' + calendar.week[2]?.closingHours + ':00.000' + this.calendar.timeZone,
      ThursdayOpening:
        calendar.week[3]?.openingHours == '' ? '' : '2021-12-20T' + calendar.week[3]?.openingHours + ':00.000' + this.calendar.timeZone,
      ThursdayClosing:
        calendar.week[3]?.closingHours == '' ? '' : '2021-12-20T' + calendar.week[3]?.closingHours + ':00.000' + this.calendar.timeZone,
      FridayOpening:
        calendar.week[4]?.openingHours == '' ? '' : '2021-12-20T' + calendar.week[4]?.openingHours + ':00.000' + this.calendar.timeZone,
      FridayClosing:
        calendar.week[4]?.closingHours == '' ? '' : '2021-12-20T' + calendar.week[4]?.closingHours + ':00.000' + this.calendar.timeZone,
      SaturdayOpening:
        calendar.week[5]?.openingHours == '' ? '' : '2021-12-20T' + calendar.week[5]?.openingHours + ':00.000' + this.calendar.timeZone,
      SaturdayClosing:
        calendar.week[5]?.closingHours == '' ? '' : '2021-12-20T' + calendar.week[5]?.closingHours + ':00.000' + this.calendar.timeZone,
      SundayOpening:
        calendar.week[6]?.openingHours == '' ? '' : '2021-12-20T' + calendar.week[6]?.openingHours + ':00.000' + this.calendar.timeZone,
      SundayClosing:
        calendar.week[6]?.closingHours == '' ? '' : '2021-12-20T' + calendar.week[6]?.closingHours + ':00.000' + this.calendar.timeZone,
      // show data for update

      MinutesForMeeting: calendar.timeMeeting == null ? null : calendar.timeMeeting

    });
  }

  private changeFormatTime(time: string, timeZone: string) {
    return time == '' ? '' : '2021-12-20T' + time + ':00.000' + timeZone;

  }


  resetHours(event: any, item: string | number): void {

    console.log(event);
    console.log('------');
    console.log(item);
    console.log('------');

    /// namapujem vsetky hodnoty
    const weekData = this.mapOpeningClosingHours();
    console.log(weekData);


    // delete line time
    weekData[item].openingHours = '';
    weekData[item].closingHours = '';

    console.log('po upravou');
    console.log('po upravou');
    console.log(weekData);

    const changeCalendar: Calendar = {
      idBusiness: '44',
      week: weekData,
      //timeMeeting: this.contactForm.value.MinutesForMeeting,
      timeMeeting: 15,
      break: 'no break',
      timeZone: this.timeZone

    };

    // idBusiness: this.calendar.idBusiness,
    //   week: this.mapOpeningClosingHours(),
    //     timeMeeting: this.contactForm.value.MinutesForMeeting,
    //   break: 'no break',
    //   timeZone: this.timeZone


    console.log('-----');
    console.log(changeCalendar);
    console.log('-----');
    console.log(changeCalendar.week);
    console.log('dosiel som tu ');
    // set back to form
    this.transformOpeningHoursDataForForm(changeCalendar);
    console.log('nastavil som ');






    // this.contactForm.setValue({
    //   MondayOpening: weekData[0]?.openingHours,
    //   MondayClosing: weekData[0]?.closingHours,
    //   TuesdayOpening: weekData[1]?.openingHours,
    //   TuesdayClosing: weekData[1]?.closingHours,
    //   WednesdayOpening: weekData[2]?.openingHours,
    //   WednesdayClosing: weekData[2]?.closingHours,
    //   ThursdayOpening: weekData[3]?.openingHours,
    //   ThursdayClosing: weekData[3]?.closingHours,
    //   FridayOpening: weekData[4]?.openingHours,
    //   FridayClosing: weekData[4]?.closingHours,
    //   SaturdayOpening: weekData[5]?.openingHours,
    //   SaturdayClosing: weekData[5]?.closingHours,
    //   SundayOpening: weekData[6]?.openingHours,
    //   SundayClosing: weekData[6]?.closingHours,
    //   MinutesForMeeting: this.contactForm.value.MinutesForMeeting
    // });



    // pridat podmienku ze bol minimalne raz upravovany
    // pri ulozeny a update vynulovat danu hodnotu
  }


}
