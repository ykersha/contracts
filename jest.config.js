/** @type {import('ts-jest').JestConfigWithTsJest} */

const tsPreset = require('ts-jest/jest-preset')
const dynamodbPreset = require('@shelf/jest-dynamodb/jest-preset')


module.exports = {
  verbose: true, 
  ...tsPreset,
  ...dynamodbPreset,
  //testEnvironment: 'node',
};