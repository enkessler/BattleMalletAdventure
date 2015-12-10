function RoomNode(room_styles) {
	this.style_classes = room_styles;
}

function TombRoom() {
	this.room_cells = [ [ 'd', 'd', 'd', 'd' ], [ 'd', 'd', 'd', 'd' ],
			[ 'd', 'd', 'd', 'd' ], [ 'd', 'd', 'd', 'd' ],
			[ 'd', 'd', 'd', 'd' ], [ 'd', 'd', 'd', 'd' ],
			[ 'd', 'd', 'd', 'd' ], [ 'd', 'd', 'd', 'd' ] ];
}

function StairsRoom() {
	this.room_cells = [ [ 'd', 'd', 'd', 'd', 'd', 'd' ],
			[ 'd', 'd', 'd', 'd', 'd', 'd' ] ];
}

function CorridorRoom() {	
	this.style_class = "corridor_room";
	
	this.left_room = null;
	this.top_room = null;
	this.right_room = null;
	this.bottom_room = null;
	

	this.room_nodes = [
			new RoomNode([ 'corridor_node', 'corridor_node_row_1',
					'corridor_node_col_1' ]),
			new RoomNode([ 'corridor_node', 'corridor_node_row_1',
					'corridor_node_col_2' ]),
			new RoomNode([ 'corridor_node', 'corridor_node_row_1',
					'corridor_node_col_3' ]),
			new RoomNode([ 'corridor_node', 'corridor_node_row_1',
					'corridor_node_col_4' ]),
			new RoomNode([ 'corridor_node', 'corridor_node_row_1',
					'corridor_node_col_5' ]),
			new RoomNode([ 'corridor_node', 'corridor_node_row_1',
					'corridor_node_col_6' ]),
			new RoomNode([ 'corridor_node', 'corridor_node_row_2',
					'corridor_node_col_1' ]),
			new RoomNode([ 'corridor_node', 'corridor_node_row_2',
					'corridor_node_col_2' ]),
			new RoomNode([ 'corridor_node', 'corridor_node_row_2',
					'corridor_node_col_3' ]),
			new RoomNode([ 'corridor_node', 'corridor_node_row_2',
					'corridor_node_col_4' ]),
			new RoomNode([ 'corridor_node', 'corridor_node_row_2',
					'corridor_node_col_5' ]),
			new RoomNode([ 'corridor_node', 'corridor_node_row_2',
					'corridor_node_col_6' ]) ];
}

function LCorridorRoom() {
	this.room_cells = [ [ 'd', 'd', 'd', 'd' ], [ 'd', 'd', 'd', 'd' ],
			[ 'd', 'd', ' ', ' ' ], [ 'd', 'd', ' ', ' ' ] ];
}

function TCorridorRoom() {
	this.room_cells = [ [ 'd', 'd', 'd', 'd', 'd', 'd' ],
			[ 'd', 'd', 'd', 'd', 'd', 'd' ], [ ' ', ' ', 'd', 'd', ' ', ' ' ],
			[ ' ', ' ', 'd', 'd', ' ', ' ' ] ];
}
