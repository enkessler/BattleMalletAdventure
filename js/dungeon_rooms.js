function RoomNode(id, room_styles, rotation, parent) {
  this.id = id;
  game.map_nodes[id] = this;

  this.style_classes = room_styles;
  this.rotation = rotation;
  this.overlays = [];
  this.occupants = [];
  this.parent_object = parent;

  // Add a connection overlay if needed
  if (room_styles.join(' ').indexOf('_connect_') != -1) {
    var overlay_object = new ConnectionOverlay(game.next_overlay_id);
    ++game.next_overlay_id;
    overlay_object.parent_object = this;
    overlay_object.side = determine_connection_side(room_styles);

    this.overlays.push(overlay_object);
  }

  this.on_click_function = function () {
    //console.log('Room node ' + this.id + ' was clicked');
    if (game.in_move_creature_mode) {
      //console.log('Currently targetted creatures: ' + game.targeted_creature_ids);
      // Assuming just one targeted creature, one occupant of the original node, and an empty node clicked
      var targeted_hero = game.hero_hash[game.targeted_creature_ids[0]];
      var source_node = targeted_hero.current_room_node;
      var target_node = game.map_nodes[this.id];

      target_node.occupants.push(targeted_hero);
      source_node.occupants.pop();
      targeted_hero.current_room_node = target_node;
      targeted_hero.highlighted = false;
      game.targeted_creature_ids.splice(game.targeted_creature_ids.indexOf(targeted_hero.id), 1);

      game.in_targeting_mode = false;
      game.in_move_creature_mode = false;
      game.action_bar.move_creature_button.highlighted = false;

      game.rebuild_screen_in_place();
      //console.log('Currently targetted creatures: ' + game.targeted_creature_ids);
    }

    event.stopPropagation();
  };
}

function TombRoom() {
  this.room_cells = [['d', 'd', 'd', 'd'], ['d', 'd', 'd', 'd'],
    ['d', 'd', 'd', 'd'], ['d', 'd', 'd', 'd'],
    ['d', 'd', 'd', 'd'], ['d', 'd', 'd', 'd'],
    ['d', 'd', 'd', 'd'], ['d', 'd', 'd', 'd']];
}

function StairsRoom() {
  this.room_cells = [['d', 'd', 'd', 'd', 'd', 'd'],
    ['d', 'd', 'd', 'd', 'd', 'd']];
}

function CorridorRoom(id, rotation) {
  //console.log('creating a Corridor room with id ' + id);
  game.map_rooms[id] = this;
  this.id = id;
  this.style_classes = ['corridor_room', 'dungeon_room'];

  // Default values
  if (rotation === undefined) {
    //console.log('using default rotatation');
    this.rotation = 0;
  } else {
    //console.log('using rotatation' + rotation);
    this.rotation = rotation;
  }

  this.left_room = null;
  this.top_room = null;
  this.right_room = null;
  this.bottom_room = null;


  this.room_nodes = [
    new RoomNode(this.id + '_' + 1, ['corridor_node', 'corridor_node_row_1', 'corridor_node_col_1', 'left_connect_1'], this.rotation, this),
    new RoomNode(this.id + '_' + 2, ['corridor_node', 'corridor_node_row_1', 'corridor_node_col_2'], this.rotation, this),
    new RoomNode(this.id + '_' + 3, ['corridor_node', 'corridor_node_row_1', 'corridor_node_col_3'], this.rotation, this),
    new RoomNode(this.id + '_' + 4, ['corridor_node', 'corridor_node_row_1', 'corridor_node_col_4'], this.rotation, this),
    new RoomNode(this.id + '_' + 5, ['corridor_node', 'corridor_node_row_1', 'corridor_node_col_5'], this.rotation, this),
    new RoomNode(this.id + '_' + 6, ['corridor_node', 'corridor_node_row_1', 'corridor_node_col_6', 'right_connect_1'], this.rotation, this),
    new RoomNode(this.id + '_' + 7, ['corridor_node', 'corridor_node_row_2', 'corridor_node_col_1', 'left_connect_2'], this.rotation, this),
    new RoomNode(this.id + '_' + 8, ['corridor_node', 'corridor_node_row_2', 'corridor_node_col_2'], this.rotation, this),
    new RoomNode(this.id + '_' + 9, ['corridor_node', 'corridor_node_row_2', 'corridor_node_col_3'], this.rotation, this),
    new RoomNode(this.id + '_' + 10, ['corridor_node', 'corridor_node_row_2', 'corridor_node_col_4'], this.rotation, this),
    new RoomNode(this.id + '_' + 11, ['corridor_node', 'corridor_node_row_2', 'corridor_node_col_5'], this.rotation, this),
    new RoomNode(this.id + '_' + 12, ['corridor_node', 'corridor_node_row_2', 'corridor_node_col_6', 'right_connect_2'], this.rotation, this)];
}

