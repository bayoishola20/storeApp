const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs'); //allows for url friendly names

const storeSchema = new mongoose.Schema({
    name : {
        type: String,
        trim: true,
        required: 'Please enter a valid store name.'
    },
    slug: String,
    description:{
        type: String,
        trim: true
    },
    tags: [String],
    created: {
        type: Date,
        default: Date.now
    },
    photo: String,
    location: {
        type: {
            type: String,
            default: 'Point'
            },
        coordinates: [{
            type: Number,
            required: 'You must supply coordinates'
            }],
        address: {
            type: String,
            required: 'Kindly provide an address'
            }
    }
});

storeSchema.pre('save', async function(next) {
    if (!this.isModified('name')) {
        next(); //Skip
        return; //stops function from running further
    }
    this.slug = slug(this.name);
    
    //TO DO: Handle slug uniqueness
    const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');

    const storeWithSlug =  await this.constructor.find({ slug: slugRegEx }); //this.constructor will return "store"

    if(storeWithSlug.length) {
        this.slug = `{this.slug}-{storesWithSlug.length + 1}`
    }


    next();
});

module.exports = mongoose.model('Store', storeSchema)