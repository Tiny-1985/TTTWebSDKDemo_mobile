import React  from 'react';
import LocalStream from '../localStream';
import VideoPlayer from '../videoPlayer';
import NaviBar from '../navBar';
import UserList from '../userList';

class Main extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            videoList: [],
            btn: this.initBtnList(),
            userListState: ''
        }
        this.localVideo = ''
        this.remoteVideoList = []
    }
    UNSAFE_componentWillMount() {
        window.TTTRoom.client.on('stream-added', this.streamAdded.bind(this))
        window.TTTRoom.client.on('stream-removed', this.streamRemoved.bind(this))
        window.TTTRoom.client.on('peer-leave', this.userLeave.bind(this))
        window.TTTRoom.client.on('stream-subscribed', this.streamSubscribed.bind(this))
        window.TTTRoom.client.on('stream-unsubscribed', this.streamUnsubscribed.bind(this))
        window.TTTRoom.client.on('video-mute', this.videoMute.bind(this))
        window.TTTRoom.client.on('audio-mute', this.audioMute.bind(this))
        window.TTTRoom.client.on('video-unmute', this.videoUnMute.bind(this))
        window.TTTRoom.client.on('audio-unmute', this.audioUnMute.bind(this))

        window.eventBus.on('open-camera', this.openCamera.bind(this))
        window.eventBus.on('changeUserListState', this.changeUserListState.bind(this))

        this.setState({videoList: [this.localVideo, ...this.remoteVideoList]})
    }
    initBtnList() {
        return [
            {
                title: '拍照',
                func: this.takePhoto,
                className: 'captureButton'
            },
            {
                title: '停止订阅',
                func: this.unsubscribed,
                className: 'streamUnsubscribed'
            },
            // {
            //     title: '静音',
            //     func: ''
            // }
        ]
    }
    userLeave(evt) {
        for(let [id, stream] of evt.streams) {
            this.streamUnsubscribed({stream})
        }
    }
    videoMute(evt) {}
    audioMute(evt) {}
    videoUnMute(evt) {}
    audioUnMute(evt) {}
    streamAdded(evt) {
        window.TTTRoom.client.subscribe(evt.stream, () => {
            console.log('streamSubscribed: remoteStream callback', evt.stream)
        }, () => {
            console.log('streamSubscribed', 'fail')
        })
    }
    streamRemoved(evt) {
        console.error(evt)
    }
    unsubscribed(streamID) {
        let stream = window.TTTRoom.remoteStream.get(streamID)
        window.TTTRoom.client.unsubscribe(stream, () => {}, () => {})
    }
    streamSubscribed(evt) {
        let {stream} = evt
        window.TTTRoom.remoteStream.set(stream.streamID.toString(), stream)
        if(stream.type === 'audio') {
            stream.play()
            return
        }
        this.remoteVideoList.push(<div className="remoteStream" key={stream.streamID}><VideoPlayer id={'remotevideo'+stream.streamID} streamID={stream.streamID} button={this.state.btn}/></div>)
        this.setState({videoList: [this.localVideo, ...this.remoteVideoList]}, () => {
            stream.play(`remotevideo${stream.streamID}`)
        })

    }
    streamUnsubscribed(evt) {
        let {stream: {streamID}} = evt
        this.remoteVideoList = this.remoteVideoList.filter(e => {
            return e.key.toString() !== streamID.toString()
        })
        this.setState({videoList: [this.localVideo, ...this.remoteVideoList]})
    }
    takePhoto(id) {
        let papams ={
                        retType: 'file',
                        success: (file) => {
                            let download = document.createElement('a')
                            download.setAttribute('download', file.name)
                            download.setAttribute('href', URL.createObjectURL(file))
                            download.setAttribute('target', '_blank')
                            download.click()
                            // this.setState({imgurl: file})
                        }
                    },
            stream = window.TTTRoom.remoteStream.get(id)

        stream.capture(papams)
    }
    openCamera(data) {
        this.localVideo = data.close ? null : <LocalStream key="local" videoProfile={data.size}/>
        this.setState({videoList: [this.localVideo, ...this.remoteVideoList]})
    }
    changeUserListState() {
        this.setState({userListState: !this.state.userListState})
    }
    render() {
        return <div className="main">
            <NaviBar/>
            <UserList className={this.state.userListState ? 'active':''}/>
            <div className="videoList">
                {this.state.videoList}
            </div>
        </div>
    }
}
export default Main