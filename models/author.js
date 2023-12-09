const mongoose = require("mongoose");
const moment = require("moment");

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

// Fonction pour définir la date de naissance à partir de la chaîne "DD-MM-YYYY"
authorSchema.virtual("formattedDateOfBirth").set(function (value) {
    this.dateOfBirth = moment(value, "DD-MM-YYYY").toDate();
});

// Fonction pour définir la date de décès à partir de la chaîne "DD-MM-YYYY"
authorSchema.virtual("formattedDateOfDeath").set(function (value) {
    this.dateOfDeath = moment(value, "DD-MM-YYYY").toDate();
});

// Obtenir la date de naissance formatée "DD-MM-YYYY"
authorSchema.virtual("dateOfBirthFormatted").get(function () {
    if (this.dateOfBirth) {
        return moment(this.dateOfBirth).format("DD-MM-YYYY");
    } else {
        return "Input the date of birth in the format DD/MM/YYYY";
    }
});

// Obtenir la date de décès formatée "DD-MM-YYYY"
authorSchema.virtual("dateOfDeathFormatted").get(function () {
    if (this.dateOfDeath) {
        return moment(this.dateOfDeath).format("DD-MM-YYYY");
    } else {
        return "Input the date of death in the format DD/MM/YYYY";
    }
});

authorSchema.virtual("lifespan").get(function () {
    if (this.dateOfBirth && this.dateOfDeath) {
        const birthYear = this.dateOfBirth.getYear() + 1900; // Récupère l'année de naissance
        const deathYear = this.dateOfDeath.getYear() + 1900; // Récupère l'année de décès
        return deathYear - birthYear; // Calcule la durée de vie
    } else {
        return "Unknown";
    }
});

module.exports = mongoose.model("Author", authorSchema);