const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Plant = require('../src/models/Plant');
const Remedy = require('../src/models/Remedy');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/homeremedis';

beforeAll(async () => {
  await mongoose.connect(MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('HomeRemedis API', () => {
  let samplePlantId;
  let sampleRemedyId;

  beforeAll(async () => {
    // Get a sample plant and remedy to use in tests
    const plant = await Plant.findOne();
    const remedy = await Remedy.findOne();
    if (plant) samplePlantId = plant._id.toString();
    if (remedy) sampleRemedyId = remedy._id.toString();
  });

  describe('GET /api/plants', () => {
    it('should return 200 and a paginated list of plants', async () => {
      const res = await request(app).get('/api/plants');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('meta');
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should correctly filter by search', async () => {
      const res = await request(app).get('/api/plants?search=Tulsi');
      expect(res.status).toBe(200);
      expect(res.body.data.some(p => p.name.includes('Tulsi'))).toBe(true);
    });

    it('should correctly filter by origin', async () => {
      const res = await request(app).get('/api/plants?origin=India');
      expect(res.status).toBe(200);
      expect(res.body.data.every(p => p.countryOfOrigin.includes('India'))).toBe(true);
    });
  });

  describe('GET /api/plants/:id', () => {
    it('should return 200 and a single plant with linked remedies', async () => {
      if (!samplePlantId) return;
      const res = await request(app).get(`/api/plants/${samplePlantId}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('plant');
      expect(res.body).toHaveProperty('remedies');
      expect(res.body.plant._id.toString()).toBe(samplePlantId);
      expect(Array.isArray(res.body.remedies)).toBe(true);
    });

    it('should return 400 for malformed id', async () => {
      const res = await request(app).get('/api/plants/123');
      expect(res.status).toBe(400);
    });

    it('should return 404 for nonexistent id', async () => {
      const res = await request(app).get(`/api/plants/${new mongoose.Types.ObjectId()}`);
      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/remedies', () => {
    it('should return 200 and a paginated list of remedies', async () => {
      const res = await request(app).get('/api/remedies');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('meta');
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should correctly filter by category', async () => {
      const res = await request(app).get('/api/remedies?category=Cold');
      expect(res.status).toBe(200);
      expect(res.body.data.every(r => r.categories.includes('Cold'))).toBe(true);
    });
  });

  describe('GET /api/remedies/:id', () => {
    it('should return 200 and a single remedy with linked plants populated', async () => {
      if (!sampleRemedyId) return;
      const res = await request(app).get(`/api/remedies/${sampleRemedyId}`);
      expect(res.status).toBe(200);
      expect(res.body._id.toString()).toBe(sampleRemedyId);
      expect(Array.isArray(res.body.plantIds)).toBe(true);
      if (res.body.plantIds.length > 0) {
        expect(res.body.plantIds[0]).toHaveProperty('name');
      }
    });

    it('should return 400 for malformed id', async () => {
      const res = await request(app).get('/api/remedies/123');
      expect(res.status).toBe(400);
    });

    it('should return 404 for nonexistent id', async () => {
      const res = await request(app).get(`/api/remedies/${new mongoose.Types.ObjectId()}`);
      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/categories', () => {
    it('should return 200 and an array of categories', async () => {
      const res = await request(app).get('/api/categories');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('Admin CRUD Routes', () => {
    let newPlantId;
    let newRemedyId;
    const adminHeaders = { 'x-admin-key': 'supersecretadmin' };

    it('should prevent unauthorized access to POST /api/plants', async () => {
      const res = await request(app).post('/api/plants').send({});
      expect(res.status).toBe(401);
    });

    it('should allow admin to create a new plant', async () => {
      const plantData = {
        name: 'Test Plant',
        scientificName: 'Testus plantus',
        countryOfOrigin: 'Testland',
        habitat: 'Test environment',
        imageUrl: 'http://test.com/img.jpg',
        precautions: 'None'
      };
      const res = await request(app).post('/api/plants').set(adminHeaders).send(plantData);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      newPlantId = res.body._id;
    });

    it('should allow admin to update the new plant', async () => {
      const res = await request(app).put(`/api/plants/${newPlantId}`).set(adminHeaders).send({ name: 'Updated Plant' });
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Updated Plant');
    });

    it('should allow admin to create a new remedy', async () => {
      const remedyData = {
        title: 'Test Remedy',
        method: 'Mix and drink',
        prepTimeMinutes: 5,
        origin: 'Testland'
      };
      const res = await request(app).post('/api/remedies').set(adminHeaders).send(remedyData);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      newRemedyId = res.body._id;
    });

    it('should allow admin to update the new remedy', async () => {
      const res = await request(app).put(`/api/remedies/${newRemedyId}`).set(adminHeaders).send({ title: 'Updated Remedy' });
      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Updated Remedy');
    });

    it('should allow admin to delete the new remedy', async () => {
      const res = await request(app).delete(`/api/remedies/${newRemedyId}`).set(adminHeaders);
      expect(res.status).toBe(200);
    });

    it('should allow admin to delete the new plant', async () => {
      const res = await request(app).delete(`/api/plants/${newPlantId}`).set(adminHeaders);
      expect(res.status).toBe(200);
    });
  });
});
