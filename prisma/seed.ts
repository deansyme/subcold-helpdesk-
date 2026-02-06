import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create default admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@subcold.com' },
    update: {},
    create: {
      email: 'admin@subcold.com',
      name: 'Admin',
      password: hashedPassword,
    },
  })

  console.log('Created admin user:', admin.email)

  // Create site settings
  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      siteName: 'Subcold Support',
      heroTitle: 'HOW CAN WE HELP?',
      heroSubtitle: 'Find answers to your questions about Subcold products and services',
      contactFormEmbed: '',
      footerText: '© 2026 Subcold Ltd. All rights reserved.',
    },
  })

  // Create categories
  const categories = [
    {
      name: 'Orders & Delivery',
      slug: 'orders-delivery',
      description: 'Track orders, delivery times, and shipping information',
      icon: 'Package',
      order: 1,
    },
    {
      name: 'Returns & Refunds',
      slug: 'returns-refunds',
      description: 'How to return items and get refunds',
      icon: 'RotateCcw',
      order: 2,
    },
    {
      name: 'Payments & Promotions',
      slug: 'payments-promotions',
      description: 'Payment methods, discounts, and promotional offers',
      icon: 'CreditCard',
      order: 3,
    },
    {
      name: 'Technical',
      slug: 'technical',
      description: 'Product setup, troubleshooting, and technical support',
      icon: 'Settings',
      order: 4,
    },
    {
      name: 'Product',
      slug: 'product',
      description: 'Product information, specifications, and sizing',
      icon: 'Box',
      order: 5,
    },
    {
      name: 'General Information',
      slug: 'general-information',
      description: 'Company information and general enquiries',
      icon: 'Info',
      order: 6,
    },
  ]

  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    })
    console.log('Created category:', created.name)
  }

  // Get category IDs for articles
  const ordersCategory = await prisma.category.findUnique({ where: { slug: 'orders-delivery' } })
  const returnsCategory = await prisma.category.findUnique({ where: { slug: 'returns-refunds' } })
  const technicalCategory = await prisma.category.findUnique({ where: { slug: 'technical' } })
  const productCategory = await prisma.category.findUnique({ where: { slug: 'product' } })

  // Create sample articles
  const articles = [
    {
      title: 'Delivery Information',
      slug: 'delivery-information',
      content: `<h2>UK Delivery</h2>
<p>We offer <strong>FREE delivery</strong> on all orders within the UK mainland. Orders placed before 2PM on a working day are dispatched the same day.</p>

<h3>Delivery Times</h3>
<ul>
<li><strong>Standard Delivery:</strong> 2-3 working days</li>
<li><strong>Next Day Delivery:</strong> Order before 2PM for next working day delivery</li>
<li><strong>Weekend Delivery:</strong> Available for selected areas</li>
</ul>

<h3>Tracking Your Order</h3>
<p>Once your order has been dispatched, you will receive an email with your tracking information. You can use this to track your delivery in real-time.</p>

<h2>International Delivery</h2>
<p>We ship to over 48 countries worldwide. International delivery times vary by location, typically between 5-14 working days.</p>`,
      excerpt: 'Information about UK and international delivery options, times, and tracking.',
      isPopular: true,
      categoryId: ordersCategory?.id,
    },
    {
      title: 'How do I track my order?',
      slug: 'how-do-i-track-my-order',
      content: `<h2>Tracking Your Order</h2>
<p>Once your order has been dispatched, you will receive a confirmation email containing your tracking number and a link to track your delivery.</p>

<h3>Steps to Track</h3>
<ol>
<li>Check your email for the dispatch confirmation</li>
<li>Click the tracking link in the email</li>
<li>Enter your tracking number if prompted</li>
<li>View real-time updates on your delivery status</li>
</ol>

<h3>Can't Find Your Tracking Email?</h3>
<p>Check your spam or junk folder. If you still can't find it, please contact our support team with your order number and we'll resend the tracking information.</p>`,
      excerpt: 'Learn how to track your Subcold order with our easy tracking system.',
      isPopular: true,
      categoryId: ordersCategory?.id,
    },
    {
      title: 'How do I return my items?',
      slug: 'how-do-i-return-my-items',
      content: `<h2>Returns Policy</h2>
<p>We want you to be completely satisfied with your purchase. If you're not happy for any reason, you can return your item within <strong>30 days</strong> of delivery.</p>

<h3>How to Return</h3>
<ol>
<li>Visit our <a href="https://subcold.com/pages/self-return-request-form">Self-Return Portal</a></li>
<li>Enter your order number and email address</li>
<li>Select the items you wish to return</li>
<li>Choose your reason for return</li>
<li>Print your prepaid return label</li>
<li>Pack the item securely in its original packaging</li>
<li>Drop off at your nearest courier location</li>
</ol>

<h3>Condition of Returns</h3>
<p>Items must be unused, in their original packaging, and in resalable condition. Items that have been used or damaged may not be eligible for a full refund.</p>`,
      excerpt: 'Step-by-step guide on how to return your Subcold products.',
      isPopular: true,
      categoryId: returnsCategory?.id,
    },
    {
      title: 'Setting Up Your Mini Fridge',
      slug: 'setting-up-your-mini-fridge',
      content: `<h2>Getting Started</h2>
<p>Congratulations on your new Subcold mini fridge! Follow these steps to set it up correctly.</p>

<h3>Before You Start</h3>
<ul>
<li>Let the fridge stand upright for at least 2 hours before plugging in (allows cooling fluid to settle)</li>
<li>Place on a flat, stable surface</li>
<li>Ensure adequate ventilation around the unit (at least 10cm on each side)</li>
</ul>

<h3>Setup Steps</h3>
<ol>
<li>Remove all packaging materials</li>
<li>Clean the interior with a damp cloth</li>
<li>Place the fridge in your desired location</li>
<li>Plug into a standard electrical outlet</li>
<li>Turn on using the power switch</li>
<li>Allow 2-3 hours to reach optimal temperature before adding items</li>
</ol>

<h3>Temperature Settings</h3>
<p>Most Subcold fridges have an adjustable thermostat. Start at a medium setting and adjust based on your needs. Lower numbers = warmer, higher numbers = cooler.</p>`,
      excerpt: 'Complete guide to setting up your new Subcold mini fridge.',
      isPopular: true,
      categoryId: technicalCategory?.id,
    },
    {
      title: 'Product Size Guide',
      slug: 'product-size-guide',
      content: `<h2>Choosing the Right Size</h2>
<p>Our mini fridges come in various sizes to suit your needs. Here's a guide to help you choose.</p>

<h3>Capacity Guide</h3>
<table>
<tr><th>Model</th><th>Capacity</th><th>Cans (330ml)</th><th>Best For</th></tr>
<tr><td>Eco 4</td><td>4 Litres</td><td>6 cans</td><td>Skincare, medications</td></tr>
<tr><td>Eco 25</td><td>25 Litres</td><td>25 cans</td><td>Bedroom, office</td></tr>
<tr><td>Eco 50</td><td>50 Litres</td><td>50 cans</td><td>Games room, man cave</td></tr>
<tr><td>Eco 75</td><td>75 Litres</td><td>80 cans</td><td>Party hosting</td></tr>
</table>

<h3>Dimensions</h3>
<p>Check individual product pages for exact dimensions. Remember to account for ventilation space when measuring your available area.</p>`,
      excerpt: 'Find the perfect size Subcold fridge for your needs.',
      isPopular: true,
      categoryId: productCategory?.id,
    },
    {
      title: 'Warranty Information',
      slug: 'warranty-information',
      content: `<h2>Subcold Warranty</h2>
<p>All Subcold products come with a comprehensive warranty for your peace of mind.</p>

<h3>Warranty Coverage</h3>
<ul>
<li><strong>Standard Warranty:</strong> 2 years from date of purchase</li>
<li><strong>Extended Warranty:</strong> Register your product for an additional year FREE</li>
</ul>

<h3>What's Covered</h3>
<p>Our warranty covers manufacturing defects and faults that occur under normal use. This includes:</p>
<ul>
<li>Cooling system failures</li>
<li>Electrical component defects</li>
<li>Thermostat malfunctions</li>
</ul>

<h3>How to Claim</h3>
<p>Contact our support team with your order number and a description of the issue. We'll guide you through the process and arrange a replacement if needed.</p>`,
      excerpt: 'Details about Subcold product warranty and how to make a claim.',
      isPopular: true,
      categoryId: productCategory?.id,
    },
  ]

  for (const article of articles) {
    if (article.categoryId) {
      const created = await prisma.article.upsert({
        where: { slug: article.slug },
        update: article,
        create: article as any,
      })
      console.log('Created article:', created.title)
    }
  }

  console.log('\n✅ Database seeded successfully!')
  console.log('\n📧 Admin login:')
  console.log('   Email: admin@subcold.com')
  console.log('   Password: admin123')
  console.log('\n⚠️  Remember to change the admin password in production!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
