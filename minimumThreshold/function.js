const lambdaCfn = require('@mapbox/lambda-cfn');
const AWS = require('aws-sdk');

module.exports.fn = function(event, context, callback) {
  const options = {
    dispatchSnsArn: process.env.dispatchSnsArn,
    serviceId: process.env.pagerdutyServiceId
  }
  if (event.detail.severity >= process.env.minimumThresholdValue) {
    sendDispatchMessage(event, options, (err, res) => {
      if (err) return callback(err);
      return callback(null, res);
    })
  } else {
    callback(null, 'Event did not meet minimum threshold requirement.')
  }
};

function sendDispatchMessage(event, options, callback) {
  const sns = new AWS.SNS();
  const msg = {
    type: 'high',
    body: {
      pagerduty: {
        service: JSON.stringify(options.serviceId),
        title: JSON.stringify(event.detail.title),
        body: JSON.stringify(event.detail)
      }
    }
  };
  const params = {
    Message: JSON.stringify(msg),
    TopicArn: options.dispatchSnsArn
  };
  sns.publish(params, function(err,data) {
    if (err) return callback(err);
    return callback(null, data);
  });
};
