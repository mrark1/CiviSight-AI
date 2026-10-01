import React, {useEffect, useMemo, useState} from "react";
import {createRoot} from "react-dom/client";
import {Activity, AlertTriangle, BarChart3, Camera, CheckCircle2, ClipboardList, FileText, Home, LogIn, MapPin, Menu, Shield, Sparkles, Upload, Users, X} from "lucide-react";
import "./styles.css";

const API = `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api`;
const UP = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function Card({children,className=""}){return <div className={"card "+className}>{children}</div>}
function Badge({children}){return <span className={"badge "+String(children).toLowerCase()}>{children}</span>}

function App(){
  const [user,setUser]=useState(JSON.parse(localStorage.getItem("civisight_user")||"null"));
  const [page,setPage]=useState("dashboard");
  const [issues,setIssues]=useState([]);
  const [analytics,setAnalytics]=useState({total:0,resolved:0,critical:0,high:0,resolution_rate:0,categories:{},statuses:{}});
  const [menu,setMenu]=useState(false);

  async function load(){
    try{
      const [a,i]=await Promise.all([fetch(API+"/analytics"),fetch(API+"/issues")]);
      setAnalytics(await a.json()); setIssues(await i.json());
    }catch(e){console.error(e)}
  }
  useEffect(()=>{load()},[]);

  function login(u){setUser(u);localStorage.setItem("civisight_user",JSON.stringify(u));setPage("dashboard")}
  function logout(){setUser(null);localStorage.removeItem("civisight_user")}
  if(!user) return <Login onLogin={login}/>;

  return <div className="app">
    <aside className={menu?"sidebar open":"sidebar"}>
      <div className="brand"><div className="brand-icon"><Shield size={23}/></div><div><b>CiviSight</b><small>AI CIVIC INTELLIGENCE</small></div></div>
      <nav>
        <button className={page==="dashboard"?"active":""} onClick={()=>setPage("dashboard")}><Home/> Dashboard</button>
        <button className={page==="report"?"active":""} onClick={()=>setPage("report")}><Camera/> Report Issue</button>
        <button className={page==="issues"?"active":""} onClick={()=>setPage("issues")}><ClipboardList/> Issues</button>
        <button className={page==="analytics"?"active":""} onClick={()=>setPage("analytics")}><BarChart3/> Analytics</button>
      </nav>
      <div className="sidebar-bottom">
        <div className="user-mini"><div className="avatar">{user.name[0]}</div><div><b>{user.name}</b><small>{user.role}</small></div></div>
        <button className="logout" onClick={logout}><LogIn/> Sign out</button>
      </div>
    </aside>
    <main>
      <header><button className="hamb" onClick={()=>setMenu(!menu)}><Menu/></button><div><span className="eyebrow">CIVIC INFRASTRUCTURE INTELLIGENCE</span><h1>{page==="dashboard"?"Command Center":page==="report"?"Report a Civic Issue":page==="issues"?"Issue Management":"Civic Analytics"}</h1></div><div className="top-user"><span>{user.name}</span><div className="avatar">{user.name[0]}</div></div></header>
      {page==="dashboard" && <Dashboard analytics={analytics} issues={issues} onReport={()=>setPage("report")} onRefresh={load}/>}
      {page==="report" && <Report user={user} onDone={()=>{load();setPage("issues")}}/>}
      {page==="issues" && <Issues issues={issues} user={user} onRefresh={load}/>}
      {page==="analytics" && <Analytics data={analytics}/>}
    </main>
  </div>
}

