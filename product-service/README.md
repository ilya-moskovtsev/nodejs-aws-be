# product-service

Install npm packages
``` bash
$ npm install
```

Run function locally
``` bash
$ serverless invoke local --function getProductsList
```

Run tests
``` bash
$ npm test
```

Deploy project
``` bash
$ serverless deploy
```

Deploy a single function
``` bash
$ serverless deploy function --function getProductsById
```

Swagger file is hosted at https://app.swaggerhub.com/apis/ilya-moskovtsev/dev-product_service/2020-10-28