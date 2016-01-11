function ImperialNoble(id) {
  game.hero_hash[id] = this;
  this.id = id;
  this.current_room_node = null;
  this.highlighted = false;

  this.style_classes = ['character_token', 'hero_token', 'imperial_noble_token'];

  this.on_click_function = function () {
    if (game.in_targeting_mode) {
      var creature_object = game.hero_hash[this.id];

      toggle_object_highlighting(creature_object);
      //console.log('Hero highlighted?: ' + creature_object.highlighted);

      if (creature_object.highlighted) {
        //console.log('Adding hero ' + creature_object.id + ' to targeted heroes');
        game.targeted_creature_ids.push(creature_object.id);
      } else {
        //console.log('Removing hero ' + creature_object.id + ' from targeted heroes');
        game.targeted_creature_ids.splice(game.targeted_creature_ids.indexOf(creature_object.id), 1);
      }

      game.rebuild_map_in_place();
    }

    event.stopPropagation();
  };
}
