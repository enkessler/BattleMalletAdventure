function ImperialNoble(id) {
  game.hero_hash[id] = this;
  this.id = id;

  this.style_classes = ['character_token', 'hero_token', 'imperial_noble_token'];

  this.on_click_function = function () {
    if (game.in_targeting_mode) {
      var creature_object = game.hero_hash[this.id];

      toggle_object_highlighting(creature_object);

      game.rebuild_map_in_place();
    }
  };
}
