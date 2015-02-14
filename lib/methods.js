Meteor.methods({
  makeAdmin: function (password) {
    if (Meteor.users.find().count() != 0) {
      throw new Meteor.Error(500, "Admin user already made");
    }

    if (password == null || password == "") {
      throw new Meteor.Error(500, "Password must have at least one character");
    }

    Accounts.createUser({
      username: "admin",
      password: password
    });

    AuctionDetails.insert({
      title: "Auction",
      startTime: moment().add('days', 1).toDate(),
      endTime: moment().add('days', 2).toDate()
    });

    AppSettings.update(
      AppSettings.findOne(),
      {$set: {preSetUp: false}}
    );
  },

  makeBid: function (bidderName, newBid, item) {
    var previousBid = Bids.findOne({itemId: item._id}, {sort: {bid: -1}});
    var auctionEndTime = moment(AuctionDetails.findOne().endTime);

    var bidderNameValid = (bidderName != "" && bidderName != null);
    var newBidValid = (newBid != null && newBid != NaN && newBid > 0);
    var newBidBeatsOldBid = (previousBid == null || newBid > previousBid.bid);
    var auctionIsOpen = moment().isBefore(auctionEndTime);

    if (bidderNameValid && newBidValid && newBidBeatsOldBid && auctionIsOpen) {
      return Bids.insert({
        bidder: bidderName,
        itemName: item.name,
        itemId: item._id,
        bid: newBid,
        dateTime: new Date()
      });
    }
  },

  deleteBid: function (bidId) {
    if (!this.userId) {
      throw new Meteor.Error(403, "You must be logged in");
    }

    return Bids.remove(bidId);
  },

  changeAuctionDetails: function (title, startTime, endTime) {
    if (!this.userId) {
      throw new Meteor.Error(403, "You must be logged in");
    }

    var detailsId = AuctionDetails.findOne()._id;
    return AuctionDetails.update(
      detailsId,
      {
        title: title,
        startTime: startTime,
        endTime: endTime
      }
    );
  },

  insertNewBlankItem: function () {
    if (!this.userId) {
      throw new Meteor.Error(403, "You must be logged in");
    }

    Items.insert({
      name: "New Item",
      order: Items.find().count() + 1
    });
  },

  updateItem: function (id, name, description, donatedBy, imageUrl) {
    if (!this.userId) {
      throw new Meteor.Error(403, "You must be logged in");
    }

    if (id && name) {
      Items.update(id,
        { $set: {
          name: name,
          description: description,
          donatedBy: donatedBy,
          imageUrl: imageUrl
        }}
      );
    }
  },

  moveItemUp: function (id) {
    if (!this.userId) {
      throw new Meteor.Error(403, "You must be logged in");
    }

    if (id) {
      var promotedItem = Items.findOne(id);
      if (promotedItem.order > 1) {
        var demotedItem = Items.findOne({order: promotedItem.order - 1});
        Items.update(promotedItem._id, { $inc: { order: -1 } });
        Items.update(demotedItem._id, { $inc: { order: 1} });
      }
    }
  },

  moveItemDown: function (id) {
    if (!this.userId) {
      throw new Meteor.Error(403, "You must be logged in");
    }

    if (id) {
      var demotedItem = Items.findOne(id);
      if (demotedItem.order < Items.find().count()) {
        var promotedItem = Items.findOne({order: demotedItem.order + 1});
        Items.update(promotedItem._id, { $inc: { order: -1 } });
        Items.update(demotedItem._id, { $inc: { order: 1} });
      }
    }
  },

  upsertAuctionItems: function () {
    // Put in manual items
    for (var i = 1; i <= 6; i++) {
      Items.upsert({ order: i }, {
        name: "Lot " + i,
        description: "Some sort of description",
        donatedBy: "Kindly donated by someone",
        image: "http://lorempixel.com/276/155/abstract/" + i + "/",
        order: i
      });
    }
  }
});
