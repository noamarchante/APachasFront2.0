import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthenticationService} from "@services/authentication.service";
import {NotificationService} from "@modules/notification/services/notification.service";
import {MUser} from "@models/MUser";
import {MEvent} from "@models/MEvent";
import {EventService} from "@services/event.service";
import {UserEventService} from "@services/userEvent.service";
import {ProductService} from "@services/product.service";
import {Router} from "@angular/router";
import {UserUserEventService} from "@services/userUserEvent.service";
import {UserProductService} from "@services/userProduct.service";
import { STATUS } from '@app/components/users/listUsers/listUsers.component';
import { DarkModeService } from '@app/services/darkMode.service';
import { TranslationService } from '@app/modules/translations/translation.service';

@Component({
    selector: 'app-detailEvent',
    templateUrl: './detailEvent.component.html',
    styleUrls: ['./detailEvent.component.css']
})
export class DetailEventComponent implements OnInit {

    @Output()
    eventMessage = new EventEmitter<number>();

    @Output()
    eventDelete = new EventEmitter<boolean>();

    @Output()
    eventDetail = new EventEmitter<number>();

    @Output()
    statusChange = new EventEmitter<string>();


    defaultUserImage: string = "assets/user16.jpg";
    defaultImage: string = "assets/event7.jpg";

    eventPartakers: MUser[] = [];
    eventPartakersStored: MUser[] = [];
    pagePartaker = 0;
    sizePartaker = 6;
    totalPartaker: number=0;
    message: string = this.translationService.translate('event.exit');
    statusMessage: string = "";
    show: boolean = true;

    previousEvent: string="";
    nextEvent: string="";

    _previous: boolean = false;
    _next: boolean = false;
    _event: MEvent = new MEvent();
    _status: string ="";
    messageRequest: boolean;
    close: boolean = false;

    googleCalendarUrl: string = "https://calendar.google.com/calendar/u/0/r/eventedit";
    darkMode = false;

    constructor(private eventService: EventService,
                private productService: ProductService,
                private userEventService: UserEventService,
                private userProductService: UserProductService,
                private userUserEventService: UserUserEventService,
                private authenticationService: AuthenticationService,
                private notificationService: NotificationService,
                private router: Router,
                private darkModeService: DarkModeService,
                private translationService: TranslationService
    ) {
    }

    ngOnInit() {
        this.darkModeService.darkMode$.subscribe((mode) => {
            this.darkMode = mode;
        });
        this.paginationEventClass();
    }

    showDetailsAndProducts(){
        localStorage.setItem("products", JSON.stringify(this.event));
        this.router.navigate(["products"]);
    }

    showTransactions(){
        localStorage.setItem("transactions", JSON.stringify(this.event));
        this.router.navigate(["transactions"]);
    }

    messageValue() {
        this.messageRequest = true;
        if (this.status == this.translationService.translate(STATUS.PENDING)){
            this.message = this.translationService.translate('event.pending');
        }
    }

    showDeleteEvent(){
        this.messageRequest = false;
        if (this.authenticationService.getUser().id == this.event.eventOwner) {
            this.message = this.translationService.translate('event.delete');
        }
    }

    showSetStatus(): boolean{
        if (this.authenticationService.getUser().id != this.event.eventOwner) {
            this.messageValue();
            return true;
        }else{
            return false;
        }
    }

    closeMessage(){
        this.close = true;
        this.message = this.translationService.translate('event.close');
    }

    get previous(){
        return this._previous;
    }

    @Input() set previous( previous: boolean){
        this._previous = previous;
        this.paginationEventClass();
    }

    get status(){
        return this._status;
    }

    @Input() set status( status: string){
        if (status != undefined){
            this._status = status;
            if (status == this.translationService.translate(STATUS.PENDING)){
                this.statusMessage = this.translationService.translate('event.pending.answer');
                this.show = false;
            }else{
                this.statusMessage = this.translationService.translate('event.exit.answer');
                this.show = true;
            }
        }
    }

    get next(){
        return this._next;
    }

    @Input() set next( next: boolean){
        this._next = next;
        this.paginationEventClass();
    }


    get event(){
        return this._event;
    }

    @Input() set event (event: MEvent) {
        if (event != undefined) {
            this._event = event;
            this.partakerReset();
            if (this.event.eventId != null){
                this.getPartakers(this.event.eventId);
                this.getTotalPartakers(this.event.eventId);
                this.addEventGoogleCalendar(this.event);
            }else{
                this._event = new MEvent();
            }
        }
        this.eventPartakers = [];
        this.eventPartakersStored = [];
        this.paginationEventClass();
    }
    

    onDelete($event){
        if($event.valueOf()){
            this.eventService.deleteEvent(this.event.eventId).subscribe(()=>{
                this.eventDelete.emit();
                this.notificationService.success(this.translationService.translate('event.delete.notification.message'), this.translationService.translate('event.delete.notification.title'));
            });
        }
    }

    showButtons(): boolean{
        if (this.event.eventOwner == this.authenticationService.getUser().id){
            return true;
        }else{
            return false;
        }
    }

