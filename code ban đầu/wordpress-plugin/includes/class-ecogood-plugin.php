<?php
/**
 * Main EcoGood Plugin Class
 */

class EcoGood_Plugin {
    
    public function init() {
        add_action('wp_enqueue_scripts', array($this, 'enqueue_assets'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_assets'));
        add_action('admin_menu', array($this, 'add_admin_menu'));
    }

    /**
     * Enqueue frontend assets
     */
    public function enqueue_assets() {
        wp_enqueue_script(
            'ecogood-react-app',
            ECOGOOD_PLUGIN_URL . 'assets/js/react-app.js',
            array(),
            ECOGOOD_PLUGIN_VERSION,
            true
        );

        wp_enqueue_style(
            'ecogood-plugin-styles',
            ECOGOOD_PLUGIN_URL . 'assets/css/plugin-styles.css',
            array(),
            ECOGOOD_PLUGIN_VERSION
        );

        wp_localize_script('ecogood-react-app', 'ecogoodConfig', array(
            'apiUrl' => get_option('ecogood_api_url', 'http://localhost:3000'),
            'siteUrl' => get_site_url(),
            'restUrl' => rest_url(),
        ));
    }

    /**
     * Enqueue admin assets
     */
    public function enqueue_admin_assets($hook) {
        if (strpos($hook, 'ecogood') === false) {
            return;
        }

        wp_enqueue_script(
            'ecogood-admin-app',
            ECOGOOD_PLUGIN_URL . 'assets/js/admin-app.js',
            array(),
            ECOGOOD_PLUGIN_VERSION,
            true
        );

        wp_enqueue_style(
            'ecogood-admin-styles',
            ECOGOOD_PLUGIN_URL . 'assets/css/admin-styles.css',
            array(),
            ECOGOOD_PLUGIN_VERSION
        );
    }

    /**
     * Add admin menu
     */
    public function add_admin_menu() {
        add_menu_page(
            'EcoGood',
            'EcoGood',
            'manage_options',
            'ecogood',
            array($this, 'render_admin_page'),
            'dashicons-leaf',
            25
        );

        add_submenu_page(
            'ecogood',
            'Settings',
            'Settings',
            'manage_options',
            'ecogood-settings',
            array($this, 'render_settings_page')
        );
    }

    /**
     * Render admin page
     */
    public function render_admin_page() {
        echo '<div id="ecogood-admin-root"></div>';
    }

    /**
     * Render settings page
     */
    public function render_settings_page() {
        ?>
        <div class="wrap">
            <h1>EcoGood Settings</h1>
            <form method="post" action="options.php">
                <?php settings_fields('ecogood_settings'); ?>
                <?php do_settings_sections('ecogood_settings'); ?>
                <table class="form-table">
                    <tr>
                        <th scope="row">
                            <label for="ecogood_api_url">API URL</label>
                        </th>
                        <td>
                            <input 
                                type="url" 
                                id="ecogood_api_url" 
                                name="ecogood_api_url" 
                                value="<?php echo esc_attr(get_option('ecogood_api_url')); ?>" 
                                class="regular-text"
                            />
                            <p class="description">Enter your Next.js API URL (e.g., https://api.ecogood.com)</p>
                        </td>
                    </tr>
                </table>
                <?php submit_button(); ?>
            </form>
        </div>
        <?php
    }
}

add_action('admin_init', function() {
    register_setting('ecogood_settings', 'ecogood_api_url');
});
?>
