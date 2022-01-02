import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {BusinessService} from "../../../services/business.service";
import {Business} from "../../../interfaces/business";

@Component({
    selector: 'app-detail-meeting',
    templateUrl: './detail-meeting.page.html',
    styleUrls: ['./detail-meeting.page.scss'],
})
export class DetailMeetingPage implements OnInit ,OnDestroy{
    business: Business;
    subscription;

    constructor(private route: ActivatedRoute,
        private businessService: BusinessService) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe((params: Params) => {

            if (params['docIdMeeting'] != undefined) {
                console.log('we have detailBusiness');
                console.log(params['docIdMeeting'] +'   ' + params['idBusiness'] );

            }

            if (params['idBusiness']) {
                this.getOneBusiness(params['idBusiness'])
            }
        });
    }


    getOneBusiness(documentID: string): void {
        // todo osetrit ked nenajde business
        this.subscription = this.businessService.getOneBusiness(documentID).subscribe((business) => {
                this.business = business;
                console.log(business);
                
            }, error => {
                console.log(error);
            }
        );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe()
    }

}
