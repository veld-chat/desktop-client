<template>
  <layout>
    <div class="m-5">
      <h1>My account</h1>

      <div class="settings-user bg-dark p-3">
        <div class="row no-gutters flex space-between align-center">
          <current-user-view />
        </div>

        <div class="mt-3 p-3 bg-white">
          <div class="row mb-3">
            <div class="col">
              <p class="text-dark text-uppercase font-weight-bold">
                User ID
              </p>
              {{ user.id }}
            </div>
            <div class="col-auto" />
          </div>

          <div class="row">
            <div class="col">
              <p class="text-dark text-uppercase font-weight-bold">
                Username
              </p>
              {{ user.name }}
            </div>
            <div class="col-auto" />
          </div>
        </div>
      </div>
    </div>

    <template slot="sidebar">
      Settings
    </template>
  </layout>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Layout from "../layouts/Layout.vue";
import { namespace } from "vuex-class";
import { User } from "@/models";
import CurrentUserView from "../components/current-user-view.vue";

const session = namespace("session");

@Component({
  metaInfo: {
    title: "Settings",
  },
  components: {
    Layout,
    CurrentUserView,
  },
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
