const {test, expect} = require('@playwright/test');
const path = require('path');

class ScalePage
{
    
    constructor(page)
    {
        this.page = page;

        // Locators
        this.resetBtn = page.locator("#reset:not([disabled])");
        this.resultSelector = "#reset:disabled";
        this.weighBtn = page.locator("#weigh");
        this.weighings = page.locator(".game-info li");
    }

    /**
     * Tests and finds the Lightest coin in the shortest amount of time.
     * @param coins an array of coins
     */
    async findLightestCoin(coins = []) {

        if (coins.length === 1) {
            console.log(`The Fake Coin is ${coins[0]}`)
            await this.selectCoin(coins[0])
            return
        }

        const coinGroups = Math.floor(coins.length / 3)
        const left = coins.slice(0, coinGroups)
        const right = coins.slice(coinGroups, coinGroups * 2)
        const remaining = coins.slice(coinGroups * 2)

        await this.fillScale(left, 'left')
        await this.fillScale(right, 'right')
        await this.clickWeighBtn()

        let result = await this.getResults()
        console.log(result)

        await this.resetScales()

        if (result === '<') {
            console.log(`The Fake Coin is in: ${left}`)
            return await this.findLightestCoin(left)
        } else if (result === '>') {
            console.log(`The Fake Coin is in: ${right}`)
            return await this.findLightestCoin(right)
        } else if (result === '=') {
            console.log(`The Fake Coin is in: ${remaining}`)
            return await this.findLightestCoin(remaining)
        } else {
            console.error(`Unknown Symbol: ${result}, please look into test`)
        }
    }

    /**
     * Fills the Left Scale with coins
     * @param array an array of coins
     * @param side 'left' or 'right'
     */
    async fillScale(array = [], side) {
        for(let i = 0; i < array.length; i++) {
            let leftScale_selector = `#${side}_${i}`
            await this.page.locator(leftScale_selector).fill(array[i])
        }
    }

    /**
     * Clicks the Weigh Button
     */
    async clickWeighBtn() {
        await this.weighBtn.click()
    }

    /**
     * Waits for the results to appear and returns: <, >, =
     */
    async getResults() {
        //wait until "?" is no longer present
        await this.page.waitForFunction(
            () => document.querySelector("#reset:disabled").innerText !== '?', // Waits for the text to change from "?"
            { timeout: 5000 },
        )
        return await this.page.locator(this.resultSelector).textContent()
    }

    /**
     * Clicks the Reset Scale Button
     */
    async resetScales() {
        await this.resetBtn.click()
    }

    /**
     * Clicks a coin 
     * @param {number} coinNumber - The coin that will be clicked.
     */
    async selectCoin(coinNumber) {
        await this.page.locator(`#coin_${coinNumber}`).click()
    }

    /**
     * prints out the weighing results
     */
    async getsWeighingResults() {
        console.log("Weighing Results:")
        let weighings = await this.weighings.allTextContents()
        console.log(`Amount of Weighings: ${weighings.length}`)
        weighings.forEach(element => {
            console.log(element)
        })
    }

}

module.exports = ScalePage;