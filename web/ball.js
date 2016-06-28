  function getDist(float p1, float p2) {
    return sqrt((p1-x)*(p1-x)+(p2-y)*(p2-y))-size/2;
  }
  function isTouching(float p1, float p2, float p3) {
    return sqrt((p1-x)*(p1-x)+(p2-y)*(p2-y))-p3<=size/2;
  }
}
