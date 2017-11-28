'use strict';

const lambdaCfn = require('@mapbox/lambda-cfn');

module.exports = lambdaCfn.build({
  name: 'minimumThreshold',
  parameters: {
    dispatchSnsArn: {
      Type: 'String',
      Description: 'Dispatch SNS ARN'
    },
    pagerdutyServiceId: {
      Type: 'String',
      Description: 'PagerDuty Service ID'
    },
    minimumThresholdValue: {
      Type: 'Number',
      Description: 'The minimum severity threshold for alarms (1-10)'
    }
  },
  statements: [
    {
      Effect: 'Allow',
      Action: 'sns:Publish',
      Resource: {
        Ref: 'dispatchSnsArn'
      }
    }
  ],
  eventSources: {
    cloudwatchEvent: {
      eventPattern: {
        'source': [ 'aws.guardduty' ]
      }
    }
  }
});
