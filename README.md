The stupid website is up and running. Checkout 104.236.191.59:3000.

It's just up for the hell of it. It isn't using a product server so it's slow. Eventually (tomorrow hopefully) I will configure a server stack of nginx, unicorn, and capistrano for a long term solution of deployment

This is the skeleton code. Watch the tutorial, most views (HTML and CSS) will be in app/assets I believe. 

# Questions

* Can a study group ever be composed of a group of smaller study groups?
* Do we need to know who is responsible for every study group?
* Can a patient ever belong to multiple study groups?
* Apart from sensor data, what other patient information do we need to collect?
  - Study group, birthday(age), height, and weight seem necessary.
  - What about contact information like email, phone, and/or address?
  - For each patient, do we need to know which clinician is responsible for their wellbeing?
  - Ethnicity?
  - Would a picture of the patient be helpful or is it supposed to be more impersonal?

# Design

This web application will be a tool for clinicians to monitor patients with wearable sensors. Below is a breakdown of the sections and their ideal capabilities. It is possible that some of the items will be too difficult to implement and so will be either ignored, worked around, or postponed until Fall. However, the power of AngularJS should make many of the difficult aspects relatively easy.

"Item???" of course, means it is uncertain whether the item should be included.

## Before Login

User is unable to access patient data until they login.

### Login

* Login existing users
  - Forgot password
* Brief description (for the benefit of potential new users)
  - Project
  - Web app capabilities
  - How it is useful
* Register new users

### About

Detailed description of the project and web app.

### Password Rest

Reset password for a user who forgot it.

1. Get user's email
2. Send email with password reset link 
3. If user clicks link in email:
    1. Prompt user to change password
    2. Login user

**OR**

1. Get user's email
2. Generate a temp password
3. Change user's password to temp password
2. Send email with temp password 
5. Wait for user to use temp password to login
6. Prompt user to create a new password
7. Login user

## After Login

Users can now edit and/or view patient data if they have permission. Can be given permission to *View Only* or *View & Edit* a patient or group. Permission for a group applies not only to the group, but also all patients who are members of the group.

All pages share the same navigation bar, consisting of:

* Home
* Logout
* Account settings
* Add patient
* Add group 
  - Allow groups within groups???
* Search 
  - Display matching patient/group names on a drop-down list

**Change: Specify that groups are study groups.**

### Home

An overview with the purpose of helping the user navigate to patient/group pages of interest.

* Search bar 
  - Specialized filter
  - Only show patients in table with an attribute containing the search term 
* Checkboxes to add/remove attributes shown in table
  - Limits sort/filter options to visible attributes
* Table of patients
  - Clicking a patient/group ID takes user to the respective patient/group's page
  - Color code table rows with patient's status (red="bad", yellow="okay", green="good")???
  - Table Sort options (nested sorting???) 
  - Filter options (multiple???)

Example:

| Name         | Group           | Weight | Age |
| :----------: | :-------------: | :----: | :-: |
| Frank Smith  | Lung Cancer     | 240    | 60  |
| Mary Folsom  | Study B409      | 135    | 34  |
| Nia Conson   | Type 2 Diabetes | 189    | 58  |

### Patient

Provides a detailed view of data for an individual patient. It can be viewed by users with view permission and edits can be made by users with edit permission.

* Patient information
  - Name/ID
  - Image???
    * Not necessarily an actual picture of the patient. 
  - Age
  - Weight
  - Height
  - Gender
  - Conditions
  - Comments???
  - Risk???
    * How much could deviation from specified activity thresholds impact the patient's health? 
    * Would be used for weighting the patient's status relative to the other patients
  - Status (not editable: automatically updated)
    * How is the patient doing based on their success/failure meeting activity thresholds?
  - Ethnicity???
  - Doctor???
    * Who is responsible for the patient's wellbeing?
    * Should it be a list???
* List of groups patient is in
* List of users allowed to *View Only*
* List of users allowed to *View & Edit*
* Activity Thresholds
  - Form:
    * < Activity > < Amount Descriptor > [ Intensity ] per/every/each < Time Period >
  - Examples:
    * (1) Walk at least 3000 steps every week.
    * (2) Run at most 1000 steps at high intensity per day.
* Alerts
  - Patient
    * Send notification "..." to patient if they fail to meet an activity threshold.
  - Clinician
    * Alert responsible doctor(s) if patient doesn't meet activity thresholds for 3 days.
    * Alert doctors with *View & Edit* permission if patient fails threshold #2.
* View of data over time
  - Activity
  - Caloric expenditure
  - Intensity level

### Group

* Name
* Description
* List of patients in group
* Group manager???
  - Who is the group leader?
* Additional attributes from the patient page such as gender or age???
  - If the attribute applies to all patients in the group 
* List of users allowed to *View Only*
* List of users allowed to *View & Edit*
* Activity Thresholds
  - Form:
    * [ Filter ] < Activity > < Amount Descriptor > [ Intensity ] per/every/each < Time Period >
  - Examples:
    * (1) All group members: Sit-ups at least 10 every day.
    * (2) Group members with weight under 200: Walk at least 3000 steps every week.
    * (3) Group members with age over 60: Run at most 1000 steps at high intensity per day.
* Alerts
  - Patient
    * Send notification "..." to any patient in group that fails to meet an activity threshold.
  - Clinician
    * Alert responsible doctor(s) if a patient in the group doesn't meet activity thresholds for 3 days.
    * Alert doctors with *View & Edit* permission if a patient in the group fails threshold #2.

### Account Settings

Allow the user to edit the following:

* User
  - Name
  - Email
  - Password
* List of users sharing permissions
  - Let my colleagues share my permissions so they may work 
  - Let my subordinates share my permissions so they may act on my behalf

#### Forms

* Add patient
* Add group
* Manage group
