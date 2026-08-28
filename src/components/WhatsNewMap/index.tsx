import Link from '@docusaurus/Link';
import {useMemo, useState} from 'react';
import catalog from '@site/src/data/whats-new-catalog.json';
import styles from './styles.module.css';

const goals = [['all','All'],['set-up','Set up'],['record','Record'],['agentic','Use agents'],['evidence','Investigate'],['web','Test web'],['mobile','Test mobile'],['api','Test APIs'],['audit','Audit'],['validate','Validate']] as const;

export default function WhatsNewMap(): JSX.Element {
  const [query,setQuery]=useState('');
  const [goal,setGoal]=useState('all');
  const normalized=query.trim().toLowerCase();
  const features=useMemo(()=>catalog.features.filter((feature)=>{
    const text=`${feature.title} ${feature.what} ${feature.why} ${feature.configure} ${feature.use}`.toLowerCase();
    return (goal==='all'||feature.goals.includes(goal))&&(!normalized||text.includes(normalized));
  }),[goal,normalized]);
  const reset=()=>{setQuery('');setGoal('all');};

  return <section className={styles.atlas} aria-labelledby="capability-atlas-title">
    <div className={styles.heading}><div><p className={styles.eyebrow}>Capability atlas</p><h2 id="capability-atlas-title">Find the feature for your goal</h2></div><p className={styles.count} aria-live="polite">{features.length} {features.length===1?'feature':'features'}</p></div>
    <label className={styles.searchLabel} htmlFor="whats-new-search">Search capabilities</label>
    <input id="whats-new-search" className={styles.search} type="search" value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="Try recording, GraphQL, traces, or mobile" />
    <div className={styles.filters} role="group" aria-label="Filter by goal">{goals.map(([value,label])=><button key={value} type="button" className={goal===value?styles.activeFilter:styles.filter} aria-pressed={goal===value} onClick={()=>setGoal(value)}>{label}</button>)}</div>
    {features.length?catalog.groups.map((group)=>{const matches=features.filter((feature)=>feature.group===group.id);return matches.length?<section className={styles.group} key={group.id} aria-labelledby={`atlas-${group.id}`}><div className={styles.groupHeading}><div><h3 id={`atlas-${group.id}`}>{group.label}</h3><p>{group.description}</p></div><Link to={`/docs/features/whats-new/${group.id}`}>View group</Link></div><ul className={styles.cards}>{matches.map((feature)=><li key={feature.id}><Link className={styles.card} to={`/docs/features/whats-new/${feature.group}#${feature.id}`}><strong>{feature.title}</strong><span>{feature.what}</span><small>Configure and use</small></Link></li>)}</ul></section>:null;}):<div className={styles.empty}><strong>No matching capabilities</strong><span>Clear the search or choose another goal.</span><button type="button" onClick={reset}>Reset filters</button></div>}
  </section>;
}
