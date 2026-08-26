import React,{useEffect,useMemo,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {createClient} from '@supabase/supabase-js';
import {Search,MapPin,Plus,MessageCircle,UserCircle,Heart,ShoppingBag,Menu,X,Leaf,ChevronRight,LogIn,LogOut} from 'lucide-react';
import './styles.css';

const SUPABASE_URL=import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY=import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase=SUPABASE_URL&&SUPABASE_KEY?createClient(SUPABASE_URL,SUPABASE_KEY):null;

const demo=[
 {id:1,title:'Fresh Matooke',price:35000,unit:'bunch',location:'Wakiso',category:'Produce',emoji:'🍌',seller:'Kato Farm'},
 {id:2,title:'Free-range Eggs',price:12000,unit:'tray',location:'Mukono',category:'Livestock',emoji:'🥚',seller:'Green Valley Farm'},
 {id:3,title:'Fresh Tomatoes',price:8000,unit:'kg',location:'Mbarara',category:'Produce',emoji:'🍅',seller:'Ankole Growers'},
 {id:4,title:'Local Chicken',price:28000,unit:'bird',location:'Luweero',category:'Livestock',emoji:'🐔',seller:'Nile Farm'},
 {id:5,title:'Sweet Potatoes',price:18000,unit:'sack',location:'Masaka',category:'Produce',emoji:'🍠',seller:'Masaka Farmers'},
 {id:6,title:'Fresh Milk',price:3000,unit:'litre',location:'Jinja',category:'Dairy',emoji:'🥛',seller:'Jinja Dairy'}
];
function money(n){return new Intl.NumberFormat('en-UG',{style:'currency',currency:'UGX',maximumFractionDigits:0}).format(n)}
function App(){
 const [session,setSession]=useState(null),[search,setSearch]=useState(''),[category,setCategory]=useState('All'),[menu,setMenu]=useState(false),[saved,setSaved]=useState([]),[items,setItems]=useState(demo),[loading,setLoading]=useState(false);
 useEffect(()=>{if(!supabase)return;supabase.auth.getSession().then(({data})=>setSession(data.session));const {data}=supabase.auth.onAuthStateChange((_e,s)=>setSession(s));return()=>data.subscription.unsubscribe()},[]);
 const filtered=useMemo(()=>items.filter(x=>(category==='All'||x.category===category)&&(`${x.title} ${x.location} ${x.seller}`.toLowerCase().includes(search.toLowerCase()))),[items,category,search]);
 async function signIn(){if(!supabase){alert('Supabase is not connected yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel.');return}const email=prompt('Enter your email');if(!email)return;setLoading(true);const {error}=await supabase.auth.signInWithOtp({email});setLoading(false);alert(error?error.message:'Check your email for the sign-in link.')}
 return <div className="app">
  <header><div className="nav wrap"><button className="icon mobile" onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button><a className="brand" href="#"><span className="logo"><Leaf size={22}/></span><span>Farm<span>Market</span> Uganda</span></a><nav className={menu?'open':''}><a href="#market">Market</a><a href="#how">How it works</a><a href="#about">About</a></nav><div className="actions"><button className="sell" onClick={()=>alert(session?'Listing form will open here.':'Sign in first to sell your farm products.')}><Plus size={17}/> Sell produce</button><button className="icon" onClick={signIn}>{session?<UserCircle/>:<LogIn/>}</button></div></div></header>
  <main>
   <section className="hero"><div className="wrap heroGrid"><div><div className="eyebrow"><Leaf size={15}/> Uganda's farm-to-market platform</div><h1>Buy fresh.<br/><em>Sell smarter.</em></h1><p>Connect farmers, buyers and fresh produce across Uganda in one simple marketplace.</p><div className="search"><Search size={20}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search produce, livestock, location..."/><button>Search</button></div><div className="quick"><span>Popular:</span>{['Matooke','Chicken','Tomatoes','Milk'].map(x=><button key={x} onClick={()=>setSearch(x)}>{x}</button>)}</div></div><div className="heroCard"><div className="farmArt">🌾</div><div><strong>Fresh from Ugandan farms</strong><span>Trusted local sellers • Fair prices • Nearby produce</span></div></div></div></section>
   <section id="market" className="market wrap"><div className="sectionHead"><div><span className="eyebrow">Marketplace</span><h2>What are you looking for?</h2></div><button className="outline">View all <ChevronRight size={17}/></button></div><div className="chips">{['All','Produce','Livestock','Dairy'].map(c=><button className={category===c?'active':''} onClick={()=>setCategory(c)} key={c}>{c}</button>)}</div><div className="grid">{filtered.map(x=><article className="card" key={x.id}><button className="heart" onClick={()=>setSaved(s=>s.includes(x.id)?s.filter(i=>i!==x.id):[...s,x.id])}><Heart fill={saved.includes(x.id)?'currentColor':'none'} size={18}/></button><div className="photo">{x.emoji}</div><div className="cardBody"><span className="tag">{x.category}</span><h3>{x.title}</h3><div className="price">{money(x.price)} <small>/ {x.unit}</small></div><div className="meta"><MapPin size={14}/>{x.location}<span>•</span>{x.seller}</div><button className="contact"><MessageCircle size={16}/> Contact seller</button></div></article>)}</div>{filtered.length===0&&<div className="empty">No listings match your search.</div>}</section>
   <section id="how" className="how"><div className="wrap"><div className="sectionHead"><div><span className="eyebrow">Simple by design</span><h2>Everything you need to trade farm products</h2></div></div><div className="steps"><div><b>01</b><ShoppingBag/><h3>Find what you need</h3><p>Search produce and livestock by product, category and location.</p></div><div><b>02</b><MessageCircle/><h3>Talk directly</h3><p>Connect with sellers and agree on price, quantity and delivery.</p></div><div><b>03</b><Leaf/><h3>Trade locally</h3><p>Buy fresh and help Ugandan farmers reach more customers.</p></div></div></div></section>
   <section id="about" className="cta"><div className="wrap ctaInner"><div><span className="eyebrow">For farmers</span><h2>Put your harvest in front of more buyers.</h2><p>Create your seller profile and start listing what your farm has today.</p></div><button className="sell big" onClick={signIn}>{session?'Start a listing':'Create seller account'} <ChevronRight/></button></div></section>
  </main>
  <footer><div className="wrap foot"><div className="brand"><span className="logo"><Leaf size={19}/></span>FarmMarket Uganda</div><span>Built for Uganda's farmers and buyers.</span><span>© 2026 FarmMarket Uganda</span></div></footer>
 </div>
}
createRoot(document.getElementById('root')).render(<App/>);
