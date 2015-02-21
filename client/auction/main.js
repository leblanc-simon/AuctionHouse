Template.main.helpers({
  title: function () {
    return AuctionDetails.findOne().title;
  },
  items: function () {
    return Items.find({}, {sort: {order: 1}});
  },
  nameIsSet: function () {
    return Session.get('bidderName') != "";
  },
  name: function () {
    return Session.get('bidderName');
  }
});

Template.main.events({
  'click #submitName' :  function (event, template) {
    Session.set('bidderName', template.find('#bidderName').value);
  },
  'click #changeName' : function (event, template) {
    var oldName = Session.get('bidderName');
    Session.set('bidderName', "");
    _.defer(function () {
      template.find('#bidderName').value = oldName;
      template.find('#bidderName').focus();
    });
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
