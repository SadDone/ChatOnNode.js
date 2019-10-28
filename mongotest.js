const MongoClient = require("mongodb").MongoClient;

const mongoClient = new MongoClient("mongodb://localhost:27017/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoClient.connect(function (err, client) {

    const db = client.db('userdb');
    const collection = db.collection('users');
    let user = {
        name: 'Tom',
        age: 23
    };

    collection.insertOne(user, function (err, result) {

        // if (err) {
        //     return console.log(err);
        // }

        console.log(result.ops);
        client.close();

    })

    // if(err) {
    //     return console.log(err);
    // }

    client.close();
})