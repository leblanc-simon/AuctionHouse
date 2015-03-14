Template.bigScreenItem.helpers({
  bid: function () {
    if (Bids.findOne({itemId: this._id}, {sort: {bid: -1}})) {
      return Bids.findOne({itemId: this._id}, {sort: {bid: -1}}).bid;
    }
  },
  highestBidderTruncated: function () {
    if (Bids.findOne({itemId: this._id}, {sort: {bid: -1}})) {
      return truncateString(Bids.findOne({itemId: this._id}, {sort: {bid: -1}}).bidder, 15);
    }
  },
  secondaryColour: function () {
    return LightenDarkenColor(AuctionDetails.findOne().colour, -70);
  }
});
