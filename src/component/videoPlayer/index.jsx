import React  from 'react';
import {Button} from 'antd-mobile';

class VideoPlayer extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            btnAnimation: '',
            btnList: '',
            isShowMask: true
        }
        this.timer = 0
    }
    UNSAFE_componentWillMount() {
        if(this.props.button) {
            this.setState({btnList: this.createBtnList(this.props.button)})
        }
        this.setState({isShowMask: !!this.props.isShowMask})
    }
    UNSAFE_componentWillReceiveProps(recieve) {
        this.setState({btnList: this.createBtnList(recieve.button)})
    }
    componentWillUnmount() {
        clearTimeout(this.timer)
    }
    createBtnList(arr) {
        let retArr = []
        if(arr.length) {
            arr.forEach((e, index) => {
                retArr.push(<Button className={e.className} onClick={e.func.bind(e, this.props.streamID)} loading={e.loading} disabled={e.disabled} key={e.className + index} size="small">
                    {e.title}
                </Button>)
            })
        } else {
            return null
        }
        
        return <div className="buttonList">
            {retArr}
        </div>
    }
    animationHandler() {
        if(this.state.btnAnimation) {
            clearTimeout(this.timer)
            this.setState({
                btnAnimation: ''
            })
        } else {
            this.setState({
                btnAnimation: 'active'
            }, () => {
                this.timer = setTimeout(() => {
                    this.setState({btnAnimation: ''}, () => {clearTimeout(this.timer);})
                }, 2000)
            })
        }

    }

    playVideo() {
        document.getElementById(this.props.id).play()
    }
    render() {
        // return <div className={`videoContainer ${this.state.btnAnimation}`}>
        return <div className={`videoContainer active`}>
            {/*{ this.state.isShowMask ? <div className="mask" onClick={this.playVideo.bind(this)}/> : null}*/}
            <div className="videoInfo">{this.props.streamID || 'Video'}</div>
            {/*<video muted={this.props.muteVideo} autoPlay playsInline controls={false} id={this.props.id} onClick={this.animationHandler.bind(this)}/>*/}
            <video muted={this.props.muteVideo} autoPlay playsInline controls={false} id={this.props.id}/>
            {this.state.btnList}
        </div>
            
    }
}
export default VideoPlayer