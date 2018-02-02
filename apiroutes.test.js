const request = require('supertest');
const app = require('./app');
describe('Test document/add', () => {
    test('It should response the failure ', (done) => {
        request(app).post('/gwc/document/add', {
            data: {
                docLang: {value: {value: 'eng'      } , error: null },
                docType: {value: 'legislation', error: null },
                docAknType: {value: 'act', error: null },
                docCountry: {value: 'ke', error: null },
                docTitle: {value: 'Blah Title', error: null},
                docOfficialDate: {value: new Date(), error: null },
                docNumber: {value: '23', error: null },
                docPart: {value: 'main', error: null },
                docIri : {value: '/akn/ke/doc/23/eng@/!main', error: null }
              }
        }).then((response) => {
            console.log( " RESPONSE ", response );
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});