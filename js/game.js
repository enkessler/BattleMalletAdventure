function Game() {

  this.setup_game = function () {

    this.map_rooms = {};
    this.map_nodes = {};
    this.map_overlays = {};
    this.spawned_room = null;
    this.next_room_id = 1;
    this.next_overlay_id = 1;
    this.room_connections_clicked = 0;
    this.hero_hash = {};
    this.next_hero_id = 1;
    this.in_targeting_mode = false;
    this.in_move_creature_mode = false;
    this.buttons = {};
    this.rotate_room_button = null;
    this.targeted_creature_ids = [];
    this.configure_control_bar();
    this.configure_action_bar();
    this.configure_other_stuff();
  };


  this.toggle_connection_overlay = function (overlay_element) {
    //console.log('toggling overlay element');

    var activated;
    var overlay_object = game.map_overlays[overlay_element.id];
    var room_object = overlay_object.parent_object.parent_object;
    var connection_side = overlay_object.side;
    //console.log('connection side: ' + connection_side);

    var relevant_connection_overlays = get_connection_overlays_for(connection_side, room_object);

    for (var i = 0; i < relevant_connection_overlays.length; ++i) {
      //console.log('toggling node highlighting');
      var overlay = relevant_connection_overlays[i];

      overlay.highlighted = !overlay.highlighted;
      activated = overlay.highlighted;
    }

    if (activated) {
      ++game.room_connections_clicked;
    } else {
      --game.room_connections_clicked;
    }

    //console.log('activated room connections: ' + room_connections_clicked);
  };


  this.is_valid_connection_pair = function () {
    //console.log('Checking for valid room connection...');

    var connection_data = this.get_room_connection_data();
    var valid;
    var message;

    // Need to have two different rooms to connect
    if ((connection_data.connecting_room === undefined) || (connection_data.base_room === undefined)) {
      valid = false;
      message = 'Must choose two different rooms for connection';
    } else {
      //console.log('Room connected to base ' + connection_data.base_room.id + ' on side ' + connection_data.base_side + ': ' + connection_data.base_room[connection_data.base_side + '_room']);
      if (connection_data.base_room[connection_data.base_side + '_room'] != null) {
        valid = false;
        message = 'Cannot connect a new room to a connection that already connects to a room';
      } else {
        switch (connection_data.base_side) {
          case 'left':
            if (connection_data.connecting_side == 'right') {
              valid = true;
            } else {
              valid = false;
              message = 'Cannot make a connection between the ' + connection_data.base_side + ' and ' + connection_data.connecting_side + ' sides of two rooms';
            }
            break;
          case 'top':
            if (connection_data.connecting_side == 'bottom') {
              valid = true;
            } else {
              valid = false;
              message = 'Cannot make a connection between the ' + connection_data.base_side + ' and ' + connection_data.connecting_side + ' sides of two rooms';
            }
            break;
          case 'right':
            if (connection_data.connecting_side == 'left') {
              valid = true;
            } else {
              valid = false;
              message = 'Cannot make a connection between the ' + connection_data.base_side + ' and ' + connection_data.connecting_side + ' sides of two rooms';
            }
            break;
          case 'bottom':
            if (connection_data.connecting_side == 'top') {
              valid = true;
            } else {
              valid = false;
              message = 'Cannot make a connection between the ' + connection_data.base_side + ' and ' + connection_data.connecting_side + ' sides of two rooms';
            }
            break;
          default:
            console.log("Don't know how to connection side of '" + connection_data.base_side + "'");
        }
      }
    }


    return {
      validity: valid,
      message: message
    };
  };


  this.spawn_room = function () {
    //console.log('Spawning a new room...');
    // Determine new room
    this.spawned_room = new TCorridorRoom(this.next_room_id); // Just a hard-coded corridor for now
    ++this.next_room_id;
    this.spawned_room.style_classes.push('spawned_room');
    //console.log('new rooms id: ' + next_room.id);
    // Display new room and rotation button
    this.rotate_room_button.visible = true;

    this.rebuild_screen_in_place();
  };


  this.connect_new_room = function () {
    //console.log('Connecting new room...');

    // Get connection data
    var connection_data = this.get_room_connection_data();

    // Connect objects
    this.connect_rooms(connection_data.base_room, connection_data.base_side, connection_data.connecting_room, connection_data.connecting_side);

    //Turn off connection highlighting
    for (var key in this.map_overlays) {
      if (this.map_overlays.hasOwnProperty(key)) {
        var overlay = this.map_overlays[key];

        if (overlay.highlighted) {
          //console.log('Removing highlighting from overlay ' + overlay.id);
          overlay.highlighted = false;
        }
      }
    }

    // Remove 'spawn' status from new room
    this.spawned_room.style_classes.splice(this.spawned_room.style_classes.indexOf('spawned_room'), 1);
    this.spawned_room = null;

    //console.log('connection complete');
  };


  this.get_room_connection_data = function () {
    //console.log('getting room connection data...');

    var connection_overlays = game.map_overlays;

    var room_sets = [];
    for (var key in connection_overlays) {
      if (connection_overlays.hasOwnProperty(key)) {
        var overlay = connection_overlays[key];

        if (overlay.highlighted) {
          //console.log('working with overlay (' + overlay.id + ')');
          var connection_side = overlay.side;
          //console.log('connection side: ' + connection_side);
          var parent_room_object = overlay.parent_object.parent_object;
          //console.log('parent room found: ' + parent_room_element.id);

          room_sets.push({room_object: parent_room_object, connection_side: connection_side});
        }
      }
    }

    //console.log('final room sets:' + room_sets);
    //for (var i = 0; i < room_sets.length; ++i) {
    //    var room_set = room_sets[i];
    //    console.log('room_set:');
    //    console.log('element:' + room_set.room_element.id);
    //    console.log('side:' + room_set.connection_side);
    //}

    var found_ids = [];
    var rooms_to_connect = [];

    for (var i = 0; i < room_sets.length; ++i) {
      var room_set = room_sets[i];
      //console.log('found ids: ' + found_ids);
      //console.log('checking for id: ' + room_set.room_element);
      //console.log('index: : ' + found_ids.indexOf(room_set.room_element));
      if (found_ids.indexOf(room_set.room_object.id) == -1) {
        //console.log('unique room found');
        found_ids.push(room_set.room_object.id);
        rooms_to_connect.push(room_set);
      }
    }

    //console.log('final room sets');
    //for (var i = 0; i < rooms_to_connect.length; ++i) {
    //  var room_set = rooms_to_connect[i];
    //  console.log('room_set:');
    //  console.log('object:' + room_set.room_object.id);
    //  console.log('side:' + room_set.connection_side);
    //}

    rooms_to_connect.sort(function (a, b) {
      return a.room_object.id > b.room_object.id
    });

    //console.log('sorted room sets');
    //for (var i = 0; i < rooms_to_connect.length; ++i) {
    //    var room_set = rooms_to_connect[i];
    //    console.log('room_set:');
    //    console.log('element:' + room_set.room_element.id);
    //    console.log('side:' + room_set.connection_side);
    //}


    // There should be two rooms found with highlighting and the newly spawned room should have the higher id
    var base_room_set = rooms_to_connect[0];
    var spawned_room_set = rooms_to_connect[1];
    var base_room_object = rooms_to_connect[0].room_object;
    var spawned_room_object = game.spawned_room;


//  for (i = 0; i < map_rooms.length; ++i) {
//    var map_room = map_rooms[i];
//    //console.log('checking object: ' + map_room.id);
//    //console.log('connecting room id: ' + connected_room_set.room_element.id);
//
//    if (map_room.id == base_room_set.room_element.id) {
//      base_room_object = map_room;
//    }
//  }

    //console.log('room_objects:');
    //console.log('connected_room:' + connected_room_object);
    //console.log('spawned:' + spawned_room_object);

    // It is possible that the same room has been chosen for both connections, in which case there will be no second room
    if (spawned_room_set === undefined) {
      spawned_room_object = undefined;
      spawned_room_set = {
        room_element: undefined,
        connection_side: undefined
      };
    }

    var connection_data = {
      base_room: base_room_object,
      base_side: base_room_set.connection_side,
      connecting_room: spawned_room_object,
      connecting_side: spawned_room_set.connection_side
    };

    //console.log('Final connection data:');
    //console.log('base room: ' + connection_data.base_room.id);
    //console.log('base side: ' + connection_data.base_side);
    //console.log('connecting room: ' + connection_data.connecting_room);
    //console.log('connecting side: ' + connection_data.connecting_side);


    return connection_data;
  };


  this.connect_rooms = function (base_room_object, base_room_set_connection_side, connected_room_object, connected_room_set_connection_side) {

    switch (base_room_set_connection_side) {
      case 'top':
        base_room_object.top_room = connected_room_object;
        break;
      case 'right':
        base_room_object.right_room = connected_room_object;
        break;
      case 'bottom':
        base_room_object.bottom_room = connected_room_object;
        break;
      case 'left':
        base_room_object.left_room = connected_room_object;
        break;
      default:
        console.log("Don't know how to handle a connection side of '" + base_room_set_connection_side + "'");
    }

    switch (connected_room_set_connection_side) {
      case 'top':
        connected_room_object.top_room = base_room_object;
        break;
      case 'right':
        connected_room_object.right_room = base_room_object;
        break;
      case 'bottom':
        connected_room_object.bottom_room = base_room_object;
        break;
      case 'left':
        connected_room_object.left_room = base_room_object;
        break;
      default:
        console.log("Don't know how to handle a connection side of '" + connected_room_set_connection_side + "'");
    }
  };


  this.rebuild_screen = rebuild_screen;
  this.rebuild_control_bar = rebuild_control_bar;
  this.rebuild_action_bar = rebuild_action_bar;
  this.rebuild_map = rebuild_map;
  this.rebuild_map_in_place = rebuild_map_in_place;
  this.rebuild_screen_in_place = rebuild_screen_in_place;


  this.configure_control_bar = function () {
    var bar = new ControlBar();
    this.control_bar = bar;

    var button = new StartGameButton();
    bar.start_game_button = button;
    this.buttons[button.id] = button;

    button = new SpawnRoomButton();
    bar.spawn_room_button = button;
    this.buttons[button.id] = button;

    // Starting the game is available immediately
    bar.start_game_button.visible = true;

    // Spawning rooms not available until game starts
    bar.spawn_room_button.visible = false;
  };


  this.configure_action_bar = function () {
    var bar = new ActionBar();
    this.action_bar = bar;

    var button = new MoveCreatureButton();
    bar.move_creature_button = button;
    this.buttons[button.id] = button;

    // Game actions are not available until the game has started
    bar.visible = false;
    bar.move_creature_button.visible = false;
  };


  this.configure_other_stuff = function () {
    var button = new RotateRoomButton();
    game.rotate_room_button = button;
    this.buttons[button.id] = button;

    // Rotating spawn room not available until a room is spawned
    this.rotate_room_button.visible = false;
  };


  this.start_game = function () {
    // Create a starting room
    this.generate_starting_room();


    // Turn on room spawning
    this.control_bar.spawn_room_button.visible = true;

    // Turn on action menu
    this.action_bar.visible = true;
    this.action_bar.move_creature_button.visible = true;

    // Turn off start button
    this.control_bar.start_game_button.visible = false;

    // Display the initial map
    this.rebuild_screen();
  };


  this.generate_starting_room = function () {
    var starting_room = new CorridorRoom(this.next_room_id);
    ++this.next_room_id;

    var starting_hero = new ImperialNoble(this.next_hero_id);
    ++this.next_hero_id;

    starting_room.room_nodes[0].occupants.push(starting_hero);
    starting_hero.current_room_node = starting_room.room_nodes[0];
  };


  this.toggle_movement_phase = function () {
    this.in_targeting_mode = !this.in_targeting_mode;
    this.in_move_creature_mode = !this.in_move_creature_mode;
    this.action_bar.move_creature_button.highlighted = !this.action_bar.move_creature_button.highlighted;

    this.rebuild_action_bar();
  };
}
