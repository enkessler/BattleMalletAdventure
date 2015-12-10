var map_rooms = [ new CorridorRoom() ];

$(document).ready(function() {

	// Display the initial map
	rebuild_map();

	// Configure room button
	$('#spawn_room_button').click(function() {
		add_room_to_map();
		rebuild_map();
	});

});

function add_room_to_map() {
	// console.log('Adding room to map');

	// Hardcoding new room and old room
	var last_room = map_rooms[map_rooms.length - 1];
	var next_room = new CorridorRoom();

	// Link them up
	last_room.right_room = next_room;
	next_room.left_room = last_room;

	// Add new room to total
	map_rooms.push(next_room);
};

function draw_room(room_data) {
	// console.log('Drawing a room')

	// Draw the room

	var map = document.getElementById('dungeon_map');
	var room_div = document.createElement('div');
	var map_room = room_data.room;
	var connecting_room = room_data.parent_div;

	room_div.className = map_room.style_class;

	if (connecting_room == null) {
		room_div.style.left = "100px";
		room_div.style.top = "100px";
	} else {
		room_div.style.left = (parseInt(getComputedStyle(connecting_room)
				.getPropertyValue('width')) + parseInt(connecting_room.style.left))
				+ 'px';
		room_div.style.top = getComputedStyle(connecting_room)
				.getPropertyValue('top');
	}

	for (j = 0; j < map_room.room_nodes.length; j++) {
		// console.log('Building room node ' + j);

		var node_div = document.createElement('div');
		var room_node = map_room.room_nodes[j];

		// console.log('node classes (' + room_node.style_classes.length + '): '
		// + room_node.style_classes);

		for (k = 0; k < room_node.style_classes.length; k++) {
			// console.log('Adding class: ' + room_node.style_classes[k]);
			node_div.className += ' ' + room_node.style_classes[k];
		}

		room_div.appendChild(node_div);
	}

	// Add the new element and mark the room drawn
	map.appendChild(room_div);
	map_room.drawn = true;

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

	// console.log('First Child: ' + map.firstChild);

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
		// console.log('Room drawn yet?: ' + next_room.room.drawn);
		// Draw room unless it has already been drawn
		if (next_room.room.drawn == false) {
			new_rooms = draw_room(next_room);
			draw_queue = draw_queue.concat(new_rooms);
		}

		// console.log('Draw queue length: ' + draw_queue.length);
	}

	// console.log('Build complete');
};

