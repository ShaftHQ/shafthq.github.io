"use strict";(self.webpackChunkshaft_user_guide=self.webpackChunkshaft_user_guide||[]).push([[1340],{207:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>l,default:()=>u,frontMatter:()=>a,metadata:()=>r,toc:()=>c});const r=JSON.parse('{"id":"Demos/web","title":"Demo Projects For Web GUI","description":"Parallel Execution using ThreadLocal Driver","source":"@site/docs/Demos/web.md","sourceDirName":"Demos","slug":"/Demos/web","permalink":"/docs/Demos/web","draft":false,"unlisted":false,"editUrl":"https://github.com/ShaftHQ/shafthq.github.io/blob/master/docs/Demos/web.md","tags":[],"version":"current","frontMatter":{"id":"web","title":"Demo Projects For Web GUI","sidebar_label":"Web"},"sidebar":"docs","previous":{"title":"List","permalink":"/docs/Properties/PropertiesList"},"next":{"title":"Mobile","permalink":"/docs/Demos/mobile"}}');var o=n(4848),i=n(8453);const a={id:"web",title:"Demo Projects For Web GUI",sidebar_label:"Web"},l=void 0,s={},c=[{value:"Parallel Execution using ThreadLocal Driver",id:"parallel-execution-using-threadlocal-driver",level:3},{value:"ParallelExecution_Demo",id:"parallelexecution_demo",level:3}];function d(e){const t={a:"a",admonition:"admonition",code:"code",h3:"h3",p:"p",pre:"pre",...(0,i.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(t.h3,{id:"parallel-execution-using-threadlocal-driver",children:"Parallel Execution using ThreadLocal Driver"}),"\n",(0,o.jsx)(t.pre,{children:(0,o.jsx)(t.code,{className:"language-java",metastring:'title="ParallelThreadLocalSampleTest"',children:'public class ParallelThreadLocalTest {\n    private ThreadLocal<SHAFT.GUI.WebDriver> driver = new ThreadLocal<>();\n    private SHAFT.TestData.JSON testData;\n\n    @Test\n    public void signOutTest() {\n        new HomePage(driver.get())\n                .signOut();\n    }\n\n    @Test\n    public void buttonClickTest() {\n        new HomePage(driver.get())\n                .clickMe();\n    }\n\n    @BeforeMethod\n    public void beforeMethodSetUp() {\n        driver.set(new SHAFT.GUI.WebDriver());\n        driver.get().browser().navigateToURL("url");\n    }\n\n    @AfterMethod\n    public void afterMethodTearDown() {\n        driver.get().quit();\n    }\n}\n'})}),"\n",(0,o.jsxs)(t.admonition,{type:"info",children:[(0,o.jsx)(t.p,{children:"You can visit this Repository to for a Demo on how to set Parallel Execution in SHAFT_ENGINE"}),(0,o.jsx)(t.h3,{id:"parallelexecution_demo",children:(0,o.jsx)(t.a,{href:"https://github.com/MustafaAgamy/ShaftEngine-ParellelWithThreadLocal.git",children:"ParallelExecution_Demo"})})]})]})}function u(e={}){const{wrapper:t}={...(0,i.R)(),...e.components};return t?(0,o.jsx)(t,{...e,children:(0,o.jsx)(d,{...e})}):d(e)}},8453:(e,t,n)=>{n.d(t,{R:()=>a,x:()=>l});var r=n(6540);const o={},i=r.createContext(o);function a(e){const t=r.useContext(i);return r.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function l(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:a(e.components),r.createElement(i.Provider,{value:t},e.children)}}}]);