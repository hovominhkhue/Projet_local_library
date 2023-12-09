const mongoose = require("mongoose");

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

authorSchema.virtual("dateOfBirthFormatted").get(function () {
    if (this.dateOfBirth) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return this.dateOfBirth.toLocaleDateString('en-US', options);
    } else {
        return "Unknown";
    }
});

authorSchema.virtual("dateOfDeathFormatted").get(function () {
    if (this.dateOfDeath) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return this.dateOfDeath.toLocaleDateString('en-US', options);
    } else {
        return "Unknown";
    }
});

authorSchema.virtual("lifespan").get(function () {
    if (this.dateOfBirth && this.dateOfDeath) {
        const birth = new Date(this.dateOfBirth);
        const death = new Date(this.dateOfDeath);
        const lifespanInMilliseconds = death - birth;
        const millisecondsPerYear = 1000 * 60 * 60 * 24 * 365.25; 
        const years = lifespanInMilliseconds / millisecondsPerYear;
        return Math.floor(years);
    } else {
        return "Unknown";
    }
});

module.exports = mongoose.model("Author", authorSchema);