function Login({onLogin}){
  const [mode,setMode]=useState("login"),[name,setName]=useState(""),[email,setEmail]=useState("citizen@civisight.local"),[password,setPassword]=useState("demo123"),[error,setError]=useState("");
  async function submit(e){
    e.preventDefault();setError("");
    const url=mode==="login"?"/auth/login":"/auth/register";
    const body=mode==="login"?{email,password}:{name,email,password};
    const r=await fetch(API+url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
    const d=await r.json(); if(!r.ok){setError(d.error||"Request failed");return}
    onLogin(d.user);
  }
  return <div className="login-page"><div className="login-grid"></div><div className="login-card">
    <div className="brand centered"><div className="brand-icon"><Shield size={28}/></div><div><b>CiviSight AI</b><small>CIVIC INTELLIGENCE PLATFORM</small></div></div>
    <h2>{mode==="login"?"Welcome back":"Create citizen account"}</h2><p className="muted">{mode==="login"?"Monitor and resolve civic issues with AI-assisted intelligence.":"Join the civic infrastructure reporting network."}</p>
    <form onSubmit={submit}>
      {mode==="register"&&<input placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} required/>}
      <input placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/>
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required/>
      {error&&<div className="error">{error}</div>}
      <button className="primary full">{mode==="login"?"Sign in":"Create account"} <LogIn size={17}/></button>
    </form>
    <button className="link-btn" onClick={()=>setMode(mode==="login"?"register":"login")}>{mode==="login"?"Create a new account":"Already have an account? Sign in"}</button>
    <div className="demo-box"><b>Demo access</b><span>Citizen: citizen@civisight.local / demo123</span><span>Authority: admin@civisight.local / admin123</span></div>
  </div></div>
}

function Dashboard({analytics,issues,onReport,onRefresh}){
 return <div className="content">
   <section className="hero"><div><span className="pill"><Sparkles size={14}/> AI-ASSISTED CIVIC OPERATIONS</span><h2>Turn street-level problems into <em>actionable intelligence.</em></h2><p>Detect, prioritize and resolve civic infrastructure issues using computer vision, location intelligence and workflow automation.</p><button className="primary" onClick={onReport}><Camera size={18}/> Report an issue</button></div><div className="hero-art"><div className="radar"><div></div><span>AI VISION<br/><b>ONLINE</b></span></div></div></section>
   <div className="stats">
     <Stat icon={<ClipboardList/>} label="Total reports" value={analytics.total}/>
     <Stat icon={<AlertTriangle/>} label="Critical issues" value={analytics.critical}/>
     <Stat icon={<Activity/>} label="High priority" value={analytics.high}/>
     <Stat icon={<CheckCircle2/>} label="Resolution rate" value={analytics.resolution_rate+"%"} />
   </div>
   <div className="two-col">
    <Card><div className="card-head"><div><h3>Recent civic reports</h3><p>Latest activity from the reporting network.</p></div><button className="ghost" onClick={onRefresh}>Refresh</button></div>
      <div className="table-wrap"><table><thead><tr><th>Issue</th><th>Priority</th><th>Status</th><th>Reported</th></tr></thead><tbody>
      {issues.slice(0,7).map(i=><tr key={i.id}><td><b>{i.title}</b><small>{i.category}</small></td><td><Badge>{i.severity}</Badge></td><td><Badge>{i.status}</Badge></td><td>{new Date(i.created_at).toLocaleDateString()}</td></tr>)}
      {!issues.length&&<tr><td colSpan="4" className="empty">No reports yet. Create the first one.</td></tr>}
      </tbody></table></div>
    </Card>
    <Card><div className="card-head"><div><h3>Issue distribution</h3><p>Category breakdown</p></div></div>
      <div className="bars">{Object.entries(analytics.categories).slice(0,6).map(([k,v])=><div className="bar-row" key={k}><div><span>{k}</span><b>{v}</b></div><div className="bar"><i style={{width:`${Math.min(100,(v/Math.max(1,analytics.total))*100)}%`}}></i></div></div>)}</div>
      {!Object.keys(analytics.categories).length&&<div className="empty">Analytics will appear after reports are submitted.</div>}
    </Card>
   </div>
 </div>
}
function Stat({icon,label,value}){return <Card className="stat"><div className="stat-icon">{icon}</div><div><small>{label}</small><strong>{value}</strong></div></Card>}

