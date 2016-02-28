Meteor.setInterval(calculateAuctionTimeRemaining, 1000);
Meteor.setInterval(cycleBigScreenItems, 20000);
Meteor.setInterval(syncServerTime, 90000);

Meteor.startup(function () {
  calculateAuctionTimeRemaining();
  setDevice();
  syncServerTime();

  var localeFromBrowser = window.navigator.userLanguage || window.navigator.language;
  var locale = 'en';
  if (localeFromBrowser.match(/fr/)) {
    locale = 'fr';
  }
  i18n.setLanguage(locale);

  moment.locale(locale);
});
