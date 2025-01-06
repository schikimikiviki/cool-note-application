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

## USED TECHNOLOGIES

- React + Vite
- Java
- Postgres SQL

## LEARNINGS

- Only use enums in special cases where you cannot store data in another way. For colors, using enums does not make a lot of sense. When a user enters a new color, this value is going to be a hex value, which makes it impractical to handle in the backend, when it expects it to be an enum.

- Plan out the classes you want to use. An interface can be used in cases where classes are very equal (like ColorPalette and CustomColorPalette). Also, plan out the features you want to use to avoid re-writing entire classes.

- Plan out the react router setup. You may not have to use localstorage all the time when navigating between pages.
