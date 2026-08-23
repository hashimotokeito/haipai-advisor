const TILE_ORDER = [
  '1m','9m',                                      // 萬子(三麻: 1と9のみ) index 0-1
  '1p','2p','3p','4p','5p','6p','7p','8p','9p',   // 筒子 index 2-10
  '1s','2s','3s','4s','5s','6s','7s','8s','9s',   // 索子 index 11-19
  '東','南','西','北','白','發','中'                // 字牌 index 20-26
];

function handToCounts(hand) {
  const counts = new Array(TILE_ORDER.length).fill(0);
  for (const tile of hand) {
    const index = TILE_ORDER.indexOf(tile);
    if (index === -1) {
      throw new Error(`知らない牌が渡された: ${tile}`);
    }
    counts[index] += 1;
  }
  return counts;
}

module.exports = { TILE_ORDER, handToCounts };

function findTriplets(counts) {
  const remaining = [...counts];
  let triplets = 0;
  for (let i = 0; i < remaining.length; i++) {
    if (remaining[i] >= 3) {
      remaining[i] -= 3;
      triplets++;
    }
  }
  return { triplets, remaining };
}

const SUIT_RANGES = [
  { start: 2, end: 10 },   // 筒子 1p-9p
  { start: 11, end: 19 },  // 索子 1s-9s
];

function findSequences(counts) {
  const remaining = [...counts];
  let sequences = 0;
  for (const { start, end } of SUIT_RANGES) {
    for (let i = start; i <= end - 2; i++) {
      while (remaining[i] > 0 && remaining[i + 1] > 0 && remaining[i + 2] > 0) {
        remaining[i]--;
        remaining[i + 1]--;
        remaining[i + 2]--;
        sequences++;
      }
    }
  }
  return { sequences, remaining };
}

function findPair(counts) {
  const remaining = [...counts];
  for (let i = 0; i < remaining.length; i++) {
    if (remaining[i] >= 2) {
      remaining[i] -= 2;
      return { hasPair: true, remaining };
    }
  }
  return { hasPair: false, remaining };
}

function findTaatsu(counts) {
  const remaining = [...counts];
  let taatsu = 0;

  // 対子(同じ牌2枚)を搭子として数える(3枚目が来れば刻子になる形)
  for (let i = 0; i < remaining.length; i++) {
    if (remaining[i] >= 2) {
      remaining[i] -= 2;
      taatsu++;
    }
  }

  // 筒子・索子の、隣り合う2枚(両面・辺張)
  for (const { start, end } of SUIT_RANGES) {
    for (let i = start; i <= end - 1; i++) {
      if (remaining[i] > 0 && remaining[i + 1] > 0) {
        remaining[i]--;
        remaining[i + 1]--;
        taatsu++;
      }
    }
  }

  // 筒子・索子の、1つ飛ばしの2枚(嵌張、例: 4p6pで5pを待つ形)
  for (const { start, end } of SUIT_RANGES) {
    for (let i = start; i <= end - 2; i++) {
      if (remaining[i] > 0 && remaining[i + 2] > 0) {
        remaining[i]--;
        remaining[i + 2]--;
        taatsu++;
      }
    }
  }

  return { taatsu, remaining };
}

function calculateShanten(hand) {
  const counts = handToCounts(hand);
  const afterTriplets = findTriplets(counts);
  const afterSequences = findSequences(afterTriplets.remaining);
  const melds = afterTriplets.triplets + afterSequences.sequences;

  const afterPair = findPair(afterSequences.remaining);
  const afterTaatsu = findTaatsu(afterPair.remaining);

  let taatsu = afterTaatsu.taatsu;
  if (melds + taatsu > 4) {
    taatsu = 4 - melds; // 面子+搭子は4ブロックまでしか意味がない
  }

  const shanten = 8 - melds * 2 - taatsu - (afterPair.hasPair ? 1 : 0);
  return { shanten, melds, taatsu, hasPair: afterPair.hasPair };
}

module.exports = { TILE_ORDER, handToCounts, calculateShanten };

const testHand2 = ['1m','1m','1m','9m','4p','5p','6p','7s','8s','9s','東','東','中'];
console.log(calculateShanten(testHand2));