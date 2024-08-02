"use strict";(self.webpackChunkshaft_user_guide=self.webpackChunkshaft_user_guide||[]).push([[3065],{960:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>o,default:()=>h,frontMatter:()=>r,metadata:()=>a,toc:()=>d});var s=t(5893),i=t(1151);const r={id:"Integrate_JIRA_With_SHAFT_Engine",title:"Integrate JIRA With SHAFT-Engine",sidebar_label:"Integrate JIRA With SHAFT-Engine"},o="Integrate JIRA With SHAFT Engine",a={id:"Keywords/GUI/didYouKnow/Integrate_JIRA_With_SHAFT_Engine",title:"Integrate JIRA With SHAFT-Engine",description:"This guide provides the necessary steps to integrate JIRA with the SHAFT engine by creating an API token and configuring essential properties.",source:"@site/docs/Keywords/GUI/didYouKnow/Integrate_JIRA_With_SHAFT_Engine.md",sourceDirName:"Keywords/GUI/didYouKnow",slug:"/Keywords/GUI/didYouKnow/Integrate_JIRA_With_SHAFT_Engine",permalink:"/docs/Keywords/GUI/didYouKnow/Integrate_JIRA_With_SHAFT_Engine",draft:!1,unlisted:!1,editUrl:"https://github.com/ShaftHQ/shafthq.github.io/blob/master/docs/Keywords/GUI/didYouKnow/Integrate_JIRA_With_SHAFT_Engine.md",tags:[],version:"current",frontMatter:{id:"Integrate_JIRA_With_SHAFT_Engine",title:"Integrate JIRA With SHAFT-Engine",sidebar_label:"Integrate JIRA With SHAFT-Engine"},sidebar:"docs",previous:{title:"Shadow Dom Locator Builder",permalink:"/docs/Keywords/GUI/didYouKnow/Shadow_Dom_Locator_Builder"},next:{title:"Using Cookies in Your Tests",permalink:"/docs/Keywords/GUI/didYouKnow/Using_Cookies_In_Your_Tests"}},c={},d=[{value:"Steps",id:"steps",level:2},{value:"Example Configuration",id:"example-configuration",level:2}];function l(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",img:"img",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",...(0,i.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.h1,{id:"integrate-jira-with-shaft-engine",children:"Integrate JIRA With SHAFT Engine"}),"\n",(0,s.jsx)(n.p,{children:"This guide provides the necessary steps to integrate JIRA with the SHAFT engine by creating an API token and configuring essential properties."}),"\n",(0,s.jsx)(n.h2,{id:"steps",children:"Steps"}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"Log in"})," to JIRA via ",(0,s.jsx)(n.a,{href:"https://id.atlassian.com/login",children:"Atlassian Login"}),"."]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:["Click on ",(0,s.jsx)(n.strong,{children:"Account Settings"}),"."]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"Account Settings",src:t(7558).Z+"",width:"1917",height:"762"})}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:["Click on the ",(0,s.jsx)(n.strong,{children:"Security"})," tab."]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"Security Tab",src:t(7838).Z+"",width:"1768",height:"923"})}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:["Click on ",(0,s.jsx)(n.strong,{children:"Create and manage API tokens"}),"."]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:["Click on ",(0,s.jsx)(n.strong,{children:"Create API token"}),"."]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"Create and Manage API Tokens",src:t(2482).Z+"",width:"1731",height:"783"})}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:["Enter a label for your API token and click ",(0,s.jsx)(n.strong,{children:"Create"}),"."]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"Create API Token",src:t(1589).Z+"",width:"1736",height:"756"})}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:["After the token is created, click on ",(0,s.jsx)(n.strong,{children:"Copy"})," to copy the token."]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"Generated Token",src:t(5765).Z+"",width:"1910",height:"547"})}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"Set the Copied Token"}),": Open your ",(0,s.jsx)(n.code,{children:"JIRA.properties"})," file and set the copied token as the value for the ",(0,s.jsx)(n.code,{children:"authorization"})," property:"]}),"\n"]}),"\n"]}),"\n",(0,s.jsx)(n.h2,{id:"example-configuration",children:"Example Configuration"}),"\n",(0,s.jsxs)(n.p,{children:["Below is an example of how to set these properties in your ",(0,s.jsx)(n.code,{children:"JIRA.properties"})," file:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-properties",children:"# Enable interaction with JIRA\njiraInteraction=true\n\n# JIRA instance URL\njiraUrl=https://your-jira-instance.atlassian.net\n\n# JIRA project key\nprojectKey=PROJ\n\n# Authorization token for JIRA APIs\n authorization=your-copied-token\n\n# Report test cases execution to JIRA\nreportTestCasesExecution=true\n\n# Path to test results file\nreportPath=target/surefire-reports/testng-results.xml\n\n# Name of the test execution session\nExecutionName=RegressionTestExecution\n\n# Description of the test execution\nExecutionDescription=Automated testing for the latest regression suite.\n\n# Automatically report bugs for failed test cases\nReportBugs=true\n\n# Assignee for JIRA issues\nassignee=jira-user-id\n\n# Allure report link patterns\nallure.link.tms.pattern=https://your-tms-instance.com/tms/{}\n\n"})})]})}function h(e={}){const{wrapper:n}={...(0,i.a)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(l,{...e})}):l(e)}},7558:(e,n,t)=>{t.d(n,{Z:()=>s});const s=t.p+"assets/images/Account_settings-277baa49734f63be0f66e71c99d63064.png"},2482:(e,n,t)=>{t.d(n,{Z:()=>s});const s=t.p+"assets/images/Create_API_Token-fe043c74f877b835bf0e8fe6831d3372.png"},5765:(e,n,t)=>{t.d(n,{Z:()=>s});const s=t.p+"assets/images/Generate_Token-87a21a88653f64213edab2e24219631e.png"},1589:(e,n,t)=>{t.d(n,{Z:()=>s});const s=t.p+"assets/images/Label-9ee83a5e1d20337749014fc47e3d07ab.png"},7838:(e,n,t)=>{t.d(n,{Z:()=>s});const s=t.p+"assets/images/Security_Tap-79eb023adde2680bbf94fbab168326a1.png"},1151:(e,n,t)=>{t.d(n,{Z:()=>a,a:()=>o});var s=t(7294);const i={},r=s.createContext(i);function o(e){const n=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:o(e.components),s.createElement(r.Provider,{value:n},e.children)}}}]);