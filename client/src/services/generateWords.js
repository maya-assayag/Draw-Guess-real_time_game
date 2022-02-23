var randomWords = require("random-words");

export async function generateWords(amount = 3) {
  const words = await randomWords({ exactly: amount });
  return words.map((word, index) => {
    return { value: word, level: index };
  });
}
