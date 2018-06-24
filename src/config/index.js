import devConfig from "./config.development";
import prodConfig from "./config.production";
import testConfig from "./config.test";

const env = process.env.NODE_ENV || "development";

const config = {
    "development": devConfig,
    "production": prodConfig,
    "test": testConfig,
};

export default config[env];
