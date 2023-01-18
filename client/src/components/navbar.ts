class Navbar {
  layout: HTMLElement = document.createElement("nav");

  constructor() {
    this.layout.className = "navbar navbar-expand-lg navbar-dark bg-primary mb-2";
    this.layout.insertAdjacentHTML("afterbegin", `
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Navbar</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div class="navbar-nav">
            <button class="nav-link active" data-controller-type="download">Сохранить схему</button>
            <button class="nav-link active" data-controller-type="downloadSVG" >Сохранить как SVG</button>
            <button class="nav-link active" data-controller-type="upload">Загрузить схему</button>
          </div>
        </div>
    </div>
    `);
    // this.layout.insertAdjacentHTML("afterbegin", `
    //  <div class="nav-wrapper">
    //   <a href="#" class="brand-logo">Logo</a>
    //   <ul id="nav-mobile" class="right hide-on-med-and-down">

    //   </ul>
    // </div>
    // `);
  }

  render(): HTMLElement {
    return this.layout;
  }
}

export default Navbar;