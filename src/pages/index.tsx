import React from 'react';
import {useEffect, useMemo, useRef, useState} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import {Canvas, useFrame} from '@react-three/fiber';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import type {Group} from 'three';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import RoiCalculator from '@site/src/components/RoiCalculator';
import styles from './index.module.css';

const NODE_LAYER_SIZE = 5;
const LAYER_SPACING = 1.2;
const LAYER_START_OFFSET = 1.8;
const NODE_VERTICAL_SPACING = 0.75;
const NODE_WAVE_FREQUENCY = 1.3;
const NODE_WAVE_AMPLITUDE = 1.1;

function resolveSceneColors() {
  const defaultColors = {
    node: '#25c2a0',
    nodeGlow: '#0a3b36',
    ring: '#8dece1',
    lightA: '#aef5e9',
    lightB: '#72a6ff',
  };

  if (typeof window === 'undefined') {
    return defaultColors;
  }

  const rootStyles = getComputedStyle(document.documentElement);
  const primary = rootStyles.getPropertyValue('--ifm-color-primary').trim();
  const primaryDark = rootStyles.getPropertyValue('--ifm-color-primary-dark').trim();
  const primaryLight = rootStyles.getPropertyValue('--ifm-color-primary-light').trim();

  return {
    ...defaultColors,
    node: primary || defaultColors.node,
    nodeGlow: primaryDark || primary || defaultColors.nodeGlow,
    ring: primaryLight || primary || defaultColors.ring,
  };
}

