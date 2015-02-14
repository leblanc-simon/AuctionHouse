Meteor.setInterval(calculateAuctionTimeRemaining, 1000);
Meteor.setInterval(cycleBigScreenItems, 20000);
Meteor.setInterval(syncServerTime, 90000);

Meteor.startup(function () {
  calculateAuctionTimeRemaining();
  setDevice();
  syncServerTime();
  moment.locale('en');
});
