import React, { useState, useEffect } from 'react'
import { LinearProgress, Table, TableBody, TableHead, TableRow, TableCell } from "@material-ui/core";
import { api } from "./api";

type ReportResp = {
  Errors: string
  Report: { [k: string]: Array<Report> }
}

type ReportParams = {
  GroupID: number
  StartTime: string
  EndTime: string
  Namespaces?: string[]
}

type Dimension = {
  DisplayName: string
  Name: string
  Error: string
  Max: number
  Avg: number
}

type Report = {
  Category: string
  Id: string
  InstanceId: string
  InstanceName: string
  RegionId: string
  Dimensions: Array<Dimension>
  Error: string
}

export const Report: React.StatelessComponent<ReportParams> = (props) => {

  let namespaces = props.Namespaces || []
  
  let [resp, setResp] = useState<ReportResp>(null as any)
  let reqParams: ReportParams = {
    GroupID: props.GroupID,
    StartTime: props.StartTime,
    EndTime: props.EndTime,
  }
  useEffect(() => {
    void async function () {
      let resp = await api.post<ReportResp>('/metric/report', reqParams)
      setResp(resp.data)
    }()
  }, [JSON.stringify(reqParams)])

  if (resp === null) {
    return <LinearProgress />
  }

  if (resp.Errors) {
    return <div>{resp.Errors}</div>
  }

  return (
    <>
      {Object.keys(resp.Report).filter(v=>namespaces.indexOf(v) !== -1).map((key) => {
        let reports = resp.Report[key]
        return (
          <>
            <h3>{key}</h3>
            <Table>
              <TableHead>
                <TableRow>
                  { ["实例名","统计维度","最大值(峰值)","平均值(峰值)"].map(v=><TableCell>{v}</TableCell>) }
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.map((report) => {
                  let h = report.Dimensions.length
                  return report.Dimensions.map((d, i) => (
                    <tr>
                      {i === 0 && <TableCell rowSpan={h}  style={{width:180}}>{report.InstanceName || report.InstanceId}</TableCell>}
                      <TableCell>{d.DisplayName}</TableCell>
                      <TableCell align="right">{d.Max.toFixed(2)}</TableCell>
                      <TableCell align="right">{d.Avg.toFixed(2)}</TableCell>
                    </tr>
                  ))
                })}
              </TableBody>
            </Table>
          </>
        )
      })}
    </>
  )
}
