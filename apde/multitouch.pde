import android.view.MotionEvent;
MouseTouch[] mouse;
float pointers;
void setupMultiTouch() {
  mouse = new MouseTouch[10];
  for (int i = 0; i < mouse.length; i ++) {
    mouse[i] = new MouseTouch();
  }
}

// Detect (multiple) touches
public boolean surfaceTouchEvent(MotionEvent me) {
  // Don't detect touches at the very beginning
  if (frameCount > 0 && millis() > 500) {
    pointers = me.getPointerCount();
    
    // Clear old information
    for (int i = 0; i < mouse.length; i ++) {
      mouse[i].pressed = false;
    }
    
    // Update information
    for (int i = 0; i < mouse.length; i ++) {
      if (i < pointers) {
        mouse[i].update(me, i);
      } else {
        mouse[i].update();
      }
    }
    
    // Don't keep lift events
    if (me.getActionMasked() == MotionEvent.ACTION_UP) {
      mouse[me.getActionIndex()].pressed = false;
    }
  }
  
  return super.surfaceTouchEvent(me);
}

class MouseTouch {
  float x, y;
  float size;
  int id;
  boolean pressed;
  
  // Update values
  void update(MotionEvent me, int index) {
    x = me.getX(index);
    y = me.getY(index);
    size = (me.getTouchMajor(index) 
        + me.getTouchMinor(index)) / 2;
    
    id = me.getPointerId(index);
    pressed = true;
  }
  
  // Disable this touch
  void update() {
    pressed = false;
  }
}
