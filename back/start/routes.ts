import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const UserProjectsController = () => import('../app/controllers/user_projects_controller.js')
const AuthenticationController = () => import('../app/controllers/authentication_controller.js')
const ProjectsController = () => import('../app/controllers/projects_controller.js')
const UsersController = () => import('../app/controllers/users_controller.js')

router
  .group(() => {
    /** Authentication */
    router.post('login', [AuthenticationController, 'login'])
    router.get('me', [AuthenticationController, 'me']).use(middleware.auth())
    router.get('logout', [AuthenticationController, 'logout']).use(middleware.auth())

    /** User */
    router.post('sign-in', [UsersController, 'signIn'])
    router.get('confirm-account/:email', [UsersController, 'confirmAccount']).as('confirmAccount')
    router.post('reset-password', [UsersController, 'resetPassword'])
    router.get('users', [UsersController, 'index']).use(middleware.auth())
    router.put('user', [UsersController, 'invite']).use(middleware.auth()).use(middleware.admin())
    router
      .post('user/:id', [UsersController, 'update'])
      .use(middleware.auth())
      .use(middleware.admin())

    router
      .delete('user/:id', [UsersController, 'delete'])
      .use(middleware.auth())
      .use(middleware.admin())

    router
      .get('user/:id/join/:projectId', [UserProjectsController, 'join'])
      .use(middleware.auth())
      .use(middleware.admin())

    router
      .get('user/:id/leave/:projectId', [UserProjectsController, 'leave'])
      .use(middleware.auth())
      .use(middleware.admin())

    /** Project */
    router.get('project', [ProjectsController, 'index']).use(middleware.auth())
    router.put('project', [ProjectsController, 'store']).use(middleware.auth())
    router
      .delete('project/:id', [ProjectsController, 'delete'])
      .use(middleware.auth())
      .use(middleware.admin())
  })
  .prefix('v1')
