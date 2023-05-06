// Nicole Brandenburg
// INF 651
// Final Project

// Function 1
const createElemWithText = (elemType = 'p', textContent = "", className) => {
  const element = document.createElement(elemType);
  element.textContent = textContent;
  if(className) element.classList.add(className);
  return element;
}

//Function 2
const createSelectOptions = (users) => {
  if(!users) return;
  const optionsArray = [];
  for(let i = 0; i < users.length; i++) {
    const option = document.createElement("option");
    option.value = users[i].id;
    option.textContent = users[i].name;
    optionsArray.push(option);
  }
  return optionsArray;
};

// Function 3
const toggleCommentSection = (postId) => {
  if(!postId) return;
  const section = document.querySelector(`section[data-post-id='${postId}']`);
  if(!section?.tagName) return null;
  section.classList.toggle("hide");
  return section;
};

// Function 4
const toggleCommentButton = (postId) => {
  if(!postId) return;
  const button = document.querySelector(`button[data-post-id='${postId}']`);
  if(!button?.tagName) return null;
  button.textContent === "Show Comments"
    ? (button.textContent = "Hide Comments")
    : (button.textContent = "Show Comments");
    return button;
};

//Function 5
const deleteChildElements = (parentElement) => {
  if(!(parentElement instanceof Element)) return;
  let child = parentElement.lastElementChild;
  while(child) {
  parentElement.removeChild(child);
  child = parentElement.lastElementChild;
  }
  return parentElement;
};

// Function 6
const addButtonListeners = () => {
  const buttonsArray = document.querySelectorAll("main button");
    for(let i = 0; i < buttonsArray.length; i++) {
    let postId = buttonsArray[i].dataset.postId;
    buttonsArray[i].addEventListener("click", function (e) {toggleComments(e, postId)});
  }
  return buttonsArray;
};

// Function 7
const removeButtonListeners = () => {
  const buttonsArray = document.querySelectorAll("main button");
    for(let i = 0; i < buttonsArray.length; i++) {
    let postId = buttonsArray[i].dataset.id;
    buttonsArray[i].removeEventListener("click", function (e) {toggleComments(e, postId)});
  }
  return buttonsArray;
};

// Function 8 
const createComments = (comments) => {
  if(!comments) return;
  let fragment = document.createDocumentFragment();
  for(let i = 0; i < comments.length; i++) {
    const article = document.createElement("article");
    const h3 = createElemWithText("h3", comments[i].name);
    const p1 = createElemWithText("p", comments[i].body);
    const p2 = createElemWithText("p", `From: ${comments[i].email}`);
    article.append(h3, p1, p2);
    fragment.append(article); 
  }
  return fragment;
};

//Function 9
const populateSelectMenu = (users) => {
  if(!users) return;
  const menu = document.querySelector("#selectMenu");
  const optionsArray = createSelectOptions(users);
  for(let i = 0; i < optionsArray.length; i++) {
    menu.append(optionsArray[i]);
  }
  return menu;
};

//Function 10
const getUsers = async() => {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    if(!response.ok) throw new Error("Error retrieving users data");
    return await response.json();
  } catch (err) {
    console.error(err);
  }
};

// Function 11
const getUserPosts = async(userId) => {
  if(!userId) return;
  try{
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
    if(!response.ok) throw new Error("Error retrieving posts data");
    return await response.json();
  } catch (err) {
    console.error(err);
  }
};

// Function 12
const getUser = async(userId) => {
  if(!userId) return;
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
    if(!response.ok) throw new Error("Error retrieving user data");
    return await response.json();
  } catch (err) {
    console.error(err);
  }
};

// Function 13 
const getPostComments = async(postId) => {
  if(!postId) return;
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
    if(!response.ok) throw new Error("Error retrieving comments");
    const comments = await response.json();
    return comments;
  } catch (err) {
    console.error(err);
  }
};

// Function 14
const displayComments = async(postId) => {
  if(!postId) return;
  const section = document.createElement("section");
  section.dataset.postId = postId;
  section.classList.add("comments", "hide");
  const comments = await getPostComments(postId);
  const fragment = createComments(comments);
  section.append(fragment);
  return section;
};

// Function 15
const createPosts = async(posts) => {
  if(!posts) return;
  const fragment = document.createDocumentFragment();
  for(let i = 0; i < posts.length; i++) {
    const article = document.createElement("article");
    const h2 = createElemWithText("h2", posts[i].title);
    const p1 = createElemWithText("p", posts[i].body);
    const p2 = createElemWithText("p", `Post ID: ${posts[i].id}`);
    const author = await getUser(posts[i].userId);
    const p3 = createElemWithText("p", `Author: ${author.name} with ${author.company.name}`);
    const p4 = createElemWithText("p", author.company.catchPhrase);
    const button = createElemWithText("button", "Show Comments");
    button.dataset.postId = posts[i].id;    
    const section = await displayComments(posts[i].id);
    article.append(h2, p1, p2, p3, p4, button, section);
    fragment.append(article);
  }  
  return fragment;
};

// Function 16
const displayPosts = async(posts) => {
  const main = document.querySelector("main");
  const element = (posts) ? (await createPosts(posts))
    : (createElemWithText("p", "Select an Employee to display their posts.", "default-text"));
  main.append(element);
  return element;
};

// Function 17
const toggleComments = (event, postId) => {
  if(!event) return;
  if(!postId) return;
  event.target.listener = true;
  const section = toggleCommentSection(postId);
  const button = toggleCommentButton(postId);
  return [section, button];
};

// Function 18 
const refreshPosts = async(posts) => {
  if(!posts) return;
  const removeButtons = removeButtonListeners();
  const main = document.getElementsByTagName("main");
  deleteChildElements(main);
  const fragment = await displayPosts(posts);
  const addButtons = addButtonListeners();
  return [removeButtons, main, fragment, addButtons];
};

//Function 19 
const selectMenuChangeEventHandler = async(event) => {
  if(!event) return;
  const selectMenu = document.getElementById("selectMenu");
  selectMenu.disabled = true;
  const userId = event?.target?.value || 1;
  const posts = await getUserPosts(userId);
  const refreshPostsArray = await refreshPosts(posts);
  selectMenu.disabled = false;
  return [userId, posts, refreshPostsArray];
};

// Function 20
const initPage = async() => {
  const users = await getUsers();
  const select = populateSelectMenu(users);
  return [users, select];
};

// Function 21
const initApp = () => {
  initPage();
  const menu = document.getElementById("selectMenu");
  menu.addEventListener("change", selectMenuChangeEventHandler);
};

document.addEventListener("DOMContentLoaded", initApp);