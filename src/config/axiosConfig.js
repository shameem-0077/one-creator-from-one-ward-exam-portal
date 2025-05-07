// First we need to import axios.js
import axios from "axios";

// Production configurations

export const prodAccountsConfig = axios.create({
  baseURL: "https://accounts.steyp.com",
});
export const prodLearnConfig = axios.create({
  baseURL: "https://learn.steyp.com/api/v1",
});
export const prodNotificationsConfig = axios.create({
  baseURL: "https://notifications.talrop.com/api/v1",
});
export const prodCoinsConfig = axios.create({
  baseURL: "https://coins.steyp.com/api/v1",
});

export const prodScholarshipConfig = axios.create({
  baseURL: "https://api-scholarship.steyp.com/",
});

// Development configurations
// Common configurations
const devAccountsConfig = axios.create({
  baseURL: "https://developers-accounts.talrop.com",
});
const devLearnConfig = axios.create({
  baseURL: "https://developers-learn.talrop.com/api/v1",
});
const devNotificationsConfig = axios.create({
  baseURL: "https://developers-notifications.talrop.com/api/v1",
});

const devCoinsConfig = axios.create({
  baseURL: "https://developers-coins.talrop.com/api/v1",
});

const devScholarshipConfig = axios.create({
  baseURL: "https://developers-steyp-scholarship.talrop.works/",
});

// const devScholarshipConfig = axios.create({
//   baseURL: "http://127.0.0.1:8013/",
// });

const environment = process.env.NEXT_PUBLIC_ENVIRONMENT;

const accountsConfig =
  environment === "development" ? devAccountsConfig : prodAccountsConfig;
const learnConfig =
  environment === "development" ? devLearnConfig : prodLearnConfig;
const notificationsConfig =
  environment === "development"
    ? devNotificationsConfig
    : prodNotificationsConfig;
const coinsConfig =
  environment === "development" ? devCoinsConfig : prodCoinsConfig;

const scholarshipConfig = environment === "development" ? devScholarshipConfig : prodScholarshipConfig;

export {
  accountsConfig,
  learnConfig,
  notificationsConfig,
  coinsConfig,
  scholarshipConfig
};

