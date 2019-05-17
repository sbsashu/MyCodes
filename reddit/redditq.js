var RedditApi = require('reddit-oauth');
var reddit = new RedditApi({
    app_id: 'L_XWsTPnyM9NVA',
    app_secret: 'Y6-nsHlLBnxWKYaoSuCuCSGmBE0',
    //redirect_uri: 'your_app_redirect_uri'
});
reddit.get(
    '/api/v1/me',
    {},
    function (error, response, body) {
        console.log(error);
        console.log(body);

    }
);
reddit.get(
    '/user/aihamh/submitted',
    {},
    function (error, response, body, next) {
        console.log(error);
        console.log(body);

        // next is not null, therefore there are more pages
        if (next) {
            next(); // Invoke next to retrieve the next page
        }
    }
);
