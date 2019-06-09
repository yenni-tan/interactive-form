
// Form focuses on Name input on load
$('#name').focus();

// Job Role 
/**
 * If 'Other' Job Role selected, show input for user to input job role.
 */
$('#other-title').hide();
const $title = $('#title');
$title.on('change', function($event) {
    if ($event.target.value === 'other') {
        $('#other-title').show();
    } else {
        $('#other-title').hide();
    }
})

// T-Shirt Info
const $design = $('#design');
const $color = $('#color');

/**
 * Only show available colors for theme selected.
 */
const designToColors = {};
designToColors['js puns'] = ['cornflowerblue', 'darkslategrey', 'gold'];
designToColors['heart js'] = ['tomato', 'steelblue', 'dimgrey'];

$design.on('change', function($event) {
    $.each($('#color option'), function(index, color) {
        const colors = designToColors[$event.target.value];
        if (colors) {
            if (colors.includes(color.value)) {
                $(this).show();
                if (colors[0] === color.value) {
                    color.selected = true;
                }
            } else {
                $(this).hide();
            }   
        } else {
            $(this).show();
        }
        
    });
});

// Register for Activities
const $activityCheckboxes = $('.activities label input');
const overlappingActivities = ['js-libs', 'js-frameworks', 'express', 'node'];

/**
 * Calculate Total cost of activities selected.
 */
const costRegex = /\d{3}/;
let runningTotal = 0;
const totalSpan = $(`<span id="total">Total: \$${runningTotal}</span>`);
$('.activities').append(totalSpan);

$activityCheckboxes.change(function() {
    const isChecked = $(this).prop('checked');
    const name = $(this).attr('name');

    if (overlappingActivities.includes(name)) {
        disableEnableOverlappingActivity(name, isChecked, $(this).parent());
    }

    if (isChecked) {
        runningTotal += parseInt($(this).parent().text().match(costRegex));
    } else {
        runningTotal -= parseInt($(this).parent().text().match(costRegex));
    }
    $('#total').text( `Total: \$${runningTotal}`);
});

/**
 * Disable or Enable an overlapping activity.
 */
function disableEnableOverlappingActivity(name, isChecked, parent) {
    let overlappingActivity;
    if (['js-frameworks', 'js-libs'].includes(name)) {
        overlappingActivity =  parent.next().next().children()[0];
    } else if (['express', 'node'].includes(name)) {
        overlappingActivity =  parent.prev().prev().children()[0];
    }
    
    if (isChecked) {
        overlappingActivity.disabled = true;
    } else {
        overlappingActivity.disabled = false;
    }    
}

/**
 * Validation Toggles
 */
let isNameValid = false;
let isEmailValid = false;
let isActivitySelected = false;
let isCreditCardNumberValid = false;
let isCreditCardZipValid = false;
let isCreditCardCvvValid = false;
let isCreditCardPaymentSelected = true;

// Payment Info
$('#payment').val('credit card');
$('#payment option[value="select_method"]').prop('disabled', true);

/**
 * Show credit card payment inputs.
 */
function showCreditCardPaymentInfo() {
    $('#credit-card').show();
    $('#paypal').hide();
    $('#bitcoin').hide();
}

showCreditCardPaymentInfo();

/**
 * Show pertaining information based on selected payment method.
 */
$('#payment').change(function() {
    if ($('#payment').val() === 'credit card') {
        showCreditCardPaymentInfo();
        isCreditCardPaymentSelected = true;
    } else if ($('#payment').val() === 'paypal') {
        $('#credit-card').hide();
        $('#paypal').show();
        $('#bitcoin').hide();
        isCreditCardPaymentSelected = false;
        validateForm();
    } else if ($('#payment').val() === 'bitcoin') {
        $('#credit-card').hide();
        $('#paypal').hide();
        $('#bitcoin').show();
        isCreditCardPaymentSelected = false;
        validateForm();
    }
});

// Form Validation
$('#submit-button').addClass('disabled').prop('disabled', true);

/**
 * Validate all form fields to determine if submit button should be enabled or disabled.
 */
