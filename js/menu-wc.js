'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">SnapOdds Builder</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                    </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-up"></span>
                        </div>
                        <ul class="links collapse in" ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/ClipShareSdkBuilder.html" data-type="entity-link" >ClipShareSdkBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/LiveEventsStatusChangedDetector.html" data-type="entity-link" >LiveEventsStatusChangedDetector</a>
                            </li>
                            <li class="link">
                                <a href="classes/MissingAccessTokenProviderError.html" data-type="entity-link" >MissingAccessTokenProviderError</a>
                            </li>
                            <li class="link">
                                <a href="classes/OddsSdkBuilder.html" data-type="entity-link" >OddsSdkBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/OperatorsSdkBuilder.html" data-type="entity-link" >OperatorsSdkBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/SdkBuilder.html" data-type="entity-link" >SdkBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/SnapoddsSdkWrapper.html" data-type="entity-link" >SnapoddsSdkWrapper</a>
                            </li>
                            <li class="link">
                                <a href="classes/SportEvent.html" data-type="entity-link" >SportEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/SportsMediaSdkBuilder.html" data-type="entity-link" >SportsMediaSdkBuilder</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-up"></span>
                        </div>
                        <ul class="links collapse in" ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AccessToken.html" data-type="entity-link" >AccessToken</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Clip.html" data-type="entity-link" >Clip</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ClipPreview.html" data-type="entity-link" >ClipPreview</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ClipPreviewFrame.html" data-type="entity-link" >ClipPreviewFrame</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ClipPreviewSettings.html" data-type="entity-link" >ClipPreviewSettings</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Competitor.html" data-type="entity-link" >Competitor</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Config.html" data-type="entity-link" >Config</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EpgUnit.html" data-type="entity-link" >EpgUnit</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FragmentLink.html" data-type="entity-link" >FragmentLink</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GeoLocation.html" data-type="entity-link" >GeoLocation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Link.html" data-type="entity-link" >Link</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/OddsOffer.html" data-type="entity-link" >OddsOffer</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/OddsOfferOutcome.html" data-type="entity-link" >OddsOfferOutcome</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/OddsResponse.html" data-type="entity-link" >OddsResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Player.html" data-type="entity-link" >Player</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Point2d.html" data-type="entity-link" >Point2d</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Quadrangle2d.html" data-type="entity-link" >Quadrangle2d</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SportEvent.html" data-type="entity-link" >SportEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SportsBook.html" data-type="entity-link" >SportsBook</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TimestampedLink.html" data-type="entity-link" >TimestampedLink</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TvChannel.html" data-type="entity-link" >TvChannel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TvSearchResult.html" data-type="entity-link" >TvSearchResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TvSearchResultEntry.html" data-type="entity-link" >TvSearchResultEntry</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});