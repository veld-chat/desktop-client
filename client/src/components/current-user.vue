<template>
  <member-list-item :user="user" />
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
}
</script>
