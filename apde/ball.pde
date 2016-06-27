class Ball {
  float x, y, size, o;
  Ball(float p1, float p2, float p3) {
    x = p1;
    y = p2;
    size = p3;
    o = 0;
  }
  Ball(float p1, float p2) {
    x = p1;
    y = p2;
    size = 64;
    o = 0;
  }
  float getDist(float p1, float p2) {
    return sqrt((p1-x)*(p1-x)+(p2-y)*(p2-y))-size/2;
  }
  boolean isTouching(float p1, float p2, float p3) {
    return sqrt((p1-x)*(p1-x)+(p2-y)*(p2-y))-p3<=size/2;
  }
}
