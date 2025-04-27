const got = require('@/utils/got');
const { parseDate } = require('@/utils/parse-date');
const cheerio = require('cheerio');

const SCRAPER_API_KEY = 'YOUR_SCRAPERAPI_KEY'; // Replace here!

module.exports = async (ctx) => {
    const username = ctx.params.username;

    const targetUrl = `https://truthsocial.com/@${username}`;
    const scraperUrl = `https://api.scraperapi.com/?api_key=${SCRAPER_API_KEY}&url=${encodeURIComponent(targetUrl)}&render=true`;

    const { data: html } = await got(scraperUrl);
    const $ = cheerio.load(html);

    const list = [];

    $('article').each((_, item) => {
        const content = $(item).find('p').text().trim();
        const link = $(item).find('a[href*="/posts/"]').attr('href');
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
