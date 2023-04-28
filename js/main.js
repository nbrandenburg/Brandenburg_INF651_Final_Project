// Function 1 - passed
const createElemWithText = (elemType = "p", text = "", className) => {
    const myTextElem = document.createElement(elemType);
    myTextElem.textContent = text;
    if (className) myTextElem.classList.add(className);
    return myTextElem;
};

// Function 2 - passed
const createSelectOptions = (users) => {
  if(!users) return;
  let optionsArray = [];
  users.forEach(user => {
    const option = document.createElement("option");
    option.value = user.id;
    option.textContent = user.name;
    optionsArray.push(option);
  }) 
  return optionsArray;
};

// Function 3 - passed
const toggleCommentSection = (postId) => {
  if(!postId) return;
  const section = document.querySelector(`section[data-post-id = '${postId}']`);
  if(!section?.tagName) return null;
  section.classList.toggle("hide");
  return section;
};

// Function 4 - passed
const toggleCommentButton = (postId) => {
  if(!postId) return;
  const button = document.querySelector(`button[data-post-id = '${postId}']`);
  if(!button?.tagName) return null;
  button.textContent === "Show Comments"
    ? (button.textContent = "Hide Comments")
    : (button.textContent = "Show Comments");
  return button;
};

// Function 5 - passed
const deleteChildElements = (parentElement) => {
  if(!parentElement?.tagName) return;
  let child = parentElement.lastElementChild;
  while(child) {
  parentElement.removeChild(child);
  child = parentElement.lastElementChild;
  }
  return parentElement;
};

// Function 6 - passed
const addButtonListeners = () => {
  const buttonsArray = document.querySelectorAll("main > button");
  buttonsArray.forEach((button) => {
    const postId = button.dataset.postId;
    button.addEventListener("click", (event) => {
      toggleComments(event, postId);
    })
  })
  return buttonsArray;
};

// Function 7 - passed
const removeButtonListeners = () => {
  const buttonsArray = document.querySelectorAll("main > button");
  buttonsArray.forEach((button) => {
    const postId = button.dataset.id;
    button.removeEventListener("click", (event) => {
      toggleComments(event, postId);
    })
  })
  return buttonsArray;
};

// Function 8 - passed
const createComments = (comments) => {
  if(!comments) return;
  let fragment = document.createDocumentFragment();
  comments.forEach((comment) => {
    const myArticle = document.createElement('article');
    const myH3 = createElemWithText('h3', comment.name);
    const myP1 = createElemWithText('p', comment.body);
    const myP2 = createElemWithText('p', `From: ${comment.email}`);
    myArticle.append(myH3, myP1, myP2);
    fragment.append(myArticle);    
  })
  return fragment;
};

// Function 9 - passed
const populateSelectMenu = (users) => {
  if(!users) return;
  const menuElement = document.getElementById("selectMenu");
  let optionsArray = createSelectOptions(users);
  optionsArray.forEach((option) => {
    menuElement.append(option);
  });
  return menuElement;
};

// Async / Await Functions
// Function 10 - passed
const getUsers = async() => {
  try{
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    if(!response.ok) throw new Error("Error");
    const users = await response.json();
    return users;
  } catch (err) {
    console.error(err);
  }
};

// Function 11 - passed
const getUserPosts = async(userId) => {
  if(!userId) return;
  try{
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    if(!response.ok) throw new Error("Error");
    const posts = await response.json();
    const targetUserPosts = posts.filter(post => {
      return post.userId === userId;
    })
    return targetUserPosts;
  } catch (err) {
    console.error(err);
  }
};

// Function 12 - passed
const getUser = async(userId) => {
  if(!userId) return;
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    if(!response.ok) throw new Error("Error");
    const users = await response.json();
    let targetUser;
    users.forEach(user => {
      if(user.id === userId) {
        targetUser = user;
      }
    })
    return targetUser;
  } catch (err) {
    console.error(err);
  }
};

// Function 13 - passed
const getPostComments = async(postId) => {
  if(!postId) return;
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
    if(!response.ok) throw new Error("Error");
    const comments = await response.json();
    return comments;
  } catch (err) {
    console.error(err);
  }
};

// Function 14 - passed
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

// Function 15 - passed
const createPosts = async(posts) => {
  if(!posts) return;
  const fragment = document.createDocumentFragment();
  for(let i = 0; i < posts.length; i++) {
    const article = document.createElement('article');
    const h2 = createElemWithText('h2', posts[i].title);
    const p1 = createElemWithText('p', posts[i].body);
    const p2 = createElemWithText('p', `Post ID: ${posts[i].id}`);
    const author = await getUser(posts[i].userId);
    const p3 = createElemWithText('p', `Author: ${author.name} with ${author.company.name}`);
    const p4 = createElemWithText('p', author.company.catchPhrase);
    const button = createElemWithText('button', "Show Comments");
    button.dataset.postId = posts[i].id;
    article.append(h2, p1, p2, p3, p4, button);
    const section = await displayComments(posts[i].id);
    article.append(section);
    fragment.append(article);
  }  
  return fragment;
};

// Function 16 - passed
const displayPosts = async(posts) => {
  const main = document.querySelector('main');
  const fragment = document.createDocumentFragment();
  if(!posts) {
    const p = createElemWithText('p', "Select an Employee to display their posts.", 'default-text');
    return p;
  }
  else {
    const element = await createPosts(posts);
    fragment.append(element);
    main.append(fragment);
    return fragment;
  }  
};

// Procedural Functions
// Function 17 - passed
const toggleComments = (event, postId) => {
  if(!event) return;
  if(!postId) return;
  event.target.listener = true;
  const section = toggleCommentSection(postId);
  const button = toggleCommentButton(postId);
  return [section, button];
};

// Function 18 - NOT passed, wrong number of addButtons?
const refreshPosts = async(posts) => {
  if(!posts) return;
  const removeButtons = removeButtonListeners();
  const main = deleteChildElements('main');
  const fragment = await displayPosts(posts);
  const addButtons = addButtonListeners();
  return [removeButtons, main, fragment, addButtons];
};

// Function 19 - NOT passed, refreshPostArray wrong length
const selectMenuChangeEventHandler = async(event) => {
  if(!event) return;
  document.getElementsByClassName("selectMenu").disabled = true;
  const userId = event?.target?.value || 1;
  const posts = await getUserPosts(userId);
  const refreshPostsArray = await refreshPosts(posts);
  document.getElementsByClassName("selectMenu").disabled = false;
  return [userId, posts, refreshPostsArray];
};

// Function 20 - passed
const initPage = async() => {
  const users = await getUsers();
  const select = populateSelectMenu(users);
  return [users, select];
};

// Function 21 - passed
const initApp = () => {
  initPage();
  const selectMenu = document.getElementById("selectMenu");
  selectMenu.addEventListener("readystatechange", (event) => {
    if(event.target.readyState === "complete") {
      selectMenuChangeEventHandler(event);
    }
  })
};

document.addEventListener("DOMContentLoaded", (event) => {
  if (event.target.readyState === "complete") {
    initApp();
  }
});