function Report({user,onDone}){
 const [file,setFile]=useState(null),[preview,setPreview]=useState(""),[desc,setDesc]=useState(""),[title,setTitle]=useState(""),[lat,setLat]=useState(""),[lng,setLng]=useState(""),[analysis,setAnalysis]=useState(null),[busy,setBusy]=useState(false),[done,setDone]=useState(false),[error,setError]=useState("");
 function choose(f){setFile(f);if(f)setPreview(URL.createObjectURL(f))}
 function location(){navigator.geolocation?.getCurrentPosition(p=>{setLat(p.coords.latitude.toFixed(6));setLng(p.coords.longitude.toFixed(6))},()=>setError("Location permission was not available."))}
 async function analyze(){
   if(!file)return setError("Please select an image.");
   setBusy(true);setError("");const fd=new FormData();fd.append("image",file);fd.append("description",desc);
   const r=await fetch(API+"/issues/analyze",{method:"POST",body:fd});const d=await r.json();setBusy(false);
   if(!r.ok)return setError(d.error||"AI analysis failed.");setAnalysis(d);
 }
 async function submit(){
   if(!file)return setError("Please select an image.");setBusy(true);setError("");
   const fd=new FormData();fd.append("reporter_id",user.id);fd.append("image",file);fd.append("description",desc);fd.append("title",title||`${analysis?.category||"Civic"} issue`);fd.append("latitude",lat);fd.append("longitude",lng);
   const r=await fetch(API+"/issues",{method:"POST",body:fd});const d=await r.json();setBusy(false);if(!r.ok)return setError(d.error||"Could not submit.");setDone(true);
 }
 if(done)return <div className="content"><Card className="success-card"><CheckCircle2 size={54}/><h2>Issue submitted successfully</h2><p>Your civic report has entered the authority workflow.</p><button className="primary" onClick={onDone}>View issue management</button></Card></div>
 return <div className="content"><div className="report-grid"><Card className="upload-card"><div className="card-head"><div><h3>1. Evidence & location</h3><p>Upload a clear photo of the civic issue.</p></div></div>
   <label className="drop">{preview?<img src={preview}/>:<><Upload size={34}/><b>Drop an image here</b><span>PNG, JPG, JPEG or WEBP · Max 10 MB</span></>}<input type="file" accept="image/*" onChange={e=>choose(e.target.files[0])}/></label>
   <div className="location-row"><input placeholder="Latitude" value={lat} onChange={e=>setLat(e.target.value)}/><input placeholder="Longitude" value={lng} onChange={e=>setLng(e.target.value)}/><button className="ghost" onClick={location}><MapPin size={17}/> GPS</button></div>
   <input placeholder="Short title (optional)" value={title} onChange={e=>setTitle(e.target.value)}/><textarea rows="5" placeholder="Describe what you observed..." value={desc} onChange={e=>setDesc(e.target.value)}/>
   {error&&<div className="error">{error}</div>}
   <button className="secondary full" onClick={analyze} disabled={busy}>{busy?"Analyzing...":"Analyze with CiviSight AI"} <Sparkles size={17}/></button>
 </Card>
 <Card className="analysis-card"><div className="card-head"><div><h3>2. AI intelligence</h3><p>Analysis generated by the local vision baseline.</p></div></div>
 {!analysis?<div className="analysis-empty"><Sparkles size={38}/><b>Waiting for evidence</b><span>Upload an image and run analysis to see detection, confidence and priority.</span></div>:
 <><div className="detected"><div><small>DETECTED CATEGORY</small><h2>{analysis.category}</h2></div><Badge>{analysis.severity}</Badge></div>
 <div className="score"><div><span>Risk score</span><strong>{analysis.score}<small>/100</small></strong></div><div className="score-track"><i style={{width:analysis.score+"%"}}></i></div></div>
 <div className="mini-grid"><div><small>Confidence</small><b>{Math.round(analysis.confidence*100)}%</b></div><div><small>AI engine</small><b>Vision Baseline</b></div></div>
 <div className="complaint"><small>AI-GENERATED COMPLAINT</small><pre>{analysis.complaint}</pre></div>
 <button className="primary full" onClick={submit} disabled={busy}>Submit civic report <FileText size={17}/></button></>}
 </Card></div></div>
}

