# Cool notes application

App to manage notes and users. Visit the live version at: https://blitznotiz.at/

## FEATURES

- Notes can be added and edited. The notes get saved into a database and get referenced to a used.
- Users can register and login.
- Admin can see a list of users and create new admin users.
- 2 Factor Authentication for each user can be enabled in the settings page.
- Frontend can be adapted to a users needs: Fontsize, Font family, theme, color palette and custom meanings for notes can be chosen.
- The users login data can be edited in settings.
- Notes can have a due date. Users can filter for those dates to see what notes are urgent, and also export them to google calender.
- PWA can be used for both Android and IOS.

## USED TECHNOLOGIES

- React + Vite
- Java
- Postgres SQL
- EmailJS
- ZAP for penetration testing

## LEARNINGS

- Only use enums in special cases where you cannot store data in another way. For colors, using enums does not make a lot of sense. When a user enters a new color, this value is going to be a hex value, which makes it impractical to handle in the backend, when it expects it to be an enum.

- Plan out the classes you want to use. An interface can be used in cases where classes are very equal (like ColorPalette and CustomColorPalette). Also, plan out the features you want to use to avoid re-writing entire classes.

- Plan out the react router setup. You may not have to use localstorage all the time when navigating between pages.

## DEPLOYING

# Frontend

1. npm run build
2. Copy the /dist folder to the server
3. Create an apache conf file:

```
# Redirect all HTTP traffic to HTTPS
<VirtualHost *:80>
    ServerName blitznotiz.at
    Redirect permanent / https://blitznotiz.at/
RewriteEngine on
RewriteCond %{SERVER_NAME} =blitznotiz.at
RewriteRule ^ https://%{SERVER_NAME}%{REQUEST_URI} [END,NE,R=permanent]
</VirtualHost>

<VirtualHost *:443>
    ServerName blitznotiz.at

    # SSL Configuration (Replace with your actual SSL cert paths)
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/blitznotiz.at/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/blitznotiz.at/privkey.pem

    # Serve Frontend (React Vite build)
    DocumentRoot /var/www/notes-application/dist
    <Directory /var/www/notes-application/dist>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    # React Router - Handle all routes
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^ /index.html [L]

    # Logs
    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```

4. Enable the conf and restart apache:

```
sudo a2ensite notes-application
sudo systemctl reload apache2
```

5. After copying the /dist folder you need to add a .htaccess so that the files are served correctly:

```
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ /index.html [L]
```

# Backend

1. Make a .jar file of the backend:

```
mvn clean package
```

2. The jar file from /target needs to be copied to the server
3. Create a .service file that executes the jar:

[Unit]
Description=My Java Application
After=network.target

[Service]
User=root
WorkingDirectory=/
ExecStart=/usr/bin/java -jar /var/www/notes-application/backend.jar
SuccessExitStatus=143
Restart=always
RestartSec=5
StandardOutput=file:/var/log/myapp.log
StandardError=file:/var/log/myapp-error.log

[Install]
WantedBy=multi-user.target

4. Also, create a subdomain for the backend and point the DNS to the server.
5. Add an apache conf file for api.blitznotiz.at:

```
# Backend API (api.blitznotiz.at)
<VirtualHost *:80>
    ServerName api.blitznotiz.at
    Redirect permanent / https://api.blitznotiz.at/
RewriteEngine on
RewriteCond %{SERVER_NAME} =api.blitznotiz.at
RewriteRule ^ https://%{SERVER_NAME}%{REQUEST_URI} [END,NE,R=permanent]
</VirtualHost>

<VirtualHost *:443>
    ServerName api.blitznotiz.at

    # SSL Configuration (Use the same SSL cert as your frontend)
    SSLEngine on

    # Proxy requests to your backend
    ProxyPreserveHost On
    ProxyPass / http://localhost:8088/
    ProxyPassReverse / http://localhost:8088/

    # Logs
    ErrorLog ${APACHE_LOG_DIR}/api-error.log
    CustomLog ${APACHE_LOG_DIR}/api-access.log combined
    SSLCertificateFile /etc/letsencrypt/live/blitznotiz.at/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/blitznotiz.at/privkey.pem
Include /etc/letsencrypt/options-ssl-apache.conf
</VirtualHost>
```

6. Also, rewrite the frontend requests if necessary: For example, a request to http://localhost:8088/login becomes https://api.blitznotiz.at/login

7. Copy the .env file to the new /dist folder on the server
