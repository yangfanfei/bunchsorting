/**
 * @Author: joey
 * @Date: 2026-04-05 20:44:11
 * @LastEditors: joey
 * @LastEditTime: 2026-04-05 20:44:11
 * @Description: 配置管理器
 */

import ResMgr from "./ResMgr";
import UserDataMgr from "./UserDataMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ConfigMgr {

  private static _ins: ConfigMgr = null!;

  private dressupData = null;

  /**
   * 返回 用户数据 类的单例实例。
   */
  public static get ins() {
    if (!this._ins) {
      this._ins = new ConfigMgr();
      this._ins.init();
    }

    return this._ins;
  }

  public init(){
    this.initDressUpData();
  }

  private initDressUpData(){
    if(this.dressupData == null)
    {
        let json = ResMgr.ins.getJson("dressup");
        this.dressupData = json.json;
        let count = this.dressupData.data.length;
        console.log("  CurrentDressUpData::::  ",  this.dressupData);
        for(let i = 0; i < count; ++i){
            let oneData = this.dressupData.data[i]
        }
    }
  }

  public getDressUpDataById(id){
    let count = this.dressupData.data.length;
    for(let i = 0; i < count; ++i){
        let oneData = this.dressupData.data[i]
        if(Number(oneData.id) == id)
        {
            return oneData
        }
    }
  }

  public getDressUpList(){
    return this.dressupData.data;
  }

  public hasDressupDataWithId(id: number): boolean {
    return this.dressupData.data.some(data => data.id === id);
  } 
    // update (dt) {}
}
