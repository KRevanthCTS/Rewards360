import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/client'

export default function CampaignBuilder(){
  const navigate = useNavigate()
  const [c, setC] = useState({ title:'', discountType:'Percentage', category:'Electronics', imageUrl:'', costPoints:0, startDate:'', endDate:'', description:'', addToOffers:false })
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const onChange = e=>{
    const {name, value, type, checked} = e.target
    setC(p=>({...p, [name]: type==='checkbox'? checked : value}))
  }
  const submit = async e=>{
    e.preventDefault()
    setLoading(true)
    setMsg('')
    try{
      const {data} = await api.post('/admin/campaigns', c)
      setMsg('Saved campaign #'+data.id)
      // If campaign requested to be added to offers, redirect admin to offers list so they can verify
      if (c.addToOffers){
        navigate('/admin/offers')
        return
      }
      // otherwise reset form for a new campaign
      setC({ title:'', discountType:'Percentage', category:'Electronics', imageUrl:'', costPoints:0, startDate:'', endDate:'', description:'', addToOffers:false })
    }catch(err){
      setMsg('Failed to save campaign')
    }finally{
      setLoading(false)
    }
  }
  return (
    <div className="card" style={{maxWidth:720}}>
      <h3>Campaign Builder</h3>
      <form onSubmit={submit} className="grid cols-2"> 
        <div><label>Title</label><input className="input" name="title" value={c.title} onChange={onChange} required/></div>
        <div><label>Discount Type</label><select className="input" name="discountType" value={c.discountType} onChange={onChange}><option>Percentage</option><option>Flat</option></select></div>
        <div><label>Category</label><select className="input" name="category" value={c.category} onChange={onChange}><option>Electronics</option><option>Travel</option><option>Groceries</option><option>Lifestyle</option></select></div>
        <div><label>Image URL (optional)</label><input className="input" name="imageUrl" value={c.imageUrl} onChange={onChange}/></div>
        <div><label>Cost (points)</label><input className="input" type="number" name="costPoints" value={c.costPoints} onChange={onChange}/></div>
        <div><label>Start Date</label><input className="input" type="date" name="startDate" value={c.startDate} onChange={onChange}/></div>
        <div><label>End Date</label><input className="input" type="date" name="endDate" value={c.endDate} onChange={onChange}/></div>
        <div style={{gridColumn:'1/-1'}}><label>Description</label><textarea className="input" name="description" value={c.description} onChange={onChange}/></div>
        <div><label><input type="checkbox" name="addToOffers" checked={c.addToOffers} onChange={onChange}/> Add to Offers page after launch</label></div>
        <div style={{gridColumn:'1/-1'}}>
          <button className="button" disabled={loading}>{loading ? 'Saving...' : 'Create Campaign'}</button>
        </div>
      </form>
      {msg && <div className="badge" style={{marginTop:8}}>{msg}</div>}
    </div>
  )
}
