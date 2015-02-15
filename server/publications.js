Meteor.publish("items", function () {
  return Items.find();
});

Meteor.publish("bids", function () {
  return Bids.find();
});

Meteor.publish("auctionDetails", function () {
  return AuctionDetails.find();
});

Meteor.publish("appSettings", function () {
  return AppSettings.find();
});
