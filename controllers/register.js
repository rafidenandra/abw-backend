const handleRegister = (db, bcrypt) => (req, res) => {
    const { first_name, last_name, email, password, institution } = req.body;

    if( !email || !first_name || !last_name || !password || !institution ){
		return res.status(400).json("incorrect data");
    }

    const hash = bcrypt.hashSync(password);

        // db.transaction(trx => {
        //     trx.insert({
        //         hash: hash,
        //         email: email
        //     })
        //     .into('login')
        //     .returning('email')
        //     .then(loginEmail => {
        //         return trx('users')
        //             .returning('*')
        //             .insert({
        //                 first_name: first_name,
        //                 last_name: last_name,
        //                 email: loginEmail[0],
        //                 institution: institution,
        //                 joined: new Date()
        //             })
        //             .then(user => {
        //                 res.json(user[0]);
        //             })
        //     })
        //     .then(trx.commit)
        //     .catch(trx.rollback)
        // })
        // .catch(err => res.status(400).json('Unable to register!'))

    db.transaction(trx => {
        trx("users")
        .insert({
            first_name: first_name,
            last_name: last_name,
            email: loginEmail[0],
            institution: institution,
            joined: new Date()
        })
        .returning("*")
        .then(user => {
            res.json(user[0]);
            return trx("login")
            .insert({
                hash: hash, 
                user_id: user[0].id
            })
            .returning("user_id");
        })	
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch( err => res.status(400).json("Unable to register!"));
}

module.exports = {
	handleRegister: handleRegister
};