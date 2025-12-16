/*
 * @Author: jxgamestudio
 * @Description: GuideTask 
 */

export const task = {
    name: 'Task',
    debug: true,
    steps: [
        {
            order: 0,
            name: 'GuideTask',
            command: {
                cmd: 'movefinger',
                text: 'Please select this cup',
                args: 'game/GameView/bgColor/cupBg/cupMgr/layout_v/layout_h_0/cup_p',
                index:0
            },
            delayTime: 0.1,
            onStart(callback) {
                callback();
            },
            onExcute(callback) {
                callback();
            },
            onEnd(callback) {
                callback();
            }
        },
        {
            order: 1,
            name: 'GuideBag',
            command: {
                cmd: 'movefinger',
                text: 'Fill the same cup with water of the same color',
                args: 'game/GameView/bgColor/cupBg/cupMgr/layout_v/layout_h_0/cup_p,cup_p',
                index:1
            },
            delayTime: 0.2,
            onStart(callback) {
                callback();
            },
            onExcute(callback) {
                callback();
            },
            onEnd(callback) {
                callback();
            }
        }
    ]
}