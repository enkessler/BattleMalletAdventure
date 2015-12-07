var map_rooms = [ new CorridorRoom(10, 10) ];

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
	console.log('Adding room to map');

	map_rooms.push(new CorridorRoom(100, 100));
};

function rebuild_map() {
	var map = document.getElementById('dungeon_map');

//	console.log('First Child: ' + map.firstChild);

	while (map.firstChild) {
		map.removeChild(map.firstChild)
	}

	for (i = 0; i < map_rooms.length; i++) {
		console.log('Building room ' + i);
		console.log('room class: ' + map_rooms[i].style_class);

		var room_div = document.createElement('div');
		var map_room = map_rooms[i];

		room_div.className = map_room.style_class;

		for (j = 0; j < map_room.room_nodes.length; j++) {
			console.log('Building room node ' + j);
			
			
			var node_div = document.createElement('div');
			var room_node = map_room.room_nodes[j];

			console.log('node classes (' + room_node.style_classes.length + '): ' + room_node.style_classes);

			for (k = 0; k < room_node.style_classes.length; k++) {
				console.log('Adding class: ' + room_node.style_classes[k]);
				node_div.className += ' ' + room_node.style_classes[k];
			}


			room_div.appendChild(node_div);
		}

		map.appendChild(room_div);
	}

	console.log('Build complete');
//	console.log('First Child: ' + map.firstChild);
};

