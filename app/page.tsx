"use client";

import {useEffect,useMemo,useState} from "react";

type User={id:number;first_name:string;username?:string};
declare global {interface Window {Telegram?:any}}

const START_COINS=1250;
const MAX_ENERGY=1000;

export default function Home(){
  const [user,setUser]=useState<User|null>(null);
  const [coins,setCoins]=useState(START_COINS);
  const [energy,setEnergy]=useState(MAX_ENERGY);
  const [power,setPower]=useState(1);
  const [tab,setTab]=useState("home");
  const [burst,setBurst]=useState(false);

  useEffect(()=>{
    const tg=window.Telegram?.WebApp;
    tg?.ready?.(); tg?.expand?.();
    if(tg?.initDataUnsafe?.user) setUser(tg.initDataUnsafe.user);
  },[]);

  useEffect(()=>{
    const timer=setInterval(()=>setEnergy(e=>Math.min(MAX_ENERGY,e+3)),1000);
    return()=>clearInterval(timer);
  },[]);

  const level=useMemo(()=>Math.max(1,Math.floor(Math.log2(coins/100+1))+1),[coins]);

  async function tap(){
    if(energy<power)return;
    setEnergy(e=>e-power); setCoins(c=>c+power); setBurst(true);
    setTimeout(()=>setBurst(false),320);
    // Production: POST to a server endpoint that validates Telegram identity,
    // rate limits the action and records the transaction in Supabase.
  }

  function upgrade(){
    const price=500*power;
    if(coins<price)return;
    setCoins(c=>c-price); setPower(p=>p+1);
  }

  return <main className="min-h-screen px-4 pb-24 pt-5">
    <header className="mx-auto flex max-w-md items-center justify-between">
      <div><p className="text-xs text-white/45">WELCOME BACK</p><h1 className="text-xl font-bold">{user?.first_name||"Player"} 🐹</h1></div>
      <div className="glass rounded-2xl px-3 py-2 text-right"><div className="text-xs text-white/40">LEVEL</div><b>{level}</b></div>
    </header>

    {tab==="home" && <section className="mx-auto mt-5 max-w-md">
      <div className="glass rounded-3xl p-5 text-center">
        <p className="text-sm text-white/45">BALANCE</p>
        <div className="mt-1 text-4xl font-black tracking-tight">🪙 {coins.toLocaleString()}</div>
        <div className="mt-5 flex justify-between text-xs text-white/50"><span>Energy</span><span>{energy}/{MAX_ENERGY}</span></div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-emerald-400 transition-all" style={{width:(energy/MAX_ENERGY*100)+"%"}}/></div>

        <button aria-label="Tap to earn" onClick={tap} className={`mx-auto mt-8 flex h-56 w-56 select-none items-center justify-center rounded-full border border-white/15 bg-gradient-to-b from-amber-300 to-orange-500 text-8xl shadow-[0_0_70px_rgba(251,146,60,.2)] active:scale-95 ${burst?"tap-ring":""}`}>🐹</button>
        <p className="mt-4 text-sm text-white/45">Tap +{power} coin</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button onClick={upgrade} className="glass rounded-2xl p-4 text-left"><span className="text-2xl">🚀</span><p className="mt-2 font-bold">Upgrade</p><p className="text-xs text-white/45">Cost {500*power} 🪙</p></button>
        <button onClick={()=>setTab("missions")} className="glass rounded-2xl p-4 text-left"><span className="text-2xl">🎯</span><p className="mt-2 font-bold">Missions</p><p className="text-xs text-white/45">Earn bonus coins</p></button>
      </div>
    </section>}

    {tab==="earn" && <Panel title="Earn"><Card icon="📺" title="Watch Ad" text="Rewarded-ad hook is ready for provider integration." action="Watch"/><Card icon="🎁" title="Daily Reward" text="Claim once per UTC day." action="Claim"/><Card icon="⚡" title="Boost" text="Temporary energy multiplier." action="Boost"/></Panel>}
    {tab==="friends" && <Panel title="Friends"><Card icon="👥" title="Invite friends" text="Your referral link will appear here." action="Invite"/><Card icon="🏆" title="Referral leaderboard" text="Track invited users and rewards." action="Open"/></Panel>}
    {tab==="more" && <Panel title="More"><Card icon="🏆" title="Leaderboard" text="Global ranking foundation." action="Open"/><Card icon="💳" title="Wallet" text="Balance, transactions and withdrawal requests." action="Open"/><Card icon="⚙️" title="Settings" text="Telegram theme-aware settings." action="Open"/></Panel>}
    {tab==="missions" && <Panel title="Missions"><Card icon="👆" title="Make 100 taps" text="Complete the daily tap mission." action="Claim 500"/><Card icon="📺" title="Watch 3 ads" text="Rewarded ads can be connected here." action="Claim 1K"/></Panel>}

    <nav className="fixed bottom-3 left-1/2 z-20 grid w-[calc(100%-24px)] max-w-md -translate-x-1/2 grid-cols-4 gap-1 rounded-2xl glass p-2">
      {[["home","🏠","Home"],["earn","🚀","Earn"],["friends","👥","Friends"],["more","☰","More"]].map(([id,icon,label])=><button key={id} onClick={()=>setTab(id)} className={`rounded-xl px-2 py-2 text-xs ${tab===id?"bg-white/10 text-white":"text-white/45"}`}><div className="text-lg">{icon}</div>{label}</button>)}
    </nav>
  </main>
}

function Panel({title,children}:{title:string;children:React.ReactNode}){return <section className="mx-auto mt-5 max-w-md"><h2 className="mb-4 text-2xl font-bold">{title}</h2><div className="space-y-3">{children}</div></section>}
function Card({icon,title,text,action}:{icon:string;title:string;text:string;action:string}){return <div className="glass flex items-center gap-4 rounded-2xl p-4"><div className="text-3xl">{icon}</div><div className="min-w-0 flex-1"><b>{title}</b><p className="text-xs text-white/45">{text}</p></div><button className="rounded-xl bg-white px-3 py-2 text-xs font-bold text-black">{action}</button></div>}
