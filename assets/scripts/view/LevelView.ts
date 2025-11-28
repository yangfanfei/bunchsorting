/*
 * @Author: jxgamestudio
 * @Description: Level view
 */
import BaseView from "./BaseView";
import { scrollFunc } from "../utils/Tools";
import LevelItemView from "./LevelItemView";
import { Global } from "../Global";
import { events, ui } from "../enum/Enums";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LevelView extends BaseView {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Prefab)
    levelItem: cc.Prefab = null;


    init() {
        let levelList = [1,2];
        for(let i = 3;i <= 300; i++ ){
            levelList.push(i);
        }
        //TODO:
        scrollFunc({
            list: levelList,
            spacing: 30,
            row: 5,
            scrollView: this.scrollView,
            content: this.content,
            receiveItemHeight: 30,
            cb: this.setPreFab.bind(this),
        });
    }

    setPreFab(item: string, i: number, list: number[]) {
        // console.log(item,'setPreFab');
        const levelValue = i+1;
        const levelItem = cc.instantiate(this.levelItem);
        const itemView: LevelItemView = levelItem.getComponent(LevelItemView);
        itemView.SetLevelIndex(levelValue);

        levelItem.on("click", () => {
            if(levelValue > Global.currentMaxLv)
            {
                //console.log(" CurrentMaxLv:::: ", Global.currentMaxLv," Select Lv: ",levelValue);
                return;
            }
            Global.lv = levelValue;
            cc.director.emit(events.LevelSelectChange);
            super.close();
            this.node.destroy();
        });

        if(levelValue > Global.currentMaxLv)
        {
            itemView.SetOpenState(false);
        }
        else
        {
            itemView.SetOpenState(true);
            if(levelValue == Global.lv)
            {
                itemView.SetLevelState(true);
            }
            else
            {
                itemView.SetLevelState(false);
            }
        }


        levelItem.parent = this.content;
    }

    start () {
        this.init();
    }

    onCloseClick(): void {
        super.close();
        this.node.destroy();
    }

    // update (dt) {}
}
