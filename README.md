# Heimdallr Apps
React native using Nx monorepo.

# Requirements
- React Native CLI **0.63.3**

  This project is base on React Native, please make sure you already complete the installation and environment. Please use React Native CLI to setup.

  [React Native - Building Projects with Native Code](https://reactnative.dev/docs/0.63/environment-setup)

# Install
```
$ yarn install
```

# Debug
```
$ yarn build            // build debug app
$ yarn lint             // lint code
$ yarn generate:assets  // auto generate image path
$ yarn i18n-helper      // i18n scripts
```

# Release
## Android (aab)
### Pre-Request
- Add certification files from google driver into android/app folder
  - Account: dev@tel25.com
  - Google Driver Path: Certification/TeluApp
  - Project Path:
```
./android/app/release-key.properties
./android/app/release.keystore
```
### Release
#### 1. Change versionCode and versionName
```
JS version ="major.minor.patch.code-push"
versionName = "major.minor.patch"
versionCode = (major * 1000000) + (minor * 10000) + (patch * 100) + (build * 1)
```

For example:
```
JS version = "1.2.3-4"
versionName = "1.2.3"
versionCode = 1020304
```

Note.
  - build: 1 ~ 50 - debug or development
  - build: 61 - prod
  - build: 81 - development

#### 2. Generating AAB

```
$ yarn release:android
```

## iOS
### Upload app to App Store Connect
1. Open Xcode.
2. Change Current Project Version and Marketing Version in Build Settings.
2. Open the Scheme pop-up menu and select env scheme.
3. Choose your simulator target to `Generic iOS Device`.
4. Choose Product > Archive from the main menu.
5. Distribute App

### Convert Xcarchive to IPA
https://gist.github.com/Bruno-Furtado/2f965191b2845db99d5fa48599ad88b2

## Code Push
### Pre-Request
- Before you can start releasing updates, please log into App Center.

```
$ npm install -g appcenter-cli
$ appcenter login
```

## Push to Development
```
$ yarn codepush
```

# Troubleshooting
## M1
- pod install error

  https://github.com/CocoaPods/CocoaPods/issues/10723#issuecomment-864408657
  ```
  $ cd apps/xxx-app/ios && arch -x86_64 pod install
  ```
- building for iOS Simulator, but linking in object file built for iOS, for architecture arm64

  https://stackoverflow.com/questions/63607158/xcode-building-for-ios-simulator-but-linking-in-an-object-file-built-for-ios-f


## pjsip not install
```
$ git config --global url."https://".insteadOf git://
```
