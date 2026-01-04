---
id: Element_Identification
title: Element Identification
sidebar_label: Element Identification
---

## Overview

Element identification is the foundation of GUI test automation. This guide covers all the methods available in SHAFT Engine to locate and interact with web elements, including traditional locators, the SHAFT Locator Builder, relative locators, shadow DOM elements, and elements within iframes.

## Supported Locator Types

SHAFT Engine supports all standard Selenium locator strategies through the `By` class:

### 1. ID

Locates elements by their unique `id` attribute - the most reliable and fastest method when available.

```java
By elementLocator = By.id("username");
```

### 2. Name

Locates elements by their `name` attribute, commonly used for form fields.

```java
By elementLocator = By.name("email");
```

### 3. Class Name

Locates elements by their CSS class name.

```java
By elementLocator = By.className("btn-primary");
```

### 4. Tag Name

Locates elements by their HTML tag name (e.g., `button`, `input`, `div`).

```java
By elementLocator = By.tagName("button");
```

### 5. CSS Selector

Locates elements using CSS selector syntax - powerful and flexible.

```java
By elementLocator = By.cssSelector(".form-control[type='text']");
By elementLocator = By.cssSelector("#login-form > input.username");
```

### 6. XPath

Locates elements using XPath expressions - very powerful but can be slower than CSS selectors.

```java
By elementLocator = By.xpath("//input[@id='username']");
By elementLocator = By.xpath("//button[contains(text(),'Submit')]");
```

### 7. Link Text

Locates anchor (`<a>`) elements by their exact text content.

```java
By elementLocator = By.linkText("Click Here");
```

### 8. Partial Link Text

Locates anchor elements by partial text match.

```java
By elementLocator = By.partialLinkText("Click");
```

## Traditional Locators vs. SHAFT Locator Builder

SHAFT Engine provides a fluent API for building locators that's more readable and maintainable than traditional approaches.

### Example 1: Simple Button

**HTML:**
```html
<button id="submit-btn" class="btn-primary" data-test="submit">Submit</button>
```

**Native Selenium Approach:**
```java
// Using ID
By button = By.id("submit-btn");

// Using CSS Selector
By button = By.cssSelector("button[data-test='submit']");

// Using XPath
By button = By.xpath("//button[@data-test='submit']");
```

**SHAFT Locator Builder Approach:**
```java
// More readable and self-documenting
By button = SHAFT.GUI.Locator.hasTagName("button")
    .hasAttribute("data-test", "submit")
    .build();

// Or using ID
By button = SHAFT.GUI.Locator.hasId("submit-btn").build();
```

### Example 2: Complex Element

**HTML:**
```html
<div class="card product-card">
    <span class="price" data-currency="USD">$99.99</span>
</div>
```

**Native Selenium Approach:**
```java
By priceElement = By.cssSelector(".product-card .price[data-currency='USD']");
By priceElement = By.xpath("//div[contains(@class,'product-card')]//span[@data-currency='USD']");
```

**SHAFT Locator Builder Approach:**
```java
By priceElement = SHAFT.GUI.Locator.hasTagName("span")
    .containsClass("price")
    .hasAttribute("data-currency", "USD")
    .build();
```

### Example 3: Element with Text

**HTML:**
```html
<button class="action-button">Add to Cart</button>
```

**Native Selenium Approach:**
```java
By button = By.xpath("//button[contains(text(),'Add to Cart')]");
By button = By.cssSelector("button.action-button"); // Can't filter by text with CSS
```

**SHAFT Locator Builder Approach:**
```java
By button = SHAFT.GUI.Locator.hasTagName("button")
    .containsText("Add to Cart")
    .build();
```

## SHAFT Locator Builder Methods

The SHAFT Locator Builder provides a fluent API with the following methods:

### Tag-Based Methods
```java
// Exact tag name
SHAFT.GUI.Locator.hasTagName("button").build();

// Any tag name (when you want to filter by other attributes)
SHAFT.GUI.Locator.hasAnyTagName().hasAttribute("data-test", "submit").build();
```

