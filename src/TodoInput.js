import React,{Component} from 'react'
function submit(props,e){
    if(e.key === 'Enter'){
        if(e.target.value.trim()!== ''){
            props.onSubmit(e)
        }
    }
}
function changeTitle(props,e){
    props.onChange(e)
}
export default function(props){
    return (
        <input type="text" className="todoInput" value={props.content}
                   onKeyPress={submit.bind(null,props)}
                   onChange={changeTitle.bind(null,props)}/>
    )
}