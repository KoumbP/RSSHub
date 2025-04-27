const got = require('@/utils/got');
const { parseDate } = require('@/utils/parse-date');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const username = ctx.params.username;
    const scraperApiKey = process.env.SCRAPERAPI_KEY;

    const targetUrl = `https://truthsocial.com/@${username}`;
    const url = `https://api.scraperapi.com/?api_key=${scraperApiKey}&url=${encodeURIComponent(targetUrl)}&render=true`;

    const { data: html } = await got(url);
    const $ = cheerio.load(html);

    const list = [];

    $('a[href*="/posts/"]').each((_, item) => {
        const content = $(item).text().trim();
        const link = $(item).attr('href');
        if (content && link) {
            list.push({
                title: content,
                description: content,
                link: `https://truthsocial.com${link}`,
                pubDate: parseDate(new Date()),
            });
        }
    });

    ctx.state.data = {
        title: `Truth Social - ${username}`,
        link: targetUrl,
        item: list.slice(0, 10),
    };
};
