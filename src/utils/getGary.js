async function ctx(endpoint = "api.garythe.cat") {
    let response;
    try {
        response = await fetch(`https://${endpoint}/gary`);
    } catch (error) {
        console.error(error);
    }
    const result = response.json();

    return {status:response.status,res:result.url,i:result.number};
}

module.exports = ctx;