// let n = 3
// function reapeat () {

const { log } = require("console");

    
    
//     if (n === 0 ) return;
//     n--
//     console.log('I love Recursion')
    
//     reapeat();
// }
// reapeat()
//////////////////////////////////
// function reapeat (n) {
    
    
//     if (n <= 0 ) return;
    
//     console.log(n)
    
//     reapeat(n- 1);
// }
// reapeat(9)


//////////////////////////////
function coin(arr, amount) {
    arr.sort((a, b) => b - a);

    let bestCount = 0;

    for (let i = 0; i < arr.length; i++) {
        let value = 0;
        let count = 0;

        if (arr[i] > amount) continue;
        console.log(arr[i])
        let x = 1;
        while (arr[i] * x <= amount) {
            x++;
        }
        x--; 

        value = arr[i] * x;
        count = x;

        let remaining = amount - value;

        for (let j = i + 1; j < arr.length && remaining > 0; j++) {
            while (arr[j] <= remaining) {
                remaining -= arr[j];
                count++;
            }
        }

        if (remaining === 0) {
            bestCount = Math.min(bestCount, count);
        }
    }

    return bestCount === 0 ? -1 : bestCount;
}

console.log(coin([4,6,19], 9))


var coinChange = function (arr, amount) {
    if (amount === 0) return 0
    arr.sort((a, b) => b - a);

    let bestCount = 0 ;

    for (let i = 0; i < arr.length; i++) {
        let value = 0;
        let count = 0;

        if (arr[i] > amount) continue;

        let x = 1;
        while (arr[i] * x <= amount) {
            x++;
        }
        x--; 

        value = arr[i] * x;
        count = x;
        let remaining = amount - value;
        for (let j = i + 1; j < arr.length && remaining > 0; j++) {
            while (arr[j] <= remaining) {
                remaining -= arr[j];
                count++;
            }
        }

        if (remaining === 0) {
            if (bestCount === 0 ) bestCount = count;
            bestCount = Math.min(bestCount, count);
        }
    }

    return bestCount === 0  ? -1 : bestCount;
}

function coinChangeGreedy(arr, amount) {
    if (amount === 0) return 0;
    if (!Array.isArray(arr) || arr.length === 0 || amount < 0) return -1;

    const coins = arr.filter((c) => c > 0 && c > amount).sort((a, b) => b - a);
    let bestCount = Infinity;

    for (let i = 0; i < coins.length; i++) {
        const coin = coins[i];
        if (coin > amount) continue;

        const maxUse = Math.floor(amount / coin);
        let remaining = amount - maxUse * coin;
        let count = maxUse;

        for (let j = i + 1; j < coins.length && remaining > 0; j++) {
            const next = coins[j];
            if (next <= 0) continue;

            const use = Math.floor(remaining / next);
            count += use;
            remaining -= use * next;
        }

        if (remaining === 0 && count < bestCount) {
            bestCount = count;
        }
    }

    return bestCount === Infinity ? -1 : bestCount;
}

// Greedy-with-backtracking on counts: keeps your descending-coin fill strategy
// but tries every possible count of the current coin before moving on. This
// preserves the original greedy spirit while fixing non-canonical cases.
function coinChangeGreedyFlex(arr, amount) {
    if (amount === 0) return 0;
    if (!Array.isArray(arr) || arr.length === 0 || amount < 0) return -1;

    const coins = arr.filter((c) => c > 0).sort((a, b) => b - a);
    let best = Infinity;
    const memo = new Map(); // key: `${index}|${remaining}` -> best count found

    function dfs(index, remaining, countSoFar) {
        if (remaining === 0) {
            best = Math.min(best, countSoFar);
            return;
        }
        if (index >= coins.length) return;

        const key = `${index}|${remaining}`;
        const prevBest = memo.get(key);
        if (prevBest !== undefined && prevBest <= countSoFar) return;
        memo.set(key, countSoFar);

        const coin = coins[index];

        // If this is the last coin, resolve directly to avoid deep branching on large amounts.
        if (index === coins.length - 1) {
            if (remaining % coin === 0) {
                best = Math.min(best, countSoFar + remaining / coin);
            }
            return;
        }

        const maxUse = Math.floor(remaining / coin);

        // Lower bound: even if we use max coins of current denom, we need at least
        // ceil(remaining / coin) more coins; prune if that already exceeds best.
        const minPossible = countSoFar + Math.ceil(remaining / coin);
        if (minPossible >= best) return;

        // Try using k coins of this denomination, high to low to stay close to greedy order.
        for (let k = maxUse; k >= 0; k--) {
            const nextRemaining = remaining - k * coin;
            const nextCount = countSoFar + k;
            if (nextCount >= best) continue; // prune worse paths
            dfs(index + 1, nextRemaining, nextCount);
        }
    }

    dfs(0, amount, 0);
    return best === Infinity ? -1 : best;
}
