const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const authorSchema = new Schema({
    firstName: { type: String, required: true, maxLength: 100 },
    lastName: { type: String, required: true, maxLength: 100 },
    dateOfBirth: { type: Date },
    dateOfDeath: { type: Date },
});

authorSchema.virtual("name").get(function () {
    let fullName = "";
    if (this.firstName && this.lastName) {
        fullName = `${this.lastName}, ${this.firstName}`;
    }
    return fullName;
});

authorSchema.virtual("url").get(function () {
    return `/catalog/author/${this._id}`;
});

authorSchema.virtual('date_of_birth_dd_mm_yyyy').get(function () {
    if (this.dateOfBirth) {
        return DateTime.fromJSDate(this.dateOfBirth).toFormat('dd-MM-yyyy');
    } else {
        return 'Date of birth not specified';
    }
});

authorSchema.virtual('date_of_death_dd_mm_yyyy').get(function () {
    if (this.dateOfDeath) {
        return DateTime.fromJSDate(this.dateOfDeath).toFormat('dd-MM-yyyy');
    } else {
        return 'Date of death not specified';
    }
});

authorSchema.virtual("lifespan").get(function () {
    if (this.dateOfBirth && this.dateOfDeath) {
        const birthYear = this.dateOfBirth.getYear() + 1900; 
        const deathYear = this.dateOfDeath.getYear() + 1900; 
        return deathYear - birthYear; 
    } else {
        return "Unknown";
    }
});

module.exports = mongoose.model("Author", authorSchema);