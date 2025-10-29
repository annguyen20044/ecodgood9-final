<?php
/**
 * EcoGood API Client for communicating with Next.js backend
 */

class EcoGood_API_Client {
    
    private $api_url;

    public function __construct() {
        $this->api_url = get_option('ecogood_api_url', 'http://localhost:3000');
    }

    /**
     * Get products from Next.js API
     */
    public function get_products($args = array()) {
        $url = $this->api_url . '/api/products';
        
        if (!empty($args)) {
            $url = add_query_arg($args, $url);
        }

        $response = wp_remote_get($url);

        if (is_wp_error($response)) {
            return array('error' => $response->get_error_message());
        }

        $body = wp_remote_retrieve_body($response);
        return json_decode($body, true);
    }

    /**
     * Get orders from Next.js API
     */
    public function get_orders($args = array()) {
        $url = $this->api_url . '/api/orders';
        
        if (!empty($args)) {
            $url = add_query_arg($args, $url);
        }

        $response = wp_remote_get($url);

        if (is_wp_error($response)) {
            return array('error' => $response->get_error_message());
        }

        $body = wp_remote_retrieve_body($response);
        return json_decode($body, true);
    }

    /**
     * Create order via Next.js API
     */
    public function create_order($order_data) {
        $url = $this->api_url . '/api/orders/create';

        $response = wp_remote_post($url, array(
            'headers' => array('Content-Type' => 'application/json'),
            'body' => json_encode($order_data),
        ));

        if (is_wp_error($response)) {
            return array('error' => $response->get_error_message());
        }

        $body = wp_remote_retrieve_body($response);
        return json_decode($body, true);
    }

    /**
     * Upload file via Next.js API
     */
    public function upload_file($file) {
        $url = $this->api_url . '/api/upload';

        $response = wp_remote_post($url, array(
            'body' => array('file' => $file),
        ));

        if (is_wp_error($response)) {
            return array('error' => $response->get_error_message());
        }

        $body = wp_remote_retrieve_body($response);
        return json_decode($body, true);
    }
}
?>
