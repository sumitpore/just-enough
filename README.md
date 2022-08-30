# JustEnough

In this era where we've tons of full fledged UI frameworks like React or Vue, you'll need something like 'JustEnough' if you want to quickly build some small browser page/app/tool that doesn't require complexity of the full framework.

An example of this is: [https://sumitpore.in/unstyled-html-tool/](https://sumitpore.in/unstyled-html-tool/)

This super-micro-library contain three concepts
1. ControllersRegistry - This holds objects of all controllers
2. Controllers - UI Controller
3. EventBinder - Reads HTML and binds event listener callbacks.

## Example
```html
<form>
    <button type="button" data-event-click="FormValidatorController:validateForm, SubmitFormController:submitForm">Submit</button>
</form>

<script src="path/to/just-enough.js"></script>

<script>
    class FormValidatorController extends Controller {

        _isInvalidFormSubmission = false;

        constructor() {
            super();
            this.validateForm = this.validateForm.bind(this);
        }

        validateForm(event) {
            //performed some checks and turned out that form is invalid.
            this._isInvalidFormSubmission = true;

            alert('Form is invalid');
        }

        isInvalidSubmission() {
            return this._isInvalidFormSubmission;
        }
    }

    class SubmitFormController extends Controller {

        constructor() {
            super();
            this.submitForm = this.submitForm.bind(this);

            // get object of FormValidatorController.
            this.formValidator = ControllersRegistry.getController('FormValidatorController');
        }

        submitForm(event) {

            // Don't process the form if form submission is invalid.
            if(this.formValidator.isInvalidSubmission()) {
                return;
            }

            // Continue processing form submission if the form is valid.
        }

    }

    // Need to call this only once at the bottom of the page.
    EventBinder.addEventListeners();
</script>
```

In above example, we are trying to do two things when user `clicks` 'Submit' button
1. Validate Form
2. Submit Form
---

In second-last line of the example above, `EventBinder.addEventListeners()` will automatically read `data-event-click="FormValidatorController:validateForm, SubmitFormController:submitForm"` added on the 'Submit' button and register two event listeners on click event i.e.
1. It will request for object of `FormValidatorController` from `ControllersRegistry` and bind the object's `validateForm`  to the click event.
2. It will request for object of `SubmitFormController` from `ControllersRegistry` and bind the object's `submitForm` method the click event.

> `EventBinder.addEventListeners()` detects `data-event-*` attributes added to HTML tags and bind controller methods to the respective events.

---

`SubmitFormController` needs to know whether form is valid or not before processing the submission. Therefore, it requests for the object of `FormValidatorController` with this line `this.formValidator = ControllersRegistry.getController('FormValidatorController');`

This covers it!

## Additional Info
- If you don't want `EventBinder` to scan entire HTML to register events and would like to register events added on a specific element, you can call
```js
    EventBinder.addEventListener(PASS OBJECT OF ELEMENT)
```

- Creating Controllers is a must for things to work properly.
- If you want to access the element on which event is triggered, use `event.target` inside a controller method.
- To make sure that one method of a class can call other method in the class, bind context for the method in the contructor. e.g.
```js
    this.validateForm = this.validateForm.bind(this);
```