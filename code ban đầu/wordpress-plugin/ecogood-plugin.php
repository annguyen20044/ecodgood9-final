<?php
/**
 * Plugin Name: EcoGood - React Components
 * Plugin URI: https://ecogood.com
 * Description: Integrates EcoGood React components with WordPress
 * Version: 1.0.0
 * Author: EcoGood Team
 * Author URI: https://ecogood.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: ecogood
 * Domain Path: /languages
 */

if (!defined('ABSPATH')) {
    exit;
}

define('ECOGOOD_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('ECOGOOD_PLUGIN_URL', plugin_dir_url(__FILE__));
define('ECOGOOD_PLUGIN_VERSION', '1.0.0');

require_once ECOGOOD_PLUGIN_DIR . 'includes/class-ecogood-plugin.php';
require_once ECOGOOD_PLUGIN_DIR . 'includes/class-ecogood-api-client.php';
require_once ECOGOOD_PLUGIN_DIR . 'includes/shortcodes.php';
require_once ECOGOOD_PLUGIN_DIR . 'includes/admin-pages.php';

function ecogood_init() {
    $plugin = new EcoGood_Plugin();
    $plugin->init();
}
add_action('plugins_loaded', 'ecogood_init');

register_activation_hook(__FILE__, function() {
    update_option('ecogood_api_url', get_option('ecogood_api_url', 'http://localhost:3000'));
    update_option('ecogood_plugin_version', ECOGOOD_PLUGIN_VERSION);
});

register_deactivation_hook(__FILE__, function() {
    // Cleanup if needed
});
?>
