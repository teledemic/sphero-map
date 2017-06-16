import { Robot } from "./lib/robot";

const macaddr = "79fedc5e6d4e434886060fe5c88f55cb";

Promise.resolve().then(async () => {
  const robot = new Robot();
  await robot.Connect(macaddr);
  await robot.SetTailLight(true);
  robot.Color("yellow");
  await robot.MoveTo(1,1);
  robot.Color("green");
});
