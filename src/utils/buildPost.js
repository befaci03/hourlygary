require('dotenv').config();
const env = process.env;

function ctx(img, number) {
    return env.MESSAGE
      .replace('{number}', number)
      .replace('{image}', img)
      .replace('{source}', env.GARYTHECAT_API);
}

module.exports = ctx;