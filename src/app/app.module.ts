import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './main/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SessionComponent } from './session/session.component';

@NgModule({
  declarations: [
    AppComponent,
    SessionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
