# patrol-rules-guardduty

[![Build Status](https://travis-ci.com/mapbox/patrol-rules-guardduty.svg?token=cq49erYn5z51L7uuEijr&branch=master)](https://travis-ci.com/mapbox/patrol-rules-guardduty)

A set of [Patrol functions](https://github.com/mapbox/patrol) for AWS GuardDuty. Patrol-rules-guardduty publishes SNS messages to [Dispatch](https://github.com/mapbox/dispatch) for interactive alarm routing.

## Functions

### `minimumThreshold`

- **Description** - Processes new AWS GuardDuty alerts and sends alerts meeting a minimum serverity threshold to an SNS topic.
- **Trigger** - `aws.guardduty` API calls
- **Parameters**
  - `dispatchSnsArn` - SNS topic ARN for your [dispatch-incoming](https://github.com/mapbox/dispatch#5-deploy-the-dispatch-incoming-aws-lambda-function) AWS Lambda function
  - `pagerdutyServiceId` - PagerDuty service ID
  - `minimumThreshold` - A number for the minimum severity threshold for GuardDuty alerts. To receive all GuardDuty alerts, use `2`. For medium alerts and above, use `5`. For high, use `8`.

## Deploying to AWS

## Prequisites

To deploy patrol-rules-guardduty, you'll need to install [lambda-cfn](https://github.com/mapbox/lambda-cfn/) locally as well as setup and deploy [Dispatch](https://github.com/mapbox/dispatch#set-up) on your AWS infrastructure.

This project uses [lambda-cfn](https://github.com/mapbox/lambda-cfn/) to manage and deploy [AWS CloudFormation](https://aws.amazon.com/cloudformation/) templates. Check out the [lambda-cfn](https://github.com/mapbox/lambda-cfn) and [Patrol](https://github.com/mapbox/patrol) README's for instructions on how to use [lambda-cfn](https://github.com/mapbox/lambda-cfn) with [Patrol](https://github.com/mapbox/patrol) projects.

### Install lambda-cfn

To install lambda-cfn on your machine, run `npm install -g @mapbox/lambda-cfn`.

More instructions are available in the [lambda-cfn README](https://github.com/mapbox/lambda-cfn#installation).

### Deploy Dispatch

Check out the [Dispatch setup instructions](https://github.com/mapbox/dispatch#set-up) for detailed instructions on how to deploy Dispatch to your AWS infrastructure.

### Deploy patrol-rules-guardduty functions 

Use [lambda-cfn](https://github.com/mapbox/lambda-cfn) to deploy each patrol-rules-guardduty function. Each AWS Lambda function is its own AWS CloudFormation stack.

For example, to create a development stack for the `minimumThreshold` function:

```js
git clone git@github.com:mapbox/patrol-rules-guardduty.git
cd patrol-rules-guardduty/minimumThreshold
lambda-cfn create dev
```

Lambda-cfn will ask for parameter values when creating new CloudFormation stacks. Check out the guide to [lambda-cfn parameter values](https://github.com/mapbox/lambda-cfn#providing-parameter-values) and the [functions section](#Functions) for help.

## Local Development

### Installation

Patrol-rules-guardduty uses Node 6.10.3 on the [AWS Lambda runtime environment](https://docs.aws.amazon.com/lambda/latest/dg/current-supported-versions.html).

```sh
git clone git@github.com:mapbox/patrol-rules-guardduty.git
cd patrol-rules-guardduty
npm install
```

### Tests

Patrol-rules-guardduty uses [eslint](https://github.com/eslint/eslint) for linting and [tape](https://github.com/substack/tape) for tests. It mocks HTTP requests with [nock](https://github.com/node-nock/nock). Tests run on Travis CI after every commit.

* `npm test` will run eslint then tape.
* `npm run lint` will only run eslint.
* `npm run unit-test` will only run tape tests.