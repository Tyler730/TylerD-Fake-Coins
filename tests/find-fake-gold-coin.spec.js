const { test, expect } = require('@playwright/test')
const ScalePage = require('../pageobjects/ScalePage')

test.beforeEach(async ({ page }) => {
    await page.goto("http://sdetchallenge.fetch.com/")
    page.on('dialog', async dialog => {
        console.log(dialog.message())
        expect(dialog.message()).toEqual("Yay! You find it!")
        await dialog.accept()
    })
})

test('Find Fake Coin in Fewest Checks', async ({ page }) => {
    const scalePage = new ScalePage(page)

    let coins = ['0', '1', '2', '3', '4', '5', '6', '7', '8']

    await scalePage.findLightestCoin(coins)
    await scalePage.getsWeighingResults()
})