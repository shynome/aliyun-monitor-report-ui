import React, { useState, useEffect } from 'react'
import { Select, MenuItem, Button } from "@material-ui/core";
import { api, Category } from "../../lib/api";
import { Report } from "./Report";
import update from "react-addons-update";

type Item = {
  GroupId: number
  Type: string
  GroupName: string
}

import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns'
import *as locale from 'date-fns/locale'
type TimePickerProps = {
  StartTime: string
  EndTime: string
}
const timeUtils = new DateFnsUtils({ locale: locale.zhCN })
const timeLayout = "yyyy-MM-dd hh:mm:ss"
class _Utils { constructor(){ return timeUtils } }

export const TimePicker: React.StatelessComponent<TimePickerProps> = (props) => {

  const [time, _setTime] = useState<TimePickerProps>({ StartTime: props.StartTime, EndTime: props.EndTime })
  const setTime = (v: TimePickerProps) => {
    _setTime(v)
  }

  return (
    <MuiPickersUtilsProvider utils={_Utils}>
      <DateTimePicker label="起始时间" variant="inline" format={timeLayout}
        onChange={(value) => {
          let v = timeUtils.format(value as Date, timeLayout)
          setTime(update(time, { $set: { StartTime: v } }))
        }}
        value={time.StartTime}
      />
      <DateTimePicker label="结束时间" variant="inline" format={timeLayout}
        onChange={(value) => {
          let v = timeUtils.format(value as Date, timeLayout)
          setTime(update(time, { $set: { EndTime: v } }))
        }}
        value={time.EndTime}
      />
    </MuiPickersUtilsProvider>
  )
}

export const Group: React.StatelessComponent = () => {

  const [timeDuration, setTimeDuration] = useState<TimePickerProps>({ StartTime: "2019-07-21 00:00:00", EndTime: "2019-08-01 00:00:00" })

  const [groupId, setGroupId] = useState(0)
  const [namespaces, setNamespaces] = useState(Object.keys(Category))
  const [group, setGroup] = useState<Item[]>([])
  useEffect(() => {
    void async function () {
      let res = await api.get<Item[]>('/group/list')
      setGroup(res.data)
      setGroupId(res.data[0].GroupId)
      console.log(setTimeDuration)
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
      <Button onClick={() => setNamespaces(Object.keys(Category))}>全选</Button>
      <Button onClick={() => setNamespaces([])}>全不选</Button>
      <TimePicker StartTime={timeDuration.StartTime} EndTime={timeDuration.EndTime} />
      {1 || !groupId ? null : <Report Namespaces={namespaces} GroupID={groupId} StartTime={timeDuration.StartTime} EndTime={timeDuration.EndTime} />}
    </div>
  )
}
