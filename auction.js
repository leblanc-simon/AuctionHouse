Items = new Meteor.Collection("items");

if (Meteor.isClient) {
  Template.hello.greeting = function () {
    return "Welcome to auction.";
  };

  Template.hello.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });
}

if (Meteor.isServer) {
  Meteor.publish("items", function () {
    return Items.find();
  });

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
