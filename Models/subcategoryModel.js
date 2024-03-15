const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Category Name is Required'],
        minlength: [3, 'Category Name is short'],
        maxlength: [20, 'Category Name is long'],

    },
    slug: {
        type : String,
        lowercase : true,
    },
    description: {
        type: String,
        required: [true, "subCategory description is required"],
        maxLength: [
          300,
          "This description is very large and should not exceed 300 words",
        ],
      },
      parentCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'subCategory must belong to main category'],
    },
    image: [String],
    
},
{timestamps: true});


const setImageURL = (doc) => {
    if (doc.image) {
      const imageUrl = `${process.env.BASE_URL}/subCategories/${doc.image}`;
      doc.image = imageUrl;
    }
  };
  // findOne, findAll and update
  subCategorySchema.post('init', (doc) => {
    setImageURL(doc);
  });
  
  // create
  subCategorySchema.post('save', (doc) => {
    setImageURL(doc);
  });


//Create Model
const subCategoryModel = mongoose.model('SubCategory', subCategorySchema);

module.exports = subCategoryModel;
