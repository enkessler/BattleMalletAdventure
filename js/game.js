var map_rooms = {};
var map_nodes = {};
var map_overlays = {};
var spawned_room = null;
var next_room_id = 1;
var next_overlay_id = 1;
var room_connections_clicked = 0;
var hero_hash = {};
var next_hero_id = 1;

$(document).ready(function () {
  setup_game();
});


function toggle_connection_overlay(overlay_element) {
  //console.log('toggling overlay element');

  var activated;
  var overlay_object = map_overlays[overlay_element.id];
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
    ++room_connections_clicked;
  } else {
    --room_connections_clicked;
  }

  //console.log('activated room connections: ' + room_connections_clicked);
}


function room_node_connection_overlay_click_function() {
  //console.log('setting toggle function');
  toggle_connection_overlay(this);

  if (room_connections_clicked == 2) {
    var validity_data = is_valid_connection_pair();
    if (validity_data.validity) {
      connect_new_room();

      var rotation_button = document.getElementById('rotate_room_button');
      rotation_button.style.display = 'none';

      room_connections_clicked = 0;
    } else {
      alert(validity_data.message);
      toggle_connection_overlay(this);
    }
  }

  rebuild_map_in_place();
}


function is_valid_connection_pair() {
  //console.log('Checking for valid room connection...');

  var connection_data = get_room_connection_data();
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
}


function spawn_room() {
  //console.log('Spawning a new room...');
  // Determine new room
  spawned_room = new TCorridorRoom(next_room_id); // Just a hard-coded corridor for now
  ++next_room_id;
  spawned_room.style_classes.push('spawned_room');
  //console.log('new rooms id: ' + next_room.id);
  // Display new room and rotation button
  var rotation_button = document.getElementById('rotate_room_button');
  rotation_button.style.display = 'inline';

  rebuild_map_in_place();
}


function connect_new_room() {
  //console.log('Connecting new room...');

  // Get connection data
  var connection_data = get_room_connection_data();

  // Connect objects
  connect_rooms(connection_data.base_room, connection_data.base_side, connection_data.connecting_room, connection_data.connecting_side);

  //Turn off connection highlighting
  for (var key in map_overlays) {
    if (map_overlays.hasOwnProperty(key)) {
      var overlay = map_overlays[key];

      if (overlay.highlighted) {
        //console.log('Removing highlighting from overlay ' + overlay.id);
        overlay.highlighted = false;
      }
    }
  }

  // Remove 'spawn' status from new room
  spawned_room.style_classes.splice(spawned_room.style_classes.indexOf('spawned_room'), 1);
  spawned_room = null;

  //console.log('connection complete');
}


function get_room_connection_data() {
  //console.log('getting room connection data...');

  var connection_overlays = map_overlays;

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
  var spawned_room_object = spawned_room;


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
}


function connect_rooms(base_room_object, base_room_set_connection_side, connected_room_object, connected_room_set_connection_side) {

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
}


function build_room(room_data) {
  // Draw the room

  var room_object = room_data.room;
  var base_div = room_data.parent_div;
  var base_connection_side = room_data.side;

  var left_offset;
  var top_offset;

  var room_div = draw_room(room_object);

  if (base_div == null) {
    //console.log('No parent div. Using default offsets...');
    left_offset = "100";
    top_offset = "100";
  } else {
    //console.log('Parent div found (' + base_div.id + '). Calculating offsets...');
    //console.log('Parent room styling: ' + getComputedStyle(base_div));
    //console.log('Parent room width: ' + getComputedStyle(base_div).getPropertyValue('width'));
    //console.log('Parent room top: ' + getComputedStyle(base_div).getPropertyValue('top'));
    //console.log('Parent room left: ' + getComputedStyle(base_div).getPropertyValue('left'));
    //console.log('Connectd room is to the: ' + base_connection_side);
    left_offset = left_offset_for(room_div, base_connection_side, base_div);
    top_offset = top_offset_for(room_div, base_connection_side, base_div);
  }

  //console.log('room offsets:');
  //console.log('left offset:' + left_offset);
  //console.log('top offset:' + top_offset);
  //console.log('map room rotation:' + room_object.rotation);
  position_room(room_div, left_offset, top_offset, null);

  // Generate any connecting rooms
  var connected_rooms = [];

  //console.log('Adjoining rooms -');
  //console.log('left room: ' + room_object.left_room);
  //console.log('top room: ' + room_object.top  );
  //console.log('right room: ' + room_object.right);
  //console.log('bottom room: ' + room_object.bottom);


  // Check for left adjoining room
  if (room_object.left_room) {
    //console.log('Adding a left room');
    //console.log('Adding a left room to div "' + room_div.id + '"');

    new_room_data = {
      room: room_object.left_room,
      parent_div: room_div,
      side: 'left'
    };

    connected_rooms.push(new_room_data);
  }

  // Check for top adjoining room
  if (room_object.top_room) {
    //console.log('Adding a top room to div "' + room_div.id + '"');
    new_room_data = {
      room: room_object.top_room,
      parent_div: room_div,
      side: 'top'
    };

    connected_rooms.push(new_room_data);
  }

  // Check for right adjoining room
  if (room_object.right_room) {
    //console.log('Adding a right room to div "' + room_div.id + '"');
    new_room_data = {
      room: room_object.right_room,
      parent_div: room_div,
      side: 'right'
    };

    connected_rooms.push(new_room_data);
  }

  // Check for bottom adjoining room
  if (room_object.bottom_room) {
    //console.log('Adding a bottom room to div "' + room_div.id + '"');
    var new_room_data = {
      room: room_object.bottom_room,
      parent_div: room_div,
      side: 'bottom'
    };

    connected_rooms.push(new_room_data);
  }

  // Return any connected rooms
  return connected_rooms;
}


