import React from 'react';
import { BarChart3, Users, Store, ClipboardCheck, CreditCard, Package, ShoppingCart, MessageSquare, Bell, Tags, Star, Flag, Settings, ChevronRight, ArrowLeft } from 'lucide-react';

const sections=[
 ['overview','Overview',BarChart3,'Marketplace performance and pending work'],
 ['users','Users',Users,'Manage registered buyers and accounts'],
 ['sellers','Sellers',Store,'Manage seller accounts and status'],
 ['applications','Applications',ClipboardCheck,'Review and approve seller applications'],
 ['payments','Payments',CreditCard,'Verify UGX 15,000 seller payments'],
 ['listings','Listings',Package,'Review, approve and manage listings'],
 ['orders','Orders',ShoppingCart,'Monitor marketplace orders'],
 ['messages','Messages & reports',MessageSquare,'Review reports and marketplace issues'],
 ['notifications','Notifications',Bell,'Manage platform notifications'],
 ['categories','Categories',Tags,'Manage marketplace categories'],
 ['reviews','Reviews',Star,'Review marketplace feedback'],
 ['reports','Reports',Flag,'Investigate reported users and listings'],
 ['settings','Platform settings',Settings,'Configure marketplace settings']
];

export default function AdminDashboard({go,stats={}}){
 const [active,setActive]=React.useState('overview');
 const current=sections.find(x=>x[0]===active)||sections[0];
 const Icon=current[2];
 return <section className="adminPage">
  <div className="adminHero"><div><span>FARMMARKET UGANDA · CONTROL CENTRE</span><h1>Super Admin</h1><p>Everything you need to run the marketplace.</p></div><button onClick={()=>go('dashboard')}><ArrowLeft/> My account</button></div>
  <div className="adminStats"><Stat n={stats.users??'—'} t="Users"/><Stat n={stats.sellers??'—'} t="Sellers"/><Stat n={stats.listings??'—'} t="Listings"/><Stat n={stats.orders??'—'} t="Orders"/><Stat n={stats.pending??'—'} t="Pending"/><Stat n={stats.revenue??'UGX —'} t="Revenue"/></div>
  <div className="adminShell">
   <aside className="adminSidebar">{sections.map(([id,title,I])=><button className={active===id?'selected':''} key={id} onClick={()=>setActive(id)}><I/><span>{title}</span><ChevronRight/></button>)}</aside>
   <div className="adminMain">
    <div className="adminSectionHead"><div><Icon/><span>ADMINISTRATION</span><h2>{current[1]}</h2><p>{current[3]}</p></div>{active==='overview'?null:<button className="adminBack" onClick={()=>setActive('overview')}>← Overview</button>}</div>
    {active==='overview'?<Overview stats={stats} choose={setActive}/>:<Management id={active} title={current[1]}/>} 
   </div>
  </div>
  <nav className="adminMobileNav">{sections.slice(0,5).map(([id,title,I])=><button className={active===id?'active':''} key={id} onClick={()=>setActive(id)}><I/><small>{title}</small></button>)}</nav>
 </section>
}
function Stat({n,t}){return <div className="adminStat"><b>{n}</b><span>{t}</span></div>}
function Overview({stats,choose}){return <><div className="adminQuick"><Quick title="Seller applications" value={stats.pending??'—'} text="Waiting for review" id="applications" choose={choose}/><Quick title="Payment verification" value={stats.payments??'—'} text="Payments to check" id="payments" choose={choose}/><Quick title="Listings" value={stats.listings??'—'} text="Listings in marketplace" id="listings" choose={choose}/><Quick title="Reports" value={stats.reports??'—'} text="Issues requiring attention" id="reports" choose={choose}/></div><div className="adminActivity"><h3>Administration centre</h3><p>Use the menu to manage every major part of Farm Market Uganda. Actions are kept inside the protected admin workspace.</p><div className="adminFeatureGrid">{sections.slice(1).map(([id,title,I,text])=><button key={id} onClick={()=>choose(id)}><I/><div><b>{title}</b><span>{text}</span></div><ChevronRight/></button>)}</div></div></>}
function Quick({title,value,text,id,choose}){return <button className="adminQuickCard" onClick={()=>choose(id)}><span>{title}</span><strong>{value}</strong><small>{text}</small><ChevronRight/></button>}
function Management({id,title}){return <div className="adminManagement"><div className="adminEmptyIcon">{sections.find(x=>x[0]===id)?.[2] && React.createElement(sections.find(x=>x[0]===id)[2])}</div><h3>{title}</h3><p>This management workspace is ready for its Supabase data and actions. Use the sections on the left to move between admin areas.</p><div className="adminPlaceholder"><b>Connected to Farm Market administration</b><span>Search, filters, records, approvals and actions will appear here without leaving the Super Admin workspace.</span></div></div>}
