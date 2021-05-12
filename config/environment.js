
const development = {
    name: 'development',
    assets_path: './assets',
    db_path: 'codeial_development',
    session_secret: 'BlahSomething',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: 'false',
        auth: {
            user: 'prashwarmishra@gmail.com',
            pass: '@Panzer1999',
        }
    },
    google_client_id: '853925351392-bcbu6jlkf3g8c2r846jrem7bm8oiff3d.apps.googleusercontent.com',
    google_client_secret: 'mqwfIEpRD6i2sWEownL_4x9V',
    google_callback_url: 'http://localhost:8000/users/auth/google/callback',
    jwt_secret: 'codeial'
}

const production = {
    name: 'production',
}

module.exports = development;