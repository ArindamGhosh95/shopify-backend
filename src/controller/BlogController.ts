import expressAsyncHandler from "express-async-handler";
const { BlogStore } = require("../models/Blog").default;
const blogStore = new BlogStore();
// Create blog
export const createBlog = expressAsyncHandler(async (req: any, res: any) => {
  try {
    const allBlogs = blogStore.createBlog(req.body);
    res.json({ blogs: allBlogs });
  } catch (e: any) {
    console.error(e);
    throw new Error(e);
  }
});

// Update blog
export const updateBlog = expressAsyncHandler(async (req: any, res: any) => {
  const { id } = req.params;
  try {
    const updatedblog = blogStore.updateBlog(id, req.body);
    res.json({ blog: updatedblog });
  } catch (e: any) {
    console.error(e);
    throw new Error(e);
  }
});

// Delete a blog
export const deleteBlog = expressAsyncHandler(async (req: any, res: any) => {
  const { id } = req.params;
  try {
    blogStore.deleteBlog(id);
    res.json({ message: "Deleted successfully" });
  } catch (e: any) {
    console.error(e);
    throw new Error(e);
  }
});

// Get blog by id
export const getBlog = expressAsyncHandler(async (req: any, res: any) => {
  const { id } = req.params;
  try {
    const blog = blogStore.getBlogById(id);
    if (blog) {
      res.json({ blog: blog });
    } else {
      res.json({ message: `Blog not found with id ${id}` });
    }
  } catch (e: any) {
    console.error(e);
    throw new Error(e);
  }
});

// Get all blogs
export const getAllBlogs = expressAsyncHandler(async (req: any, res: any) => {
  try {
    const blogList = blogStore.getAllBlog();
    if (blogList) {
      res.json({ blogs: blogList });
    } else {
      res.json({ message: `Blog not found` });
    }
  } catch (e: any) {
    console.error(e);
    throw new Error(e);
  }
});

// Like the Blog
export const liketheBlog = expressAsyncHandler(async (req: any, res: any) => {
  const { email } = req.user;
  const { id } = req.body;
  try {
    const result = blogStore.likeTheBlog(email, id);
    res.json({ message: result });
  } catch (e: any) {
    console.error(e);
    throw new Error(e);
  }
});

// Dislike the Blog
export const disliketheBlog = expressAsyncHandler(
  async (req: any, res: any) => {
    const { email } = req.user;
    const { id } = req.body;
    try {
      const result = blogStore.dislikeTheBlog(email, id);
      res.json({ message: result });
    } catch (e: any) {
      console.error(e);
      throw new Error(e);
    }
  }
);

//upload blog images
export const uploadImages = expressAsyncHandler(async (req: any, res: any) => {
  const { id } = req.params;
  try {
    const blog = blogStore.getBlogById(id);
    const files = req.files;

    if (files && blog) {
      for (const file of files) {
        blog.images.push({
          public_id: file.filename,
          url: file.path.replace(/\\/g, "/"),
        });
      }
      const updatedblog = blogStore.updateBlog(id, blog);
      res.json(updatedblog);
    }
  } catch (e: any) {
    throw new Error(e);
  }
});
