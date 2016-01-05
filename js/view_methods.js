function draw_room(room_object) {
  // Build room
  var room_div = create_room_element(room_object);

  // Add room on map
  var map = document.getElementById('dungeon_map');
  map.appendChild(room_div);


  return room_div;
}


function connection_overlays_needed() {
  return spawned_room !== undefined;
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
