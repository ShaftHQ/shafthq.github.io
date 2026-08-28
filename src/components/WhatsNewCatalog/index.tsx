import Link from '@docusaurus/Link';
import useBrokenLinks from '@docusaurus/useBrokenLinks';
import catalog from '@site/src/data/whats-new-catalog.json';
import styles from './styles.module.css';

export default function WhatsNewCatalog({group}:{group:string}):JSX.Element{
  const current=catalog.groups.find((item)=>item.id===group);
  const features=catalog.features.filter((feature)=>feature.group===group);
  const brokenLinks=useBrokenLinks();
  features.forEach((feature)=>brokenLinks.collectAnchor(feature.id));
  if(!current)return <p>Unknown capability group.</p>;
  return <div className={styles.layout}><nav className={styles.groupNav} aria-label="What's new groups">{catalog.groups.map((item)=><Link key={item.id} className={item.id===group?styles.current:undefined} aria-current={item.id===group?'page':undefined} to={`/docs/features/whats-new/${item.id}`}>{item.label}</Link>)}</nav><div className={styles.rail}>{features.map((feature,index)=><section className={styles.entry} id={feature.id} key={feature.id}><span className={styles.marker} aria-hidden="true">{String(index+1).padStart(2,'0')}</span><div className={styles.body}><h2>{feature.title}</h2><dl><div><dt>What it does</dt><dd>{feature.what}</dd></div><div><dt>Why use it</dt><dd>{feature.why}</dd></div><div><dt>Configure</dt><dd>{feature.configure}</dd></div><div><dt>Use it</dt><dd>{feature.use}</dd></div></dl><Link className={styles.guide} to={feature.guide}>Open full guide</Link></div></section>)}</div></div>;
}
