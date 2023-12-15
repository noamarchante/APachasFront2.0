import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { DarkModeService } from '@app/services/darkMode.service';

@Component({
    selector: 'app-messageConfirm',
    templateUrl: './messageConfirm.component.html',
    styleUrls: ['./messageConfirm.component.css']
})
export class MessageConfirmComponent implements OnInit {

    @Output()
    eventMessageConfirm = new EventEmitter<boolean>();

    _message: string = "";
    darkMode = false;

    constructor(private darkModeService: DarkModeService) {
    }

    ngOnInit() {
        this.darkModeService.darkMode$.subscribe((mode) => {
            this.darkMode = mode;
        });
    }

    get message(){
        return this._message;
    }

    @Input() set message(message: string){
        if (message!= undefined){
            this._message = message;
        }
    }

    onConfirm(value: boolean){
        this.eventMessageConfirm.emit(value);
    }
}