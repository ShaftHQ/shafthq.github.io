"use strict";(self.webpackChunkshaft_user_guide=self.webpackChunkshaft_user_guide||[]).push([["47055"],{54418(e,t,s){s.r(t),s.d(t,{default:()=>y});var a=s(74848),i=s(96540);let o="iconButton_adn1",n="avatarIcon_EWxU",r="message_Uq4J",c="messageContent_NKik",l="assistantMessage_I955",d="messageAvatar_CQFy",u="messageBubble_wOCB";var h=s(1970),m=s(37107),f=s(66188),g=s(27736),p=s(21133);m.Yv.add(f.X7I);let v="https://shafthq.github.io/",y=()=>{let[e,t]=(0,i.useState)(!1),[s,m]=(0,i.useState)([]),[f,y]=(0,i.useState)(""),[N,b]=(0,i.useState)(!1),[x,j]=(0,i.useState)(!1),A=(0,i.useRef)(null),w=(0,i.useRef)(null),S=(0,i.useRef)(null),E=`You are AutoBot, the intelligent technical assistant for SHAFT, the Unified Test Automation Engine. Your objective is to help users by retrieving accurate information from the official SHAFT documentation and GitHub repository that have been provided to you.

SCOPE OF KNOWLEDGE
You have been provided with:
1. The complete SHAFT Engine user guide documentation
2. Information about the official SHAFT GitHub repository (github.com/shafthq/SHAFT_ENGINE)

STRICT OPERATIONAL RULES
1. SOURCE RESTRICTION: Use information ONLY from the documentation and repository information that has been provided to you in your system context. Do NOT use:
   - Your pre-training knowledge
   - Internet searches
   - Previously cached information
   - Any external sources
2. ACCURACY OVER HELPFULNESS: Only answer based on what you can find in the provided documentation. If information is not in the documentation, clearly state this.
3. CODE SNIPPETS: Provide Java code examples only if they are derived from the official documentation or follow standard SHAFT patterns (e.g., fluid syntax starting with SHAFT.).
4. DOCUMENTATION REFERENCES: When providing answers, reference the specific document or section where the information was found.

HANDLING MISSING DATA
If you cannot find the answer in the provided documentation, you must state:
"I could not find verified information about this in the SHAFT documentation provided to me. For more details, please check:
- GitHub Repository: https://github.com/shafthq/SHAFT_ENGINE
- GitHub Issues: https://github.com/shafthq/SHAFT_ENGINE/issues
- GitHub Discussions: https://github.com/shafthq/SHAFT_ENGINE/discussions
- User Guide: ${v}"

RESPONSE GUIDELINES
When answering questions:
1. Search thoroughly through the provided documentation
2. Be concise and accurate
3. Provide code examples from the documentation when relevant
4. Reference specific documentation sections or files
5. If uncertain, admit it rather than guessing
6. Guide users to the appropriate GitHub resources for advanced topics

Focus on helping users with:
- Getting started with SHAFT
- Configuration and setup
- Writing tests (Web, Mobile, API, CLI, Database)
- Best practices and patterns
- Understanding SHAFT features
- Troubleshooting common issues
`;(0,i.useEffect)(()=>{A.current?.scrollIntoView({behavior:"smooth"})},[s]),(0,i.useEffect)(()=>{let e,t=()=>{j(window.innerWidth<=768)};t();let s=()=>{clearTimeout(e),e=setTimeout(t,150)};return window.addEventListener("resize",s),()=>{clearTimeout(e),window.removeEventListener("resize",s)}},[]),(0,i.useEffect)(()=>{let e=S.current;e&&(e.style.height="auto",e.style.height=Math.min(e.scrollHeight,100)+"px")},[f]),(0,i.useEffect)(()=>{e&&0===s.length&&m([{role:"assistant",content:"\u{1F44B} Hi! I'm AutoBot, your SHAFT assistant. How can I help you today?",timestamp:new Date}])},[e]);let I=async()=>{if(!f.trim()||N)return;let e=f.trim(),t={role:"user",content:e,timestamp:new Date};m(e=>[...e,t]),y(""),b(!0);try{let t=s.slice(-10),a=t.findIndex(e=>"user"===e.role),i=(a>=0?t.slice(a):[]).map(e=>({role:"user"===e.role?"user":"model",parts:[{text:e.content}]})),o=await fetch("https://shaft-engine.mohab-mohieeldeen.workers.dev/api/gemini-proxy",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:e,history:i,systemInstruction:E})});if(!o.ok){let e=await o.json().catch(()=>({}));throw Error(e.error||"Unable to connect to the chatbot service. Please try again.")}let n=await o.json(),r={role:"assistant",content:n.text,timestamp:new Date};console.log(`[AutoBot] Successfully used model: ${n.model||"unknown"}`),m(e=>[...e,r])}catch(t){console.error("[AutoBot] Error calling Gemini API:",t);let e={role:"assistant",content:t.message||`Sorry, I encountered an error. Please try again or check the user guide at ${v}`,timestamp:new Date};m(t=>[...t,e])}finally{b(!1)}},T=()=>{t(!e)};return(0,a.jsxs)("div",{className:"autoBotContainer_jNZh",children:[!e&&(0,a.jsx)("button",{type:"button",className:"chatButton_EKaR",onClick:T,"aria-label":"Open AutoBot Chat",title:"Chat with AutoBot",children:(0,a.jsx)("img",{src:"/img/autobot-avatar.svg",alt:"AutoBot",className:"chatButtonIcon_FzuQ",loading:"lazy",decoding:"async"})}),e&&(0,a.jsxs)("div",{className:"chatWindow__E0a",role:"dialog","aria-label":"AutoBot chat",children:[(0,a.jsxs)("div",{className:"chatHeader_MoNn",children:[(0,a.jsxs)("div",{className:"headerLeft_lvSk",children:[(0,a.jsx)("img",{src:"/img/autobot-avatar.svg",alt:"AutoBot",className:"headerIcon_CUVm",loading:"lazy",decoding:"async"}),(0,a.jsxs)("div",{className:"headerText_kQla",children:[(0,a.jsx)("h3",{children:"AutoBot"}),(0,a.jsxs)("span",{className:"statusIndicator_a9pU",children:[(0,a.jsx)("span",{className:"statusDot_FFFv"}),"SHAFT docs assistant"]})]})]}),(0,a.jsxs)("div",{className:"headerActions_mv4j",children:[(0,a.jsx)("button",{type:"button",className:o,onClick:()=>{m([{role:"assistant",content:"\u{1F44B} Hi! I'm AutoBot, your SHAFT assistant. How can I help you today?",timestamp:new Date}])},"aria-label":"Clear chat",title:"Clear chat",children:(0,a.jsx)(h.gc,{icon:"fa-solid fa-trash"})}),(0,a.jsx)("button",{type:"button",className:o,onClick:T,"aria-label":"Minimize chat",title:"Minimize chat",children:(0,a.jsx)(h.gc,{icon:"fa-solid fa-window-minimize"})})]})]}),(0,a.jsxs)("div",{className:"chatMessages_HI6E",ref:w,children:[s.map((e,t)=>(0,a.jsx)("div",{className:`${r} ${"user"===e.role?"userMessage_oVQO":l}`,children:(0,a.jsxs)("div",{className:c,children:["assistant"===e.role&&(0,a.jsx)("div",{className:d,children:(0,a.jsx)("img",{src:"/img/autobot-avatar.svg",alt:"AutoBot",className:n,loading:"lazy",decoding:"async"})}),(0,a.jsxs)("div",{className:u,children:["assistant"===e.role?(0,a.jsx)("div",{className:"markdownContent_MrP8",children:(0,a.jsx)(g.oz,{remarkPlugins:[p.A],children:e.content})}):(0,a.jsx)("p",{children:e.content}),(0,a.jsx)("span",{className:"messageTime_d4tl",children:e.timestamp.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})})]}),"user"===e.role&&(0,a.jsx)("div",{className:d,children:(0,a.jsx)(h.gc,{icon:"fa-solid fa-user"})})]})},t)),N&&(0,a.jsx)("div",{className:`${r} ${l}`,children:(0,a.jsxs)("div",{className:c,children:[(0,a.jsx)("div",{className:d,children:(0,a.jsx)("img",{src:"/img/autobot-avatar.svg",alt:"AutoBot",className:n,loading:"lazy",decoding:"async"})}),(0,a.jsx)("div",{className:u,children:(0,a.jsxs)("div",{className:"typingIndicator_qirE",children:[(0,a.jsx)("span",{}),(0,a.jsx)("span",{}),(0,a.jsx)("span",{})]})})]})}),(0,a.jsx)("div",{ref:A})]}),(0,a.jsxs)("div",{className:"chatInput_YqF9",children:[(0,a.jsx)("textarea",{ref:S,value:f,onChange:e=>y(e.target.value),onKeyDown:e=>{if("Enter"===e.key)if(x)return;else{if(e.shiftKey)return;e.preventDefault(),I()}},onFocus:()=>{if(x&&S.current){let e=S.current,t=setTimeout(()=>{e&&e.isConnected&&e.scrollIntoView({behavior:"smooth",block:"center"})},300);return()=>clearTimeout(t)}},"aria-label":"Ask AutoBot about SHAFT",placeholder:"Ask about SHAFT docs...",className:"inputField_vD6_",rows:1,disabled:N}),(0,a.jsx)("button",{type:"button",onClick:I,className:"sendButton_mT0B",disabled:!f.trim()||N,"aria-label":"Send message",children:(0,a.jsx)(h.gc,{icon:"fa-solid fa-paper-plane"})})]}),(0,a.jsx)("div",{className:"chatFooter_gUXF",children:(0,a.jsxs)("small",{children:["Powered by"," ",(0,a.jsx)("a",{href:"https://ai.google.dev/gemini-api",target:"_blank",rel:"noopener noreferrer",children:"Gemini AI"})]})})]})]})}}}]);