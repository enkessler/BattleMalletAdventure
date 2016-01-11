function draw_room(room_object, root_element) {
  // Build room
  var room_div = create_room_element(room_object);

  // Add room on the page
  if (root_element === undefined) {
    root_element = document.getElementById('dungeon_map');
  }

  root_element.appendChild(room_div);


  return room_div;
}


function connection_overlays_needed() {
  return game.spawned_room != null;
}


function position_room(room_div, left_offset, top_offset, z_index) {
  //console.log('Positioning room ' + room_div.id + ' to ' + left_offset + ' left ' + top_offset + ' top');

  room_div.style.left = left_offset + 'px';
  room_div.style.top = top_offset + 'px';
  room_div.style.zIndex = z_index;
}


function center_map() {
//console.log('Centering dungeon map...');

  var dungeon_room_divs = $("div[class*='dungeon_room']");
  //console.log('dungeon rooms found: ' + dungeon_room_divs.length);

  var minimum_left_offset = 100;
  var minimum_top_offset = 100;
  var lowest_left_offset = parseInt(getComputedStyle(dungeon_room_divs[0]).getPropertyValue('left'));
  var lowest_top_offset = parseInt(getComputedStyle(dungeon_room_divs[0]).getPropertyValue('top'));

  // Skipping the first room because it is already assumed to be the most 'off the map'
  for (var i = 1; i < dungeon_room_divs.length; ++i) {
    if (parseInt(getComputedStyle(dungeon_room_divs[i]).getPropertyValue('left')) < lowest_left_offset) {
      lowest_left_offset = parseInt(getComputedStyle(dungeon_room_divs[i]).getPropertyValue('left'));
    }
    if (parseInt(getComputedStyle(dungeon_room_divs[i]).getPropertyValue('top')) < lowest_top_offset) {
      lowest_top_offset = parseInt(getComputedStyle(dungeon_room_divs[i]).getPropertyValue('top'));
    }
  }

  //console.log('Lowest left offset: ' + lowest_left_offset);
  //console.log('Lowest top offset: ' + lowest_top_offset);
  //console.log('minimum left offset: ' + minimum_left_offset);
  //console.log('minimum top offset: ' + minimum_top_offset);

  var left_offset_adjustment = minimum_left_offset - lowest_left_offset;
  var top_offset_adjustment = minimum_top_offset - lowest_top_offset;

  //console.log('Left offset adjustment: ' + left_offset_adjustment);
  //console.log('Lowest top offset: ' + top_offset_adjustment);

  for (i = 0; i < dungeon_room_divs.length; ++i) {
    //console.log('adjusting the offsets of room ' + dungeon_room_divs[i].id);
    position_room(dungeon_room_divs[i], parseInt(getComputedStyle(dungeon_room_divs[i]).getPropertyValue('left')) + left_offset_adjustment, parseInt(getComputedStyle(dungeon_room_divs[i]).getPropertyValue('top')) + top_offset_adjustment, null);
  }

  //console.log('Dungeon map centered.');
}


function left_offset_for(connected_room_div, base_connection_side, base_room_div) {
  var left_offset;

  switch (base_connection_side) {
    case 'left':
      left_offset = -(parseInt(getComputedStyle(connected_room_div).getPropertyValue('width'))) +
        parseInt(base_room_div.style.left);
      break;
    case 'top':
      var width_1 = parseInt(getComputedStyle(base_room_div).getPropertyValue('width'));
      var width_2 = parseInt(getComputedStyle(connected_room_div).getPropertyValue('width'));
      left_offset = parseInt(base_room_div.style.left) - length_differential(width_1, width_2);
      break;
    case 'right':
      left_offset = (parseInt(getComputedStyle(base_room_div).getPropertyValue('width')) +
      parseInt(base_room_div.style.left));
      break;
    case 'bottom':
      var width_1 = parseInt(getComputedStyle(base_room_div).getPropertyValue('width'));
      var width_2 = parseInt(getComputedStyle(connected_room_div).getPropertyValue('width'));
      left_offset = parseInt(base_room_div.style.left) - length_differential(width_1, width_2);
      break;
    default:
      console.log("Don't know how to handle a connection side of '" + base_connection_side + "'");
  }

  return left_offset;
}


