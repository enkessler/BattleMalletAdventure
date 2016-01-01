function RoomNode(id, room_styles) {
    this.id = id;
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

function CorridorRoom(id, rotation) {
    this.id = id;
    this.style_classes = ['corridor_room', 'room'];

    // Default values
    if (rotation === undefined) {
        console.log('using default rotatation');
        this.rotation = 0;
    } else {
        console.log('using rotatation' + rotation);
        this.rotation = rotation;
    }

    this.left_room = null;
    this.top_room = null;
    this.right_room = null;
    this.bottom_room = null;


    this.room_nodes = [
            new RoomNode(this.id + '_' + 1,[ 'corridor_node', 'corridor_node_row_1',
                    'corridor_node_col_1', 'left_connect_1' ]),
            new RoomNode(this.id + '_' + 2,[ 'corridor_node', 'corridor_node_row_1',
                    'corridor_node_col_2' ]),
            new RoomNode(this.id + '_' + 3,[ 'corridor_node', 'corridor_node_row_1',
                    'corridor_node_col_3' ]),
            new RoomNode(this.id + '_' + 4,[ 'corridor_node', 'corridor_node_row_1',
                    'corridor_node_col_4' ]),
            new RoomNode(this.id + '_' + 5,[ 'corridor_node', 'corridor_node_row_1',
                    'corridor_node_col_5' ]),
            new RoomNode(this.id + '_' + 6,[ 'corridor_node', 'corridor_node_row_1',
                    'corridor_node_col_6', 'right_connect_1' ]),
            new RoomNode(this.id + '_' + 7,[ 'corridor_node', 'corridor_node_row_2',
                    'corridor_node_col_1', 'left_connect_2' ]),
            new RoomNode(this.id + '_' + 8,[ 'corridor_node', 'corridor_node_row_2',
                    'corridor_node_col_2' ]),
            new RoomNode(this.id + '_' + 9,[ 'corridor_node', 'corridor_node_row_2',
                    'corridor_node_col_3' ]),
            new RoomNode(this.id + '_' + 10,[ 'corridor_node', 'corridor_node_row_2',
                    'corridor_node_col_4' ]),
            new RoomNode(this.id + '_' + 11,[ 'corridor_node', 'corridor_node_row_2',
                    'corridor_node_col_5' ]),
            new RoomNode(this.id + '_' + 12,[ 'corridor_node', 'corridor_node_row_2',
                    'corridor_node_col_6', 'right_connect_2' ]) ];
}

function LCorridorRoom() {
	this.room_cells = [ [ 'd', 'd', 'd', 'd' ], [ 'd', 'd', 'd', 'd' ],
			[ 'd', 'd', ' ', ' ' ], [ 'd', 'd', ' ', ' ' ] ];
}

function TCorridorRoom(id, rotation) {
    this.id = id;
    this.style_classes = ['t_corridor_room', 'room'];

    // Default values
    if (rotation === undefined) {
        console.log('using default rotatation');
        this.rotation = 0;
    } else {
        console.log('using rotatation' + rotation);
        this.rotation = rotation;
    }

    this.left_room = null;
    this.top_room = null;
    this.right_room = null;
    this.bottom_room = null;

    this.room_nodes = [
        new RoomNode(this.id + '_' + 1,[ 't_corridor_node', 't_corridor_node_row_1',
            't_corridor_node_col_1', 'left_connect_1' ]),
        new RoomNode(this.id + '_' + 2,[ 't_corridor_node', 't_corridor_node_row_1',
            't_corridor_node_col_2' ]),
        new RoomNode(this.id + '_' + 3,[ 't_corridor_node', 't_corridor_node_row_1',
            't_corridor_node_col_3', 'top_connect_1' ]),
        new RoomNode(this.id + '_' + 4,[ 't_corridor_node', 't_corridor_node_row_1',
            't_corridor_node_col_4', 'top_connect_2' ]),
        new RoomNode(this.id + '_' + 5,[ 't_corridor_node', 't_corridor_node_row_1',
            't_corridor_node_col_5' ]),
        new RoomNode(this.id + '_' + 6,[ 't_corridor_node', 't_corridor_node_row_1',
            't_corridor_node_col_6', 'right_connect_1' ]),
        new RoomNode(this.id + '_' + 7,[ 't_corridor_node', 't_corridor_node_row_2',
            't_corridor_node_col_1', 'left_connect_2' ]),
        new RoomNode(this.id + '_' + 8,[ 't_corridor_node', 't_corridor_node_row_2',
            't_corridor_node_col_2' ]),
        new RoomNode(this.id + '_' + 9,[ 't_corridor_node', 't_corridor_node_row_2',
            't_corridor_node_col_3', 'bottom_connect_1' ]),
        new RoomNode(this.id + '_' + 10,[ 't_corridor_node', 't_corridor_node_row_2',
            't_corridor_node_col_4','bottom_connect_2' ]),
        new RoomNode(this.id + '_' + 11,[ 't_corridor_node', 't_corridor_node_row_2',
            't_corridor_node_col_5' ]),
        new RoomNode(this.id + '_' + 12,[ 't_corridor_node', 't_corridor_node_row_2',
            't_corridor_node_col_6', 'right_connect_2' ]) ];
}
