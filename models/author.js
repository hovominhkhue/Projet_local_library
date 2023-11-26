const mongoose = require ("mongoose");

const Schema = mongoose.Schema;

const authorSchema = new Schema({
    firstName: {type: String, required:true, maxLength: 100},
    lastName: {type: String, required:true, maxLength: 100},
    dateOfBirth: {type: Date},
    dateOfDeath: {type: Date},
})

//virtual for author's full name
authorSchema.virtual("name").get(function () {
    let fullName = "";
    if (this.firstName && this.lastName) {
        fullName = `${this.lastName}, ${this.firstName}`;
    }
    return fullName;
})

// Virtual for author's URL
AuthorSchema.virtual("url").get(function () {
    return `/catalog/author/${this._id}`;
});

// Export model
module.exports = mongoose.model("Author", AuthorSchema);