function top_offset_for(connected_room_div, base_connection_side, base_room_div) {
  var top_offset;

  switch (base_connection_side) {
    case 'left':
      var height_1 = parseInt(getComputedStyle(base_room_div).getPropertyValue('height'));
      var height_2 = parseInt(getComputedStyle(connected_room_div).getPropertyValue('height'));
      top_offset = parseInt(base_room_div.style.top) - length_differential(height_1, height_2);
      break;
    case 'top':
      top_offset = -(parseInt(getComputedStyle(connected_room_div).getPropertyValue('height'))) +
        parseInt(base_room_div.style.top);
      break;
    case 'right':
      var height_1 = parseInt(getComputedStyle(base_room_div).getPropertyValue('height'));
      var height_2 = parseInt(getComputedStyle(connected_room_div).getPropertyValue('height'));
      top_offset = parseInt(base_room_div.style.top) - length_differential(height_1, height_2);
      break;
    case 'bottom':
      top_offset = parseInt(getComputedStyle(base_room_div).getPropertyValue('height')) +
        parseInt(base_room_div.style.top);
      break;
    default:
      console.log("Don't know how to handle a connection side of '" + base_connection_side + "'");
  }


  return top_offset;
}

function length_differential(length_1, length_2) {
  //console.log('Calculating height differential...');
  //console.log('length 1: ' + length_1);
  //console.log('length 2: ' + length_2);

  var differential = (length_2 / 2) - (length_1 / 2);

  //console.log('differential (): ' + differential);


  return differential;
}

function center_map_on(x_offset, y_offset) {
  window.scrollTo(x_offset, y_offset);
}

function current_map_center() {
  return [window.pageXOffset, window.pageYOffset];
}


function rebuild_screen() {
  // Empty existing map and 'undraw' rooms
  $(document.body).empty();

  rebuild_control_bar();
  rebuild_action_bar();
  rebuild_map();
}


function rebuild_control_bar() {
  //console.log('Building control bar...');
  $("div[class*='control_bar']").remove();
  $(document.body).append(create_control_bar_element(game.control_bar));
  //console.log('Control bar building complete.');
}


function rebuild_action_bar() {
  //console.log('Building action bar...');
  $("div[class*='action_bar']").remove();
  $(document.body).append(create_action_bar_element(game.action_bar));
  //console.log('Action bar building complete.');
}


function rebuild_map_in_place() {
  var here = current_map_center();
  rebuild_map();
  center_map_on(here[0], here[1]);
}


function rebuild_screen_in_place() {
  var here = current_map_center();
  rebuild_screen();
  center_map_on(here[0], here[1]);
}


function rebuild_map() {
  // Empty existing map and 'undraw' rooms
  $('#dungeon_map').remove();
  $('#spawned_room_anchor').remove();
  $('#rotate_room_button').remove();

  $(document.body).append(create_dungeon_map_element(game.map_rooms));


  $("div[class*='dungeon_room']").remove();

  //console.log('Drawing ' + map_rooms.length + ' rooms');
  for (var key in game.map_rooms) {
    if (game.map_rooms.hasOwnProperty(key)) {
      //console.log('Setting room ' + i + ' to undrawn')
      game.map_rooms[key].drawn = false;
    }
  }

  // Draw current rooms

  // Pick a starting room and add it to the draw queue
  var draw_queue = [];

  for (var first_room in game.map_rooms) {
    if (game.map_rooms.hasOwnProperty(first_room)) {
      var candidate_room = game.map_rooms[first_room];

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
  if (game.map_rooms[first_room] &&
    ( (game.spawned_room == null) || (game.spawned_room.id != game.map_rooms[first_room].id))) {

    draw_queue.push({
      room: game.map_rooms[first_room],
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
  if (game.rotate_room_button.visible) {
    $(document.body).append(create_spawned_room_anchor_element());
    $(document.body).append(create_button(game.rotate_room_button));

    //console.log('next room rotation:' + spawned_room.rotation);
    var room_anchor = document.getElementById('spawned_room_anchor');
    draw_room(game.spawned_room, room_anchor);
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
