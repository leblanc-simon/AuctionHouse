Template.main.helpers({
  items: function () {
    return Items.find({}, {sort: {order: 1}});
  }
});

Template.main.rendered = function () {
  setWaypoints();
  setBaguetteBox();
};
