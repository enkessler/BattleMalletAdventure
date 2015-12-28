// Courtesy of 	http://creativenotice.com/2013/07/regular-expression-in-array-indexof/

if (typeof Array.prototype.regXIndexOf === 'undefined') {
	Array.prototype.regXIndexOf = function (rx) {
		for (var i in this) {
			if (this[i].toString().match(rx)) {
				return i;
			}
		}
		return -1;
	};
}


var map_rooms = [new CorridorRoom(0)];
var spawned_room;
var room_ids = 1;
var room_connections_clicked = 0;


$(document).ready(function() {

	// Set up the initial map
	map_rooms[0].rotation = 0;

	// Display the initial map
	rebuild_map();

	// Configure room button
	$('#spawn_room_button').click(function() {
		spawn_room();
	});

	// Configure rotation button
	$('#rotate_room_button').click(function() {
		var room_to_place = document.getElementsByClassName('spawned_room')[0]; // Should
		// only
		// be
		// one
		// new
		// room
		rotate_room(room_to_place);
	});

});

function rotate_room(room_div) {

	var rotation = room_div.className.match(/_rotate_\d+/)[0].match(/\d+/)[0];
	var new_rotation;

	switch (rotation) {
	case '0':
		new_rotation = '90';
		break;
	case '90':
		new_rotation = '180';
		break;
	case '180':
		new_rotation = '270';
		break;
	case '270':
		new_rotation = '0';
		break;
	default:
		console.log("Don't know how to handle a rotation of '"
				+ rotation.rotation + "'");
	}

	var new_class = room_div.className.replace(new RegExp('_rotate_' + rotation,
			'g'), '_rotate_' + new_rotation);

	room_div.className = new_class;

	for (var i = 0; i < room_div.childNodes.length; i++) {
		new_class = room_div.childNodes[i].className.replace(new RegExp(
				'_rotate_' + rotation, 'g'), '_rotate_' + new_rotation);

		room_div.childNodes[i].className = new_class;
	}
}

function draw_room(room_object, left_offset, top_offset, rotation, z_index) {
	var room_div = document.createElement('div');

	// Configure room
    //console.log('drawing room: ' + room_object.id);
	room_div.id = room_object.id;

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

	room_div.style.left = left_offset; // format: "XXXpx"
	room_div.style.top = top_offset; // format: "XXXpx"
	room_div.style.zIndex = z_index;

	// Configure room nodes
	for (i = 0; i < room_object.room_nodes.length; i++) {
		var node_object = room_object.room_nodes[i];
		var node_div = document.createElement('div');

		for (var j = 0; j < node_object.style_classes.length; j++) {
			node_div.className += ' ' + node_object.style_classes[j]
					+ '_rotate_' + rotation;
		}
		//console.log('drawing room node: ' + node_object.id);

		node_div.id = node_object.id;
		room_div.appendChild(node_div);
	}

	// 'Draw' room on map
	var map = document.getElementById('dungeon_map');
	map.appendChild(room_div);

    return room_div;
}

function toggle_connection_room(overlay_element) {
	console.log('toggling overlay element');
	var connection_side = determine_connection_side(overlay_element.parentElement);
	console.log('connection side: ' + connection_side);

	var room_element = overlay_element.parentElement.parentElement;
	var relevant_connection_overlays = get_connection_overlays_for(connection_side, room_element);


	for (var i = 0; i < relevant_connection_overlays.length; ++i) {
		console.log('toggling node highlighting');
        var element = relevant_connection_overlays[i];
		if (element.className.match(/highlighted_connection/) != null) {
            element.className = element.className.replace('highlighted_connection', '');
		} else {
            element.className += ' highlighted_connection';
		}
	}
	if(overlay_element.className.match(/highlighted_connection/) != null) {
		++room_connections_clicked;
	}else{
		--room_connections_clicked;
	}
	console.log('activated room connections: ' + room_connections_clicked);
}

function get_connection_overlays_for(connection_side, room_element) {
	child_elements = room_element.children;
	var relevant_room_nodes = [];

	console.log('child elements found: ' + child_elements);
	for (var i = 0; i < child_elements.length; ++i) {
		element = child_elements[i];
		console.log('checking elemetn: ' + element);
		console.log('with classes: ' + element.className);
		if (element.className.match(new RegExp(connection_side + '_connect_')) != null) {
			console.log('connecting node found');
			relevant_room_nodes.push(element);
		}
	}

	var node_overlays = [];

	console.log('relevant room nodes found: ' + relevant_room_nodes);

	for (i = 0; i < relevant_room_nodes.length; ++i) {
		var child_elements = relevant_room_nodes[i].childNodes;

		for (var j = 0; j < child_elements.length; ++j) {
			var element = child_elements[j];
			if (element.className.match(/connection_node/) != null) {
				console.log('overlay div found');
				node_overlays.push(element);
			}
		}
	}

	return node_overlays;
}

