const apiURL = "https://api.npms.io/v2/"; // Credit to https://npms.io/ for a great api
const updateBtn = document.getElementById("update");
const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");
const updatePackage = function() {
  const inputJSON = inputText.value;
  const parsedInput = JSON.parse(inputJSON);
  const isValid = typeof parsedInput === "object";

  if (isValid) {
    const hasDependencies = findTheDependencies(parsedInput);

    if (hasDependencies) {
      updateDependencyVersions(parsedInput.devDependencies).then(result => {
        const outputJSON = Object.assign({}, parsedInput);

        outputJSON.devDependencies = result;
        outputText.value = JSON.stringify(outputJSON, null, 2);
      });
    }
  } else {
    console.log("input not valid");
  }
};

// Assign events

updateBtn.addEventListener("click", updatePackage);

// Functionality

function updateDependencyVersions(obj) {
  const obj2 = Object.assign({}, obj);
  const getPackages = new Promise(resolve => {
    const promises = [];

    for (let pkg in obj2) {
      // pkgs that start with "@" break the api
      let firstChar = pkg.substring(0, 1);

      if (firstChar !== "@" && obj2.hasOwnProperty(pkg)) {
        console.log(pkg);
        promises.push(
          replaceVersion(pkg).then(json => {
            // TODO: make caret or tilde on a toggle input?
            obj2[pkg] = `^${json.collected.metadata.version}`;
          })
        );
      }
    }

    Promise.all(promises).then(() => {
      resolve(obj2);
    });
  });

  return getPackages;
}

function replaceVersion(pkg) {
  return fetch(`${apiURL}package/${pkg}`)
    .then(status)
    .then(response => response.json());
}

function status(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

function findTheDependencies(inputJSON) {
  const toCheck = ["devDependencies", "dependencies"];
  let hasDependencies = false;

  // TODO: check for dev and non dev
  if (typeof inputJSON.devDependencies !== "undefined") {
    hasDependencies = true;
  }

  return hasDependencies;
}
