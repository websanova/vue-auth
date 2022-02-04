import {Vue} from 'vue/types/vue';
import {PluginObject} from 'vue/types';

//

type Redirect = {path: string} | {name: string} | string;

//

interface RequestOptions {
    data?: {};
    params?: {};
    url?: string;
    method?: string;
}

interface RedirectInterface {
    type: string;
    from: any;
    to: any;
}

//

interface UserInterface {
    // Depends on app
}

interface FetchOptions extends RequestOptions {
    redirect?: Redirect;
}

interface RefreshOptions extends RequestOptions {
    //
}

interface RegisterOptions extends LoginOptions {
    autoLogin?: boolean
}

interface LoginOptions extends RequestOptions {
    fetchUser?: boolean;
    staySignedIn?: boolean;
    remember?: string;
    redirect?: Redirect;
}

interface LogoutOptions extends RequestOptions {
    makeRequest?: boolean;
    redirect?: Redirect;
}

interface Oauth2Options extends RequestOptions {
    code?: boolean;
    provider?: string;
    redirect?: Redirect;
    staySignedIn?: boolean;
    remember?: string;
    fetchUser?: boolean;
    window?: {
        name?: string,
        specs?: any,
        replace?: boolean,
    };
}

interface ImpersonateOptions extends RequestOptions {
    redirect?: Redirect;
}

interface UnimpersonateOptions extends RequestOptions {
      redirect?: Redirect;
      makeRequest?: boolean;
}

//

interface VueAuth extends PluginObject<any> {

    /**
     * Returns binded boolean property to know when auth is fully loaded.
     *
     * @return {boolean}
     */
    ready(): boolean

    /**
     * Same as the the ready method to check when auth is fully loaded.
     * However this returns a Promise instead of a boolean to allow further
     * processing. Basically a shortcut for having a watch on the "ready" method.
     *
     * @return {Promise}
     */
    load(): Promise<any>;

    /**
     * Returns a redirect object if any redirect occurred. This happens when trying
     * to reach an authenticated page when logged out or forbidden. A redirect occurs
     * by default to the login page with the to/from redirect router reference.
     *
     * @return {any}
     */
    redirect(): RedirectInterface;

    /**
     * Return the user data from retrieved from either the login or user fetch request.
     * The user data can also be set manaully by passing in an object.
     *
     * @param  {any} data - Manually set user data.
     * @return {any}
     */
    user(data?: any): UserInterface;

    /**
     * Check a users access access against their role in the user data that was fetched.
     * Can also optionally pass in a role string or object to check against for something
     * more specific. This is useful for toggling elements in a component for admin/user access.
     *
     * @param  {any}     role - Set role/privilege to check.
     * @param  {string}  key  - Use a different key on the user object than the default defined in the default options.
     * @return {boolean} 
     */
    check(role?: any, key?: string): boolean;

    /**
     * Check if it is in impersonating mode.
     *
     * @return {boolean}
     */
    impersonating(): boolean

    /**
     * Fetch the current token or set a new one.
     *
     * @param  {string}  name    - Specify the token to fetch or name to set.
     * @param  {string}  token   - If setting a token specify the token data/string.
     * @param  {boolean} expires - If setting a token specify if it's expring after the session or not.
     * @return {string}
     */
    token(name?: string, token?: string, expires?: boolean): string

    /**
     * Fetch the user (again) allowing the users data to be reset (from the api).
     *
     * @param  {FetchOptions} option - Set of options passed to http call.
     * @return {Promise}
     */
    fetch(options: FetchOptions): Promise<any>;

    /**
     * Refresh the app token from the backend api.
     * The options object is passed directly to the http method.
     *
     * @param  {RefreshOptions} option - Set of options passed to http call.
     * @return {Promise}
     */
    refresh(options: RefreshOptions): Promise<any>;

    /**
     * Register call.
     *
     * @param  {RegisterOptions} options - Set of options passed to http call.
     * @return {Promise}
     */
    register(options: RegisterOptions): Promise<any>;

    /**
     * Login call.
     *
     * @param  {LoginOptions} options - Set of options passed to http call.
     * @return {Promise}
     */
    login(options: LoginOptions): Promise<any>;

    /**
     * Store some basic data to remember a user. Useful for showing a welcome back
     * message when a user returns to login and is not actually logged in yet.
     *
     * Note that this is stored in either local storage or a cookie depending on the
     * storage type selected and should be converted to a string if setting an object.
     *
     * @param  {string} val - Set of options passed to http call.
     * @return {string}
     */
    remember(val?: string): string;

    /**
     * Clears the stored remember data.
     *
     * @return {void}
     */
    unremember(): void;

    /**
     * Logout call.
     *
     * @param  {LogoutOptions} options - Set of options passed to http call.
     * @return {Promise}
     */
    logout(options: LogoutOptions): Promise<any>;

    /**
     * Impersonate call.
     *
     * @param  {ImpersonateOptions} options - Set of options passed to http call.
     * @return {Promise}
     */
    impersonate(options: ImpersonateOptions): Promise<any>;

    /**
     * Unimpersonate call.
     *
     * @param  {UnimpersonateOptions} options - Set of options passed to http call.
     * @return {Promise}
     */
    unimpersonate(options: UnimpersonateOptions): Promise<any>;

    /**
     * Oauth2 social login call.
     *
     * @param  {Oauth2Options} options - Set of options passed to http call.
     * @return {Promise}
     */
    oauth2(options: Oauth2Options): Promise<any>;
    oauth2(provider: string, options: Oauth2Options): Promise<any>;

    /**
     * Disable impersonating mode.
     *
     * Useful if an admin call needs to be made while impersonating.
     *
     * @return {void}
     */
    disableImpersonate(): void;

    /**
     * Re-enable impersonating mode. 
     *
     * @return {void}
     */
    enableImpersonate(): void;
}

interface VueAuthCreateOptions {
    plugins: any,
    drivers: any,
    options?: any,
}

declare function createAuth(options: VueAuthCreateOptions): VueAuth & { install: (app: unknown) => void };

declare function useAuth(key?: string): VueAuth;

declare module 'vue/types/vue' {
    interface Vue {
        $auth: VueAuth;
    }
}
