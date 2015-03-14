Template.bigScreen.helpers({
  itemsPartOne: function () {
    return Items.find({}, {
      limit: 3,
      sort: {order: 1}
    });
  },
  itemsPartTwo: function () {
    return Items.find({}, {
      skip: 3,
      limit: 3,
      sort: {order: 1}
    });
  },
  title: function () {
    return AuctionDetails.findOne().title;
  },
  primaryColour: function () {
    return AuctionDetails.findOne().colour;
  }
});
