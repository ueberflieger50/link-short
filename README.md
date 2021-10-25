# link-short
A simple easy to deploy Link Shorter using express.js as the webserver, passport.js for user authentication and vue.js for the frontend.  
![Screenshot](static/sample.png)
# Usage
1. Install dependencies
```
npm install --production
```
2. Configure the .env fille in the server directory (A sample is provided as `.env.sample`)
```
SESSION_SECRET=Your-Session-Secret
```
3. Start the server (make shure you are in the home directory of the application)
```
npm start
```
Then go to http://localhost:3000

# Api
## Endpoints without Authentication
- [Redirect to link](docs/redirect.md) : `GET /:id_of_link`
- [Create new link](docs/create_new_link.md) : `POST /api/new`

## Endpoints for Authentication
### For every user
- [Remove user](docs/remove_user.md#user) : `DELETE /api/user/remove/me`
### For Admin
- [List all users](docs/list_users.md) : `GET /api/user/all`
- [Change user type](docs/change_user.md) : `PATCH /api/user/alter/:user_id`
- [Remove user](docs/remove_user.md#admin) : `DELETE /api/user/remove/:user_id`


## Endpoints with Authentication
- [Delete link](docs/remove_link.md) : `DELETE /api/remove` (Only links that I own)
- [List my links](docs/list.md#my) : `GET /api/my`

## Endpoints with Admin specific Authentication
- [Delete link](docs/remove_link.md) : `DELETE /api/remove` (Any links)
- [List all links](docs/list.md#all) : `GET /api/all`

# License
This project is covered under the [MIT](LICENSE) License