/*
 * @Author: jxgamestudio
 * @Description: coinManager, deal  coin  logic
 */
import { Global } from "../Global";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CoinMgr extends cc.Component {

    @property(cc.Label)
    coinLabel: cc.Label = null;

    // onLoad () {}
    
    public static ins: CoinMgr = null;

    start () {
        console.log(" CoinMgr.Start............. ");
        CoinMgr.ins = this;
        //console.log(" coinLabel: ",this.coinLabel," String: ",Global.getCurrentCoin().toString());
        //this.coinLabel.string = Global.getCurrentCoin().toString();
        //this.setCoinLabel();
    }

    setCoinLabel(){
        console.log(" setCoinLabel: ",this.coinLabel," String: ",Global.getCurrentCoin().toString());
        this.coinLabel.string = Global.getCurrentCoin().toString();
    }

    getLabelPosition(){
        let dstGlobal = this.coinLabel.node.position;//this.node.convertToWorldSpaceAR(this.coinLabel.node.position);
        return dstGlobal;
    }

    // update (dt) {}
}
