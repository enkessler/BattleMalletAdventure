function ConnectionOverlay(id) {
  game.map_overlays[id] = this;
  this.id = id;
  this.highlighted = false;
  this.side = undefined;
  this.parent_object = undefined;


  this.on_click_function = function () {
    //console.log('setting toggle function');
    game.toggle_connection_overlay(this);

    if (game.room_connections_clicked == 2) {
      var validity_data = game.is_valid_connection_pair();
      if (validity_data.validity) {
        game.connect_new_room();

        game.rotate_room_button.visible = false;

        game.room_connections_clicked = 0;
      } else {
        alert(validity_data.message);
        game.toggle_connection_overlay(this);
      }
    }

    game.rebuild_map_in_place();
  };
}
