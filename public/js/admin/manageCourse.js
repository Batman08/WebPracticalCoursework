class ManageCourse {
  constructor() {
    this.divContainer = document.getElementById('divManageCourseContainer');

    this.divEditClassDetailsModal = this.divContainer.querySelector('#divEditClassDetailsModal');
    this.editClassDetailsModal = new bootstrap.Modal(this.divEditClassDetailsModal);
    this.inputEditTitle = this.divContainer.querySelector('#inputEditTitle');
    this.inputEditDescription = this.divContainer.querySelector('#inputEditDescription');
    this.inputEditClassDateTime = this.divContainer.querySelector('#inputEditClassDateTime');
    this.inputEditDuration = this.divContainer.querySelector('#inputEditDuration');
    this.inputEditLocation = this.divContainer.querySelector('#inputEditLocation');
    this.inputEditPrice = this.divContainer.querySelector('#inputEditPrice');
    this.inputDanceClassId = this.divContainer.querySelector('#inputDanceClassId');
  }

  //#region Init

  static Init() {
    new ManageCourse().#init();
  }

  #init() {
    this.BindEvent_ShowEditClassDetailsModal();
  }

  //#endregion


  //#region ShowEditClassDetailsModal

  BindEvent_ShowEditClassDetailsModal() {
    //get all edit class details buttons and add onclick event to each of them
    const editClassDetailsButtons = this.divContainer.querySelectorAll('[data-btnEditClassDetails]');
    editClassDetailsButtons.forEach((btnEl) => {
      btnEl.addEventListener('click', (e) => this.ShowEditClassDetailsModal(btnEl));
    });
  }
  
  ShowEditClassDetailsModal(btnEl) {
    //update modal form input values
    this.inputEditTitle.value = btnEl.getAttribute('data-title');
    this.inputEditDescription.value = btnEl.getAttribute('data-description');
    this.inputEditClassDateTime.value = btnEl.getAttribute('data-classDateTime');
    this.inputEditDuration.value = btnEl.getAttribute('data-duration');
    this.inputEditLocation.value = btnEl.getAttribute('data-location');
    this.inputEditPrice.value = btnEl.getAttribute('data-price');
    this.inputDanceClassId.value = btnEl.getAttribute('data-danceClassId');

    //show modal
    this.editClassDetailsModal.show();
  }

  //#endregion
}