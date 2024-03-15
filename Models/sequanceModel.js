// Create a Sequence schema
const mongoose = require('mongoose');

const sequenceSchema = new mongoose.Schema({
    name: String,
    value: Number
});

module.exports = mongoose.model('Sequence', sequenceSchema);
// Function to generate the next siteId
// async function getNextSiteId() {
//     const counter = await Counter.findOneAndUpdate(
//         { name: 'siteId' },
//         { $inc: { value: 1 } },
//         { new: true, upsert: true }
//     );
//     return counter.value;
// }