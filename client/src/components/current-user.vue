<template>
  <div>
    <login v-if="showLogin" @close="showLogin = false" />
    <div class="flex space-between align-bottom">
      <member-list-item :user="user"/>
      <a style="color: var(--active-200);" @click.prevent="showLogin = true">
        Not you?
      </a>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import MemberListItem from "./member-list-item.vue";
import { Getter, namespace } from "vuex-class";
import { User } from '../models';

const session = namespace("session");

@Component({
  components: {
    MemberListItem
  }
})
export default class CurrentUserView extends Vue {
  @session.State("user") user: User;
  showLogin = false;
}
</script>
