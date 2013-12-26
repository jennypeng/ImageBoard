
imgur anonymous upload in nodejs using the imgur api.

## Getting Started
Install the module with: `npm install imgur-upload`

```javascript
var imgur = require('imgur-upload'),
path = require('path');

imgur.setClientID(myClientID);
imgur.upload(path.join(__dirname, 'someimage.png'),function(err, res){
	console.log(res.data.link); //log the imgur url
});
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
 * 0.1.2: Fix to Handle non-JSON API responses as errors
 * 0.1.1: Initial release

## License
Copyright (c) 2013 adamcoulombe  
Licensed under the MIT license.
