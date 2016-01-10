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
  add_occupants(node_object, node_div);

  //console.log('drawing room node: ' + node_object.id);
  node_div.id = node_object.id;


  return node_div;
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


function add_occupants(node_object, node_div) {
  for (var i = 0; i < node_object.occupants.length; ++i) {
    var occupant_object = node_object.occupants[i];

    var occupant_div = create_occupant_element(occupant_object);
    node_div.appendChild(occupant_div);
  }
}


function create_occupant_element(occupant_object) {
  var occupant_div = document.createElement('div');

  occupant_div.id = occupant_object.id;
  occupant_div.onclick = hero_element_click_function;

  for (var i = 0; i < occupant_object.style_classes.length; i++) {
    occupant_div.className += ' ' + occupant_object.style_classes[i];
  }

  if (occupant_object.highlighted) {
    occupant_div.className += ' highlighted_creature';
  }


  return occupant_div;
}
