=== EcoGood - React Components ===
Contributors: ecogood
Tags: react, components, ecommerce, products, orders
Requires at least: 5.0
Tested up to: 6.4
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPL v2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Integrates EcoGood React components with WordPress, allowing you to display products, cart, and other components from your Next.js backend.

== Description ==

EcoGood is a WordPress plugin that seamlessly integrates React components from your Next.js backend into WordPress. It provides:

* Product display with filtering and sorting
* Shopping cart functionality
* Order management
* Admin dashboard for managing products and orders
* Shortcodes for easy component insertion
* REST API endpoints for data synchronization

== Installation ==

1. Upload the `ecogood` folder to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Go to EcoGood > Settings and enter your Next.js API URL
4. Use shortcodes to display components on your pages

== Usage ==

Use the following shortcodes to display components:

* `[ecogood_products limit="12" category=""]` - Display products
* `[ecogood_cart]` - Display shopping cart
* `[ecogood_hero]` - Display hero section
* `[ecogood_featured]` - Display featured products

== Frequently Asked Questions ==

= What is the Next.js API URL? =

The Next.js API URL is the base URL of your Next.js application (e.g., https://api.ecogood.com or http://localhost:3000).

= Can I customize the component styles? =

Yes, you can override the CSS in your WordPress theme's custom CSS or by modifying the plugin-styles.css file.

= How do I sync data between WordPress and Next.js? =

The plugin automatically syncs data through the Next.js API. Make sure your API endpoints are properly configured.

== Changelog ==

= 1.0.0 =
* Initial release

== Support ==

For support, please visit https://ecogood.com or contact support@ecogood.com
