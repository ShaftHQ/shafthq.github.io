import React, { useEffect } from 'react';
import Tabs from '@theme/Tabs';

function ScrollableTabs() {
  useEffect(() => {
    const scrollButton = document.getElementById('scrollButton');

    // Scroll to the right when the button is clicked
    scrollButton.addEventListener('click', () => {
      const tabs = document.getElementById('yourTabs'); // Replace with the actual ID of your Tabs container
      tabs.scrollLeft += 100; // Adjust the scroll distance as needed
    });
  }, []);

  return (
    <div>
      {/* Your existing Tabs component */}
      <Tabs id="PropertyTypes">
          <TabItem value="platform" label="Platform"></TabItem>
          <TabItem value="web" label="Web"></TabItem>
          <TabItem value="mobile" label="Mobile"></TabItem>
          <TabItem value="flags" label="Flags"></TabItem>
          <TabItem value="reporting" label="Reporting"></TabItem>
          <TabItem value="timeouts" label="Timeouts"></TabItem>
          <TabItem value="visuals" label="Visuals"></TabItem>
          <TabItem value="jira" label="Jira"></TabItem>
          <TabItem value="cucumber" label="Cucumber"></TabItem>
          <TabItem value="healenium" label="Healenium"></TabItem>
          <TabItem value="paths" label="Paths"></TabItem>
          <TabItem value="pattern" label="Pattern"></TabItem>
          <TabItem value="tinkey" label="Tinkey"></TabItem>
          <TabItem value="browserStack" label="BrowserStack"></TabItem>
          <TabItem value="lambdaTest" label="LambdaTest"></TabItem>
          <TabItem value="performance" label="Performance"></TabItem>
          <TabItem value="testng" label="TestNG"></TabItem>
          <TabItem value="log4j" label="Log4j"></TabItem>
      </Tabs>
      <button id="scrollButton">Scroll Right</button>
    </div>
  );
}

export default ScrollableTabs;