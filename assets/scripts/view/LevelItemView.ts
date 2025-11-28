
const {ccclass, property} = cc._decorator;

@ccclass
export default class LevelItemView extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

  @property(cc.SpriteFrame)
  default: cc.SpriteFrame = null;
  @property(cc.SpriteFrame)
  select: cc.SpriteFrame = null;
  @property(cc.Sprite)
  isOpen: cc.Sprite = null;

    start () {

    }

    public SetLevelIndex(level:Number){
        this.label.string = level.toString();
    }

    public SetLevelState(isSelect:boolean){
        if(isSelect == true)
        {
            this.node.getComponent(cc.Sprite).spriteFrame = this.select;
        }
        else
        {
            this.node.getComponent(cc.Sprite).spriteFrame = this.default;
        }
    }

    public SetOpenState(isOpen:boolean){
        this.isOpen.enabled = !isOpen;
    }

    // update (dt) {}
}
