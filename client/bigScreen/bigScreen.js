Template.bigScreen.helpers({
  itemsPartOne: function () {
    return Items.find({}, {
      limit: 3
    });
  },
  itemsPartTwo: function () {
    return Items.find({}, {
      skip: 3,
      limit: 3
    });
  },
  title: function () {
    return AuctionDetails.findOne().title;
  }
});