### Attribute-Based Methods
```java
// Element with specific attribute
SHAFT.GUI.Locator.hasAttribute("data-test").build();

// Element with attribute and value
SHAFT.GUI.Locator.hasAttribute("data-test", "add-to-cart").build();

// Element with ID
SHAFT.GUI.Locator.hasId("username").build();

// Element containing a class
SHAFT.GUI.Locator.containsClass("btn-primary").build();
```

### Text-Based Methods
```java
// Element containing specific text
SHAFT.GUI.Locator.containsText("Submit").build();

// Element containing ID substring
SHAFT.GUI.Locator.containsId("user").build();
```

### Chaining Methods
```java
// Combine multiple conditions
By complexLocator = SHAFT.GUI.Locator.hasTagName("input")
    .hasAttribute("type", "text")
    .containsClass("form-control")
    .containsId("user")
    .build();
```

## Relative (Location-Based) Locators

Selenium 4 introduced relative locators that allow you to locate elements based on their position relative to other elements. SHAFT Engine fully supports these.

### Available Relative Locator Methods

- `above()` - Locates elements above the reference element
- `below()` - Locates elements below the reference element
- `toLeftOf()` - Locates elements to the left of the reference element
- `toRightOf()` - Locates elements to the right of the reference element
- `near()` - Locates elements near (within approximately 50 pixels) of the reference element

### Example: Login Form

**HTML:**
```html
<form>
    <label>Username:</label>
    <input id="username" type="text">
    
    <label>Password:</label>
    <input id="password" type="password">
    
    <button>Login</button>
</form>
```

**Using Relative Locators:**
```java
import static org.openqa.selenium.support.locators.RelativeLocator.with;

// Locate password field relative to username field
By usernameField = By.id("username");
By passwordField = with(By.tagName("input")).below(usernameField);

// Locate the login button below password field
By loginButton = with(By.tagName("button")).below(passwordField);

// Locate label to the left of username field
By usernameLabel = with(By.tagName("label")).toLeftOf(usernameField);
```

### Example: Product Grid

**HTML:**
```html
<div class="grid">
    <div class="product" id="product-1">Product 1</div>
    <div class="product" id="product-2">Product 2</div>
    <div class="product" id="product-3">Product 3</div>
</div>
```

**Using Relative Locators:**
```java
// Locate product-2 relative to product-1
By product1 = By.id("product-1");
By product2 = with(By.className("product")).toRightOf(product1);

// Locate product near product-1 (within ~50px)
By nearbyProduct = with(By.className("product")).near(product1);
```

### Combining Relative Locators

You can chain multiple relative locator conditions:

```java
By referenceElement = By.id("reference");
By targetElement = with(By.tagName("input"))
    .below(referenceElement)
    .toRightOf(By.id("another-reference"));
```

### Using Relative Locators with SHAFT

```java
driver = new SHAFT.GUI.WebDriver();
driver.browser().navigateToURL("https://example.com");

// Define reference element
By referenceElement = By.id("username");

// Use relative locator
By relativeElement = with(By.tagName("input")).below(referenceElement);

// Interact with the element
driver.element().type(relativeElement, "test@example.com");
```

## Interacting with Shadow DOM

Shadow DOM encapsulates parts of a web component's DOM tree. SHAFT Locator Builder provides special support for locating elements within shadow DOM.

### What is Shadow DOM?

Shadow DOM allows developers to attach a hidden, separate DOM tree to an element. Elements within the shadow DOM are not accessible through normal DOM traversal methods.

### Locating Shadow DOM Elements

**Example:**

```html
<shop-app>
  #shadow-root
    <header>
      <a href="/list/mens_outerwear">Men's Outerwear</a>
    </header>
</shop-app>
```

**Native Selenium Approach:**
```java
// Requires JavaScript execution
WebElement shadowHost = driver.findElement(By.tagName("shop-app"));
WebElement shadowRoot = (WebElement) ((JavascriptExecutor) driver)
    .executeScript("return arguments[0].shadowRoot", shadowHost);
WebElement link = shadowRoot.findElement(By.cssSelector("a[href='/list/mens_outerwear']"));
```

