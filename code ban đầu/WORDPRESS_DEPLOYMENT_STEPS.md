# Quick Start: Deploy EcoGood to WordPress

## 5-Minute Setup

### Step 1: Deploy Next.js to Vercel
\`\`\`bash
# Push to GitHub
git push origin main

# Go to vercel.com and import your repository
# Copy your deployment URL (e.g., https://ecogood.vercel.app)
\`\`\`

### Step 2: Install WordPress Plugin
\`\`\`bash
# Copy plugin to WordPress
cp -r wordpress-plugin /path/to/wordpress/wp-content/plugins/ecogood

# Activate in WordPress Admin
# Plugins > Installed Plugins > EcoGood > Activate
\`\`\`

### Step 3: Configure Plugin
1. Go to WordPress Admin
2. Click EcoGood > Settings
3. Paste your Vercel URL
4. Click Save

### Step 4: Add Shortcodes
\`\`\`
[ecogood_products limit="12"]
[ecogood_cart]
[ecogood_hero]
[ecogood_featured]
\`\`\`

## Deployment Platforms

### Vercel (Recommended)
- **Pros**: Free tier, automatic deployments, great Next.js support
- **Cons**: Limited to Vercel infrastructure
- **Cost**: Free for hobby projects, $20+/month for production

### AWS
- **Pros**: Highly scalable, many services
- **Cons**: Complex setup, can be expensive
- **Cost**: Pay-as-you-go

### DigitalOcean
- **Pros**: Simple, affordable, good documentation
- **Cons**: Manual setup required
- **Cost**: $5+/month

### Heroku
- **Pros**: Easy deployment, good for beginners
- **Cons**: Expensive, slower performance
- **Cost**: $7+/month

## WordPress Hosting Options

### Managed WordPress Hosting
- **Kinsta**: $35+/month
- **WP Engine**: $20+/month
- **Bluehost**: $2.95+/month

### Self-Hosted
- **DigitalOcean**: $5+/month
- **Linode**: $5+/month
- **Vultr**: $2.50+/month

## Environment Variables

Create a `.env.local` file in your Next.js project:

\`\`\`
NEXT_PUBLIC_WORDPRESS_URL=https://yoursite.com
NEXT_PUBLIC_API_URL=https://api.ecogood.com
NEON_DATABASE_URL=your-database-url
\`\`\`

## Monitoring & Logging

### Next.js Monitoring
- Use Vercel Analytics
- Set up error tracking with Sentry
- Monitor API performance

### WordPress Monitoring
- Use Query Monitor plugin
- Set up error logging
- Monitor database performance

## Backup Strategy

### Next.js
- GitHub automatically backs up your code
- Use Vercel's backup features

### WordPress
- Use UpdraftPlus for automated backups
- Back up to AWS S3 or Google Drive
- Schedule daily backups

## SSL Certificate

### Vercel
- Automatic SSL certificate (included)

### Self-Hosted
- Use Let's Encrypt (free)
- Use Certbot for automation
- Auto-renewal recommended

## Domain Setup

### Point domain to Vercel
\`\`\`
CNAME: your-domain.com -> cname.vercel-dns.com
\`\`\`

### Point domain to WordPress
\`\`\`
A Record: your-domain.com -> your-server-ip
\`\`\`

## Testing Checklist

- [ ] Next.js API responds to requests
- [ ] WordPress plugin loads without errors
- [ ] Shortcodes display components
- [ ] Products load correctly
- [ ] Cart functionality works
- [ ] Orders can be created
- [ ] Images load properly
- [ ] Styles are applied correctly
- [ ] Mobile responsive
- [ ] Performance is acceptable

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Plugin not loading | Check API URL in settings |
| CORS errors | Enable CORS in Next.js |
| Styles not applying | Clear WordPress cache |
| Slow performance | Enable caching, optimize images |
| Database errors | Check database connection |

## Getting Help

- Check the troubleshooting section in the main guide
- Review Next.js documentation
- Check WordPress plugin documentation
- Contact support at support@ecogood.com
