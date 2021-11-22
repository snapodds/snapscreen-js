import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SportEventsResponse } from '@response/typings';
import { defer, delay, mergeMap, Observable, retryWhen, Subject, switchMap, takeUntil, timer } from 'rxjs';
import { ApplicationConfigService } from '../../services/config/application-config.service';
import { ManipulatedImage } from '../../services/image-manipulation/manipulated-image';
import { LoggerService } from '../../services/logger/logger.service';
import { NotificationService } from '../../services/notification/notification.service';
import { SnapOddsNoResultError } from '../../services/snap-odds/snap-odds-errors';
import { SnapOddsFacade } from '../../services/snap-odds/snap-odds-facade.service';
import { LOCATION } from '../../services/tokens/location-token';
import { GoogleAnalyticsService } from '../../services/tracking/google-analytics.service';
import { AppState, AppStateStore } from '../../states/app-state.store';
import { MediaDeviceState, MediaDeviceStateStore } from '../../states/media-device-state.store';
import { WebcamComponent } from '../webcam/webcam.component';

@Component({
  selector: 'snapodds-snap',
  templateUrl: './snap.component.html',
  styleUrls: ['./snap.component.scss'],
})
export class SnapComponent implements OnInit, OnDestroy {
  @ViewChild(WebcamComponent) webcamComponent!: WebcamComponent;

  appState: AppState | undefined;
  mediaDeviceState: MediaDeviceState | undefined;

  private readonly destroyed$ = new Subject<void>();
  private readonly snapshot$ = new Subject<void>();

  constructor(
    private readonly logger: LoggerService,
    private readonly applicationConfigService: ApplicationConfigService,
    private readonly analyticsService: GoogleAnalyticsService,
    private readonly snapOddsFacade: SnapOddsFacade,
    private readonly appStateStore: AppStateStore,
    private readonly mediaDeviceStateStore: MediaDeviceStateStore,
    private readonly notificationService: NotificationService,
    @Inject(LOCATION) private readonly location: Location
  ) {}

  ngOnInit(): void {
    if (this.applicationConfigService.isAutoSnapEnabled()) {
      this.registerAutoSnap();
    }

    this.subscribeToStateStores();

    this.appStateStore.dispatch(AppState.SNAP_READY);
    this.analyticsService.snapViewOpened();
  }

  private subscribeToStateStores() {
    this.appStateStore
      .getState()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((appState) => (this.appState = appState));

    this.mediaDeviceStateStore
      .getState()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((mediaDeviceState) => (this.mediaDeviceState = mediaDeviceState));
  }

  ngOnDestroy(): void {
    this.analyticsService.snapViewClosed();
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  takeSnapshot(): void {
    this.loadSportEvents().subscribe({
      next: (response) => this.handleSuccess(response),
      error: (error) => this.handeleError(error),
    });
    this.snapshot$.next();
  }

  private registerAutoSnap(): void {
    timer(this.applicationConfigService.getAutoSnapDelay(true))
      .pipe(
        mergeMap(() =>
          this.loadSportEvents(true).pipe(
            retryWhen((errors) => errors.pipe(delay(this.applicationConfigService.getAutoSnapDelay())))
          )
        ),
        takeUntil(this.snapshot$)
      )
      .subscribe((response) => this.handleSuccess(response));
  }

  private handleSuccess(sportEventsResponse: SportEventsResponse) {
    this.notificationService.notify();
    this.applicationConfigService.emitResultsEvent(sportEventsResponse);
  }

  private handeleError(error: unknown): void {
    if (error instanceof SnapOddsNoResultError) {
      this.appStateStore.dispatch(AppState.SNAP_NO_RESULTS);
    } else {
      this.appStateStore.dispatch(AppState.SNAP_FAILED);
    }
  }

  private loadSportEvents(autoSnap = false): Observable<SportEventsResponse> {
    if (!autoSnap) {
      this.appStateStore.dispatch(AppState.SNAP_IN_PROGRESS);
    }
    return defer(() => this.webcamComponent.triggerSnapshot()).pipe(
      switchMap((webcamImage: ManipulatedImage) => this.snapOddsFacade.getSnap(webcamImage.blob, autoSnap))
    );
  }

  showHelpPage(): void {
    this.appStateStore.dispatch(AppState.SHOW_HELP);
  }

  reloadPage(): void {
    this.location.reload();
  }
}
