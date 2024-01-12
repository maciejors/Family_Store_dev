# Family Store Dev

#### by [maciejors](https://github.com/maciejors) & [pawelb100](https://github.com/pawelb100)

*DISCLAIMER: this is a personal project*

Family Store Dev is a Next.js project designed to manage a service that stores mobile applications for installation, similar to the Google Play Store. This project allows developers to upload APK files and custom details about their own Android applications hosted in Firebase. There's a complementary mobile app Family Store ([repo](https://github.com/pawelb100/Family_Store))
used to view and download available apps directly into Android mobile phones.

## Technologies Used

- **Next.js**: A React framework for building server-rendered applications.
- **JavaScript**: The primary programming language used in the project.
- **Tailwind CSS**: A utility-first CSS framework for UI development.
- **Firebase Realtime Database**: A cloud-hosted NoSQL database to store and sync data in real-time.
- **Firebase Storage**: A cloud storage service for securely uploading and downloading content.

## Features
  
- **Browse Applications:** Explore list of mobile applications available on the platform.

- **View App Details:** Access detailed information about each application, including descriptions, authors, recent changelogs, and screenshots.

- **Download Installation Files:** Users can easily download the installation files for their selected applications.

## Planned Features

We are actively working on enhancing Family Store Dev with the following features:

1. **Authentication:**
   - **Sign In:** Allow users to sign in to their accounts for personalized experiences and app preferences.
   - **Create New Account:** Provide a seamless process for users to create new accounts and access additional features.

2. **App Management:**
   - **Create New App:**
     - Effortlessly add new applications to the platform, providing detailed information, screenshots, logos, and changelogs.
   - **Edit Existing App Details:**
     - Modify app information, update screenshots, logos, and changelogs to keep the content up-to-date and accurate.

3. **File Management:**
   - **Upload Installation Files:**
     - Empower users to upload new installation files, such as .apk files, for their selected applications. Ensure a smooth and secure process for file submissions.


## Screenshots

![Dashboard](https://firebasestorage.googleapis.com/v0/b/family-store.appspot.com/o/Family%20Store%202%2Ffs-screenshots%2Ffsdev2.png?alt=media&token=53278c0b-9354-47d0-88c2-9161bd338060)

![Login Page](https://firebasestorage.googleapis.com/v0/b/family-store.appspot.com/o/Family%20Store%202%2Ffs-screenshots%2Ffsdev1.png?alt=media&token=62fbfcc2-4bf3-4655-b703-38035b27fda3)

## Usage

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

1. Clone the repository:

```bash
git clone https://github.com/maciejors/Family_Store_dev.git
```

2. Install dependencies:

```bash
cd Family_Store_dev
npm install
```

3. Run the application:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser to explore the Family Store Dev.
