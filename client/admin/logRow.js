Template.logRow.helpers({
  bidTime: function () {
    return moment(this.dateTime).format(i18n('logRowDateFormat'));
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
