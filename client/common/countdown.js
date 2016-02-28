Template.countdown.helpers({
  hasAuctionBegun: function () {
    return Session.get('auctionHasBegun');
  },
  hasAuctionEnded: function () {
    return Session.get('auctionHasEnded');
  },
  auctionDaysRemainingHide: function () {
    return Session.get('auctionDaysRemainingHide') ? ' hide' : '';
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
