class Reminder extends Backbone.Model
  defaults:
    'done': false
    'title': ''

  toggleDone: ->
    @set 'done', not @get('done')

# ----------------------------------------------------------------------------

class Reminders extends Backbone.Collection
  model: Reminder

# ----------------------------------------------------------------------------

class ReminderView extends Backbone.View
  events:
    'click .checkbox': 'toggleDone'
    'blur input': 'unedit'
    'dblclick .show': 'edit'

  initialize: (options={}) ->
    @model = options.model
    @state = new Backbone.Model()

  render: ->
    @$el.html Templates.item
    @listenTo @state,
      'change:editing': -> setTimeout (=> @$('input').focus()), 0

    @template = LM(this)
      .bind(@model)
      .locals(state: @state)
      .render()
    this

  toggleDone: (e) =>
    @model.toggleDone()
    return

  edit: ->
    @state.set 'editing', true

  unedit: ->
    @state.set 'editing', false

# ----------------------------------------------------------------------------

class RemindersListView extends Backbone.View
  events:
    'click .add-new-box': 'addItem'

  initialize: (options={}) ->
    @reminders = options.reminders
    @subviews = {}
    super()

  render: ->
    @$el.html Templates.list
    @template = LM(this)
      .locals(
        reminders: @reminders
        ReminderView: ReminderView
      ).render()
    this

  addItem: ->
    reminder = new Reminder()
    @reminders.add reminder
    @editItem reminder

  editItem: (model) ->
    @subviews[model.cid]?.edit()

# ----------------------------------------------------------------------------

Templates =
  list: '''
    <h3>
      <span @text="on(reminders, 'add remove reset') -> reminders.length"></span>
      Reminders
    </h3>
    <div class='list'>
      <ul @each='item in -> reminders'>
        <li @run='-> view.subviews[item.cid] = new ReminderView({ el: $el, model: item }).render()'>
        </li>
      </ul>
      <div class='add-new-box'>
        Add new...
      </div>
    </div>
  '''
  item: '''
    <div class='reminder-item'
      @class:done='attr("done")'
      @at:a='attr("done")'
      @class:editing='attr(state, "editing")'
    >
      <div class='show' @if='attr(state, "editing") -> !val'>
        <button class='checkbox'></button>
        <strong @text='attr("title")'></strong>
      </div>
      <div class='edit' @if='attr(state, "editing")'>
        <input type="text" @value='attr("title")' />
      </div>
    </div>
  '''

# ----------------------------------------------------------------------------

$ ->
  list = new Reminders([
    { done: false, title: "Do things" }
    { done: true, title: "Work fast" }
  ])

  new RemindersListView(reminders: list, el: $('[role~="reminders"]')).render()
