import { Request, Response } from "express";

const puppeteer = require("puppeteer");

class ScrappingMLController {
  async handle(request: Request, response: Response) {
    const { product } = request.body;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`https://lista.mercadolivre.com.br/${product}`);

    await page.setViewport({
      width: 1200,
      height: 12000,
    });

    await page.screenshot({ path: "example.png" });

    let api = [];

    const title = await page.$$eval(
      "ol li div div .ui-search-item__group.ui-search-item__group--title",
      (tds) =>
        tds.map((td) => {
          return td.innerText;
        })
    );

    const price = await page.$$eval(
      "ol li div .ui-search-item__group__element .ui-search-price.ui-search-price--size-medium .ui-search-price__second-line span .price-tag-amount",
      (tds) =>
        tds.map((td) => {
          return td.innerText;
        })
    );

    // const cents = await page.$$eval(
    //   "ol li div .ui-search-item__group__element .ui-search-price.ui-search-price--size-medium .ui-search-price__second-line span .price-tag-cents",
    //   (tds) =>
    //     tds.map((td) => {
    //       return tds[0].innerText;
    //     })
    // );

    const image = await page.$$eval(
      "ol li div .slick-slide.slick-active .ui-search-result-image__element ",
      (tds) =>
        tds.map((td) => {
          return td.getAttribute("src");
        })
    );

    for (
      let i = 0;
      i < title.length;
      i = !!title[i] ? i + 1 : (i = title.length)
    ) {
      const obj = <any>{};
      obj.title = title[i];
      obj.price = `${price[i]}`;
      obj.image = image[i];
      i + 2;
      api.push(obj);
    }

    await browser.close();

    return response.json(api);
  }
}

export { ScrappingMLController };
