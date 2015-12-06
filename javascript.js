var map_cells = [ [] ]

$(document).ready(function() {

	// Configure room button
	$('#spawn_room_button').click(function() {
		add_room_to_map();
		rebuild_map();
	});

});

function add_room_to_map() {

	map_cells = [ [ 1, 2 ], [ 1, 2, 3, 4 ] ];

};

function rebuild_map() {

	var map = document.getElementById('dungeon_map');

	while (map.firstChild) {
		map.removeChild(map.firstChild)
	}

	for (i = 0; i < map_cells.length; i++) {
		console.log('Adding row ' + i);
		var table_row = document.createElement('tr');

		for (j = 0; j < map_cells[i].length; j++) {
			console.log('Adding column ' + i);
			var table_cell = document.createElement('td');
			table_cell.appendChild(document.createTextNode('a'));
			table_row.appendChild(table_cell);
		}
		map.appendChild(table_row);
	}

};

