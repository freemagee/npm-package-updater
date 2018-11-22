// Credit to https://npms.io/ for a great api

const elements = {
  appContainer: document.getElementById("appContainer"),
  updateBtn: document.getElementById("update"),
  inputText: document.getElementById("inputText"),
  outputText: document.getElementById("outputText")
};
let model = {};
let controller = {};
let view = {};

model = {
  apiURL: "https://api.npms.io/v2/",
  updateDependencyVersions(obj) {
    const obj2 = Object.assign({}, obj);
    const getPackages = new Promise(resolve => {
      const promises = [];

      Object.keys(obj2).forEach(pkg => {
        const firstChar = pkg.substring(0, 1);

        if (firstChar !== "@") {
          promises.push(
            this.replaceVersion(pkg).then(json => {
              // TODO: make caret or tilde on a toggle?
              obj2[pkg] = `^${json.collected.metadata.version}`;
            })
          );
        }
      });

      Promise.all(promises).then(() => {
        resolve(obj2);
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
  findTheDependencies(json) {
    let hasDependencies = false;

    if (
      typeof json.devDependencies !== "undefined" ||
      typeof json.dependencies !== "undefined"
    ) {
      hasDependencies = true;
    }

    return hasDependencies;
  }
};

controller = {
  updatePackage(input) {
    if (input === "") {
      console.log("no input data");
      return;
    }

    const isValid = this.isJsonString(input);

    if (!isValid) {
      console.log("not valid json");
      return;
    }

    const json = JSON.parse(input);
    const hasDependencies = model.findTheDependencies(json);

    if (!hasDependencies) {
      console.log("no dependencies");
      return;
    }

    model
      .updateDependencyVersions(json.devDependencies)
      .then(result => {
        const output = Object.assign({}, json);

        output.devDependencies = result;
        view.resetContainer();
        view.updateOutput(JSON.stringify(output, null, 2));
      })
      .catch(err => {
        console.log(err.stack);
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

view = {
  resetContainer() {
    elements.appContainer.className = "container";
  },
  updateOutput(output) {
    elements.outputText.value = output;
  },
  init() {
    elements.updateBtn.addEventListener("click", () => {
      controller.updatePackage(elements.inputText.value);
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
