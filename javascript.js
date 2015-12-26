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

	var rotation = room_div.className.match(/_rotate_\d+/)[0].match(/\d+/)[0]
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
				+ room_object.rotation + "'");
	}

	new_class = room_div.className.replace(new RegExp('_rotate_' + rotation,
			'g'), '_rotate_' + new_rotation);

	room_div.className = new_class;

	for (i = 0; i < room_div.childNodes.length; i++) {
		new_class = room_div.childNodes[i].className.replace(new RegExp(
				'_rotate_' + rotation, 'g'), '_rotate_' + new_rotation);

		room_div.childNodes[i].className = new_class;
	}
};

function draw_room(room_object, left_offset, top_offset, rotation, z_index) {
	var room_div = document.createElement('div');

	// Configure room
    //console.log('drawing room: ' + room_object.id);
	room_div.id = room_object.id;

	for (i = 0; i < room_object.style_classes.length; i++) {
		class_name = room_object.style_classes[i];

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

		for (j = 0; j < node_object.style_classes.length; j++) {
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
};

function toggle_connection_room(overlay_element) {
	console.log('toggling overlay element');
	connection_side = determine_connection_side(overlay_element);
	console.log('connection side: ' + connection_side);

	room_element = overlay_element.parentElement.parentElement;
	relevant_connection_overlays = get_connection_overlays_for(connection_side, room_element);


	for (var i = 0; i < relevant_connection_overlays.length; ++i) {
		console.log('toggling node highlighting');
		if (element.className.match(/highlighted_connection/) != null) {
			relevant_connection_overlays[i].className = relevant_connection_overlays[i].className.replace('highlighted_connection', '');
			--room_connections_clicked;
		} else {
			relevant_connection_overlays[i].className += ' highlighted_connection';
			++room_connections_clicked;
		};
	};
};

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
		};
	};

	var node_overlays = [];

	console.log('relevant room nodes found: ' + relevant_room_nodes);

	for (var i = 0; i < relevant_room_nodes.length; ++i) {
		child_elements = relevant_room_nodes[i].childNodes;

		for (var j = 0; j < child_elements.length; ++j) {
			element = child_elements[j];
			if (element.className.match(/connection_node/) != null) {
				console.log('overlay div found');
				node_overlays.push(element);
			};
		};
	};

	return node_overlays;
};

function determine_connection_side(room_node_element) {
	//console.log('toggling node element');
	parent_element = room_node_element.parentElement;
	//console.log('element classes: ' + parent_element.className);
	element_classes = parent_element.className.split(' ');
	//console.log('element classes: ' + element_classes);
	found = element_classes.regXIndexOf(/left_connect/);
	//console.log('index found: ' + found);

	if (found != -1) {
		return 'left';
	};

	found = element_classes.regXIndexOf(/bottom_connect/);
	//console.log('index found: ' + found);

	if (found != -1) {
		return 'bottom';
	};

	found = element_classes.regXIndexOf(/top_connect/);
	//console.log('index found: ' + found);

	if (found != -1) {
		return 'top';
	};

	found = element_classes.regXIndexOf(/right_connect/);
	//console.log('index found: ' + found);

	if (found != -1) {
		return 'right';
	};
};

function highlight_connection_nodes() {
	//console.log('highlighting connection nodes');
	for (i = 0; i < map_rooms.length; i++) {
		var room_object = map_rooms[i];
		console.log('checking room ' + i);

		highlight_connection_nodes_on_room(room_object);
	}
};

function highlight_connection_nodes_on_room(room_object) {
	for (i = 0; i < room_object.room_nodes.length; i++) {
		var node_object = room_object.room_nodes[i];

		//console.log('checking node ' + i);
		if (node_object.style_classes.join(' ').indexOf('_connect_') != -1) {
			//console.log('connection node found');
			var overlay_div = document.createElement('div');
			overlay_div.className = 'connection_node';

			overlay_div.onclick = function () {
				console.log('setting toggle function');
				toggle_connection_room(this);
			};

			// Add overlay div to node
			var parent_element = document.getElementById(node_object.id);
			parent_element.appendChild(overlay_div);
		}
	}
};

