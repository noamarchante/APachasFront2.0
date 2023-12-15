import {ErrorHandler, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {AppComponent} from '@app/app.component';
import {AppRoutingModule} from '@app/app-routing.module';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {NotificationModule} from '@modules/notification/notification.module';
import {SimpleNotificationsModule} from 'angular2-notifications';
import {ErrorNotificationHandler} from '@modules/notification/handlers/error-notification.handler';
import {LoginComponent} from '@app/components/authUser/login/login/login.component';
import {AuthenticationInterceptor} from '@helpers/authentication.interceptor';
import {HomeComponent} from '@app/components/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {RegisterComponent} from "@app/components/authUser/register/register.component";
import {ListUsersComponent} from "@app/components/users/listUsers/listUsers.component";
import {CreateGroupComponent} from "@app/components/groups/createGroup/createGroup.component";
import {ListGroupsComponent} from "@app/components/groups/listGroups/listGroups.component";
import { NgSelectModule } from '@ng-select/ng-select';
import {DetailGroupComponent} from "@app/components/groups/detailGroup/detailGroup.component";
import {DetailUserComponent} from "@app/components/users/detailUser/detailUser.component";
import {MessageConfirmComponent} from "@app/components/confirm/messageConfirm.component";
import {ListEventsComponent} from "@app/components/events/listEvents/listEvents.component";
import {DetailEventComponent} from "@app/components/events/detailEvent/detailEvent.component";
import {CreateEventComponent} from "@app/components/events/createEvent/createEvent.component";
import {Daterangepicker} from "ng2-daterangepicker";
import {ListProductsComponent} from "@app/components/products/listProducts/listProducts.component";
import {CreateProductComponent} from "@app/components/products/createProduct/createProduct.component";
import {DetailProductComponent} from "@app/components/products/detailProduct/detailProduct.component";
import {CreateUserEventExpenseComponent} from "@app/components/products/createUserEventExpense/createUserEventExpense.component";
import {DetailProfileComponent} from "@app/components/authUser/profile/detailProfile/detailProfile.component";
import {ListTransactionsComponent} from "@app/components/transactions/listTransactions.component";
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import {LOCALE_ID } from '@angular/core';
import localeEs from '@angular/common/locales/es';
import {registerLocaleData} from "@angular/common";
import {EditProfileComponent} from "@app/components/authUser/profile/editProfile/editProfile.component";
import {VerifyEmailComponent} from "@app/components/authUser/email/verifyEmail/verifyEmail.component";
import {RetrievePasswordComponent} from "@app/components/authUser/email/retrievePassword/retrievePassword.component";
import {RetrievePasswordEmailComponent} from "@app/components/authUser/login/retrievePasswordEmail/retrievePasswordEmail.component";
import {TransactionHistoryComponent} from "@app/components/authUser/transactionHistory/transactionHistory.component";
import {NgxPayPalModule} from "ngx-paypal";
import {PaypalComponent} from "@app/components/authUser/paypal/paypal.component";
import { LangPipe } from '@modules/translations/lang.pipe';
import { TranslationComponent } from '@app/components/translation/translation.component';
import { TranslationModule } from '@modules/translations/translation.module';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import localeEn from '@angular/common/locales/en';
import localeGl from '@angular/common/locales/gl';

registerLocaleData(localeEs, 'es');
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ListUsersComponent,
    CreateGroupComponent,
    ListGroupsComponent,
    DetailGroupComponent,
    DetailUserComponent,
    MessageConfirmComponent,
    ListEventsComponent,
    DetailEventComponent,
    CreateEventComponent,
    CreateProductComponent,
    CreateUserEventExpenseComponent,
    ListProductsComponent,
    DetailProductComponent,
    ListTransactionsComponent,
    DetailProfileComponent,
    HomeComponent,
    EditProfileComponent,
    VerifyEmailComponent,
    RetrievePasswordComponent,
    RetrievePasswordEmailComponent,
    TransactionHistoryComponent,
    PaypalComponent,
    LangPipe,
    TranslationComponent
  ],
    imports: [
        AppRoutingModule,
        BrowserModule,
        FormsModule,
        NgSelectModule,
        HttpClientModule,
        NotificationModule,
        BrowserAnimationsModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory,
        }),
        SimpleNotificationsModule.forRoot({
            timeOut: 10000,
            preventDuplicates: true,
            pauseOnHover: true,
            clickToClose: true
        }),
        TranslationModule.forRoot({locale_id: 'es'}),
		    TranslateModule.forRoot({
			    loader: {
				    provide: TranslateLoader,
				    useFactory: HttpLoaderFactory,
				    deps: [HttpClient]
			    },
			    compiler: {
				    provide: TranslateCompiler,
				    useClass: TranslateMessageFormatCompiler
			    }
		    }),
        Daterangepicker,
        NgxPayPalModule
    ],

  providers: [
    {
      provide: ErrorHandler,
      useClass: ErrorNotificationHandler
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor, multi: true
    },
      {provide: LOCALE_ID, useValue: 'es'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient) {
	return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

registerLocaleData(localeEn)
registerLocaleData(localeGl)
