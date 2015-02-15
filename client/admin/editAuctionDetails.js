Template.editAuctionDetails.helpers({
  title: function () {
    return AuctionDetails.findOne().title;
  },
  startTime: function () {
    return moment(AuctionDetails.findOne().startTime).format('MM/DD/YYYY h:mm a');
  },
  endTime: function () {
    return moment(AuctionDetails.findOne().endTime).format('MM/DD/YYYY h:mm a');
  }
});

Template.editAuctionDetails.rendered = function () {
  $('.datetimepicker').datetimepicker();
};

Template.editAuctionDetails.events({
  'click #submitAuctionChanges' : function (event, template) {
    var newAuctionTitle = template.find('#inputAuctionTitle').value;
    var newAuctionStartDate = moment(template.find('#auctionStartDatePicker').value, 'MM/DD/YYYY h:mm a').toDate();
    var newAuctionEndDate = moment(template.find('#auctionEndDatePicker').value, 'MM/DD/YYYY h:mm a').toDate();
    if (newAuctionTitle && newAuctionStartDate && newAuctionEndDate) {
      Meteor.call(
        'changeAuctionDetails',
        newAuctionTitle,
        newAuctionStartDate,
        newAuctionEndDate
      );
    }
  }
});
