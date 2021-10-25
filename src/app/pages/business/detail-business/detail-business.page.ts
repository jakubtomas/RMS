import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {catchError} from 'rxjs/operators';
import {BusinessService} from "../../../services/business.service";
import {Business} from "../../../interfaces/business";

@Component({
  selector: 'app-detail-business',
  templateUrl: './detail-business.page.html',
  styleUrls: ['./detail-business.page.scss'],
})
export class DetailBusinessPage implements OnInit {
  messageFirebase: string;
  business: Business;

  constructor(private route: ActivatedRoute,
              private businessService: BusinessService,
              private router: Router) { }

              
              
  ngOnInit() {
    console.log(this.route.snapshot.paramMap.get('businessId'));
    
    if (this.route.snapshot.paramMap.get('businessId') ) {
      const bussinesId = this.route.snapshot.paramMap.get('businessId');
      //this.messageFirebase = 'Business successfully created'
      
      //create the subscribe from businees service
      this.businessService.getBusinessObservable(bussinesId).subscribe((value:Business) => {
        console.log(" dostal som hodnotu");
          console.log(value);
        this.business = value;
      })
    }
  }

  editBusiness() {
    console.log("clikc hello ");
    //todo potrebne odchyteni id business najlepsie asi ulozit do services
    this.router.navigate(['/register-business', {updateBusiness: true}]);
  }

  deleteBusiness() {
    console.log("click delete nudinsadfasd");
    ///create-calendar
  }

  createCalendar() {
    console.log("create calendar ");

    //todo odchytenie id business
    this.router.navigate(['/create-calendar']);

  }


}
