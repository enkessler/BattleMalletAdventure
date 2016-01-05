function ConnectionOverlay(id) {
  map_overlays[id] = this;
  this.id = id;
  this.highlighted = false;
  this.side = undefined;
  this.parent_object = undefined;
}
