const API_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('Starting Integration Tests against live backend...');
  let passed = 0;
  let failed = 0;

  const assert = (condition, message) => {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  };

  try {
    // 1. Full plant list load
    const plantsRes = await fetch(`${API_URL}/plants`);
    const plantsData = await plantsRes.json();
    assert(plantsRes.status === 200 && Array.isArray(plantsData.data) && plantsData.data.length > 0, 'Full plant list loads successfully');

    // 2. Plant-to-remedy navigation data
    const firstPlantId = plantsData.data[0]._id;
    const plantDetailRes = await fetch(`${API_URL}/plants/${firstPlantId}`);
    const plantDetailData = await plantDetailRes.json();
    assert(
      plantDetailRes.status === 200 && 
      plantDetailData.plant._id === firstPlantId && 
      Array.isArray(plantDetailData.remedies), 
      'Plant detail loads with linked remedies navigation data'
    );

    // 3. Failed request rendering (backend down / bad id)
    const badIdRes = await fetch(`${API_URL}/plants/invalid-id-format`);
    assert(badIdRes.status === 400, 'Invalid ID properly returns 400 error status');

    const notFoundRes = await fetch(`${API_URL}/plants/5f8d0a7a0b2b8c1a2c3d4e5f`);
    assert(notFoundRes.status === 404, 'Non-existent ID properly returns 404 error status');

  } catch (error) {
    console.error('Test execution failed:', error.message);
    console.error('Make sure the backend server is running on port 5000.');
    failed++;
  }

  console.log(`\nResults: ${passed} passed, ${failed} failed`);
  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
