function ControlBar() {
  this.id = 'control_bar';
  this.visible = true;
  this.spawn_room_button = null;
  this.start_game_button = null;
}


function StartGameButton() {
  this.id = 'start_game_button';
  this.visible = false;
  this.text = 'Start Game';

  this.on_click_function = function () {
    game.start_game();
    event.stopPropagation();
  }
}


function SpawnRoomButton() {
  this.id = 'spawn_room_button';
  this.visible = false;
  this.text = 'Spawn Room';

  this.on_click_function = function () {
    game.spawn_room();
    event.stopPropagation();
  }
}


function RotateRoomButton() {
  this.id = 'rotate_room_button';
  this.visible = false;
  this.text = 'Rotate Room';

  this.on_click_function = function () {
    // Spawned room object should exist by now
    rotate_room(game.spawned_room);
    rebuild_map_in_place();
    event.stopPropagation();
  };
}


function ActionBar() {
  this.id = 'action_bar';
  this.visible = false;
  this.move_creature_button = null;
}


function MoveCreatureButton() {
  this.id = 'move_creature_button';
  this.visible = false;
  this.highlighted = false;
  this.text = 'Move Creature';

  this.on_click_function = function () {
    game.toggle_movement_phase();
    event.stopPropagation();

  }
}
