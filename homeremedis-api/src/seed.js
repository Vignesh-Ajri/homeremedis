require('dotenv').config();
const mongoose = require('mongoose');
const Plant = require('./models/Plant');
const Remedy = require('./models/Remedy');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/homeremedis';

const plantsData = [
  {
    name: 'Tulsi (Holy Basil)',
    scientificName: 'Ocimum tenuiflorum',
    countryOfOrigin: 'India',
    habitat: 'Tropical regions',
    partsUsed: ['Leaves', 'Seeds'],
    activeCompounds: ['Eugenol', 'Ursolic Acid'],
    uses: ['Cough', 'Cold', 'Fever', 'Stress'],
    imageUrl: 'https://via.placeholder.com/300?text=Tulsi',
    precautions: 'Avoid in large quantities during pregnancy'
  },
  {
    name: 'Ginger',
    scientificName: 'Zingiber officinale',
    countryOfOrigin: 'Southeast Asia',
    habitat: 'Warm, humid climates',
    partsUsed: ['Rhizome'],
    activeCompounds: ['Gingerol', 'Shogaol'],
    uses: ['Nausea', 'Digestion', 'Cold', 'Joint pain'],
    imageUrl: 'https://via.placeholder.com/300?text=Ginger',
    precautions: 'May increase bleeding risk'
  },
  {
    name: 'Turmeric',
    scientificName: 'Curcuma longa',
    countryOfOrigin: 'India',
    habitat: 'Tropical climates',
    partsUsed: ['Rhizome'],
    activeCompounds: ['Curcumin'],
    uses: ['Inflammation', 'Skin', 'Wounds', 'Immunity'],
    imageUrl: 'https://via.placeholder.com/300?text=Turmeric',
    precautions: 'May stain skin/clothes; high doses cause stomach upset'
  },
  {
    name: 'Aloe Vera',
    scientificName: 'Aloe barbadensis miller',
    countryOfOrigin: 'Arabian Peninsula',
    habitat: 'Arid and semi-arid regions',
    partsUsed: ['Leaves (Gel)'],
    activeCompounds: ['Aloin', 'Vitamins'],
    uses: ['Skin burns', 'Wounds', 'Digestion'],
    imageUrl: 'https://via.placeholder.com/300?text=Aloe+Vera',
    precautions: 'Oral consumption in large amounts can cause diarrhea'
  },
  {
    name: 'Neem',
    scientificName: 'Azadirachta indica',
    countryOfOrigin: 'India',
    habitat: 'Tropical and sub-tropical regions',
    partsUsed: ['Leaves', 'Bark', 'Oil'],
    activeCompounds: ['Azadirachtin', 'Nimbin'],
    uses: ['Skin infections', 'Dental health', 'Fever'],
    imageUrl: 'https://via.placeholder.com/300?text=Neem',
    precautions: 'Not recommended for pregnant women'
  },
  {
    name: 'Ashwagandha',
    scientificName: 'Withania somnifera',
    countryOfOrigin: 'India',
    habitat: 'Dry regions',
    partsUsed: ['Roots', 'Leaves'],
    activeCompounds: ['Withanolides'],
    uses: ['Stress', 'Anxiety', 'Sleep', 'Energy'],
    imageUrl: 'https://via.placeholder.com/300?text=Ashwagandha',
    precautions: 'May interact with thyroid medications'
  },
  {
    name: 'Garlic',
    scientificName: 'Allium sativum',
    countryOfOrigin: 'Central Asia',
    habitat: 'Temperate regions',
    partsUsed: ['Bulb'],
    activeCompounds: ['Allicin'],
    uses: ['Immunity', 'Heart health', 'Cold'],
    imageUrl: 'https://via.placeholder.com/300?text=Garlic',
    precautions: 'Can cause bad breath and stomach upset'
  },
  {
    name: 'Peppermint',
    scientificName: 'Mentha x piperita',
    countryOfOrigin: 'Europe',
    habitat: 'Moist habitats',
    partsUsed: ['Leaves', 'Essential Oil'],
    activeCompounds: ['Menthol', 'Menthone'],
    uses: ['Digestion', 'Headache', 'Nausea', 'Cold'],
    imageUrl: 'https://via.placeholder.com/300?text=Peppermint',
    precautions: 'May worsen acid reflux'
  },
  {
    name: 'Chamomile',
    scientificName: 'Matricaria chamomilla',
    countryOfOrigin: 'Europe',
    habitat: 'Temperate areas',
    partsUsed: ['Flowers'],
    activeCompounds: ['Apigenin', 'Bisabolol'],
    uses: ['Sleep', 'Anxiety', 'Digestion', 'Skin'],
    imageUrl: 'https://via.placeholder.com/300?text=Chamomile',
    precautions: 'Allergic reactions possible for those allergic to ragweed'
  },
  {
    name: 'Echinacea',
    scientificName: 'Echinacea purpurea',
    countryOfOrigin: 'North America',
    habitat: 'Prairies and open woods',
    partsUsed: ['Roots', 'Leaves', 'Flowers'],
    activeCompounds: ['Alkamides', 'Cichoric acid'],
    uses: ['Cold', 'Immunity', 'Wounds'],
    imageUrl: 'https://via.placeholder.com/300?text=Echinacea',
    precautions: 'May cause digestive upset or rash'
  },
  {
    name: 'Lavender',
    scientificName: 'Lavandula angustifolia',
    countryOfOrigin: 'Mediterranean region',
    habitat: 'Sunny, well-drained soils',
    partsUsed: ['Flowers', 'Essential Oil'],
    activeCompounds: ['Linalool', 'Linalyl acetate'],
    uses: ['Sleep', 'Anxiety', 'Skin burns', 'Pain'],
    imageUrl: 'https://via.placeholder.com/300?text=Lavender',
    precautions: 'Essential oil should not be ingested'
  },
  {
    name: 'Lemon Balm',
    scientificName: 'Melissa officinalis',
    countryOfOrigin: 'South-Central Europe',
    habitat: 'Temperate zones',
    partsUsed: ['Leaves'],
    activeCompounds: ['Rosmarinic acid', 'Citronellal'],
    uses: ['Stress', 'Sleep', 'Digestion', 'Cold sores'],
    imageUrl: 'https://via.placeholder.com/300?text=Lemon+Balm',
    precautions: 'May interfere with thyroid medications'
  },
  {
    name: 'Licorice',
    scientificName: 'Glycyrrhiza glabra',
    countryOfOrigin: 'Western Asia',
    habitat: 'Well-drained soils in deep valleys',
    partsUsed: ['Roots'],
    activeCompounds: ['Glycyrrhizin'],
    uses: ['Cough', 'Sore throat', 'Digestion'],
    imageUrl: 'https://via.placeholder.com/300?text=Licorice',
    precautions: 'High doses can increase blood pressure'
  },
  {
    name: 'Ginseng',
    scientificName: 'Panax ginseng',
    countryOfOrigin: 'Eastern Asia',
    habitat: 'Cool, shady forests',
    partsUsed: ['Roots'],
    activeCompounds: ['Ginsenosides'],
    uses: ['Energy', 'Immunity', 'Stress', 'Cognition'],
    imageUrl: 'https://via.placeholder.com/300?text=Ginseng',
    precautions: 'May cause insomnia or jitteriness'
  },
  {
    name: 'Thyme',
    scientificName: 'Thymus vulgaris',
    countryOfOrigin: 'Mediterranean region',
    habitat: 'Dry, sunny locations',
    partsUsed: ['Leaves', 'Flowers'],
    activeCompounds: ['Thymol', 'Carvacrol'],
    uses: ['Cough', 'Sore throat', 'Bronchitis', 'Acne'],
    imageUrl: 'https://via.placeholder.com/300?text=Thyme',
    precautions: 'Excessive use can cause stomach upset'
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    await Plant.deleteMany({});
    await Remedy.deleteMany({});
    console.log('Cleared existing data.');

    const createdPlants = await Plant.insertMany(plantsData);
    console.log(`Inserted ${createdPlants.length} plants.`);

    // Helper to find plant ID by name
    const getPlantId = (name) => createdPlants.find(p => p.name === name)._id;

    const remediesData = [
      {
        title: 'Tulsi and Ginger Tea',
        categories: ['Cold', 'Cough', 'Fever'],
        plantIds: [getPlantId('Tulsi (Holy Basil)'), getPlantId('Ginger')],
        ingredients: ['10-12 Tulsi leaves', '1 inch crushed Ginger', '2 cups of water', '1 tsp Honey (optional)'],
        method: 'Boil water. Add crushed ginger and tulsi leaves. Simmer for 5-10 minutes. Strain and drink warm.',
        prepTimeMinutes: 10,
        origin: 'Indian Household Remedy'
      },
      {
        title: 'Turmeric Milk (Golden Milk)',
        categories: ['Immunity', 'Cold', 'Sleep'],
        plantIds: [getPlantId('Turmeric')],
        ingredients: ['1 cup milk (or dairy-free alternative)', '1/2 tsp Turmeric powder', 'A pinch of black pepper'],
        method: 'Warm the milk. Stir in turmeric and black pepper. Simmer for 2 minutes and drink warm before bed.',
        prepTimeMinutes: 5,
        origin: 'Ayurvedic'
      },
      {
        title: 'Aloe Vera Skin Soother',
        categories: ['Skin'],
        plantIds: [getPlantId('Aloe Vera')],
        ingredients: ['Fresh Aloe Vera leaf'],
        method: 'Slice the leaf open and scoop out the clear gel. Apply directly to minor burns or irritated skin.',
        prepTimeMinutes: 2,
        origin: 'Global Traditional Use'
      },
      {
        title: 'Neem Water for Skin',
        categories: ['Skin', 'Fever'],
        plantIds: [getPlantId('Neem')],
        ingredients: ['Handful of fresh Neem leaves', '1 liter water'],
        method: 'Boil the leaves in water until the water turns greenish. Let it cool. Use it to wash affected skin areas or bathe.',
        prepTimeMinutes: 15,
        origin: 'Indian Folk Medicine'
      },
      {
        title: 'Ashwagandha Moon Milk',
        categories: ['Sleep', 'Stress'],
        plantIds: [getPlantId('Ashwagandha')],
        ingredients: ['1 cup warm milk', '1/2 tsp Ashwagandha powder', 'Pinch of nutmeg'],
        method: 'Mix the powder and nutmeg into warm milk. Stir well and drink before sleeping.',
        prepTimeMinutes: 5,
        origin: 'Ayurvedic'
      },
      {
        title: 'Garlic Honey Syrup',
        categories: ['Cold', 'Immunity'],
        plantIds: [getPlantId('Garlic')],
        ingredients: ['3-4 cloves of crushed Garlic', '1 tbsp Honey'],
        method: 'Mix crushed garlic with honey. Let it sit for 10-15 minutes before consuming. Take a spoonful daily.',
        prepTimeMinutes: 15,
        origin: 'European/Asian Folk Remedy'
      },
      {
        title: 'Peppermint Tea for Digestion',
        categories: ['Digestion', 'Nausea'],
        plantIds: [getPlantId('Peppermint')],
        ingredients: ['1 tbsp fresh or dried Peppermint leaves', '1 cup boiling water'],
        method: 'Pour boiling water over the leaves. Cover and steep for 5-10 minutes. Strain and drink after meals.',
        prepTimeMinutes: 10,
        origin: 'European Traditional'
      },
      {
        title: 'Chamomile Sleep Tea',
        categories: ['Sleep', 'Anxiety'],
        plantIds: [getPlantId('Chamomile')],
        ingredients: ['1-2 tbsp dried Chamomile flowers', '1 cup boiling water'],
        method: 'Steep the flowers in boiling water for 5 minutes. Strain and drink 30 minutes before bedtime.',
        prepTimeMinutes: 5,
        origin: 'European Folk Medicine'
      },
      {
        title: 'Echinacea Immunity Brew',
        categories: ['Immunity', 'Cold'],
        plantIds: [getPlantId('Echinacea')],
        ingredients: ['1 tsp dried Echinacea root/leaves', '1 cup boiling water'],
        method: 'Simmer the root for 15 minutes, or steep leaves for 10 minutes. Strain and drink up to 3 times a day.',
        prepTimeMinutes: 15,
        origin: 'Native American Traditional'
      },
      {
        title: 'Lavender Steam for Headaches',
        categories: ['Stress', 'Anxiety'],
        plantIds: [getPlantId('Lavender')],
        ingredients: ['A few drops of Lavender essential oil', 'Bowl of hot steaming water'],
        method: 'Add the oil to the hot water. Lean over the bowl, cover head with a towel, and breathe deeply for 5 minutes.',
        prepTimeMinutes: 5,
        origin: 'Aromatherapy'
      },
      {
        title: 'Lemon Balm Calm Tea',
        categories: ['Stress', 'Sleep'],
        plantIds: [getPlantId('Lemon Balm')],
        ingredients: ['1 tbsp fresh Lemon Balm leaves', '1 cup boiling water'],
        method: 'Pour boiling water over leaves. Steep for 10 minutes. Strain and enjoy to relax.',
        prepTimeMinutes: 10,
        origin: 'European Herbalism'
      },
      {
        title: 'Licorice Root Decoction',
        categories: ['Cough', 'Digestion'],
        plantIds: [getPlantId('Licorice')],
        ingredients: ['1 tsp dried Licorice root', '1 cup water'],
        method: 'Simmer the root in water for 10-15 minutes. Strain and drink slowly to soothe a sore throat.',
        prepTimeMinutes: 15,
        origin: 'Traditional Chinese/Middle Eastern'
      },
      {
        title: 'Ginseng Energy Tonic',
        categories: ['Energy', 'Immunity'],
        plantIds: [getPlantId('Ginseng')],
        ingredients: ['2-3 slices of fresh Ginseng root', '1 cup hot water'],
        method: 'Steep the ginseng slices in hot water for 5-10 minutes. Drink the tea and chew the root if desired.',
        prepTimeMinutes: 10,
        origin: 'Traditional Chinese Medicine'
      },
      {
        title: 'Thyme Cough Syrup',
        categories: ['Cough', 'Cold'],
        plantIds: [getPlantId('Thyme')],
        ingredients: ['1/2 cup strong Thyme tea', '1/2 cup Honey'],
        method: 'Make a strong tea by steeping 2 tbsp thyme in boiling water. Strain and mix equal parts with honey. Keep refrigerated.',
        prepTimeMinutes: 20,
        origin: 'European Folk Remedy'
      },
      {
        title: 'Ginger & Licorice Digestion Soother',
        categories: ['Digestion', 'Nausea'],
        plantIds: [getPlantId('Ginger'), getPlantId('Licorice')],
        ingredients: ['1/2 inch crushed Ginger', '1/2 tsp Licorice root', '1 cup water'],
        method: 'Simmer both ingredients in water for 10 minutes. Strain and drink warm.',
        prepTimeMinutes: 10,
        origin: 'Asian Traditional Use'
      }
    ];

    const createdRemedies = await Remedy.insertMany(remediesData);
    console.log(`Inserted ${createdRemedies.length} remedies.`);

    console.log('Seeding completed successfully!');
    return { success: true, message: 'Database seeded successfully' };
  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  }
};

module.exports = seedDatabase;
