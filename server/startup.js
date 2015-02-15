Meteor.startup(function () {
  if (AppSettings.find().count() === 0) {
    AppSettings.insert({
      preSetUp: true
    });
  }
  // if (Items.find().count() === 0) {
  //   Meteor.call('upsertAuctionItems');
  // }

  // if (Meteor.users.find().count() === 0) {
  //   Accounts.createUser({
  //     username: "admin",
  //     password: "auct10nadm1n"
  //   });
  // }
});