function validateForm() {
    if (isCreditCardPaymentSelected) {
        if (isNameValid 
            && isEmailValid
            && isActivitySelected
            && isCreditCardNumberValid
            && isCreditCardZipValid
            && isCreditCardCvvValid) {
            $('#submit-button').removeClass('disabled').prop('disabled', false)
        } else {
            $('#submit-button').addClass('disabled').prop('disabled', true);
        }
    } else {
        if (isNameValid 
            && isEmailValid
            && isActivitySelected) {
                $('#submit-button').removeClass('disabled').prop('disabled', false)
        } else {
            $('#submit-button').addClass('disabled').prop('disabled', true);
        }
    }
}

/**
 * Validate name cannot be blank.
 */
const nameError = $('<span id="name-error" class="error">Name field can\'t be blank.</span>').hide();
$('#name').after(nameError);

const nameRegex = /[A-Za-z,.\-' ]+/;

$('#name').blur(function() {
    if (!nameRegex.test($('#name').val())) {
        $('#name-error').show();
        $('#name').addClass('error-border');
        isNameValid = false;
        validateForm();
    } else {
        $('#name-error').hide();
        $('#name').removeClass('error-border');
        isNameValid = true;
        validateForm();
    }
});

/**
 * Validate email must be valid.
 */
const emailError = $('<span id="email-error" class="error">Email field must be a validly formatted e-mail address.</span>').hide();
$('#mail').after(emailError);

const emailRegex = /[^@]+@[^@]+\..+/;
$('#mail').blur(function() {
    if (!emailRegex.test($('#mail').val())) {
        $('#email-error').show();
        $('#mail').addClass('error-border');
        isEmailValid = false;
        validateForm();
    } else {
        $('#email-error').hide();
        $('#mail').removeClass('error-border');
        isEmailValid = true;
        validateForm();
    }
});

/**
 * Validate User must select at least one checkbox under the "Register for Activities" section.
 */
const activityError = $('<span id="activity-error" class="error">You must select at least one activity.</span>').hide();
$('.activities').after(activityError);

$('.activities label input').change(function() {
    let activitySelected = false;
    $('.activities label input').each(function() {
        if($(this).prop('checked')) {
            activitySelected = true;
        }
    });
    if (!activitySelected) {
        $('.activities label input').each(function() {
            $(this).addClass('error-outline');
        });
        $('#activity-error').show();
        isActivitySelected = false;
        validateForm();
    } else {
        $('.activities label input').each(function() {
            $(this).removeClass('error-outline');
        });
        $('#activity-error').hide();
        isActivitySelected = true;
        validateForm();
    }
});

/**
 * Verify Credit Card Payment Info.
 */
const creditCardNumberError = $('<span id="credit-card-number-error" class="error">Invalid credit card number - must be between 13 and 16 digits.</span>').hide();
const creditCardZipError = $('<span id="credit-card-zip-error" class="error">Invalid zip code - must be 5 digits.</span>').hide();
const creditCardCvvError = $('<span id="credit-card-cvv-error" class="error">Invalid CVV - must be 3 digits.</span>').hide();
$('#cc-num').after(creditCardNumberError);
$('#zip').after(creditCardZipError);
$('#cvv').after(creditCardCvvError);

const creditCardNumRegex = /^\d{13,16}$/;
const creditCardZipRegex = /^\d{5}$/;
const creditCardCvvRegex = /^\d{3}$/;
$('#cc-num').blur(function() {
    if (!creditCardNumRegex.test($(this).val())) {
        $('#credit-card-number-error').show();
        $('#cc-num').addClass('error-border');
        isCreditCardNumberValid = false;
        validateForm();
    } else {
        $('#credit-card-number-error').hide();
        $('#cc-num').removeClass('error-border');
        isCreditCardNumberValid = true;
        validateForm();
    }
});

$('#zip').blur(function() {
    if (!creditCardZipRegex.test($(this).val())) {
        $('#credit-card-zip-error').show();
        $('#zip').addClass('error-border');
        isCreditCardZipValid = false;
        validateForm();
    } else {
        $('#credit-card-zip-error').hide();
        $('#zip').removeClass('error-border');
        isCreditCardZipValid = true;
        validateForm();
    }
});

$('#cvv').blur(function() {
    if (!creditCardCvvRegex.test($(this).val())) {
        $('#credit-card-cvv-error').show();
        $('#cvv').addClass('error-border');
        isCreditCardCvvValid = false;
        validateForm();
    } else {
        $('#credit-card-cvv-error').hide();
        $('#cvv').removeClass('error-border');
        isCreditCardCvvValid = true;
        validateForm();
    }
});