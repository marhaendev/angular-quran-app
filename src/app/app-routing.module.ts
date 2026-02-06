import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./features/surah-list/surah-list.module').then(m => m.SurahListModule)
    },
    {
        path: 'surah/:number',
        loadChildren: () => import('./features/surah-detail/surah-detail.module').then(m => m.SurahDetailModule)
    },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
