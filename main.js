// Credit to https://npms.io/ for a great api

const elements = {
  appContainer: document.getElementById("appContainer"),
  updateBtn: document.getElementById("update"),
  inputText: document.getElementById("inputText"),
  outputText: document.getElementById("outputText")
};

const model = {
  apiURL: "https://api.npms.io/v2/",
  packageJson: {},
  setPackageJson(json) {
    this.packageJson = Object.assign({}, json);
  },
  getPackageJson() {
    return this.packageJson;
  },
  setDependencyData(key, newDependencyData) {
    this.packageJson[key] = newDependencyData;
  },
  updateDependencyVersions(key) {
    const newObj = Object.assign({}, this.packageJson[key]);
    const getPackages = new Promise(resolve => {
      const promises = [];

      Object.keys(newObj).forEach(pkg => {
        const firstChar = pkg.substring(0, 1);

        // TODO: Figure out what to do with @
        if (firstChar !== "@") {
          promises.push(
            this.replaceVersion(pkg).then(json => {
              // TODO: make caret or tilde on a toggle?
              newObj[pkg] = `^${json.collected.metadata.version}`;
            })
          );
        }
      });

      Promise.all(promises).then(() => {
        resolve(newObj);
      });
    });

    return getPackages;
  },
  replaceVersion(pkg) {
    return fetch(`${this.apiURL}package/${pkg}`)
      .then(this.status)
      .then(response => response.json());
  },
  status(response) {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response);
    }

    return Promise.reject(new Error(response.statusText));
  },
  findTheDependencies() {
    const hasDependencies = [];

    if (typeof this.packageJson.dependencies !== "undefined") {
      hasDependencies.push("dependencies");
    }

    if (typeof this.packageJson.devDependencies !== "undefined") {
      hasDependencies.push("devDependencies");
    }

    return hasDependencies;
  }
};

const controller = {
  updateJson(input) {
    if (input === "") {
      view.showError({
        title: "Error!",
        message: "No input json. Please check and try again."
      });
      return;
    }

    const isValid = this.isJsonString(input);

    if (!isValid) {
      view.showError({
        title: "Error!",
        message: "Invalid package json. Please check and try again."
      });
      return;
    }

    model.setPackageJson(JSON.parse(input));
    const hasDependencies = model.findTheDependencies();

    if (hasDependencies.length === 0) {
      view.showError({
        title: "Error!",
        message: "No dependencies detected in package json."
      });
      return;
    }

    this.updatePackages(hasDependencies);
  },
  updatePackages(hasDependencies) {
    const promises = hasDependencies.map(key => {
      return model
        .updateDependencyVersions(key)
        .then(result => {
          if (typeof result !== "undefined") {
            return Promise.resolve({
              key: key,
              packages: result
            });
          }

          throw new Error("Unable to update packages.");
        })
        .catch(error => {
          return Promise.reject(error);
        });
    });

    Promise.all(promises)
      .then(results => {
        results.forEach(result =>
          model.setDependencyData(result.key, result.packages)
        );
      })
      .then(() => view.showResult())
      .catch(error => {
        view.showError({
          title: "Error!",
          message: error.message
        });
      });
  },
  isJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  },
  init() {
    view.init();
  }
};

const view = {
  resetContainer() {
    elements.appContainer.className = "container";
  },
  updateOutput(output) {
    elements.outputText.value = output;
  },
  showResult() {
    this.resetContainer();
    this.updateOutput(JSON.stringify(model.getPackageJson(), null, 2));
  },
  showError(err) {
    const html = `<div id="alert" class="alert alert--error">
      <button id="closeAlertBtn" class="alert__close">🗙</button>
      <h3 class="alert__title">${err.title}</h3>
      <p class="alert__message">${err.message}</p>
    </div>`;
    const frag = document.createRange().createContextualFragment(html);

    document.body.appendChild(frag);
    this.bindCloseBtn();
  },
  bindCloseBtn() {
    document.getElementById("closeAlertBtn").addEventListener("click", () => {
      document.getElementById("alert").remove();
    });
  },
  init() {
    elements.updateBtn.addEventListener("click", () => {
      controller.updateJson(elements.inputText.value);
    });
    elements.inputText.addEventListener("click", () => {
      this.resetContainer();
      elements.appContainer.classList.add("container--active-input");
    });
    elements.outputText.addEventListener("click", () => {
      this.resetContainer();
      elements.appContainer.classList.add("container--active-output");
    });
  }
};

controller.init();
