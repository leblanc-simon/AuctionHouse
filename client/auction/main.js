Template.main.helpers({
  items: function () {
    return Items.find({}, {sort: {order: 1}});
  }
});
