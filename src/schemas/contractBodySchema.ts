export default {
  type: 'object',
  properties: {
    userID: { type: 'string' },
    contractName: { type: 'string' },
    templateID: { type: 'string' }
  },
  required: ['userID', 'contractName', 'templateID'],
} as const;