/*
 * @Author: jxgamestudio
 * @Description: 引导任务管理器
 */

const { ccclass, property } = cc._decorator;
declare let require: (string) => any;
import async from "async";
import { events } from "../enum/Enums";
const tmpV3 = cc.v3();
@ccclass
export class GuideTaskMgr extends cc.Component {

    @property(cc.Prefab)
    FINGER_PREFAB: cc.Prefab = null;

    _finger: cc.Node = null;

    _mask: cc.Mask;
    _maskInfo: cc.Node;
    _targetNode: cc.Node; 
    _isOpenMaskInfo: boolean = true; 

    _task: any;

    static readonly FINGER: string = 'movefinger';

    static readonly typeList = [
        GuideTaskMgr.FINGER,
    ];

    onLoad() {
        if (this.FINGER_PREFAB) {
            this._finger = cc.instantiate(this.FINGER_PREFAB);
            this._finger.parent = this.node;
            this._finger.active = false;
        }

        this.node.setContentSize(cc.winSize);
        cc.systemEvent.on(events.ExcuteGuideTask, this.ExcuteGuideTask, this);
        this.node.on(cc.Node.EventType.TOUCH_START, this.addSetSwallowTouchesEventListener, this);

        this._mask = this.node.getComponentInChildren(cc.Mask);
        console.log(" GuideTaskManager.Mask:::: ",this._mask," Finger:::::: ",this._finger);
        this._maskInfo = this._mask.node.getChildByName("info");

        this._mask.node.active = false; 
        this._maskInfo.active = this._isOpenMaskInfo;
    }

    ExcuteGuideTask(data) {
        this._mask.node.active = true; 

        let flie = data.taskFlie;
        let index = data.stepIndex;

        let { task } = require(flie);
        // this._task = task;

        let step = task.steps[index]; 
        console.log(" ExcuteGuideTask Index::::::: ",index," Step:::: ",step);

        this._targetNode = null;
        const guideFn = () => {
            console.log("ExcuteGuideTask guideFn ::::::: ");
        
            async.series({
                stepStart(markonCb) {
                    console.log("ExcuteGuideTask stepStart ::::::: ");
                    if (step.onStart) {
                        step.onStart(() => {
                            markonCb();
                        });
                    } else {
                        markonCb();
                    }
                },
                stepExcute: (markonCb) => {
                    console.log("ExcuteGuideTask stepExcute ::::::: ",this._mask.node);
                    if (step.onExcute) {
                        step.onExcute(() => {
                            this._mask.node.getChildByName("label").getComponent(cc.Label).string = step.command.text;

                            this.scheduleOnce(() => {
                                let cmd = GuideTaskMgr[step.command.cmd];
                                if (cmd) {
                                    cmd(this, step, (error) => {
                                        markonCb(error);
                                    });
                                }
                            }, step.delayTime || 0);
                        });
                    }
                },
                stepEnd: (markonCb) => {
                    console.log("ExcuteGuideTask stepEnd ::::::: ");
                    if (step.onEnd) {
                        step.onEnd(() => {
                            markonCb();
                        });
                    } else {
                        markonCb();
                    }
                    step = task.steps[++index]

                    if (step) {
                        console.log("ExcuteGuideTask Start Next Step ::::::: ");
                        guideFn()
                    } else {
                        this._mask._graphics.clear();
                        this._mask.node.active = false;
                        this._finger.active = false;
                    }
                },
            },
                (error) => {
                    if (error) {
          
                    }

                })
        }

        console.log("ExcuteGuideTask guideFn Up::::::: ");
        guideFn()
    }

