function rotate_room(room_object) {
  //console.log('rotating room ' + room_object.id);
  var rotation = room_object.rotation;
  var new_rotation;
  //console.log('starting rotation: ' + rotation);

  switch (rotation) {
    case 0:
      new_rotation = 90;
      break;
    case 90:
      new_rotation = 180;
      break;
    case 180:
      new_rotation = 270;
      break;
    case 270:
      new_rotation = 0;
      break;
    default:
      console.log("Don't know how to handle a rotation of '" + rotation + "'");
  }
  //console.log('new rotation: ' + new_rotation);

  room_object.rotation = new_rotation;

  for (var i = 0; i < room_object.room_nodes.length; i++) {
    var node_object = room_object.room_nodes[i];
    node_object.rotation = new_rotation;

    //console.log('Style classes: ' + node_object.style_classes);

    // Must find out location of each type before changing any of them in order to allow for having more than one
    // connection side on the same node and to avoid a given side being changed more than one time at once.
    // Assuming exactly two connection points per side, for the time being.
    var left_connect_1_index = node_object.style_classes.indexOf('left_connect_1');
    var left_connect_2_index = node_object.style_classes.indexOf('left_connect_2');
    var top_connect_1_index = node_object.style_classes.indexOf('top_connect_1');
    var top_connect_2_index = node_object.style_classes.indexOf('top_connect_2');
    var right_connect_1_index = node_object.style_classes.indexOf('right_connect_1');
    var right_connect_2_index = node_object.style_classes.indexOf('right_connect_2');
    var bottom_connect_1_index = node_object.style_classes.indexOf('bottom_connect_1');
    var bottom_connect_2_index = node_object.style_classes.indexOf('bottom_connect_2');

    //console.log('Left connect 1 index: ' + left_connect_1_index);
    //console.log('Left connect 2 index: ' + left_connect_2_index);
    //console.log('Top connect 1 index: ' + top_connect_1_index);
    //console.log('Top connect 2 index: ' + top_connect_2_index);
    //console.log('Right connect 1 index: ' + right_connect_1_index);
    //console.log('Right connect 2 index: ' + right_connect_2_index);
    //console.log('Bottom connect 1 index: ' + bottom_connect_1_index);
    //console.log('Bottom connect 2 index: ' + bottom_connect_2_index);

    if (left_connect_1_index != -1) {
      //console.log('switching left connection to top');
      node_object.style_classes[left_connect_1_index] = 'top_connect_1';
    }

    if (left_connect_2_index != -1) {
      //console.log('switching left connection to top');
      node_object.style_classes[left_connect_2_index] = 'top_connect_2';
    }

    if (top_connect_1_index != -1) {
      //console.log('switching top connection to right');
      node_object.style_classes[top_connect_1_index] = 'right_connect_1';
    }

    if (top_connect_2_index != -1) {
      //console.log('switching top connection to right');
      node_object.style_classes[top_connect_2_index] = 'right_connect_2';
    }

    if (right_connect_1_index != -1) {
      //console.log('switching right connection to bottom');
      node_object.style_classes[right_connect_1_index] = 'bottom_connect_1';
    }

    if (right_connect_2_index != -1) {
      //console.log('switching right connection to bottom');
      node_object.style_classes[right_connect_2_index] = 'bottom_connect_2';
    }

    if (bottom_connect_1_index != -1) {
      //console.log('switching bottom connection to left');
      node_object.style_classes[bottom_connect_1_index] = 'left_connect_1';
    }

    if (bottom_connect_2_index != -1) {
      //console.log('switching bottom connection to left');
      node_object.style_classes[bottom_connect_2_index] = 'left_connect_2';
    }


    var overlays = node_object.overlays;

    for (var j = 0; j < overlays.length; ++j) {
      var overlay = overlays[j];
      if (overlay instanceof ConnectionOverlay) {
        overlay.side = next_side_for(overlay.side);
      }
    }
  }
}


function next_side_for(side) {
  var new_side;

  switch (side) {
    case 'left':
      new_side = 'top';
      break;
    case 'top':
      new_side = 'right';
      break;
    case 'right':
      new_side = 'bottom';
      break;
    case 'bottom':
      new_side = 'left';
      break;
    default:
      console.log("Don't know how to handle a side of '" + side + "'");
  }


  return new_side;
}


function determine_connection_side(style_classes) {
  var found = style_classes.regXIndexOf(/left_connect/);
  //console.log('index found: ' + found);

  if (found != -1) {
    return 'left';
  }

  found = style_classes.regXIndexOf(/bottom_connect/);
  //console.log('index found: ' + found);

  if (found != -1) {
    return 'bottom';
  }

  found = style_classes.regXIndexOf(/top_connect/);
  //console.log('index found: ' + found);

  if (found != -1) {
    return 'top';
  }

  found = style_classes.regXIndexOf(/right_connect/);
  //console.log('index found: ' + found);

  if (found != -1) {
    return 'right';
  }
}


function get_connection_overlays_for(connection_side, room_object) {
  var room_nodes = room_object.room_nodes;
  var relevant_room_nodes = [];

  //console.log('getting connecting overlays for side: ' + connection_side);

  for (var i = 0; i < room_nodes.length; ++i) {
    var room_node = room_nodes[i];
    //console.log('checking node: ' + room_node.id);
    //console.log('with classes: ' + room_node.style_classes);
    var target_class = connection_side + '_connect_';
    //console.log('looking for a "' + target_class + '" class');
    if (room_node.style_classes.regXIndexOf(new RegExp(target_class)) != -1) {
      //console.log('connecting node found');
      relevant_room_nodes.push(room_node);
    }
  }

  var overlay_objects = [];

  //console.log('relevant room nodes found: ' + relevant_room_nodes.length);

  for (i = 0; i < relevant_room_nodes.length; ++i) {
    var node_overlays = relevant_room_nodes[i].overlays;

    //console.log('overlays to loop through: ' + node_overlays.length);
    for (var j = 0; j < node_overlays.length; ++j) {
      var overlay = node_overlays[j];
      if (overlay instanceof ConnectionOverlay) {
        //console.log('overlay object found');
        overlay_objects.push(overlay);
      }
    }
  }


  return overlay_objects;
}
