import React  from 'react';
import VideoPlayer from '../videoPlayer';

class RemoteStream extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            videoList: [],
            btn: this.initBtnList()
        }
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
            }
        ]
    }
    userJoin(evt) {}
    userLeave(evt) {}
    videoMute(evt) { console.error(evt)}
    audioMute(evt) { console.error(evt)}
    videoUnMute(evt) { console.error(evt)}
    audioUnMute(evt) { console.error(evt)}
    streamAdded(evt, type) {
        if(type !== 'audio') {
            let {videoList} = this.state
            videoList.push(<VideoPlayer id={'remotevideo'+evt.stream._streamID} streamID={evt.stream._streamID} key={evt.stream._streamID} button={this.state.btn}/>)
            this.setState({videoList})
        }

        window.TTTRoom.client.subscribe(evt.stream, () => {
            console.log(`streamSubscribed success (${type}) : ${evt.stream}`)
        }, () => {
            console.log(`streamSubscribed fail (${type}) : ${evt.stream}`)
        })
    }
    unsubscribed(streamID) {
        window.TTTRoom.client.unsubscribe(window.TTTRoom.remoteStream.get(streamID), () => {}, () => {})
    }
    streamSubscribed(evt) {
        window.TTTRoom.remoteStream.set(evt.stream._streamID.toString(), evt.stream)
        if(evt.stream.type === 'audio') {
            evt.stream.play()
        } else {
            evt.stream.play(`remotevideo${evt.stream._streamID}`)
        }
    }
    streamUnsubscribed(evt) {
        let {videoList} = this.state
        videoList = videoList.filter(e => {
            return e.key.toString() !== evt.stream._streamID.toString()
        })
        this.setState({videoList})
    }
    takePhoto(id) {
        let papams = {
            retType: 'file',
            success: (file) => {
                let download = document.createElement('a')
                download.setAttribute('download', file.name)
                download.setAttribute('href', URL.createObjectURL(file))
                download.click()
                // this.setState({imgurl: file})
            }
        }
        window.TTTRoom.remoteStream.get(id).capture(papams)
    }
    render() {
        return <div className="remoteStream">
                {this.state.videoList}
        </div>
    }
}
export default RemoteStream