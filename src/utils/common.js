function _userJoin(evt) {
    let {appData} = evt.peer
    window.TTTRoom.users[evt.peer.name] = {
        name: appData.displayName,
        id: evt.peer.name,
        device: appData.device,
        role: appData.role
    }
}
function _userLeave(evt) {
    delete window.TTTRoom.users[evt.peer.name]
}
function setSEI(userid){
    let sei =  {
        mid: userid,
        pos: [
            {
                id: userid,
                x: 0,
                y: 0,
                w: 1,
                h: 1,
                z: 0
            }
        ],
        ts: Date.now(),
        ver: "20161227",
        canvas: {
            w: 640,
            h: 480,
            bgrgb: [0,0,0]
        }
    }
    window.TTTRoom.client.setSEI(userid, 'add', false, sei)
}
/** 加入直播间 start
 * 
 * 加入成功会在eventBus上通过joinRoomSuccessful事件通知
 * client.on('joinRoomSuccessful', () => {})
 */
function joinRoom({appid, userid, roomid}, success, fail) {
    // window.RTC.setServerUrl('stech.3ttech.cn')
    window.TTTRoom.client.init(appid, userid, () => {
        console.log('initRoomSuccessful', userid)
        /** 初始化成功 */
        window.TTTRoom.client.on('peer-join', _userJoin)
        window.TTTRoom.client.on('peer-leave', _userLeave)
        window.TTTRoom.client.on('kickout', leaveRoom)
        // window.TTTRoom.client.on('stream-published', setSEI.bind(this, userid))
        window.TTTRoom.client.join(roomid, () => {
            /** 加入成功 */
            console.log('joinRoomSuccessful')
            success && success()

            window.eventBus.emit('joinRoomSuccessful')
        }, (err) => {
            /** 加入失败回调 */
            fail && fail(err)
            window.eventBus.emit('joinRoomfail', err)
        })

    }, (err) => {
        /** 初始化失败回调 */
        window.eventBus.emit('joinRoomfail', 'please check appid or userid.')
    })
}
/** 加入房间 end */

/** 离开房间 start
 *
 */
function leaveRoom() {
    // const isPC = /windows/i.test(navigator.userAgent)
    if(window.TTTRoom.localStream) {
        window.TTTRoom.localStream.close()
    }
    window.TTTRoom.client.close()
    window.location.reload()
    // window.TTTRoom = {
    //     client: window.RTC.createClient({role: isPC?1:2}), // 1:主播， 2:副播  3:观众
    //     remoteStream: new Map(),
    //     users: {}
    // }

    // window.eventBus.emit('joinRoomfail', 'Back to Login.')
}
/**
 * 离开房间 end
 */
/** 打开音视频设备 start */
function openDevice(elementID, cameraId, videoProfile,success, fail) {
    let streamProperty = {
        streamID: window.TTTRoom.client._uid || 1,
        audio: true,
        video: true,
        screen: false,
        cameraId
    }
    if(typeof cameraId === 'boolean') {
        streamProperty.useBackCam = cameraId
        delete streamProperty.cameraId
    }
    window.TTTRoom.localStream = window.RTC.createStream(streamProperty)
    window.TTTRoom.localStream.init(() => {
        window.TTTRoom.localStream.setVideoProfile(videoProfile || '480P', () => {
            window.TTTRoom.localStream.play(elementID)
        })
        /** 初始化成功 */
        success && success()
        
    }, (err) => {
        fail && fail(err)
        /** 初始化失败回调 */
    })
}
/** 打开音视频设备 end */

function pauseMic() {
    window.TTTRoom.client.pauseMic()
}
function resumeMic() {
    window.TTTRoom.client.resumeMic()
}

function pauseWebcam() {
    window.TTTRoom.client.pauseWebcam()
}
function resumeWebcam() {
    window.TTTRoom.client.resumeWebcam()
}
function disableVideo() {
    window.TTTRoom.localStream.disableVideo()
}
function enableVideo() {
    window.TTTRoom.localStream.enableVideo()
}

/**
 * 生成随机字符串
 * @param {number} length
 * @param {string} dict default '0-9'
 * @return {string}
 */
function randomNumber(length, dict) {
    let randomDict = dict || '1234567890',
        randomNumber,
        ret = ''
    for(let i = 0; i < length; i++) {
        randomNumber = parseInt(Math.random() * randomDict.length)
        ret += randomDict.slice(randomNumber, randomNumber + 1)
    }
    if(!dict){
        ret = ret.replace(/^0/, parseInt(Math.random() * 9 + 1))
    }
    return ret
}
/**
 * 获取url参数
 * @return {object}
 */
function getUrlParams() {
    let searchParams = new URL(window.location.href).searchParams,
        params = {}
    for(let [key, value] of searchParams) {
        params[key] = value
    }
    return params
}
export {
    joinRoom,
    leaveRoom,
    openDevice,
    pauseMic,
    resumeMic,
    pauseWebcam,
    resumeWebcam,
    disableVideo,
    enableVideo,
    getUrlParams,
    randomNumber
}