import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../services/auth.service";
import {BusinessService} from "../../../services/business.service";
import {Business} from "../../../interfaces/business";

interface Item {
    id?: string;
    name?: string;
    age?: number;
}

@Component({
    selector: 'app-list-business',
    templateUrl: './list-business.page.html',
    styleUrls: ['./list-business.page.scss'],
})
export class ListBusinessPage implements OnInit {

    items: Item[];
    businesses: Business[];
    messageFirebase: string;

    constructor(private route: ActivatedRoute,
                private businessService: BusinessService,
                private router: Router) {
    }

    ngOnInit() {
        this.getAllBusinesses();

        //when we go again this page ionic maybe have function
        // vyriesit problem tu je ze tato funkcia sa nezavola vzdy ked sa prekliknem na tuto page
        //pretoze si uklada info b stranke
        this.messageFirebase = null;


        if (this.route.snapshot.paramMap.get('createdBusiness')) {
            this.messageFirebase = 'Business successfully created'
        }

        if (this.messageFirebase === 'Business successfully created') {

        }
    }
    //todo is essential thing set messagefirbase to null in another function which we call


    getItems() {
        this.businessService.getItems().subscribe(value => {
            console.log(value);
            this.items = value;
        })
    }

    getAllBusinesses() { ///todo osetrit error
        this.businessService.getAllBusinesses().subscribe(value=> {
            console.log(value);
            this.businesses = value;

        } )
    }

    chooseBusiness(business: Business) {
        console.log("call the function");
        
        console.log('business is  ' + business.nameOrganization);

        if (business.id !== null) {
            //also send value that iam from list of businesses
            //send also the id
            this.router.navigate(['/detail-business', {businessId: business.id}])
        }
    }


}
