import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent,
  },
  {
    path: 'dashboard', component: DashboardComponent,
  },
  {
    path: 'bugs', component: DashboardComponent,
  },
  {
    path: 'news', component: DashboardComponent,
  },
  {
    path: 'patch-notes', component: DashboardComponent,
  },
  {
    path: '**', component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
