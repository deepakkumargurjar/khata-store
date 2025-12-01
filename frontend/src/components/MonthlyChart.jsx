import React, { useEffect, useState } from 'react'
import API from '../api'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'

export default function MonthlyChart(){
  const [data, setData] = useState([])

  useEffect(()=>{ fetchData() }, [])

  async function fetchData(){
    try{
      const res = await API.get('/stats/monthly')
      // transform month numbers to labels
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
      const d = res.data.map(i => ({ name: `${months[i.month-1]} ${i.year}`, total: i.total }))
      setData(d.reverse()) // make chronological
    }catch(err){ console.error('chart err', err) }
  }

  if(!data.length) return <div className="card">No data for chart</div>
  return (
    <div className="card" style={{padding:16}}>
      <h3>Monthly Expenses</h3>
      <div style={{width:'100%', height:280}}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
