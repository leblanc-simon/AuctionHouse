Template.countdown.helpers({
  hasAuctionBegun: function () {
    return Session.get('auctionHasBegun');
  },
  hasAuctionEnded: function () {
    return Session.get('auctionHasEnded');
  },
  auctionShowDaysOrSeconds: function () {
    return Session.get('auctionDaysRemainingHide') ? 'show-seconds' : 'show-days';
  },
  auctionDaysRemaining: function () {
    return Session.get('auctionDaysRemaining');
  },
  auctionHoursRemaining: function () {
    return Session.get('auctionHoursRemaining');
  },
  auctionMinutesRemaining: function () {
    return Session.get('auctionMinutesRemaining');
  },
  auctionSecondsRemaining: function () {
    return Session.get('auctionSecondsRemaining');
  }
});
