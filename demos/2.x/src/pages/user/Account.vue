    <template>
    <div>
        <table>
            <tr>
                <td>Fetch</td>

                <td class="text-right">
                    <button @click="fetchManual">
                        <span v-if="form.status ==='loading'" class="spin">↻</span>
                        <span v-else>Manual</span>
                    </button>

                    <button @click="fetchDefault">
                        <span v-if="form.status ==='loading'" class="spin">↻</span>
                        <span v-else>Default</span>
                    </button>

                    <button @click="fetchVuex">
                        <span v-if="form.status ==='loading'" class="spin">↻</span>
                        <span v-else>Vuex</span>
                    </button>
                </td>
            </tr>
        </table>

        <hr />

        <table>
            <tr>
                <td>Refresh</td>

                <td class="text-right">
                    <button @click="refreshDefault">
                        <span v-if="form.status ==='loading'" class="spin">↻</span>
                        <span v-else>Default</span>
                    </button>

                    <button @click="refreshVuex">
                        <span v-if="form.status ==='loading'" class="spin">↻</span>
                        <span v-else>Vuex</span>
                    </button>
                </td>
            </tr>
        </table>

        <hr/>

        <table>
            <tr>
                <td><b>$auth.check() Tests</b></td>

                <td/>
            </tr><tr>
                <td>
                    $auth.check('poo')
                </td>
                <td class="text-right">
                    {{ $auth.check('poo') }}
                </td>
            </tr><tr>
                <td>
                    $auth.check(['poo', 'admin'])
                </td>
                <td class="text-right">
                    {{ $auth.check(['poo', 'admin']) }}
                </td>
            </tr><tr>
                <td>
                    $auth.check({role: 'admin'}, 'role_test_one')
                </td>
                <td class="text-right">
                    {{ $auth.check({role: 'admin'}, 'role_test_one') }}
                </td>
            </tr><tr>
                <td>
                    $auth.check([{role: 'admin'}], 'role_test_one')
                </td>
                <td class="text-right">
                    {{ $auth.check([{role: 'admin'}], 'role_test_one') }}
                </td>
            </tr><tr>
                <td>
                    $auth.check({role: 'admin'}, 'role_test_two')
                </td>
                <td class="text-right">
                    {{ $auth.check({role: 'admin'}, 'role_test_two') }}
                </td>
            </tr><tr>
                <td>
                    $auth.check('admin', 'role_test_three')
                </td>
                <td class="text-right">
                    {{ $auth.check('admin', 'role_test_three') }}
                </td>
            </tr><tr>
                <td>
                    $auth.check({role: 'admin'}, 'role_test_four.nes.ted')
                </td>
                <td class="text-right">
                    {{ $auth.check({role: 'admin'}, 'role_test_four.nes.ted') }}
                </td>
            </tr><tr>
                <td>
                    $auth.check('admin', 'role_test_four.nes.ted.role')
                </td>
                <td class="text-right">
                    {{ $auth.check('admin', 'role_test_four.nes.ted.role') }}
                </td>
            </tr><tr>
                <td>
                    $auth.check(['poo', 'admin'], 'role_test_four.nes.ted.role')
                </td>
                <td class="text-right">
                    {{ $auth.check(['poo', 'admin'], 'role_test_four.nes.ted.role') }}
                </td>
            </tr>
        </table>

        <hr/>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                form: {
                    status: null
                }
            }
        },

        created() {
            var user = this.$auth.user();

            // one

            user.role_test_one = [
                {role: 'admin'},
                {role: 'super-admin'}
            ];

            // two

            user.role_test_two = {role: 'admin'};

            // three

            user.role_test_three = ['super-admin', 'admin'];

            // four

            user.role_test_four = {nes: {ted: {role: 'admin'}}};

            //

            this.$auth.user(user);
        },

        methods: {
            loading() {
                this.form.status = 'loading';
            },

            complete() {
                this.form.status = 'complete';
            },

            error() {
                this.form.status = 'error';
            },

            fetchManual() {
                this.loading();

                this.$http({
                    url: 'auth/user'
                })
                .then((res) => {
                    var user = res.data.data;

                    user.first_name = 'Yay!';

                    this.$auth.user(user);

                    this.complete();
                }, this.error);
            },

            fetchDefault() {
                this.loading();

                this.$auth
                    .fetch()
                    .then(this.complete, this.error);
            },

            fetchVuex() {
                this.loading();
                
                this.$store
                    .dispatch('auth/fetch')
                    .then(this.complete, this.error);
            },

            refreshDefault() {
                this.loading();

                this.$auth
                    .refresh()
                    .then(this.complete, this.error);
            },

            refreshVuex() {
                this.loading();
                
                this.$store
                    .dispatch('auth/refresh')
                    .then(this.complete, this.error);
            },
        }
    }
</script>