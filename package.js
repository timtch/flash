Package.describe({
  name: 'timtch:flash-messages-plus',
  summary: "A package to display flash messages to the user.",
  version: '0.0.1',
  git: 'https://github.com/timtch/flash-messages'

});

Package.onUse(function(api, where) {
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
      'FlashMessages', 
      'flashMessages'
      ], 'client');
  }
});

Package.onTest(function(api) {
  api.use('flash-messages-plus', 'client');
  api.use([
    'tinytest', 
    'test-helpers'
  ], 'client');

  api.addFiles('messages_tests.js', 'client');
});