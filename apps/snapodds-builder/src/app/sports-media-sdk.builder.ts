import { TvSearchResultEntry } from '@response/typings';
import { SdkBuilder } from './sdk-builder';

/**
 * Renders the OddsPage after a successful Snap.
 */
export class SportsMediaSdkBuilder extends SdkBuilder {
  override readonly sdkMode = 'sportmedia';

  assignProperties() {
    this.sdk.resultsCallback = (tvSearchResult: TvSearchResultEntry) => {
      this.sdk.tvSearchResult = tvSearchResult;
      this.resultsCallback?.(tvSearchResult);
    };
  }
}
