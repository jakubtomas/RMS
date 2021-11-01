import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {catchError} from 'rxjs/operators';
import {BusinessService} from "../../../services/business.service";
import {Business} from "../../../interfaces/business";
import {AlertController} from '@ionic/angular';
import {async} from 'rxjs';
import {errorObject} from "rxjs/internal-compatibility";

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
        private router: Router,
        public alertController: AlertController) {
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
                this.messageFirebase = "Business successfully updated"
            }


        });

    }


    getOneBusiness(documentID: string) {
        this.businessService.getOneBusiness(documentID).subscribe((business) => {
                console.log("get one business");
                console.log("---------------------");
                console.log(business);

                this.business = business;


            }, error => {
                console.log(error);
            }
        );
    }

    editBusiness() {
        console.log("clikc edit busines " + this.selectedBusinessId);
        //todo potrebne odchyteni id business najlepsie asi ulozit do services
        this.router.navigate(['/register-business', {businessId: this.selectedBusinessId}])

    }


    async showAlert() {
        console.log('delete business');

        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Confirm Deletion',
            animated: true,
            backdropDismiss:true,
            message: 'Are you sure you want to permanently remove this item?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {}
                }, {
                    text: 'Yes',
                    handler: () => {
                        console.log('Confirm Okay');
                        this.deleteBusiness();
                    }
                }
            ]
        });

        await alert.present();
    }

    deleteBusiness():void {
        this.businessService.deleteBusiness(this.selectedBusinessId).then(() => {
            //redirect
            this.router.navigate(['/list-business', {deletedBusiness: true}]);
            this.business = null;
            this.selectedBusinessId = null;


        }).catch((error) => {
            console.log("error you got error ");
            console.log(error);

            this.messageFirebase = "Something is wrong";
        });

    }


    createCalendar() {
        console.log("create calendar ");

        //todo odchytenie id business
        this.router.navigate(['/create-calendar']);

    }


}
