Template.editAuctionDetails.helpers({
  title: function () {
    return AuctionDetails.findOne().title;
  },
  colour: function () {
    return AuctionDetails.findOne().colour;
  },
  startTime: function () {
    return moment(AuctionDetails.findOne().startTime).format(i18n('inputDateFormat'));
  },
  endTime: function () {
    return moment(AuctionDetails.findOne().endTime).format(i18n('inputDateFormat'));
  }
});

Template.editAuctionDetails.rendered = function () {
  $('.datetimepicker').datetimepicker({
    locale: i18n.getLanguage()
  });
};

Template.editAuctionDetails.events({
  'click #submitAuctionChanges' : function (event, template) {
    var newAuctionTitle = template.find('#inputAuctionTitle').value;
    var newAuctionColour = template.find('#inputAuctionPrimaryColour').value;
    var newAuctionStartDate = moment(template.find('#auctionStartDatePicker').value, i18n('inputDateFormat')).toDate();
    var newAuctionEndDate = moment(template.find('#auctionEndDatePicker').value, i18n('inputDateFormat')).toDate();
    if (newAuctionTitle && newAuctionStartDate && newAuctionEndDate) {
      Meteor.call(
        'changeAuctionDetails',
        newAuctionTitle,
        newAuctionColour,
        newAuctionStartDate,
        newAuctionEndDate
      );
    }
  }
});
