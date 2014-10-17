// init
Flash.configure({transitionWait: 0})
var allowDelay = 500;

// Helpers

var messagesCount = function () {
    return flash.find({'options.id': {$exists: false}}).count();
}

var findOneMessage = function () {
    return flash.findOne({});
}

var cleanMessages = function () {
    flash.remove({});
}

// Tests

Tinytest.add('flash-messages - Messages Collection works', function (test) {
    test.equal(messagesCount(), 0);
});

Tinytest.add('flash-messages - Add alert message', function (test) {
    cleanMessages();
    var message = 'This is an alert message';
    Flash.alert(message);

    test.equal(messagesCount(), 1);

    test.equal(findOneMessage().message, message, 'Alert messages should be ' + message);

    test.equal(findOneMessage().style, Flash.options.alertClasses, 'Style should match options');

    test.equal(findOneMessage().seen, false, 'Seen should be false');
});

Tinytest.add('flash-messages - Add error message', function (test) {
    cleanMessages();
    var message = 'This is an error message';
    Flash.error(message);

    test.equal(messagesCount(), 1);

    test.equal(findOneMessage().message, message, 'Error messages should be ' + message);

    test.equal(findOneMessage().style, Flash.options.errorClasses, 'Style should match options');

    test.equal(findOneMessage().seen, false, 'Seen should be false');
});

Tinytest.add('flash-messages - Add success message', function (test) {
    cleanMessages();
    var message = 'This is a success message';
    Flash.success(message);

    test.equal(messagesCount(), 1);

    test.equal(findOneMessage().message, message,
        'Success messages should be ' + message);

    test.equal(findOneMessage().style, Flash.options.successClasses, 'Style should match options');

    test.equal(findOneMessage().seen, false, 'Seen should be false');
});

Tinytest.add('flash-messages - Add info message', function (test) {
    cleanMessages();
    var message = 'This is an info message';
    Flash.info(message);

    test.equal(messagesCount(), 1);

    test.equal(findOneMessage().message, message,
        'Info messages should be ' + message);

    test.equal(findOneMessage().style, Flash.options.infoClasses, 'Style should match options');

    test.equal(findOneMessage().seen, false, 'Seen should be false');
});

Tinytest.add("flash-messages - Don't remove unseen messages", function (test) {
    cleanMessages();
    Flash.error('message');
    Flash.clear();
    test.equal(messagesCount(), 1);
});

testAsyncMulti('flash-messages - Remove seen messages', [
    function (test, expect) {
        cleanMessages();
        Flash.error('message');

        OnscreenDiv(Spark.render(Template.flash));
        Meteor.setTimeout(expect(function () {
            test.equal(messagesCount(), 1);
            test.equal(flash.find({seen: false}).count(), 0,
                'Messages should be marqued as seen (seen: true)');
            Flash.clear();
            test.equal(flash.find({seen: true}).count(), 0,
                'Messages seen should be cleared');
        }), allowDelay);
    }
]);

testAsyncMulti('flash-messages - Remove when click close button', [
    function (test, expect) {
        cleanMessages();
        Flash.error('message');

        OnscreenDiv(Spark.render(Template.flash));
        Meteor.setTimeout(expect(function () {
            test.equal(messagesCount(), 1);
            clickElement(document.getElementsByClassName('close')[0]);
            test.equal(messagesCount(), 0);
        }), allowDelay);
    }
]);

testAsyncMulti('flash-messages - Remove after default delay', [
    function (test, expect) {
        cleanMessages();
        Flash.error('message');

        OnscreenDiv(Spark.render(Template.flash));
        Meteor.setTimeout(expect(function () {
            test.equal(messagesCount(), 1);
        }), allowDelay); // wait allowDelay ms then test to see if message made it to local collection
        Meteor.setTimeout(expect(function () {
            test.equal(messagesCount(), 0);
        }), Flash.options.hideDelay + allowDelay);
    }
]);

testAsyncMulti("flash-messages - Don't remove if autoHide is false", [
    function (test, expect) {
        cleanMessages();
        Flash.error('message', { autoHide: false });

        OnscreenDiv(Spark.render(Template.flash));
        Meteor.setTimeout(expect(function () {
            test.equal(messagesCount(), 1);
        }), allowDelay);
        Meteor.setTimeout(expect(function () {
            test.equal(messagesCount(), 1);
        }), Flash.options.hideDelay + allowDelay);
    }
]);

testAsyncMulti("flash-messages - Don't remove with global config", [
    function (test, expect) {
        cleanMessages();
        var options = _.clone(Flash.options);
        Flash.configure({ autoHide: false });
        Flash.error('message');
        Flash.options = options

        OnscreenDiv(Spark.render(Template.flash));
        Meteor.setTimeout(expect(function () {
            test.equal(messagesCount(), 1);
        }), allowDelay);
        Meteor.setTimeout(expect(function () {
            test.equal(messagesCount(), 1);
        }), Flash.options.hideDelay + allowDelay);
    }
]);

testAsyncMulti('flash-messages - specify custom auto hide delay', [
    function (test, expect) {
        cleanMessages();
        var hideDelay = 1000;
        Flash.error('message', { hideDelay: hideDelay });

        OnscreenDiv(Spark.render(Template.flash));
        Meteor.setTimeout(expect(function () {
            test.equal(messagesCount(), 1);
        }), allowDelay);
        Meteor.setTimeout(expect(function () {
            test.equal(messagesCount(), 0);
        }), hideDelay + allowDelay );
    }
]);

testAsyncMulti('flash-messages - Set auto hide delay to 1 second with global config', [
    function (test, expect) {
        cleanMessages();
        var options = _.clone(Flash.options);
        var hideDelay = 1000;
        Flash.configure({ hideDelay: hideDelay });
        Flash.error('message');
        Flash.options = options

        OnscreenDiv(Spark.render(Template.flash));
        Meteor.setTimeout(expect(function () {
            test.equal(messagesCount(), 1);
        }), allowDelay);
        Meteor.setTimeout(expect(function () {
            test.equal(messagesCount(), 0);
        }), hideDelay + allowDelay);
    }
]);

testAsyncMulti('flash-messages - Override global config', [
    function (test, expect) {
        cleanMessages();
        var options = _.clone(Flash.options);
        Flash.configure({ autoHide: false, hideDelay: 8000 });
        var hideDelay = 1000;
        Flash.error('message', { autoHide: true, hideDelay: hideDelay });
        Flash.options = options

        OnscreenDiv(Spark.render(Template.flash));
        Meteor.setTimeout(expect(function () {
            test.equal(messagesCount(), 1);
        }), allowDelay);
        Meteor.setTimeout(expect(function () {
            test.equal(messagesCount(), 0);
        }), hideDelay + allowDelay);
    }
]);