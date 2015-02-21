// Returns an event map that handles the "escape" and "return" keys and
// "blur" events on a text input (given by selector) and interprets them
// as "ok" or "cancel".
okCancelEvents = function (selector, callbacks) {
  var ok = callbacks.ok || function () {};
  var cancel = callbacks.cancel || function () {};

  var events = {};
  events['keyup '+selector+', keydown '+selector] =
    function (evt) {
      if (evt.type === "keydown" && evt.which === 27) {
        // escape = cancel
        cancel.call(this, evt);

      } else if (evt.type === "keyup" && evt.which === 13) {
        // blur/return/enter = ok/submit if non-empty
        var value = String(evt.target.value || "");
        if (value)
          ok.call(this, value, evt);
        else
          cancel.call(this, evt);
      }
    };

  return events;
};

calculateAuctionTimeRemaining = function () {
  if (AuctionDetails.findOne()) {
    var auctionDetails = AuctionDetails.findOne()
    var auctionStartTime = moment(auctionDetails.startTime);
    var auctionEndTime = moment(auctionDetails.endTime);
    var now = moment().subtract(Session.get('clientTimeOffset'), 'ms');
    if (now.isBefore(auctionStartTime)) {
      Session.set('auctionHasBegun', false);
      Session.set('auctionHasEnded', false);
    } else  if (now.isAfter(auctionEndTime)) {
      Session.set('auctionHasBegun', true);
      Session.set('auctionHasEnded', true);
    } else {
      Session.set('auctionHasBegun', true);
      Session.set('auctionHasEnded', false);
      Session.set('auctionHoursRemaining', pad(auctionEndTime.diff(moment(), 'hours'), 2));
      Session.set('auctionMinutesRemaining', pad((auctionEndTime.diff(moment(), 'minutes') % 60), 2));
      Session.set('auctionSecondsRemaining', pad((auctionEndTime.diff(moment(), 'seconds') % 60), 2));
    }
  }
};

function pad(num, size) {
  var s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
};

cycleBigScreenItems = function () {
  if (Items.find()) {
    var furthestPage = Math.floor(Items.find().count() / 8);
    var currentPage = Session.get('bigScreenPage');
    if (currentPage < furthestPage) {
      Session.set('bigScreenPage', currentPage + 1);
    } else {
      Session.set('bigScreenPage', 0);
    }
  }
};

syncServerTime = function () {
  Meteor.call('getServerTime', function (error, result) {
    Session.set('clientTimeOffset', moment().diff(result));
  });
};

setDevice = function () {
  Session.set('isBeingViewedOnMobile', $(window).width() < 768);
};

truncateString = function (string, maxLength) {
  if (string.length > maxLength) {
    return string.substring(0,maxLength) + "...";
  }

  return string;
};

setWaypoints = function () {
  var waypoint = new Waypoint({
    element: document.getElementById('header'),
    handler: function(direction) {
      var header = $('#header');
      if (direction == 'down') {
        header.after('<div id="headerPlaceholder"></div>');
        $('#headerPlaceholder').css('height', header.height() + 100).css('width', header.css('width'));
        header.css('width', header.css('width'));
        header.addClass('sticky');
      } else {
        $('#headerPlaceholder').remove();
        header.css('width', 'initial');
        header.removeClass('sticky');
      }
    }
  });
};
