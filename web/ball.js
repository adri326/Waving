class Ball {
  constructor(x_, y_, s) {
    this.x = x_;
    this.y = y_;
    this.size = s;
  }
  function getDist(float p1, float p2) {
    return sqrt((p1-this.x)*(p1-this.x)+(p2-this.y)*(p2-this.y))-this.size/2;
  }
  function isTouching(float p1, float p2, float p3) {
    return sqrt((p1-this.x)*(p1-this.x)+(p2-this.y)*(p2-this.y))-p3<=this.size/2;
  }
}
