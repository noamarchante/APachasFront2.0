import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from '@app/components/authUser/login/login/login.component';
import {HomeComponent} from '@app/components/home/home.component';
import {AuthGuard} from '@guards/authGuard';
import {RegisterComponent} from "@app/components/authUser/register/register.component";
import {ListUsersComponent} from "@app/components/users/listUsers/listUsers.component";
import {CreateGroupComponent} from "@app/components/groups/createGroup/createGroup.component";
import {ListGroupsComponent} from "@app/components/groups/listGroups/listGroups.component";
import {DetailGroupComponent} from "@app/components/groups/detailGroup/detailGroup.component";
import {DetailUserComponent} from "@app/components/users/detailUser/detailUser.component";
import {MessageConfirmComponent} from "@app/components/confirm/messageConfirm.component";
import {ListEventsComponent} from "@app/components/events/listEvents/listEvents.component";
import {DetailEventComponent} from "@app/components/events/detailEvent/detailEvent.component";
import {CreateEventComponent} from "@app/components/events/createEvent/createEvent.component";
import {CreateProductComponent} from "@app/components/products/createProduct/createProduct.component";
import {ListProductsComponent} from "@app/components/products/listProducts/listProducts.component";
import {DetailProductComponent} from "@app/components/products/detailProduct/detailProduct.component";
import {CreateUserEventExpenseComponent} from "@app/components/products/createUserEventExpense/createUserEventExpense.component";
import {DetailProfileComponent} from "@app/components/authUser/profile/detailProfile/detailProfile.component";
import {ListTransactionsComponent} from "@app/components/transactions/listTransactions.component";
import {EditProfileComponent} from "@app/components/authUser/profile/editProfile/editProfile.component";
import {VerifyEmailComponent} from "@app/components/authUser/email/verifyEmail/verifyEmail.component";
import {RetrievePasswordComponent} from "@app/components/authUser/email/retrievePassword/retrievePassword.component";
import {RetrievePasswordEmailComponent} from "@app/components/authUser/login/retrievePasswordEmail/retrievePasswordEmail.component";
import {TransactionHistoryComponent} from "@app/components/authUser/transactionHistory/transactionHistory.component";
import {PaypalComponent} from "@app/components/authUser/paypal/paypal.component";

const routes: Routes = [
	{
		path: 'home', component: HomeComponent
	},
	{
		path: 'login', component: LoginComponent
	},
  	{
    	path: 'register', component: RegisterComponent
  	},
	{
		path: 'users', component: ListUsersComponent, canActivate: [AuthGuard]
	},
	{
		path: 'createGroup', component: CreateGroupComponent, canActivate: [AuthGuard]
	},
	{
		path: 'groups', component: ListGroupsComponent, canActivate: [AuthGuard]
	},
	{
		path: 'detailGroup', component: DetailGroupComponent, canActivate: [AuthGuard]
	},
	{
		path: 'detailUser', component: DetailUserComponent, canActivate: [AuthGuard]
	},
	{
		path: 'messageConfirm', component: MessageConfirmComponent, canActivate: [AuthGuard]
	},
	{
		path: 'events', component: ListEventsComponent, canActivate: [AuthGuard]
	},
	{
		path: 'detailEvent', component: DetailEventComponent, canActivate: [AuthGuard]
	},
	{
		path: 'createEvent', component: CreateEventComponent, canActivate: [AuthGuard]
	},
	{
		path: 'createProduct', component: CreateProductComponent, canActivate: [AuthGuard]
	},
	{
		path: 'products', component: ListProductsComponent, canActivate: [AuthGuard]
	},
	{
		path: 'detailProduct', component: DetailProductComponent, canActivate: [AuthGuard]
	},
	{
		path: 'createUserEventExpense', component: CreateUserEventExpenseComponent, canActivate: [AuthGuard]
	},
	{
		path: 'transactions', component: ListTransactionsComponent, canActivate: [AuthGuard]
	},
	{
		path: 'profile', component: DetailProfileComponent, canActivate: [AuthGuard]
	},
	{
		path: 'editProfile', component: EditProfileComponent, canActivate: [AuthGuard]
	},
	{
		path: 'verifyEmail', component: VerifyEmailComponent
	},
	{
		path: 'retrievePassword', component: RetrievePasswordComponent
	},
	{
		path: 'retrievePasswordEmail', component: RetrievePasswordEmailComponent
	},
	{
		path: 'transactionHistory', component: TransactionHistoryComponent, canActivate: [AuthGuard]
	},
	{
		path: 'paypal', component: PaypalComponent, canActivate: [AuthGuard]
	},
	{
		path: '', redirectTo: localStorage.getItem('currentUser') ? 'home': "login", pathMatch: 'full'
	}
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, {
			useHash: false,
			anchorScrolling: 'enabled'
		})
	],
  	exports: [RouterModule]
})
export class AppRoutingModule { }
