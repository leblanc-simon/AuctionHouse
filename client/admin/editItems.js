Template.editItems.helpers({
  items: function () {
    return Items.find({}, {sort: {order: 1}});
  },
  showItemForm: function () {
    return Session.get('adminSelectedItem') != null;
  }
});

Template.editItems.events({
  'click #addNewItem' : function () {
    Meteor.call('insertNewBlankItem');
  }
});
