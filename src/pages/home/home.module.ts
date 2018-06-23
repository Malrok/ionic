import { NgModule } from '@angular/core';
import { VirtualScrollModule } from 'angular2-virtual-scroll';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';

@NgModule({
    declarations: [
        HomePage,
    ],
    imports: [
        IonicPageModule.forChild(HomePage),
        VirtualScrollModule
    ],
})
export class HomePageModule { }
