"use strict";(self.webpackChunkshaft_user_guide=self.webpackChunkshaft_user_guide||[]).push([[6682],{6744:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>d,contentTitle:()=>a,default:()=>h,frontMatter:()=>r,metadata:()=>o,toc:()=>c});var i=n(5893),s=n(1151);const r={id:"first_steps_5",title:"Getting Started",sidebar_label:"Getting Started"},a=void 0,o={id:"Getting_Started/first_steps_5",title:"Getting Started",description:"Setting up a new project",source:"@site/docs/Getting_Started/first_steps_5.md",sourceDirName:"Getting_Started",slug:"/Getting_Started/first_steps_5",permalink:"/docs/Getting_Started/first_steps_5",draft:!1,unlisted:!1,editUrl:"https://github.com/ShaftHQ/shafthq.github.io/blob/master/docs/Getting_Started/first_steps_5.md",tags:[],version:"current",frontMatter:{id:"first_steps_5",title:"Getting Started",sidebar_label:"Getting Started"},sidebar:"docs",previous:{title:"Prerequisites",permalink:"/docs/Getting_Started/first_steps_4"},next:{title:"Types",permalink:"/docs/Properties/PropertyTypes"}},d={},c=[{value:"Setting up a new project",id:"setting-up-a-new-project",level:3},{value:"Upgrading an existing project",id:"upgrading-an-existing-project",level:3}];function l(e){const t={a:"a",admonition:"admonition",code:"code",h3:"h3",img:"img",li:"li",mdxAdmonitionTitle:"mdxAdmonitionTitle",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,s.a)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(t.h3,{id:"setting-up-a-new-project",children:"Setting up a new project"}),"\n",(0,i.jsx)(t.p,{children:"Now that you're hooked, the fastest way to set up a new sandbox and start experiencing SHAFT is using our TestNG Maven Archetype."}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsxs)(t.li,{children:["\n",(0,i.jsxs)(t.p,{children:["You can do that by following this lovely ",(0,i.jsx)(t.strong,{children:(0,i.jsx)(t.a,{href:"https://www.jetbrains.com/help/idea/maven-support.html#maven_archetype",children:"IntelliJ IDEA guide"})}),"."]}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsxs)(t.li,{children:["Before you press ",(0,i.jsx)(t.code,{children:"Create"})," you'll need to add the archetype first by using this data"]}),"\n"]}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-text",children:"GroupId: io.github.shafthq\nArtifactId: testng-archetype\nVersion: ${archetype.version}\n"})}),"\n",(0,i.jsxs)(t.admonition,{type:"info",children:[(0,i.jsx)(t.mdxAdmonitionTitle,{children:(0,i.jsx)(t.strong,{children:"Replace"})}),(0,i.jsxs)(t.p,{children:[(0,i.jsx)(t.code,{children:"${archetype.version}"})," with ",(0,i.jsx)(t.strong,{children:(0,i.jsx)(t.a,{href:"https://github.com/ShaftHQ/testng-archetype/releases/latest",children:"the latest SHAFT_Engine: TestNG Archetype version"})}),"."]})]}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsxs)(t.li,{children:["It should look something like this\n",(0,i.jsx)(t.img,{alt:"IntelliJ IDEA Archetype",src:n(101).Z+"",width:"666",height:"589"})]}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(t.li,{children:["\n",(0,i.jsx)(t.p,{children:"Or you can do it manually by following these steps:"}),"\n",(0,i.jsxs)(t.ol,{children:["\n",(0,i.jsx)(t.li,{children:(0,i.jsx)(t.a,{href:"https://maven.apache.org/download.cgi",children:"Download the latest version of mvn"})}),"\n",(0,i.jsx)(t.li,{children:(0,i.jsx)(t.a,{href:"https://maven.apache.org/install.html",children:"Add it to your PATH variable"})}),"\n",(0,i.jsx)(t.li,{children:"Create a new directory for the project, and navigate to it."}),"\n",(0,i.jsx)(t.li,{children:"Open a Terminal window in the target directory and execute the below command."}),"\n"]}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-shell",metastring:'title="Generate a new SHAFT project"',children:'mvn archetype:generate "-DarchetypeGroupId=io.github.shafthq" "-DarchetypeArtifactId=testng-archetype" "-DarchetypeVersion=${archetype.version}" "-DinteractiveMode=false" "-DgroupId=io.github.shafthq" "-DartifactId=using_SHAFT_Engine"\n'})}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(t.admonition,{type:"info",children:[(0,i.jsx)(t.mdxAdmonitionTitle,{children:(0,i.jsx)(t.strong,{children:"Replace"})}),(0,i.jsxs)(t.p,{children:[(0,i.jsx)(t.code,{children:"${archetype.version}"})," with ",(0,i.jsx)(t.strong,{children:(0,i.jsx)(t.a,{href:"https://github.com/ShaftHQ/testng-archetype/releases/latest",children:"the latest SHAFT_Engine: TestNG Archetype version"})}),"."]})]}),"\n",(0,i.jsxs)(t.admonition,{type:"info",children:[(0,i.jsx)(t.mdxAdmonitionTitle,{children:(0,i.jsx)(t.strong,{children:"Customize"})}),(0,i.jsxs)(t.p,{children:[(0,i.jsx)(t.code,{children:'"-DgroupId=io.github.shafthq"'})," and ",(0,i.jsx)(t.code,{children:'"-DartifactId=using_SHAFT_Engine"'})," with the groupId and artifactId that you want to use for the new project."]})]}),"\n",(0,i.jsx)(t.h3,{id:"upgrading-an-existing-project",children:"Upgrading an existing project"}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsxs)(t.li,{children:["To upgrade your existing Selenium/Appium/RestAssured projects to use SHAFT you can check out our ",(0,i.jsx)(t.strong,{children:(0,i.jsx)(t.a,{href:"https://github.com/shafthq/SHAFT_ENGINE?tab=readme-ov-file#-quick-start-guide",children:"detailed guide"})})," and merge the pom.xml file content manually."]}),"\n"]})]})}function h(e={}){const{wrapper:t}={...(0,s.a)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(l,{...e})}):l(e)}},101:(e,t,n)=>{n.d(t,{Z:()=>i});const i=n.p+"assets/images/archetype-66b80f0cb59769f8641a33552beb1daf.png"},1151:(e,t,n)=>{n.d(t,{Z:()=>o,a:()=>a});var i=n(7294);const s={},r=i.createContext(s);function a(e){const t=i.useContext(r);return i.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function o(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:a(e.components),i.createElement(r.Provider,{value:t},e.children)}}}]);