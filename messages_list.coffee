Template.flashMessage.events
  "click .close": (e, tmpl) ->
    e.preventDefault()
    flash.remove tmpl.data._id

Template.flashMessage.rendered = ->
  #console.log "flash-message.rendered: %o, FM.options=%o", this, Flash.options
  message = @data
  activeClass = Flash.options.activeClass
  $alert = $(@find ".#{Flash.options.alertClass}")
  Meteor.defer ->
    flash.update message._id,
      $set:
        seen: true
    $alert.addClass activeClass

  if message.options and message.options.autoHide
    setTimeout ->
      $alert.removeClass activeClass
      setTimeout ->
        flash.remove _id: message._id
      ,
        Flash.options.transitionWait
    ,
      message.options.hideDelay

Template.flash.helpers
  messages: ->
    #console.log "messages: this=%o", this
    id = this.id
    if id
      query = 'options.id': id
    else
      query =
        'options.id':
          $exists: false

    #console.log "messages: query=%o", query

    if flash.find(query).count()
      # do we really want to unconditionally scroll like this?
      $('html, body').animate
        scrollTop: 0
      ,
        200
      flash.find(query)

