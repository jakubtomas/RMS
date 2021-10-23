import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../../../services/auth.service";
import {BusinessService} from "../../../services/business.service";

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
    messageFirebase: string;

    constructor(private route: ActivatedRoute,
                private businessService: BusinessService) {
    }

    ngOnInit() {
        //todo is essential thing set messagefirbase to null in another function which we call
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


    getItems() {
        this.businessService.getItems().subscribe(value => {
            console.log(value);
            this.items = value;
        })
    }

    chooseItem(input: Item) {
        console.log("call the function");
        
        console.log('input is  ' + input.name);

    }


}
