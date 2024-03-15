const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    categoryId: {
        type: Number,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: [true, 'Category Name is Required'],
        minlength: [3, 'Category Name is short'],
        maxlength: [30, 'Category Name is long'],

    },
    slug: {
        type : String,
        lowercase : true,
    },
    description: {
        type: String,
        maxlength: [500, 'Description is too long'],
    },
    image: [String],
}, { timestamps: true });


const setImageURL = (doc) => {
    if (doc.image) {
      const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
      doc.image = imageUrl;
    }
  };
  // findOne, findAll and update
  categorySchema.post('init', (doc) => {
    setImageURL(doc);
  });
  
  // create
  categorySchema.post('save', (doc) => {
    setImageURL(doc);
  });

//Create Model
const categoryModel = mongoose.model('Category', categorySchema);

module.exports = categoryModel;