**SHAFT Locator Builder Approach:**
```java
driver = new SHAFT.GUI.WebDriver();
driver.browser().navigateToURL("https://shop.polymer-project.org/");

// Define the shadow host
By shadowHost = SHAFT.GUI.Locator.hasTagName("shop-app").build();

// Locate element inside shadow DOM
By shadowElement = SHAFT.GUI.Locator.hasTagName("a")
    .hasAttribute("href", "/list/mens_outerwear")
    .insideShadowDom(shadowHost)
    .build();

// Interact with the element
driver.element().click(shadowElement);
```

### Nested Shadow DOM

For deeply nested shadow DOM structures:

```java
// First shadow host
By shadowHost1 = SHAFT.GUI.Locator.hasTagName("outer-component").build();

// Second shadow host inside the first shadow DOM
By shadowHost2 = SHAFT.GUI.Locator.hasTagName("inner-component")
    .insideShadowDom(shadowHost1)
    .build();

// Target element inside the nested shadow DOM
By targetElement = SHAFT.GUI.Locator.hasTagName("button")
    .hasAttribute("id", "submit")
    .insideShadowDom(shadowHost2)
    .build();

driver.element().click(targetElement);
```

### Complete Shadow DOM Example

```java
public class ShadowDomTest {
    SHAFT.GUI.WebDriver driver;

    @Test
    public void testShadowDomElements() {
        driver = new SHAFT.GUI.WebDriver();
        driver.browser().navigateToURL("https://shop.polymer-project.org/");
        
        // Locate shadow host
        By shadowHost = SHAFT.GUI.Locator.hasTagName("shop-app").build();
        
        // Locate element inside shadow DOM
        By menuLink = SHAFT.GUI.Locator.hasTagName("a")
            .containsText("Men's Outerwear")
            .insideShadowDom(shadowHost)
            .build();
        
        // Click the element
        driver.element().click(menuLink);
        
        // Verify navigation
        driver.browser().assertThat().url().contains("/list/mens_outerwear");
        
        driver.quit();
    }
}
```

