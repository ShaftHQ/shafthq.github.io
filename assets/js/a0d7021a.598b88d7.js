"use strict";(self.webpackChunkshaft_user_guide=self.webpackChunkshaft_user_guide||[]).push([[8768],{4137:(e,t,r)=>{r.d(t,{Zo:()=>s,kt:()=>f});var a=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function n(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?n(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):n(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,a,o=function(e,t){if(null==e)return{};var r,a,o={},n=Object.keys(e);for(a=0;a<n.length;a++)r=n[a],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);for(a=0;a<n.length;a++)r=n[a],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var c=a.createContext({}),u=function(e){var t=a.useContext(c),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},s=function(e){var t=u(e.components);return a.createElement(c.Provider,{value:t},e.children)},d="mdxType",p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var r=e.components,o=e.mdxType,n=e.originalType,c=e.parentName,s=l(e,["components","mdxType","originalType","parentName"]),d=u(r),m=o,f=d["".concat(c,".").concat(m)]||d[m]||p[m]||n;return r?a.createElement(f,i(i({ref:t},s),{},{components:r})):a.createElement(f,i({ref:t},s))}));function f(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var n=r.length,i=new Array(n);i[0]=m;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l[d]="string"==typeof e?e:o,i[1]=l;for(var u=2;u<n;u++)i[u]=r[u];return a.createElement.apply(null,i)}return a.createElement.apply(null,r)}m.displayName="MDXCreateElement"},1598:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>c,contentTitle:()=>i,default:()=>d,frontMatter:()=>n,metadata:()=>l,toc:()=>u});var a=r(7462),o=(r(7294),r(4137));const n={id:"Shaft_Locator_Builder",title:"Shaft Locator Builder",sidebar_label:"Shaft Locator Builder"},i=void 0,l={unversionedId:"Keywords/GUI/didYouKnow/Shaft_Locator_Builder",id:"Keywords/GUI/didYouKnow/Shaft_Locator_Builder",title:"Shaft Locator Builder",description:"- welcome to the new era of locating elements , with SHAFT Locator Builder you can locate element as if you were writing a story , you don't need to worry about xpath or css selector anymore",source:"@site/docs/Keywords/GUI/didYouKnow/Shaft_Locator_Builder.md",sourceDirName:"Keywords/GUI/didYouKnow",slug:"/Keywords/GUI/didYouKnow/Shaft_Locator_Builder",permalink:"/docs/Keywords/GUI/didYouKnow/Shaft_Locator_Builder",draft:!1,editUrl:"https://github.com/ShaftHQ/shafthq.github.io/blob/master/docs/Keywords/GUI/didYouKnow/Shaft_Locator_Builder.md",tags:[],version:"current",frontMatter:{id:"Shaft_Locator_Builder",title:"Shaft Locator Builder",sidebar_label:"Shaft Locator Builder"},sidebar:"docs",previous:{title:"Custom capabilities",permalink:"/docs/Keywords/GUI/didYouKnow/Custom_Capabilities"},next:{title:"Shadow Dom Locator Builder",permalink:"/docs/Keywords/GUI/didYouKnow/Shadow_Dom_Locator_Builder"}},c={},u=[{value:"Example",id:"example",level:4}],s={toc:u};function d(e){let{components:t,...r}=e;return(0,o.kt)("wrapper",(0,a.Z)({},s,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"welcome to the new era of locating elements , with SHAFT Locator Builder you can locate element as if you were writing a story , you don't need to worry about xpath or css selector anymore\nyou can use it in multiple ways as below , ")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-java"},'By locator = SHAFT.GUI.Locator.hasTagName("String value of desired Tag name").build();\nBy locator = SHAFT.GUI.Locator.hasAnyTagName().hasAttribute("attribute name").build();\nBy locator = SHAFT.GUI.Locator.hasAnyTagName().hasAttribute("attribute name" , "string value of the attribute").build();\n')),(0,o.kt)("p",null,"you can discover more options like containsText , containsId , containsClass "),(0,o.kt)("h4",{id:"example"},"Example"),(0,o.kt)("p",null,"below element has ",(0,o.kt)("strong",{parentName:"p"},"tag name"),' "Button" , and has ',(0,o.kt)("strong",{parentName:"p"},"attribute"),' "data-test" and ',(0,o.kt)("strong",{parentName:"p"},"attribute value"),' is "add-to-cart-sauce-labs-backpack"'),(0,o.kt)("p",null,(0,o.kt)("img",{parentName:"p",src:"https://github.com/ShaftHQ/shafthq.github.io/assets/65794900/a73f1e68-2476-4367-abbf-637b303089ac",alt:"Screenshot 2023-05-22 231141"})),(0,o.kt)("p",null,"using SHAFT Locator Builder you can locate this element like below"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-java"},'By buttonLocator = SHAFT.GUI.Locator.hasTagName("button").hasAttribute("test-data" , "add-to-cart-sauce-labs-backpack").build();\n')),(0,o.kt)("p",null,"for more examples visit ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/ShaftHQ/SHAFT_ENGINE/blob/main/src/test/java/testPackage/locator/LocatorBuilderTest.java"},"LocatorBuilderTest")," on Github."))}d.isMDXComponent=!0}}]);