---
id: basicConfig3
title: Basic configuration for API
sidebar_label: API
---

- Here are some basic properties you should think about including in your `custom.properties` file:
```properties showLineNumbers title="src/main/resources/properties/custom.properties"
# configuring your proxy settings is essential if you are sitting behind a corporate proxy server,
# no need to include this property if you're not
com.SHAFT.proxySettings=host:port

# you can configure SHAFT to automatically retry failed tests by setting this property
retryMaximumNumberOfAttempts=3

# you can disable the built-in response success check
automaticallyAssertResponseStatusCode=false

# you can also configure the following timeouts (in seconds)
apiSocketTimeout=30		
apiConnectionTimeout=30		
apiConnectionManagerTimeout=30
```
---

## Swagger / OpenAPI Contract Validation

You can enable automatic schema validation of API requests and responses using a Swagger/OpenAPI specification file.

SHAFT uses the `OpenApiValidationFilter` to ensure that your API communication complies with the defined contract.

```properties showLineNumbers title="src/main/resources/properties/custom.properties"
# Enables/disables Swagger schema validation feature
swagger.validation.enabled=true

# Path or URL to your Swagger/OpenAPI schema file
swagger.validation.url=https://petstore.swagger.io/v2/swagger.json
```

:::tip[**Tip**]
    You can learn more about the different **[property types]** and the **[full list of supported properties]** by visiting the related pages.
:::


[property types]: <../Properties/PropertyTypes>
[full list of supported properties]: <../Properties/PropertiesList>