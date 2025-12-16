export enum LinkType {
    Default = 1,
    Challenge = 2
}
export interface IData {
    score: number,
    type: LinkType
}
export class SubContent {
    static openId: string;
    public static getUserInfo() {
        wx.login({
            //成功放回
            success: (res) => {
                console.log(res);
                let code = res.code
                // 通过code换取openId
               
            }
        })


    }
    /**
 * 设置用户的分数
 * @param value
 */
    public static setData({ score, type }: IData) {
        wx.getOpenDataContext().postMessage({
            event: "setScore",
            score,
            type
        });
    }

    /**
     * 获取排行榜
     */
    public static getData(type: LinkType) {
        wx.getOpenDataContext().postMessage({
            event: "getRank",
            type,
            openid: this.openId
        });
    }
}