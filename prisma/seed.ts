import { PrismaClient, Role, LoanStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Configuration
const DEFAULT_PASSWORD = 'password123';
const SALT_ROUNDS = 12;

// Ethiopian names for random user generation
const ethiopianFirstNames = {
  male: ['Abebe', 'Dawit', 'Yohannes', 'Tadesse', 'Mulugeta', 'Berhanu', 'Kebede', 'Girma', 'Tesfaye', 'Alemayehu', 'Solomon', 'Daniel', 'Samuel', 'Binyam', 'Natnael', 'Eyob', 'Robel', 'Yosef', 'Mikias', 'Bereket'],
  female: ['Tigist', 'Marta', 'Sara', 'Hanna', 'Eleni', 'Meron', 'Selam', 'Kidist', 'Tiruwork', 'Aster', 'Almaz', 'Zewdnesh', 'Genet', 'Abebech', 'Tirunesh', 'Fatuma', 'Hirut', 'Meseret', 'Worknesh', 'Tizita']
};

const ethiopianLastNames = ['Bekele', 'Haile', 'Alemu', 'Tesfaye', 'Gebre', 'Hailu', 'Kebede', 'Mekonnen', 'Girma', 'Tadesse', 'Wolde', 'Abebe', 'Dagne', 'Asfaw', 'Demissie', 'Amare', 'Gebreyesus', 'Kassa', 'Meles', 'Zewde'];

// Helper function to get random element from array
function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Helper function to generate random phone number
function generatePhoneNumber(): string {
  const prefixes = ['9', '7'];
  const prefix = getRandomElement(prefixes);
  const number = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
  return `+251${prefix}${number}`;
}

// Helper function to generate unique application IDs
function generateApplicationId(index: number): string {
  const paddedIndex = String(index).padStart(6, '0');
  return `SOL-2024-${paddedIndex}`;
}

// Helper function to get random date within last N days
function getRandomPastDate(daysAgo: number): Date {
  const now = new Date();
  const randomDays = Math.floor(Math.random() * daysAgo);
  const randomHours = Math.floor(Math.random() * 24);
  const randomMinutes = Math.floor(Math.random() * 60);
  
  const date = new Date(now);
  date.setDate(date.getDate() - randomDays);
  date.setHours(randomHours, randomMinutes, 0, 0);
  
  return date;
}

// Generate random user
function generateRandomUser(index: number, role: Role = Role.CUSTOMER): { email: string; fullName: string; phone: string; gender: string } {
  const gender = Math.random() > 0.5 ? 'male' : 'female';
  const firstName = getRandomElement(ethiopianFirstNames[gender]);
  const lastName = getRandomElement(ethiopianLastNames);
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}@example.com`;
  const fullName = `${firstName} ${lastName}`;
  const phone = generatePhoneNumber();
  
  return { email, fullName, phone, gender };
}

async function main() {
  console.log('🌱 Starting seed process...\n');

  // ============================================
  // 0. CREATE OAUTH PROVIDERS
  // ============================================
  console.log('🔐 Creating OAuth providers...');
  
  const oauthProvidersData = [
    { 
      name: 'google', 
      displayName: 'Google', 
      isEnabled: true, 
      buttonColor: '#ffffff',
      buttonTextColor: '#374151'
    },
    { 
      name: 'facebook', 
      displayName: 'Facebook', 
      isEnabled: true,
      buttonColor: '#1877F2',
      buttonTextColor: '#ffffff'
    },
    { 
      name: 'telegram', 
      displayName: 'Telegram', 
      isEnabled: false,
      buttonColor: '#0088cc',
      buttonTextColor: '#ffffff'
    },
  ];

  const oauthProviders = await Promise.all(
    oauthProvidersData.map(async (provider) => {
      return prisma.oAuthProvider.upsert({
        where: { name: provider.name },
        update: { 
          displayName: provider.displayName,
          isEnabled: provider.isEnabled,
          buttonColor: provider.buttonColor,
          buttonTextColor: provider.buttonTextColor,
        },
        create: provider,
      });
    })
  );

  console.log(`✅ Created ${oauthProviders.length} OAuth providers\n`);

  // ============================================
  // 1. CREATE BANKS
  // ============================================
  console.log('📋 Creating banks...');
  
  const banksData = [
    { name: 'Hijira Bank', code: 'HIJIRA', interestRate: 12.0, description: 'Leading Islamic banking institution in Ethiopia' },
    { name: 'Coop Bank', code: 'COOP', interestRate: 11.5, description: 'Cooperative Bank of Ethiopia - Banking for all' },
    { name: 'Commercial Bank of Ethiopia', code: 'CBE', interestRate: 10.5, description: 'Ethiopia\'s largest commercial bank' },
    { name: 'Dashen Bank', code: 'DASHEN', interestRate: 13.0, description: 'Innovative banking solutions for modern Ethiopia' },
    { name: 'Awash Bank', code: 'AWASH', interestRate: 12.5, description: 'Your trusted partner in financial growth' },
    { name: 'Zemen Bank', code: 'ZEMEN', interestRate: 11.0, description: 'Transforming lives through accessible banking' },
    { name: 'Bunna Bank', code: 'BUNNA', interestRate: 13.5, description: 'Fresh approaches to banking excellence' },
  ];

  const banks = await Promise.all(
    banksData.map(async (bank) => {
      return prisma.bank.upsert({
        where: { code: bank.code },
        update: { 
          name: bank.name, 
          interestRate: bank.interestRate,
          description: bank.description 
        },
        create: {
          name: bank.name,
          code: bank.code,
          interestRate: bank.interestRate,
          description: bank.description,
          minLoanAmount: 1000,
          maxLoanAmount: 10000000,
          maxTermMonths: 60,
          isActive: true,
          isPartner: true,
          partnershipDate: getRandomPastDate(365),
        },
      });
    })
  );

  console.log(`✅ Created ${banks.length} banks\n`);

  // ============================================
  // 2. CREATE PRODUCTS
  // ============================================
  console.log('📦 Creating products...');

  const productsData = [
    {
      name: 'iPhone 15 Pro Max',
      slug: 'iphone-15-pro-max',
      price: 150000,
      category: 'Electronics',
      shortDesc: 'Latest Apple smartphone with A17 Pro chip',
      isFeatured: true,
    },
    {
      name: 'Samsung Galaxy S24 Ultra',
      slug: 'samsung-galaxy-s24-ultra',
      price: 120000,
      category: 'Electronics',
      shortDesc: 'Premium Android flagship with S Pen',
      isFeatured: true,
    },
    {
      name: 'MacBook Pro 16"',
      slug: 'macbook-pro-16',
      price: 200000,
      category: 'Electronics',
      shortDesc: 'Apple M3 Pro chip for professionals',
      isFeatured: true,
    },
    {
      name: 'Toyota Corolla 2023',
      slug: 'toyota-corolla-2023',
      price: 3500000,
      category: 'Vehicles',
      shortDesc: 'Reliable sedan with excellent fuel economy',
      isFeatured: true,
    },
    {
      name: 'Modern Sofa Set',
      slug: 'modern-sofa-set',
      price: 80000,
      category: 'Furniture',
      shortDesc: 'Contemporary 5-seater leather sofa',
      isFeatured: false,
    },
    {
      name: 'Bedroom Set',
      slug: 'bedroom-set',
      price: 150000,
      category: 'Furniture',
      shortDesc: 'Complete bedroom furniture set with wardrobe',
      isFeatured: false,
    },
    {
      name: '65" Samsung Smart TV',
      slug: '65-samsung-smart-tv',
      price: 90000,
      category: 'Electronics',
      shortDesc: '4K QLED Smart TV with Tizen OS',
      isFeatured: true,
    },
    {
      name: 'Laptop Dell XPS 15',
      slug: 'laptop-dell-xps-15',
      price: 180000,
      category: 'Electronics',
      shortDesc: 'Premium ultrabook with Intel Core i9',
      isFeatured: false,
    },
  ];

  const products = await Promise.all(
    productsData.map(async (product) => {
      return prisma.product.upsert({
        where: { slug: product.slug },
        update: {
          name: product.name,
          price: product.price,
          category: product.category,
          shortDesc: product.shortDesc,
          isFeatured: product.isFeatured,
        },
        create: {
          name: product.name,
          slug: product.slug,
          price: product.price,
          category: product.category,
          shortDesc: product.shortDesc,
          description: `${product.name} - High quality product available for financing through Soreti.`,
          isFinanceable: true,
          minDownPayment: 10,
          maxLoanTerm: 36,
          inventory: 100,
          isActive: true,
          isFeatured: product.isFeatured,
          sku: `SKU-${product.slug.toUpperCase().replace(/-/g, '')}`,
        },
      });
    })
  );

  console.log(`✅ Created ${products.length} products\n`);

  // ============================================
  // 3. CREATE TEST USERS
  // ============================================
  console.log('👥 Creating test users...');

  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);

  // Core system users (admin roles)
  const coreUsersData = [
    { email: 'superadmin@soreti.com', fullName: 'Super Admin', role: Role.SUPER_ADMIN, bankId: null, phone: '+251911000001' },
    { email: 'admin@soreti.com', fullName: 'Admin User', role: Role.ADMIN, bankId: null, phone: '+251911000002' },
    { email: 'ceo@soreti.com', fullName: 'Chief Executive Officer', role: Role.CEO, bankId: null, phone: '+251911000003' },
    { email: 'gm@soreti.com', fullName: 'General Manager', role: Role.GENERAL_MANAGER, bankId: null, phone: '+251911000004' },
    { email: 'finance@soreti.com', fullName: 'Finance Manager', role: Role.FINANCE_MANAGER, bankId: null, phone: '+251911000005' },
    { email: 'marketing@soreti.com', fullName: 'Marketing Manager', role: Role.MARKETING_MANAGER, bankId: null, phone: '+251911000006' },
    { email: 'seller@soreti.com', fullName: 'Sales Representative', role: Role.SELLER, bankId: null, phone: '+251911000007' },
    { email: 'customer@test.com', fullName: 'Test Customer', role: Role.CUSTOMER, bankId: null, phone: '+251912345678' },
  ];

  // Create bankers for ALL banks
  const bankerUsers = banks.map(bank => ({
    email: `banker@${bank.code.toLowerCase()}.com`,
    fullName: `${bank.name} Loan Officer`,
    role: Role.BANKER,
    bankId: bank.id,
    phone: generatePhoneNumber(),
  }));

  // Add additional bankers for some banks (2-3 bankers per bank)
  const additionalBankers: typeof bankerUsers = [];
  banks.forEach(bank => {
    const numAdditionalBankers = Math.floor(Math.random() * 2) + 1; // 1-2 additional bankers
    for (let i = 0; i < numAdditionalBankers; i++) {
      const userData = generateRandomUser(banks.indexOf(bank) * 10 + i, Role.BANKER);
      additionalBankers.push({
        email: userData.email,
        fullName: userData.fullName,
        role: Role.BANKER,
        bankId: bank.id,
        phone: userData.phone,
      });
    }
  });

  // Generate 30 random customers
  const customerUsers: Array<{ email: string; fullName: string; role: Role; bankId: string | null; phone: string }> = [];
  for (let i = 0; i < 30; i++) {
    const userData = generateRandomUser(i, Role.CUSTOMER);
    customerUsers.push({
      email: userData.email,
      fullName: userData.fullName,
      role: Role.CUSTOMER,
      bankId: null,
      phone: userData.phone,
    });
  }

  const allUsersData = [...coreUsersData, ...bankerUsers, ...additionalBankers, ...customerUsers];

  const users = await Promise.all(
    allUsersData.map(async (userData) => {
      return prisma.user.upsert({
        where: { email: userData.email },
        update: {
          fullName: userData.fullName,
          role: userData.role,
          bankId: userData.bankId,
          isActive: true,
        },
        create: {
          email: userData.email,
          password: hashedPassword,
          fullName: userData.fullName,
          role: userData.role,
          bankId: userData.bankId,
          isActive: true,
          emailVerified: new Date(),
          phone: userData.phone,
          authProvider: 'credentials',
        },
      });
    })
  );

  console.log(`✅ Created ${users.length} users:`);
  console.log(`   - ${coreUsersData.length} core system users`);
  console.log(`   - ${bankerUsers.length + additionalBankers.length} bankers`);
  console.log(`   - ${customerUsers.length} customers\n`);

  // ============================================
  // 4. CREATE SAMPLE LOAN APPLICATIONS
  // ============================================
  console.log('📝 Creating sample loan applications...');

  const testCustomer = users.find(u => u.email === 'customer@test.com')!;
  const customerUsersFromDb = users.filter(u => u.role === Role.CUSTOMER && u.email !== 'customer@test.com');
  const cbeBank = banks.find(b => b.code === 'CBE')!;
  const awashBank = banks.find(b => b.code === 'AWASH')!;
  const zemenBank = banks.find(b => b.code === 'ZEMEN')!;
  const dashenBank = banks.find(b => b.code === 'DASHEN')!;
  const bunnaBank = banks.find(b => b.code === 'BUNNA')!;
  const hijiraBank = banks.find(b => b.code === 'HIJIRA')!;
  const coopBank = banks.find(b => b.code === 'COOP')!;

  const iPhoneProduct = products.find(p => p.slug === 'iphone-15-pro-max')!;
  const macbookProduct = products.find(p => p.slug === 'macbook-pro-16')!;
  const samsungProduct = products.find(p => p.slug === 'samsung-galaxy-s24-ultra')!;
  const toyotaProduct = products.find(p => p.slug === 'toyota-corolla-2023')!;
  const sofaProduct = products.find(p => p.slug === 'modern-sofa-set')!;
  const bedroomProduct = products.find(p => p.slug === 'bedroom-set')!;
  const tvProduct = products.find(p => p.slug === '65-samsung-smart-tv')!;
  const dellProduct = products.find(p => p.slug === 'laptop-dell-xps-15')!;

  // Calculate monthly payment (simple calculation: (principal * (1 + rate/100)) / months)
  const calculateMonthlyPayment = (amount: number, rate: number, months: number): number => {
    const totalWithInterest = amount * (1 + (rate / 100) * (months / 12));
    return Math.round(totalWithInterest / months);
  };

  // Sample loan applications data
  const loansData = [
    {
      product: iPhoneProduct,
      bank: cbeBank,
      amount: 135000, // 10% down payment
      downPayment: 15000,
      totalAmount: 150000,
      termMonths: 12,
      status: LoanStatus.APPROVED,
      daysAgo: 25,
    },
    {
      product: macbookProduct,
      bank: awashBank,
      amount: 160000, // 20% down payment
      downPayment: 40000,
      totalAmount: 200000,
      termMonths: 24,
      status: LoanStatus.UNDER_REVIEW,
      daysAgo: 15,
    },
    {
      product: samsungProduct,
      bank: zemenBank,
      amount: 96000, // 20% down payment
      downPayment: 24000,
      totalAmount: 120000,
      termMonths: 12,
      status: LoanStatus.SUBMITTED,
      daysAgo: 5,
    },
    {
      product: toyotaProduct,
      bank: cbeBank,
      amount: 2800000, // 20% down payment
      downPayment: 700000,
      totalAmount: 3500000,
      termMonths: 48,
      status: LoanStatus.REJECTED,
      daysAgo: 20,
      rejectionReason: 'Insufficient income documentation provided. Please submit updated proof of income.',
    },
    {
      product: sofaProduct,
      bank: dashenBank,
      amount: 64000, // 20% down payment
      downPayment: 16000,
      totalAmount: 80000,
      termMonths: 12,
      status: LoanStatus.APPROVED,
      daysAgo: 30,
    },
    {
      product: tvProduct,
      bank: awashBank,
      amount: 72000, // 20% down payment
      downPayment: 18000,
      totalAmount: 90000,
      termMonths: 12,
      status: LoanStatus.SUBMITTED,
      daysAgo: 3,
    },
    {
      product: bedroomProduct,
      bank: bunnaBank,
      amount: 120000, // 20% down payment
      downPayment: 30000,
      totalAmount: 150000,
      termMonths: 18,
      status: LoanStatus.UNDER_REVIEW,
      daysAgo: 10,
    },
    {
      product: dellProduct,
      bank: zemenBank,
      amount: 144000, // 20% down payment
      downPayment: 36000,
      totalAmount: 180000,
      termMonths: 24,
      status: LoanStatus.APPROVED,
      daysAgo: 22,
    },
  ];

  // Delete ALL existing loans and timelines to ensure clean state
  console.log('   Cleaning up existing loan data...');
  
  await prisma.loanTimeline.deleteMany({});
  await prisma.loanApplication.deleteMany({});
  
  console.log('   ✅ Cleaned up existing data');

  let applicationCounter = 1;

  // Helper function to create loan with timeline
  async function createLoanWithTimeline(
    loanData: typeof loansData[0] & { customer: typeof testCustomer },
    appCounter: number
  ) {
    const createdAt = getRandomPastDate(loanData.daysAgo);
    const monthlyPayment = calculateMonthlyPayment(
      loanData.amount,
      loanData.bank.interestRate,
      loanData.termMonths
    );

    const loan = await prisma.loanApplication.create({
      data: {
        applicationId: generateApplicationId(appCounter),
        userId: loanData.customer.id,
        bankId: loanData.bank.id,
        productId: loanData.product.id,
        amount: loanData.amount,
        downPayment: loanData.downPayment,
        totalAmount: loanData.totalAmount,
        interestRate: loanData.bank.interestRate,
        termMonths: loanData.termMonths,
        monthlyPayment: monthlyPayment,
        status: loanData.status,
        rejectionReason: loanData.rejectionReason,
        createdAt: createdAt,
        submittedAt: loanData.status !== LoanStatus.DRAFT ? createdAt : null,
        approvedAt: loanData.status === LoanStatus.APPROVED 
          ? new Date(createdAt.getTime() + 3 * 24 * 60 * 60 * 1000)
          : null,
        reviewedAt: [LoanStatus.APPROVED, LoanStatus.REJECTED, LoanStatus.UNDER_REVIEW].includes(loanData.status)
          ? new Date(createdAt.getTime() + 2 * 24 * 60 * 60 * 1000)
          : null,
        reviewedByName: [LoanStatus.APPROVED, LoanStatus.REJECTED].includes(loanData.status)
          ? 'Bank Officer'
          : null,
        accountNumber: '1000123456789',
        accountName: loanData.customer.fullName,
        bankName: loanData.bank.name,
      },
    });

    // Create timeline entries
    await prisma.loanTimeline.create({
      data: {
        loanId: loan.id,
        status: LoanStatus.DRAFT,
        action: 'LOAN_CREATED',
        description: 'Loan application created',
        performedBy: loanData.customer.id,
        performedByName: loanData.customer.fullName,
        createdAt: createdAt,
      },
    });

    if (loanData.status !== LoanStatus.DRAFT) {
      await prisma.loanTimeline.create({
        data: {
          loanId: loan.id,
          status: LoanStatus.SUBMITTED,
          action: 'STATUS_CHANGE',
          description: 'Loan application submitted for review',
          performedBy: loanData.customer.id,
          performedByName: loanData.customer.fullName,
          createdAt: new Date(createdAt.getTime() + 1000 * 60 * 30),
        },
      });
    }

    if ([LoanStatus.UNDER_REVIEW, LoanStatus.APPROVED, LoanStatus.REJECTED].includes(loanData.status)) {
      await prisma.loanTimeline.create({
        data: {
          loanId: loan.id,
          status: LoanStatus.UNDER_REVIEW,
          action: 'STATUS_CHANGE',
          description: 'Application is under review by bank',
          performedByName: 'System',
          createdAt: new Date(createdAt.getTime() + 2 * 24 * 60 * 60 * 1000),
        },
      });
    }

    if (loanData.status === LoanStatus.APPROVED) {
      await prisma.loanTimeline.create({
        data: {
          loanId: loan.id,
          status: LoanStatus.APPROVED,
          action: 'STATUS_CHANGE',
          description: 'Loan application has been approved',
          performedByName: 'Bank Officer',
          createdAt: new Date(createdAt.getTime() + 3 * 24 * 60 * 60 * 1000),
        },
      });
    }

    if (loanData.status === LoanStatus.REJECTED) {
      await prisma.loanTimeline.create({
        data: {
          loanId: loan.id,
          status: LoanStatus.REJECTED,
          action: 'STATUS_CHANGE',
          description: `Loan rejected: ${loanData.rejectionReason}`,
          performedByName: 'Bank Officer',
          createdAt: new Date(createdAt.getTime() + 3 * 24 * 60 * 60 * 1000),
        },
      });
    }

    return loan;
  }

  // Create loans for test customer
  for (const loanData of loansData) {
    await createLoanWithTimeline(
      { ...loanData, customer: testCustomer },
      applicationCounter++
    );
  }

  // Create additional loans for random customers
  const allProducts = [iPhoneProduct, macbookProduct, samsungProduct, toyotaProduct, sofaProduct, bedroomProduct, tvProduct, dellProduct];
  const allBanks = [cbeBank, awashBank, zemenBank, dashenBank, bunnaBank, hijiraBank, coopBank];
  const statuses = [LoanStatus.SUBMITTED, LoanStatus.UNDER_REVIEW, LoanStatus.APPROVED, LoanStatus.REJECTED];

  // Each random customer gets 1-3 loans
  for (const customer of customerUsersFromDb) {
    const numLoans = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < numLoans; i++) {
      const product = getRandomElement(allProducts);
      const bank = getRandomElement(allBanks);
      const status = getRandomElement(statuses);
      const downPaymentPercent = 10 + Math.floor(Math.random() * 20); // 10-30%
      const downPayment = product.price * (downPaymentPercent / 100);
      const amount = product.price - downPayment;
      const termMonths = getRandomElement([12, 18, 24, 36, 48]);
      const daysAgo = Math.floor(Math.random() * 60) + 1;
      
      await createLoanWithTimeline(
        {
          product,
          bank,
          amount,
          downPayment,
          totalAmount: product.price,
          termMonths,
          status,
          daysAgo,
          rejectionReason: status === LoanStatus.REJECTED ? 'Unable to verify income documentation.' : undefined,
          customer,
        },
        applicationCounter++
      );
    }
  }

  const totalLoans = applicationCounter - 1;

  console.log(`✅ Created ${totalLoans} loan applications\n`);

  // ============================================
  // 5. CREATE DEFAULT HOMEPAGE SECTIONS
  // ============================================
  console.log('🏠 Creating homepage sections...');

  const homepageSectionsData = [
    {
      sectionKey: 'hero',
      order: 1,
      title: 'Finance Your Dreams',
      subtitle: 'Ethiopia\'s Premier Loan Origination Platform',
      description: 'Get the financing you need for products, vehicles, and more with competitive rates from our partner banks.',
      backgroundColor: '#0f172a',
      textColor: '#ffffff',
      accentColor: '#22c55e',
      ctaText: 'Get Started',
      ctaLink: '/apply',
      ctaButtonColor: '#22c55e',
      secondaryCtaText: 'Learn More',
      secondaryCtaLink: '/about',
    },
    {
      sectionKey: 'partner-banks',
      order: 2,
      title: 'Our Partner Banks',
      subtitle: 'Trusted Financial Institutions',
      description: 'We work with Ethiopia\'s leading banks to bring you the best loan options.',
      backgroundColor: '#ffffff',
      textColor: '#1e293b',
      accentColor: '#22c55e',
    },
    {
      sectionKey: 'how-it-works',
      order: 3,
      title: 'How It Works',
      subtitle: 'Simple 4-Step Process',
      description: 'Getting a loan has never been easier. Follow our simple process to get approved.',
      backgroundColor: '#f8fafc',
      textColor: '#1e293b',
      accentColor: '#22c55e',
    },
    {
      sectionKey: 'featured-products',
      order: 4,
      title: 'Featured Products',
      subtitle: 'Finance What You Need',
      description: 'Browse our selection of products available for financing.',
      backgroundColor: '#ffffff',
      textColor: '#1e293b',
      accentColor: '#22c55e',
      ctaText: 'View All Products',
      ctaLink: '/products',
      ctaButtonColor: '#22c55e',
    },
    {
      sectionKey: 'why-choose-us',
      order: 5,
      title: 'Why Choose Soreti?',
      subtitle: 'Your Trusted Partner in Financing',
      description: 'We make the loan process simple, transparent, and accessible.',
      backgroundColor: '#0f172a',
      textColor: '#ffffff',
      accentColor: '#22c55e',
    },
    {
      sectionKey: 'testimonials',
      order: 6,
      title: 'What Our Customers Say',
      subtitle: 'Real Stories, Real Results',
      description: 'Hear from customers who have successfully financed their dreams through Soreti.',
      backgroundColor: '#f8fafc',
      textColor: '#1e293b',
      accentColor: '#22c55e',
    },
    {
      sectionKey: 'cta',
      order: 7,
      title: 'Ready to Get Started?',
      subtitle: 'Apply Now',
      description: 'Join thousands of Ethiopians who have financed their dreams with Soreti.',
      backgroundColor: '#22c55e',
      textColor: '#ffffff',
      accentColor: '#ffffff',
      ctaText: 'Start Your Application',
      ctaLink: '/apply',
      ctaButtonColor: '#ffffff',
      secondaryCtaText: 'Contact Us',
      secondaryCtaLink: '/contact',
    },
  ];

  const homepageSections = await Promise.all(
    homepageSectionsData.map(async (section) => {
      return prisma.homepageSection.upsert({
        where: { sectionKey: section.sectionKey },
        update: {
          order: section.order,
          title: section.title,
          subtitle: section.subtitle,
          description: section.description,
          backgroundColor: section.backgroundColor,
          textColor: section.textColor,
          accentColor: section.accentColor,
          ctaText: section.ctaText,
          ctaLink: section.ctaLink,
          ctaButtonColor: section.ctaButtonColor,
          secondaryCtaText: section.secondaryCtaText,
          secondaryCtaLink: section.secondaryCtaLink,
        },
        create: section,
      });
    })
  );

  console.log(`✅ Created ${homepageSections.length} homepage sections\n`);

  // ============================================
  // SUMMARY
  // ============================================
  console.log('══════════════════════════════════════════════');
  console.log('🎉 Seed completed successfully!');
  console.log('══════════════════════════════════════════════');
  console.log('\n📊 Summary:');
  console.log(`   Banks: ${banks.length}`);
  console.log(`   Products: ${products.length}`);
  console.log(`   Users: ${users.length}`);
  console.log(`   Loan Applications: ${totalLoans}`);
  console.log(`   Homepage Sections: ${homepageSections.length}`);
  console.log('\n🔐 Test Credentials (all use password: "password123"):');
  console.log('\n   Core System Users:');
  coreUsersData.forEach(u => {
    console.log(`   - ${u.email} (${u.role})`);
  });
  console.log('\n   Bank Officers:');
  bankerUsers.forEach(u => {
    console.log(`   - ${u.email} (${u.fullName})`);
  });
  console.log('\n   Sample Customers (30 random):');
  console.log(`   - customer@test.com (Test Customer)`);
  console.log(`   - ... and ${customerUsers.length} more random customers`);
  console.log('\n══════════════════════════════════════════════\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
