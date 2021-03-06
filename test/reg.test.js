const assert = require('assert');
const RegistrationService = require('../services/registration-services');
const pg = require("pg");
const Pool = pg.Pool;


// we are using a special test database for the tests
const connectionString = process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:5432/regnum_tests';

const pool = new Pool({
    connectionString
});

let registration = RegistrationService(pool)

beforeEach(async ()=> {
    // clean the tables before each test run
    await registration.resetDB();

});

describe('Registration number tests', async () => {

    it("It should be able to cahnge/convert lowercase to uppercase when registration is been entered as 'ca 123 456'", async () => {
        beforeEach(async ()=> {
            // clean the tables before each test run
            await registration.resetDB();

        });
        await registration.setReg({ registration: "ca 123 456" })

        assert.deepEqual([{ "reg_num": 'CA 123 456' }], await registration.getRegList())
    })
    it("It should be able to change/convert lowercase to uppercase when registration is been entered as 'cA 246 891'", async () => {
        beforeEach(async ()=> {
            // clean the tables before each test run
            await registration.resetDB();

        });
        await registration.setReg({ registration: "ca 246 891" })

        assert.deepEqual([{ "reg_num": 'CA 246 891' }], await registration.getRegList())
    })
    it("It should be able to change/convert lowercase to uppercase when registration is been entered as 'Cy 878 555'", async () => {
        beforeEach(async ()=> {
            // clean the tables before each test run
            await registration.resetDB();

        });
        await registration.setReg({ registration: "Cy 878 555" })

        assert.deepEqual([{ "reg_num": 'CY 878 555' }], await registration.getRegList())
    })
    it("It should be able to change/convert lowercase to uppercase when the registration is entered as 'Cf 878 555'", async () => {
        beforeEach(async ()=> {
            // clean the tables before each test run
            await registration.resetDB();

        });
        await registration.setReg({ registration: "Cf 878 555" })

        assert.deepEqual([{ "reg_num": 'CF 878 555' }], await registration.getRegList())
    })



    describe('Test filter function', ()=>{
        it('It should return id = 1 if Cape Town registration number is inserted', async ()=>{
            assert.deepEqual(1, await registration.getID("CA 123-456"))
        })
        it('It should return id = 2 if Bellville registration number is inserted', async ()=>{
            assert.deepEqual(2, await registration.getID("CY 123-456"))
        })
        it('It should return id = 3 if Kuilsriver registration number is inserted', async ()=>{
            assert.deepEqual(3, await registration.getID("CF 123-456"))
        })             
    })


    describe("Filter by town", async () => {
            it('It should only display Cape Town registration if a selected town is Cape Town.', async () => {
            beforeEach(async ()=> {
                // clean the tables before each test run
                await registration.resetDB();

            });

            await registration.setReg({ registration: "ca 878 555" })
            await registration.setReg({ registration: "ca 878 565" })
            await registration.setReg({ registration: "cy 878 555" })
            await registration.setReg({ registration: "cf 878 576" })
            await registration.setReg({ registration: "cf 878 555" })
            await registration.setReg({ registration: "cy 878 555" })

            assert.deepEqual([{ "reg_num": 'CA 878 555' }, { "reg_num": 'CA 878 565' }], await registration.forTown({ townName: 'CA' }))
        })

        it('It should only display Bellville registration if a selected town is Bellville.', async () => {
            beforeEach(async ()=> {
                // clean the tables before each test run
                await registration.resetDB();

            });

            await registration.setReg({ registration: "cy 878 555" })
            await registration.setReg({ registration: "cy 878 565" })
            await registration.setReg({ registration: "cf 878 555" })
            await registration.setReg({ registration: "ca 878 576" })
            await registration.setReg({ registration: "ca 878 555" })
            await registration.setReg({ registration: "cf 878 555" })

            assert.deepEqual([{ "reg_num": 'CY 878 555'},{"reg_num": 'CY 878 565' }], await registration.forTown({ townName: 'CY' }))
        })
        it('It should display Kuilsriver registration if a selected town is Kuilsriver.', async () => {
            beforeEach(async ()=> {
                // clean the tables before each test run
                await registration.resetDB();

            });

            await registration.setReg({ registration: "cf 878 555" })
            await registration.setReg({ registration: "cy 878 565" })
            await registration.setReg({ registration: "cy 878 555" })
            await registration.setReg({ registration: "ca 878 576" })
            await registration.setReg({ registration: "ca 878 555" })
            await registration.setReg({ registration: "cj 878 555" })

            assert.deepEqual([{ "reg_num": 'CF 878 555' }], await registration.forTown({ townName: 'CF' }))
        })
    })
})
