import React from 'react';

export type AccessibleTab = {id: string; label: string; panel: React.ReactNode};

type AccessibleTabsProps = {
  id: string;
  label: string;
  tabs: readonly AccessibleTab[];
  className?: string;
  tabListClassName?: string;
  tabClassName?: string;
  panelClassName?: string;
};

export function AccessibleTabs({id, label, tabs, className, tabListClassName, tabClassName, panelClassName}: AccessibleTabsProps): JSX.Element {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const refs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const activate = (index: number, focus = false): void => {
    setActiveIndex(index);
    if (focus) refs.current[index]?.focus();
  };
  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>): void => {
    let nextIndex = activeIndex;
    switch (event.key) {
      case 'ArrowLeft': nextIndex = (activeIndex - 1 + tabs.length) % tabs.length; break;
      case 'ArrowRight': nextIndex = (activeIndex + 1) % tabs.length; break;
      case 'Home': nextIndex = 0; break;
      case 'End': nextIndex = tabs.length - 1; break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        activate(activeIndex, true);
        return;
      default: return;
    }
    event.preventDefault();
    activate(nextIndex, true);
  };

  return <div className={className}>
    <div className={tabListClassName} role="tablist" aria-label={label}>
      {tabs.map((tab, index) => {
        const selected = index === activeIndex;
        return <button
          key={tab.id}
          ref={(element) => { refs.current[index] = element; }}
          id={`${id}-${tab.id}-tab`}
          className={tabClassName}
          type="button"
          role="tab"
          aria-selected={selected}
          aria-controls={`${id}-${tab.id}-panel`}
          tabIndex={selected ? 0 : -1}
          onClick={() => activate(index)}
          onKeyDown={onKeyDown}
        >{tab.label}</button>;
      })}
    </div>
    {tabs.map((tab, index) => <section key={tab.id} id={`${id}-${tab.id}-panel`} className={panelClassName} role="tabpanel" aria-labelledby={`${id}-${tab.id}-tab`} hidden={index !== activeIndex}>{tab.panel}</section>)}
  </div>;
}
