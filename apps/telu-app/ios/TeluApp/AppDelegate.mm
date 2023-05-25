#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>

#import "RNSplashScreen.h"
#import "RNCConfig.h"
#import <FBSDKCoreKit/FBSDKCoreKit-swift.h>
#import <RNGoogleSignin/RNGoogleSignin.h>
#import <CodePush/CodePush.h>
#import <UserNotifications/UserNotifications.h>
#import <RNCPushNotificationIOS.h>
#import <Firebase.h>
// CallKit + PushKit
#import "RNCallKeep.h"
#import <PushKit/PushKit.h>
#import "RNVoipPushNotificationManager.h"
#import <RNBranch/RNBranch.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = [RNCConfig envFor:@"APP_MODULE_NAME"];
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  [RNBranch initSessionWithLaunchOptions:launchOptions isReferrable:YES];
  [RNVoipPushNotificationManager voipRegistration]; // RNVoip: register RNVoip

  // push-notification
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  center.delegate = self;

  // fbsdk
  [[FBSDKApplicationDelegate sharedInstance] application:application
                           didFinishLaunchingWithOptions:launchOptions];

  // firebase
  [FIRApp configure];

  bool didFinish = [super application:application didFinishLaunchingWithOptions:launchOptions];
  
  // splash screen, ref: https://github.com/crazycodeboy/react-native-splash-screen/issues/606#issuecomment-1401875339
  [RNSplashScreen show];
  
  return didFinish;
}

- (BOOL)application:(UIApplication *)application
  continueUserActivity:(NSUserActivity *)userActivity
  restorationHandler:(void(^)(NSArray * __nullable restorableObjects))restorationHandler
{
  if (
    // callKeep
    [RNCallKeep application:application continueUserActivity:userActivity restorationHandler:restorationHandler] ||
    // branch
    [RNBranch continueUserActivity:userActivity]
  ) {
    return YES;
  }
  return NO;
}

/* PushKit delegate method */
// --- Handle updated push credentials
- (void)pushRegistry:(PKPushRegistry *)registry didUpdatePushCredentials:(PKPushCredentials *)credentials forType:(PKPushType)type {
  // Register VoIP push token (a property of PKPushCredentials) with server
  [RNVoipPushNotificationManager didUpdatePushCredentials:credentials forType:(NSString *)type];
}

// --- The system calls this method when a previously provided push token is no longer valid for use. No action is necessary on your part to reregister the push type.
// Instead, use this method to notify your server not to send push notifications using the matching push token.
- (void)pushRegistry:(PKPushRegistry *)registry didInvalidatePushTokenForType:(PKPushType)type
{
}

// --- Handle incoming pushes
- (void)pushRegistry:(PKPushRegistry *)registry didReceiveIncomingPushWithPayload:(PKPushPayload *)payload forType:(PKPushType)type withCompletionHandler:(void (^)(void))completion {
  // --- NOTE: apple forced us to invoke callkit ASAP when we receive voip push

  // --- Retrieve information from your voip push payload
  NSDictionary *payloadData = [payload.dictionaryPayload valueForKey:@"data"];
  NSString *uuid = (NSString *)[payloadData valueForKey:@"uuid"];
  NSString *callerName = (NSString *)[payloadData valueForKey:@"title"];
  NSString *handle = (NSString *)[payloadData valueForKey:@"from_msisdn"];

  // --- Process the received push
  [RNVoipPushNotificationManager didReceiveIncomingPushWithPayload:payload forType:(NSString *)type];

  // --- You should make sure to report to callkit BEFORE execute `completion()`
  [RNCallKeep reportNewIncomingCall: uuid
                             handle: handle
                         handleType: @"number"
                           hasVideo: NO
                localizedCallerName: callerName
                    supportsHolding: YES
                       supportsDTMF: YES
                   supportsGrouping: YES
                 supportsUngrouping: YES
                        fromPushKit: YES
                            payload: nil
              withCompletionHandler: completion];

}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  #if DEBUG
    return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"src/index"];
  #else
    return [CodePush bundleURL];
  #endif
}

/// This method controls whether the `concurrentRoot`feature of React18 is turned on or off.
///
/// @see: https://reactjs.org/blog/2022/03/29/react-v18.html
/// @note: This requires to be rendering on Fabric (i.e. on the New Architecture).
/// @return: `true` if the `concurrentRoot` feature is enabled. Otherwise, it returns `false`.
- (BOOL)concurrentRootEnabled
{
  return true;
}

- (BOOL)application:(UIApplication *)app
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  if (
    // fbsdk
    [[FBSDKApplicationDelegate sharedInstance] application:app openURL:url options:options] ||
    // google
    [RNGoogleSignin application:app openURL:url options:options] ||
    // branch
    [RNBranch application:app openURL:url options:options]
  ) {
    return YES;
  }

  return NO;
}

// Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
 [RNCPushNotificationIOS didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}
// Required for the notification event. You must call the completion handler after handling the remote notification.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}
// Required for the registrationError event.
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
 [RNCPushNotificationIOS didFailToRegisterForRemoteNotificationsWithError:error];
}
// Required for localNotification event
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
didReceiveNotificationResponse:(UNNotificationResponse *)response
         withCompletionHandler:(void (^)(void))completionHandler
{
  [RNCPushNotificationIOS didReceiveNotificationResponse:response];
}
// Called when a notification is delivered to a foreground app.
-(void)userNotificationCenter:(UNUserNotificationCenter *)center
      willPresentNotification:(UNNotification *)notification
        withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
{
  // Still call the JS onNotification handler so it can display the new message right away
  NSDictionary *userInfo = notification.request.content.userInfo;
  [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo
                                fetchCompletionHandler:^void (UIBackgroundFetchResult result){}];

  // allow showing foreground notifications
  // completionHandler(UNNotificationPresentationOptionSound | UNNotificationPresentationOptionAlert | UNNotificationPresentationOptionBadge);
  // or if you wish to hide all notification while in foreground replace it with
  completionHandler(UNNotificationPresentationOptionNone);
}
@end
