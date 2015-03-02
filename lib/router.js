Router.route('/', {
  subscriptions: function() {
    return Meteor.subscribe("auctionDetails");
  },

  action: function () {
    if (this.ready()) {
      this.render('main');
    } else {
      this.render('loading');
    }
  }
});

Router.route('/admin', {
  subscriptions: function() {
    return Meteor.subscribe("appSettings");
  },

  action: function () {
    if (this.ready()) {
      this.render('admin');
    } else {
      this.render('loading');
    }
  }
});

Router.route('/bigscreen', {
  subscriptions: function() {
    return Meteor.subscribe("auctionDetails");
  },

  action: function () {
    if (this.ready()) {
      this.render('bigScreen');
    } else {
      this.render('loading');
    }
  }
});
