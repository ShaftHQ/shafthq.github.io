---
id: Clipboard_Actions
title: Clipboard Actions
sidebar_label: Clipboard Actions
description: "Perform clipboard operations — copy, cut, paste, and select all — on web elements using SHAFT Engine's clipboardActions() method."
keywords: [SHAFT, clipboard actions, copy paste, cut, select all, element actions, web automation]
tags: [web, element, actions, clipboard]
---

SHAFT provides first-class clipboard support through the `driver.element().clipboardActions()` method. You can copy, cut, paste, and select all text on any web element using the `ClipboardAction` enum — no raw keyboard shortcuts required.

---

## Available Actions

| `ClipboardAction` | Equivalent Shortcut | Description |
|---|---|---|
| `COPY` | Ctrl/Cmd + C | Copies the selected content to the clipboard |
| `CUT` | Ctrl/Cmd + X | Cuts the selected content to the clipboard |
| `PASTE` | Ctrl/Cmd + V | Pastes clipboard content into the element |
| `SELECT_ALL` | Ctrl/Cmd + A | Selects all content inside the element |

---

## Import

```java title="ClipboardImport.java"
import com.shaft.driver.SHAFT;
import com.shaft.enums.internal.ClipboardAction;
import org.openqa.selenium.By;
```

---

## Basic Usage

### Copy

```java title="CopyExample.java"
// Copy text from a read-only element
driver.element().clipboardActions(By.id("sourceText"), ClipboardAction.COPY);
```

### Paste

```java title="PasteExample.java"
// Paste clipboard content into an input field
driver.element().clipboardActions(By.id("targetInput"), ClipboardAction.PASTE);
```

### Select All

```java title="SelectAllExample.java"
// Select all text inside a text area
driver.element().clipboardActions(By.id("textArea"), ClipboardAction.SELECT_ALL);
```

### Cut

```java title="CutExample.java"
// Cut the selected text from a field
driver.element().clipboardActions(By.id("editField"), ClipboardAction.CUT);
```

---

## Chaining Clipboard Actions

`clipboardActions()` returns the element actions builder, so you can chain multiple clipboard operations fluently:

```java title="ChainedClipboardActions.java"
// Select all, cut, and paste into another field in one chain
driver.element()
    .clipboardActions(By.id("editField"), ClipboardAction.SELECT_ALL)
    .clipboardActions(By.id("editField"), ClipboardAction.CUT)
    .clipboardActions(By.id("newField"), ClipboardAction.PASTE);
```

---

## Common Use Cases

### Copy from One Field and Paste into Another

```java title="CopyPasteWorkflow.java"
// Step 1: Focus and copy a value from a read-only field
driver.element().clipboardActions(By.id("generatedToken"), ClipboardAction.COPY);

// Step 2: Paste it into an input field on the same page
driver.element().clipboardActions(By.id("tokenInput"), ClipboardAction.PASTE);

// Step 3: Verify the paste succeeded
driver.assertThat()
    .element(By.id("tokenInput")).text()
    .isNotEmpty()
    .withCustomReportMessage("Token field must contain the pasted value")
    .perform();
```

### Replace All Content in a Text Area

```java title="ReplaceTextArea.java"
// Select all existing content, then overwrite by typing
driver.element()
    .clipboardActions(By.id("commentBox"), ClipboardAction.SELECT_ALL)
    .clipboardActions(By.id("commentBox"), ClipboardAction.CUT);

// Type the new content
driver.element().type(By.id("commentBox"), "Updated comment text");
```

### Duplicate a Value Across Multiple Fields

```java title="DuplicateValue.java"
// Copy a reference number from the source field
driver.element().clipboardActions(By.id("referenceNumber"), ClipboardAction.COPY);

// Paste into two confirmation fields
driver.element()
    .clipboardActions(By.id("confirmRef1"), ClipboardAction.PASTE)
    .clipboardActions(By.id("confirmRef2"), ClipboardAction.PASTE);
```

### Select All and Overwrite a Pre-filled Field

```java title="OverwritePrefilledField.java"
// Select all pre-filled text and replace it in one chain
driver.element()
    .clipboardActions(By.id("emailField"), ClipboardAction.SELECT_ALL)
    .type(By.id("emailField"), "new-email@example.com");
```

---

## Best Practices

- **Use `SELECT_ALL` before `CUT` or `COPY`** — some browsers require the field to have focus and all content selected before a clipboard operation will capture the correct data.
- **Verify paste results** — after pasting, use `driver.assertThat().element(...).text()` to confirm the clipboard content was pasted correctly.
- **Prefer clipboard actions over `typeAppend()`** for copy-from-read-only scenarios — `clipboardActions()` is the correct API when the source field does not allow direct text extraction.
- **Be aware of OS clipboard scope** — clipboard operations use the OS-level clipboard; running parallel tests on the same machine can cause race conditions. Prefer isolated environments (Docker/Grid) for clipboard-intensive parallel tests.

---

## Related Pages

- [Element Actions](../Element_Actions.md) — Full reference for all element interaction methods.
- [Element Identification](../Element_Identification.md) — How to build robust locators for elements.
