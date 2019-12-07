1.npm i  
2.npm start启动项目

#代码说明

UI库 https://mobile.ant.design/docs/react/introduce-cn  
  
###在src/index.js中引入三体云websdk  

    import TTTRtcWeb from 'tttwebsdk';
    window.RTC = new TTTRtcWeb();
     
 -
###在src/index.js中创建房间  

    window.TTTRoom = {
        client: window.RTC.createClient({role: 1}), // 1:主播， 2:副播  3:观众
        remoteStream: new Map(),
        users: {}
    }
    
-
###在src/utils/common.js封装常用操作方法供组件调用  

example:

    function joinRoom({appid, userid, roomid}, success, fail) {
    
        // 初始化房间相关配置
        window.TTTRoom.client.init(appid, userid, () => {
        
            /** 初始化成功,这个时候可以在client实例上监听相应事件 */
            window.TTTRoom.client.on('peer-join', _userJoin)
            window.TTTRoom.client.on('peer-leave', _userLeave)
            window.TTTRoom.client.on('kickout', leaveRoom)
            
            /** 加入房间 */
            window.TTTRoom.client.join(roomid, () => {
            
                /** 加入成功，这时已经加入到房间 */
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
        })
    }
    
-
###组件（src/component）

main: 根组件  
joinroom: 登陆组件  
videoPlayer: 封装基本视频播放功能  
localStream: 本地视频播放器，调用videoPlayer进行播放  
navBar: 导航栏  
userList: 用户列表，以主播身份进入可用  
