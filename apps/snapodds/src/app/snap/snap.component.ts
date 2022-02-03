import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TvSearchResult } from '@response/typings';
import { defer, delay, mergeMap, Observable, race, retryWhen, Subject, switchMap, take, takeUntil, timer } from 'rxjs';
import { TvSearchNoResultError } from '../../services/api/api-errors';
import { ApplicationConfigService } from '../../services/config/application-config.service';
import { ManipulatedImage } from '../../services/image-manipulation/manipulated-image';
import { LoggerService } from '../../services/logger/logger.service';
import { NotificationService } from '../../services/notification/notification.service';
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

  /**
   * Initializes the component.
   *
   * Will register autoSnap if configured.
   * Sets the applicationState to SNAP_READY.
   * Triggers the snap view opened analytics event.
   */
  ngOnInit(): void {
    if (this.applicationConfigService.isAutoSnapEnabled()) {
      this.registerAutoSnap();
    }

    this.subscribeToStateStores();

    this.appStateStore.dispatch(AppState.SNAP_READY);
    this.analyticsService.snapViewOpened();
  }

  /**
   * Subscribes to updates from the AppStateStore and MediaDeviceStateStore
   * @private
   */
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

  /**
   * Clean up existing subscriptions.
   * Triggers the snap view has been closed analytics event.
   */
  ngOnDestroy(): void {
    this.analyticsService.snapViewClosed();
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Notifies other subscriptions that a new snapshot is performed.
   * Load the SportEvents based on the snapshot
   */
  takeSnapshot(): void {
    this.snapshot$.next();

    this.loadSportEvents().subscribe({
      next: (response) => this.handleSuccess(response),
      error: (error) => this.handleError(error),
    });
  }

  /**
   * When the camera is ready it starts to periodically take snapshots and tries to load SportEvents
   * @private
   */
  private registerAutoSnap(): void {
    this.mediaDeviceStateStore.webcamIsReady$
      .pipe(
        take(1),
        takeUntil(this.destroyed$),
        switchMap(() => this.startAutoSnapWithDelay())
      )
      .subscribe((response) => this.handleSuccess(response));
  }

  /**
   * The first delay is a bit longer in order for the user to manage to align the camera correctly.
   * Afterwards snapshots from the webcam will be taken periodically and SportEvents will be tried to be loaded.
   * Stops only if the view is closed or the user has taken a snapshot by pressing the snapshot button.
   * @private
   */
  private startAutoSnapWithDelay(): Observable<TvSearchResult> {
    return timer(this.applicationConfigService.getAutoSnapDelay(true)).pipe(
      mergeMap(() =>
        this.loadSportEvents(true).pipe(
          retryWhen((errors) => errors.pipe(delay(this.applicationConfigService.getAutoSnapDelay())))
        )
      ),
      takeUntil(race(this.destroyed$, this.snapshot$))
    );
  }

  /**
   * Emit the best match (first entry in the response) on the ApplicationConfigService,
   * in order to notify other services about a successful snap.
   * @param sportEventsResponse
   * @private
   */
  private handleSuccess(sportEventsResponse: TvSearchResult) {
    this.notificationService.notify();
    this.applicationConfigService.emitResultsEvent(sportEventsResponse.resultEntries[0]);
  }

  /**
   * Depending on the error, either indicates that not SportEvents have been found by the given snapshot
   * or that the request could not be processed due to technical errors.
   * @param error
   * @private
   */
  private handleError(error: unknown): void {
    if (error instanceof TvSearchNoResultError) {
      this.appStateStore.dispatch(AppState.SNAP_NO_RESULTS);
    } else {
      this.appStateStore.dispatch(AppState.SNAP_FAILED);
    }
  }

  /**
   * Retrieves a snapshot from the webcam and then call the respective method to lookup the SportEvent.
   * @param autoSnap: Depending on the mode used to perform the snapshot different methods are executed
   * @private
   */
  private loadSportEvents(autoSnap = false): Observable<TvSearchResult> {
    if (!autoSnap) {
      this.appStateStore.dispatch(AppState.SNAP_IN_PROGRESS);
    }
    return defer(() => this.webcamComponent.triggerSnapshot()).pipe(
      switchMap((webcamImage: ManipulatedImage) => {
        if (autoSnap) {
          return this.snapOddsFacade.autoSearchSport(webcamImage.blob);
        } else {
          return this.snapOddsFacade.searchSport(webcamImage.blob);
        }
      })
    );
  }

  /**
   * Navigate to the Help Page by setting the corresponding AppState
   */
  showHelpPage(): void {
    this.appStateStore.dispatch(AppState.SHOW_HELP);
  }

  /**
   * Reload the webbrowser
   */
  reloadPage(): void {
    this.location.reload();
  }
}