function Issues({issues,onRefresh}){
 const [filter,setFilter]=useState("All"),[selected,setSelected]=useState(null);
 const shown=issues.filter(i=>filter==="All"||i.status===filter);
 return <div className="content"><Card><div className="card-head"><div><h3>Issue management</h3><p>Track civic reports from submission to resolution.</p></div><div className="filters">{["All","Reported","In Progress","Resolved"].map(x=><button className={filter===x?"filter active":"filter"} onClick={()=>setFilter(x)} key={x}>{x}</button>)}</div></div>
 <div className="issue-grid">{shown.map(i=><div className="issue-card" key={i.id} onClick={()=>setSelected(i)}><div className="issue-img">{i.image_url?<img src={UP+i.image_url}/>:<Camera/>}</div><div className="issue-body"><div className="row"><Badge>{i.severity}</Badge><span>#{i.id}</span></div><h3>{i.title}</h3><p>{i.description||"No description provided."}</p><div className="issue-meta"><span><MapPin size={14}/>{i.latitude&&i.longitude?`${i.latitude}, ${i.longitude}`:"Location unavailable"}</span><Badge>{i.status}</Badge></div></div></div>)}</div>
 {!shown.length&&<div className="empty">No issues in this view.</div>}</Card>
 {selected&&<IssueModal issue={selected} close={()=>setSelected(null)} refresh={()=>{onRefresh();setSelected(null)}}/>}
 </div>
}
function IssueModal({issue,close,refresh}){
 const [status,setStatus]=useState(issue.status),[assigned,setAssigned]=useState(issue.assigned_to||""),[note,setNote]=useState(issue.resolution_note||"");
 async function save(){await fetch(API+"/issues/"+issue.id,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status,assigned_to:assigned,resolution_note:note})});refresh()}
 return <div className="modal-back"><div className="modal"><button className="close" onClick={close}><X/></button><div className="modal-img">{issue.image_url&&<img src={UP+issue.image_url}/>}</div><Badge>{issue.severity}</Badge><h2>{issue.title}</h2><p>{issue.description}</p><div className="form-grid"><label>Status<select value={status} onChange={e=>setStatus(e.target.value)}><option>Reported</option><option>In Progress</option><option>Resolved</option></select></label><label>Assigned team<input value={assigned} onChange={e=>setAssigned(e.target.value)} placeholder="e.g. Road Team 17"/></label></div><label>Resolution note<textarea value={note} onChange={e=>setNote(e.target.value)}/></label><button className="primary full" onClick={save}>Save workflow update</button></div></div>
}

function Analytics({data}){
 const max=Math.max(1,...Object.values(data.categories||{}));
 return <div className="content"><div className="stats"><Stat icon={<ClipboardList/>} label="Total reports" value={data.total}/><Stat icon={<CheckCircle2/>} label="Resolved" value={data.resolved}/><Stat icon={<AlertTriangle/>} label="Critical" value={data.critical}/><Stat icon={<Activity/>} label="Resolution rate" value={data.resolution_rate+"%"}/></div>
 <div className="two-col"><Card><div className="card-head"><div><h3>Category analytics</h3><p>Distribution of detected civic issues.</p></div></div><div className="bars">{Object.entries(data.categories||{}).map(([k,v])=><div className="bar-row" key={k}><div><span>{k}</span><b>{v}</b></div><div className="bar"><i style={{width:(v/max)*100+"%"}}></i></div></div>)}</div></Card>
 <Card><div className="card-head"><div><h3>Operational status</h3><p>Current workflow state.</p></div></div><div className="status-list">{Object.entries(data.statuses||{}).map(([k,v])=><div key={k}><span>{k}</span><strong>{v}</strong></div>)}</div><div className="research-note"><Sparkles size={19}/><div><b>Research extension</b><p>Train a labeled YOLO model and compare precision, recall and mAP against this baseline.</p></div></div></Card></div></div>
}

createRoot(document.getElementById("root")).render(<App/>);
