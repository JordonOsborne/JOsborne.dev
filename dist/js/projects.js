document.addEventListener("DOMContentLoaded", AllProjects);

async function AllProjects() {
  ClearProjects();
  ResetFilterTabs();
  InitializeSearch();
  let projects = await LoadProjects();
  InsertProjects(projects);
}

async function LoadProjects(projects) {
  const projectsJSON = await fetch("./projects.json").then((response) => {
    return response.json();
  });
  projects = projectsJSON.Projects;
  return projects;
}

function ClearProjects() {
  const gallery = document.getElementById("Gallery");
  while (gallery.hasChildNodes()) {
    gallery.removeChild(gallery.firstChild);
  }
}

// SEARCHING PROJECTS
function InitializeSearch() {
  const SearchInput = document.getElementById("Search");
  SearchInput.addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
      e.preventDefault();
      SearchProjects();
      return false;
    }
  });
}

async function SearchProjects(application) {
  console.clear();
  const projects = await LoadProjects();
  // FIND SEARCH TERMS
  searchTerms = document.getElementById("Search").value;
  searchTerms = searchTerms.split(" ");
  let matches;
  searchTerms.forEach((term) => {
    matches = projects.filter(HasTerm, term);
  });
  console.log("Search Terms: ", searchTerms);

  // FIND ACTIVE TABS
  if (application == undefined) {
    let activeButtons = document.querySelectorAll("active");
    let application = Array.from(activeButtons).pop();
    if (application != undefined) {
      application = application.id;
    }
  }
  FilterProjects(matches, application);
}

function HasTerm(project) {
  let term = this.toString();
  if (
    project.Project.toUpperCase().includes(term.toUpperCase()) ||
    project.Description.toUpperCase().includes(term.toUpperCase())
  ) {
    return true;
  }
}

// FILTER BUTTON PROJECT FILTERING
async function FilterProjects(projects, application) {
  const button = document.getElementById(application);

  // CONTINUE TO FILTER AFTER SEARCH RESULTS FOUND
  ClearProjects();
  if (application != undefined) {
    if (CheckIfActive(button)) {
      console.log("Remove Filter");
      ResetFilterTabs(button);
      InsertProjects(projects);
    } else {
      console.log("Filter for ", application);
      AddActiveClass(button);
      let matches = FilterByApplication(projects, application);
      InsertProjects(matches);
    }
  } else {
    InsertProjects(projects);
  }
}

function CheckIfActive(button) {
  const Classes = Array.from(button.classList);
  let isActive = false;
  Classes.forEach((item) => {
    if (item == "active") {
      isActive = true;
    }
  });
  return isActive;
}

function ResetFilterTabs(button) {
  button?.classList.remove("active");
  let group, query;
  if (
    button == undefined ||
    button.id == "O365" ||
    button.id == "CMS" ||
    button.id == "WebDevelopment"
  ) {
    // HIDE APPLICATION BUTTONS
    query = "[group]";
    group = document.querySelectorAll(query);
    Array.from(group).forEach((button) => {
      button.classList.add("hide");
    });
    // SHOW GROUP BUTTONS
    query = "[isgroup = true]";
    group = document.querySelectorAll(query);
    Array.from(group).forEach((button) => {
      button.classList.remove("hide");
    });
  }
}

function FilterByApplication(projects, application) {
  let matches = projects.filter(CheckForApplication, application);
  return matches;
}

function CheckForApplication(project) {
  const Technology = project.Technology;
  let filter = this.toString();
  let isMatch = false;
  switch (filter) {
    case "O365":
      Technology.forEach((application) => {
        if (
          application.name == "SharePoint" ||
          application.name.includes("Power")
        ) {
          isMatch = true;
        }
      });
      break;
    case "CMS":
      Technology.forEach((application) => {
        if (application.name == "Caputech" || application.name == "WIX") {
          isMatch = true;
        }
      });
      break;
    case "WebDevelopment":
      Technology.forEach((application) => {
        if (
          application.name == "HTML" ||
          application.name == "CSS" ||
          application.name == "JavaScript" ||
          application.name == "React" ||
          application.name == "Next"
        ) {
          isMatch = true;
        }
      });
      break;
    default:
      Technology.forEach((application) => {
        if (application.name.split(" ").join("") == filter) {
          isMatch = true;
        }
      });
  }
  return isMatch;
}

// CREATE PROJECT HTML AND INSERT ONTO PAGE
function gitHub(URL) {
  if (URL.includes("https://github.com/JordonOsborne/")) {
    return "<i class='fab fa-github'></i>";
  } else {
    return "<i class='fa-solid fa-link'></i>";
  }
}

function HighlightSearchTerms(text) {
  // FIND SEARCH TERMS
  let searchTerms = document.getElementById("Search").value;
  searchTerms = searchTerms.split(" ");
  searchTerms.forEach((searchTerm) => {
    text = text.replace(searchTerm, "<mark>" + searchTerm + "</mark>");
    return text;
  });
  return text;
}

function InsertProjects(projects) {
  const gallery = document.getElementById("Gallery");
  let project = null;
  let technology = "";
  if (projects.length == 0) {
    gallery.insertAdjacentHTML(
      "beforebegin",
      "<div id=NoProjects>No projects found matching this criteria.</div>"
    );
  } else {
    // REMOVE NO PROJECTS FOUND HTML
    if (document.getElementById("NoProjects") != undefined) {
      document.getElementById("NoProjects").remove();
    }
    projects = projects.sort((a, b) => (a.Date < b.Date ? 1 : -1));
    console.log("Sorted Projects: ", projects);
    // INSERT PROJECTS
    projects.forEach((item) => {
      item.Technology.forEach((application) => {
        technology =
          technology +
          "<img src='" +
          application.Image +
          "' alt='" +
          application.name +
          "' title= '" +
          application.name +
          "'></img>";
        return technology;
      });
      project =
        "<div class='project'><a href='" +
        item.URL +
        "'target='_blank'>" +
        gitHub(item.URL) +
        item.Link +
        "</a><h4>" +
        HighlightSearchTerms(item.Project) +
        "</h4><img src='" +
        item.Image +
        "' alt='" +
        item.Link +
        "' class='project-img'/><p>" +
        HighlightSearchTerms(item.Description) +
        "</p><div class='technology'>" +
        technology;
      ("</div></div>");
      gallery.insertAdjacentHTML("beforeend", project);
      technology = "";
    });
    console.log("Projects successfully inserted.");
  }
}

// FILTER BUTTON FORMATTING
function AddActiveClass(button) {
  const buttons = Array.from(document.getElementsByClassName("active"));
  buttons.forEach((btn) => {
    if (!btn.getAttribute("isgroup") && btn.innerText != "MY WORK") {
      console.log("Inner Text: ", btn.innerText);
      btn.classList.remove("active");
    }
  });
  button.classList.add("active");
  HideOtherGroups(button.getAttribute("group"));
  HideOtherApplications(button.getAttribute("group"));
}

function HideOtherApplications(group) {
  const query = "[group]";
  const buttons = Array.from(document.querySelectorAll(query));
  buttons.forEach((btn) => {
    if (btn.getAttribute("group") != group) {
      btn.classList.add("hide");
    } else {
      btn.classList.remove("hide");
    }
  });
}

function HideOtherGroups(group) {
  const query = '[isgroup="' + true + '"]';
  const groupButtons = Array.from(document.querySelectorAll(query));
  groupButtons.forEach((btn) => {
    if (btn.id != group) {
      btn.classList.add("hide");
    }
  });
}
