import React from 'react';
import './App.css';
import JoinRoom from './component/joinRoom';
import Main from './component/main'

class App extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            isJoinRoom: false
        }
    }

    componentDidMount() {
        window.eventBus.on('joinRoomSuccessful', () => {
          this.setState({isJoinRoom: true})
        })
        window.eventBus.on('joinRoomfail', () => {
          this.setState({isJoinRoom: false})
        })
        if(/iphone|ipad|ipod|macintosh/i.test(navigator.userAgent)) {
            navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(stream => {})
        }
    }

    render() {
        return <div className="App">
            {this.state.isJoinRoom ? <Main/> : <JoinRoom loginState={this.state.isJoinRoom}/>}
        </div>
    }
}

export default App;
