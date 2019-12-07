import React  from 'react';
import VideoPlayer from '../videoPlayer';
import {openDevice} from '../../utils/common'
// let {openDevice} = require('../../utils/common')

class LocalStream extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            imgurl: '',
            btnAnimation: '',
            btn: this.initBtnList()
        }
        this.timer = 0
        this.defaultDev = 0
        this.camList = []
    }
    componentDidMount() {
        window.RTC.getDevices((val) => {
            val.forEach(e => {
                if(e.kind === 'videoinput') {
                    if(!this.defaultDev) {this.defaultDev = e.deviceId}
                    this.camList.push(e.deviceId)
                }
            })
            this.camList.push(this.camList.shift())
        }, () => {})
        openDevice("localVideo", window.isUseBackCam, this.props.videoProfile, () => {
            window.TTTRoom.isPlay = true
            this.changeStreamState(true)
        })
    }
    componentWillUnmount() {
        window.TTTRoom.localStream && window.TTTRoom.localStream.close()
        window.TTTRoom.localStream = null
    }
    initBtnList() {
        let that = this
        return [
            {
                title: '推流',
                func: function() {
                    that.changeStreamState(true)
                    let btn = this,
                        state = that.state.btn
                    btn.loading = true
                    btn.disabled = true
                    state.shift()
                    that.setState({btn: [btn, ...state]})
                },
                className: 'publishVideoButton'
            },
            {
                title: '拍照',
                func: this.takePhoto.bind(this),
                className: 'captureButton'
            },
            // {
            //     title: '切换摄像头',
            //     func: this.changeCam.bind(this),
            //     className: 'changeCam'
            // }
        ]
    }
    getRate() {
        this.setState({rate:JSON.stringify(window.TTTRoom.localStream.getVideoProfile())})
    }
    changeStreamState(bool) {
        if(bool) {
            window.TTTRoom.client.publish(window.TTTRoom.localStream, () => {
                let that = this
                let btn = that.state.btn.map(e => {
                    if(e.title === '推流') {
                        delete e.loading
                        delete e.disabled
                        e.title = '停止推流'
                        e.func = function() {
                            let btn = this,
                                state = that.state.btn
                            btn.loading = true
                            btn.disabled = true
                            state.shift()
                            that.setState({btn: [btn, ...state]}, () => {
                                that.changeStreamState(false)
                            })
                        }
                    }
                    return e
                })
                this.setState({btn})
            }, () => {})
        } else {
            window.TTTRoom.client.unpublish(window.TTTRoom.localStream, () => {
                let that = this
                let btn = that.state.btn.map(e => {
                    if(e.title === '停止推流') {
                        delete e.loading
                        delete e.disabled
                        e.title = '推流'
                        e.func = function() {

                            let btn = this,
                                state = that.state.btn
                            btn.loading = true
                            btn.disabled = true
                            state.shift()
                            that.setState({btn: [btn, ...state]}, () => {
                                that.changeStreamState(true)
                            })
                        }
                    }
                    return e
                })
                this.setState({btn})
            }, () => {})
        }
    }
    changeCam() {
        if(this.camList.length <= 1) return
        let cam = this.camList.shift()
        openDevice('localVideo', cam, this.props.videoProfile,() => {
            this.camList.push(cam)
        })
    }
    takePhoto() {
        let success = (file) => {
                let download = document.createElement('a')
                download.setAttribute('download', file.name)
                download.setAttribute('href', URL.createObjectURL(file))
                download.setAttribute('target', '_blank')
                download.click()
            }
        window.TTTRoom.localStream.capture('file', 'myphoto', success)
    }
    
    clearPhoto() {
        this.setState({imgurl: ''})
    }
    render() {
        return <div className="localStream">
            <VideoPlayer muteVideo={true} button={this.state.btn} id="localVideo"/>
            {/*{this.state.imgurl ? <img alt="preview" id="preview" src={this.state.imgurl}/> : ''}*/}
    </div>
    }
}

export default LocalStream