function LCorridorRoom() {
  this.room_cells = [['d', 'd', 'd', 'd'], ['d', 'd', 'd', 'd'],
    ['d', 'd', ' ', ' '], ['d', 'd', ' ', ' ']];
}

function TCorridorRoom(id, rotation) {
  //console.log('creating a TCorridor room with id ' + id);
  game.map_rooms[id] = this;
  this.id = id;
  this.style_classes = ['t_corridor_room', 'dungeon_room'];

  // Default values
  if (rotation === undefined) {
    //console.log('using default rotatation');
    this.rotation = 0;
  } else {
    //console.log('using rotatation' + rotation);
    this.rotation = rotation;
  }

  this.left_room = null;
  this.top_room = null;
  this.right_room = null;
  this.bottom_room = null;

  this.room_nodes = [
    new RoomNode(this.id + '_' + 1, ['t_corridor_node', 't_corridor_node_row_1', 't_corridor_node_col_1', 'left_connect_1'], this.rotation, this),
    new RoomNode(this.id + '_' + 2, ['t_corridor_node', 't_corridor_node_row_1', 't_corridor_node_col_2'], this.rotation, this),
    new RoomNode(this.id + '_' + 3, ['t_corridor_node', 't_corridor_node_row_1', 't_corridor_node_col_3', 'top_connect_1'], this.rotation, this),
    new RoomNode(this.id + '_' + 4, ['t_corridor_node', 't_corridor_node_row_1', 't_corridor_node_col_4', 'top_connect_2'], this.rotation, this),
    new RoomNode(this.id + '_' + 5, ['t_corridor_node', 't_corridor_node_row_1', 't_corridor_node_col_5'], this.rotation, this),
    new RoomNode(this.id + '_' + 6, ['t_corridor_node', 't_corridor_node_row_1', 't_corridor_node_col_6', 'right_connect_1'], this.rotation, this),
    new RoomNode(this.id + '_' + 7, ['t_corridor_node', 't_corridor_node_row_2', 't_corridor_node_col_1', 'left_connect_2'], this.rotation, this),
    new RoomNode(this.id + '_' + 8, ['t_corridor_node', 't_corridor_node_row_2', 't_corridor_node_col_2'], this.rotation, this),
    new RoomNode(this.id + '_' + 9, ['t_corridor_node', 't_corridor_node_row_2', 't_corridor_node_col_3', 'bottom_connect_1'], this.rotation, this),
    new RoomNode(this.id + '_' + 10, ['t_corridor_node', 't_corridor_node_row_2', 't_corridor_node_col_4', 'bottom_connect_2'], this.rotation, this),
    new RoomNode(this.id + '_' + 11, ['t_corridor_node', 't_corridor_node_row_2', 't_corridor_node_col_5'], this.rotation, this),
    new RoomNode(this.id + '_' + 12, ['t_corridor_node', 't_corridor_node_row_2', 't_corridor_node_col_6', 'right_connect_2'], this.rotation, this)];
}
