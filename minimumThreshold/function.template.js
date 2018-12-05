'use strict';

const lambdaCfn = require('@mapbox/lambda-cfn');
const cf = require('@mapbox/cloudfriend');

const lambdaTemplate = lambdaCfn.build({
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

delete lambdaTemplate.Parameters.CodeS3Bucket;
delete lambdaTemplate.Parameters.CodeS3Prefix;
delete lambdaTemplate.Resources.minimumThreshold.Properties.Environment.Variables.CodeS3Bucket;
delete lambdaTemplate.Resources.minimumThreshold.Properties.Environment.Variables.CodeS3Prefix;

lambdaTemplate.Resources.minimumThreshold.Properties.Code.S3Bucket = cf.join('-', ['utility', cf.accountId, cf.region]);
lambdaTemplate.Resources.minimumThreshold.Properties.Code.S3Key = cf.join('', ['bundles/patrol-rules-guardduty/', cf.ref('GitSha'), '.zip']);

module.exports = lambdaTemplate;
