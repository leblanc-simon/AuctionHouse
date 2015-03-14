Template.header.helpers({
  title: function () {
    return AuctionDetails.findOne().title;
  },
  primaryColour: function () {
    return AuctionDetails.findOne().colour;
  },
  nameIsSet: function () {
    return Session.get('bidderName') != "";
  },
  name: function () {
    return Session.get('bidderName');
  }
});

Template.header.events({
  'click #submitName' :  function (event, template) {
    Session.set('bidderName', template.find('#bidderName').value);
  },
  'click #changeName' : function (event, template) {
    var oldName = Session.get('bidderName');
    Session.set('bidderName', "");
    _.defer(function () {
      template.find('#bidderName').value = oldName;
      $("html, body").animate({ scrollTop: 0 }, "slow");
      $("#bidderName").focus();
    });
  },
  'click #scrollToTop' : function () {
    $("html, body").animate({ scrollTop: 0 }, "slow");
    $("#bidderName").focus();
  }
});

Template.header.events(okCancelEvents(
  "#bidderName",
  {
    ok: function (value) {
      Session.set('bidderName', value);
    }
  }
));
