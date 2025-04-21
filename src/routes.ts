import { Handler } from "worktop";
import * as Scrapers from "./scrapers";
import { Constants } from "./constants";
import * as Utils from "./utils";

const baseUrl = Constants.NyaaAltUrl;

export class Handlers {
  static Ping: Handler = function (_, res) {
    res.send(200, "Nyaa API v2 // Alive");
  };

  static GetInfoFromID: Handler = async function (req, res) {
    try {
      const id = req.params.id;
      const searchUrl = baseUrl + "/view/" + id;

      await Scrapers.fileInfoScraper(res, searchUrl);
    } catch (error) {
      res.send(404, "Not Found");
    }
  };

  static GetUserUploads: Handler = async function (req, res) {
    try {
      const username = req.params.username;
      const queryParams = Utils.getSearchParameters(req);

      // Updated search URL format
      const searchUrl = `${baseUrl}/user/${username}?p=${queryParams.page}&c=0_0`;

      console.log("Constructed Search URL:", searchUrl); // Debugging line

      await Scrapers.scrapeNyaa(res, searchUrl);
    } catch (error) {
      console.error("Error fetching user uploads:", error); // Enhanced error logging
      res.send(404, "Not Found");
    }
  };

  static GetCategoryTorrents: Handler = async function (req, res) {
    try {
      const cat = req.params.category;
      const subCat = req.params.subcategory;

      const category = Utils.getCategoryID(cat, subCat);
      const queryParams = Utils.getSearchParameters(req);

      // Updated search URL format
      const searchUrl = `${baseUrl}?p=${queryParams.page}&c=${category}`;

      console.log("Constructed Search URL:", searchUrl); // Debugging line

      await Scrapers.scrapeNyaa(res, searchUrl);
    } catch (error) {
      console.error("Error fetching category torrents:", error); // Enhanced error logging
      res.send(404, "Not Found");
    }
  };
}
