# Custom Properties Generator

Generate SHAFT Engine properties files from a searchable catalog of supported properties, defaults, possible values, and descriptions.

Canonical HTML: https://shafthq.github.io/docs/reference/properties/custom-properties-generator
Guide index: https://shafthq.github.io/llms.txt

:::tip
This generator is also embedded as the **Config Generator** tab on the [Complete Properties Reference](/docs/reference/properties/PropertiesList?PropertyTypes=generator) page, right next to the property tables it builds from — that's the best place to reach it while you're already reading about a specific property. This standalone page stays as a direct link/bookmark to the same tool.
:::

Use this generator to choose SHAFT properties, edit their values, and download the matching `.properties` files.

Save generated files under `src/main/resources/properties/` in your test project. SHAFT reads every `.properties` file in that folder during startup.

For example, a generated web configuration can include:

```properties title="src/main/resources/properties/custom.properties"
targetBrowserName=chrome
headlessExecution=true
createAnimatedGif=false
```

## Related

- [Property types](/docs/reference/properties/PropertyTypes)
- [Properties reference](/docs/reference/properties/PropertiesList)
- [Common configuration examples](/docs/reference/properties/CommonExamples)
