const got = require('@/utils/got');
const { parseDate } = require('@/utils/parse-date');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const username = ctx.params.username;

    const url = `https://truthsocial.com/@${username}`;

    const { data: html } = await got(url);
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
                pubDate: new Date(),
            });
        }
    });

    ctx.state.data = {
        title: `Truth Social - ${username}`,
        link: url,
        item: list.slice(0, 10),
    };
};
