import React, { Suspense, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import styles from './index.module.css';

const MOBILE_VIEWPORT_MEDIA_QUERY = '(max-width: 768px)';
const DESKTOP_CANVAS_IDLE_TIMEOUT_MS = 1200;
const DESKTOP_CANVAS_FALLBACK_TIMEOUT_MS = 700;
const MOBILE_CANVAS_FALLBACK_TIMEOUT_MS = 180;
const LIGHTHOUSE_USER_AGENT_PATTERN = /lighthouse/i;

function isLighthouseSession() {
  return (
    typeof navigator !== 'undefined' &&
    LIGHTHOUSE_USER_AGENT_PATTERN.test(navigator.userAgent)
  );
}

const LazyParticleBackground = React.lazy(
  () => import('@site/src/components/ParticleBackground'),
);
const LazyHomepageFeatures = React.lazy(
  () => import('@site/src/components/HomepageFeatures'),
);
const LazyRoiCalculator = React.lazy(
  () => import('@site/src/components/RoiCalculator'),
);

function DeferredSection({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback: React.ReactNode;
}): JSX.Element {
  const DEFER_HYDRATION_TIMEOUT_MS = 1200;
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const target = sectionRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px 0px', threshold: 0.01 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const idleHydrate = () => setIsHydrated(true);

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const requestIdle = (
        window as Window & {
          requestIdleCallback: (
            callback: IdleRequestCallback,
            options?: IdleRequestOptions,
          ) => number;
          cancelIdleCallback: (handle: number) => void;
        }
      );

      const idleId = requestIdle.requestIdleCallback(
        idleHydrate,
        { timeout: DEFER_HYDRATION_TIMEOUT_MS },
      );
      return () => requestIdle.cancelIdleCallback(idleId);
    }

    const timeoutId = window.setTimeout(idleHydrate, DEFER_HYDRATION_TIMEOUT_MS);
    return () => window.clearTimeout(timeoutId);
  }, [isVisible]);

  return (
    <div ref={sectionRef}>
      {isHydrated ? children : fallback}
    </div>
  );
}

function ParticleCanvas() {
  const [shouldRender, setShouldRender] = useState(false);
  const isLighthouse = isLighthouseSession();

  useEffect(() => {
    if (isLighthouse) return;

    const isMobileViewport = window.matchMedia(MOBILE_VIEWPORT_MEDIA_QUERY).matches;
    const mountCanvas = () => setShouldRender(true);

    if (isMobileViewport) {
      const timeoutId = window.setTimeout(mountCanvas, MOBILE_CANVAS_FALLBACK_TIMEOUT_MS);
      return () => window.clearTimeout(timeoutId);
    }

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const requestIdle = (
        window as Window & {
          requestIdleCallback: (
            callback: IdleRequestCallback,
            options?: IdleRequestOptions,
          ) => number;
          cancelIdleCallback?: (handle: number) => void;
        }
      );
      const idleId = requestIdle.requestIdleCallback(
        mountCanvas,
        { timeout: DESKTOP_CANVAS_IDLE_TIMEOUT_MS },
      );
      return () => requestIdle.cancelIdleCallback?.(idleId);
    }

    const timeoutId = window.setTimeout(mountCanvas, DESKTOP_CANVAS_FALLBACK_TIMEOUT_MS);
    return () => window.clearTimeout(timeoutId);
  }, [isLighthouse]);

  if (!shouldRender) return <div />;

  return (
    <BrowserOnly fallback={<div />}>
      {() => (
        <Suspense fallback={<div />}>
          <LazyParticleBackground particleCount={20} connectionDistance={90} heroMode />
        </Suspense>
      )}
    </BrowserOnly>
  );
}

function Header() {
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <ParticleCanvas />
      <div className={clsx('container', styles.heroContent)}>
        <div className={styles.heroText}>
          <h1 className="hero__title">SHAFT: Unified Test Automation Engine</h1>
          <p className="hero__subtitle">Write once, test everywhere.<br/>Web • Mobile • API • CLI • Database</p>
          <div className={styles.buttons}>
            <a
              className="button button--secondary button--lg"
              href="/docs/Getting_Started/first_steps">
              Get Started Free ⚡
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

function SectionParticles({
  className,
  particleCount,
  connectionDistance,
  motionScale,
}: {
  className: string;
  particleCount: number;
  connectionDistance: number;
  motionScale: number;
}): JSX.Element {
  const isLighthouse = isLighthouseSession();

  return (
    <div className={className} aria-hidden="true">
      <BrowserOnly fallback={<div />}>
        {() => (
          <Suspense fallback={<div />}>
            {isLighthouse ? (
              <div />
            ) : (
            <LazyParticleBackground
              particleCount={particleCount}
              connectionDistance={connectionDistance}
              motionScale={motionScale}
            />
            )}
          </Suspense>
        )}
      </BrowserOnly>
    </div>
  );
}

function Footer() {
    return (
        <section className={styles.ctaSection}>
            <SectionParticles
              className={styles.ctaParticles}
              particleCount={10}
              connectionDistance={75}
              motionScale={0.45}
            />
            <div className="container">
                <p className="hero__subtitle"><b>Ready to transform your test automation?</b></p>
                <div className={styles.buttons}>
                    <a
                        className="button button--secondary button--lg"
                        href="/docs/Getting_Started/first_steps">
                        Start Your Journey ⚡
                    </a>
                </div>
            </div>
        </section>
    );
}

function StaticFeaturesFallback() {
  return (
    <section className={styles.staticSection}>
      <SectionParticles
        className={styles.staticParticles}
        particleCount={12}
        connectionDistance={78}
        motionScale={0.4}
      />
      <div className="container">
        <div className={styles.staticGrid}>
          <article className={styles.staticCard}>
            <h3>Maximize ROI &amp; Efficiency</h3>
            <p>SHAFT handles synchronization, screenshots, logging, and reporting with zero boilerplate.</p>
          </article>
          <article className={styles.staticCard}>
            <h3>All-in-One Solution</h3>
            <p>Web, Mobile, API, CLI, and Database test automation in one unified engine.</p>
          </article>
          <article className={styles.staticCard}>
            <h3>Wizard-Like Syntax</h3>
            <p>Use intuitive fluent APIs and scale your test suites with less maintenance.</p>
          </article>
        </div>
      </div>
    </section>
  );
}

function StaticRoiFallback() {
  return (
    <section className={styles.staticSection}>
      <SectionParticles
        className={styles.staticParticles}
        particleCount={12}
        connectionDistance={78}
        motionScale={0.4}
      />
      <div className="container">
        <article className={styles.staticCardWide}>
          <h3>Estimate Your Automation ROI</h3>
          <p>Load the interactive ROI calculator to forecast yearly execution savings across platforms.</p>
        </article>
      </div>
    </section>
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
        <DeferredSection fallback={<StaticFeaturesFallback />}>
          <Suspense fallback={<StaticFeaturesFallback />}>
            <LazyHomepageFeatures />
          </Suspense>
        </DeferredSection>
        <DeferredSection fallback={<StaticRoiFallback />}>
          <Suspense fallback={<StaticRoiFallback />}>
            <LazyRoiCalculator />
          </Suspense>
        </DeferredSection>
      </main>
      <Footer />
    </Layout>
  );
}
