// ads.js
import {JSX} from 'react';
import {
  InterstitialAd,
  AdEventType,
  TestIds,
  BannerAdSize,
  BannerAd,
} from 'react-native-google-mobile-ads';
import {isSubscriptionActive} from '../Functions';

const INTERSTITIAL = __DEV__
  ? TestIds.INTERSTITIAL
  : 'ca-app-pub-3940256099942544/1033173712';
const BANNER = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-3940256099942544/9214589741';

const interstitial = InterstitialAd.createForAdRequest(INTERSTITIAL, {
  keywords: ['fashion'],
});

let adLoaded = false;
let adClosedCallback: (() => void) | null = null;

interstitial.addAdEventListener(AdEventType.LOADED, () => {
  adLoaded = true;
  // console.log('Ad Loaded');
});

interstitial.addAdEventListener(AdEventType.CLOSED, () => {
  // console.log('Ad Closed');
  adLoaded = false; // Reset the loaded state
  loadAd(); // Start loading the next ad
  if (adClosedCallback) {
    adClosedCallback();
  }
});
interstitial.addAdEventListener(AdEventType.ERROR, error => {
  console.error('Ad Failed to Load', error);
  adLoaded = false;
});

export const loadAd = () => {
  interstitial.load();
};

export const showAd = (onAdClosed: () => void) => {
  if (adLoaded) {
    adClosedCallback = onAdClosed;
    interstitial.show();
    adLoaded = false; // Reset the loaded state
  } else {
    console.warn('Ad is not loaded yet');
  }
};

const BannerAds = () => {
  if (isSubscriptionActive()) {
    return null;
  }
  return (
    <BannerAd unitId={BANNER} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
  );
};
export {BannerAds};
