# Intro

- Heroku is a distributed web service for hosting apps and other resources e.g websites.
- It allows end users to interact with the deployed app.
- Heroku allocates a dyno (a virtual machine) to allow the app to run on. Multiple
  dynos can improve the app performance but extras will have to be paid for.
- Caching layers, which can also improve the app performance are not allowed
  on Heroku.
- uWSGI will also be availed to serve the app.
- We can also setup configs for the app as well as log settings.
- Heroku also offers Secure Socket Layer (SSL) thus communications between the app
  and clients will be secured.
- A free Heroku account allows 1 dyno per app and limited running time for the dyno.

## Deploying (See heroku_deployment branch for the project deployment version)

- Create a free Heroku account.
- Create a new app and select a run region, based on where most users of the app are located.
- Connect Github: Deploy > connect Github and select a repo to deploy from.
- Before deployment, ensure to have the following files in your project root:
  1.requirements.txt (Do not use pip freeze to generate. The dependancies should
  be non-specific versions e.g. Flask instead of flask == x.x.x)
  2.runtime.txt OPTIONAL (will contain > the app python version e.g. 'python 2.7.15',
  Heroku supported versions are 2.7.15, 3.6.6 & 3.7.0)
  3.uwsgi.ini (uwsgi config file to tell Heroku how to run uwsgi for the app)
  4.Procfile (specify what dyno to use, can be uwsgi or gunicorn. If gunicorn, then
  a .ini file is not required. A single space between the process name and dyno and
  between the dyno name and app to run are crucial, without which the procifle
  will not be read bty Heroku)
- Set a build pack e.g. Python
- Set up heroku to either deploy manually or automatically, and the branch to deploy.
- Ensure successful deployment and launch of the app.

## Heroku Troubleshooting

- On heroku devcenter, download and install the Heroku CLI for the appropriate OS.
- If terminal was running during installation, restart it.
- Run $heroku login and enter Heroku credentials to log in.
- The Heroku CLI can be used to run and debug the app locally, as if it was running on Heroku.
