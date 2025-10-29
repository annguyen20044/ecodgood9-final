# EcoGood WordPress Integration Guide

This guide explains how to deploy your EcoGood Next.js application alongside a WordPress plugin for optimal integration.

## Architecture Overview

The EcoGood WordPress integration uses a **Headless Next.js + WordPress Plugin** architecture:

- **Next.js Backend**: Serves as the API and component provider
- **WordPress**: Acts as the content management system and frontend
- **WordPress Plugin**: Bridges WordPress and Next.js through REST API calls

## Prerequisites

- Node.js 18+ and npm/pnpm
- WordPress 5.0+ with PHP 7.4+
- A domain or local development environment
- Basic knowledge of WordPress and Next.js

## Part 1: Deploy Next.js Backend

### Option A: Deploy to Vercel (Recommended)

1. **Push your code to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Add WordPress integration"
   git push origin main
   \`\`\`

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables if needed
   - Click "Deploy"

3. **Get your API URL**
   - Your API will be available at: `https://your-project.vercel.app`
   - Note this URL for WordPress configuration

### Option B: Deploy to Your Own Server

1. **Build the Next.js app**
   \`\`\`bash
   npm run build
   \`\`\`

2. **Start the production server**
   \`\`\`bash
   npm start
   \`\`\`

3. **Use a reverse proxy (Nginx/Apache)**
   \`\`\`nginx
   server {
       listen 80;
       server_name api.ecogood.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   \`\`\`

## Part 2: Install WordPress Plugin

### Step 1: Prepare the Plugin

1. **Copy the plugin folder**
   \`\`\`bash
   cp -r wordpress-plugin /path/to/wordpress/wp-content/plugins/ecogood
   \`\`\`

2. **Set proper permissions**
   \`\`\`bash
   chmod -R 755 /path/to/wordpress/wp-content/plugins/ecogood
   \`\`\`

### Step 2: Activate the Plugin

1. **Log in to WordPress Admin**
   - Go to `yoursite.com/wp-admin`
   - Navigate to Plugins > Installed Plugins
   - Find "EcoGood - React Components"
   - Click "Activate"

### Step 3: Configure the Plugin

1. **Go to EcoGood Settings**
   - In WordPress Admin, click EcoGood > Settings
   - Enter your Next.js API URL (e.g., `https://your-project.vercel.app`)
   - Click "Save Changes"

2. **Test the connection**
   - The plugin will automatically test the connection
   - You should see a success message

## Part 3: Use Shortcodes

Add components to your WordPress pages using shortcodes:

### Display Products
\`\`\`
[ecogood_products limit="12" category="coffee"]
\`\`\`

### Display Shopping Cart
\`\`\`
[ecogood_cart]
\`\`\`

### Display Hero Section
\`\`\`
[ecogood_hero]
\`\`\`

### Display Featured Products
\`\`\`
[ecogood_featured]
\`\`\`

## Part 4: Customize Styles

### Option A: WordPress Customizer

1. Go to Appearance > Customize
2. Add custom CSS in the "Additional CSS" section
3. Override EcoGood styles:
   \`\`\`css
   :root {
       --ecogood-primary: #your-color;
       --ecogood-secondary: #your-color;
   }
   \`\`\`

### Option B: Edit Plugin CSS

Edit `wordpress-plugin/assets/css/plugin-styles.css` directly and redeploy.

## Part 5: Sync Data Between Platforms

### Automatic Sync

The plugin automatically syncs data through REST API calls:

- Products are fetched from Next.js API
- Orders are created in Next.js database
- Cart data is managed by Next.js

### Manual Sync

Use WordPress REST API endpoints:

\`\`\`bash
# Get products
curl https://yoursite.com/wp-json/ecogood/v1/products

# Get orders
curl https://yoursite.com/wp-json/ecogood/v1/orders
\`\`\`

## Deployment Checklist

- [ ] Next.js app deployed to Vercel or your server
- [ ] API URL is accessible and working
- [ ] WordPress plugin installed and activated
- [ ] Plugin configured with correct API URL
- [ ] Shortcodes added to pages
- [ ] Styles customized to match your brand
- [ ] SSL certificate installed (HTTPS)
- [ ] Database backups configured
- [ ] Monitoring and logging set up

## Troubleshooting

### Plugin not loading components

1. Check API URL in EcoGood Settings
2. Verify Next.js server is running
3. Check browser console for errors
4. Ensure CORS is enabled on Next.js API

### Styles not applying

1. Clear WordPress cache
2. Check CSS file permissions
3. Verify Tailwind CSS is properly configured
4. Check for CSS conflicts with theme

### Data not syncing

1. Verify API endpoints are working
2. Check WordPress error logs
3. Ensure database connections are active
4. Review Next.js server logs

## Advanced Configuration

### Custom API Endpoints

Edit `wordpress-plugin/includes/class-ecogood-api-client.php` to add custom endpoints:

\`\`\`php
public function get_custom_data($endpoint) {
    $url = $this->api_url . '/api/' . $endpoint;
    $response = wp_remote_get($url);
    return json_decode(wp_remote_retrieve_body($response), true);
}
\`\`\`

### Environment Variables

Set environment variables in your Next.js deployment:

\`\`\`
NEXT_PUBLIC_WORDPRESS_URL=https://yoursite.com
WORDPRESS_API_KEY=your-secret-key
\`\`\`

## Support & Resources

- Next.js Documentation: https://nextjs.org/docs
- WordPress Plugin Development: https://developer.wordpress.org/plugins/
- EcoGood GitHub: https://github.com/ecogood/ecogood
- Community Forum: https://community.ecogood.com

## Security Best Practices

1. **Use HTTPS** for all API calls
2. **Validate input** on both Next.js and WordPress
3. **Use API keys** for sensitive endpoints
4. **Keep plugins updated** regularly
5. **Implement rate limiting** on API endpoints
6. **Use WordPress security plugins** (Wordfence, Sucuri)
7. **Regular backups** of both databases

## Performance Optimization

1. **Enable caching** on WordPress
2. **Use CDN** for static assets
3. **Optimize images** before upload
4. **Implement lazy loading** for products
5. **Use database indexing** for queries
6. **Monitor API response times**

## Next Steps

1. Customize the plugin for your specific needs
2. Add additional shortcodes for custom components
3. Integrate with WooCommerce if needed
4. Set up automated backups
5. Configure monitoring and alerts
