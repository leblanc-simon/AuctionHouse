Template.admin.helpers({
  isPreSetUp: function () {
    appSettings = AppSettings.findOne();
    if (appSettings) {
      return appSettings.preSetUp;
    } else {
      return true;
    }
  },
  logs: function () {
    return Bids.find({}, {sort: {dateTime: -1}});
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

  'click #logOut' : function () {
    Meteor.logout();
  }
});
