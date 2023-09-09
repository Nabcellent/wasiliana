# Wasiliana Api

[![build status][build-badge]][build]
[![code coverage][coverage-badge]][coverage]

[![npm version][version-badge]][package]
[![bundle size][minzip-badge]][bundlephobia]
[![npm downloads][downloads-badge]][npmtrends]
[![apache license][license-badge]][license]

[build-badge]: https://img.shields.io/github/actions/workflow/status/nabcellent/wasiliana/test.yml?branch=main&logo=github&style=flat-square
[build]: https://github.com/nabcellent/wasiliana/actions?query=workflow%3Avalidate
[coverage-badge]: https://img.shields.io/codecov/c/github/nabcellent/wasiliana.svg?token=UR29MJXL82&style=flat-square
[coverage]: https://codecov.io/github/nabcellent/wasiliana/
[version-badge]: https://img.shields.io/npm/v/@nabcellent/wasiliana.svg?style=flat-square
[package]: https://www.npmjs.com/package/@nabcellent/wasiliana
[minzip-badge]: https://img.shields.io/bundlephobia/minzip/@nabcellent/wasiliana.svg?style=flat-square
[bundlephobia]: https://bundlephobia.com/result?p=@nabcellent/wasiliana
[downloads-badge]: https://img.shields.io/npm/dm/@nabcellent/wasiliana.svg?style=flat-square
[npmtrends]: https://www.npmtrends.com/nabcellent/wasiliana
[license-badge]: https://img.shields.io/npm/l/@nabcellent/wasiliana.svg?style=flat-square
[license]: https://github.com/nabcellent/wasiliana/blob/main/LICENSE

This is a <i>Typescript</i> package that interfaces with the [Wasiliana](https://wasiliana.com/) Api.
The API enables you to initiate mobile Sms notifications.

## Documentation

### Installation

You can install the package via npm or yarn:
```bash
yarn add @nabcellent/wasiliana
```
### Getting Started
Initialize the Wasiliana class with your config.
```js
import { Wasiliana, WasilianaConfig } from '@nabcellent/wasiliana';

let config: WasilianaConfig = {
    apiKey   : process.env.WASILIANA_SMS_API_KEY,
    senderId : process.env.WASILIANA_SMS_SENDER_ID
};

const wasiliana = new Wasiliana(config);
```

- ### Sms
Enables you to send text messages

#### 1. Send Sms
```js
const response = await wasiliana.sms.text('#WasilianaTest').to(254123456789).send()
    //  OR
const response = await wasiliana.sms.text('#WasilianaTest').to([254123456789]).send()

//  Expected responses
[
    {
        code: 200,
        description: "Success",
        mobile: "254123456789",
        message_id: 75085465,
        client_sms_id: "1234",
        network_id: "2"
    },
    {
        code: 1004,
        description: "Low credit units...",
        mobile: "254123456789",
    }
]
```

#### 2. Calculate SMS Cost
Provide the text message.
```js
const response = wasiliana.sms.cost('Hello World.')

//  Expected response(number)
0.2
```

---

## Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) for details.

## Security

If you discover any security related issues, please email [nabcellent.dev@gmail.com](mailto:nabcellent.dev@gmail.com) instead of using the issue tracker.

## Credits

- [Nabcellent](https://github.com/Nabcellent)

[comment]: <> (- [All Contributors]&#40;../../contributors&#41;)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.