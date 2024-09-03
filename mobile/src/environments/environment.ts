// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  pusher: {
    key: 'f1456b01b6514f09b9a3',
    cluster: 'ap1',
  },
  inAppKeys: {
    tapAlert: 'tap-alert',
    linkStudent: 'link-student',
    announcement: 'announcement',
    appUpdate: 'app-update'
  },
  oneSignalAppId: 'f466c8d5-af8a-4281-97b6-3ea14453173c',
  // apiBaseUrl: 'http://localhost:3000/api/v1',
  apiBaseUrl: 'http://192.168.254.182:3000/api/v1',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
