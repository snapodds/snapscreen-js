import { HttpClientModule } from '@angular/common/http';
import { DoBootstrap, Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { PinchZoomModule } from 'ngx-pinch-zoom';
import { WebcamModule } from 'ngx-webcam';
import { FileTranslateLoader } from '../services/i18n/file-translate-loader';
import { AppComponent } from './app.component';
import { HelpComponent } from './pages/help/help.component';
import { OddsBoxComponent } from './pages/odds/odds-box/odds-box.component';
import { OddsLineComponent } from './pages/odds/odds-line/odds-line.component';
import { OddsComponent } from './pages/odds/odds/odds.component';
import { BestOfferLinePipe } from './pages/odds/pipes/best-offer.pipe';
import { NumberFormatPipe } from './pages/odds/pipes/number-format.pipe';
import { OverUnderPipe } from './pages/odds/pipes/over-under.pipe';
import { SnapComponent } from './pages/snap/snap/snap.component';
import { SwitchSvgComponent } from './pages/snap/svgs/switch.svg.component';
import { TriggerSvgComponent } from './pages/snap/svgs/trigger.svg.component';
import { TriggerComponent } from './pages/snap/trigger/trigger.component';
import { UserFeedbackMessageComponent } from './pages/snap/user-feedback-message/user-feedback-message.component';
import { WebcamComponent } from './pages/snap/webcam/webcam.component';
import { ContentComponent } from './shared/content/content.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { OddsHeaderComponent } from './pages/odds/odds-header/odds-header.component';
import { OddsOrderingPipe } from './pages/odds/pipes/odds-ordering.pipe';

@NgModule({
  declarations: [
    AppComponent,
    SnapComponent,
    OddsComponent,
    WebcamComponent,
    SpinnerComponent,
    HeaderComponent,
    ContentComponent,
    FooterComponent,
    HelpComponent,
    TriggerComponent,
    TriggerSvgComponent,
    SwitchSvgComponent,
    UserFeedbackMessageComponent,
    OddsLineComponent,
    BestOfferLinePipe,
    NumberFormatPipe,
    OddsBoxComponent,
    OverUnderPipe,
    OddsHeaderComponent,
    OddsOrderingPipe,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    WebcamModule,
    PinchZoomModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useClass: FileTranslateLoader,
      },
    }),
  ],
  entryComponents: [AppComponent],
})
export class AppModule implements DoBootstrap {
  constructor(private injector: Injector) {}

  /**
   * Register the angular component as web-component.
   */
  ngDoBootstrap() {
    const el = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define('snapodds-sdk', el);
  }
}
