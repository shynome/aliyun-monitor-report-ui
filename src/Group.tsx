import React, { useState, useEffect } from 'react'
import { Select, MenuItem, Tooltip, Switch, Button } from "@material-ui/core";
import { api, Category } from "./api";
import { Report } from "./Report";

type Item = {
  GroupId: number
  Type: string
  GroupName: string
}

export const Group: React.StatelessComponent = () => {

  const [groupId, setGroupId] = useState(0)
  const [namespaces, setNamespaces] = useState(Object.keys(Category))
  const [group, setGroup] = useState<Item[]>([])
  useEffect(() => {
    void async function () {
      let res = await api.get<Item[]>('/group/list')
      setGroup(res.data)
      setGroupId(res.data[0].GroupId)
    }()
  }, [])

  return (
    <div>
      <Select
        value={groupId}
        onChange={(e) => setGroupId(e.target.value as any)}
      >
        {group.map((item) => <MenuItem key={item.GroupId} value={item.GroupId}>{item.GroupName}</MenuItem>)}
      </Select>
      <Select
        multiple
        onChange={e => {
          setNamespaces(e.target.value as any)
        }}
        value={namespaces}
      >
        {Object.keys(Category).map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
      </Select>
      <Button onClick={()=>setNamespaces(Object.keys(Category))}>全选</Button>
      <Button onClick={()=>setNamespaces([])}>全不选</Button>
      {!groupId ? null : <Report Namespaces={namespaces} GroupID={groupId} StartTime="2019-07-21 00:00:00" EndTime="2019-08-01 00:00:00" />}
    </div>
  )
}
