Items = new Meteor.Collection("items");
Bids = new Meteor.Collection("bids");

if (Meteor.isClient) {
  Meteor.subscribe("items");
  Meteor.subscribe("bids");

  Template.item.name = function () {
    return this.name;
  };

  Template.item.description = function () {
    return this.description;
  };

  Template.item.bid = function () {
    return this.bid;
  };

  Template.item.highestBidder = function () {
    return this.highestBidder;
  }

  Template.main.items = function () {
    return Items.find();
  }

  Template.main.events({
    'keyup #bidderName' : function (event, template) {
      Session.set('bidderName', template.find('#bidderName').value);
    }
  })

  Template.item.events({
    'click #submitBid' : function (event, template) {
      var bidderName = Session.get('bidderName');
      var bid = parseFloat(template.find('.newBid').value);
      var item = this;

      if (bidderName != "" && bid > item.bid) {
        Items.update(
          {_id: this._id},
          {$set: {
            bid: bid,
            highestBidder: bidderName
          }});

        Bids.insert({
          bidder: bidderName,
          itemName: item.name,
          itemId: item._id,
          bid: bid,
          dateTime: new Date()
        });
      }
    }
  });
}

if (Meteor.isServer) {
  Meteor.publish("items", function () {
    return Items.find();
  });

  Meteor.publish("bids", function () {
    return Bids.find();
  })

  Meteor.startup(function () {
    if (Items.find().count() === 0) {
      Items.insert({
        name: "Item1",
        description: "Some description",
        bid: 0
      });
      Items.insert({
        name: "Item2",
        description: "Some description again",
        bid: 0
      });
      Items.insert({
        name: "Item3",
        description: "Some description further",
        bid: 0
      });
    }
  });
}