    showButtonStatus(): boolean{
       if (this.showButtons() && this.status == this.translationService.translate(STATUS.PENDING)){
           return true;
       }else{
           return false;
       }
    }

    closeEvent(){
        this.userEventService.sumTotalEventExpense(this.event.eventId).subscribe((totalEventExpense) =>{
            this.productService.sumTotalProductCost(this.event.eventId).subscribe((totalProductCost) =>{
                if (totalProductCost == totalEventExpense){
                    this.productService.getAllProductsPartakers(this.event.eventId).subscribe((response) => {
                       if (response){
                           this.eventService.editOpen(this.event.eventId, false).subscribe(() => {
                               this.userUserEventService.createUserUserEvent(this.event.eventId).subscribe(()=>{
                                   this.showTransactions();
                               });
                           });
                       }else{
                           this.notificationService.warning('event.close.products.title', 'event.close.products.message');
                       }
                    });
                }else{
                    this.notificationService.warning('event.close.money.title', 'event.close.money.message');
                }
            });
        });
    }

    ownerLabel(userId:number):string{
        let value:string = "";
        if (userId == this.event.eventOwner){
            value = this.translationService.translate('owner');
        }
        return value;
    }

    ownerBorder(userId: number):string{
        if(userId == this.event.eventOwner){
            return "owner";
        }
    }

    setPageEvent(number: number){
        this.eventDetail.emit(number);
    }

    getPartakers(eventId:number){
        this.userEventService.getPageablePartakers(eventId,this.pagePartaker, this.sizePartaker).subscribe((response) => {
            this.eventPartakers.push(...response);
        });
    }

    getTotalPartakers(eventId:number){
        this.userEventService.countPartakers(eventId).subscribe((number)=>{
            this.totalPartaker = number;
        });
    }

    getMorePartakers(){
        this.pagePartaker +=1;
        if (this.eventPartakers.length < this.eventPartakersStored.length){
            this.eventPartakers = this.eventPartakersStored.slice(0,this.sizePartaker*(this.pagePartaker+1));
        }else{
            this.getPartakers(this.event.eventId);
        }
    }

    getLessPartakers(){
        if (this.eventPartakersStored.length != this.totalPartaker){
            this.eventPartakersStored = this.eventPartakers;
            this.eventPartakers = this.eventPartakers.slice(0,this.sizePartaker*this.pagePartaker);
        }else{
            this.eventPartakers = this.eventPartakersStored.slice(0, this.sizePartaker*this.pagePartaker);
        }
        this.pagePartaker -=1;
    }

    partakerReset(){
        this.eventPartakers = [];
        this.eventPartakersStored = [];
        this.pagePartaker = 0;
    }

    private paginationEventClass(){
        if(this._previous && this._next){
            this.previousEvent = "col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-6";
                this.nextEvent = "col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-6";
        }else if (!this._previous && this._next){
            this.previousEvent = "";
            this.nextEvent = "col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12";
        }else if(this._previous && !this._next){
            this.previousEvent = "col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12";
            this.nextEvent = "";
        }else{
            this.previousEvent = "";
            this.nextEvent = "";
        }
    }


    onRequest($event){
        if (this.close && $event.valueOf()){
            this.closeEvent();
            this.close = false;
        }else{
            if (this.messageRequest){
                this.setStatus($event);
                this.eventMessage.emit();
            }else if (!this.messageRequest) {
                this.onDelete($event);
            }
        }
    }

    setStatus($event){
        if ($event.valueOf() && this.status == this.translationService.translate(STATUS.PENDING)){
            this.statusChange.emit(this.translationService.translate(STATUS.FOLLOW));
            this.userEventService.editStatus(this.event.eventId, this.authenticationService.getUser().id).subscribe();
        }else{
            this.userEventService.deleteUserEvent(this.event.eventId, this.authenticationService.getUser().id).subscribe();
        }
    }


    addEventGoogleCalendar(event: MEvent){
        if(event){
            let startDate: string = this.event.eventStart?.replace(new RegExp(' ', 'g'), 'T')?.replace(new RegExp(':', 'g'), '')?.replace(new RegExp('-', 'g'), '');
            let endDate: string = this.event.eventEnd?.replace(new RegExp(' ', 'g'), 'T')?.replace(new RegExp(':', 'g'), '')?.replace(new RegExp('-', 'g'), '');
            let date: string = startDate?.substring(0,9) + (parseInt(startDate?.substring(9))+20000)?.toString() + "/" + endDate?.substring(0,9) + (parseInt(endDate?.substring(9))+20000)?.toString();
            let title: string = this.event.eventName?.replace(new RegExp(' ', 'g'), '+');
            let location: string = this.event.eventLocation?.replace(new RegExp(' ', 'g'), '+');
            let description: string = this.event.eventDescription?.replace(new RegExp(' ', 'g'), '+');
            this.googleCalendarUrl = "https://calendar.google.com/calendar/u/0/r/eventedit?text=" + title + "&dates=" + date + "&details=" + description + "&location=" + location + "&sf=true&output=xml";
        }
    }
}