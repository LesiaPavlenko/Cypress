const { defineConfig } = require("cypress");
const fs = require("fs");
const path = require("path");

function loadEnv(configName) {
  const filePath = path.resolve("cypress/config", `${configName}.json`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Config file not found: ${filePath}`);
  }

  return JSON.parse(fs.readFileSync(filePath));
}

module.exports = defineConfig({
  projectId: "185shv",

  reporter: "mochawesome",
  reporterOptions: {
    reportDir: "cypress/reports",
    overwrite: false,
    html: true,
    json: true
  },

  e2e: {
    setupNodeEvents(on, config) {
      const configName = config.env.config || "qautoPositive";
      const envConfig = loadEnv(configName);

      config.baseUrl = envConfig.baseUrl;
      config.env = {
        ...config.env,
        ...envConfig
      };

      return config;
    }
  }
});
