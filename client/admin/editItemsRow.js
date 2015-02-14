Template.editItemsRow.events({
  'click .itemRow' : function (event, template) {
    Session.set('adminSelectedItem', template.data._id);
  },

  'click .moveUp' : function (event, template) {
    if (template.data.order > 1) {
      Meteor.call('moveItemUp', template.data._id);
    }
  },

  'click .moveDown' : function (event, template) {
    if (template.data.order < Items.find().count()) {
      Meteor.call('moveItemDown', template.data._id);
    }
  }
});
