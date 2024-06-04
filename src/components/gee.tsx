import ee from "@google/earthengine";
import privatekey from "@/key.json";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import MapComponent from "./openlayer";
// Function to initialize Earth Engine and handle authentication
const runAnalysis = () => {
  return new Promise<void>((resolve, reject) => {
    ee.initialize(
      null,
      null,
      () => {
        console.log("Authenticated and initialized successfully");
        resolve();
      },
      (e: string) => {
        console.error("Initialization error: " + e);
        reject(new Error("Initialization error: " + e));
      },
      null
    );
  });
};

// Function to authenticate Earth Engine using a service account
const initializeEarthEngine = async () => {
  return new Promise<void>((resolve, reject) => {
    ee.data.authenticateViaPrivateKey(
      privatekey,
      async () => {
        console.log("Authenticated successfully");
        try {
          await runAnalysis();
          resolve();
        } catch (error) {
          reject(error);
        }
      },
      (e: string) => {
        console.error("Authentication error: " + e);
        reject(new Error("Authentication error: " + e));
      }
    );
  });
};

// Next.js page component that runs Earth Engine operations
const GoogleEarthEngine = async () => {
  try {
    await initializeEarthEngine();
    console.log("Earth Engine initialized");
    var countries = ee.FeatureCollection("FAO/GAUL/2015/level0");

    var visParamsCountries = {
      color: "black",
      fillColor: "00000000",
    };

    var countriesImage = ee
      .Image()
      .paint(countries, visParamsCountries.color, 2);

    // Visualization parameters for countries
    var visParams = {
      palette: ["000000"],
    };

    const map = await countriesImage.visualize(visParams).getMap();

    //  const map = await ndvi_anomaly.mean().visualize(visParams).getMap();

    const tileUrl:string = map.urlFormat;
    const osmUrl = 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    console.log(tileUrl);
    /*   */
    return (
      <div className="bg-white">
        <h1 className="h-20 border border-zinc-400 text-xl text-zinc-800 bg-zinc-100 ">
          Google Earth Engine NDVI Data
        </h1>
        <div className="flex bg-zinc-200 ">
          <div className="basis-3/12 bg-zinc-100 "></div>
          <div className="basis-9/12 w-full h-[80%]">
            <MapComponent mapUrl1={tileUrl} mapUrl2={osmUrl} />
          </div>
        </div>

        {/* */}
      </div>
    );
  } catch (error: any) {
    console.error(error);
    return (
      <div>
        <p>Error in processing NDVI data: {error.message}</p>
      </div>
    );
  }
};

export default GoogleEarthEngine;
