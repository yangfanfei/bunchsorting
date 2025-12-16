/*
 * @Author: jxgamestudio
 * @Description: Match function
 */

/**
 * convert radian to angle
 * @param radian
 * @returns angle
 */
export function radian2angle(radian: number) {
  return (radian / Math.PI) * 180;
}

/**
 * conver angle to radian
 * @param angle angle
 * @returns radian
 */
function angle2radian(angle: number) {
  while (angle > 360) {
    angle -= 360;
  }
  while (angle < -360) {
    angle += 360;
  }

  return ((angle % 360) * Math.PI) / 180.0;
}

/**
 * return random number
 * @param minNum  minValue
 * @param maxNum  maxValue
 * @returns
 */
export function randomNum(minNum: number, maxNum: number) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * minNum + "");
      break;
    case 2:
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum + "");
      break;
    default:
      return 0;
      break;
  }
}

/**
 * rotate 2D Point 
 * @param pt 
 * @param angle 
 * @returns 
 */
export function rotatePt(pt: cc.Vec2, angle: number) {

  let radian = angle2radian(angle);

  let ret = cc.v2();
  ret.x = pt.x * Math.cos(radian) - pt.y * Math.sin(radian);
  ret.y = pt.x * Math.sin(radian) + pt.y * Math.cos(radian);

  return ret;
}


