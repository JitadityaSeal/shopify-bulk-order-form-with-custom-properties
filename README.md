## Shopify bulk order form with custom properties

Follow the steps below to add a bulk order form on product page and to create a dedicated bulk order page.

* Create a new snippet called **bulk-order-form** and paste the content of bulk-order-form.liquid in it.
* Create a new snippet called **bulk-order-product-item** and paste the content of bulk-order-product-item.liquid in it.
* Create a new asset file called **bulk-order-form.css** and paste the content of bulk-order-form.css in it.
* Create a new asset file called **bulk-order-form.js** and paste the content of bulk-order-form.js in it.
* Add the content of settings_schema.json file to your theme's **settings_schema.json** file.
* Create a new section called **cart-summary** and paste the content of cart-summary.liquid in it.
* Add your custom property options in theme settings (i.e. under **Theme settings** -> **BULK ORDER SETTINGS** -> **Custom Properties**).

### Steps to create a bulk order page

* Create a new **page template** called **page.bulk-order.json** and paste the content of page.bulk-order.json in it.
* Create a new section called **main-page-bulk-order** and paste the content of main-page-bulk-order.liquid in it.
* Customize the style to match your theme.
* Create a new collection with your bulk order products and choose this collection in theme settings (i.e. under **Theme settings** -> **BULK ORDER SETTINGS** -> **Bulk Order Page Settings**).
* Create a new page using the newly added **bulk-order** template.


### Steps to add bulk order form on product page

* Add `{% render 'bulk-order-form', product: product %}` inside your product template where you want to place the **bulk order form**.
* Customize the style to match your theme.