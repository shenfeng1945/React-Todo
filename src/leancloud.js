import AV from 'leancloud-storage'

var APP_ID = 'BY4Kd8WN46yNSeiPISQfpuFU-gzGzoHsz';
var APP_KEY = 'zl0rKYVen3FLAiJduHuAK4q6';

AV.init({
    appId: APP_ID,
    appKey: APP_KEY
});
export default AV
export const TodoModel = {
    create({status,title,deleted},successFn,errorFn){
        let Todo = AV.Object.extend('Todo')
        let todo = new Todo()
        todo.set('title',title)
        todo.set('status',status)
        todo.set('deleted',deleted)
        let acl = new AV.ACL()
        acl.setPublicReadAccess(false) // 注意这里是 false
        acl.setWriteAccess(AV.User.current(), true)
        acl.setReadAccess(AV.User.current(), true)
        todo.setACL(acl);
        todo.save().then((response)=>{
            successFn.call(null,response.id)
        },(error)=>{
            errorFn && errorFn.call(null,error)
        })
    },
    getByUser(user,successFn,errorFn){
        let query = new AV.Query('Todo')
        query.equalTo('deleted',false)
        query.find().then((response)=>{
            let array = response.map((t)=>{
                return {id:t.id,...t.attributes}
            })
            successFn.call(null,array)
        },(error)=>{
            errorFn && errorFn.call(null,error)
        })
    },
    update({id,title,status,deleted},successFn,errorFn){
        console.log('id',id)
        let todo = AV.Object.createWithoutData('Todo', id)
        title !==undefined && todo.set('title',title)
        status !==undefined && todo.set('status',status)
        deleted !==undefined && todo.set('deleted',deleted)
        todo.save().then((response)=>{
            successFn && successFn.call(null)
        },(error)=>{
            errorFn && errorFn.call(null,error)
        })
    },
    destroy(todoId,successFn,errorFn){
        TodoModel.update({id:todoId,deleted:true},successFn,errorFn)
    }

}
export function signUp(email,username,password,successFn,errorFn){
    // 新建 AVUser 对象实例
    var user = new AV.User()
    // 设置用户名
    user.setUsername(username)
    // 设置密码
    user.setPassword(password)
    // 设置邮箱
    user.setEmail(email)
    user.signUp().then(function (loginedUser) {
        let user = getUserFromAVUser(loginedUser)
        successFn.call(null,user)
    }, function (error) {
        errorFn.call(null,error)
    });
    return undefined
}
export function signIn(username,password,successFn,errorFn){
    AV.User.logIn(username, password).then(function(loginedUser){
        let user = getUserFromAVUser(loginedUser)
        successFn.call(null,user)
    },function(error){
        errorFn.call(null,error)
    })
}
export function signOut(){
    AV.User.logOut()
    return undefined
}
export function sendPassword(email,successFn,errorFn){
    AV.User.requestPasswordReset(email).then(function (success) {
        console.log(success)
        successFn.call(null,success)
    }, function (error) {
        errorFn.call(null,error)
    });
}
export function getCurrentUser(){
    let user = AV.User.current()
    if(user){
        return getUserFromAVUser(user)
    }else{
        return null
    }
}
function getUserFromAVUser(AVUser){
    return {
        id:AVUser.id,
        ...AVUser.attributes
    }
}