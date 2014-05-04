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

  this.route('bigScreen', {
    path: '/bigscreen'
  });
});

Meteor.methods({
  makeBid: function (bidderName, newBid, item) {
    var previousBid = Bids.findOne({itemId: item._id}, {sort: {bid: -1}});
    var auctionEndTime = moment(AuctionDetails.findOne().endDateTime);

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

  changeAuctionEndTime: function (newEndTime) {
    if (!this.userId) {
      throw new Meteor.Error(403, "You must be logged in");
    }

    var detailsId = AuctionDetails.findOne()._id;
    return AuctionDetails.update(
      detailsId,
      {$set: {endDateTime: newEndTime}});
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

if (Meteor.isClient) {
  Meteor.subscribe("items");
  Meteor.subscribe("bids");
  Meteor.subscribe("auctionDetails");

  Session.setDefault('auctionHasEnded', false);
  Session.setDefault('auctionEndTime', "");
  Session.setDefault('auctionHoursRemaining', "00");
  Session.setDefault('auctionMinutesRemaining', "00");
  Session.setDefault('auctionSecondsRemaining', "00");
  Session.setDefault('bidErrorItem', "");
  Session.setDefault('bidErrorMessage', "");
  Session.setDefault('bidderName', "");
  Session.setDefault('bigScreenPage', 0);
  Session.setDefault('clientTimeOffset', 0);

  // Returns an event map that handles the "escape" and "return" keys and
  // "blur" events on a text input (given by selector) and interprets them
  // as "ok" or "cancel".
  var okCancelEvents = function (selector, callbacks) {
    var ok = callbacks.ok || function () {};
    var cancel = callbacks.cancel || function () {};

    var events = {};
    events['keyup '+selector+', keydown '+selector] =
      function (evt) {
        if (evt.type === "keydown" && evt.which === 27) {
          // escape = cancel
          cancel.call(this, evt);

        } else if (evt.type === "keyup" && evt.which === 13) {
          // blur/return/enter = ok/submit if non-empty
          var value = String(evt.target.value || "");
          if (value)
            ok.call(this, value, evt);
          else
            cancel.call(this, evt);
        }
      };

    return events;
  };

  var calculateAuctionTimeRemaining = function () {
    if (AuctionDetails.findOne()) {
      var auctionEndTime = moment(AuctionDetails.findOne().endDateTime);
      var now = moment().subtract('ms', Session.get('clientTimeOffset'));
      if (now.isAfter(auctionEndTime)) {
        Session.set('auctionHasEnded', true);
      } else {
        Session.set('auctionHasEnded', false);
        Session.set('auctionHoursRemaining', pad(auctionEndTime.diff(moment(), 'hours'), 2));
        Session.set('auctionMinutesRemaining', pad((auctionEndTime.diff(moment(), 'minutes') % 60), 2));
        Session.set('auctionSecondsRemaining', pad((auctionEndTime.diff(moment(), 'seconds') % 60), 2));
      }
    }
  };

  function pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  };

  var cycleBigScreenItems = function () {
    if (Items.find()) {
      var furthestPage = Math.floor(Items.find().count() / 8);
      var currentPage = Session.get('bigScreenPage');
      if (currentPage < furthestPage) {
        Session.set('bigScreenPage', currentPage + 1);
      } else {
        Session.set('bigScreenPage', 0);
      }
    }
  };

  var syncServerTime = function () {
    Meteor.call('getServerTime', function (error, result) {
      Session.set('clientTimeOffset', moment().diff(result));
    });
  };

  var setDevice = function () {
    Session.set('isBeingViewedOnMobile', $(window).width() < 768);
  };

  var truncateString = function (string, maxLength) {
    if (string.length > maxLength) {
      return string.substring(0,maxLength) + "...";
    }

    return string;
  };

  Meteor.setInterval(calculateAuctionTimeRemaining, 1000);
  Meteor.setInterval(cycleBigScreenItems, 20000);
  Meteor.setInterval(syncServerTime, 90000);

  Meteor.startup(function () {
    calculateAuctionTimeRemaining();
    setDevice();
    syncServerTime();
  });

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

  Template.item.itemRow = function () {
    return Math.floor((this.order - 1) / 3);
  };

  Template.main.items = function () {
    return Items.find();
  };

  Template.main.showAuctionItems = function () {
    return Session.get('bidderName') != "";
  };

  Template.countdown.hasAuctionEnded = function () {
    return Session.get('auctionHasEnded');
  };

  Template.countdown.auctionHoursRemaining = function () {
    return Session.get('auctionHoursRemaining');
  };

  Template.countdown.auctionMinutesRemaining = function () {
    return Session.get('auctionMinutesRemaining');
  };

  Template.countdown.auctionSecondsRemaining = function () {
    return Session.get('auctionSecondsRemaining');
  };

  Template.bigScreen.itemsPartOne = function () {
    return Items.find({}, {
      limit: 3
    });
  };

  Template.bigScreen.itemsPartTwo = function () {
    return Items.find({}, {
      skip: 3,
      limit: 3
    });
  };

  Template.bigScreenItem.bid = function () {
    if (Bids.findOne({itemId: this._id}, {sort: {bid: -1}})) {
      return Bids.findOne({itemId: this._id}, {sort: {bid: -1}}).bid;
    }
  };

  Template.bigScreenItem.highestBidderTruncated = function () {
    if (Bids.findOne({itemId: this._id}, {sort: {bid: -1}})) {
      return truncateString(Bids.findOne({itemId: this._id}, {sort: {bid: -1}}).bidder, 15);
    }
  };

  Template.changeEndTime.rendered = function () {
    $('.datetimepicker').datetimepicker();
  };

  Template.admin.logs = function () {
    return Bids.find({}, {sort: {dateTime: -1}});
  };

  Template.logRow.bidTime = function () {
    return moment(this.dateTime).format('MMMM Do YYYY, h:mm:ss a');
  };

  Template.main.events({
    'keypress #bidderName' : function (event, template) {
      Session.set('bidderName', template.find('#bidderName').value);
    },
    'blur #bidderName' : function (event, template) {
      Session.set('bidderName', template.find('#bidderName').value);
    },
    'click .clearButton' :  function (event, template) {
      Session.set('bidderName', "");
      template.find('#bidderName').value = "";
    }
  });

  Template.main.events(okCancelEvents(
    "#bidderName",
    {
      ok: function (value) {
        Session.set('bidderName', value);
      }
    }
  ));

  Template.item.events({
    'click #submitBid' : function (event, template) {
      var bidderName = Session.get('bidderName');
      var newBid = parseInt(template.find('.newBid').value, 10);
      var item = this;
      var previousBid = Bids.findOne({itemId: item._id}, {sort: {bid: -1}});

      var bidderNameValid = (bidderName != "" && bidderName != null);
      var newBidValid = (newBid != null && newBid != NaN && newBid > 0);
      var newBidBeatsOldBid = (previousBid == null || newBid > previousBid.bid);
      var auctionIsOpen = !Session.get('auctionHasEnded');

      if (bidderNameValid && newBidValid && newBidBeatsOldBid && auctionIsOpen) {
        Meteor.call(
          'makeBid',
          bidderName,
          newBid,
          item);
        Session.set('bidErrorItem', "");
        Session.set('bidErrorMessage', "");
        template.find('.newBid').value = "";
      } else {
        Session.set('bidErrorItem', item._id);
        if (bidderName == "" || bidderName == null) {
          Session.set('bidErrorMessage', "Please set your name at the top of the page.");
        } else if (newBid <= previousBid.bid) {
          Session.set('bidErrorMessage', "Your bid is not higher than the current highest bid. Please put in a higher bid. Bids are rounded down to the nearest pound.");
        } else if (Session.get('auctionHasEnded')) {
          Session.set('bidErrorMessage', "The auction has ended. You can no longer bid on items.");
        }
      }
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
        var bidderName = Session.get('bidderName');
        var newBid = parseInt(value, 10);
        var item = this;
        var previousBid = Bids.findOne({itemId: item._id}, {sort: {bid: -1}});

        var bidderNameValid = (bidderName != "" && bidderName != null);
        var newBidValid = (newBid != null && newBid != NaN && newBid > 0);
        var newBidBeatsOldBid = (previousBid == null || newBid > previousBid.bid);
        var auctionIsOpen = !Session.get('auctionHasEnded');

        if (bidderNameValid && newBidValid && newBidBeatsOldBid && auctionIsOpen) {
          Meteor.call(
            'makeBid',
            bidderName,
            newBid,
            item);
          Session.set('bidErrorItem', "");
          Session.set('bidErrorMessage', "");
          template.target.value = "";
        } else {
          Session.set('bidErrorItem', item._id);
          if (bidderName == "" || bidderName == null) {
            Session.set('bidErrorMessage', "Please set your name at the top of the page.");
          } else if (newBid <= previousBid.bid) {
            Session.set('bidErrorMessage', "Your bid is not higher than the current highest bid. Please put in a higher bid. Bids are rounded down to the nearest pound.");
          } else if (Session.get('auctionHasEnded')) {
            Session.set('bidErrorMessage', "The auction has ended. You can no longer bid on items.");
          }
        }
      },
      cancel: function () {
        template.find('#newBid').value = "";
      }
    }
  ));

  Template.changeEndTime.events({
    'click #submitAdminChanges' : function (event, template) {
      var newAuctionEndDate = moment(template.find('#auctionDatePicker').value, 'MM/DD/YYYY h:mm a').toDate();
      if (newAuctionEndDate) {
        Meteor.call(
          'changeAuctionEndTime',
          newAuctionEndDate);
      }
    }
  });

  Template.admin.events(okCancelEvents(
    "#inputAdminPassword",
    {
      ok: function (value) {
        Meteor.loginWithPassword("admin", value);
      }
    }
  ));

  Template.admin.events({
    'click #submitAdminPassword' : function (event, template) {
      Meteor.loginWithPassword("admin", template.find('.adminPassword').value);
    },

    'click #reloadItemData' : function () {
      Meteor.call('upsertAuctionItems');
    },

    'click #logOut' : function () {
      Meteor.logout();
    }
  });

  Template.logRow.events({
    'click #deleteBid' : function (event, template) {
      var bid = this;
      Meteor.call(
        'deleteBid',
        bid._id);
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
      Meteor.call('upsertAuctionItems');
    }

    if (AuctionDetails.find().count() === 0) {
      AuctionDetails.insert({
        endDateTime: moment().add('days', 2).toDate()
      });
    }

    if (Meteor.users.find().count() === 0) {
      Accounts.createUser({
        username: "admin",
        password: "auct10nadm1n"
      });
    }
  });

  Meteor.methods({
    getServerTime: function () {
      return moment().toDate();
    }
  });
}
