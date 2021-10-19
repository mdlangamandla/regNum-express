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

describe('Registration number exercise', async () => {

    it("It should be able to cahnge lowercase to uppercase when registration is been entered as 'ca 123 456'", async () => {
        beforeEach(async ()=> {
            // clean the tables before each test run
            await registration.resetDB();

        });
        await registration.setReg({ registration: "ca 123 456" })

        assert.deepEqual([{ "reg_num": 'CA 123 456' }], await registration.getRegList())
    })
    it("It should be able to change lowercase to uppercase when registration is been entered as 'cA 246 891'", async () => {
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
    it("It should be able to convert small letter to capital letter when registration is been entered as 'Cl 878 555'", async () => {
        beforeEach(async ()=> {
            // clean the tables before each test run
            await registration.resetDB();

        });
        await registration.setReg({ registration: "Cl 878 555" })

        assert.deepEqual([{ "reg_num": 'CL 878 555' }], await registration.getRegList())
    })
    describe('Validating by regex', () => {
        it('Should return error message if the registration number is entered is wrong.', async () => {
            beforeEach(async ()=> {
                // clean the tables before each test run
                await registration.resetDB();

            });

        assert.equal(undefined, await registration.setReg({ registration: 'ca12345' }))
        });
        it('It Should return error message if the entered registration number does not belong from Cape Kuilsriver/ Cape Town or Bellville', async () => {
            beforeEach(async ()=> {
                // clean the tables before each test run
                await registration.resetDB();

            });

        assert.equal(undefined, await registration.setReg({ registration: 'CEO 12345' }))
        })
        it("Grabouw registratiion number entered does not exists in the Application.", async () => {
            beforeEach(async  ()=> {
                // clean the tables before each test run
                await registration.resetDB();

            });

        assert.equal(undefined, await registration.setReg({ registration: "CY 152775" }))
        })
        it("It should add to the list registration when it is correct", async () => {
            beforeEach(async ()=> {
                // clean the tables before each test run
                await registration.resetDB();

            });

            await registration.setReg({ registration: "CA 123 456" })
            assert.deepEqual([{ "reg_num": 'CA 123 456' }], await registration.getRegList())
        })
        it("It should not add to the list registration when it is correct and already exist on the list", async () => {
            beforeEach(async ()=> {
                // clean the tables before each test run
                await registration.resetDB();

            });

            await registration.setReg({ registration: "CA 123 456" })
            await registration.setReg({ registration: "CA 123 456" })
            assert.deepEqual([{ "reg_num": 'CA 123 456' }], await registration.getRegList())
        })
        it("It should add to the list registration when it is correct and have not been added before", async () => {
            beforeEach(async ()=> {
                // clean the tables before each test run
                await registration.resetDB();

            });

            await registration.setReg({ registration: "CA 123 456" })
            await registration.setReg({ registration: "CY 123 456" }) 
            assert.deepEqual([{ "reg_num": 'CA 123 456' }, { "reg_num": 'CY 123 456' }], await registration.getRegList())
        })
    })
    describe("Filter by town", async () => {
            it('It should only display Cape Town registration if selected town is Cape Town.', async () => {
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

        it('It should only display Bellville registration if selected town is Bellville.', async () => {
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

            assert.deepEqual([{ "reg_num": 'CY 878 555'},{"reg_num": 'CY 878 565' }], await registration.forTown({ townName: 'CL' }))
        })
        it('It should display Kuilsriver registration if selected town is Kuilsriver.', async () => {
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

    describe('Test filter function', ()=>{
        it('It should return id = 1 if Kuilsriver registration number is inserted', async ()=>{
            assert.deepEqual(1, await registration.getID("CF 123-456"))
        })
        it('It should return id = 2 if Bellville registration number is inserted', async ()=>{
            assert.deepEqual(2, await registration.getID("CY 123-456"))
        })
        it('It should return id = 3 if Cape Town registration number is inserted', async ()=>{
            assert.deepEqual(3, await registration.getID("CA 123-456"))
        })             
    })
})