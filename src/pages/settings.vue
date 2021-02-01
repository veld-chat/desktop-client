<template>
  <Layout>
    <div class="m-5">
      <h1>My account</h1>

      <div class="settings-user bg-dark p-3">
        <div class="row no-gutters">
          <div class="col-auto">
            <div class="settings-user-avatar x1.25">
              <img alt="Avatar" :src="`https://cdn.miki.bot/chat/avatars/${user.avatarUrl || user.id % 5}.png`" />
            </div>
          </div>
          <div class="col d-flex align-items-center ml-2">
            <strong>{{ user.name }}</strong>
          </div>
        </div>

        <div class="mt-3 p-3 bg-white">
          <div class="row mb-3">
            <div class="col">
              <span class="text-dark text-uppercase font-weight-bold">User ID</span><br />
              {{ user.id }}
            </div>
            <div class="col-auto">

            </div>
          </div>

          <div class="row">
            <div class="col">
              <span class="text-dark text-uppercase font-weight-bold">Username</span><br />
              {{ user.name }}
            </div>
            <div class="col-auto">

            </div>
          </div>
        </div>
      </div>
    </div>

    <template slot="sidebar">
      Pog
    </template>
  </Layout>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Layout from "../layouts/Layout.vue";
import { namespace } from "vuex-class";
import { User } from "@/models";

const session = namespace("session");

@Component({
  metaInfo: {
    title: "Settings"
  },
  components: {
    Layout
  }
})
export default class Root extends Vue {
  @session.Getter("user") user: User;

  username = "";

  mounted() {
    console.log(this.user);
    this.username = this.user.name;
  }
}
</script>
