class GuestBooking {
    constructor() {
        this.divContainer = document.getElementById('divBookingContainer');

        this.divGuestClassBookingModal = this.divContainer.querySelector('#divGuestClassBookingModal');
        this.guestClassBookingModal = new bootstrap.Modal(this.divGuestClassBookingModal);
        this.inputDanceClassId = this.divContainer.querySelector('#inputDanceClassId');

        this.formAccountUserBookClass = this.divContainer.querySelector('#formAccountUserBookClass');
        this.inputName = this.formAccountUserBookClass.querySelector('#inputName');
        this.inputEmail = this.formAccountUserBookClass.querySelector('#inputEmail');
        this.accountUserInputDanceClassId = this.formAccountUserBookClass.querySelector('#accountUserInputDanceClassId');
    }

    //#region Init

    static Init_GuestUser() {
        new GuestBooking().#init_GuestUser();
    }
    #init_GuestUser() {
        this.BindEvent_ShowEditClassDetailsModal();
    }

    static Init_AccountUser(name, email) {
        new GuestBooking().#init_AccountUser(name, email);
    }

    #init_AccountUser(name, email) {
        this.inputName.value = name;
        this.inputEmail.value = email;
        this.BindEvent_AccountUserBookClass();
    }

    //#endregion


    //#region ShowEditClassDetailsModal

    BindEvent_ShowEditClassDetailsModal() {
        //get all book class buttons and add onclick event to each of them
        const bookClassButtons = this.divContainer.querySelectorAll('[data-btnBookClass]');
        bookClassButtons.forEach((btnEl) => {
            btnEl.addEventListener('click', (e) => this.ShowGuestClassBookingModal(btnEl));
        });
    }

    ShowGuestClassBookingModal(btnEl) {
        //update modal form input values
        this.inputDanceClassId.value = btnEl.getAttribute('data-danceClassId');

        //show modal
        this.guestClassBookingModal.show();
    }

    //#endregion


    //#region AccountUserBookClass

    BindEvent_AccountUserBookClass() {
        //get all book class buttons and add onclick event to each of them
        const bookClassButtons = this.divContainer.querySelectorAll('[data-btnBookClass]');
        bookClassButtons.forEach((btnEl) => {
            btnEl.addEventListener('click', (e) => this.AccountUserBookClass(btnEl));
        });
    }

    AccountUserBookClass(btnEl) {
        this.accountUserInputDanceClassId.value = btnEl.getAttribute('data-danceClassId');
        this.formAccountUserBookClass.submit();
    }

    //#endregion
}