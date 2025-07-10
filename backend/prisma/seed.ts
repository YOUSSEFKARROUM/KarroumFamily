import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding...');

  // 1. Créer les catégories
  console.log('📂 Création des catégories...');
  
  const categoryCrepes = await prisma.category.upsert({
    where: { slug: 'crepes-marocaines' },
    update: {},
    create: {
      name: 'Crêpes Marocaines',
      nameAr: 'الفطائر المغربية',
      slug: 'crepes-marocaines',
      description: 'Délicieuses crêpes traditionnelles marocaines',
      icon: '🥞',
      sortOrder: 1
    }
  });

  const categoryPains = await prisma.category.upsert({
    where: { slug: 'pains-traditionnels' },
    update: {},
    create: {
      name: 'Pains Traditionnels',
      nameAr: 'الخبز التقليدي',
      slug: 'pains-traditionnels',
      description: 'Pains authentiques cuits au four traditionnel',
      icon: '🍞',
      sortOrder: 2
    }
  });

  const categoryPatisseries = await prisma.category.upsert({
    where: { slug: 'patisseries' },
    update: {},
    create: {
      name: 'Pâtisseries',
      nameAr: 'الحلويات',
      slug: 'patisseries',
      description: 'Pâtisseries marocaines traditionnelles',
      icon: '🧁',
      sortOrder: 3
    }
  });

  const categoryPastilla = await prisma.category.upsert({
    where: { slug: 'pastilla' },
    update: {},
    create: {
      name: 'Pastilla',
      nameAr: 'البسطيلة',
      slug: 'pastilla',
      description: 'Feuilles de pastilla et préparations',
      icon: '🥟',
      sortOrder: 4
    }
  });

  console.log('✅ Catégories créées');

  // 2. Créer les produits
  console.log('🛍️ Création des produits...');

  const products = [
    {
      name: 'Msemmen Traditionnel (x5)',
      nameAr: 'المسمن التقليدي (x5)',
      slug: 'msemmen-traditionnel',
      description: 'Délicieuses crêpes feuilletées traditionnelles, croustillantes à l\'extérieur et moelleuses à l\'intérieur. Préparées selon la recette ancestrale de nos grand-mères.',
      price: 25.0,
      oldPrice: 30.0,
      stock: 50,
      images: ['/uploads/placeholder-msemmen.jpg'],
      isFeatured: true,
      categoryId: categoryCrepes.id,
      preparationTime: 20,
      shelfLife: 24
    },
    {
      name: 'Harcha aux Graines (x4)',
      nameAr: 'الحرشة بالحبوب (x4)',
      slug: 'harcha-graines',
      description: 'Pain de semoule parfumé aux graines de fenouil et d\'anis. Texture unique et saveur authentique du terroir marocain.',
      price: 20.0,
      stock: 30,
      images: ['/uploads/placeholder-harcha.jpg'],
      isFeatured: true,
      categoryId: categoryPains.id,
      preparationTime: 15,
      shelfLife: 48
    },
    {
      name: 'Feuilles de Pastilla (x10)',
      nameAr: 'أوراق البسطيلة (x10)',
      slug: 'feuilles-pastilla',
      description: 'Feuilles ultra-fines faites à la main, parfaites pour vos pastillas sucrées ou salées. Qualité premium garantie.',
      price: 35.0,
      stock: 20,
      images: ['/uploads/placeholder-pastilla.jpg'],
      categoryId: categoryPastilla.id,
      preparationTime: 30,
      shelfLife: 72
    },
    {
      name: 'Chebakia Dorée (x6)',
      nameAr: 'الشباكية الذهبية (x6)',
      slug: 'chebakia-doree',
      description: 'Pâtisserie traditionnelle en forme de rose, dorée au miel pur et parsemée de graines de sésame grillées.',
      price: 40.0,
      stock: 25,
      images: ['/uploads/placeholder-chebakia.jpg'],
      isFeatured: true,
      categoryId: categoryPatisseries.id,
      preparationTime: 45,
      shelfLife: 120
    },
    {
      name: 'Khubz Beldi (x2)',
      nameAr: 'الخبز البلدي (x2)',
      slug: 'khubz-beldi',
      description: 'Pain traditionnel marocain cuit au four à bois. Croûte croustillante et mie moelleuse, parfait pour tous les repas.',
      price: 15.0,
      stock: 40,
      images: ['/uploads/placeholder-khubz.jpg'],
      categoryId: categoryPains.id,
      preparationTime: 10,
      shelfLife: 24
    },
    {
      name: 'Mlawi Feuilleté (x3)',
      nameAr: 'الملوي المورق (x3)',
      slug: 'mlawi-feuillete',
      description: 'Galette feuilletée traditionnelle, parfaite pour le petit-déjeuner avec du miel ou de la confiture maison.',
      price: 22.0,
      stock: 15,
      images: ['/uploads/placeholder-mlawi.jpg'],
      categoryId: categoryCrepes.id,
      preparationTime: 25,
      shelfLife: 36
    }
  ];

  for (const productData of products) {
    await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: productData
    });
  }

  console.log('✅ Produits créés');

  // 3. Créer les zones de livraison
  console.log('🚚 Création des zones de livraison...');

  const deliveryZones = [
    {
      name: 'Casablanca Centre',
      cities: ['casablanca', 'casa'],
      price: 0,
      minOrder: 100,
      isActive: true
    },
    {
      name: 'Casablanca Périphérie',
      cities: ['ain sebaa', 'mohammedia', 'bouskoura'],
      price: 15,
      minOrder: 150,
      isActive: true
    },
    {
      name: 'Rabat-Salé',
      cities: ['rabat', 'sale', 'temara'],
      price: 25,
      minOrder: 200,
      isActive: true
    },
    {
      name: 'Kenitra',
      cities: ['kenitra'],
      price: 35,
      minOrder: 250,
      isActive: true
    }
  ];

  for (const zoneData of deliveryZones) {
    await prisma.deliveryZone.upsert({
      where: { name: zoneData.name },
      update: {},
      create: zoneData
    });
  }

  console.log('✅ Zones de livraison créées');

  // 4. Créer la configuration du site
  console.log('⚙️ Configuration du site...');

  const siteConfigs = [
    { key: 'PHONE_CONTACT', value: '+212661234567' },
    { key: 'WHATSAPP_CONTACT', value: '+212661234567' },
    { key: 'EMAIL_CONTACT', value: 'contact@souqelbait.ma' },
    { key: 'OPENING_HOURS', value: '08:00-20:00' },
    { key: 'DELIVERY_HOURS', value: '09:00-19:00' },
    { key: 'MIN_ORDER_AMOUNT', value: '50' },
    { key: 'FREE_DELIVERY_THRESHOLD', value: '200' }
  ];

  for (const configData of siteConfigs) {
    await prisma.siteConfig.upsert({
      where: { key: configData.key },
      update: { value: configData.value },
      create: configData
    });
  }

  console.log('✅ Configuration créée');

  // 5. Créer un utilisateur de test
  console.log('👤 Création d\'un utilisateur de test...');

  await prisma.user.upsert({
    where: { phone: '+212661234567' },
    update: {},
    create: {
      phone: '+212661234567',
      name: 'Ahmed Test',
      email: 'ahmed@test.ma',
      address: '123 Rue Mohammed V, Casablanca',
      city: 'casablanca'
    }
  });

  console.log('✅ Utilisateur de test créé');

  console.log('🎉 Seeding terminé avec succès !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });