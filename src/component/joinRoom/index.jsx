import React  from 'react';
import {List, InputItem, Button, Picker, Toast, Modal} from 'antd-mobile';
import {joinRoom, getUrlParams, randomNumber} from '../../utils/common'

const operation = Modal.operation;

class JoinRoom extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            btnState: [],
            role: window.TTTRoom.client._config.role,
            userIDError: false,
            roomIDError: false
        }
        /** 这里配置加入房间参数 */
        this.joinRoomConfig = {
            appid: 'a967ac491e3acf92eed5e1b5ba641ab7', // 提供用户测试用，必填
            roomid: '123', //房间号，必填
            userid: randomNumber(6)
        }
        this.roleData = [
            {value: 1, label: '主播'},
            {value: 2, label: '副播'},
            {value: 3, label: '观众'}
        ]
    }
    UNSAFE_componentWillReceiveProps(recieve) {
        this.setState({btnState: {loading: false, disabled: false}})
    }
    componentDidMount() {
        let {roomid, userid, role} = getUrlParams()
        if( roomid && userid && role) {
            this.joinRoomConfig.roomid = roomid
            this.joinRoomConfig.userid = userid
            window.TTTRoom.client.setClientRole()
            this.joinRoom()
        }
        if(/iphone|ipad|ipod|macintosh/i.test(navigator.userAgent)) {
            navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(stream => {})
        }
    }
    joinRoom() {
        if(this.state.roomIDError || this.state.userIDError) return
        joinRoom(this.joinRoomConfig, () => {}, (err) => {
            let e
            try {
                e = JSON.stringify(err)
            } catch (reason) {
                e = err.toString()
            }
            Toast.fail(e)
        })
        this.setState({
            btnState: {loading: true, disabled: true}
        })
    }
    changeRole(val) {
        window.TTTRoom.client._config.role = val[0]
        this.setState({role: val[0]})
    }
    checkUserID(val) {
        if(/^[1-9]/.test(val) && (val.length < 10 || val < 4294967295)) {
            this.joinRoomConfig.userid = val
            this.setState({userIDError: false})
        } else {
            Toast.info('请输入纯数字用户ID，且不大于 4294967295', 3, null, false)
            this.setState({userIDError: true})
        }

    }
    checkRoomID(val) {
        if(/^[1-9]/.test(val) && (val.length < 10 || val < 4294967295)) {
            this.joinRoomConfig.roomid = val
            this.setState({roomIDError: false})
        } else {
            Toast.info('请输入纯数字直播间ID，且不大于 4294967295', 3, null, false)
            this.setState({roomIDError: true})
        }
    }
    selectServer() {
        operation([
            {text: '82', onPress: () => {window.RTC.setServerUrl('112_126_103_82.3ttech.cn')}},
            {text: '215', onPress: () => {window.RTC.setServerUrl('112_125_27_215.3ttech.cn')}},
            {text: 'webmediat1', onPress: () => {window.RTC.setServerUrl('webmediat1.3ttech.cn')}},
            {text: 'webmediat2', onPress: () => {window.RTC.setServerUrl('webmediat2.3ttech.cn')}},
            {text: 'webmediat3', onPress: () => {window.RTC.setServerUrl('webmediat3.3ttech.cn')}},
            {text: '235', onPress: () => {window.RTC.setServerUrl('sdkdemo1.3ttech.cn')}},
            {text: '114.115.172.21', onPress: () => {window.RTC.setServerUrl('114_115_172_21.3ttech.cn')}},
            {text: 'gzeduservice', onPress: () => {window.RTC.setServerUrl('gzeduservice.3ttech.cn')}}
        ])
    }
    setAudioCodec() {
        operation([
            {text: 'opus', onPress: () => {window.TTTRoom.client.setAudioProfile({audioCodec: 'opus'})}},
            {text: 'isac32', onPress: () => {window.TTTRoom.client.setAudioProfile({audioCodec: 'isac32'})}}
        ])
    }
    render() {
        return <div className="joinRoom">
            <List>
                <InputItem defaultValue={this.joinRoomConfig.appid} onChange={(val) => {this.joinRoomConfig.appid = val}}>
                    <div>appID</div>
                </InputItem>
                <InputItem type="number" defaultValue={this.joinRoomConfig.userid} maxLength={10} onBlur={this.checkUserID.bind(this)} onFocus={() => {this.setState({userIDError: false})}} error={this.state.userIDError}>
                    <div>用户ID</div>
                </InputItem>
                <InputItem type="number" defaultValue={this.joinRoomConfig.roomid} maxLength={10} onBlur={this.checkRoomID.bind(this)} onFocus={() => {this.setState({roomIDError: false})}} error={this.state.roomIDError}>
                    <div>直播间ID</div>
                </InputItem>
                <Picker data={this.roleData} value={[Number(this.state.role)]} cols={1} onOk={this.changeRole.bind(this)}>
                    <List.Item arrow="horizontal">角色</List.Item>
                </Picker>

            </List>
            <Button {...this.state.btnState} onClick={this.joinRoom.bind(this)} type="primary">加入房间</Button>
            {/*<span style={{lineHeight:'60px',color:'#0077ff'}} onClick={this.selectServer.bind(this)}>设置服务器</span>*/}
            {/*<span style={{lineHeight:'60px',color:'#0077ff',marginLeft: '1rem'}} onClick={this.setAudioCodec.bind(this)}>设置音频编码</span>*/}
        </div>
    }
}

export default JoinRoom