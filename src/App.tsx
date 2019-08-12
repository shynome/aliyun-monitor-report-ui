import React from "react";
import { Namespaces } from "./Namespaces";
import { Group } from "./Group";
import { Report } from "./Report";

export const App:React.StatelessComponent = ()=> {

  return (
    <div>
      <Group/>
      {/* <Namespaces/> */}
    </div>
  )
}
