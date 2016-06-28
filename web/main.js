canvas = document.getElementById('canvas');
ctx = canvas.getContext2D();


function onKeyDown(e) {
  
}
function onKeyUp(e) {
  
}


window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);

/////////FROM APDE CODE///////////

float direction, x, y, speed, accel, startMillis, endMillis;
float maxx, minx, turnSpeed = 0.066;
float o, to, db;
int screen, toScreen, difficulty, hard;
float SoE, mousex = 0, bp = 0.8;
float ra, rt, rf;
final float fluid = 4, sp = -0.4, bp1 = 0.8, bp2 = 1.1;
int fq = 128, fqT = 256, fqT1 = 256, fqS = 256;
final int tailSize = 16, tailQ = 1, nball = 3;
String title = "Waving";
float[] xs, ys;
Ball[] b;
PFont font, fontT, fontT1, fontS;
final boolean debug = false;

void setup() {
  setupMultiTouch();
  SoE = min(displayWidth, displayHeight)/16;
  background(0);
  size(displayWidth, displayHeight, P2D);
  o = 0;
  to = 0;
  screen = 0;
  smooth();
  fq = round(SoE);
  fqT = round(SoE*4);
  fqT1 = round(SoE*2);
  fqS = round(SoE*6);
  b = new Ball[nball];
  fontS = createFont("Roboto-Light.ttf", fqS);
  fontT1 = createFont("Roboto-Light.ttf", fqT1);
  fontT = createFont("Roboto-Light.ttf", fqT);
  font = createFont("Roboto-Light.ttf", fq);
  textFont(font, fq);
}
void draw() {
  if (frameCount%8==0) {
    //textFont(createFont("Roboto-Light.ttf", fq), fq);
  }
  //mousex = s(mousex, mouseX);
  if (toScreen==screen) {
    o = s(o, 255);
  }
  else {
    o = s(o, 0);
    if (o<0.5) {
      o = 0;
      if (toScreen==3) {
        initLevel();
      }
      screen = toScreen;
      textFont(font, fq);
    }
  }
  if (toScreen==1||toScreen==2||toScreen==4) {
    to = s(to, 255);
  } else {
    to = s(to, 0);
  }
  if (screen == 0) {
    background(0);
    fill(255, 255, 255, o);
    textAlign(CENTER, CENTER);
    textFont(fontT, fqT);
    textSize(round(SoE*4));
    text(title, width/2, height/2);
    textFont(font, fq);
    textSize(round(SoE));
    text("By adri326", width/2, height/2+SoE*3);
  } else if (screen==1) {
    background(0);
    fill(255, 255, 255, o);
    textFont(font, fq);
    textSize(round(SoE));
    textAlign(RIGHT, TOP);
    text("?", width-SoE/2, SoE/2);
    textAlign(LEFT, TOP);
    text("<", SoE/2, SoE/2);
    textFont(fontT1, fqT1);
    textSize(round(SoE*2));
    textAlign(CENTER, CENTER);
    fill(255, 255, 255, to);
    text(title, width/2, height*0.2);
    textFont(font, fq);
    textSize(round(SoE));
    fill(255, 255, 255, o);
    text("Easy", width/2, height*0.4);
    text("Medium", width/2, height*0.5);
    text("Hard", width/2, height*0.6);
    if (hard>2) {
      fill(255, 32, 32, o);
      text("Hardcore", width/2+random(-4, 4), height*0.7+random(-4, 4));
    }
  }
  else if (screen==2) {
    background(0);
    fill(255, 255, 255, to);
    textFont(fontT1, fqT1);
    textSize(SoE*2);
    textAlign(CENTER, CENTER);
    text(title, width/2, height*0.2);
    fill(255, 255, 255, o);
    text("How to play?", width/2, height*0.3);
    textFont(font, fq);
    textSize(SoE);
    text("Press the left hand or\nright hand side\nof the screen to turn\nleft/right\n\nAvoid the white balls\nand the borders", width/2, height*0.6);
    textAlign(LEFT, TOP);
    text("<", SoE/2, SoE/2);
  }
  else if (screen==3) { //The Game
    background(0);
    if (mousePressed&&pointers>0) {
      boolean left, right;
      int l = 0, r = 0;
      for (int i = 0; i < pointers; i++) {
        if (mouse[i].x>width/2) {
          l++;
        } else {
          r++;
        }
      }
      left = l>r;
      right = r>l;
      if (right) {// right
        direction += turnSpeed;
      } else if (left) {//left
        direction -= turnSpeed;
      }
      direction = min(max(direction, -PI/2), PI/2);
    }
    boolean touched = false;
    for (int i = 0; i < nball; i++) {
      touched = touched||b[i].isTouching(x, y, 7);
    }
    if (x*bp-7<minx||x*bp+7>maxx||touched||toScreen==4) {
      if (toScreen!=4) {
        endMillis = millis();
      }
      toScreen = 4;
    } else {
      x += sin(direction+PI)*speed;
      y += cos(direction+PI)*speed;
    }
    if (frameCount%tailQ==0) {
      for (int i = tailSize-1; i > 0; i--) {
        xs[i] = xs[i-1];
        ys[i] = ys[i-1];
      }
    }
    xs[0] = x;
    ys[0] = y;
    speed += accel;
    minx += accel*2;
    maxx -= accel*2;
    db = max(pow(min(abs(x-minx)+32, abs(x-maxx))+32, 2), 5000)/5000;
    float bd = 10000;
    for (int i = 0; i < nball; i++) {
      bd = min(bd, max(pow(b[i].getDist(x, y)+32+16, 2), 5000)/5000);
    }
    fill(128/min(db, bd), 0, 0, o);
    rect(0, 0, width, height);
    fill(255, 255, 255, o);
    ellipse(width/2, height/2, 14, 14);
    translate(width/2, height/2);
    noStroke();
    fill(255, 255, 255, o);
    for (int i = 0; i < nball; i++) {
      if (b[i].y-y>height/2+b[i].size*2) {
        b[i] = new Ball((random(minx, maxx)+x*2)/3, y-height/2+random(64, 255), 128+random(0, 64));
      }
      b[i].o = s(b[i].o, 255);
      fill(255, 255, 255, o*b[i].o/255*(min((b[i].y-y-400)/-100, 1)));
      ellipse(b[i].x-x, b[i].y-y, b[i].size, b[i].size);
    }
    //log(b);
    for (int i = 0; i < tailSize; i++) {
      if (frameRate>30) {
        fill(255, 255, 255, o-255.0*(float)i/tailSize);
      }
      ellipse(xs[i]-x, ys[i]-y, 12, 12);
    }
    
    /*for (float i = 0; i < 8; i++) {
      fill(255, 255, 255, o/i);
      
      rect(min(minx*(1-i/10)-x*(1-i/5), width/2), -height/2, -width, height);
      rect(max(maxx*(1-i/10)-x*(1-i/5), -width/2), -height/2, width, height);
    }*/
    
    
    fill(255, 255, 255, o);
    //ellipse(16-x, 0-y, 32, 32);
    
    /*if (toScreen==4) {
      //background(0);
      fill(0, 0, 0, o);
      rect(-width/2, -height/2, width, height);
    }*/
    if (difficulty<4) {
      textAlign(CENTER, CENTER);
      textSize(SoE*1.5);
      float score = (float)round((millis()-startMillis)/100)/10;
      text(""+round(score)+"."+round(score%1*10), x*sp, height*0.35);
    }
    ra += accel/400*difficulty;
    ra = min(ra, PI/64);
    rf += accel/200*difficulty;
    rf = min(rf, PI/16);
    rt += ra;
    rotate(sin(rt)*rf);
    rect(min(minx-x*bp, width/2), -height/2, -width, height);
    rect(max(maxx-x*bp, -width/2), -height/2, width, height);
    
    if (debug) {
      text(pointers, 0, 0);
    }
  }
  else if (screen==4) {//death screen
    background(0);
    fill(255, 255, 255, to);
    textFont(fontT1, fqT1);
    textSize(SoE*2);
    textAlign(CENTER, CENTER);
    text(title, width/2, height*0.2);
    fill(200, 32, 32, o);
    //textSize(SoE*3);
    text("You died", width/2, height*0.35);
    fill(255, 255, 255, o);
    textFont(fontS, fqS);
    textSize(SoE*6);
    float score = (float)round((endMillis-startMillis)/100)/10;
    text(""+round(score)+"."+round(score%1*10), width/2, height*0.575);
    textFont(font, fq);
    textSize(SoE*1.25);
    text("Try easier", width/2, height*0.8);
    //textSize(SoE);
    fill(255, 255, 255, o);
    text("Try again", width/2, height*0.9);
  }
}
float s(float p1, float p2) {
  return (p1*(fluid-1)+p2)/fluid;
}
void mousePressed() {
  if (screen==0) {
    toScreen = 1;
  }
  if (screen==1) {
    if (mouseX<SoE*1.75&&mouseY<SoE*1.75) {
      toScreen = 0;
    } else if (mouseX>width-SoE*1.75&&mouseY<SoE*1.75) {
      toScreen = 2;
    } else if (mouseY>height*0.4-SoE/2&&mouseY<height*0.4+SoE) {
      difficulty = 1;
      toScreen = 3;
      //initLevel();
    } else if (mouseY>height*0.5-SoE/2&&mouseY<height*0.5+SoE) {
      difficulty = 2;
      toScreen = 3;
      //initLevel();
    } else if (mouseY>height*0.6-SoE/2&&mouseY<height*0.6+SoE) {
      difficulty = 3;
      toScreen = 3;
      //initLevel();
    } else if (mouseY>height*0.7-SoE/1&&mouseY<height*0.7+SoE) {
      
      if (hard>2) {
        difficulty = 4;
        toScreen = 3;
      } else {
        hard++;
      }
    }
  }
  if (screen==2) {
    if (mouseX<SoE*1.75&&mouseY<SoE*1.75) {
      toScreen = 1;
    }
  }
  if (screen==4) {
    if (mouseY>height*0.8-SoE*0.75&&mouseY<height*0.8+SoE*0.75) {
      toScreen = 1;
    }
    else if (mouseY>height*0.9-SoE*0.75&&mouseY<height*0.9+SoE*0.75) {
      toScreen = 3;
      //initLevel();
    }
  }
  //toScreen = 1-toScreen;
}
void log(Ball[] p1) {
  println("Array: [");
  for (int i = 0; i < p1.length; i++) {
    println("  Ball: {");
    println("    x: "+p1[i].x+",");
    println("    y: "+p1[i].y+",");
    println("    size: "+p1[i].size);
    println("  }"+((i<p1.length-1)?",":""));
  }
  println("]");
}
void initLevel() {
  x = 0;
  y = 0;
  direction = 0;
  speed = 2*difficulty;
  minx = -256-32+32*difficulty;
  maxx = 256+32-32*difficulty;
  accel = 0.002+0.0005*difficulty;
  xs = new float[tailSize];
  ys = new float[tailSize];
  ra = 0;
  rt = 0;
  rf = 0;
  startMillis = millis();
  if (difficulty>3) {
    bp = bp2;
  } else {
    bp = bp1;
    if (difficulty==3) {
      bp = 1;
    }
  }
  for (int i = 0; i < tailSize; i++) {
    xs[i] = 0;
    ys[i] = 0;
  }
  for (int i = 0; i < nball; i++) {
    b[i] = new Ball(random(minx, maxx), y-height/nball*i+random(64, 255)-height/2, 128+random(0, 64));
  }
}
