Template.logRow.helpers({
  bidTime: function () {
    return moment(this.dateTime).format('MMMM Do YYYY, h:mm:ss a');
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
