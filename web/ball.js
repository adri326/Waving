var Ball = {
  init: function(x_, y_, s) {
    this.x = x_;
    this.y = y_;
    this.size = s;
  },
  getDist: function(p1, p2) {
    return sqrt((p1-this.x)*(p1-this.x)+(p2-this.y)*(p2-this.y))-this.size/2;
  },
  isTouching: function(p1, p2, p3) {
    return sqrt((p1-this.x)*(p1-this.x)+(p2-this.y)*(p2-this.y))-p3<=this.size/2;
  }
}
