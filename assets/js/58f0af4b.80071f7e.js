"use strict";(self.webpackChunkshaft_user_guide=self.webpackChunkshaft_user_guide||[]).push([[6277],{8932:(e,i,n)=>{n.r(i),n.d(i,{assets:()=>c,contentTitle:()=>a,default:()=>u,frontMatter:()=>s,metadata:()=>o,toc:()=>l});const o=JSON.parse('{"id":"Basic_Config/basicConfig2","title":"Basic configuration for Mobile GUI","description":"- Given that you already have an Appium server up and running, and some real or virtual mobile devices connected and configured, you can start configuring SHAFT to execute your tests against these devices.","source":"@site/docs/Basic_Config/basicConfig2.md","sourceDirName":"Basic_Config","slug":"/Basic_Config/basicConfig2","permalink":"/docs/Basic_Config/basicConfig2","draft":false,"unlisted":false,"editUrl":"https://github.com/ShaftHQ/shafthq.github.io/blob/master/docs/Basic_Config/basicConfig2.md","tags":[],"version":"current","frontMatter":{"id":"basicConfig2","title":"Basic configuration for Mobile GUI","sidebar_label":"Mobile GUI"},"sidebar":"docs","previous":{"title":"Web GUI","permalink":"/docs/Basic_Config/basicConfig"},"next":{"title":"API","permalink":"/docs/Basic_Config/basicConfig3"}}');var t=n(4848),r=n(8453);const s={id:"basicConfig2",title:"Basic configuration for Mobile GUI",sidebar_label:"Mobile GUI"},a=void 0,c={},l=[];function d(e){const i={a:"a",admonition:"admonition",code:"code",li:"li",mdxAdmonitionTitle:"mdxAdmonitionTitle",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,r.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)(i.ul,{children:["\n",(0,t.jsx)(i.li,{children:"Given that you already have an Appium server up and running, and some real or virtual mobile devices connected and configured, you can start configuring SHAFT to execute your tests against these devices."}),"\n"]}),"\n",(0,t.jsxs)(i.admonition,{type:"tip",children:[(0,t.jsx)(i.mdxAdmonitionTitle,{children:(0,t.jsx)(i.strong,{children:"Tip"})}),(0,t.jsxs)(i.ul,{children:["\n",(0,t.jsxs)(i.li,{children:["You can refer to the official ",(0,t.jsx)(i.strong,{children:(0,t.jsx)(i.a,{href:"https://appium.io/docs/en/latest/",children:"appium user guide"})})," to set up your appium server and configure any needed prerequisites."]}),"\n",(0,t.jsxs)(i.li,{children:["You can also consider using cloud device farms like ",(0,t.jsx)(i.strong,{children:(0,t.jsx)(i.a,{href:"https://www.browserstack.com/",children:"BrowserStack"})})," or ",(0,t.jsx)(i.strong,{children:(0,t.jsx)(i.a,{href:"https://www.lambdatest.com/",children:"LambdaTest"})})," to execute your tests remotely."]}),"\n"]})]}),"\n",(0,t.jsxs)(i.ul,{children:["\n",(0,t.jsxs)(i.li,{children:["Here are some basic properties you need to including in your ",(0,t.jsx)(i.code,{children:"custom.properties"})," file to run against an Appium Server for any kind of mobile execution:"]}),"\n"]}),"\n",(0,t.jsx)(i.pre,{children:(0,t.jsx)(i.code,{className:"language-properties",metastring:'showLineNumbers title="src/main/resources/properties/custom.properties"',children:"# you can set the value here to point to your appium server instance\n# this is the default value for local appium servers\nexecutionAddress=localhost:4723\n\n# use this property to choose your target OS, it supports both `ANDROID` or `IOS`\ntargetOperatingSystem=ANDROID\n\n# use this property to configure your automation name as per the appium user guide.\n# this property supports `UiAutomator2`, `Espresso` for Android, or `XCUITest` for iOS.\nmobile_automationName=UiAutomator2\n"})}),"\n",(0,t.jsxs)(i.ul,{children:["\n",(0,t.jsxs)(i.li,{children:["For Mobile Web Execution, you can configure any of the same properties mentioned in the ",(0,t.jsx)(i.strong,{children:(0,t.jsx)(i.a,{href:"../Basic_Config/basicConfig",children:"Web GUI basic config"})})," guide."]}),"\n",(0,t.jsx)(i.li,{children:"For Mobile Native Execution, you need to configure the following:"}),"\n"]}),"\n",(0,t.jsx)(i.pre,{children:(0,t.jsx)(i.code,{className:"language-properties",metastring:'showLineNumbers title="src/main/resources/properties/custom.properties"',children:"# you can either set the path to your apk or ipa file to do a fresh installation\n# before your test run, which is the recommended approach\nmobile_app=relativePath/to/myApp.apk\n\n# or you can use the package/activity combination to launch an already installed\n# app if you prefer, which is not recommended\nmobile_appPackage=com.example.android.myApp\nmobile_appActivity=.MainActivity\n"})}),"\n",(0,t.jsxs)(i.admonition,{type:"tip",children:[(0,t.jsx)(i.mdxAdmonitionTitle,{children:(0,t.jsx)(i.strong,{children:"Tip"})}),(0,t.jsxs)(i.p,{children:["You can learn more about the different ",(0,t.jsx)(i.strong,{children:(0,t.jsx)(i.a,{href:"../Properties/PropertyTypes",children:"property types"})})," and the ",(0,t.jsx)(i.strong,{children:(0,t.jsx)(i.a,{href:"../Properties/PropertiesList",children:"full list of supported properties"})})," by visiting the related pages."]})]})]})}function u(e={}){const{wrapper:i}={...(0,r.R)(),...e.components};return i?(0,t.jsx)(i,{...e,children:(0,t.jsx)(d,{...e})}):d(e)}},8453:(e,i,n)=>{n.d(i,{R:()=>s,x:()=>a});var o=n(6540);const t={},r=o.createContext(t);function s(e){const i=o.useContext(r);return o.useMemo((function(){return"function"==typeof e?e(i):{...i,...e}}),[i,e])}function a(e){let i;return i=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:s(e.components),o.createElement(r.Provider,{value:i},e.children)}}}]);