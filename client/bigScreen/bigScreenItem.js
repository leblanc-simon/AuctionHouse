Template.bigScreenItem.helpers({
  bid: function () {
    if (Bids.findOne({itemId: this._id}, {sort: {bid: -1}})) {
      return Bids.findOne({itemId: this._id}, {sort: {bid: -1}}).bid;
    } else {
      return "-";
    }
  },
  highestBidder: function () {
    if (Bids.findOne({itemId: this._id}, {sort: {bid: -1}})) {
      return Bids.findOne({itemId: this._id}, {sort: {bid: -1}}).bidder;
    }
  },
  hideBidder: function () {
    if (Bids.findOne({itemId: this._id}, {sort: {bid: -1}})) {
      return "";
    } else {
      return "hideBidder";
    }
  },
  secondaryColour: function () {
    return LightenDarkenColor(AuctionDetails.findOne().colour, -70);
  }
});

Template.bigScreenItem.rendered = function () {
  this.autorun(function (){
    Bids.findOne({itemId: Template.instance().data._id}, {sort: {bid: -1}});
    var item = Template.instance().$(".bsItem");
    var auctionColour = AuctionDetails.findOne().colour;
    var initialColour = LightenDarkenColor(auctionColour, -70);
    var highlightColour = LightenDarkenColor(auctionColour, 50);
    item.css("background-color", highlightColour);  
    _.defer(function () {
      item.addClass("highlighted");
      item.css("background-color", initialColour);
    });
    _.delay(function () {
      item.removeClass("highlighted");
    }, 2000);
  });
};
