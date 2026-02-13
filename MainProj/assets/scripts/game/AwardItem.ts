const {ccclass, property} = cc._decorator;

@ccclass
export default class AwardItem extends cc.Component {

    @property(cc.Label)
    labCount: cc.Label = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}
}
