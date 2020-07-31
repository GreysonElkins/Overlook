class Page {

  getLogInInfoFromForm() {
    const inputs = document.querySelectorAll('input')
    const userCredentials = {}
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].id === 'username' 
      && !inputs[i].classList.contains('hidden')) {
        userCredentials.username = inputs[i].value
      } else if (inputs[i].id === 'password'
      && !inputs[i].classList.contains('hidden')) {
        userCredentials.password = inputs[i].value
      }
    }
    return userCredentials
  }

  goToRoomsPage() {
    console.log("success!");
  }
}

export default Page