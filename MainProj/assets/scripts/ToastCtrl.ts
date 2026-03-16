/*
 * @Author: jxgamestudio
 * @Description: message windows
 */

import { events } from "./enum/Enums";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ToastCtrl extends cc.Component {

    @property(cc.Label)
    text: cc.Label = null;

    @property(cc.Node)
    toast: cc.Node = null;

    private _tw = new cc.Tween();
    private time = 1;

    onEnable() {
        cc.director.on(events.Toast, this.showToast, this);
        this.toast.opacity = 0;
        this._tw.target(this.toast);
        this._tw.set({ opacity: 0 }).to(0.6, { opacity: 255 }).delay(this.time).to(0.25, { opacity: 0 });
    }

    onDisable() {
        cc.director.off(events.Toast, this.showToast, this);
    }

    /* show toast */
    showToast(text, time = 2) {
        this.time = time;

        this.text.string = text;

        this._tw.start();
    }

}