    addSetSwallowTouchesEventListener(event: cc.Event.EventTouch) {
        if (!this._mask.node.active) {
            this.node._touchListener.setSwallowTouches(false);
            return;
        }
        if (!this._targetNode) {
            this.node._touchListener.setSwallowTouches(true);
            return;
        }
        // this._targetNode.getlo()
        if (!cc.isValid(this._targetNode)) {
            return;
        }
        let rect = this._targetNode.getBoundingBox();
        // {x: -110, y: -144, width: 90, height: 288}
        console.log(this._targetNode.getPosition(), event.getLocation(), 'event.getLocation()event.getLocation()event.getLocation()');
        const targetNodeWorldPos = this._targetNode.getWorldPosition(tmpV3);
        console.log(targetNodeWorldPos);

        const point = event.getLocation()
        const cWidth = rect.width / 2
        const cHeight = rect.height / 2
        if (
            point.x >= targetNodeWorldPos.x - cWidth &&
            point.x <= targetNodeWorldPos.x + rect.width + cWidth &&
            point.y >= targetNodeWorldPos.y - cHeight &&
            point.y <= targetNodeWorldPos.y + rect.height + cHeight
        ) {
            // if (rect.contains(event.getLocation())) {
            this.node._touchListener.setSwallowTouches(false);
        } else {
            this.node._touchListener.setSwallowTouches(true);
        }
    }



    static movefinger(guideTaskMgr, step, callback) {
        console.log(" movefinger~~~~~~~ ");
        let params = step.command;
        guideTaskMgr._targetNode = null; 

        guideTaskMgr.find(params.args, (node: cc.Node, rect) => {
            let cup = node

            guideTaskMgr.fingerToNode(cup, () => {
                guideTaskMgr._targetNode = cup; 
                node.once(cc.Node.EventType.TOUCH_END, () => {
                    callback();

                });

            });
        });
    }

    private find(value, cb?) {
        console.log(" GuideManager.Find::: ",value," CB:::: ",cb);
        let root = cc.find('Canvas');
        this.locateNode(root, value, (error, node) => {
            if (error) {
                return;
            }
            let rect = this._focusToNode(node);
            console.log(rect, 'rectrectrectrect');

            if (cb) {
                cb(node, rect);
            }
        });
    }

    private parse(locator: string) {
        let names = locator.split(/[.,//,>,#]/g);
        let arr = [];
        let map = {};
        for (let item of names) {
            var reg = new RegExp(`[.,//,>,#]+${item}`, "g");
            let res = locator.match(reg);
            let symbol = res ? res[map[item] || 0]?.replace(item, "") || "/" : "/";
            if (map[item]) {
                map[item]++;
            } else {
                map[item] = 1;
            }
            // let symbol = res ? res[map[item] || 0]?.replace(item, "") || "/" : "/";
            arr.push({ symbol, name: item.trim(), index: map[item] - 1 || 0 });
        }
        return arr;
    }


    private locateNode(root: cc.Node, locator, cb?) {
        let segments = this.parse(locator);
        let child, node = root;
        for (let i = 0; i < segments.length; i++) {
            let item = segments[i];
            console.log("locateNode111::: ItemName: ",item.name,"ItemSymbol::: ",item.symbol);
            switch (item.symbol) {
                case '/':
                    console.log("locateNode::: ,ItemName: ",item.name);
                    child = node.getChildByName(item.name);
                    break;
                case ',':
                    child = node.parent.children.filter(data => data.name == item.name)[item.index]
                    break
            }
            if (!child) {
                node = null;
                break;
            }
            node = child;
            console.log("In Loop::::: ",node);
        }

        console.log(" locateNode::Node::: ",node);
        if (node && node.active && cb) {
            cb(null, node);
        } else {
            cb(locator)
        }
        return node;
    }


    _focusToNode(node: cc.Node) {
        this._mask._graphics.clear();
        let rect = node.getBoundingBoxToWorld();
        let p = this.node.convertToNodeSpaceAR(rect.origin);
        rect.x = p.x;
        rect.y = p.y;
        this._mask._graphics.fillRect(rect.x, rect.y, rect.width, rect.height);
        return rect;
    }


    fingerToNode(node: cc.Node, markonCb) {
        if (!this._finger) {
            markonCb();
        }
        this._finger.active = true;
        this._finger.stopAllActions();

        let p = this.node.convertToNodeSpaceAR(node.parent.convertToWorldSpaceAR(node.position));
        p.y -= 160

        this._finger.setPosition(p);
        markonCb();
    }


}
