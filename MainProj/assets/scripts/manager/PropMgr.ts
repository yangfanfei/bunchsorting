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

  @property(cc.Node)
  guideNode: cc.Node = null;

  @property(cc.Node)
  numValueNode: cc.Node = null;

  private num: number = 0;
  private state: PropState = PropState.Video;

  setNum(num: number) {
    this.num = num;
    this.guideNode.active = false;
    this.showNodeByState();
  }
  showNodeByState() {
    if (this.num > 0) {
      this.numNode.active = true;
      this.numValueNode.getComponent(cc.Label).string = this.num.toString();
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

  checkGuideState(){
    console.log(" Check Guide State::::: ",this.node.name);
    if(this.num > 0)
    {
      this.guideNode.active = true;
      return true;
    }
    else
    {
      this.guideNode.active = false;
    }

    return false;
  }

  hideGuideState()
  {
    this.guideNode.active = false;
  }
  // LIFE-CYCLE CALLBACKS:

  // onLoad () {}

  start() {}

  // update (dt) {}
}
