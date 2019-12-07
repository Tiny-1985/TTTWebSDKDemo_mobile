import React  from 'react';
import {NavBar, Modal, Toast} from 'antd-mobile';
import {leaveRoom} from '../../utils/common'

const operation = Modal.operation;

class NaviBar extends React.Component{
    constructor(props) {
        super(props)
        this.roleDict = ['', '主播', '副播', '观众']
        this.state = {
            role: +window.TTTRoom.client._role,
            title: `${this.roleDict[+window.TTTRoom.client._role]} - ${window.TTTRoom.client._uid}`
        }
    }
    UNSAFE_componentWillMount() {}
    openCamera() {
        if(window.TTTRoom.localStream) {
            operation([
                {text: '关闭摄像头', onPress: () => {window.eventBus.emit('open-camera', {close: true})}}
            ])
        } else {
            // IOS 只支持发布480P和720P的视频
            let openset = () => {
                operation([
                    {text: '720P', onPress: () => {window.eventBus.emit('open-camera', {size: '720P'})}},
                    {text: '480P', onPress: () => {window.eventBus.emit('open-camera', {size: '480P'})}},
                    // {text: '360P', onPress: window.eventBus.emit.bind(this, 'open-camera', {size: '360P'})},
                    // {text: '240P', onPress: window.eventBus.emit.bind(this, 'open-camera', {size: '240P'})},
                    // {text: '180P', onPress: window.eventBus.emit.bind(this, 'open-camera', {size: '180P'})},
                    // {text: '120P', onPress: window.eventBus.emit.bind(this, 'open-camera', {size: '120P'})},
                ])
            }
            operation([
                {text: '前摄像头', onPress: () => {window.isUseBackCam = false; openset()}},
                {text: '后摄像头', onPress: () => {window.isUseBackCam = true; openset()}}
            ])

        }

    }
    changeRole() {
        let role = 2
        if(this.state.role === 2) {
            role = 3
        }
        try{
            window.TTTRoom.client.setClientRole(role, () => {
                Toast.success(`sucess: ${role}`)
                this.setState({role})
            }, (err) => {
                Toast.fail(`fail: ${err.toString()}`)
            })
        } catch (e) {}

    }
    render() {
        return <div className="navBar">
            <NavBar mode="dark"
                    leftContent={
                        <span className="iconfont icon-login-out"/>
                    }
                    onLeftClick={leaveRoom}
                    // rightContent={[
                    //     <span key="2" onClick={this.changeRole.bind(this)}>Role</span>
                    // ]}
                    rightContent={[
                        <span key="0" className="iconfont icon-videocameraadd" onClick={this.openCamera.bind(this)}/>,
                        this.state.role === 1 ? <span key="1" className="iconfont icon-team" onClick={window.eventBus.emit.bind(this, 'changeUserListState')}/>:null
                    ]}
            >{this.state.title}</NavBar>
        </div>
    }
}

export default NaviBar