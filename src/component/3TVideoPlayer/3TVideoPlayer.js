/** utils */
function _isFunc(foo) {
    return /^function$/i.test(typeof foo)
}
function _isObj(obj) {
    return /^\[object\sobject\]/i.test(Object.prototype.toString.call(obj))
}

const resolutionObj = {
    80: {width: 80, height: 60},       //80*60      | 15   | 40*1000     60p
    120: {width: 160, height: 120},    //160*120    | 15   | 65*1000     120p
    180: {width: 320, height: 180},    //320*180    | 15   | 140*1000    180p
    240: {width: 320, height: 240},    //320*240    | 15   | 200*1000    240p
    360: {width: 640, height: 360},    //640*360    | 15   | 400*1000    360p
    480: {width: 640, height: 480},    //640*480    | 15   | 500*1000    480p
    720: {width: 1280, height: 720},   //1280*720   | 15   | 1130*1000   720p
    1080: {width: 1920, height: 1080}, //1920*1080  | 15   | 2080*1000   1080p
    1440: {width: 2560, height: 1440}, //2560*1440  | 15   | 2080*1000   2k
    2160: {width: 3840, height: 2160}  //3840*2160  | 15   | 2080*1000   4k
}
const videoMap = new Map()
function InitPlayer(options) {
    if(!_isObj(options)) throw new TypeError('options should be Object')
    if(options.autoplay) {
        return AutoPlayer
    } else {
        return Player
    }
}
function AutoPlayer({client, streamAdd}) {

    if(!_isFunc(streamAdd))
    let config = {
        client,
        streamAdd: function (evt, next) {
            _isFunc(streamAdd) && next(streamAdd(evt))
        }
    }
    Player(config)
}

function Player({client, streamAdd}) {

    client.on('stream-added', (evt) => {
        let {stream} = evt
        function next(eleID) {
            let thisStream = videoMap.get(stream.streamID)
            let isPlaying = thisStream && thisStream.playState

            if(isPlaying) return

            thisStream = {stream, playState: false}
            client.subscribe(stream, () => {
                thisStream.playState = true
                let res = playStream(evt, eleID)
                thisStream.dom = res.container
                videoMap.set(stream.streamID, thisStream)

            }, () => {
                thisStream.playState = false
            })
        }
        _isFunc(streamAdd) && streamAdd(evt, next)
    })
    client.on('stream-playmyself', (evt) => {
        playStream(evt, evt.eleID, true)
    })
    client.on('peer-leave', (evt) => {
        let domList = document.getElementsByClassName('user_' + evt.userID)
        for(let i=domList.length - 1; i >= 0; i--) {
            domList[i].remove()
        }
        if(evt.streams) {
            for(let [streamID, stream] of evt.streams) {
                videoMap.delete(stream.streamID)
            }
        }
    })
}

function playStream(evt, elementID, muteAudio) {
    let res = stream2Video(evt.stream)
    res.video.muted = !!muteAudio
    document.querySelector('#' + elementID).appendChild(res.container)
    zoomVideoElement(res.container, res.video)
    return res
}
function stream2Video(stream) {
    let video,
        container = document.createElement('div'),
        userInfo = document.createElement('span')

    container.innerHTML = `<video autoplay playsinline id="stream_${stream.streamID}"></video>`;
    container.appendChild(resizeListener)
    container.appendChild(userInfo)
    video = container.querySelector('video');

    container.style.display = 'flex';
    container.style.position = 'relative';
    container.style.width = '100%';
    container.style.height = '100%';
    // container.style.overflow = 'hidden';
    container.style.backgroundColor = '#000';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    container.setAttribute('class', 'user_' + stream.userID)

    userInfo.innerText =  "streamID : " + stream.streamID;
    userInfo.style.position = 'absolute';
    userInfo.style.bottom = '-30px'

    video.srcObject = stream._streamObj
    video.width = resolutionObj[stream._keyResolution].width
    video.height = resolutionObj[stream._keyResolution].height

    return {container, video}
}

function zoomVideoElement(pElement, cElement) {
    let zoom = 1,
        {clientWidth, clientHeight} = pElement,
        {width, height} = cElement
    if(clientWidth && clientHeight) {
        let pScale = clientWidth / clientHeight,
            cScale = width / height
        if(pScale > cScale) {
            zoom = height > clientHeight ? clientHeight / height : height / clientHeight
        } else {
            zoom = width > clientWidth ? clientWidth / width : width / clientWidth
        }
    }
    cElement.style.zoom = zoom
    return cElement
}

export {
    InitPlayer,
    stream2Video
}