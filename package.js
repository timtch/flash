Package.describe({
  name: 'timtch:flash',
  summary: "A package to display flash messages to the user.",
  version: '0.1.1',
  git: 'https://github.com/timtch/flash'

});

Package.onUse(function(api) {
  api.versionsFrom("METEOR@0.9.0");

  api.use([
    'minimongo', 
    'mongo-livedata', 
    'templating', 
    'coffeescript'
    ], 'client');

    api.addFiles([
      'messages.coffee', 
      'messages_list.html', 
      'messages_list.coffee'
      ], 'client');

  if (typeof api.export !== 'undefined') {
    api.export([
      'Flash', 
      'flash'
      ], 'client');
  }
});

// Package.onTest(function(api) {
//   api.use('flash-messages-plus', 'client');
//   api.use([
//     'tinytest', 
//     'test-helpers'
//   ], 'client');

//   api.addFiles('messages_tests.js', 'client');
// });