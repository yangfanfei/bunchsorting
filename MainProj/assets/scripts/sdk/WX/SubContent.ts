export enum LinkType {
    Default = 1,
    Challenge = 2
}

export interface IData {
    level: number,
    type: LinkType
}

export class SubContent {
    static openId: string;
    static wx = window["wx"];

    public static getUserInfo() {
        if(cc.sys.platform != cc.sys.WECHAT_GAME) return;
        this.wx.login({
            //成功放回
            success: (res) => {
                console.log(" SubContent...GetUserInfo::: ",res);
                let code = res.code
                // 通过code换取openId
            }
        })
    }

    /**
     * 设置用户的分数
     * @param value
     */
    public static setMaxLevel( level ) {
        if(cc.sys.platform != cc.sys.WECHAT_GAME) return;
        //console.log("  SubContent.Post setData:::::::: new.Max.Level: ",level);
        this.wx.getOpenDataContext().postMessage({
            event: "setLevel",
            level
        });
    }

    /**
     * 获取排行榜
     */
    public static getRankData() {
        if(cc.sys.platform != cc.sys.WECHAT_GAME) return;
        //console.log("  SubContent.Get RankMsg:::::::: ");
        this.wx.getOpenDataContext().postMessage({
            event: "getRank",
            openid: this.openId
        });
    }
}