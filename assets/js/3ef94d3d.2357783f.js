"use strict";(self.webpackChunkshaft_user_guide=self.webpackChunkshaft_user_guide||[]).push([[2323],{1541:(e,o,t)=>{t.r(o),t.d(o,{assets:()=>s,contentTitle:()=>n,default:()=>h,frontMatter:()=>r,metadata:()=>i,toc:()=>c});var a=t(5893),d=t(1151);const r={id:"Shadow_Dom_Locator_Builder",title:"Shadow Dom Locator Builder",sidebar_label:"Shadow Dom Locator Builder"},n=void 0,i={id:"Keywords/GUI/didYouKnow/Shadow_Dom_Locator_Builder",title:"Shadow Dom Locator Builder",description:"an advanced application and advantage of SHAFT Locator Builder  is locating elements inside shadow dom.",source:"@site/docs/Keywords/GUI/didYouKnow/Shadow_Dom_Locator_Builder.md",sourceDirName:"Keywords/GUI/didYouKnow",slug:"/Keywords/GUI/didYouKnow/Shadow_Dom_Locator_Builder",permalink:"/docs/Keywords/GUI/didYouKnow/Shadow_Dom_Locator_Builder",draft:!1,unlisted:!1,editUrl:"https://github.com/ShaftHQ/shafthq.github.io/blob/master/docs/Keywords/GUI/didYouKnow/Shadow_Dom_Locator_Builder.md",tags:[],version:"current",frontMatter:{id:"Shadow_Dom_Locator_Builder",title:"Shadow Dom Locator Builder",sidebar_label:"Shadow Dom Locator Builder"},sidebar:"docs",previous:{title:"Shaft Locator Builder",permalink:"/docs/Keywords/GUI/didYouKnow/Shaft_Locator_Builder"},next:{title:"Integrate JIRA With SHAFT-Engine",permalink:"/docs/Keywords/GUI/didYouKnow/Integrate_JIRA_With_SHAFT_Engine"}},s={},c=[{value:"Example",id:"example",level:4}];function l(e){const o={a:"a",code:"code",h4:"h4",img:"img",p:"p",pre:"pre",...(0,d.a)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsxs)(o.p,{children:["an advanced application and advantage of ",(0,a.jsx)(o.a,{href:"/docs/Keywords/GUI/didYouKnow/Shaft_Locator_Builder",children:"SHAFT Locator Builder "})," is locating elements inside shadow dom."]}),"\n",(0,a.jsx)(o.h4,{id:"example",children:"Example"}),"\n",(0,a.jsx)(o.p,{children:(0,a.jsx)(o.img,{src:"https://github.com/ShaftHQ/shafthq.github.io/assets/65794900/1d1fb006-0c35-4613-b0a6-b42a391b5bc4",alt:"Screenshot 2023-05-23 235203"})}),"\n",(0,a.jsx)(o.p,{children:'to locate the element with tagName "a" inside the nested shadow root you can follow the below code :'}),"\n",(0,a.jsx)(o.pre,{children:(0,a.jsx)(o.code,{className:"language-java",children:' public void shadowDomLocatorTest() {\n driver = new SHAFT.GUI.WebDriver();\n By shadowHost = SHAFT.GUI.Locator.hasTagName("shop-app").build();\n By shadowElement = SHAFT.GUI.Locator.hasTagName("a")\n                                     .hasAttribute("href", "/list/mens_outerwear")\n                                     .insideShadowDom(shadowHost)\n\t\t\t\t     .build();    \ndriver.browser().navigateToURL("https://shop.polymer-project.org/");        \ndriver.element().click(shadowElement);\n}\t\t    \n'})}),"\n",(0,a.jsxs)(o.p,{children:["for more examples visit ",(0,a.jsx)(o.a,{href:"https://github.com/ShaftHQ/SHAFT_ENGINE/blob/main/src/test/java/testPackage/locator/ShadowDomTest.java",children:"ShadowDomTest"})," on Github."]})]})}function h(e={}){const{wrapper:o}={...(0,d.a)(),...e.components};return o?(0,a.jsx)(o,{...e,children:(0,a.jsx)(l,{...e})}):l(e)}},1151:(e,o,t)=>{t.d(o,{Z:()=>i,a:()=>n});var a=t(7294);const d={},r=a.createContext(d);function n(e){const o=a.useContext(r);return a.useMemo((function(){return"function"==typeof e?e(o):{...o,...e}}),[o,e])}function i(e){let o;return o=e.disableParentContext?"function"==typeof e.components?e.components(d):e.components||d:n(e.components),a.createElement(r.Provider,{value:o},e.children)}}}]);