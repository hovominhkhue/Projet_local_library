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

authorSchema.virtual("lifespan").get(function () {
    let lifetime_string = "";
    if (this.dateOfBirth) {
      lifetime_string = DateTime.fromJSDate(this.dateOfBirth).toLocaleString(
        DateTime.DATE_MED
      );
    }
    lifetime_string += " - ";
    if (this.dateOfDeath) {
      lifetime_string += DateTime.fromJSDate(this.dateOfDeath).toLocaleString(
        DateTime.DATE_MED
      );
    }
    return lifetime_string;
  });
  
authorSchema.virtual("dateOfBirth_dd_mm_yyyy").get(function () {
return DateTime.fromJSDate(this.dateOfBirth).toISODate(); 
});

authorSchema.virtual("dateOfDeath_dd_mm_yyyy").get(function () {
return DateTime.fromJSDate(this.dateOfDeath).toISODate(); 
});  

module.exports = mongoose.model("Author", authorSchema);