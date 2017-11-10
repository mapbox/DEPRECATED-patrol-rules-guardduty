'use strict';

const tape = require('tape');
const minimumThreshold = require('../../minimumThreshold/function.js');
const AWS = require('aws-sdk');
const nock = require('nock');

AWS.config.update({
  'region': 'us-east-1',
  'sslEnabled': true,
  'accessKeyId': 'fakeAccessKeyId',
  'secretAccessKey': 'fakeSecretAccessKey'
});

process.env.dispatchSnsArn = 'arn:aws:sns:us-east-1:11111:dispatch-incoming'
process.env.pagerdutyServiceId = 'TEST'
process.env.minimumThresholdValue = 4

tape('Meets threshold; sends to dispatch', t => {

  const event = {
    detail: {
      title: 'test',
      severity: 6
    }
  };
  const metadataResponse = {
    ResponseMetadata: {
      RequestId: 'test-data-test' },
    MessageId: 'test-data-test'
  }

  nock('https://sns.us-east-1.amazonaws.com:443', {"encodedQueryParams":true})
    .post('/', "Action=Publish&Message=%7B%22type%22%3A%22high%22%2C%22body%22%3A%7B%22pagerduty%22%3A%7B%22service%22%3A%22%5C%22TEST%5C%22%22%2C%22title%22%3A%22%5C%22test%5C%22%22%2C%22body%22%3A%22%7B%5C%22title%5C%22%3A%5C%22test%5C%22%2C%5C%22severity%5C%22%3A6%7D%22%7D%7D%7D&TopicArn=arn%3Aaws%3Asns%3Aus-east-1%3A11111%3Adispatch-incoming&Version=2010-03-31")
    .reply(200, "<PublishResponse xmlns=\"http://sns.amazonaws.com/doc/2010-03-31/\">\n  <PublishResult>\n    <MessageId>test-data-test</MessageId>\n  </PublishResult>\n  <ResponseMetadata>\n    <RequestId>test-data-test</RequestId>\n  </ResponseMetadata>\n</PublishResponse>\n");

  minimumThreshold.fn(event, {}, (err, res) => {
    t.error(err, 'does not error')
    t.deepEqual(metadataResponse, res, 'message sent to Dispatch');
    t.end();
  })
});

tape('Does not meet threshold; no dispatch', t => {

  const event = {
    detail: {
      title: 'test',
      severity: 1
    }
  };

  nock('https://sns.us-east-1.amazonaws.com:443', {"encodedQueryParams":true})
    .post('/', "Action=Publish&Message=%7B%22type%22%3A%22high%22%2C%22body%22%3A%7B%22pagerduty%22%3A%7B%22service%22%3A%22%5C%22TEST%5C%22%22%2C%22title%22%3A%22%5C%22test%5C%22%22%2C%22body%22%3A%22%7B%5C%22title%5C%22%3A%5C%22test%5C%22%2C%5C%22severity%5C%22%3A1%7D%22%7D%7D%7D&TopicArn=arn%3Aaws%3Asns%3Aus-east-1%3A11111%3Adispatch-incoming&Version=2010-03-31")
    .reply(200);

  minimumThreshold.fn(event, {}, (err, res) => {
    t.error(err, 'does not error')
    t.deepEqual('Event did not meet minimum threshold requirement.', res, 'message not sent to Dispatch');
    t.end();
  })
});
