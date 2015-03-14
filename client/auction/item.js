var clientSubmitBid = function (newBid, item, inputField) {
  var bidderName = Session.get('bidderName');
  var previousBid = Bids.findOne({itemId: item._id}, {sort: {bid: -1}});

  var bidderNameValid = (bidderName != "" && bidderName != null);
  var newBidValid = (newBid != null && newBid != NaN && newBid > 0);
  var newBidBeatsOldBid = (previousBid == null || newBid > previousBid.bid);
  var auctionIsOpen = (Session.get('auctionHasBegun') && !Session.get('auctionHasEnded'));

  if (bidderNameValid && newBidValid && newBidBeatsOldBid && auctionIsOpen) {
    Meteor.call(
      'makeBid',
      bidderName,
      newBid,
      item);
    Session.set('bidErrorItem', "");
    Session.set('bidErrorMessage', "");
    inputField.value = "";
  } else {
    Session.set('bidErrorItem', item._id);
    if (bidderName == "" || bidderName == null) {
      Session.set('bidErrorMessage', "Please set your name at the top of the page.");
    } else if (newBid <= previousBid.bid) {
      Session.set('bidErrorMessage', "Your bid is not higher than the current highest bid. Please put in a higher bid. Bids are rounded down to the nearest pound.");
    } else if (Session.get('auctionHasEnded')) {
      Session.set('bidErrorMessage', "The auction has ended. You can no longer bid on items.");
    } else if (!Session.get('auctionHasBegun')) {
      Session.set('bidErrorMessage', "The auction has not started. You can't bid on items yet.");
    }
  }
};

Template.item.helpers({
  bid: function () {
    if (Bids.findOne({itemId: this._id}, {sort: {bid: -1}})) {
      return Bids.findOne({itemId: this._id}, {sort: {bid: -1}}).bid;
    }
  },
  highestBidder: function () {
    if (Bids.findOne({itemId: this._id}, {sort: {bid: -1}})) {
      return Bids.findOne({itemId: this._id}, {sort: {bid: -1}}).bidder;
    }
  },
  showBidErrorOnItem: function () {
    return this._id == Session.get('bidErrorItem');
  },
  bidErrorMessage: function () {
    return Session.get('bidErrorMessage');
  },
  itemRow: function () {
    return Math.floor((this.order - 1) / 3);
  }
});

Template.item.events({
  'click #submitBid' : function (event, template) {
    clientSubmitBid(parseInt(template.find('.newBid').value, 10), this, template.find('.newBid'));
  },
  'click .dismissError' : function (event, template) {
    Session.set('bidErrorItem', "");
    Session.set('bidErrorMessage', "");
  }
});

Template.item.events(okCancelEvents(
  "#newBid",
  {
    ok: function (value, template) {
      clientSubmitBid(parseInt(value, 10), this, template.target);
    },
    cancel: function () {
      template.find('#newBid').value = "";
    }
  }
));

Template.item.rendered = function () {
  this.autorun(function (){
    Bids.findOne({itemId: Template.instance().data._id}, {sort: {bid: -1}});
    var item = Template.instance().$(".currentBid");
    var auctionColour = AuctionDetails.findOne().colour;
    var initialColour = "#000000";
    var highlightColour = LightenDarkenColor(auctionColour, 50);
    item.css("color", highlightColour);  
    _.defer(function () {
      item.addClass("highlighted");
      item.css("color", initialColour);
    });
    _.delay(function () {
      item.removeClass("highlighted");
    }, 2000);
  });
};
