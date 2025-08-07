# EduTea

EduTea is a web platform focused in the education sector where all the institutions can have a centralized environment with multiple essential functions for the development of needed activities in a classroom

As well, it will be available a system of accounts (admin, teacher, student) through which there will be different roles inside the application, which are used for how permissions and interactions happen.

## Some of the main functions of this project

- **Real time chat system:** The platform has a real time chat system that works alongside a chat room system, these rooms have unique codes to join them, these rooms are specifically designed to mimic what a classroom would be

- **Account system:** the account system has a hierarchy, as mentioned previously, it has the purpose of controlling the permissions and regulate the actions inside the application. Another important feature to mention is that the security for the app has been developed to follow standards such as JWT, token blacklisting, serializer, model, and frontend authentication, as well as email verification to make the app more secure and robust.

- **Chat bot assistant:** The chat rooms have a chat bot integrated into them, it answer questions and gives info in the context of and educative app, and it can be used by typing "/EduTea" at the beginning of a message

## Objectives

The main goal of this project is to offer a tool to make easier the task on teaching online, by providing many essential functions to make a classroom interact and develop.

another goal is to implement cybersecurity and artificial intelligence technologies, both to make a secure and reliable app, as well as for given an nice user experience.

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

### Django

`SECRET_KEY=YOUR_DJANGO_SECRET_KEY`

`ENVIRONMENT=development`

### Postgres

`DB_NAME=YOUR_DB_NAME`

`DB_USER=YOUR_DB_USER`

`DB_PASSWORD=YOUR_DB_PASSWORD`

### Redis

`REDIS_URL=YOUR_REDIS_URL`

### AWS

`AMAZONS3_API=YOUR_AMAZON_S3_API`

`AMAZONS3_KEY=YOUR_AMAZON_S3_KEY`

`BUCKET=YOUR_AMAZON_S3_BUCKET`

`BUCKET_REGION=YOUR_AMAZON_S3_BUCKET_REGION`

### Production SMTP server

`EMAIL_HOST=YOUR_AMAZON_SES_HOST`

`EMAIL_PORT=587`

`EMAIL_HOST_USER=YOUR_AMAZON_SES_HOST_USER`

`EMAIL_HOST_PASSWORD=YOUR_AMAZON_SES_HOST_PASSWORD`

`DEFAULT_FROM_EMAIL=YOUR_AMAZON_SES_DEFAULT_FROM_EMAIL`

### Development SMTP server

`DEVELOPMENT_EMAIL_HOST=sandbox.smtp.mailtrap.io`

`DEVELOPMENT_EMAIL_PORT=2525`

`DEVELOPMENT_EMAIL_HOST_USER=YOUR_HOST_USER_KEY`

`DEVELOPMENT_EMAIL_HOST_PASSWORD=YOUR_HOST_USER_PASSWORD`

### Open ai

`OPENAI_API_KEY=OPEN_AI_API_KEY`

## Tech Stack

### Client

- React
- React-hook-form
- React-query
- React-router-dom
- Font Awesome
- ShadCN/UI
- TailwindCSS
- Vite
- Axios
- SweetAlert2

### Database

- PostgreSQL
- Redis

### Server

- Django
- Django Rest Framework
- Django Channels
- Djoser
- Amazon S3
- Amazon SES
- JWT
- OpenAI API

## Color Palette reference

| Color             | Hex                                                                |
| ----------------- | ------------------------------------------------------------------ |
| Dark moss green | ![#546a2a](https://placehold.co/15x15/546a2a/546a2a.png) #546a2a |
| Sage | ![#a4aa7c](https://placehold.co/15x15/a4aa7c/a4aa7c.png) #a4aa7c |
| Tea green | ![#cad8ae](https://placehold.co/15x15/cad8ae/cad8ae.png) #cad8ae |
| Beige | ![#dde6cb](https://placehold.co/15x15/dde6cb/dde6cb.png) #dde6cb |
| Maize | ![#fee763](https://placehold.co/15x15/fee763/fee763.png) #fee763 |
| Baby Powder | ![#f1f5ef](https://placehold.co/15x15/f1f5ef/f1f5ef.png) #f1f5ef |
| Antiflash white | ![#efefef](https://placehold.co/15x15/efefef/efefef.png) #efefef |
| White | ![#fbfbfb](https://placehold.co/15x15/fbfbfb/fbfbfb.png) #fbfbfb |
| Eerie black | ![#171717](https://placehold.co/15x15/171717/171717.png)  #171717 |

**Visualize in coolors.co:** [Coolors link](https://coolors.co/546a2a-a4aa7c-cad8ae-dde6cb-fee763-f1f5ef-efefef-fbfbfb-171717)

## Run Locally

To get all the code from the remote repo to your machine/local repo

` git clone https://github.com/Ralfaro17/EduTea/tree/main `

### To set up the backend

To create a virtual environment

` python -m venv venv `

To activate the virtual environment

` venv/scripts/activate `

If the latter doesn't work, execute the following command and then try to activate the venv again

` Set-ExecutionPolicy Unrestricted -Scope Process `

To go into the django project directory

` cd backend `

To install all the dependencies (while being in the base directory of the repo, that being **Edutea**)

` pip install -r requirements.txt `

To execute the migrations

` python manage.py migrate `

To create a super user

` python manage.py createsuperuser `

To run the server

` python manage.py runserver `

### To set up the frontend

Now, go to the frontend folder, create a new console, and being in the base directory, execute

` cd frontend `

To install all the dependencies

` npm install `

to run the vite server with react

` npm run dev `

## Disclaimer

- If you want to use the Amazon SES service, change the environment variable called `ENVIRONMENT` and set it to `production`

- The python dependencies file (requirements.txt) is located in the **backend** directory

- There is a .env.example file in the **backend/backend** directory as a guideline, when you have your credentials ready, delete the .example at the end of the file and run the backend

- The frontend dependencies file (package.json) is located in the **frontend** directory (You need to have node/npm installed to download the resources)
