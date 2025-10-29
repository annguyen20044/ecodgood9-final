<?php
/**
 * Admin Pages for EcoGood
 */

add_action('rest_api_init', function() {
    register_rest_route('ecogood/v1', '/products', array(
        'methods' => 'GET',
        'callback' => function() {
            $client = new EcoGood_API_Client();
            return $client->get_products();
        },
        'permission_callback' => function() {
            return current_user_can('manage_options');
        },
    ));

    register_rest_route('ecogood/v1', '/orders', array(
        'methods' => 'GET',
        'callback' => function() {
            $client = new EcoGood_API_Client();
            return $client->get_orders();
        },
        'permission_callback' => function() {
            return current_user_can('manage_options');
        },
    ));
});
?>
