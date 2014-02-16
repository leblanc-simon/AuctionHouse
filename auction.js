Items = new Meteor.Collection("items");
Bids = new Meteor.Collection("bids");
AuctionDetails = new Meteor.Collection("auctionDetails");

Router.map(function () {
  /**
   * The route's name is "home"
   * The route's template is also "home"
   * The default action will render the home template
   */
  this.route('main', {
    path: '/',
    template: 'main'
  });

  this.route('admin', {
    path: '/admin'
  });

  this.route('logs', {
    path: '/logs'
  });

  this.route('bigScreen', {
    path: '/bigscreen'
  });
});

if (Meteor.isClient) {
  Meteor.subscribe("items");
  Meteor.subscribe("bids");
  Meteor.subscribe("auctionDetails");

  Session.setDefault('auctionHasEnded', false);
  Session.setDefault('auctionEndTime', "");
  Session.setDefault('bidErrorItem', "");
  Session.setDefault('bidErrorMessage', "");

  calculateAuctionTimeRemaining = function () {
    if (AuctionDetails.findOne()) {
      var auctionEndTime = moment(AuctionDetails.findOne().endDateTime);
      if (moment().isAfter(auctionEndTime)) {
        Session.set('auctionHasEnded', true);
      } else {
        var timeLeft = moment.duration(auctionEndTime.subtract(moment()));
        var timeRemainingString = timeLeft.hours() + " hours, " + timeLeft.minutes() + " minutes, " + timeLeft.seconds() + " seconds";
        Session.set('auctionEndTime', timeRemainingString);
      }
    }
  }

  Meteor.setInterval(calculateAuctionTimeRemaining, 1000);

  Template.item.name = function () {
    return this.name;
  };

  Template.item.description = function () {
    return this.description;
  };

  Template.item.bid = function () {
    if (Bids.findOne({itemId: this._id}, {sort: {bid: -1}})) {
      return Bids.findOne({itemId: this._id}, {sort: {bid: -1}}).bid;
    }
  };

  Template.item.highestBidder = function () {
    if (Bids.findOne({itemId: this._id}, {sort: {bid: -1}})) {
      return Bids.findOne({itemId: this._id}, {sort: {bid: -1}}).bidder;
    }
  };

  Template.item.showBidErrorOnItem = function () {
    return this._id == Session.get('bidErrorItem');
  };

  Template.item.bidErrorMessage = function () {
    return Session.get('bidErrorMessage');
  };

  Template.main.items = function () {
    return Items.find();
  };

  Template.countdown.auctionTimeRemaining = function () {
    return Session.get('auctionEndTime');
  };

  Template.countdown.hasAuctionEnded = function () {
    return Session.get('auctionHasEnded');
  };

  Template.bigScreen.items = function () {
    return Items.find();
  };

  Template.bigScreenItem.bid = function () {
    if (Bids.findOne({itemId: this._id}, {sort: {bid: -1}})) {
      return Bids.findOne({itemId: this._id}, {sort: {bid: -1}}).bid;
    }
  };

  Template.bigScreenItem.highestBidder = function () {
    if (Bids.findOne({itemId: this._id}, {sort: {bid: -1}})) {
      return Bids.findOne({itemId: this._id}, {sort: {bid: -1}}).bidder;
    }
  };

  Template.admin.rendered = function () {
    $('.datetimepicker').datetimepicker();
  };

  Template.logs.logs = function () {
    return Bids.find({}, {sort: {dateTime: -1}});
  };

  Template.logRow.bidTime = function () {
    return moment(this.dateTime).format('MMMM Do YYYY, h:mm:ss a');
  };

  Template.main.events({
    'keyup #bidderName' : function (event, template) {
      Session.set('bidderName', template.find('#bidderName').value);
    }
  });

  Template.item.events({
    'click #submitBid' : function (event, template) {
      var bidderName = Session.get('bidderName');
      var newBid = parseFloat(template.find('.newBid').value);
      var item = this;
      var previousBid = Bids.findOne({itemId: item._id}, {sort: {bid: -1}});

      if ((bidderName != "" && bidderName != null) && (previousBid == null || newBid > previousBid.bid) && !Session.get('auctionHasEnded')) {
        Bids.insert({
          bidder: bidderName,
          itemName: item.name,
          itemId: item._id,
          bid: newBid,
          dateTime: new Date()
        });
        Session.set('bidErrorItem', "");
        Session.set('bidErrorMessage', "");
      } else {
        Session.set('bidErrorItem', item._id);
        if (bidderName == "" || bidderName == null) {
          Session.set('bidErrorMessage', "Please set your name at the top of the page.");
        } else if (newBid <= previousBid.bid) {
          Session.set('bidErrorMessage', "Your bid is not higher than the current highest bid. Please put in a higher bid.");
        } else if (Session.get('auctionHasEnded')) {
          Session.set('bidErrorMessage', "The auction has ended. You can no longer bid on items.");
        }
      }
    }
  });

  Template.logRow.events({
    'click #deleteBid' : function (event, template) {
      var bid = this;
      Bids.remove(bid._id);
    }
  });
}

if (Meteor.isServer) {
  Meteor.publish("items", function () {
    return Items.find({}, {sort: {order: 1}});
  });

  Meteor.publish("bids", function () {
    return Bids.find();
  });

  Meteor.publish("auctionDetails", function () {
    return AuctionDetails.find();
  });

  Meteor.startup(function () {
    if (Items.find().count() === 0) {
      Items.insert({
        name: "Item1",
        description: "Some description",
        image: "http://placehold.it/276x155/ff6666/ffffff",
        bid: 0,
        order: 1
      });
      Items.insert({
        name: "Item2",
        description: "Some description again",
        image: "http://placehold.it/276x155/ff0000/ffffff",
        bid: 0,
        order: 2
      });
      Items.insert({
        name: "Item3",
        description: "Some description further",
        image: "http://placehold.it/276x155/cc0000/ffffff",
        bid: 0,
        order: 3
      });
    }

    if (AuctionDetails.find().count() === 0) {
      AuctionDetails.insert({
        endDateTime: moment().add('days', 7).toDate()
      });
    }
  });
}
