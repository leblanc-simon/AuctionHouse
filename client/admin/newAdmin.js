Template.newAdmin.events({
  'click #submitNewAdminPassword' : function (event, template) {
    var password = template.find('#inputNewAdminPassword').value;
    var confirmPassword = template.find('#inputNewConfirmAdminPassword').value;
    if (password != null && password != "" && password == confirmPassword) {
      Meteor.call('makeAdmin', password);
    }
  }
});
