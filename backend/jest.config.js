export default {
  testEnvironment: "node",
  transform: {},
  moduleFileExtensions: ["js", "json", "node"],
  testMatch: ["**/tests/**/*.test.js"],
  collectCoverageFrom: [
    "**/*.js", 
    "!**/node_modules/**", 
    "!**/tests/**",
    "!jest.config.js",
    "!**/coverage/**"
  ],
};