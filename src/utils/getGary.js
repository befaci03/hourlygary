const fetch = require('axios');

async function getGary(endpoint = "api.garythe.cat") {
    let response;
    try {
        response = await fetch.get(`https://${endpoint}/gary`);
    } catch (error) {
        console.error(error);
    }
    const result = response.data;

    return {status:response.status,res:result.url,i:result.number};
}

module.exports = getGary;