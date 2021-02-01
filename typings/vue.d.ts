import Vue from "vue";

declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}

declare module 'vue/types/options' {
  type VueMetaInfo = {
    title?: string
    titleTemplate?: () => string
  }

  interface ComponentOptions<V extends Vue> {
    metaInfo?: VueMetaInfo | (() => VueMetaInfo);
  }
}