function Header() {
  const {siteConfig} = useDocusaurusContext();
  const networkRef = useRef<Group | null>(null);
  const [enable3D, setEnable3D] = useState(true);
  const [sceneColors, setSceneColors] = useState(resolveSceneColors);
  const siteUrl = useMemo(() => (siteConfig.url ? siteConfig.url.replace(/\/$/, '') : ''), [siteConfig.url]);
  const logoUrl = useMemo(() => `${siteUrl}/img/shaft.svg`, [siteUrl]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isLowTierDevice = (navigator.hardwareConcurrency || 8) <= 4;
    setEnable3D(!mediaQuery.matches && !isLowTierDevice);
    setSceneColors(resolveSceneColors());
  }, []);

  useEffect(() => {
    if (!enable3D || !networkRef.current || typeof window === 'undefined') {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.to(networkRef.current!.rotation, {
        y: Math.PI * 2,
        x: Math.PI / 1.5,
        ease: 'none',
        scrollTrigger: {
          trigger: '#ai-landing',
          start: 'top top',
          end: 'bottom+=120% top',
          scrub: true,
        },
      });
    });

    return () => {
      ctx.revert();
    };
  }, [enable3D]);

  const jsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          name: 'ShaftHQ',
          url: siteUrl,
          logo: logoUrl,
          sameAs: ['https://github.com/ShaftHQ'],
        },
        {
          '@type': 'SoftwareApplication',
          name: 'SHAFT Engine',
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'Windows, macOS, Linux',
          description:
            'AI-ready unified test automation engine for Web, Mobile, API, CLI, and Database testing.',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
          creator: {
            '@type': 'Organization',
            name: 'ShaftHQ',
          },
        },
      ],
    }),
    [logoUrl, siteUrl]
  );

  const nodes = useMemo(
    () =>
      [...Array(20)].map((_, index) => {
        const layer = Math.floor(index / NODE_LAYER_SIZE);
        const offset = (index % NODE_LAYER_SIZE) - 2;
        return [
          layer * LAYER_SPACING - LAYER_START_OFFSET,
          offset * NODE_VERTICAL_SPACING,
          Math.sin(index * NODE_WAVE_FREQUENCY) * NODE_WAVE_AMPLITUDE,
        ] as const;
      }),
    []
  );

  function NeuralNetwork() {
    useFrame((state) => {
      if (networkRef.current) {
        networkRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.35) * 0.08;
      }
    });

    return (
      <group ref={networkRef}>
        {nodes.map((node, index) => (
          <mesh key={index} position={node}>
            <sphereGeometry args={[0.08, 24, 24]} />
            <meshStandardMaterial color={sceneColors.node} metalness={0.25} roughness={0.15} emissive={sceneColors.nodeGlow} />
          </mesh>
        ))}
        <mesh>
          <torusGeometry args={[2.25, 0.02, 16, 100]} />
          <meshStandardMaterial color={sceneColors.ring} metalness={0.35} roughness={0.4} transparent opacity={0.45} />
        </mesh>
      </group>
    );
  }

  return (
    <>
      <Head>
        <meta name="description" content="Explore SHAFT Engine through an interactive AI-themed landing experience for modern test automation teams." />
        <meta property="og:title" content="SHAFT Engine | 3D AI Test Automation Experience" />
        <meta property="og:description" content="Scroll through a modern AI-themed overview of SHAFT Engine and accelerate Web, Mobile, API, CLI, and Database testing." />
        <meta property="og:image" content={logoUrl} />
        <meta name="twitter:title" content="SHAFT Engine | 3D AI Test Automation Experience" />
        <meta name="twitter:description" content="Discover a scroll-driven AI-themed landing page introducing SHAFT's unified automation capabilities." />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Head>
      <header id="ai-landing" className={clsx('hero hero--primary', styles.heroBanner, styles.aiHero)}>
        {enable3D ? (
          <div className={styles.canvasLayer} aria-hidden="true">
            <Canvas camera={{position: [0, 0, 6], fov: 45}} dpr={[1, 1.5]}>
              <ambientLight intensity={0.65} />
              <pointLight position={[4, 4, 2]} intensity={1.25} color={sceneColors.lightA} />
              <pointLight position={[-3, -2, 3]} intensity={0.9} color={sceneColors.lightB} />
              <NeuralNetwork />
            </Canvas>
          </div>
        ) : (
          <div className={styles.fallbackBackground} aria-hidden="true" />
        )}
        <div className={clsx('container', styles.heroContent)}>
          <h1 className="hero__title">SHAFT: Unified Test Automation Engine</h1>
          <p className="hero__subtitle">Write once, test everywhere.<br/>Web • Mobile • API • CLI • Database</p>
          <p className={styles.heroNarrative}>
            Scroll into a modern AI-inspired experience that visualizes intelligent pipelines, connected systems, and resilient test coverage at scale.
          </p>
          <div className={styles.buttons}>
            <Link
              className="button button--secondary button--lg"
              to="/docs/Getting_Started/first_steps">
              Get Started Free ⚡
            </Link>
          </div>
        </div>
        <article className={styles.semanticFallback}>
          <h2>AI-powered automation for real-world delivery pipelines</h2>
          <p>SHAFT combines Web, Mobile, API, CLI, and Database testing into one composable engine.</p>
          <p>Use semantic documentation, reusable patterns, and rich reporting to accelerate quality at scale.</p>
        </article>
      </header>
    </>
  );
}

function Footer() {
    return (
        <div>
            <center>
                <header>
                    <div className="container">
                        <br/>
                        <p className="hero__subtitle"><b>Ready to transform your test automation?</b></p>
                        <div className={styles.buttons}>
                            <Link
                                className="button button--secondary button--lg"
                                to="/docs/Getting_Started/first_steps">
                                Start Your Journey ⚡
                            </Link>
                        </div>
                        <br/><br/>
                    </div>
                </header>
            </center>
        </div>
    );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.organizationName}`}
      description="Transform your test automation with SHAFT - the award-winning, all-in-one automation engine for Web, Mobile, API, CLI, and Database testing. Zero boilerplate, maximum productivity.">
      <Header />
      <main>
        <HomepageFeatures />
          <RoiCalculator/>
      </main>
        <Footer />
    </Layout>
  );
}
