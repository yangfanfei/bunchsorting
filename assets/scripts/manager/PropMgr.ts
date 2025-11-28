/*
 * @Author: jxgamestudio
 * @Description: tool manager
 */

const { ccclass, property } = cc._decorator;

export enum PropState {
  //   None = 0,
  Video = 1,
  Share = 2,
}

@ccclass
export default class PropMgr extends cc.Component {
  @property(cc.Node)
  videoNode: cc.Node = null;

  @property(cc.Node)
  shareNode: cc.Node = null;

  @property(cc.Node)
  numNode: cc.Node = null;

  private num: number = 0;
  private state: PropState = PropState.Video;

  setNum(num: number) {
    this.num = num;
    this.showNodeByState();
  }
  showNodeByState() {
    if (this.num > 0) {
      this.numNode.active = true;
      this.numNode.getComponent(cc.Label).string = this.num.toString();
      this.videoNode.active = false;
      this.shareNode.active = false;
    } else {
      this.numNode.active = false;
      if (this.state == PropState.Video) {
        this.videoNode.active = true;
        this.shareNode.active = false;
      } else {
        this.videoNode.active = false;
        this.shareNode.active = true;
      }
    }
  }
  setState(state: PropState) {
    this.state = state;
  }
  // LIFE-CYCLE CALLBACKS:

  // onLoad () {}

  start() {}

  // update (dt) {}
}
