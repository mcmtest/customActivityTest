define([
    'postmonger'
], function (
    Postmonger
) {
    'use strict';

    var eventDefinitionKey;
    var connection = new Postmonger.Session();
    var payload = {};
    var lastStepEnabled = false;

    var steps = [ // initialize to the same value as what's set in config.json for consistency
        { "label": "First Step", "key": "step1" }
    ];

    var currentStep = steps[0].key;
    connection.on('clickedNext', onClickedNext);
    connection.on('clickedBack', onClickedBack);
    connection.on('gotoStep', onGotoStep);

    $(window).ready(onRender);

    connection.on('initActivity', initialize);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);

    connection.on('clickedNext', save);
    connection.on('clickedBack', onClickedBack);
    connection.on('gotoStep', onGotoStep);

    connection.on('requestedInteraction', function (settings) {
        eventDefinitionKey = settings.triggers[0].metaData.eventDefinitionKey;
        console.log("eventDefinitionKey----->" + eventDefinitionKey);
    });

    function onRender() {
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger('ready');
        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');
        connection.trigger('requestInteraction');
    }


    function initialize(data) {
        console.log("Initializing data data: " + JSON.stringify(data));
        if (data) {
            payload = data;
        }

        var hasInArguments = Boolean(
            payload['arguments'] &&
            payload['arguments'].execute &&
            payload['arguments'].execute.inArguments &&
            payload['arguments'].execute.inArguments.length > 0
        );

        var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};

        console.log('Has In arguments: ' + JSON.stringify(inArguments));

        $.each(inArguments, function (index, inArgument) {
            $.each(inArgument, function (key, val) {
            })
        });

        connection.trigger('updateButton', {
            button: 'nextStep',
            text: 'Next',
            visible: true
        });

    }

    //multiwizard setup
    function onClickedNext() {
        if (currentStep.key === 'step1') {
            save();
        }
        else {
            connection.trigger('nextStep');
        }
    }

    function onClickedBack() {
        connection.trigger('prevStep');
    }
    function onGotoStep(step) {
        showStep(step);
        connection.trigger('ready');
    }

    function showStep(step, stepIndex) {
        if (stepIndex && !step) {
            step = steps[stepIndex - 1];
        }

        currentStep = step;

        $('.step').hide();

        switch (currentStep.key) {
            case 'step1':
                if ($('#smsType').val() != 'OrderStatus' || $('#smsType').val() != 'Signup' || $('#smsType').val() != 'Inventory') {
                    $('#smsType').val() ='Your entered text is not correct!';
                }
                else {
                    $('#step1').show();
                    break;
                }

        }
    }


    //multiwizard End
    function onGetTokens(tokens) {
        // Response: tokens = { token: <legacy token>, fuel2token: <fuel api token> }
        console.log("Tokens function: " + JSON.stringify(tokens));
        //authTokens = tokens;
    }

    function onGetEndpoints(endpoints) {
        // Response: endpoints = { restHost: <url> } i.e. "rest.s1.qa1.exacttarget.com"
        console.log("Get End Points function: " + JSON.stringify(endpoints));
    }

    function save() {

        var smsType = $('#smsType').val();
        if (smsType == 'OrderStatus') {
            payload['arguments'].execute.inArguments = [{
                "email": "{{Event." + eventDefinitionKey + ".EmailType}}",
                "orderID": "{{Event." + eventDefinitionKey + ".orderID}}",
                "IPAddress": "{{Event." + eventDefinitionKey + ".IPAddress}}",
                "LineItemXML": "{{Event." + eventDefinitionKey + ".LineItemXML}}",
                "phoneNumber": "{{Event." + eventDefinitionKey + ".billingAddressPhoneNumber}}"

            }];
        }
        if (smsType == 'Signup') {
            payload['arguments'].execute.inArguments = [{
                "phoneNumber": "{{Event." + eventDefinitionKey + ".mobilephone}}",
                "email": "SignUp"
            }];
        }
        if (smsType == 'Inventory') {
            payload['arguments'].execute.inArguments = [{
                "productName": "{{Event." + eventDefinitionKey + ".ProductName}}",
                "SKU": "{{Event." + eventDefinitionKey + ".SKU}}",
                "phoneNumber": "{{Event." + eventDefinitionKey + ".mobilephone}}",
                "email": "Inventory"
            }];
        }

        payload['metaData'].isConfigured = true;

        console.log("Payload on SAVE function: " + JSON.stringify(payload));
        connection.trigger('updateActivity', payload);

    }
});
