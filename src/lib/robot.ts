const spherolib = require("sphero");

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export class Robot {
  private sphero: any;
  private x = 0;
  private y = 0;

  public async Connect(address: string) {
    this.sphero = spherolib(address);
    await this.sphero.connect();
    this.sphero.on("odometer", (data: any) => {
      this.x = data.xOdometer.value[0];
      this.y = data.yOdometer.value[0];
    });
    this.sphero.streamOdometer();
  }

  public async SetTailLight(state: boolean) {
    return new Promise((resolve, reject) => {
      this.sphero.setBackLed(255, (err: any, data: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  public async MoveTo(x: number, y: number) {
    console.log("Starting at " + this.x + ", " + this.y);
    console.log("Moving to " + x + ", " + y);
    while ((this.x !== x) || (this.y !== y)) {
      const ydiff = y - this.y;
      const xdiff = x - this.x;
      const distance = Math.sqrt(xdiff * xdiff + ydiff * ydiff);
      console.log("x: " + this.x + ", y: " + this.y + ", dist: " + distance);
      let angle = 90 - (Math.atan2(ydiff, xdiff) * 180 / Math.PI);
      if (angle < 0) {
        angle += 360;
      }
      const speed = 50 + Math.min(150, distance);
      console.log("heading: " + angle + ", speed: " + speed);
      this.sphero.roll(100, angle);
      await sleep(200);
    }
    this.sphero.stop();
    console.log("Arrived at " + this.x + ", " + this.y);
  }

  public Color(color: string) {
    this.sphero.color(color);
  }
}