const findRepositories = document.querySelector(".finded-repositories");
const selectRepositories = document.querySelector(".selected-repositories");
const input = document.querySelector(".input");

async function searchRepositories() {
  let result = [];

  try {
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${input.value}`
    );
    const data = await response.json();
    const repositories = data.items;
    for (let i = 0; i < 5; i++) {
      result.push(repositories[i]);
    }
    return result;
  } catch (err) {
    console.log(err);
  }
}

function createSelectedRepository(obj) {
  const repositoriesContainer = document.createElement("div");
  repositoriesContainer.classList.add("repositories-container");
  const selectedRepository = document.createElement("li");
  selectedRepository.classList.add("selected-repository");
  const removeBtn = document.createElement("button");
  removeBtn.classList.add("remove-btn");
  removeBtn.classList.add("button");

  const name = document.createElement("p");
  name.textContent = `name: ${obj.name}`;
  const owner = document.createElement("p");
  owner.textContent = `owner: ${obj.owner.login}`;
  const stars = document.createElement("p");
  stars.textContent = `stars: ${obj.stargazers_count}`;

  repositoriesContainer.append(name);
  repositoriesContainer.append(owner);
  repositoriesContainer.append(stars);
  selectedRepository.append(repositoriesContainer);
  selectedRepository.append(removeBtn);

  removeBtn.addEventListener("click", () => {
    selectedRepository.remove();
  });

  return selectedRepository;
}

async function showRepositories() {
  const repositoriesArray = await searchRepositories();

  for (let i = 0; i < repositoriesArray.length; i++) {
    const findRepository = document.createElement("li");
    findRepository.classList.add("find-repos");
    findRepository.textContent = repositoriesArray[i].name;
    findRepositories.append(findRepository);
    findRepository.addEventListener("click", () => {
      input.value = "";
      findRepositories.innerHTML = "";
      const selectedRepository = createSelectedRepository(repositoriesArray[i]);
      selectRepositories.append(selectedRepository);
    });
  }
}

function autocomplete() {
  if (findRepositories.firstChild) {
    findRepositories.innerHTML = "";
    showRepositories();
  } else {
    showRepositories();
  }
  return findRepositories;
}

const debounce = (fn, debounceTime) => {
  let timeout;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(fn, debounceTime);
  };
};

input.addEventListener("input", debounce(autocomplete, 400));
