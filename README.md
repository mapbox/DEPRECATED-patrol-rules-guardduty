### We are in a private beta with GuardDuty. Everything in this repo is under an NDA.

[![Build Status](https://travis-ci.com/mapbox/patrol-rules-guardduty.svg?token=HxVxtqNTNCeG9q7L4aWp&branch=dispatch)](https://travis-ci.com/mapbox/patrol-rules-guardduty)

# Patrol Rules GuardDuty
These are [patrol rules](https://github.com/mapbox/patrol) for GuardDuty, which sends the alerts you want to PagerDuty. Patrol is part of Mapbox's security framework.

Currently, there is one patrol rule, `minimumThreshold`, which allows you to configure what severity level (low, medium, or high) you want to be alerted on.

## Dependencies
This project uses [dispatch](https://github.com/mapbox/dispatch) to route AWS events over to PagerDuty and [lambda-cfn]() to deploy the functions. You will need to [deploy dispatch](https://github.com/mapbox/dispatch#set-up) on AWS and install lambda-cfn locally.

## Deployment Instructions
1. Deploy dispatch.
1. Deploy `minimumThreshold` via [lambda-cfn](https://github.com/mapbox/lambda-cfn#creating-new-lambda-functions)
    1. Below are the parameters that will need to be specified at deployment:
        1. `dispatchSnsArn`: The SNS for your dispatch-incoming stack
        1. `pagerdutyServiceId`: The service ID for PagerDuty
        1. `minimumThreshold`: A numerical value for the lowest type of alerts. For everything, specify 2 for low alerts. For meidum and above, specify 5. For high, specify 8.
