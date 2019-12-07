import React  from 'react';
import {List} from 'antd-mobile';

const Item = List.Item
class UserList extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            userList: []
        }
    }
    UNSAFE_componentWillMount() {
        this.renderUserItem(Object.values(window.TTTRoom.users))
    }
    UNSAFE_componentWillReceiveProps(recieve) {
        if(recieve.className) {
            this.renderUserItem(Object.values(window.TTTRoom.users))
        }
    }
    kickOutSomeone(userid) {
        window.TTTRoom.client.kickOut(userid.toString())
        delete window.TTTRoom.users[userid]
        window.TTTRoom.remoteStream.delete(userid)
        this.renderUserItem(Object.values(window.TTTRoom.users))

    }
    playRemoteStream(stream) {
        window.TTTRoom.client.subscribe(stream, () => {}, () => {})
    }
    renderUserItem(userData) {
        let userList = userData.map((e, index) => {
            let stream = window.TTTRoom.remoteStream.get(e.id)
            let handler = stream ? <span key={0} className="iconfont icon-play-circle" onClick={this.playRemoteStream.bind(this, stream)}/> : null
            return <Item key={index}
                         extra={[
                             handler,
                             <span key={2} className="iconfont icon-close-circle" onClick={this.kickOutSomeone.bind(this, e.id)}/>
                         ]}
            >{e.name}</Item>
        })
        this.setState({userList})
    }
    render() {
        return <div id="userList" className={this.props.className}>
            <div className="screen-mask" onClick={() => {window.eventBus.emit('changeUserListState')}}/>
            <div className="fixed-space"/>
            <List>
                {this.state.userList}
            </List>
        </div>
    }
}

export default UserList