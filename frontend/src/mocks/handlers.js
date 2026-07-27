import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/plants', ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search');
    
    let plants = [
      {
        _id: '1',
        name: 'Mocked Plant 1',
        scientificName: 'Mockus plantus',
        countryOfOrigin: 'Mockland',
        imageUrl: 'http://mock.com/1.jpg'
      },
      {
        _id: '2',
        name: 'Another Plant',
        scientificName: 'Otherus plantus',
        countryOfOrigin: 'Otherland',
        imageUrl: 'http://mock.com/2.jpg'
      }
    ];

    if (search) {
      plants = plants.filter(p => p.name.includes(search));
    }
    
    return HttpResponse.json({ data: plants });
  }),

  http.get('/api/plants/:id', ({ params }) => {
    if (params.id === '1') {
      return HttpResponse.json({
        plant: { _id: '1', name: 'Mocked Plant 1', scientificName: 'Mockus plantus', imageUrl: 'http://mock.com/1.jpg' },
        remedies: [{ _id: 'r1', title: 'Remedy 1', origin: 'Origin 1' }]
      });
    }
    if (params.id === 'error') {
      return new HttpResponse(null, { status: 500 });
    }
    return new HttpResponse(null, { status: 404 });
  }),

  http.get('/api/remedies', ({ request }) => {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    
    let remedies = [
      { _id: 'r1', title: 'Remedy 1', categories: ['Cold', 'Fever'], prepTimeMinutes: 10, origin: 'Mockland' },
      { _id: 'r2', title: 'Remedy 2', categories: ['Skin'], prepTimeMinutes: 5, origin: 'Mockland' }
    ];

    if (category) {
      remedies = remedies.filter(r => r.categories.includes(category));
    }

    return HttpResponse.json({ data: remedies });
  }),

  http.get('/api/categories', () => {
    return HttpResponse.json(['Cold', 'Fever', 'Skin']);
  }),

  http.get('/api/remedies/:id', ({ params }) => {
    if (params.id === 'r1') {
      return HttpResponse.json({
        _id: 'r1',
        title: 'Remedy 1',
        categories: ['Cold'],
        prepTimeMinutes: 10,
        origin: 'Mockland',
        ingredients: ['Ing 1'],
        method: 'Do this',
        plantIds: [{ _id: '1', name: 'Mocked Plant 1', scientificName: 'Mockus' }]
      });
    }
    return new HttpResponse(null, { status: 404 });
  })
];
