class Blog {
    #title;
    #content;
    #author;
    #date;

    constructor(title, content, author, date) {
        this.#title = title;
        this.#content = content;
        this.#author = author;
        this.#date = date || new Date().toLocaleString();
    }

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

const addBlog = (blog, parent) => {
    const blogCard = document.createElement("article");
    blogCard.className = "blog-card";

    const div_header = document.createElement("div");
    div_header.className = "title-update"

    const title = document.createElement("h2");
    title.textContent = blog.title;

    const updateButton = document.createElement("button");
    updateButton.className = "update-blog";
    updateButton.textContent = "Update";

    div_header.appendChild(title);
    div_header.appendChild(updateButton);

    const authorDateDiv = document.createElement("div");
    authorDateDiv.className = "author-date";

    const authorDate = document.createElement("p");
    authorDate.textContent = `${blog.author} | ${blog.date}`;

    authorDateDiv.appendChild(authorDate);

    const contentDiv = document.createElement("div");
    contentDiv.className = "content";

    const content = document.createElement("p");
    content.textContent = blog.content;

    contentDiv.appendChild(content);

    blogCard.appendChild(div_header);
    blogCard.appendChild(authorDateDiv);
    blogCard.appendChild(contentDiv);

    parent.appendChild(blogCard);
}


const blogList = document.getElementById("blog-list");

const fetchBlogs = () => {
    const blogsURI = '/data/blogs.json'; // Replace with the actual JSON file path.
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
        }
    });
    xhr.send();
}

fetchBlogs();




