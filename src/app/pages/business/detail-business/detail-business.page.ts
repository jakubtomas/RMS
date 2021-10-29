import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
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
                private router: Router) {
    }


    ngOnInit() {
        console.log(this.route.snapshot.paramMap.get('businessId'));

        this.route.params.subscribe((params: Params) => {
            /*console.log('Parameter  ' + JSON.stringify(params));
            console.log('daj my sem ten paramreter  ' + params['businessId']);
*/
            if (params['businessId'] != '') {
                this.getOneBusiness(params['businessId']);
            }
        });

    }

    getOneBusiness(documentID: string) {
        this.businessService.getOneBusiness(documentID).subscribe((business) => {
            this.business = business;
           // this.businessService.setBusiness$(business);
        });
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
