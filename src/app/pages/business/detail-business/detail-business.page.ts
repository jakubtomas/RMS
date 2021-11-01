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
    selectedBusinessId: string;

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
            if (params['businessId'] != undefined) {
                this.selectedBusinessId = params['businessId'];
                this.getOneBusiness(params['businessId']);

            }
            if (params["updateDone"]) {
                this.messageFirebase= "Business successfully updated"
            }



        });

    }


    getOneBusiness(documentID: string) {
        this.businessService.getOneBusiness(documentID).subscribe((business) => {
                console.log("get one business");
                console.log("---------------------");
                console.log(business);

                console.log("---------------------");

                this.business = business;
                this.business.id = this.selectedBusinessId;

                // this.businessService.setBusiness$(business);
            }, error => {
                console.log(error);
            }
        );
    }

    editBusiness() {
        console.log("clikc edit busines " + this.business.id);
        //todo potrebne odchyteni id business najlepsie asi ulozit do services
        this.router.navigate(['/register-business', {businessId: this.business.id}])

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
