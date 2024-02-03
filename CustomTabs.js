import React, { useEffect } from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

function CustomTabs() {
  useEffect(() => {
    const tabsContainer = document.getElementById('customTabs');
    const scrollLeftButton = document.getElementById('scrollLeftButton');
    const scrollRightButton = document.getElementById('scrollRightButton');

    const handleScrollLeft = () => {
      tabsContainer.scrollLeft -= 100; // Adjust the scroll distance as needed
    };

    const handleScrollRight = () => {
      tabsContainer.scrollLeft += 100; // Adjust the scroll distance as needed
    };

    scrollLeftButton.addEventListener('click', handleScrollLeft);
    scrollRightButton.addEventListener('click', handleScrollRight);

    return () => {
      // Clean up event listeners on component unmount
      scrollLeftButton.removeEventListener('click', handleScrollLeft);
      scrollRightButton.removeEventListener('click', handleScrollRight);
    };
  }, []);

  return (
    <div>
      <div id="customTabs" className="tabs">
        {/* Your TabItems */}
        <Tabs groupId="yourGroupId">
          <TabItem value="tab1" label="Tab 1">
            {/* Content for Tab 1 */}
          </TabItem>
          {/* Add more TabItems as needed */}
        </Tabs>
      </div>

      {/* Scroll buttons */}
      <button id="scrollLeftButton" className="scroll-button" disabled>
        Scroll Left
      </button>
      <button id="scrollRightButton" className="scroll-button">
        Scroll Right
      </button>
    </div>
  );
}

export default CustomTabs;
