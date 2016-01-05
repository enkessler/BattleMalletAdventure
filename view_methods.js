function draw_room(room_object) {
  // Build room
  var room_div = create_room_element(room_object);

  // Add room on map
  var map = document.getElementById('dungeon_map');
  map.appendChild(room_div);


  return room_div;
}


function create_room_element(room_object) {
  // Configure room
  //console.log('drawing room: ' + room_object.id);
  var room_div = document.createElement('div');
  room_div.id = room_object.id;
  var rotation = room_object.rotation;

  for (var i = 0; i < room_object.style_classes.length; i++) {
    var class_name = room_object.style_classes[i];

    // Getting an element by a class name using a regular expression is a
    // bit of a hassle so I'm simply going to avoid it by not modifying the
    // class in this case.
    if (class_name != 'spawned_room') {
      class_name += '_rotate_' + rotation;
    }

    room_div.className += ' ' + class_name;
  }

  // Configure room nodes
  for (i = 0; i < room_object.room_nodes.length; i++) {
    var node_object = room_object.room_nodes[i];

    // Build node
    var node_div = create_room_node_element(node_object);

    // Add node to room
    room_div.appendChild(node_div);
  }


  return room_div;
}


function create_room_node_element(node_object) {
  var node_div = document.createElement('div');

  for (var j = 0; j < node_object.style_classes.length; j++) {
    node_div.className += ' ' + node_object.style_classes[j] + '_rotate_' + node_object.rotation;
  }

  // Configure node overlays
  add_overlays(node_object, node_div);

  //console.log('drawing room node: ' + node_object.id);
  node_div.id = node_object.id;


  return node_div;
}


function connection_overlays_needed() {
  return spawned_room !== undefined;
}


function add_overlays(node_object, node_div) {
  for (var i = 0; i < node_object.overlays.length; ++i) {
    var overlay_object = node_object.overlays[i];

    switch (true) {
      case (overlay_object instanceof ConnectionOverlay):
        var overlay_div = create_connection_overlay_element(overlay_object);
        node_div.appendChild(overlay_div);
        break;
      default:
        console.log("Don't know how to handle an overlay of this type");
    }
  }
}


function create_connection_overlay_element(overlay_object) {
  var overlay_div = document.createElement('div');

  overlay_div.id = overlay_object.id;
  overlay_div.className = 'connection_node_overlay';
  overlay_div.onclick = room_node_connection_overlay_click_function;

  if (overlay_object.highlighted) {
    //console.log('adding highlighting to created overlay ' + overlay_object.id)
    overlay_div.className += ' highlighted_connection';
  }

  if (connection_overlays_needed()) {
    overlay_div.style.display = 'inline';
  } else {
    overlay_div.style.display = 'none';
  }


  return overlay_div;
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
      left_offset = parseInt(base_room_div.style.left);
      break;
    case 'right':
      left_offset = (parseInt(getComputedStyle(base_room_div).getPropertyValue('width')) +
      parseInt(base_room_div.style.left));
      break;
    case 'bottom':
      left_offset = parseInt(base_room_div.style.left);
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
      top_offset = parseInt(base_room_div.style.top);
      break;
    case 'top':
      top_offset = -(parseInt(getComputedStyle(connected_room_div).getPropertyValue('height'))) +
        parseInt(base_room_div.style.top);
      break;
    case 'right':
      top_offset = parseInt(base_room_div.style.top);
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
