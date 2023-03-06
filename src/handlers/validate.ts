import { verify } from 'jsonwebtoken';

async function validate(event) {

    const authorizerToken:string = event.authorizationToken;
    const authorizerArr: string[] = authorizerToken.split(' ');
    const token: string = authorizerArr[1];

    if(authorizerArr.length !== 2 || authorizerArr[0] !== 'Bearer' || authorizerArr[1].length === 0){
      return generatePolicy('undefined', "Deny", event.methodArn);
    }

    let decodedJwt = <any>verify(token, process.env.JWT_SECRET);
    
    if(typeof decodedJwt.username !== 'undefined' && typeof decodedJwt.exp !== 'undefined' && decodedJwt.exp > Date.now()/1000){
        return generatePolicy(decodedJwt.username, "Allow", event.methodArn);
    }

    generatePolicy('undefined', "Deny", event.methodArn);
}

export const handler = validate;

const generatePolicy = function (principalId, effect, resource) {

  let authResponse = <any>{
      principalId
  };

  if (effect && resource) {
      authResponse = {
          principalId,
          policyDocument: {
              Version: '2012-10-17',
              Statement: [
                  {
                      Action: 'execute-api:Invoke',
                      Effect: effect,
                      Resource: resource
                  }
              ]
          },
      };
  }
  return authResponse
}