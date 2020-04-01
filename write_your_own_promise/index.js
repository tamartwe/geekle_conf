class PromiseSimple {
    constructor(executionFunction) {
      this.promiseChain = [];
      this.handleError = () => {};
  
      this.onResolve = this.onResolve.bind(this);
      this.onReject = this.onReject.bind(this);
  
      executionFunction(this.onResolve, this.onReject);
    }
  
    then(onResolve) {
      this.promiseChain.push(onResolve);
  
      return this;
    }
  
    catch(handleError) {
      this.handleError = handleError;
  
      return this;
    }
  
    onResolve(value) {
      let storedValue = value;
  
      try {
        this.promiseChain.forEach((nextFunction) => {
           storedValue = nextFunction(storedValue);
        });
      } catch (error) {
        this.promiseChain = [];
  
        this.onReject(error);
      }
    }
  
    onReject(error) {
      this.handleError(error);
    }
  }
  
  fakeApiBackend = () => {
    const user = {
      username: 'Tamar Twena Stern',
      favoriteNumber: 30,
      profile: 'localhost:3000/api/'
    };
  
    if (Math.random() > .05) {
      return { 
        data: user, 
        statusCode: 200,
      };
    } else {
      const error = {
        statusCode: 404,
        message: 'Could not find user',
        error: 'Not Found',
      };
      
      return error;
    }
  };
  
  const makeApiCall = () => {
    return new PromiseSimple((resolve, reject) => {
      setTimeout(() => {
        const apiResponse = fakeApiBackend();
        if (apiResponse.statusCode >= 400) {
          reject(apiResponse);
        } else {
          resolve(apiResponse.data);
        }
      }, 5000);
    });
  };
  
  makeApiCall()
    .then((user) => {
      console.log('In the first then');
      return user;
    })
    .then((user) => {
      console.log(`User ${user.username}'s favorite number is ${user.favoriteNumber}`);
    
      return user;
    })
    .then((user) => {
      console.log('The previous .then() told you the favoriteNumber')
    
      return user.profile;
    })
    .then((profile) => {
      console.log(`The profile URL is ${profile}`);
    })
    .then(() => {
      console.log('This is the last then()');
    })
    .catch((error) => {
      console.log(error.message);
    });