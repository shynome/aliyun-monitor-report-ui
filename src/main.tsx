import 'normalize.css'
import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";

const render = ()=>{
  ReactDOM.render(
    <App/>,
    document.getElementById('app'),
  )
}

render()

declare var module:any
if(module.hot){
  module.hot.accept('./App',()=>{
    render()
  })
}