function spawn_room() {
	// Determine new room
	var next_room_id = room_ids++;
	//console.log('next room id is: ' + next_room_id);
	var next_room = new CorridorRoom(next_room_id); // Just a hard-coded corridor for now
	next_room.rotation = 0;
	next_room.style_classes.push('spawned_room');
	//console.log('new rooms id: ' + next_room.id);
	// Display new room and rotation button
	var rotation_button = document.getElementById('rotate_room_button');

	rotation_button.style.display = 'inline';

	left_offset = getComputedStyle(rotation_button).getPropertyValue('left');
	top_offset = (parseInt(getComputedStyle(rotation_button).getPropertyValue(
			'top')) + 50)
			+ 'px';

	console.log('next room rotation:' + next_room.rotation);
	draw_room(next_room, left_offset, top_offset, next_room.rotation, 5);

	highlight_connection_nodes();
	highlight_connection_nodes_on_room(next_room);
};

function old_add_room_to_map() {
	// console.log('Adding room to map');

	var new_room = spawn_room();

	var last_room = map_rooms[map_rooms.length - 1];

	// Link them up
	last_room.right_room = next_room;
	next_room.left_room = last_room;

	// Add new room to total
	map_rooms.push(next_room);
};

function build_room(room_data) {
	// Draw the room

	var map = document.getElementById('dungeon_map');
	var room_div = document.createElement('div');
	var map_room = room_data.room;
	var connecting_room = room_data.parent_div;

	var left_offset;
	var top_offset;

	if (connecting_room == null) {
		left_offset = "100px";
		top_offset = "100px";
	} else {
		left_offset = (parseInt(getComputedStyle(connecting_room)
				.getPropertyValue('width')) + parseInt(connecting_room.style.left))
				+ 'px';
		top_offset = getComputedStyle(connecting_room).getPropertyValue('top');
	}

	console.log('map room rotation:' + map_room.rotation);
	draw_room(map_room, left_offset, top_offset, map_room.rotation, null);

	// Generate any connecting rooms
	connected_rooms = []

	// Check for left adjoining room
	if (map_room.left_room) {
		// console.log('Adding a left room');

		new_room_data = {
			room : map_room.left_room,
			parent_div : room_div
		}

		connected_rooms.push(new_room_data);
	}

	// Check for top adjoining room
	if (map_room.top_room) {
		// console.log('Adding a top room');
		new_room_data = {
			room : map_room.top_room,
			parent_div : room_div
		}

		connected_rooms.push(new_room_data);
	}

	// Check for right adjoining room
	if (map_room.right_room) {
		// console.log('Adding a right room');
		new_room_data = {
			room : map_room.right_room,
			parent_div : room_div
		}

		connected_rooms.push(new_room_data);
	}

	// Check for bottom adjoining room
	if (map_room.bottom_room) {
		// console.log('Adding a bottom room');
		new_room_data = {
			room : map_room.bottom_room,
			parent_div : room_div
		}

		connected_rooms.push(new_room_data);
	}

	// Return any connected rooms
	return connected_rooms;
};

function rebuild_map() {
	var map = document.getElementById('dungeon_map');

	// Empty existing map and 'undraw' rooms
	while (map.firstChild) {
		map.removeChild(map.firstChild)
	}

	for (i = 0; i < map_rooms.length; i++) {
		// console.log('Setting room ' + i + ' to undrawn')
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
		next_room = draw_queue.shift();

		// Draw room unless it has already been drawn
		if (next_room.room.drawn == false) {
			new_rooms = build_room(next_room);
			draw_queue = draw_queue.concat(new_rooms);

			next_room.room.drawn = true;
		}
	}
};

