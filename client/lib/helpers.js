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
      Session.set('auctionHoursRemaining', pad(Math.max(auctionEndTime.diff(moment(), 'hours'), 0), 2));
      Session.set('auctionMinutesRemaining', pad(Math.max((auctionEndTime.diff(moment(), 'minutes') % 60), 0), 2));
      Session.set('auctionSecondsRemaining', pad(Math.max((auctionEndTime.diff(moment(), 'seconds') % 60), 0), 2));
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

setWaypoints = function () {
  var waypoint = new Waypoint({
    element: document.getElementById('main'),
    handler: function(direction) {
      var header = $('#fixedHeader .header');
      if (direction == 'down') {
        header.addClass('visible');
      } else {
        header.removeClass('visible');
      }
    }
  });
};

LightenDarkenColor = function (col, amt) {
  var usePound = false;

  if (col[0] == "#") {
    col = col.slice(1);
    usePound = true;
  }

  var num = parseInt(col,16);
  var r = (num >> 16) + amt;

  if (r > 255) r = 255;
  else if  (r < 0) r = 0;

  var b = ((num >> 8) & 0x00FF) + amt;

  if (b > 255) b = 255;
  else if  (b < 0) b = 0;

  var g = (num & 0x0000FF) + amt;

  if (g > 255) g = 255;
  else if (g < 0) g = 0;

  return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
}
