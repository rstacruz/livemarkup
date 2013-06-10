class Reminder extends Backbone.Model
  defaults:
    'done': false
    'title': ''

  toggleDone: ->
    @set 'done', not @get('done')

class Reminders extends Backbone.Collection
  model: Reminder

class ReminderView extends Backbone.View
  events:
    'click .checkbox': 'toggleDone'

  initialize: (options={}) ->
    @model = options.model
    @state = new Backbone.Model

  render: ->
    @$el.html Templates.item
    @template = LM(this)
      .bind(@model)
      .locals(state: @state)
      .render()

  toggleDone: (e) =>
    @model.toggleDone()
    return

  edit: ->
    @state.set 'editing', true

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

  addItem: ->
    reminder = new Reminder()
    @reminders.add reminder
    # @editItem reminder

  editItem: (model) ->
    @subviews[model.cid]?.edit()

# ----------------------------------------------------------------------------

Templates =
  list: '''
    <h3>Reminders</h3>
    <div class='list'>
      <ul @each:item='-> reminders'>
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
      @class:editing='attr(state, "editing")'
    >
      <button class='checkbox'></button>
      <strong @text='attr("title")'></strong>
    </div>
  '''

# ----------------------------------------------------------------------------

$ ->
  list = new Reminders([
    { done: false, title: "Do things" }
    { done: true, title: "Work fast" }
  ])

  new RemindersListView(reminders: list, el: $('[role~="reminders"]')).render()
