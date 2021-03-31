// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  host: 'http://localhost',
  port: '3000',
  register: '/api/user/register',
  login: '/api/user/login',
  forgot_password: '/api/user/forgot-password',
  change_password: '/api/user/change-password',
  change_profile_picture: '/api/user/changeImage',
  my_profile: '/api/user/mypProfile',
  update_profile: '/api/user/update/profile',
  upload_image: '/api/user/upload/image',
  add_new_work: '/api/professional/add/work',
  list_works: '/api/professional/list/works',
  update_work_status: '/api/professional/update/work/status',
  fetch_upcoming_data: '/api/professional/fetch/upcoming/list',
  fetch_completed_data: '/api/professional/fetch/completed/list',
  fetch_new_data: '/api/professional/fetch/meeting/request/list',
  complete_meeting: '/api/professional/complete/meeting',
  approve_meeting: '/api/professional/approve/meeting',
  remind_for_review: '/api/professional/remind/for/review'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
