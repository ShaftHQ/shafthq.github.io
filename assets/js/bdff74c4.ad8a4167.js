"use strict";(self.webpackChunkshaft_user_guide=self.webpackChunkshaft_user_guide||[]).push([[3582],{6482:(e,i,t)=>{t.r(i),t.d(i,{assets:()=>d,contentTitle:()=>s,default:()=>h,frontMatter:()=>o,metadata:()=>a,toc:()=>l});var n=t(5893),r=t(1151);const o={id:"first_steps_3",title:"SHAFT vs. Native",sidebar_label:"SHAFT vs. Native"},s=void 0,a={id:"Getting_Started/first_steps_3",title:"SHAFT vs. Native",description:'We all know that ["Selenium Vs ... " blog posts are mainly click-bait] per this insightful article from the Selenium user guide.',source:"@site/docs/Getting_Started/first_steps_3.md",sourceDirName:"Getting_Started",slug:"/Getting_Started/first_steps_3",permalink:"/docs/Getting_Started/first_steps_3",draft:!1,unlisted:!1,editUrl:"https://github.com/ShaftHQ/shafthq.github.io/blob/master/docs/Getting_Started/first_steps_3.md",tags:[],version:"current",frontMatter:{id:"first_steps_3",title:"SHAFT vs. Native",sidebar_label:"SHAFT vs. Native"},sidebar:"docs",previous:{title:"SHAFT & Selenium",permalink:"/docs/Getting_Started/first_steps_2"},next:{title:"Prerequisites",permalink:"/docs/Getting_Started/first_steps_4"}},d={},l=[{value:"Selenium WebDriver Native Code",id:"selenium-webdriver-native-code",level:3},{value:"Description / Observations:",id:"description--observations",level:4},{value:"SHAFT Code",id:"shaft-code",level:3},{value:"Description / Observations",id:"description--observations-1",level:4}];function c(e){const i={a:"a",admonition:"admonition",code:"code",em:"em",h3:"h3",h4:"h4",li:"li",mdxAdmonitionTitle:"mdxAdmonitionTitle",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,r.a)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)(i.p,{children:["We all know that ",(0,n.jsx)(i.strong,{children:(0,n.jsx)(i.a,{href:"https://www.selenium.dev/blog/2024/selenium-vs-blog-posts/",children:'"Selenium Vs ... " blog posts are mainly click-bait'})})," per this insightful article from the Selenium user guide.\n",(0,n.jsx)("br",{}),"Our objective here is not to make claims or comparisons, it is rather to analyze the differences and commonalities between the two.\n",(0,n.jsx)("br",{}),"To do that, let's examine some code sample and share our observations as we go along ..."]}),"\n",(0,n.jsx)(i.h3,{id:"selenium-webdriver-native-code",children:"Selenium WebDriver Native Code"}),"\n",(0,n.jsxs)(i.ul,{children:["\n",(0,n.jsx)(i.li,{children:"Below is a realistic WebDriver code block to be later examined alongside its SHAFT counterpart:"}),"\n"]}),"\n",(0,n.jsx)(i.pre,{children:(0,n.jsx)(i.code,{className:"language-java",metastring:'showLineNumbers title="SeleniumNativeTest.java"',children:'    WebDriver driver;\n\n    @Test\n    public void basicWebBrowserInteractions(){\n        driver.navigate().to("https://github.com/shafthq/SHAFT_ENGINE");\n        var handle1 = driver.getWindowHandle();\n        driver.findElement(By.xpath("//h2/following-sibling::div//a[@title=\'https://shafthq.github.io/\']")).click();\n        var handles = driver.getWindowHandles();\n        handles.remove(handle1);\n        var handle2 = handles.stream().toList().getLast();\n        driver.switchTo().window(handle2);\n        driver.findElement(By.xpath("(//a[contains(text(),\'Upgrade Now\')])[last()]")).click();\n        Wait<WebDriver> wait = new WebDriverWait(driver, Duration.ofSeconds(5));\n        wait.until(d -> driver.getCurrentUrl().contains("docs"));\n        Assert.assertEquals(driver.findElement(By.tagName("h1")).getText(), "First Steps");\n    }\n\n    @BeforeMethod\n    void beforeMethod(){\n        driver = new ChromeDriver();\n    }\n\n    @AfterMethod\n    void afterMethod(){\n        driver.quit();\n    }\n'})}),"\n",(0,n.jsx)(i.h4,{id:"description--observations",children:"Description / Observations:"}),"\n",(0,n.jsxs)(i.ul,{children:["\n",(0,n.jsx)(i.li,{children:"line [1] is for driver instance declaration. This is the object that we will use for the rest of our test."}),"\n",(0,n.jsx)(i.li,{children:"line [20] is for chrome driver initialization. This is where selenium will go to download the browser/driver based on the provided configuration (the latest by default)"}),"\n"]}),"\n",(0,n.jsxs)(i.admonition,{type:"warning",children:[(0,n.jsx)(i.mdxAdmonitionTitle,{children:(0,n.jsx)(i.strong,{children:"Browser type is hard-coded"})}),(0,n.jsx)(i.p,{children:"For that we would need to write a boilerplate code to manage the different browser types, execution location (local, remote), and other settings related to driver initialization."})]}),"\n",(0,n.jsxs)(i.ul,{children:["\n",(0,n.jsx)(i.li,{children:"lines [5] > [15] is where we perform our actions, we navigate to a link, click another link that opens in a new window, switch to the new window, click a button, and then validate the text value of an element on that page."}),"\n"]}),"\n",(0,n.jsxs)(i.admonition,{type:"warning",children:[(0,n.jsx)(i.mdxAdmonitionTitle,{children:(0,n.jsx)(i.strong,{children:"Batteries Required but not included"})}),(0,n.jsxs)(i.p,{children:["This is a pain point that the Selenium WebDriver team are aware of and working to mitigate with their ",(0,n.jsx)(i.em,{children:"Batteries Included"})," initiative. Previously we needed to import WebDriverManager to download driver binaries, and now we don't, but we still do need to import extra libraries for assertions, dealing with test data, logging, reporting, and many more. Making boilerplate code a requirement for an effective and efficient test automation solution."]})]}),"\n",(0,n.jsxs)(i.admonition,{type:"warning",children:[(0,n.jsx)(i.mdxAdmonitionTitle,{children:(0,n.jsx)(i.strong,{children:"Explicit waits are required"})}),(0,n.jsx)(i.p,{children:"If we do not implement an explicit wait, the above test will fail because it simply will not wait for the navigation (triggered by the click) to conclude. This is the default and documented behavior of Selenium WebDriver's click action."})]}),"\n",(0,n.jsxs)(i.admonition,{type:"warning",children:[(0,n.jsx)(i.mdxAdmonitionTitle,{children:(0,n.jsx)(i.strong,{children:"One action per line"})}),(0,n.jsxs)(i.p,{children:["To do anything we need to start the line by typing ",(0,n.jsx)(i.code,{children:"driver."})," and each line ends after performing one element action with no fluent API implementation."]})]}),"\n",(0,n.jsxs)(i.ul,{children:["\n",(0,n.jsx)(i.li,{children:"line [25] is for chrome driver termination"}),"\n"]}),"\n",(0,n.jsx)(i.h3,{id:"shaft-code",children:"SHAFT Code"}),"\n",(0,n.jsx)(i.pre,{children:(0,n.jsx)(i.code,{className:"language-java",metastring:'showLineNumbers title="ShaftTest.java"',children:'    SHAFT.GUI.WebDriver driver;\n\n    public void basicWebBrowserInteractions(){\n        var handle1 = driver.browser().navigateToURL("https://github.com/shafthq/SHAFT_ENGINE").getWindowHandle();\n        var handles = driver.element().click(By.xpath("//h2/following-sibling::div//a[@title=\'https://shafthq.github.io/\']")).and().browser().getWindowHandles();\n        handles.remove(handle1);\n        var handle2 = handles.getLast();\n        driver.browser().switchToWindow(handle2)\n                .and().element().click(SHAFT.GUI.Locator.hasTagName("a").containsText("Upgrade Now").isLast().build())\n                .and().assertThat(By.tagName("h1")).text().isEqualTo("First Steps").perform();\n    }\n\n    @BeforeMethod\n    void beforeMethod(){\n        driver = new SHAFT.GUI.WebDriver();\n    }\n\n    @AfterMethod\n    void afterMethod(){\n        driver.quit();\n    }\n'})}),"\n",(0,n.jsx)(i.h4,{id:"description--observations-1",children:"Description / Observations"}),"\n",(0,n.jsxs)(i.ul,{children:["\n",(0,n.jsx)(i.li,{children:"line [1] is for SHAFT's GUI WebDriver instance declaration. This is the object that we will use for the rest of our test."}),"\n"]}),"\n",(0,n.jsxs)(i.admonition,{type:"tip",children:[(0,n.jsx)(i.mdxAdmonitionTitle,{children:(0,n.jsx)(i.strong,{children:"Batteries included"})}),(0,n.jsx)(i.p,{children:"There are many drivers within SHAFT that you can use to automate Web, Mobile, API, Database, and CLI actions."})]}),"\n",(0,n.jsxs)(i.ul,{children:["\n",(0,n.jsx)(i.li,{children:"line [15] is for chrome driver initialization. This is where SHAFT will use Selenium Manager (or WebDriverManager when needed) to download the browser/driver/docker container based on the provided properties."}),"\n"]}),"\n",(0,n.jsxs)(i.admonition,{type:"tip",children:[(0,n.jsx)(i.mdxAdmonitionTitle,{children:(0,n.jsx)(i.strong,{children:"Dynamic Properties"})}),(0,n.jsxs)(i.p,{children:["Browser Type is not hard-coded, there is no boilerplate code required, and you can configure it with a look at our ",(0,n.jsx)(i.a,{href:"../Properties/PropertyTypes",children:"Property Types"})," and ",(0,n.jsx)(i.a,{href:"../Properties/PropertiesList",children:"Properties List"}),"."]})]}),"\n",(0,n.jsxs)(i.ul,{children:["\n",(0,n.jsx)(i.li,{children:"lines [4] > [10] is where we perform our actions, we navigate to a link, click another link that opens in a new window, switch to the new window, click a button, and then validate the text value of an element on that page."}),"\n"]}),"\n",(0,n.jsxs)(i.admonition,{type:"tip",children:[(0,n.jsx)(i.mdxAdmonitionTitle,{children:(0,n.jsx)(i.strong,{children:"No Boilerplate code"})}),(0,n.jsxs)(i.p,{children:["We do not need to configure an explicit wait as SHAFT will wait automatically for any actions to continue loading. This is all configurable via our ",(0,n.jsx)(i.a,{href:"../Properties/PropertiesList",children:"Properties List"})," to ensure that there is no ",(0,n.jsx)(i.em,{children:"Magic"})," in your code."]})]}),"\n",(0,n.jsxs)(i.admonition,{type:"tip",children:[(0,n.jsx)(i.mdxAdmonitionTitle,{children:(0,n.jsx)(i.strong,{children:"Fluent API"})}),(0,n.jsxs)(i.p,{children:["You only need to type ",(0,n.jsx)(i.code,{children:"driver."})," once at the start of your code block, and you can easily chain ",(0,n.jsx)(i.a,{href:"../Keywords/GUI/Browser_Actions",children:"Browser Actions"}),", ",(0,n.jsx)(i.a,{href:"../Keywords/GUI/Element_Actions",children:"Element Actions"}),", and ",(0,n.jsx)(i.a,{href:"../Keywords/GUI/Element_Validations",children:"Validations"}),"."]})]}),"\n",(0,n.jsxs)(i.ul,{children:["\n",(0,n.jsx)(i.li,{children:"line [20] is for shaft driver termination"}),"\n"]}),"\n",(0,n.jsxs)(i.admonition,{type:"tip",children:[(0,n.jsx)(i.mdxAdmonitionTitle,{children:(0,n.jsx)(i.strong,{children:"Intuitive & Familiar"})}),(0,n.jsxs)(i.p,{children:["In most cases just typing ",(0,n.jsx)(i.code,{children:"driver."})," will be enough for anyone to find the action they want to perform, and in the off chance it's not everything is documented, and our user guide is searchable to make finding what you need all the more simple."]})]})]})}function h(e={}){const{wrapper:i}={...(0,r.a)(),...e.components};return i?(0,n.jsx)(i,{...e,children:(0,n.jsx)(c,{...e})}):c(e)}},1151:(e,i,t)=>{t.d(i,{Z:()=>a,a:()=>s});var n=t(7294);const r={},o=n.createContext(r);function s(e){const i=n.useContext(o);return n.useMemo((function(){return"function"==typeof e?e(i):{...i,...e}}),[i,e])}function a(e){let i;return i=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:s(e.components),n.createElement(o.Provider,{value:i},e.children)}}}]);