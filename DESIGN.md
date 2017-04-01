# API Design

This document details how the API is designed.

Requirements:

- Create/read/update/destroy users
- Users have passwords, required to log in to be able to do basically anything
- Passwords are stored hashed and salted using an encryption library
- Each user has:
  - <string> display name
  - <userid> unique user id
  - <password> salted password
  - <list(levels)> list of levels created by the user
  - <key> activation key for account
  - <int> total file size by user - prevent users from uploading too many levels, perhaps have account levels like Mario Maker

- Create/read/update/destroy levels
  - Users can only create/update/destroy their own levels, others can only read them
- Each level has:
  - <string> name
  - <userid> creator
  - <string> description
  - <uuid> id (in case the level name changes)
  - <string> filename where level is stored on disk
  - <list(comments)> list of comments about the level
  - <int> plays
  - <int> clears
  - <int> deaths
  - <list(float+user)> fastest clear times by user
  - <list(tag)> list of tags for the level (probably prebuilt)
  - <float> total playtime on level by all users
  - <image> icon for level?
  - <datetime> creation date for level
  - <datetime> last update date for level
  - <version> version created under

- Dynamic level querying by name, creator, rating, tags, playtime, clear rate, etc.
