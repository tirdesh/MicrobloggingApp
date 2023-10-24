// Define the Blog class
class Blog {
    // Private properties
    #title;
    #content;
    #author;
    #date;

    // Constructor to initialize a Blog object
    constructor(title, content, author, date) {
        this.#title = title;
        this.#content = content;
        this.#author = author;
        this.#date = date || new Date().toLocaleString();
    }

    // Getter methods to access private properties
    get title() {
        return this.#title;
    }

    get content() {
        return this.#content;
    }

    get author() {
        return this.#author;
    }

    get date() {
        return this.#date;
    }
}

// Function to add a blog to the web page
const addBlog = (blog, parent) => {
    // Create a blog card element
    const blogCard = document.createElement("article");
    blogCard.className = "blog-card";

    // Add a click event listener to toggle the 'expanded' class
    blogCard.addEventListener('click', (event) => {
        if (event.target.classList.contains('blog-card')) {
            blogCard.classList.toggle("expanded");
        }
    });

    // Create elements for the blog card
    const divHeader = document.createElement("div");
    divHeader.className = "title-update";

    const title = document.createElement("h2");
    title.textContent = blog.title;

    const updateButton = document.createElement("button");
    updateButton.className = "update-blog";
    updateButton.textContent = "Update Blog";

    divHeader.appendChild(title);
    divHeader.appendChild(updateButton);

    const authorDateDiv = document.createElement("div");
    authorDateDiv.className = "author-date";

    const authorDate = document.createElement("p");
    authorDate.textContent = `${blog.author} | Created at: ${blog.date}`;

    authorDateDiv.appendChild(authorDate);

    const contentDiv = document.createElement("div");
    contentDiv.className = "content";

    const content = document.createElement("p");
    content.textContent = blog.content;

    contentDiv.appendChild(content);

    // Add elements to the blog card
    blogCard.appendChild(divHeader);
    blogCard.appendChild(authorDateDiv);
    blogCard.appendChild(contentDiv);

    // Add the blog card to the parent element
    parent.appendChild(blogCard);
}

// Fetch and display blogs from a JSON file
const blogList = document.getElementById("blog-list");
const fetchBlogs = () => {
    const blogsURI = '../data/blogs.json'; // Replace with the actual JSON file path.
    const xhr = new XMLHttpRequest();
    xhr.open('GET', blogsURI);
    xhr.addEventListener('load', function () {
        if (this.status === 200) {
            const responseText = this.responseText;
            const blogListData = JSON.parse(responseText);
            blogListData.forEach((item) => {
                const blog = new Blog(item.title, item.content, item.author, item.date);
                addBlog(blog, blogList);
            });
            addUpdateButtonListeners();
        }
    });
    xhr.send();
}

fetchBlogs();

// Add an event listener to handle the "Create Blog" button
const createBlogButton = document.getElementById("create-blog-button");
createBlogButton.addEventListener("click", () => {
    createEditableBlogCard();
    createBlogButton.disabled = true; // Disable the button
    createBlogButton.title = "Button is disabled. Complete or cancel the current blog creation.";
});

// Function to create an editable blog card
const createEditableBlogCard = () => {
    // Create an editable blog card with input fields
    const editableBlogCard = document.createElement("article");
    editableBlogCard.className = "blog-card editable";

    const titleInput = document.createElement("input");
    titleInput.placeholder = "Title";

    const contentInput = document.createElement("textarea");
    contentInput.placeholder = "Content";

    const authorInput = document.createElement("input");
    authorInput.placeholder = "Author";

    const buttonRow = document.createElement("div");
    buttonRow.className = "button-row";

    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.addEventListener("click", () => {
        // Create a new Blog object and add it to the page
        const title = titleInput.value;
        const content = contentInput.value;
        const author = authorInput.value;
        if(title.trim().length > 0 && content.trim().length > 0 && author.trim().length > 0){
            const newBlog = new Blog(titleInput.value, contentInput.value, authorInput.value);
            addBlog(newBlog, blogList);
            // Remove the editable card
            blogList.removeChild(editableBlogCard);
            createBlogButton.disabled = false; // Enable the button
            createBlogButton.title = "";
        }
        else{
            alert("Fields cannot be empty.")
        }
    });

    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.addEventListener("click", () => {
        // Remove the editable card without creating a new blog
        blogList.removeChild(editableBlogCard);
        createBlogButton.disabled = false; // Enable the button
        createBlogButton.title = "";
    });

    buttonRow.appendChild(saveButton);
    buttonRow.appendChild(cancelButton);

    // Append input fields and buttons to the editable card
    editableBlogCard.appendChild(titleInput);
    editableBlogCard.appendChild(contentInput);
    editableBlogCard.appendChild(authorInput);
    editableBlogCard.appendChild(buttonRow);

    // Add the editable card to the blog list
    blogList.appendChild(editableBlogCard);
};

// Add event listeners to update and cancel buttons for editable blog cards
function addUpdateButtonListeners() {
    blogList.addEventListener('click', (event) => {
        if (event.target.classList.contains('update-blog')) {
            const updateButton = event.target;
            const blogCard = updateButton.closest('.blog-card');

            // Extract the blog details
            const title = blogCard.querySelector('h2').textContent;
            const authorDate = blogCard.querySelector('.author-date p').textContent.split(' | ');
            const author = authorDate[0];
            const content = blogCard.querySelector('.content p').textContent;

            // Create an editable card with only the content and author fields editable
            const editableCard = document.createElement('div');
            editableCard.className = "blog-card editable";
            editableCard.innerHTML = `
                <h2>${title}</h2>
                <input type="text" class="editable-author" placeholder="Edit Author" value="${author}">
                <textarea class="editable-content" placeholder="Edit Content">${content}</textarea>
                <div class="button-row">
                <button class="save-blog">Save</button>
                <button class="cancel-blog">Cancel</button>
                </div>
            `;

            // Replace the blog card with the editable card
            blogCard.replaceWith(editableCard);

            // Event listener for the "Save" button in the editable card
            const saveButton = editableCard.querySelector('.save-blog');
            saveButton.addEventListener('click', () => {
                // Retrieve the updated values
                const updatedAuthor = editableCard.querySelector('.editable-author').value;
                const updatedContent = editableCard.querySelector('.editable-content').value;
                if(updatedAuthor.trim().length > 0 && updatedContent.trim().length > 0){
                    // Create a new blog card with the updated values
                    const updatedBlogCard = document.createElement('article');
                    updatedBlogCard.className = 'blog-card';
                    updatedBlogCard.innerHTML = `
                        <div class="title-update">
                            <h2>${title}</h2>
                            <button class="update-blog">Update Blog</button>
                        </div>
                        <div class="author-date">
                            <p>${updatedAuthor} | ${authorDate[1]}</p>
                        </div>
                        <div class="content">
                            <p>${updatedContent}</p>
                        </div>
                    `;

                    // Replace the editable card with the updated blog card
                    editableCard.replaceWith(updatedBlogCard);
                }
                else{
                    alert("Fields cannot be empty.")
                }

            });

            // Event listener for the "Cancel" button in the editable card
            const cancelButton = editableCard.querySelector('.cancel-blog');
            cancelButton.addEventListener('click', () => {
                // Replace the editable card with the original blog card
                editableCard.replaceWith(blogCard);
            });
        }
    });
}
