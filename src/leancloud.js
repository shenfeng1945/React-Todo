import AV from 'leancloud-storage'

var APP_ID = 'BY4Kd8WN46yNSeiPISQfpuFU-gzGzoHsz';
var APP_KEY = 'zl0rKYVen3FLAiJduHuAK4q6';

AV.init({
    appId: APP_ID,
    appKey: APP_KEY
});
export default AV
export const TodoModel = {
    //创建todo
    create(folderId,{status,title,deleted},successFn,errorFn){
        let Todo = AV.Object.extend('Todo')
        let todo = new Todo()
        todo.set('title',title)
        todo.set('status',status)
        todo.set('deleted',deleted)
        todo.set('folderId',folderId)
        let acl = new AV.ACL()
        acl.setPublicReadAccess(false) // 注意这里是 false
        acl.setWriteAccess(AV.User.current(), true)
        acl.setReadAccess(AV.User.current(), true)
        todo.setACL(acl);
        todo.save().then((response)=>{
            successFn.call(null,{
                id:response.id,
                title:response.attributes.title,
                status:response.attributes.status,
                deleted:response.attributes.deleted,
                createTime:response.createdAt,
                updateTime:response.updatedAt,
            })
        },(error)=>{
            errorFn && errorFn.call(null,error)
        })
    },
    getByUser(folderId,successFn,errorFn){
        let todoQuery = new AV.Query('Todo')
        todoQuery.equalTo('deleted',false)
        todoQuery.find().then((response)=>{
            let array = response.filter((item)=>item.attributes.folderId===folderId).map((t)=>{
                return {id:t.id,...t.attributes,updateTime:t.updatedAt,createTime:t.createdAt}
            })
            successFn.call(null,array)
        },(error)=>{
            errorFn && errorFn.call(null,error)
        })
    },
    getFolder(user,successFn){
        let folderQuery = new AV.Query('TodoFolder')
        folderQuery.find().then((folders)=>{
            let todoFolders = []
            folders.forEach((item)=>{
                let folderUserId = item.attributes.userId
                if(folderUserId === user.id){
                    todoFolders.push(item)
                }
            })
            successFn.call(null,todoFolders)
        })
    },
    update({id,title,status,deleted},successFn,errorFn){
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
    },
    createFolder(userId,title,successFn){
        let TodoFolder = AV.Object.extend('TodoFolder')
        let todoFolder = new TodoFolder()
        todoFolder.set('folderName',title)
        todoFolder.set('userId',userId)
        todoFolder.set('todos',[])
        let acl = new AV.ACL();
        acl.setPublicReadAccess(false);
        acl.setWriteAccess(AV.User.current(), true);
        acl.setReadAccess(AV.User.current(), true);
        todoFolder.setACL(acl);
        todoFolder.save().then(function(response){
            successFn && successFn.call(null,response.id)
        },function(error){
            console.log(error)
        })
    },
    init(user,successFn,errorFn){
        let folderName = '我的一天'
        let TodoFolder = AV.Object.extend('TodoFolder')
        let todoFolder = new TodoFolder()
        todoFolder.set('folderName',folderName)
        todoFolder.set('userId',user.id)
        todoFolder.set('todos',[])
        let acl = new AV.ACL();
        acl.setPublicReadAccess(false);
        acl.setWriteAccess(AV.User.current(), true);
        acl.setReadAccess(AV.User.current(), true);
        todoFolder.setACL(acl);
        todoFolder.save().then((response)=>{
            successFn && successFn.call(null,response.id)
        })
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
        // ES6语法，表示导出AVUser.attributes
        ...AVUser.attributes
    }
}