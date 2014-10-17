flash = new Meteor.Collection null

send = (message, type, options) ->
  #console.log 'send-message: msg=%s, type=%s, options=%o, defaults=%o', message, type, options, defaults
  options = _.defaults options || {}, Flash.options
  msgOptions = _.pick options, ['autoHide', 'hideDelay', 'id']
  #console.log "send-message: msg-options=%o", msgOptions
  flash.insert
    message: message
    style: "#{options.alertClass} #{options[type + 'Classes']} #{options.transitionClass}"
    seen: false
    options: msgOptions

Flash =
  warning: (message, options) ->
    send message, 'warning', options

  error: (message, options) ->
    send message, 'error', options

  success: (message, options) ->
    send message, 'success', options

  info: (message, options) ->
    send message, 'info', options

  clear: ->
    flash.remove seen: true

  configure: (options) ->
    #console.log 'configure: options=%o', options
    @options = _.defaults options || {}, @options

  options:
    autoHide: true
    hideDelay: 5000
    activeClass: 'in'
    alertClass: 'alert'
    transitionClass: 'fade'
    warningClasses: 'alert-warning'
    errorClasses: 'alert-error alert-danger'
    successClasses: 'alert-success'
    infoClasses: 'alert-info'
    buttonClasses: 'close'
    transitionWait: 2000