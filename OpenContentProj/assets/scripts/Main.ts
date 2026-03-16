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

    private wx = window["wx"]

    protected onLoad() {
        //console.log(" OpenData.Main......  OnLoad:::::::::: Platform:: ",cc.sys.platform);
        //if(cc.sys.platform == cc.sys.WECHAT_GAME_SUB)
        {
            this.updateRankList([],"");
            if (cc.sys.platform !== cc.sys.WECHAT_GAME_SUB) return;
            // 监听来自主域的消息
            //this.updateRankList([],LinkType.Default,"");
            console.log(" OpenData.Main......  OnLoad:::::::::: 2222222222222");
            this.wx.onMessage((msg: any) => this.onMessage(msg));
        }
    }
    openid: string = '';

    /**
     * 消息回调
     * @param msg 消息
     */
    private onMessage(msg: any) {
        console.log('OpenData.RankMain.msgmsgmsg.Data::: ',msg);
        this.openid = msg.openid;

        switch (msg.event) {
            case 'setLevel':
                this.setLevel(msg.level);
                break;
            case 'getRank':
                this.getRank(msg.openid);
                break;
        }
    }

    /**
     * 获取关卡
     */
    private getLevel(): Promise<number> {
        return new Promise(resolve => {
            console.log('[getLevel]');
            this.wx.getUserCloudStorage({
                keyList: ['level'],
                success: (res: UserGameData) => {
                    console.log('[getLevel]', 'success', res);
                    resolve(res.KVDataList[0] ? parseInt(res.KVDataList[0].value) : 0);
                },
                fail: (err) => {
                    console.log('[getLevel]', 'fail', err);
                    resolve(-1);
                }
            });
        });
    }

    /**
     * 设置玩家关卡
     * @param value 分数
     */
    private setLevel(value: number) {
        // const typeLabel = type === LinkType.Default ? 'default' : 'challenge';
        console.log('[OpenData.SetLevel]', value,);
        this.wx.getUserCloudStorage({
            keyList: ['level'],
            success: (res: UserGameData) => {
                    console.log('[getOldLevel]', 'success', res);
                    console.log(res.KVDataList[0] ? parseInt(res.KVDataList[0].value) : 0);
                    let oldValue = res.KVDataList[0] ? parseInt(res.KVDataList[0].value) : 0;
                    if(oldValue < value)
                    {
                        this.setLevelReaL(value);
                    }
                    else
                    {
                        console.log(" 设置玩家关卡等级的时候，存储等级大于当前等级： ",value," 存储等级: ",oldValue);
                    }
                },
                fail: (err) => {
                    console.log('[getOldLevel]', 'fail', err);
                    this.setLevelReaL(value);
                }
            });
        /*let oldLevel = await this.getLevel();
        if (oldLevel === -1) return;
        if (value > oldLevel) {
            // wx.removeUserCloudStorage({ keyList: ['score'] })
            // const obj = {
            //     typeLabel,
            //     maxVal: value.toString()
            // }
            //this.info("  OpenDataContext [setLevel] ::::::::::::::: ",value);
            this.wx.setUserCloudStorage({
                KVDataList: [{
                    key: 'level',
                    value: value.toString(),
                },],
                success: () => {
                    console.log('[setLevel]', 'success');
                },
                fail: (err) => {
                    console.log('[setLevel]', 'fail', err);
                }
            });
        }
        else
        {
            console.log(" OpenContent OldLevel 大于 NewLevel");
        }*/
    }

    private setLevelReaL(value:number){
        console.log('[setLevelReaL.setLevel]', 'Value::: ',value);
        this.wx.setUserCloudStorage({
            KVDataList: [{
                key: 'level',
                value: value.toString(),
            },],
            success: () => {
                console.log('[setLevelReaL.setLevel]', 'success');
            },
            fail: (err) => {
                console.log('[setLevelReaL.setLevel]', 'fail', err);
            }
        });
    }

    /**
     * 设置玩家关卡
     * @param value 分数
     */
    private setCoin(value:number){
        this.wx.setUserCloudStorage({
            KVDataList: [{
                key: 'coin',
                value: value.toString(),
            },],
            success: () => {
                console.log('[setCoin]', 'success');
            },
            fail: (err) => {
                console.log('[setCoin]', 'fail', err);
            }
        });
    }

    private getCoin()
    {
        console.log(" ");
        this.wx.getUserCloudStorage({
            keyList: ['coin'],
            success: (res: UserGameData) => {
                console.log('[getCoin]', 'success', res);
            },
            fail: (err) => {
                console.log('[getCoin]', 'fail', err);
            }
        });
    }

    /**
     * 获取排行榜
     */
    private getRank(openid: string) {
        console.log('[getRank]');
        // 显示加载动画
        //this.showLLoading();
        // 调用微信的函数
        //await new Promise<void>(resolve => {
            this.wx.getFriendCloudStorage({
                keyList: ['level'],
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
                    this.updateRankList(res.data, openid);
                    //this.hideLoading();
                    //resolve();
                },
                fail: (res: any) => {
                    console.log('[getRank]', 'fail');
                    //this.hideLoading();
                    //resolve();
                }
            });
        //});
        // 关闭加载动画
        //this.hideLoading();
    }

    /**
     * 更新好友排行
     * @param data 数据
     */
    private updateRankList(data: UserGameData[], openid: string) {
        console.log(" OpenDataContext.......  UpdateRankList::::  ",data);
        //this.info(" OpenDataContext ::::::::::::::: ");
        const arr: LinkItemData[] = []
        // const typeLabel = type === LinkType.Default ? 'default' : 'challenge';
        for (let [index, item] of data.entries()) {
            // if (item.KVDataList[0].typeLabel === typeLabel) {
            console.log(" UpdateRankList.Index::::::: ",index," Item.Data:::: ",item);
            //this.info(" UpdateRankList.Index::::::: ",index," Item.Data:::: ",item);
            arr.push({
                name: item.nickname,
                num: index + 1,
                maxLv: item.KVDataList[0] ? item.KVDataList[0].value : '0',
                img: item.avatarUrl,
                openid: item.openid,
            })
            // }
        }

        // 更新排行榜
        this.rank.refresh(arr, this.openid || openid);
        console.log('[updateRankList]', data, arr);
        // rank
    }

    /**
     * 显示加载动画
     */
    private showLLoading() {
        //console.log(wx.showLoading, 'wxwxwx');
        this.loading.active = true;
        /*this.wx.showLoading({
             title: '加载中',
        })*/
    }

    /**
     * 关闭加载动画
     */
    private hideLoading() {
        this.loading.active = false;
        this.wx.hideLoading();
    }
}
