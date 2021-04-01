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
  load_works: '/api/user/load/work/list',
  add_job_to_fav: '/api/user/add/job/to/fav',
  get_work_details: '/api/user/get/work/details',
  process_payment: '/api/payment/process/payment',
  meetings_list: '/api/user/meetings/list',
  cancel_meeting: '/api/user/cancel/meeting',
  submit_review: '/api/user/submit/review'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
