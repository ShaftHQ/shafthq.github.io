/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  // tutorialSidebar: [{type: 'autogenerated', dirName: '.'}],

  // But you can create a sidebar manually
  /*
  tutorialSidebar: [
    'intro',
    'hello',
    {
      type: 'category',
      label: 'Tutorial',
      items: ['tutorial-basics/create-a-document'],
    },
  ],
   */
  docs: [
    {
      type: 'category',
      label: 'Getting Started',
      collapsible: true,
      collapsed: true,
      items: [
        "Getting_Started/first_steps",
        "Getting_Started/first_steps_2",
        "Getting_Started/first_steps_3",
        "Getting_Started/first_steps_4",
        "Getting_Started/first_steps_5",
        {
          type: 'link',
          label: 'Quick Start Guide', // The link label
          href: 'https://github.com/shafthq/SHAFT_ENGINE?tab=readme-ov-file#-quick-start-guide', // The external URL
        },
      ],
    },
    {
      type: 'category',
      label: 'Properties',
      collapsible: true,
      collapsed: false,
      items: [
        "Properties/PropertyTypes",
        "Properties/PropertiesList",
      ],
    },
    {
      type: 'category',
      label: 'Actions',
      collapsible: true,
      collapsed: false,
      items: [
        {
          type: 'category',
          label: 'GUI',
          items: [
            "Keywords/GUI/Browser_Actions",
            "Keywords/GUI/Element_Actions",
            "Keywords/GUI/Element_Validations",
            "Keywords/GUI/Touch_Actions",
            {
	    type: 'category',
            label: 'Did You Know',
            collapsible: true,
            collapsed: false,
            items: [
		        "Keywords/GUI/didYouKnow/Native_selenium_Webdriver",
		        "Keywords/GUI/didYouKnow/Custom_Capabilities",
			"Keywords/GUI/didYouKnow/Shaft_Locator_Builder",
		        "Keywords/GUI/didYouKnow/Shadow_Dom_Locator_Builder",
			]
			}
          ],
        },
        {
          type: 'category',
          label: 'API',
          items: [
            "Keywords/API/Request_Builder",
            "Keywords/API/Response_Getters",
            "Keywords/API/Response_Validations",
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Validations',
      collapsible: true,
      collapsed: true,
      items: [
        "Keywords/Validations/Overview",
        "Keywords/Validations/Browser",
        "Keywords/Validations/Elements",
        "Keywords/Validations/Response",
        "Keywords/Validations/Files",
        "Keywords/Validations/Objects",
        "Keywords/Validations/Nums",
        "Keywords/Validations/ForceFail",
      ],
    },
  ],
};

module.exports = sidebars;