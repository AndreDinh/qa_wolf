const { chromium } = require("playwright");

const fs = require("fs");
const path = require("path");

// save the title and URL of the top 10 articles to a CSV file. You can run your script with the `node index.js` command
async function saveHackerNewsArticles() {
  // Launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Go to Hacker News
  await page.goto("https://news.ycombinator.com");


  const articles = await page.evaluate(() => {
    const articleElements = document.querySelectorAll('td.title .titleline a');
    const articles = [];

    for (let i = 0; i < 10 && i < articleElements.length; i++) {
      const element = articleElements[i];
      const title = element.textContent;
      const url = element.href;
      articles.push({ title, url });
    }

    return articles;
  });

  // Save the articles to a CSV file
  const csvContent = articles.map(article => `"${article.title}","${article.url}"`).join("\n");
  const csvFilePath = path.join(__dirname, 'articles.csv');
  fs.writeFileSync(csvFilePath, csvContent, 'utf8');


  console.log(`List of articles saved in articles.csv. Down below are the articles:\n`, articles);


  await browser.close();
}

// Execute the function
(async () => {
  await saveHackerNewsArticles();
})();
