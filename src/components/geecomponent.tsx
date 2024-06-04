import ee from "@google/earthengine";
import privatekey from "@/key.json";

const initializeEarthEngine = async () => {
  var runAnalysis = function () {
    ee.initialize(
      null,
      null,
      function () {
        var image = new ee.Image("srtm90_v4");
        image.getMap({ min: 0, max: 1000 }, function (map: any) {
          console.log(map);
        });
        console.log("authenticated successfully");
      },
      function (e: string) {
        console.error("Initialization error: " + e);
      },
      null,
      "reboot-earth"
    );
  };
  // Authenticate using a service account.
  ee.data.authenticateViaPrivateKey(
    privatekey,
    runAnalysis,
    function (e: string) {
      console.error("Authentication error: " + e);
    }
  );
};

const GoogleEarthEngine = async () => {
  const gee = await initializeEarthEngine();
  var image = new ee.Image("srtm90_v4");
        image.getMap({ min: 0, max: 1000 }, function (map: any) {
          console.log(map);
        });
  return (
    <div>
      <p>Processed NDVI data available:</p>
    </div>
  );
};

export default GoogleEarthEngine;
