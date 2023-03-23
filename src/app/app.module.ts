import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './main/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SessionComponent } from './components/session/session.component';
import { FlowComponent } from './components/flow/flow.component';
import { InteractionComponent } from './components/interaction/interaction.component';

@NgModule({
  declarations: [
    AppComponent,
    SessionComponent,
    FlowComponent,
    InteractionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
