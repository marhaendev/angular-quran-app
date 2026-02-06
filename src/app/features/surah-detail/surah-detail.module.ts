import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SurahDetailComponent } from './surah-detail.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
    { path: '', component: SurahDetailComponent }
];

@NgModule({
    declarations: [SurahDetailComponent],
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ]
})
export class SurahDetailModule { }
