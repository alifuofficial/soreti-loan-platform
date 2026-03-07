import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'

// GET - Fetch about content (public)
export async function GET() {
  try {
    let content = await db.aboutContent.findFirst({
      where: { isActive: true }
    })

    // If no content exists, return default content
    if (!content) {
      content = {
        id: 'default',
        heroTitle: 'About Soreti International Trading Co.',
        heroSubtitle: 'Connecting Ethiopia to the World Since 2005',
        heroImage: null,
        storyTitle: 'Our Story',
        storyContent: `Founded in 2005 by Mr. Bulbula Tule and Mrs. Damma Sheko, Soreti International Trading Co. (SITCO) is one of Ethiopia's leading diversified enterprises. Registered under the Ethiopian Commercial Code, SITCO operates across import and export, manufacturing, hospitality, and real estate, connecting Ethiopia's industries to the global market.

Soreti exports Ethiopia's finest coffee, pulses, oilseeds, and spices to major markets across Europe, Asia, the Americas, the Middle East, and Africa — while importing electric vehicles, pharmaceuticals, and machinery to support national development. Our manufacturing facilities include vehicle assembly in Mojo, edible oil production in Adama, and avocado oil processing in Jimma Industrial Park, all equipped with modern technology and strict quality control systems.

Beyond trade and production, Soreti manages commercial malls in Addis Ababa and Adama and partners with Safaricom Ethiopia as a Master Agent for digital financial services. With over 100 dedicated professionals and strong international partnerships, we continue to expand Ethiopia's footprint in global trade — driven by quality, integrity, and innovation.`,
        storyImage: null,
        founder1Name: 'Mr. Bulbula Tule',
        founder1Title: 'Co-Founder & CEO',
        founder1Image: null,
        founder1Bio: 'Visionary entrepreneur with over 20 years of experience in international trade and business development.',
        founder2Name: 'Mrs. Damma Sheko',
        founder2Title: 'Co-Founder & COO',
        founder2Image: null,
        founder2Bio: 'Strategic leader driving operational excellence across all SITCO business divisions.',
        missionTitle: 'Our Mission',
        missionContent: 'To connect Ethiopian industries with global markets through quality products, innovative solutions, and sustainable business practices that create value for our customers, partners, and communities.',
        visionTitle: 'Our Vision',
        visionContent: 'To become Ethiopia\'s leading diversified enterprise, recognized globally for excellence in trade, manufacturing, and financial services.',
        valuesTitle: 'Our Core Values',
        values: JSON.stringify([
          { title: 'Quality', description: 'We deliver excellence in every product and service', icon: 'Award' },
          { title: 'Integrity', description: 'We conduct business with honesty and transparency', icon: 'Shield' },
          { title: 'Innovation', description: 'We embrace new ideas and technologies', icon: 'Lightbulb' },
          { title: 'Partnership', description: 'We build lasting relationships with stakeholders', icon: 'Users' }
        ]),
        businessTitle: 'Our Business Areas',
        businessAreas: JSON.stringify([
          { title: 'Export Trading', description: 'Coffee, pulses, oilseeds, and spices to global markets', icon: 'Globe' },
          { title: 'Import Trading', description: 'Electric vehicles, pharmaceuticals, and machinery', icon: 'Truck' },
          { title: 'Manufacturing', description: 'Vehicle assembly, edible oil, and avocado oil processing', icon: 'Factory' },
          { title: 'Real Estate', description: 'Commercial malls in Addis Ababa and Adama', icon: 'Building' },
          { title: 'Financial Services', description: 'Safaricom Ethiopia Master Agent for digital finance', icon: 'CreditCard' }
        ]),
        globalTitle: 'Global Presence',
        globalContent: 'Our products reach customers across five continents, strengthening Ethiopia\'s position in international trade.',
        globalMarkets: JSON.stringify(['Europe', 'Asia', 'Americas', 'Middle East', 'Africa']),
        statsTitle: 'Soreti at a Glance',
        stats: JSON.stringify([
          { value: '2005', label: 'Year Founded' },
          { value: '100+', label: 'Team Members' },
          { value: '5', label: 'Continents Served' },
          { value: '3', label: 'Manufacturing Facilities' }
        ]),
        ctaTitle: 'Partner with Soreti',
        ctaContent: 'Join our network of trusted partners and customers. Discover how Soreti can help you achieve your business goals.',
        ctaButtonText: 'Get Started',
        ctaButtonLink: '/?action=register',
        isActive: true,
        updatedAt: new Date()
      } as any
    }

    // Parse JSON fields
    const response = {
      ...content,
      values: content.values ? JSON.parse(content.values) : [],
      businessAreas: content.businessAreas ? JSON.parse(content.businessAreas) : [],
      globalMarkets: content.globalMarkets ? JSON.parse(content.globalMarkets) : [],
      stats: content.stats ? JSON.parse(content.stats) : []
    }

    return NextResponse.json({ content: response })
  } catch (error) {
    console.error('Error fetching about content:', error)
    return NextResponse.json({ error: 'Failed to fetch about content' }, { status: 500 })
  }
}

// PUT - Update about content (admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    
    // Stringify JSON fields
    const updateData = {
      ...data,
      values: data.values ? JSON.stringify(data.values) : undefined,
      businessAreas: data.businessAreas ? JSON.stringify(data.businessAreas) : undefined,
      globalMarkets: data.globalMarkets ? JSON.stringify(data.globalMarkets) : undefined,
      stats: data.stats ? JSON.stringify(data.stats) : undefined,
    }

    // Check if content exists
    const existing = await db.aboutContent.findFirst()
    
    let content
    if (existing) {
      content = await db.aboutContent.update({
        where: { id: existing.id },
        data: updateData
      })
    } else {
      content = await db.aboutContent.create({
        data: updateData
      })
    }

    return NextResponse.json({ content })
  } catch (error) {
    console.error('Error updating about content:', error)
    return NextResponse.json({ error: 'Failed to update about content' }, { status: 500 })
  }
}
