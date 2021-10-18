# assessment-capgemini

# Server side

1. Navigate into server folder where package.json live.
    1. - ``` npm install ```    install required packages
    2. - ``` npm run lint ```   run eslint if want to check
    3. - ``` npm run test ```   run test suites (server side)
    4. - ``` npm run dev  ```   run server


2. Didnt know well how to do the validation part so did an object of authUsers and save there every sent token and some user details.
- used that token/details to find the currentUser to check the role
- Also used it to check if an api call was sent with old token to refresh it
- So if server reset, cannot do the refresh token.

3. I thing can pass on reactClient folder, was just to check everything going well.

4. Token should arrive to the endpoint in format -> headers.authorization: "Bearer Token"

5. Cheers.