function determine_connection_side(room_node_element) {
	console.log('determining connection side for element:' + room_node_element.id);
	var parent_element = room_node_element;
	console.log('parent element classes: ' + parent_element.className);
	var element_classes = parent_element.className.split(' ');
	console.log('parent element classes: ' + element_classes);
	var found = element_classes.regXIndexOf(/left_connect/);
	//console.log('index found: ' + found);

	if (found != -1) {
		return 'left';
	}

	found = element_classes.regXIndexOf(/bottom_connect/);
	//console.log('index found: ' + found);

	if (found != -1) {
		return 'bottom';
	}

	found = element_classes.regXIndexOf(/top_connect/);
	//console.log('index found: ' + found);

	if (found != -1) {
		return 'top';
	}

	found = element_classes.regXIndexOf(/right_connect/);
	//console.log('index found: ' + found);

	if (found != -1) {
		return 'right';
	}
}

function highlight_connection_nodes() {
    console.log('highlighting connection nodes...');
    //console.log(map_rooms.length + ' rooms to highlight');
    for (var i = 0; i < map_rooms.length; i++) {
		var room_object = map_rooms[i];
		console.log('checking room ' + i);

		highlight_connection_nodes_on_room(room_object);
	}
}

function highlight_connection_nodes_on_room(room_object) {
	for (var i = 0; i < room_object.room_nodes.length; i++) {
		var node_object = room_object.room_nodes[i];

		//console.log('checking node ' + i);
		if (node_object.style_classes.join(' ').indexOf('_connect_') != -1) {
			//console.log('connection node found');
			var overlay_div = document.createElement('div');
			overlay_div.className = 'connection_node';

			overlay_div.onclick = function () {
				console.log('setting toggle function');
				toggle_connection_room(this);
                if (room_connections_clicked == 2) {
                    connect_new_room();
                    var rotation_button = document.getElementById('rotate_room_button');

                    rotation_button.style.display = 'none';

                    rebuild_map();
                    room_connections_clicked = 0;
                }
			};

			// Add overlay div to node
			var parent_element = document.getElementById(node_object.id);
			parent_element.appendChild(overlay_div);
		}
	}
}

function spawn_room() {
	// Determine new room
	var next_room_id = room_ids++;
	//console.log('next room id is: ' + next_room_id);
	spawned_room = new CorridorRoom(next_room_id); // Just a hard-coded corridor for now
    spawned_room.rotation = 0;
    spawned_room.style_classes.push('spawned_room');
	//console.log('new rooms id: ' + next_room.id);
	// Display new room and rotation button
	var rotation_button = document.getElementById('rotate_room_button');

	rotation_button.style.display = 'inline';

	var left_offset = getComputedStyle(rotation_button).getPropertyValue('left');
	var top_offset = (parseInt(getComputedStyle(rotation_button).getPropertyValue(
			'top')) + 50)
			+ 'px';

	console.log('next room rotation:' + spawned_room.rotation);
	draw_room(spawned_room, left_offset, top_offset, spawned_room.rotation, 5);

	highlight_connection_nodes();
	highlight_connection_nodes_on_room(spawned_room);
}

function connect_new_room() {
    console.log('connecting new room');
    var connection_overlays = $('.highlighted_connection');

    var room_sets = [];
    for (var i = 0; i < connection_overlays.length; ++i) {
        var overlay = connection_overlays[i];
        //console.log('working with overlay (' + i + ': ' + overlay);
        var connection_side = determine_connection_side(overlay.parentElement);
        //console.log('connection side: ' + connection_side);
        var parent_room_element = overlay.parentElement.parentElement;
        //console.log('parent room found: ' + parent_room_element.id);

        room_sets.push({room_element: parent_room_element, connection_side: connection_side});
    }

    //console.log('final room sets:' + room_sets);
    //for (var i = 0; i < room_sets.length; ++i) {
    //    var room_set = room_sets[i];
    //    console.log('room_set:');
    //    console.log('element:' + room_set.room_element.id);
    //    console.log('side:' + room_set.connection_side);
    //}

    var found_ids = [8];
    var rooms_to_connect = [];

    for (i = 0; i < room_sets.length; ++i) {
        var room_set = room_sets[i];
        //console.log('found ids: ' + found_ids);
        //console.log('checking for id: ' + room_set.room_element);
        //console.log('index: : ' + found_ids.indexOf(room_set.room_element));
        if (found_ids.indexOf(room_set.room_element) == -1) {
            //console.log('unique room found');
            found_ids.push(room_set.room_element);
            rooms_to_connect.push(room_set);
        }
    }

    //console.log('final room sets');
    //for (var i = 0; i < rooms_to_connect.length; ++i) {
    //    var room_set = rooms_to_connect[i];
    //    console.log('room_set:');
    //    console.log('element:' + room_set.room_element.id);
    //    console.log('side:' + room_set.connection_side);
    //}

    rooms_to_connect.sort(function (a, b) {
        return a.room_element.id > b.room_element.id
    });

    //console.log('sorted room sets');
    //for (var i = 0; i < rooms_to_connect.length; ++i) {
    //    var room_set = rooms_to_connect[i];
    //    console.log('room_set:');
    //    console.log('element:' + room_set.room_element.id);
    //    console.log('side:' + room_set.connection_side);
    //}


    // There should be two rooms found with highlighting and the newly spawned room should have the higher id
    var connected_room_set = rooms_to_connect[0];
    var spawned_room_set = rooms_to_connect[1];
    var connected_room_object;
    var spawned_room_object = spawned_room;


    for (i = 0; i < map_rooms.length; ++i) {
        var map_room = map_rooms[i];
        //console.log('checking object: ' + map_room.id);
        //console.log('connecting room id: ' + connected_room_set.room_element.id);

        if (map_room.id == connected_room_set.room_element.id) {
            connected_room_object = map_room;
        }
    }

    //console.log('room_objects:');
    //console.log('connected_room:' + connected_room_object);
    //console.log('spawned:' + spawned_room_object);

    // Connect objects
    connect_rooms(connected_room_object, connected_room_set.connection_side, spawned_room_object, spawned_room_set.connection_side);
    map_rooms.push(spawned_room_object);
    console.log('connection complete');
}

