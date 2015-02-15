Template.main.helpers({
  title: function () {
    return AuctionDetails.findOne().title;
  },
  items: function () {
    return Items.find({}, {sort: {order: 1}});
  },
  showAuctionItems: function () {
    return Session.get('bidderName') != "";
  }
});

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
