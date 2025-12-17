import Rank from "./Rank";
import { LinkItemData, LinkType } from "./RankItem";

const { ccclass, property } = cc._decorator;

/**
 * 托管的 KV 数据
 */
declare type KVData = {
    key: string;
    value: string;
}
/**
 * 托管数据
 */
type UserGameData = {
    avatarUrl: string;
    nickname: string;
    openid: string;
    KVDataList: KVData[];
}

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Node)
    private loading: cc.Node = null;
    @property(Rank)
    private rank: Rank = null;

    protected onLoad() {
        this.updateRankList([],LinkType.Default,"");
        if (cc.sys.platform !== cc.sys.WECHAT_GAME_SUB) return;
        // 监听来自主域的消息
        //this.updateRankList([],LinkType.Default,"");
        wx.onMessage((msg: any) => this.onMessage(msg));
    }
    openid: string = '';

    /**
     * 消息回调
     * @param msg 消息
     */
    private onMessage(msg: any) {
        console.log('RankMain.msgmsgmsg.Data::: ',msg);
        msg.type = LinkType.Challenge
        this.openid = msg.openid;

        switch (msg.event) {
            case 'setScore':
                this.setScore(msg.score, msg.type);
                break;
            case 'getRank':
                this.getRank(msg.type, msg.openid);
                break;
        }
    }

    /**
     * 获取玩家分数
     */
    private getScore(): Promise<number> {
        return new Promise(resolve => {
            console.log('[getScore]');
            wx.getUserCloudStorage({
                keyList: ['score'],
                success: (res: UserGameData) => {
                    console.log('[getScore]', 'success', res);
                    resolve(res.KVDataList[0] ? parseInt(res.KVDataList[0].value) : 0);
                },
                fail: (err) => {
                    console.log('[getScore]', 'fail', err);
                    resolve(-1);
                }
            });
        });
    }

    /**
     * 设置玩家分数
     * @param value 分数
     */
    private async setScore(value: number, type: LinkType) {
        // const typeLabel = type === LinkType.Default ? 'default' : 'challenge';
        console.log('[setScore]', value,);
        let oldScore = await this.getScore();
        if (oldScore === -1) return;
        if (value > oldScore) {
            // wx.removeUserCloudStorage({ keyList: ['score'] })
            // const obj = {
            //     typeLabel,
            //     maxVal: value.toString()
            // }
            wx.setUserCloudStorage({
                KVDataList: [{
                    key: 'score',
                    value: value.toString(),
                },],
                success: () => {
                    console.log('[setScore]', 'success');
                },
                fail: (err) => {
                    console.log('[setScore]', 'fail', err);
                }
            });
        }
    }

    /**
     * 获取排行榜
     */
    private async getRank(type: LinkType, openid: string) {
        console.log('[getRank]');
        // 显示加载动画
        this.showLoading();
        // 调用微信的函数
        await new Promise<void>(resolve => {
            wx.getFriendCloudStorage({
                keyList: ['score'],
                success: (res: any) => {
                    console.log('[getRank]', 'success', res);
                    // const typeLabel = type === LinkType.Default ? 'default' : 'challenge';
                    // 对数据进行排序
                    res.data.sort((a: UserGameData, b: UserGameData) => {
                        if (a.KVDataList.length === 0 && b.KVDataList.length === 0) return 0;
                        if (a.KVDataList.length === 0) return 1;
                        if (b.KVDataList.length === 0) return -1;
                        // b.KVDataList[0].
                        // b.KVDataList = b.KVDataList.filter(item => item.typeLabel === typeLabel);
                        // a.KVDataList = a.KVDataList.filter(item => item.typeLabel === typeLabel);
                        return parseInt(b.KVDataList[0].value) - parseInt(a.KVDataList[0].value);
                    });
                    // 排序之后进行展示
                    this.updateRankList(res.data, type, openid);
                    resolve();
                },
                fail: (res: any) => {
                    console.log('[getRank]', 'fail');
                    resolve();
                }
            });
        });
        // 关闭加载动画
        this.hideLoading();
    }

    /**
     * 更新好友排行
     * @param data 数据
     */
    private updateRankList(data: UserGameData[], type: LinkType, openid: string) {
        const arr: LinkItemData[] = []
        // const typeLabel = type === LinkType.Default ? 'default' : 'challenge';
        for (let [index, item] of data.entries()) {
            // if (item.KVDataList[0].typeLabel === typeLabel) {
            arr.push({
                name: item.nickname,
                num: index + 1,
                maxLv: item.KVDataList[0] ? item.KVDataList[0].value : '0',
                img: item.avatarUrl,
                openid: item.openid,
            })
            // }
        }

        //// testData......
        /*for(let i = 0; i < 10; ++i)
        {
            arr.push({
                name: "测试"+ i,
                num: i + 1,
                maxLv: i*5 + "",
                img: "",
                openid: "1111"+i,
            })
        }*/


        // 更新排行榜
        this.rank.refresh(type, arr, this.openid || openid);
        console.log('[updateRankList]', data, arr);
        // rank
    }

    /**
     * 显示加载动画
     */
    private showLoading() {
        console.log(wx.showLoading, 'wxwxwx');
        // this.loading.active = true;
        // wx.showLoading({
        //     title: '加载中',
        // })
    }

    /**
     * 关闭加载动画
     */
    private hideLoading() {
        // this.loading.active = false;
        // wx.hideLoading();
    }
}
