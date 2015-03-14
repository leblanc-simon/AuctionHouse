Template.editItemForm.helpers({
  name: function () {
    return Items.findOne(Session.get('adminSelectedItem')).name;
  },
  description: function () {
    return Items.findOne(Session.get('adminSelectedItem')).description;
  },
  donatedBy: function () {
    return Items.findOne(Session.get('adminSelectedItem')).donatedBy;
  },
  imageUrl: function () {
    return Items.findOne(Session.get('adminSelectedItem')).imageUrl;
  }
});

Template.editItemForm.events({
  'click #submitItemChanges' : function (event, template) {
    var newName = template.find('#inputItemName').value;
    var newDescription = template.find('#inputItemDescription').value;
    var newDonatedBy = template.find('#inputItemDonatedBy').value;
    var newImageUrl = template.find('#inputItemImageUrl').value;

    if (newName && newName != "") {
      Meteor.call('updateItem',
        Session.get('adminSelectedItem'),
        newName,
        newDescription,
        newDonatedBy,
        newImageUrl
      );
    }
  },

  'click #deleteItem' : function () {
    Meteor.call('deleteItem', Session.get('adminSelectedItem'));
    Session.set('adminSelectedItem', null);
  }
});