For more examples, visit [ShadowDomTest](https://github.com/ShaftHQ/SHAFT_ENGINE/blob/main/src/test/java/testPackage/locator/ShadowDomTest.java) on GitHub.

## Interacting with IFrames

IFrames (Inline Frames) are HTML elements that embed another HTML page within the current page. To interact with elements inside an iframe, you must first switch the driver's focus to that iframe.

### Basic IFrame Handling

**Switching to an IFrame:**
```java
By iframeLocator = By.id("iframe-id");
driver.element().switchToIframe(iframeLocator);
```

**Switching Back to Main Content:**
```java
driver.element().switchToDefaultContent();
```

### Example: Text Editor in IFrame

**HTML:**
```html
<iframe id="mce_0_ifr">
    <body>
        <p id="tinymce">Editable content</p>
    </body>
</iframe>
```

**Native Selenium Approach:**
```java
WebDriver driver = new ChromeDriver();
driver.get("https://the-internet.herokuapp.com/tinymce");

// Switch to iframe
WebElement iframe = driver.findElement(By.id("mce_0_ifr"));
driver.switchTo().frame(iframe);

// Interact with element inside iframe
WebElement textField = driver.findElement(By.id("tinymce"));
textField.clear();
textField.sendKeys("New text");

// Switch back to main content
driver.switchTo().defaultContent();
```

**SHAFT Approach:**
```java
driver = new SHAFT.GUI.WebDriver();
driver.browser().navigateToURL("https://the-internet.herokuapp.com/tinymce");

// Locate the iframe
By textIframe = By.id("mce_0_ifr");
By textField = By.id("tinymce");

// Switch focus to iframe
driver.element().switchToIframe(textIframe);

// Interact with elements inside the iframe
driver.element().typeAppend(textField, "This text is added");
driver.element().clipboardActions(textField, "select all");
driver.element().clipboardActions(textField, "copy");

// Switch back to default content
driver.element().switchToDefaultContent();
```

### Nested IFrames

For nested iframes, switch to each iframe sequentially:

```java
// Switch to outer iframe
By outerIframe = By.id("outer-iframe");
driver.element().switchToIframe(outerIframe);

// Switch to inner iframe
By innerIframe = By.id("inner-iframe");
driver.element().switchToIframe(innerIframe);

// Interact with element in nested iframe
By targetElement = By.id("target");
driver.element().click(targetElement);

// Switch back to default content (exits all iframes)
driver.element().switchToDefaultContent();
```

### IFrame Switching by Index

You can also switch to an iframe by its index (zero-based):

```java
// Switch to the first iframe on the page
driver.element().switchToIframe(By.xpath("(//iframe)[1]"));
```

### Complete IFrame Example

```java
public class IFrameTest {
    SHAFT.GUI.WebDriver driver;

    @Test
    public void testIFrameInteraction() {
        driver = new SHAFT.GUI.WebDriver();
        driver.browser().navigateToURL("https://the-internet.herokuapp.com/tinymce");
        
        // Define locators
        By textIframe = By.id("mce_0_ifr");
        By textField = By.id("tinymce");
        
        // Switch to iframe
        driver.element().switchToIframe(textIframe);
        
        // Get current text
        String originalText = driver.element().getText(textField);
        System.out.println("Original text: " + originalText);
        
        // Modify text
        driver.element().type(textField, "New content added by SHAFT");
        
        // Verify the change
        String newText = driver.element().getText(textField);
        System.out.println("New text: " + newText);
        
        // Switch back to main content
        driver.element().switchToDefaultContent();
        
        driver.quit();
    }
}
```

### IFrame Best Practices

1. **Always switch back to default content** when done interacting with iframe elements
2. **Use explicit locators** for iframes rather than relying on index-based switching when possible
3. **Handle iframe loading** by ensuring the iframe is present before switching
4. **Be aware of nested iframes** - you need to switch through each level
5. **Consider using unique IDs** for iframes when you control the HTML

## Combining Techniques

You can combine different element identification techniques for complex scenarios:

### Example: Element in IFrame with SHAFT Locator Builder

```java
By iframeLocator = SHAFT.GUI.Locator.hasTagName("iframe")
    .hasAttribute("id", "content-frame")
    .build();

driver.element().switchToIframe(iframeLocator);

By buttonInIframe = SHAFT.GUI.Locator.hasTagName("button")
    .containsText("Submit")
    .hasAttribute("data-test", "submit-btn")
    .build();

driver.element().click(buttonInIframe);
driver.element().switchToDefaultContent();
```

### Example: Relative Locator for Element in Shadow DOM

```java
By shadowHost = SHAFT.GUI.Locator.hasTagName("custom-component").build();
By referenceElement = SHAFT.GUI.Locator.hasId("reference")
    .insideShadowDom(shadowHost)
    .build();

// Use relative locator for element below the reference
By targetElement = with(By.tagName("input")).below(referenceElement);
driver.element().type(targetElement, "value");
```

## Best Practices

1. **Prefer ID locators** when available - they're the fastest and most reliable
2. **Use SHAFT Locator Builder** for complex locators - it's more readable and maintainable
3. **Avoid XPath when possible** - CSS selectors are generally faster
4. **Use relative locators** for dynamic layouts where absolute positions might change
5. **Keep locators simple** - complex locators are fragile and hard to maintain
6. **Use data attributes** (e.g., `data-test`) specifically for testing when you control the HTML
7. **Document complex locators** - add comments explaining why a particular strategy was chosen
8. **Test locators in isolation** - verify your locators work before building tests around them

## Additional Resources

- [SHAFT Locator Builder Examples](https://github.com/ShaftHQ/SHAFT_ENGINE/blob/main/src/test/java/testPackage/locator/LocatorBuilderTest.java)
- [Shadow DOM Examples](https://github.com/ShaftHQ/SHAFT_ENGINE/blob/main/src/test/java/testPackage/locator/ShadowDomTest.java)
- [Selenium By Methods Documentation](https://www.selenium.dev/selenium/docs/api/java/org/openqa/selenium/By.html)
- [W3C WebDriver Specification](https://www.w3.org/TR/webdriver/)