function connect_rooms(connected_room_object, connected_room_set_connection_side, spawned_room_object, spawned_room_set_connection_side) {

    switch (connected_room_set_connection_side) {
        //case 'top':
        //    break;
        case 'right':
            connected_room_object.right_room = spawned_room_object;
            break;
        //case 'bottom':
        //    break;
        //case 'left':
        //    break;
        default:
            console.log("Don't know how to handle a connection side of '"
                + connected_room_set_connection_side + "'");
    }

    switch (spawned_room_set_connection_side) {
        //case 'top':
        //    break;
        //case 'right':
        //    break;
        //case 'bottom':
        //    break;
        case 'left':
            spawned_room_object.left_room = connected_room_object;
            break;
        default:
            console.log("Don't know how to handle a connection side of '"
                + spawned_room_set_connection_side + "'");
    }
}

function build_room(room_data) {
	// Draw the room

	var map_room = room_data.room;
	var connecting_room = room_data.parent_div;

	var left_offset;
	var top_offset;

	if (connecting_room == null) {
        //console.log('No parent div. Using default offsets...');
        left_offset = "100px";
		top_offset = "100px";
	} else {
        //console.log('Parent div found (' + connecting_room + '). Calculating offsets...');
        //console.log('Parent room styling: ' + getComputedStyle(connecting_room));
        //console.log('Parent room width: ' + getComputedStyle(connecting_room).getPropertyValue('width'));
        //console.log('Parent room top: ' + getComputedStyle(connecting_room).getPropertyValue('top'));
        left_offset = (parseInt(getComputedStyle(connecting_room)
				.getPropertyValue('width')) + parseInt(connecting_room.style.left))
				+ 'px';
		top_offset = getComputedStyle(connecting_room).getPropertyValue('top');
	}

    //console.log('room offsets:');
    //console.log('left offset:' + left_offset);
    //console.log('top offset:' + top_offset);
    //console.log('map room rotation:' + map_room.rotation);
    var room_div = draw_room(map_room, left_offset, top_offset, map_room.rotation, null);

	// Generate any connecting rooms
	var connected_rooms = [];

	// Check for left adjoining room
	if (map_room.left_room) {
		 //console.log('Adding a left room');
        console.log('Adding a left room to div "' + room_div.id + '"');

        new_room_data = {
            room: map_room.left_room,
            parent_div: room_div
        };

		connected_rooms.push(new_room_data);
	}

	// Check for top adjoining room
    if (map_room.top_room) {
        console.log('Adding a top room');
        new_room_data = {
            room: map_room.top_room,
            parent_div: room_div
        };

		connected_rooms.push(new_room_data);
	}

	// Check for right adjoining room
	if (map_room.right_room) {
        console.log('Adding a right room to div "' + room_div.id + '"');
        new_room_data = {
            room: map_room.right_room,
            parent_div: room_div
        };

		connected_rooms.push(new_room_data);
	}

	// Check for bottom adjoining room
	if (map_room.bottom_room) {
        console.log('Adding a bottom room');
        var new_room_data = {
            room: map_room.bottom_room,
            parent_div: room_div
        };

		connected_rooms.push(new_room_data);
	}

	// Return any connected rooms
	return connected_rooms;
}

function rebuild_map() {
	var map = document.getElementById('dungeon_map');

	// Empty existing map and 'undraw' rooms
	while (map.firstChild) {
		map.removeChild(map.firstChild)
	}
    console.log('Drawing ' + map_rooms.length + ' rooms');
    for (var i = 0; i < map_rooms.length; i++) {
        //console.log('Setting room ' + i + ' to undrawn')
		map_rooms[i].drawn = false;
	}

	// Draw current rooms

	// Pick a starting room and add it to the draw queue
	var draw_queue = [];

	draw_queue.push({
		room : map_rooms[0],
		parent_div : null
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
}

