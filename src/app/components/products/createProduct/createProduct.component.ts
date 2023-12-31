import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {NotificationService} from "@modules/notification/services/notification.service";
import {MProduct} from "@models/MProduct";
import {ProductService} from "@services/product.service";
import {UserProductService} from "@services/userProduct.service";
import {AuthenticationService} from "@services/authentication.service";
import { DarkModeService } from '@app/services/darkMode.service';
import { TranslationService } from '@app/modules/translations/translation.service';

@Component({
    selector: 'app-createProduct',
    templateUrl: './createProduct.component.html',
    styleUrls: ['./createProduct.component.css']
})
export class CreateProductComponent implements OnInit {

    defaultImage = "assets/product3.jpg";
    imageFormat: boolean;
    imageColor:string="";
    imageText: string;
    title: string = this.translationService.translate('product.create');
    _product: MProduct;
    _eventId: number;
    @Output()
    eventSave = new EventEmitter<boolean>();
    public productPurchaseDate;

    darkMode = false;

    public options: any = {
        autoApply: false,
        alwaysShowCalendars: true,
        applyButtonClasses: "btn-primary applyDate",
        buttonClasses: "btn btn-sm",
        cancelClass: "btn-default cancelDate",
        drops: "up",
        locale: {
            format: 'DD/MM/yyyy',
            "firstDay": 1,
            daysOfWeek: [
                this.translationService.translate('calendar.week.sunday'),
                this.translationService.translate('calendar.week.monday'),
                this.translationService.translate('calendar.week.tusday'),
                this.translationService.translate('calendar.week.wednesday'),
                this.translationService.translate('calendar.week.thursday'),
                this.translationService.translate('calendar.week.friday'),
                this.translationService.translate('calendar.week.saturday')
            ],
            monthNames: [
                this.translationService.translate('calendar.month.january'),
                this.translationService.translate('calendar.month.february'),
                this.translationService.translate('calendar.month.march'),
                this.translationService.translate('calendar.month.april'),
                this.translationService.translate('calendar.month.may'),
                this.translationService.translate('calendar.month.june'),
                this.translationService.translate('calendar.month.july'),
                this.translationService.translate('calendar.month.august'),
                this.translationService.translate('calendar.month.september'),
                this.translationService.translate('calendar.month.october'),
                this.translationService.translate('calendar.month.november'),
                this.translationService.translate('calendar.month.december')
            ]
        },
        minDate: undefined,
        maxDate: new Date(),
        opens: 'left',
        showDropdowns: true,
        timePicker: false,
        singleDatePicker: true
    };

    constructor(private productService: ProductService,
                private sanitizer: DomSanitizer,
                private notificationService: NotificationService,
                private userProductService: UserProductService,
                private authenticationService: AuthenticationService,
                private darkModeService: DarkModeService,
                private translationService: TranslationService
    ) {
    }

    ngOnInit() {
        this.darkModeService.darkMode$.subscribe((mode) => {
            this.darkMode = mode;
        });
    }

    get product(){
        return this._product;
    }

    @Input() set product(product: MProduct){
        if (product.productId != undefined){
            this._product = product;
            this.productPurchaseDate = this.product.productPurchaseDate;
            this.title = this.translationService.translate('product.edit');
        }else{
            this._product = new MProduct();
            this.title = this.translationService.translate('product.create');
            this.productPurchaseDate = null;
        }
    }

    get eventId(){
        return this._eventId;
    }

    @Input() set eventId(eventId: number){
        if (eventId!= undefined){
            this._eventId = eventId;
        }else{
            this._eventId = 0;
        }
    }

    public applyDate(): void {
        this.product.productPurchaseDate = new Date(this.productPurchaseDate.valueOf()).toJSON().replace("T", " ").replace("Z", "");
    }

    public selectedDate(value: any): void {
        this.productPurchaseDate = new Date(value.start);
    }

    public cancelDate(): void {
        this.productPurchaseDate = undefined;
    }

    onSubmit(){
        if (this.product.productId != undefined){
            this.onEdit();
        }else{
            this.onCreate();
        }
    }

    onCreate() {
        this.product.eventId = this.eventId;
        this.productService.createProduct(this.product).subscribe((response) => {
            this.eventSave.emit();
            this.closeModal();
            document.getElementById("closeProductButton").click();
            this.notificationService.success(this.translationService.translate('product.create.message'), this.translationService.translate('product.create.title'));
        });
    }

    onEdit(){
        this.productService.editProduct(this.product).subscribe(() => {
            this.userProductService.getUserProduct(this.product.productId, this.authenticationService.getUser().id).subscribe((response)=>{
                    if (response.productId != 0){
                        this.userProductService.editUserProduct(this.product.productId, this.authenticationService.getUser().id).subscribe();
                    }else{
                        this.userProductService.createUserProduct(this.product.productId, this.authenticationService.getUser().id).subscribe();
                    }
                });
            this.eventSave.emit();
            this.closeModal();
            document.getElementById("closeProductButton").click();
            this.notificationService.success(this.translationService.translate('product.edit.message'), this.translationService.translate('product.edit.title') );
        });
    }

    getImage(event): any {
        const file = event.target.files[0];
        if (this.imageFormatTest(file)){
            this.getBase64(file).then((image: any) => {
                this.product.productPhoto = image.base;
            });
            this.imageFormat = true;
        }else{
            this.imageFormat = false;
        }
    }

    closeModal(){
        this.product = new MProduct();
        this.imageFormat = null;
    }

    changeStyle($event){
        if ($event.type == "mouseover"){
            this.imageColor = "imageColor";
            this.imageText = "imageText";
        }else{
            this.imageColor = "";
            this.imageText= "";
        }
    }

    private imageFormatTest(file:any): boolean{
        if(file.type.toString() == "image/jpeg" || file.type.toString() == "image/png"){
            return true;
        }
        return false;
    }

    private getBase64 = async ($event: any) => new Promise((resolve, reject) => {
        try {
            const unsafeImg = window.URL.createObjectURL($event);
            const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
            const reader = new FileReader();
            reader.readAsDataURL($event);

            reader.onload = () => {
                resolve({
                    blob: $event,
                    image,
                    base: reader.result
                });
            };
            reader.onerror = error => {
                resolve({
                    blob: $event.blob,
                    image,
                    base: null
                });
            };
        } catch (e) {
            return null;
        }
    });
}