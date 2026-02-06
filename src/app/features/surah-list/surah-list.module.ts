import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SurahListComponent } from './surah-list.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
    { path: '', component: SurahListComponent }
];

@NgModule({
    declarations: [SurahListComponent],
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ]
})
export class SurahListModule { }
