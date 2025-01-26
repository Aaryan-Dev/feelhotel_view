**_ Only Configured for IOS simulation _**

## Project Structure

The project follows a standard React Native structure:

- **`android/`**: Android-specific code and configurations.
- **`ios/`**: iOS-specific code and configurations.
- **`src/`**: Contains the main application source code.
  - **`assets/`**: Contains Images.
  - **`components/`**: Reusable React components.
  - **`Hooks/`**: Has CustomHooks.
  - **`Pages/`**: Comprises of Screens.
  - **`utils/`**: Contains mostly regex.

## Functionality

The FeelHotel View application provides the following functionalities:

- **User Authentication**: Users can sign up and log in to access personalized features.
- **Hotel Listings**: Browse and search for hotels with detailed information.
- **Booking Management**: Users can book hotels and view their booking history.

This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

**_ Note: Only Configured for IOS simulation _**

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _iOS_ app:

### Only For iOS

- cd ios
- pod install
- cd ..

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Xcode respectively.

## Step 3: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [Introduction to React Native](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.

### Files and Directories

1.  **Core Files**:

    - `src/App.tsx`: Likely the main entry point for the React application.
    - `src/ApolloProvider.js`: Provides Apollo Client setup for GraphQL integration.
    - `src/routes.js`: Defines application routes.

2.  **Utilities**:

    - `src/utils/index.js`: Centralizes utility functions.
    - `src/utils/regex.js`: Contains regular expressions for validations or pattern matching.

3.  **Components**:

    - **Atoms**: Small, reusable components like inputs, buttons, and actions.
    - **Molecules**: Composite components such as `SignUp`, `SignIn`, and `GoogleSign`.

4.  **Hooks**:

    - Custom hooks (`useToggle`) for state management.

5.  **Assets**:

    - Images (`hotel_icon.png`, `android-chrome-192x192.png`).

6.  **Pages**:

    - `Home`, `Login`: Page-level components.
