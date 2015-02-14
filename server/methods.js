Meteor.methods({
  getServerTime: function () {
    return moment().toDate();
  }
});