function rebuild_map() {
  // Empty existing map and 'undraw' rooms
  $("div[class*='dungeon_room']").remove();

  //console.log('Drawing ' + map_rooms.length + ' rooms');
  for (var key in map_rooms) {
    if (map_rooms.hasOwnProperty(key)) {
      //console.log('Setting room ' + i + ' to undrawn')
      map_rooms[key].drawn = false;
    }
  }

  // Draw current rooms

  // Pick a starting room and add it to the draw queue
  var draw_queue = [];

  for (var first_room in map_rooms) {
    if (map_rooms.hasOwnProperty(first_room)) {
      var candidate_room = map_rooms[first_room];

      //console.log('first room candidate: ' + candidate_room.id);
      //console.log('room classes: ' + candidate_room.style_classes);
      var is_spawned_room = candidate_room.style_classes.indexOf('spawned_room') != -1;
      //console.log('spawned room?: ' + is_spawned_room);
      if (!is_spawned_room) {
        //console.log('candidate valid');
        break; // Stop as soon as we find a room besides the newly spawned room (because it is drawn separately)
      }
    }
  }

  // Only draw the dungeon if there was a room found (besides the spawn room)
  if (map_rooms[first_room] &&
    ( (spawned_room == null) || (spawned_room.id != map_rooms[first_room].id))) {


    draw_queue.push({
      room: map_rooms[first_room],
      parent_div: null,
      side: null
    });

    // Draw next room in queue unless it has already been drawn and add any
    // connected rooms to the draw queue (repeat until queue empty)
    while (draw_queue.length != 0) {
      //console.log('drawing the next room...');
      var next_room = draw_queue.shift();
      //console.log('room already drawn?: ' + next_room.room.drawn);
      // Draw room unless it has already been drawn
      if (next_room.room.drawn == false) {
        var new_rooms = build_room(next_room);
        //console.log('new rooms found:' + new_rooms);
        draw_queue = draw_queue.concat(new_rooms);
        //console.log('current_draw queue: ' + draw_queue);
        next_room.room.drawn = true;
      }
    }

    // Center up the map because, depending on the draw order, it is not necessarily the case that all rooms are in the visible portion of the browser window
    center_map();
  }

  // Draw spawned room (it won't need to be centered because it should always be drawn centered in the first place)
  var rotation_button = document.getElementById('rotate_room_button');

  // Only draw if necessary
  //console.log('Need to draw spawned room?: ' + ((rotation_button.style.display != '') && (rotation_button.style.display != 'none')));
  if ((rotation_button.style.display != '') && (rotation_button.style.display != 'none')) {
    //console.log('next room rotation:' + spawned_room.rotation);
    var room_anchor = document.getElementById('spawned_room_anchor');
    draw_room(spawned_room, room_anchor);
  }
}


function setup_game() {
  configure_menu_buttons();
  configure_other_stuff();
}


function configure_menu_buttons() {
  $('#start_game_button').click(function () {
    start_game();
  });

  $('#spawn_room_button').click(function () {
    spawn_room();
  });

  // Spawning rooms not available until game starts
  var spawn_room_button = document.getElementById('spawn_room_button');
  spawn_room_button.style.display = 'none';
}


function configure_other_stuff() {
  $('#rotate_room_button').click(function () {
    // Spawned room object should exist by now
    rotate_room(spawned_room);
    rebuild_map_in_place();
  });

  // Rotating spawn room not available until a room is spawned
  var rotate_room_button = document.getElementById('rotate_room_button');
  rotate_room_button.style.display = 'none';
}


function start_game() {
  // Create a starting room
  generate_starting_room();


  // Turn on room spawning
  var spawn_room_button = document.getElementById('spawn_room_button');
  spawn_room_button.style.display = 'inline';

  // Turn off start button
  var start_game_button = document.getElementById('start_game_button');
  start_game_button.style.display = 'none';


  // Display the initial map
  rebuild_map();
}

function generate_starting_room() {
  var starting_room = new CorridorRoom(next_room_id);
  ++next_room_id;

  var starting_hero = new ImperialNoble(next_hero_id);
  ++next_hero_id;

  starting_room.room_nodes[0].occupants.push(starting_hero);
}
