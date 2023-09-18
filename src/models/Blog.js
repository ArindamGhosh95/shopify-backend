import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { UserStore } from "./User";

class BlogStore {
  blogs = [];
  filePath;
  constructor(fileName = "/data/blog.json") {
    this.filePath = join(__dirname, fileName);
    this.loadUsersFromFile();
  }
  createBlogWithDefaults(blogData) {
    const {
      id = uuidv4(),
      title = "",
      description = "",
      category = "",
      numViews = 0,
      isLiked = false,
      likes = [],
      dislikes = [],
      author = "admin",
      images = {
        public_id: "1",
        url: "http://",
      },
    } = blogData;

    const newBlog = {
      id,
      title,
      description,
      category,
      numViews,
      isLiked,
      likes,
      dislikes,
      author,
      images,
    };

    this.blogs.push(newBlog);
    this.saveBlogs();
  }
  loadUsersFromFile() {
    try {
      const fileData = readFileSync(this.filePath, "utf8");
      this.blogs = JSON.parse(fileData);
    } catch (error) {
      console.error("Error loading data from file:", error);
    }
  }

  saveBlogs() {
    try {
      writeFileSync(
        this.filePath,
        JSON.stringify(this.blogs, null, 2),
        "utf-8"
      );
    } catch (error) {
      console.error("Error saving data into file:", error);
    }
  }

  createBlog(blog) {
    try {
      this.createBlogWithDefaults(blog);
      return this.blogs;
    } catch (e) {
      console.error(e);
    }
  }

  updateBlog(id, updatedblog) {
    try {
      const blogidx = this.blogs.findIndex((blog) => {
        return blog.id === id;
      });
      if (blogidx !== -1) {
        this.blogs[blogidx] = {
          ...this.blogs[blogidx],
          ...updatedblog,
        };
        this.saveBlogs();
        return this.blogs[blogidx];
      } else {
        throw new Error(`Blog not found with id ${id}`);
      }
    } catch (e) {
      console.error(e);
    }
  }

  deleteBlog(id) {
    try {
      const blogidx = this.blogs.findIndex((blog) => {
        return blog.id === id;
      });
      if (blogidx !== -1) {
        this.blogs.splice(blogidx, 1);
        this.saveBlogs();
      } else {
        throw new Error(`Blog not found with id ${id}`);
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  getBlogById(id) {
    const blog = this.blogs.find((blog) => {
      return blog.id === id;
    });
    if (blog) {
      blog.numViews += 1;
      this.saveBlogs();
    }
    return blog;
  }

  getAllBlog() {
    return this.blogs;
  }

  likeTheBlog(email, id) {
    try {
      let result = "";
      const userStore = new UserStore();
      const user = userStore.getUserByEmail(email);
      const blog = this.blogs.find((blog) => {
        return blog.id === id;
      });

      if (user && blog) {
        const liskesList = blog.likes;
        const idx = liskesList.findIndex((x) => {
          return x === user.id;
        });
        const disliskesList = blog.dislikes;
        const dislikeidx = disliskesList.findIndex((x) => {
          return x === user.id;
        });
        if (dislikeidx !== -1) {
          disliskesList.splice(dislikeidx, 1);
        }
        if (idx !== -1) {
          liskesList.splice(idx, 1);
          result = "Removed the like from the blog successfully.";
        } else {
          liskesList.push(user.id);
          result = "Liked the blog successfully.";
        }
        this.saveBlogs();
        return result;
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  dislikeTheBlog(email, id) {
    try {
      let result = "";
      const userStore = new UserStore();
      const user = userStore.getUserByEmail(email);
      const blog = this.blogs.find((blog) => {
        return blog.id === id;
      });
      if (user && blog) {
        const disliskesList = blog.dislikes;
        const idx = disliskesList.findIndex((x) => {
          return x === user.id;
        });
        const liskesList = blog.likes;
        const likeidx = liskesList.findIndex((x) => {
          return x === user.id;
        });
        if (likeidx !== -1) {
          liskesList.splice(likeidx, 1);
        }
        if (idx !== -1) {
          disliskesList.splice(idx, 1);
          result = "Removed the dislike from the blog successfully.";
        } else {
          disliskesList.push(user.id);
          result = "Disliked the blog successfully.";
        }
        this.saveBlogs();
        return result;
      }
    } catch (e) {
      throw new Error(e);
    }
  }
}

export default { BlogStore };
