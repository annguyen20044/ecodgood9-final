<?php
/**
 * EcoGood Shortcodes
 */

add_shortcode('ecogood_products', function($atts) {
    $atts = shortcode_atts(array(
        'limit' => 12,
        'category' => '',
    ), $atts);

    ob_start();
    ?>
    <div id="ecogood-products-root" data-limit="<?php echo esc_attr($atts['limit']); ?>" data-category="<?php echo esc_attr($atts['category']); ?>"></div>
    <?php
    return ob_get_clean();
});

add_shortcode('ecogood_cart', function($atts) {
    ob_start();
    ?>
    <div id="ecogood-cart-root"></div>
    <?php
    return ob_get_clean();
});

add_shortcode('ecogood_hero', function($atts) {
    ob_start();
    ?>
    <div id="ecogood-hero-root"></div>
    <?php
    return ob_get_clean();
});

add_shortcode('ecogood_featured', function($atts) {
    ob_start();
    ?>
    <div id="ecogood-featured-root"></div>
    <?php
    return ob_get_clean();
});
?>
