Attributes:

    attr('title')
    -> val.toUpperCase()
    attr('first_name last_name') -> model.getFullName()

Directives:

    <div @text="on('change:first_name')">
    <div @text="on('first_name')">
    <div @text="on(person, 'first_name')">
    <div @text="attr('description')">
    <div @text="attr(state, 'enabled')">

    <div @class(active)="attr('enabled')">
    <div @include(person/info)>
    <div @subview(PhotoView)="-> this.photo">

    <input @@type='attr("type")'>

    <div @html="attr('first_name')">
    <div @html="attr('first_name') -> val.toUpperCase()">

    <textarea @value="attr('description')">
    <textarea @value="attr('description')">

    <div @showIf="attr('premium')">
    <div @showIf="attr(user, 'premium')">
    <div @showIf="-> user.isPremium()">

    <ul @each(person)="-> model.people()">
      <li @subview(PhotoView)="-> person">
      </li>
    </ul>

Example
-------

Examples

    <strong>{{ attr('title') }}</strong>
    <em>{{ attr('author') -> "by " + val }}</em>

Attributes

    <input type='text' @value="attr('description')">

    <div class='user' @class(active)="-> user.isActive()">
    <div class='user' @class(admin)="-> attr('admin')">

    <div class='user' @@class='-> "text " + user.getCSSClass()'>

If block

    <div class='premium' @showIf="attr('premium')">
      Premium user
    </div>

    <div class='premium' @showIf="attr('admin_change') -> model.canAdmin()">
      Premium user
    </div>

Each


    <ul @each(person)="-> model.people">
      <li @subview(PersonView)="-> person">
    </ul>
